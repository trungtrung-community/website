/**
 * Every word on the page lives here.
 *
 * Nothing in components/ should contain user-facing copy — changing wording
 * must never mean touching JSX. Numbers are not written here either: they come
 * from content/stats.generated.ts, recounted from the design system's own
 * content files, because docs/02 says twice over to recount and never quote.
 *
 * House rules this file must obey (docs/01 never-do list, docs/04 voice):
 *   - sentence case everywhere, including headings and buttons
 *   - no emoji, ever
 *   - zero exclamation marks — the product's single permitted one belongs to S9
 *   - no guilt or loss framing, no gamification-barker register
 *   - no mysticism; it is a living language, not ancient wisdom
 *   - button labels of three words or fewer
 * scripts/check-adherence.ts enforces these mechanically.
 */

import { stats } from "./stats.generated";

/* ── launch ────────────────────────────────────────────────────────────────
 * The one switch. While `waitlist`, the primary call to action collects an
 * email. Flip to `launched` and fill the two URLs, and every call to action on
 * the page becomes store badges instead. No other file changes.
 */
export const launch = {
  status: "waitlist" as "waitlist" | "launched",
  appStoreUrl: "",
  playStoreUrl: "",
};

export const site = {
  name: "Trungtrung",
  tibetanName: "ཁྲུང་ཁྲུང་",
  romanName: "trungtrung",
  /** The crane the app is named after. Used for the wordmark's tooltip and alt text. */
  gloss: "black-necked crane",
  domain: "trungtrung.app",
  description:
    "Learn spoken Lhasa Tibetan and the uchen script as a walk through a place rather than a march through a syllabus.",
};

export const nav = {
  links: [
    { label: "Two tracks", href: "#two-tracks" },
    { label: "The walk", href: "#the-walk" },
    { label: "How it is made", href: "#how-its-built" },
  ],
  cta: "Join the walk",
};

/* ── 1. hero — arrive ───────────────────────────────────────────────────── */

export const hero = {
  eyebrow: "Coming soon",
  /** Verbatim from screen S1 on the design board. */
  heading: ["Walk through Tibet.", "Learn what to say at every stop."],
  body: "Spoken Lhasa Tibetan and the uchen script, taught as a journey through twenty-four places. No timers, no leagues, nothing locked.",
  craneAlt:
    "The Trungtrung crane, a black-necked crane with a red crown and a teal scarf, standing at rest",
};

/* ── 2. two tracks — settle ─────────────────────────────────────────────── */

export const tracks = {
  heading: "Two tracks, both open from the first day",
  body: "Most apps make you earn the alphabet. If you already speak at home and never learned to read, you can start with the script on your first launch.",
  items: [
    {
      id: "speak",
      name: "Speak",
      tibetan: "སྐད་ཆ་",
      roman: "kecha",
      subtitle: "Lhasa Tibetan, as it is actually spoken",
      body: "Words and phrases you would really use — butter tea, the two goodbyes, the day-names that are also people's names.",
      facts: [
        { value: stats.vocabulary, label: "words" },
        { value: stats.phrases, label: "phrases" },
        { value: stats.districts, label: "districts" },
      ],
    },
    {
      id: "read",
      name: "Read",
      tibetan: "ཀློག་",
      roman: "lok",
      subtitle: "The uchen script, from the first letter",
      body: "Letters, then stacks, then whole syllables. Reachable rather than scholarly — the Printing House is one place you keep returning to.",
      facts: [
        { value: stats.letters, label: "letters" },
        { value: stats.stacks, label: "stacks" },
        { value: stats.syllables, label: "syllables" },
      ],
    },
  ],
  /** The naming triple, shown live as the worked example: Tibetan, romanization, gloss.
   *  Taken verbatim from the record in content/vocabulary.json, district 3. */
  example: { tibetan: "བོད་ཇ", roman: "phööcha", gloss: "butter tea" },
};

/* ── 3. the journey — be let deeper ─────────────────────────────────────── */

export const journey = {
  heading: "The journey is a place",
  body: "Twenty-four districts in one arc: you arrive, you settle, you are let deeper, you go out, you leave. District twenty-four reprises district one.",
  koraHeading: "Walked twice",
  koraBody:
    "A kora is not walked once, and the crane comes back. The second walk is not a replay — it opens new stops built from what the first walk held back.",
  /**
   * Eight of the twenty-four, to show the shape of the walk.
   * Names taken verbatim from the design board (Board-Speak); the district
   * slugs in content/ are namespace keys, not display names.
   */
  districts: [
    "The Tea House",
    "The Market",
    "The Monastery",
    "The Kora",
    "The Kitchen",
    "The High Pass",
    "The Printing House",
    "Departure",
  ],
  caption: "A word check from the Tea House, as it appears in the app.",
};

/* ── 4. the crossing ────────────────────────────────────────────────────── */

export const crossing = {
  eyebrow: "The crossing",
  heading: "The day the script stops being decoration",
  /** Built on the success definition in docs/01. */
  body: "Someone who could only ever speak it finds they can read a prayer flag, a shop sign, their own name.",
  detail:
    "The first word you read is resolved letter by letter, out of sounds you already know. Nothing about it is a test.",
  caption: "Your first readable word, resolving one letter at a time.",
};

/* ── 5. the collection ──────────────────────────────────────────────────── */

export const collection = {
  heading: "The third that no general app can make",
  body: "Butter tea, khata, kora, the two goodbyes. It is not vocabulary, it is a place — so it arrives as cards you find along the way rather than a list you revise.",
  /** The five prayer-flag colours in the fixed order they are taught.
   *  This is the only place on the page where more than one colour appears,
   *  and it appears as content, never as chrome. */
  flags: [
    { element: "Sky", tibetan: "ནམ་མཁའ་", roman: "namkha", token: "flag-blue" },
    { element: "Air", tibetan: "རླུང་", roman: "lung", token: "flag-white" },
    { element: "Fire", tibetan: "མེ་", roman: "me", token: "flag-red" },
    { element: "Water", tibetan: "ཆུ་", roman: "chu", token: "flag-green" },
    { element: "Earth", tibetan: "ས་", roman: "sa", token: "flag-yellow" },
  ],
  flagsCaption: "The five, in the order they are taught.",
};

/* ── 6. how it's built — go out ─────────────────────────────────────────── */

export const principles = {
  heading: "Made with care rather than growth mechanics",
  body: "Every one of these is a standing decision, not a launch promise.",
  items: [
    {
      title: "Free, and nothing locked",
      body: "No paywall on content, ever. A way to support the work arrives after the beta, and it buys nothing extra.",
    },
    {
      title: "Fully offline from the first launch",
      body: "Everything ships inside the app. No downloads to manage, no connection needed on a bus or a plateau.",
    },
    {
      title: "No accounts",
      body: "Progress is local to your phone, with a backup file you can read yourself. Nothing to sign up for.",
    },
    {
      title: "Every word recorded by a person",
      body: "Anything you are asked to imitate is a human voice, never synthesis.",
    },
    {
      title: "Your voice never leaves the phone",
      body: "A recording exists just long enough for you to compare it, then it is gone. Nothing is sent anywhere.",
    },
    {
      title: "The streak cannot break",
      body: "Days walking only ever counts up. Miss a month and it is still there.",
    },
    {
      title: "Calm is the product",
      body: "Manual advance, no timers, no leagues, no hearts. Nothing is withheld for getting something wrong.",
    },
    {
      title: "Honest about what is missing",
      body: "Nothing is locked; things are not found yet. Empty states point forward.",
    },
  ],
};

/* ── 7. the note — leave ────────────────────────────────────────────────── */

export const note = {
  heading: "Why this exists",
  /**
   * PLACEHOLDER — to be replaced with Thosam's own words.
   *
   * The founder paragraph in the design system's docs/01-vision.md carries an
   * explicit marker: "[DRAFT — written by Claude 2026-08-16 to be replaced, not
   * kept] ... this paragraph should not survive him reading it." It must not be
   * lifted into marketing. What is below is drawn only from the parts of the
   * vision doc that are settled, and should still be rewritten in the first
   * person before launch.
   */
  draft: true,
  body: [
    "The words for home arrive first. The script arrives late, or not at all — which is the ordinary diaspora position rather than an unusual one.",
    "No general-purpose language app can produce the third of this that matters most, because that third is not vocabulary. It is a place.",
  ],
  signoff: "Thosam",
};

/* ── 8. the close ───────────────────────────────────────────────────────── */

export const waitlist = {
  heading: "Join the walk",
  body: "One message when it opens. Nothing else, and no account.",
  placeholder: "you@example.com",
  submit: "Join the walk",
  pending: "Joining",
  success: "You are on the list. Nothing else to do.",
  error: "That did not go through. Worth another look at the address.",
  invalid: "That address does not look right yet.",
  /** Shown instead of the form once launch.status flips to "launched". */
  launched: {
    heading: "The walk is open",
    body: "Free, offline, and no account.",
  },
};

export const footer = {
  tagline: "Named after the black-necked crane, ཁྲུང་ཁྲུང་.",
  columns: [
    {
      heading: "The app",
      // Same labels as the header: a destination keeps one name everywhere.
      links: nav.links,
    },
    {
      heading: "Elsewhere",
      links: [{ label: "GitHub", href: "https://github.com/trungtrung-community" }],
    },
  ],
  legal: "Made in the diaspora.",
};
