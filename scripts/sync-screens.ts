/**
 * sync-screens — capture real app screens from the design system's boards.
 *
 *   node scripts/sync-screens.ts            regenerate
 *   node scripts/sync-screens.ts --check    fail if regenerating would change anything
 *
 * Why this exists.
 *
 * The landing page used to draw its phone mockups from three hand-written React
 * components in components/screens/. They were built by reading the board and
 * guessing, and they were wrong — not stylistically, but structurally. The real
 * S2 groups 24 districts into 5 sections with a count line on each; the
 * hand-written one drew a flat numbered list. The real B1 resolves ཇ་ཁང་
 * (chhaa khang, "tea house"); the hand-written one invented ཀུ་ཤུ, "apple".
 *
 * The cause was that sync-design only ever read `_ds/<project>/tokens/`. The
 * export also carries `_ds_manifest.json` (51 real React components) and
 * `screens.json` (296 defined screens). Reimplementing any of that here would
 * put a second, drifting copy of the design system in this repo — and it is not
 * even possible: 22 of the 51 components ship only compiled inside
 * `_ds_bundle.js`, with no source on disk.
 *
 * So the page shows the design system's own render. The boards are static HTML
 * that mount those components through `<x-import>` custom elements, and they do
 * that correctly in headless Chromium from a file:// URL. We load the board, let
 * it mount, and photograph the frame.
 *
 * The PNGs are committed, like every other generated artefact here, so `next
 * build` never needs Playwright or the design system. See README's deployment
 * section: `verify` is the local gate, `build` is the deploy command.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(REPO, "public", "screens");
const OUT_TS = path.join(REPO, "content", "screens.generated.ts");
const CHECK = process.argv.includes("--check");

const DS_ROOT =
  process.env.TRUNGTRUNG_DS_PATH ?? path.resolve(REPO, "..", "design-system");

/** The frame size docs/04 mandates: 390×760, app bar 60, tab bar 76. */
const FRAME = { width: 390, height: 760 };

/** Retina. The phone renders at ~390 CSS px and may zoom; 3× stays crisp. */
const SCALE = 3;

type Screen = {
  /** Output basename and the key in the generated `screens` object. */
  id: string;
  /** Verbatim `data-screen-label` on the board. The join key — do not guess it. */
  label: string;
  /** Which board file carries it. */
  board: string;
  /** Why this screen is the one the page shows. */
  why: string;
};

const SCREENS: Screen[] = [
  {
    id: "journey",
    label: "S2 Journey Speak",
    board: "Board-Speak.dc.html",
    why: "The hero. The walk the page is about, before a word of it is claimed.",
  },
  {
    id: "exercise",
    label: "S7 Which one means",
    board: "Board-Speak.dc.html",
    why: "The journey section. What a stop actually asks you to do.",
  },
  // B1 First readable word was here until The Crossing section was cut. If that
  // section ever comes back, so does this: Board-Flows.dc.html, "B1 First
  // readable word". A capture with nowhere to appear is dead weight in git.
  {
    id: "card-found",
    label: "G4 Card found",
    board: "Board-Speak.dc.html",
    why: "The collection. Shows an artifact card instead of describing one.",
  },
];

/**
 * The board directory, found by structure rather than by name.
 *
 * sync-design has the same problem one level down and solves it the same way:
 * the design system's export directory is a project UUID that changes between
 * exports, so nothing here may hard-code a path.
 */
function findBoardDir(root: string): string | null {
  if (!fs.existsSync(root)) return null;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const dir = path.join(root, entry.name);
    if (
      fs.existsSync(path.join(dir, "screens.json")) &&
      fs.existsSync(path.join(dir, "Board-Index.dc.html"))
    ) {
      return dir;
    }
  }
  return null;
}

type Meta = { label: string; chip: string; decision: string; components: string[] };

function readScreenMeta(boardDir: string): Map<string, Meta> {
  const raw = JSON.parse(fs.readFileSync(path.join(boardDir, "screens.json"), "utf8"));
  const list: unknown = (raw as Record<string, unknown>).screens;
  if (!Array.isArray(list)) throw new Error("screens.json: expected a `screens` array");

  const out = new Map<string, Meta>();
  for (const item of list) {
    const s = item as Record<string, unknown>;
    if (typeof s.label !== "string") continue;
    out.set(s.label, {
      label: s.label,
      chip: typeof s.chip === "string" ? s.chip : "",
      decision: typeof s.decision === "string" ? s.decision : "",
      components: Array.isArray(s.components) ? (s.components as string[]) : [],
    });
  }
  return out;
}

/** Collapse a comment to one line and neutralise any `*​/` inside it. */
function safeComment(text: string): string {
  return text.replace(/\s+/g, " ").replace(/\*\//g, "*​/").trim();
}

async function main() {
  const boardDir = findBoardDir(DS_ROOT);
  if (!boardDir) {
    console.error(
      `sync-screens: no board directory under ${DS_ROOT}\n` +
        `Looked for a folder containing screens.json and Board-Index.dc.html.\n` +
        `Set TRUNGTRUNG_DS_PATH to the design-system repo root.`,
    );
    process.exit(1);
  }

  const meta = readScreenMeta(boardDir);
  for (const s of SCREENS) {
    if (!meta.has(s.label)) {
      // A renamed or retired screen must stop the build, not silently vanish.
      console.error(
        `sync-screens: screens.json has no screen labelled "${s.label}".\n` +
          `It was renamed or retired. Update SCREENS in scripts/sync-screens.ts.`,
      );
      process.exit(1);
    }
  }

  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1600, height: 1200 },
    deviceScaleFactor: SCALE,
  });

  const captured: Array<{ screen: Screen; meta: Meta; png: Buffer; digest: string }> = [];

  // One board load serves every screen on it.
  const byBoard = new Map<string, Screen[]>();
  for (const s of SCREENS) byBoard.set(s.board, [...(byBoard.get(s.board) ?? []), s]);

  for (const [board, screens] of byBoard) {
    const file = path.join(boardDir, board);
    if (!fs.existsSync(file)) {
      console.error(`sync-screens: missing board ${file}`);
      process.exit(1);
    }

    await page.goto(pathToFileURL(file).href, { waitUntil: "networkidle", timeout: 60_000 });

    // The board mounts its components through <x-import>. Photographing before
    // they resolve yields a screen full of holes, which is exactly the failure
    // this script exists to prevent — so wait for it, and say so if it fails.
    await page
      .waitForFunction(() => document.querySelectorAll("x-import").length === 0, null, {
        timeout: 30_000,
      })
      .catch(() => {
        console.error(
          `sync-screens: components never mounted in ${board}.\n` +
            `Some <x-import> elements are still unresolved; refusing to write a` +
            ` half-rendered screen.`,
        );
        process.exit(1);
      });
    await page.evaluate(() => document.fonts.ready);

    for (const screen of screens) {
      const frame = page.locator(`[data-screen-label="${screen.label}"] .scard`).first();
      if ((await frame.count()) === 0) {
        console.error(`sync-screens: "${screen.label}" not found on ${board}`);
        process.exit(1);
      }

      // A board is a wide canvas and a frame can sit thousands of pixels out in
      // either axis. page.screenshot clips against the viewport, so bring the
      // frame to the origin first and re-measure.
      await frame.evaluate((el) => el.scrollIntoView({ block: "start", inline: "start" }));
      await page.waitForTimeout(120);

      // Real screens are the full scroll — S2 is 3430px tall — so take the top
      // frame's worth. The others are already exactly 390×760.
      const box = await frame.boundingBox();
      if (!box) {
        console.error(`sync-screens: "${screen.label}" has no layout box`);
        process.exit(1);
      }

      const png = await page.screenshot({
        clip: {
          x: box.x,
          y: box.y,
          width: Math.min(box.width, FRAME.width),
          height: Math.min(box.height, FRAME.height),
        },
      });

      // A digest of what the frame *says*, not of the pixels. Pixel bytes shift
      // with any Chromium or font update, which would make --check cry wolf;
      // the rendered text and the frame's true height do not.
      const shape = await frame.evaluate((el) => {
        const inner = el.firstElementChild as HTMLElement | null;
        return {
          text: (inner?.innerText ?? "").replace(/\s+/g, " ").trim(),
          height: Math.round(inner?.getBoundingClientRect().height ?? 0),
        };
      });

      captured.push({
        screen,
        meta: meta.get(screen.label)!,
        png,
        digest: crypto
          .createHash("sha256")
          .update(`${shape.height}\n${shape.text}`)
          .digest("hex")
          .slice(0, 16),
      });
    }
  }

  await browser.close();

  const rows = captured
    .map(({ screen, meta: m, digest }) => {
      return [
        // Quoted: ids carry hyphens, which are not valid bare keys.
        `  ${JSON.stringify(screen.id)}: {`,
        `    src: "/screens/${screen.id}.png",`,
        `    width: ${FRAME.width},`,
        `    height: ${FRAME.height},`,
        `    chip: ${JSON.stringify(m.chip)},`,
        `    label: ${JSON.stringify(m.label)},`,
        `    digest: ${JSON.stringify(digest)},`,
        `    /* uses: ${safeComment(m.components.join(", ")) || "none"} */`,
        `    /* ${safeComment(m.decision).slice(0, 200)} */`,
        `  },`,
      ].join("\n");
    })
    .join("\n");

  const ts = `/* GENERATED FILE — DO NOT EDIT.
 *
 * Regenerate with:  npm run sync:screens
 * Verify with:      npm run sync:screens -- --check
 *
 * Photographed from the design system's own boards, so the phones on this page
 * show the real app rather than someone's memory of it. The mapping, and the
 * reason each screen was chosen, live in scripts/sync-screens.ts.
 *
 * \`digest\` is a hash of the frame's rendered text and height — not its pixels,
 * which move with every Chromium and font update.
 */

export const screens = {
${rows}
} as const;

export type ScreenId = keyof typeof screens;
`;

  const existingTs = fs.existsSync(OUT_TS) ? fs.readFileSync(OUT_TS, "utf8") : null;
  const stale = captured.filter(({ screen, png }) => {
    const f = path.join(OUT_DIR, `${screen.id}.png`);
    return !fs.existsSync(f) || fs.readFileSync(f).length !== png.length;
  });

  if (CHECK) {
    if (existingTs !== ts) {
      console.error(
        `sync-screens: content/screens.generated.ts is out of date.\nRun: npm run sync:screens`,
      );
      process.exit(1);
    }
    const missing = captured.filter(
      ({ screen }) => !fs.existsSync(path.join(OUT_DIR, `${screen.id}.png`)),
    );
    if (missing.length) {
      console.error(
        `sync-screens: missing ${missing.map((m) => m.screen.id).join(", ")}\n` +
          `Run: npm run sync:screens`,
      );
      process.exit(1);
    }
    console.log(`sync-screens: up to date (${captured.length} screens)`);
    return;
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const { screen, png } of captured) {
    fs.writeFileSync(path.join(OUT_DIR, `${screen.id}.png`), png);
  }
  fs.writeFileSync(OUT_TS, ts);

  console.log(
    `sync-screens: captured ${captured.length} screens at ${FRAME.width}×${FRAME.height}@${SCALE}x\n` +
      captured
        .map(
          ({ screen, meta: m, png }) =>
            `             ${screen.id.padEnd(11)} ${m.chip.padEnd(3)} ${String(
              Math.round(png.length / 1024),
            ).padStart(4)} KB  ${m.components.length} components`,
        )
        .join("\n") +
      (stale.length ? "" : "\n             (no pixel changes)"),
  );
}

main().catch((err) => {
  console.error(`sync-screens: ${(err as Error).message}`);
  process.exit(1);
});
