/**
 * sync-stats — recount the design system's content and write content/stats.generated.ts.
 *
 *   node scripts/sync-stats.ts            regenerate
 *   node scripts/sync-stats.ts --check    fail if regenerating would change anything
 *
 * Why this exists rather than typing the numbers into content/site.ts:
 * docs/02-product-spec.md has had its own figures wrong three times, and says
 * so — "Recount, never quote, this paragraph included." A landing page that
 * hard-codes "952 words" goes stale the first time a record is parked. So the
 * numbers are counted from the same JSON the app ships from.
 *
 * The source files run to megabytes. They are read at build time only; nothing
 * but the integers reaches the bundle.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(REPO, "content", "stats.generated.ts");
const CHECK = process.argv.includes("--check");

const DS_ROOT =
  process.env.TRUNGTRUNG_DS_PATH ?? path.resolve(REPO, "..", "design-system");

type Counter = {
  /** Key in the generated `stats` object. */
  key: string;
  /** Path relative to the design system's content/ directory. */
  from: string;
  /** Pull the count out of the parsed JSON. */
  count: (data: unknown) => number;
  /** Emitted as a comment so a reader can see where the number came from. */
  note: string;
};

const COUNTERS: Counter[] = [
  {
    key: "vocabulary",
    from: "vocabulary.json",
    count: (d) => len(d),
    note: "words on the Speak track, both walks",
  },
  {
    key: "phrases",
    from: "phrases.json",
    count: (d) => len(d),
    note: "phrases, drilled whole",
  },
  {
    key: "speakStops",
    from: "stops.json",
    count: (d) => len(d),
    note: "lesson stops across both walks",
  },
  {
    key: "districts",
    from: "circuit-manifest.json",
    count: (d) => Object.keys(obj(at(d, "districts"))).length,
    note: "places on the journey",
  },
  {
    key: "collections",
    from: "collections.json",
    count: (d) => len(d),
    note: "card collections",
  },
  {
    key: "cards",
    from: "collections.json",
    count: (d) => arr(d).reduce<number>((n, c) => n + len(at(c, "cards")), 0),
    note: "cultural cards found along the way",
  },
  {
    key: "letters",
    from: "json/read/letters.json",
    count: (d) => len(at(d, "letters")),
    note: "uchen consonants and vowel marks",
  },
  {
    key: "stacks",
    from: "json/read/stacks.json",
    count: (d) => len(at(d, "stacks")),
    note: "stacked combinations",
  },
  {
    key: "syllables",
    from: "json/read/syllables.json",
    count: (d) => len(at(d, "syllables")),
    note: "syllables built from them",
  },
  {
    key: "readStops",
    from: "json/read/stops.json",
    count: (d) => len(at(d, "stops")),
    note: "stops on the Read track",
  },
  {
    key: "readSections",
    from: "read/sections.json",
    count: (d) => len(at(d, "sections")),
    note: "sections in the Printing House",
  },
  {
    key: "readableWords",
    from: "json/read/words.json",
    count: (d) => len(at(d, "words")),
    note: "words readable by the end of the Read track",
  },
];

/* Narrowing helpers. The design system's JSON has no schema this repo can
 * import, so each access states what it expects and fails loudly when the shape
 * moves — which is the point: a silently wrong number is the failure mode. */

function len(v: unknown): number {
  if (Array.isArray(v)) return v.length;
  if (typeof v === "number") return v;
  throw new Error(`expected an array or number, got ${typeof v}`);
}

function obj(v: unknown): Record<string, unknown> {
  if (typeof v !== "object" || v === null || Array.isArray(v)) {
    throw new Error(`expected an object, got ${Array.isArray(v) ? "array" : typeof v}`);
  }
  return v as Record<string, unknown>;
}

function arr(v: unknown): unknown[] {
  if (!Array.isArray(v)) throw new Error(`expected an array, got ${typeof v}`);
  return v;
}

function at(v: unknown, key: string): unknown {
  return obj(v)[key];
}

function main() {
  const contentDir = path.join(DS_ROOT, "content");
  if (!fs.existsSync(contentDir)) {
    console.error(
      `sync-stats: design-system content not found at ${contentDir}\n` +
        `Set TRUNGTRUNG_DS_PATH to the design-system repo root.`,
    );
    process.exit(1);
  }

  const cache = new Map<string, unknown>();
  const rows: Array<{ key: string; value: number; note: string; from: string }> = [];

  for (const c of COUNTERS) {
    const file = path.join(contentDir, c.from);
    if (!cache.has(file)) {
      if (!fs.existsSync(file)) {
        // Failing loudly beats shipping a stale number silently.
        console.error(`sync-stats: missing source ${file}`);
        process.exit(1);
      }
      cache.set(file, JSON.parse(fs.readFileSync(file, "utf8")));
    }
    try {
      rows.push({
        key: c.key,
        value: c.count(cache.get(file)),
        note: c.note,
        from: c.from,
      });
    } catch (err) {
      console.error(`sync-stats: counting ${c.key} from ${c.from}: ${(err as Error).message}`);
      process.exit(1);
    }
  }

  const width = Math.max(...rows.map((r) => `${r.key}: ${r.value},`.length));
  const body = rows
    .map((r) => `  ${`${r.key}: ${r.value},`.padEnd(width)} // ${r.note} (${r.from})`)
    .join("\n");

  const out = `/* GENERATED FILE — DO NOT EDIT.
 *
 * Regenerate with:  npm run sync:stats
 * Verify with:      npm run sync:stats -- --check
 *
 * Counted from the design system's own content JSON, because docs/02 says to
 * recount and never quote. The mapping lives in scripts/sync-stats.ts.
 */

export const stats = {
${body}
} as const;

export type Stats = typeof stats;
`;

  const existing = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : null;

  if (CHECK) {
    if (existing !== out) {
      console.error(
        `sync-stats: content/stats.generated.ts is out of date.\nRun: npm run sync:stats`,
      );
      process.exit(1);
    }
    console.log(`sync-stats: up to date (${rows.length} counts)`);
    return;
  }

  if (existing === out) {
    console.log(`sync-stats: no changes (${rows.length} counts)`);
    return;
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, out);
  console.log(
    `sync-stats: wrote ${rows.length} counts to content/stats.generated.ts\n` +
      rows.map((r) => `             ${r.key.padEnd(14)} ${r.value}`).join("\n"),
  );
}

main();
