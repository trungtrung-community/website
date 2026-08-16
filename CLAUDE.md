# Working in this repo

The marketing landing page for **Trungtrung**, an app teaching spoken Lhasa
Tibetan and the uchen script. Next.js 16 (App Router) · React 19 · TypeScript ·
Tailwind v4.

**The design system at `../design-system` is the source of truth for anything
visual, and for the rules this page obeys.** This repo consumes it; it never
redefines it. `README.md` covers the human-facing detail — deployment, editing
guide, pipeline internals. This file is the operating manual.

---

## Hard invariants

Breaking one of these makes a change *wrong*, not merely untidy.

1. **Never hand-edit a colour, size, radius, shadow, font or easing.** They are
   synced from the design system. If a value has no token, the fix is to add the
   token upstream — not to write a literal here.
2. **Never edit a file with a do-not-edit header.** `styles/theme.generated.css`,
   `styles/tokens/*`, `content/stats.generated.ts` and `styles/tokens.lock.json`
   are all generated. To change how a token maps, edit `scripts/token-map.ts`
   and re-run `npm run sync:design`.
3. **Never type a number into copy.** `docs/02` in the design system says
   "Recount, never quote" — its own figures have been wrong three times. Counts
   come from `content/stats.generated.ts` via `npm run sync:stats`. Need a new
   one? Add a counter to `COUNTERS` in `scripts/sync-stats.ts`.
4. **All user-facing copy lives in `content/site.ts`.** Components contain no
   prose. A wording change must never require touching JSX.
5. **Every element containing Tibetan goes through `TibetanText`**, and `roman`
   is required. It carries the design system's contract for the script:
   line-height 2.1, the Tibetan size ramp, no letter-spacing, breaking only at a
   tsheg, 34ch measure, and the romanization as the accessible name (never THL).
6. **Two button skins exist** — teal primary and ghost. A third is a
   design-system change, not a component change.
7. **Light mode only.** Do not add `prefers-color-scheme` or a dark palette. The
   design system has `"themes": []` by intent.

---

## The never-do list governs this page

`docs/01-vision.md` in the design system carries a never-do list. Thosam was
asked directly and ruled that it binds this page too, not just the app — he
chose it over giving marketing more latitude, knowing it ruled out the reference
page he liked. Do not propose "it's just marketing" exceptions.

`npm run check:adherence` catches the mechanical half (raw hex, hairline
borders, literal shadow colours, `--board-*`, emoji, exclamation marks in copy,
loss framing, the palette codename). It scans `app/`, `components/`, `content/`,
`lib/` and `styles/`.

Suspend a rule only in place, with a reason:

```ts
// adherence-allow: raw-hex — the theme-color meta tag cannot resolve a var()
```

**The rules the checker cannot see are the ones you will break:**

- One brand colour. Crane reds and oranges belong to the crane artwork.
- One full-bleed accent panel on the whole page — spent on The Crossing
  (`tone="accent"`). Do not add a second.
- Teal is the loudest thing at **one place per view**. Two competing teal
  buttons means one is wrong. This is why the header CTA is a ghost.
- The crane appears exactly **three times** — hero, The Crossing, the close. At
  rest, never wallpaper, never recoloured, rotated or skewed. `Crane.tsx` is the
  only way to draw it, deliberately, so the budget stays countable.
- Surfaces separate by **fill value**, never hairlines or drop shadows.
- Sentence case everywhere. **Zero exclamation marks** (the product's single
  permitted one belongs to app screen S9). No emoji.
- The rail is the **only** scroll motion. Do not add reveal animations.
- Never reduce opacity below 1 — faded UI reads as broken next to flat art.
- A not-yet state is a hollow dotted waymark, never a padlock.

---

## Common changes → where to go

| Task | File |
|---|---|
| Change any wording | `content/site.ts` |
| Change a figure | don't — `npm run sync:stats`, then `stats.*` |
| Change a colour / size / radius | the design system, then `npm run sync:design` |
| Change how a token maps to Tailwind | `scripts/token-map.ts` |
| Add / reorder a section | `components/sections/` + `app/page.tsx` |
| Change what a phone shows | `components/screens/` |
| Waitlist provider | `lib/waitlist.ts` (one function) |
| Flip to store badges | `launch` in `content/site.ts` |
| Add a logo when one exists | `components/Wordmark.tsx` |

Adding a section: use the `Section` primitive, give it an `id`, put its copy in
`content/site.ts`, and **alternate the `bow` prop** (`left` / `right`) against
its neighbours so the kora rail keeps winding. If it belongs in the nav, add it
to `nav.links` — the footer reuses that list so a destination keeps one name.

---

## Repo map

| Path | |
|---|---|
| `app/page.tsx` | Composes the sections, nothing else |
| `app/layout.tsx` | Fonts, metadata, `metadataBase` |
| `app/api/waitlist/route.ts` | The one dynamic route |
| `components/sections/` | One file per section |
| `components/screens/` | Three hand-built app screens + `PhoneFrame` |
| `components/rail/KoraRail.tsx` | The rail segments and waymarks |
| `components/primitives/` | `Button`, `Card`, `Section`, `TibetanText` |
| `content/site.ts` | Every word, plus the launch switch |
| `content/stats.generated.ts` | Generated counts |
| `styles/tokens/` | Verbatim mirror of the design system (generated) |
| `styles/theme.generated.css` | The Tailwind theme (generated) |
| `styles/base.css` | The design system's base rules, adapted |
| `styles/site.css` | Layout primitives the design system has no token for |
| `scripts/` | sync-design, sync-stats, check-adherence, token-map |

Scripts are plain `.ts` run directly by Node's type stripping — no `tsx`
dependency. `scripts/package.json` scopes them to ESM.

---

## Verification gate

Before claiming anything works:

```bash
npm run verify      # typecheck + lint + adherence + both sync --check
npm run build
```

Running neither and asserting success is not acceptable here. If you changed
anything visual, also look at it — start `npm run dev` and check at 320, 390,
768 and 1440 for horizontal overflow.

---

## Gotchas

- **`npm run verify` needs the design-system repo present.** Both sync
  `--check`s exit 1 without it. That is correct behaviour, not a bug — but it
  means verify must never be the CI or deploy command. Deploy with
  `npm run build`; the CI-safe subset is
  `typecheck && lint && check:adherence && build`.
- **The build works with the design system absent** — tokens are vendored and
  the theme is committed. That is why the generated files are in git.
- **The design system's export directory is a project UUID that changes**
  between exports. `findTokensDir()` matches on structure. Never hard-code it.
- **Tailwind v4 namespace collisions are real.** The design system's semantic
  text colours map to `--color-fg-*` because `--text-*` is Tailwind's font-size
  namespace. Similarly `--font-display` (family) and `--font-weight-display`
  would both produce `font-display`, so use the `type-*` utilities rather than a
  bare `font-display` class.
- **Two utilities setting `font-size` in the same layer** resolve by Tailwind's
  sort order, not source order. That is why the responsive heading roles
  (`hero-title`, `section-title`) carry their breakpoints internally in
  `styles/site.css` instead of being composed from `type-display text-4xl`.
- **Never emit `*/` inside a generated CSS comment** — it terminates the comment
  early and spills the rest of the file into the stylesheet. `safeComment()` in
  `sync-design.ts` guards this.
- **Grid and flex children need `min-w-0`** where a phone frame or Tibetan sits
  inside them, or the column is forced wider than the viewport.
- **CSS cannot divide a length by a length**, so `calc(100cqw / 390)` is not a
  number and cannot drive `scale`. `PhoneFrame` uses `zoom` at two breakpoints
  instead.

---

## Context worth having

The app has **not shipped**. As of 2026-08-16 there was no application code in
any repo and ~1,830 voice recordings were the critical path. The page therefore
ships as a waitlist, with a one-field switch to store badges. Thosam expected to
launch around 2026-08-30 — if the switch is still on `"waitlist"` well after
that, ask rather than assume either way.

The founder note in `content/site.ts` is a **placeholder** flagged
`draft: true`. The vision doc's own founder paragraph is explicitly marked
"written by Claude, to be replaced, not kept" and must not be lifted into
marketing.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
