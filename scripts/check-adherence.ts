/**
 * check-adherence — the never-do list, enforced.
 *
 *   node scripts/check-adherence.ts
 *
 * The design system ships `_adherence.oxlintrc.json`, a lint contract wired
 * into its own CI before any code was written. This is the same idea for the
 * website: the rules in docs/01 and docs/04 govern this page, and a rule that
 * is only written down is a rule that drifts.
 *
 * An exception needs a reason, in place:
 *
 *   themeColor: "#EDF2F3", // adherence-allow: raw-hex — meta theme-color cannot take a var()
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Directories walked. Generated and vendored files are the source of truth for
 *  raw values and are deliberately not scanned. */
const ROOTS = ["app", "components", "content", "lib", "styles"];
const SKIP = new Set([
  path.join("styles", "tokens"),
  path.join("styles", "theme.generated.css"),
  path.join("content", "stats.generated.ts"),
]);

type Rule = {
  id: string;
  why: string;
  /** Return the offending text for a line, or null. */
  test: (line: string, file: string) => string | null;
};

/* Tibetan is U+0F00–U+0FFF and must never be caught here. These ranges are
 * pictographic emoji and dingbats only. */
const EMOJI =
  /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{1F1E6}-\u{1F1FF}\u{2B00}-\u{2BFF}]/u;

/** String literal contents on a line, so prose rules do not fire on code. */
function literals(line: string): string[] {
  const out: string[] = [];
  const re = /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'|`([^`\\]*(?:\\.[^`\\]*)*)`/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) out.push(m[1] ?? m[2] ?? m[3] ?? "");
  return out;
}

const RULES: Rule[] = [
  {
    id: "raw-hex",
    why: "every colour comes from a token; if a value has no token, add the token",
    test: (line) => line.match(/#[0-9a-fA-F]{3,8}\b/)?.[0] ?? null,
  },
  {
    id: "hairline-border",
    why: "the system separates surfaces by fill value; `1px solid` appears nowhere in it",
    test: (line) => {
      // The focus ring is an outline and is mandated at 3px solid; outlines sit
      // outside the box and separate nothing, so they are not this rule's business.
      if (/\boutline\b/.test(line)) return null;
      return line.match(/\bborder[\w-]*\s*:\s*[^;]*?\d+px\s+solid\b/)?.[0] ?? null;
    },
  },
  {
    id: "literal-shadow",
    why: "shadows come from --shadow-* / --edge-* tokens, never a hand-written colour",
    test: (line) => {
      if (!/box-shadow|boxShadow/.test(line)) return null;
      return line.match(/(?:box-shadow|boxShadow)[^;]*?(?:#[0-9a-fA-F]{3,8}|rgba?\()/)?.[0] ?? null;
    },
  },
  {
    id: "board-token",
    why: "--board-* are documentation surfaces and are never product UI",
    test: (line) => line.match(/--board-[\w-]+/)?.[0] ?? null,
  },
  {
    id: "palette-codename",
    why: "the design system states the palette codename is never user-facing text",
    test: (line) => (/High Plateau/.test(line) ? "High Plateau" : null),
  },
  {
    id: "emoji",
    why: "no emoji, ever — the mascot carries all the warmth this product needs",
    test: (line) => line.match(EMOJI)?.[0] ?? null,
  },
  {
    id: "exclamation",
    why: "at most one exclamation mark in the whole product, and S9 owns it",
    test: (line, file) => {
      if (!file.startsWith("content" + path.sep)) return null;
      for (const s of literals(line)) if (s.includes("!")) return s.slice(0, 60);
      return null;
    },
  },
  {
    id: "loss-framing",
    why: "no guilt or loss framing anywhere, including notifications",
    test: (line, file) => {
      if (!file.startsWith("content" + path.sep)) return null;
      const banned = /\b(don't lose|lose your|streak freeze|you failed|keep missing|last chance|hurry)\b/i;
      for (const s of literals(line)) {
        const hit = s.match(banned);
        if (hit) return hit[0];
      }
      return null;
    },
  },
];

function* walk(dir: string): Generator<string> {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(REPO, full);
    if (SKIP.has(rel)) continue;
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(ts|tsx|css)$/.test(entry.name)) yield full;
  }
}

type Finding = { file: string; line: number; rule: Rule; text: string };

const findings: Finding[] = [];
let scanned = 0;

for (const root of ROOTS) {
  const dir = path.join(REPO, root);
  if (!fs.existsSync(dir)) continue;

  for (const file of walk(dir)) {
    const rel = path.relative(REPO, file);
    const lines = fs.readFileSync(file, "utf8").split("\n");
    scanned++;

    lines.forEach((line, i) => {
      // An exception is honoured on its own line or the line above it, and must
      // name the rule it suspends.
      const context = `${lines[i - 1] ?? ""}\n${line}`;

      for (const rule of RULES) {
        if (context.includes(`adherence-allow: ${rule.id}`)) continue;
        const hit = rule.test(line, rel);
        if (hit) findings.push({ file: rel, line: i + 1, rule, text: hit.trim() });
      }
    });
  }
}

if (findings.length === 0) {
  console.log(
    `check-adherence: clean — ${scanned} files, ${RULES.length} rules from docs/01 and docs/04`,
  );
  process.exit(0);
}

const byRule = new Map<string, Finding[]>();
for (const f of findings) byRule.set(f.rule.id, [...(byRule.get(f.rule.id) ?? []), f]);

console.error(`check-adherence: ${findings.length} violation(s) across ${scanned} files\n`);
for (const [id, group] of byRule) {
  console.error(`  ${id} — ${group[0].rule.why}`);
  for (const f of group) console.error(`      ${f.file}:${f.line}  ${f.text}`);
  console.error("");
}
console.error(
  "Fix these, or suspend one in place with a comment naming the rule:\n" +
    "  // adherence-allow: <rule-id> — why this case is genuinely different",
);
process.exit(1);
