# Trungtrung — landing page

Marketing site for Trungtrung, a Tibetan language-learning app.
Next.js 16 · React 19 · TypeScript · Tailwind CSS v4.

The visual system is not defined here. It is **synced from the design-system
repo** by a script, so a colour, a type size or a radius is changed there and
pulled in — never edited by hand in this repo.

## Running it

```bash
npm install
npm run dev
```

The site builds without the design-system repo present: the tokens are vendored
and the generated theme is committed. You only need the design system to re-sync.

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

| Command | What it does |
|---|---|
| `npm run sync:design` | Pull tokens and mascot assets from the design system |
| `npm run sync:stats` | Recount the content JSON into `content/stats.generated.ts` |
| `npm run sync` | Both |
| `npm run check:adherence` | Enforce the never-do list (see below) |
| `npm run verify` | Typecheck, lint, adherence, and both sync `--check`s |

The design system is found at `../design-system`, or wherever
`TRUNGTRUNG_DS_PATH` points.

**To change how a token maps into Tailwind, edit `scripts/token-map.ts`.** That
file is the only place token names are decided; the sync script reads it and
nothing else hard-codes a name. Generated files carry a do-not-edit header.

Two mappings are worth knowing about:

- The design system's semantic text colours (`--text-heading`, `--text-body`, …)
  become `--color-fg-*`, because Tailwind v4 reserves the `--text-*` namespace
  for font sizes and `typography.css` already owns it. So the utility is
  `text-fg-heading`.
- `--board-*` tokens are dropped. The design system marks them board and
  specimen chrome, never product UI.

Every token is also re-aliased under its original design-system name, so CSS or
a component copied out of the design system works here verbatim.

### Numbers are counted, never typed

`docs/02-product-spec.md` in the design system says, twice, *"Recount, never
quote"* — its own figures have been wrong three times. So the page's numbers
come from `content/stats.generated.ts`, counted from the same JSON the app
ships from. Do not type a count into `content/site.ts`.

## Where things live

| Path | |
|---|---|
| `content/site.ts` | **Every word on the page**, plus the launch switch |
| `content/stats.generated.ts` | Generated counts |
| `components/sections/` | One file per section, composed in `app/page.tsx` |
| `components/screens/` | The three app screens, hand-built from the same tokens |
| `components/rail/` | The kora rail that threads the page together |
| `components/primitives/` | Button, Card, Section, TibetanText |
| `styles/site.css` | Layout primitives the design system has no token for |
| `scripts/` | The sync and adherence scripts |

Copy lives in `content/site.ts` and nowhere else — changing wording should never
mean touching JSX.

## Launching

The page ships with an email waitlist where the store badges will go. To switch:

```ts
// content/site.ts
export const launch = {
  status: "launched",
  appStoreUrl: "https://apps.apple.com/…",
  playStoreUrl: "https://play.google.com/…",
};
```

Every call to action on the page becomes store links. No other file changes.

### The waitlist

`POST /api/waitlist` → `lib/waitlist.ts`, which is one function. It defaults to
a no-op that logs, so the form works end to end in development with no account.

For production set:

```
RESEND_API_KEY=…
RESEND_AUDIENCE_ID=…
```

Swapping Resend for Buttondown, ConvertKit or anything else means editing
`subscribe()` in `lib/waitlist.ts` and nothing else. In production a missing key
is an error rather than a silent success — an address quietly dropped is worse
than a visible failure.

## The rules

`docs/01-vision.md` in the design system carries a **never-do list** that governs
this page as well as the app. `npm run check:adherence` enforces the mechanical
parts of it: no raw hex, no hairline borders, no hand-written shadow colours, no
`--board-*`, no emoji, no exclamation marks in copy, no loss framing, and the
palette codename never appearing as text.

An exception needs a reason, in place:

```ts
// adherence-allow: raw-hex — the theme-color meta tag cannot resolve a var()
themeColor: "#EDF2F3",
```

The rules the checker cannot see, which still hold:

- **One brand colour.** The crane's reds and oranges belong to the crane.
- **One full-bleed accent panel** on the whole page. It is spent on The Crossing.
- **Teal is the loudest thing at one place per view.** That is why the header's
  call to action is a ghost.
- **The crane appears three times.** Hero, The Crossing, the close. At rest,
  never as wallpaper, never recoloured.
- **Tibetan goes through `TibetanText`** — line-height 2.1, no letter-spacing,
  breaking only at a tsheg, and the romanization as the accessible name.
- **Light mode only.** The design system has no dark theme by intent.

## Known gaps

- The founder note in `content/site.ts` is a placeholder. The vision doc's own
  founder paragraph is marked draft-not-to-be-kept and must not be used; it needs
  Thosam's words.
- The design system names `Noto Sans Tibetan` first in `--font-tibetan`, but
  Google Fonts does not publish that family, so the board has always rendered
  the serif. This site loads `Noto Serif Tibetan` to match, and leaves the sans
  first in the stack so it takes over if it is ever self-hosted.
- No logo file exists; the wordmark is set type. `components/Wordmark.tsx` is
  the one file to change when there is one.
