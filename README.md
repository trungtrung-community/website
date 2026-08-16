# Trungtrung — landing page

Marketing site for **Trungtrung**, an app that teaches spoken Lhasa Tibetan and
the uchen script.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4.

**The visual system is not authored here.** Colours, type, spacing, radii,
shadows and motion all come from the design-system repo and are pulled in by a
script. Change them there, run `npm run sync:design`, and the page follows. If
you find yourself typing a hex code into this repo, something has gone wrong.

---

## Contents

- [Quick start](#quick-start)
- [Commands](#commands)
- [How the page is put together](#how-the-page-is-put-together)
- [The design pipeline](#the-design-pipeline)
- [Numbers are counted, never typed](#numbers-are-counted-never-typed)
- [Editing the page](#editing-the-page)
- [Deployment](#deployment)
- [The rules](#the-rules)
- [Known gaps](#known-gaps)

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

Requires **Node 20.9+** (Next 16's floor). npm is the only package manager set
up on this machine — there is no pnpm, yarn or corepack, so `package-lock.json`
is the lockfile that matters.

The site **builds without the design-system repo present**: the tokens are
vendored into `styles/tokens/`, the generated theme is committed, and the mascot
lives in `public/mascot/`. You only need the sibling repo to *re-sync*.

By default the design system is expected at `../design-system`. Point
`TRUNGTRUNG_DS_PATH` somewhere else if yours lives elsewhere.

---

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on :3000 |
| `npm run build` | Production build — **this is the deploy command** |
| `npm run start` | Serve a production build |
| `npm run sync:design` | Pull tokens and mascot assets from the design system |
| `npm run sync:stats` | Recount the content JSON into `content/stats.generated.ts` |
| `npm run sync:screens` | Photograph the app screens from the design system's boards |
| `npm run sync` | All three syncs |
| `npm run check:adherence` | Enforce the never-do list |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run verify` | typecheck + lint + adherence + all three sync `--check`s |

`npm run verify` is the local gate before committing. It needs the
design-system repo present and Playwright installed — see [Deployment](#deployment) for why that means it
must not be your CI command.

---

## How the page is put together

The page is a **kora**: one teal rail runs its whole length, drawing as you
scroll, with each section hung off a waymark. `components/rail/KoraRail.tsx`
renders one segment per section; every segment enters and leaves at the centre
of the rail lane, so segments join seamlessly whatever height a section turns
out to be. No measurement, no JavaScript, no layout effect.

Sections in page order, as composed in `app/page.tsx`:

| # | Section | File | Anchor |
|---|---|---|---|
| — | Header | `sections/Header.tsx` | — |
| 1 | Hero | `sections/Hero.tsx` | — |
| 2 | Why I am building this | `sections/Note.tsx` | `#why` |
| 3 | What you learn | `sections/Tracks.tsx` | `#two-tracks` |
| 4 | How it works | `sections/Journey.tsx` | `#the-walk` |
| 5 | Tibetan culture | `sections/Collection.tsx` | `#collection` |
| 6 | What will not change | `sections/Principles.tsx` | `#how-its-built` |
| 7 | Questions | `sections/Faq.tsx` | `#faq` |
| 8 | Join the walk | `sections/Join.tsx` | `#join` |
| — | Footer | `sections/Footer.tsx` | — |

**Why comes second on purpose** — the page follows Sinek, so the reason arrives
before the feature list and everything after it reads as evidence.

The rail is straight and the segments stack, so adding or reordering a section
needs no other change. It bowed left and right until 2026-08-16; that looked
like a stray pencil line and was cut.

**No section currently uses `tone="accent"`.** The design system allows one
full-bleed panel in a whole product. The Crossing held it until that section was
cut; one section may claim it, never two.

### The three app screens

The phones show **the design system's own screens**, photographed from the
boards by `npm run sync:screens`.

| Id | Board screen | Shows |
|---|---|---|
| `journey` | S2 | 24 districts in 5 sections, on the head rail |
| `exercise` | S7 | A word check: Tibetan prompt, four English options |
| `card-found` | G4 | An artifact card found at the end of a stop |

They used to be hand-written React re-creations, and every one was wrong — not
in styling but in structure. The hand-drawn journey listed districts flat where
the real S2 groups them into sections with a count line on each; the hand-drawn
crossing invented ཀུ་ཤུ ("apple") where the real B1 resolves ཇ་ཁང་ ("tea
house"). The cause was that `sync:design` only ever read `tokens/`, so the 51
components and 296 screens in the same export went unnoticed.

Reimplementing them here was never the right shape — and is not even possible:
**22 of the 51 components ship only compiled inside `_ds_bundle.js`**, with no
source on disk.

Captures are 390×760 at 3×, committed to `public/screens/`.
`PhoneFrame` shrinks the whole frame with CSS `zoom` at two breakpoints
(`0.76` below 30rem, `0.58` below 23.5rem) — `zoom` rather than
`transform: scale()` because zoom reflows, so the frame keeps its real height.

---

## The design pipeline

```
design-system/Trungtrung app - all screens/_ds/<project>/tokens/*.css
            │
            │  npm run sync:design
            ▼
styles/tokens/*.css          verbatim mirror, for diffing an upstream change
styles/theme.generated.css   Tailwind v4 @theme + @utility + :root  ← what ships
public/mascot/*.png          the crane
styles/tokens.lock.json      source hashes, for drift detection
```

**To change how a token maps into Tailwind, edit `scripts/token-map.ts`.** It is
the only place token names are decided; the sync script reads it and nothing
else hard-codes a name. Generated files carry a do-not-edit header and mean it.

Three mappings are worth knowing:

- The design system's semantic **text colours** (`--text-heading`, `--text-body`,
  …) become `--color-fg-*`, because Tailwind v4 reserves the `--text-*`
  namespace for font sizes and `typography.css` already owns it. So the utility
  is `text-fg-heading`, not `text-text-heading`.
- **`--board-*` tokens are dropped.** The design system marks them board and
  specimen chrome, never product UI.
- The composed `--type-*` roles become both an `@utility` (`type-body`) and a
  plain variable, so the `font:` shorthand the design system writes keeps
  working.

Every token is also re-aliased under its **original design-system name**, so CSS
or a component copied out of the design system works here verbatim.

`var()` chains are deliberately not flattened. Keeping the primitive → semantic
layering is what makes a palette change a one-line edit upstream.

### Drift detection

`npm run sync:design -- --check` exits non-zero if regenerating would change
anything — i.e. if someone hand-edited a generated file, or if the design system
moved and nobody re-synced. It is part of `npm run verify`.

The design system's export directory is named after a project UUID that changes
between exports, so the script matches on structure rather than on the name.
Never hard-code that path.

---

## Numbers are counted, never typed

`docs/02-product-spec.md` in the design system says, twice, *"Recount, never
quote"* — its own figures have been wrong three times. So every figure on this
page comes from `content/stats.generated.ts`, counted by `scripts/sync-stats.ts`
from the same JSON the app ships from.

```ts
import { stats } from "@/content/stats.generated";
stats.vocabulary   // 952
stats.districts    // 24
stats.letters      // 44
```

**Do not type a count into `content/site.ts`.** If you need a new one, add a
counter to `COUNTERS` in `scripts/sync-stats.ts` and re-run the script. The
source files run to megabytes; they are read at build time only, and nothing but
the integers reaches the bundle.

---

## Editing the page

### Change a word

`content/site.ts`. That is the only file with user-facing prose in it —
components hold none, by design, so wording changes never mean touching JSX.

```ts
export const hero = {
  eyebrow: "Coming soon",
  heading: ["Walk through Tibet.", "Learn what to say at every stop."],
  …
};
```

Copy must obey the voice rules — sentence case, no emoji, **zero exclamation
marks**, no guilt framing. `npm run check:adherence` will tell you if you slip.

### Change a number

Don't. Run `npm run sync:stats` and use `stats.*`. See above.

### Change a colour, size, radius or shadow

Change it in the **design system**, then:

```bash
npm run sync:design
```

Everything derived follows. Changing `--teal-600` upstream moves the CTA, the
active rail node, the focus ring and the tab indicator in one step.

### Add or reorder a section

1. Add `components/sections/YourSection.tsx`, using the `Section` primitive:

```tsx
<Section
  id="your-anchor"
  eyebrow="Short label"
  heading={yourContent.heading}
  body={yourContent.body}
  bow="right"          // alternate with its neighbours
>
  …
</Section>
```

2. Put its copy in `content/site.ts`.
3. Add it to `app/page.tsx` in the right place.
4. **Alternate the `bow`** so the rail keeps winding.
5. If it should appear in the nav, add it to `nav.links` — the footer reuses
   that same list, so a destination keeps one name everywhere.

### Swap what a phone shows

Pick a different screen from the board. Add it to `SCREENS` in
`scripts/sync-screens.ts` — `label` must match the board's `data-screen-label`
exactly, and the script fails loudly if `screens.json` has no such screen.

```ts
{
  id: "session-end",
  label: "S8 Session end",
  board: "Board-Speak.dc.html",
  why: "What you can say by the end of a stop.",
}
```

Then `npm run sync:screens`, and use it:

```tsx
<PhoneFrame screen="session-end" label="What this screen shows, for a reader" />
```

To browse what is available, `screens.json` in the board folder lists all 296
with their labels and rationale. The `label` prop is required and becomes the
accessible name — the image itself is announced as one thing, not as a pile of
decorative text.

**Do not hand-write a screen.** If a screen is wrong, it is wrong in the design
system, and fixing it there fixes it everywhere.

### Add Tibetan anywhere

Always through `TibetanText`, and `roman` is required:

```tsx
<TibetanText roman="phööcha" size="lg">བོད་ཇ</TibetanText>
```

It enforces the design system's contract for the script: line-height 2.1 so
stacked marks never collide, the separate Tibetan size ramp, no letter-spacing,
breaking only after a tsheg, a 34ch measure, and the romanization as the
accessible name (never THL). A screen reader handed raw uchen with an English
voice produces noise, which is why `roman` is not optional.

For the full naming triple — Tibetan, then romanization, then English gloss —
use `NamingTriple` from the same file.

### Flip to launched

```ts
// content/site.ts
export const launch = {
  status: "launched",
  appStoreUrl: "https://apps.apple.com/…",
  playStoreUrl: "https://play.google.com/…",
};
```

Every call to action on the page becomes store links instead of the email form.
No other file changes.

---

## Deployment

`/api/waitlist` is a dynamic route, so this is **not** a static export — it
needs a Node runtime. Vercel is the least setup; any Node host works.

### Settings

| | |
|---|---|
| Build command | `npm run build` |
| Install command | `npm install` |
| Output | `.next` (default) |
| Node version | 20.9+ |

### Do not use `npm run verify` as your CI or build command

`verify` includes `sync:design -- --check` and `sync:stats -- --check`, both of
which need the **design-system repo** sitting next to this one. A build server
never has it, so verify will always fail there — and the tempting "fix" is to
delete the drift check, which is the one thing keeping the theme honest.

Verified behaviour with the design system absent:

| Command | Result |
|---|---|
| `npm run build` | passes |
| `npm run typecheck` | passes |
| `npm run lint` | passes |
| `npm run check:adherence` | passes (reads only this repo) |
| `npm run sync:design -- --check` | **fails** — cannot find the design system |
| `npm run sync:stats -- --check` | **fails** — same |

If you want a CI check, use the subset that does not need the sibling repo:

```bash
npm run typecheck && npm run lint && npm run check:adherence && npm run build
```

Run the full `npm run verify` locally, where the design system exists.

### Environment variables

From `.env.example`:

```
RESEND_API_KEY=
RESEND_AUDIENCE_ID=
```

Without them, `lib/waitlist.ts` logs in development and **fails loudly in
production** (502) rather than silently dropping an address. Set both in the
host's environment settings before launch.

### Domain

`site.domain` in `content/site.ts` feeds `metadataBase` in `app/layout.tsx`,
which is what makes the Open Graph image URL absolute. Changing the domain is
that one field.

Check the share card renders at `/opengraph-image` — it fetches Gabarito and
Noto Serif Tibetan from Google at build time, with a fallback face if the fetch
fails, so a plain card means the fetch did not succeed.

### Pre-launch checklist

- [ ] `npm run verify` passes locally
- [ ] `npm run build` passes
- [ ] `RESEND_API_KEY` and `RESEND_AUDIENCE_ID` set in the host
- [ ] Submit a real address and confirm it lands in the Resend audience
- [ ] `/opengraph-image` renders with both fonts
- [ ] `site.domain` matches the live domain
- [ ] Founder note replaced with Thosam's words (see [Known gaps](#known-gaps))
- [ ] When the app is live: flip `launch.status` and fill the two store URLs

---

## The rules

`docs/01-vision.md` in the design system carries a **never-do list**. Thosam
ruled that it governs this page as well as the app — the page and the product
have to read as one thing.

`npm run check:adherence` enforces the mechanical half across every `.ts`,
`.tsx` and `.css` file: no raw hex, no hairline borders, no hand-written shadow
colours, no `--board-*`, no emoji, no exclamation marks in copy, no loss
framing, and the palette codename never appearing as text.

An exception needs a reason, in place:

```ts
// adherence-allow: raw-hex — the theme-color meta tag cannot resolve a var()
themeColor: "#EDF2F3",
```

The rules the checker **cannot** see, which still hold:

- **One brand colour.** The crane's reds and oranges belong to the crane.
- **At most one full-bleed accent panel** on the whole page. Currently unspent.
- **Teal is the loudest thing at one place per view.** That is why the header's
  call to action is a ghost and not a button.
- **The crane appears twice** — the hero and the close. Count the ones inside
  captured screens too. At rest,
  never as wallpaper, never recoloured, never rotated.
- **Two button skins only**, teal primary and ghost. A third is a design-system
  change, not a component change.
- **Light mode only.** The design system has no dark theme by intent.
- **The rail is the only scroll motion.** Nothing else fades or slides in.

---

## Known gaps

- **The founder note is drafted from Thosam's words but not signed off.** `note`
  in `content/site.ts` is still flagged `draft: true`. The vision doc's own
  founder paragraph carries an explicit *"written by Claude, to be replaced, not
  kept"* marker and is not used. Clear the flag once the wording is approved.
- **Artifact illustrations are not drawn yet.** `docs/10` in the design system
  says the board's illustration slots are placeholders, so the card in the G4
  capture shows a flat ink block where the churn should be. Nothing to fix here:
  draw them upstream and `npm run sync:screens` picks them up. This is the
  argument for the pipeline in one line.
- **`Noto Sans Tibetan` is not published on Google Fonts.** The design system
  names it first in `--font-tibetan`, so the board has always fallen back to
  `Noto Serif Tibetan`. This site loads the serif to match, and leaves the sans
  first in the stack so it takes over if it is ever self-hosted. Worth fixing
  upstream.
- **No logo file exists.** The wordmark is set type (Gabarito 800).
  `components/Wordmark.tsx` is the one file to change when there is one.
- **Rate limiting is in-memory and per-instance** (`app/api/waitlist/route.ts`).
  Enough to blunt a script, not a real limiter. Move it to the platform's edge
  if this ever gets serious traffic.
