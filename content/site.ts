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
 *
 * And one rule the checker cannot see, added 2026-08-16 after Thosam read the
 * page: **one idea per sentence.** Two clauses welded by an em-dash is the
 * failure mode this file kept having. If a sentence needs a dash to hold itself
 * together, it is two sentences.
 *
 * The page leads with why (Simon Sinek's sense of it), so `note` sits at
 * section two and everything after it reads as proof of it. The why is
 * personal and diaspora; the invitation is open to anyone.
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
    "Learn to speak Lhasa Tibetan and read the uchen script. Free, offline, and no account.",
};

export const nav = {
  // Named for what a stranger is looking for, not for the internal metaphor.
  // "The walk" meant nothing to someone who has not read the page yet.
  links: [
    { label: "Why", href: "#why" },
    { label: "What you learn", href: "#two-tracks" },
    { label: "How it works", href: "#the-walk" },
    { label: "Questions", href: "#faq" },
  ],
  cta: "Join the walk",
};

/* ── 1. hero — arrive ───────────────────────────────────────────────────── */

export const hero = {
  eyebrow: "Coming soon",
  heading: ["Learn to speak Tibetan.", "Then learn to read it."],
  /** The why, in one breath, before the product is described. */
  why: "Many of us grew up in the West speaking less of it every year. This is my attempt at a way back.",
  body: "Trungtrung teaches spoken Lhasa Tibetan and uchen, the printed Tibetan script. It is free, works offline, and asks for no account.",
  // No craneAlt. components/Crane.tsx draws the mascot decoratively —
  // alt="" and aria-hidden — because the copy beside it already says
  // everything the bird does. A string here that never reaches the page is a
  // claim about the page that is not true, so it is not kept.
  phoneLabel:
    "The Journey screen, showing the winding rail of districts on the Speak track",
};

/* ── 2. the note — why ──────────────────────────────────────────────────── */

export const note = {
  eyebrow: "The reason",
  heading: "Why I am building this",
  /**
   * Thosam's own words, given 2026-08-16, rewritten to one idea per sentence
   * and nothing else. The design system's docs/01 founder paragraph is still
   * not used: it is marked "written by Claude, to be replaced, not kept".
   *
   * `draft` stays true until Thosam signs off on this exact wording. It gates
   * nothing visually; it is a note to whoever reads this file next.
   */
  draft: true,
  body: [
    "I grew up in the West and watched how many of us stopped speaking Tibetan.",
    "It did not happen all at once, and nobody chose it. The language just receded a little in each generation.",
    "I am building Trungtrung to make the way back shorter.",
    "It is for anyone who wants to learn. But that is why I started.",
  ],
  signoff: "Thosam",
};

/* ── 3. two tracks — settle ─────────────────────────────────────────────── */

export const tracks = {
  eyebrow: "What you learn",
  heading: "Two tracks. Start with either one.",
  // The strongest product fact on the page, and it used to be buried in the
  // FAQ. Both audiences should recognise themselves in the first two sentences.
  body: "New to Tibetan? Start with speaking. Already speak at home but never learned to read? Start with the script. Both tracks are open from the first launch, where most apps make you earn the alphabet first.",
  items: [
    {
      id: "speak",
      name: "Speak",
      tibetan: "སྐད་ཆ་",
      roman: "kecha",
      subtitle: "Lhasa Tibetan, as it is actually spoken",
      // Outcome first. The examples are proof, and they come second — they used
      // to be the whole explanation, which told a stranger nothing.
      body: "Learn to understand and speak everyday Lhasa Tibetan. You build vocabulary, phrases and pronunciation in the situations you would actually use them: ordering tea, meeting someone, asking the way.",
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
      body: "Learn to read uchen from the ground up. You start with single letters, combine them into stacks and syllables, then read real Tibetan words and signs.",
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
  // One line, because the example above already demonstrates the convention.
  // It used to carry two sentences explaining what you can plainly see.
  exampleCaption: "Every word arrives this way: script, sound, meaning.",
};

/* ── 4. the journey — be let deeper ─────────────────────────────────────── */

export const journey = {
  eyebrow: "The shape of it",
  heading: `${stats.districts} places, in one arc`,
  // Mechanism before metaphor. The arc used to be stated in the product's own
  // internal language ("you are let deeper", "district 24 reprises district 1"),
  // which reads as poetry to anyone who has not read the vision doc.
  body: "Lessons are grouped into places rather than levels. Each place introduces new words, phrases and reading, and later places build on the ones before.",
  koraHeading: "You walk it twice",
  koraBody:
    "When you reach the end, you go round again. The second walk revisits every place and opens stops the first one held back. It is named after the kora, a path walked more than once, each time seeing more.",
  /**
   * Eight of the districts, to show the shape of the walk.
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
  phoneLabel:
    "A word check in the Tea House: the Tibetan word shiimpo, four English options, and the answer band naming how it sounds",
};

/* ── 5. the collection ──────────────────────────────────────────────────── */

export const collection = {
  eyebrow: "Tibetan culture",
  heading: "Learn the culture, not just the words",
  // The mechanism was never explained: a stranger could not tell what a "card"
  // was, or what it taught them. Say what they are, then show one.
  body: "As you walk you collect cards: foods, customs, greetings, clothing, places. Each one explains something the language assumes you already know. You find them along the way rather than revising them from a list.",
  phoneLabel:
    "A card found in the Tea House: dongmo, the churn, with the option to keep going or see the card",
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
  cardsNote:
    "A card is not a sticker. There is no shine, no rarity and no pack to open. You meet the thing, and then you have met it.",
  readableNote:
    "Read from the letters rather than recognised from a picture. That difference is the whole point of the second track.",
};

/* ── 6. what will not change — go out ───────────────────────────────────── */

export const principles = {
  eyebrow: "How it is made",
  heading: "Decisions that will not change",
  body: "Each of these is a standing decision, not a launch promise.",
  items: [
    {
      title: "Free, and nothing locked",
      body: "All the learning content is free, permanently. A way to support the project arrives after the beta, and it will not unlock lessons or features.",
    },
    {
      title: "Offline from the first launch",
      body: "Everything ships inside the app. You need no connection on a bus or a plateau.",
    },
    {
      title: "No accounts",
      body: "Your progress stays on your phone. There is a backup file you can read yourself.",
    },
    {
      title: "Every word recorded by a person",
      body: "Anything you are asked to imitate is a human voice. Nothing you repeat is synthesised.",
    },
    {
      title: "Your voice never leaves the phone",
      body: "A recording lasts just long enough for you to compare it. Then it is gone.",
    },
    {
      title: "The streak cannot break",
      body: "Days walking only ever counts up. Miss a month and it is still there.",
    },
    {
      // Was "Calm is the product" — clever, and it told a stranger nothing.
      title: "No gamification",
      body: "No timers, leagues, hearts or lives. You can get something wrong without losing progress.",
    },
    {
      title: "Nothing is locked",
      body: "Content that is not ready yet is marked as not ready. Nothing is held back to make you come back.",
    },
  ],
};

/* ── 7. questions ───────────────────────────────────────────────────────── */

export const faq = {
  eyebrow: "Questions",
  heading: "The ones people ask first",
  items: [
    {
      // The "both tracks open on day one" answer moved up into the Tracks
      // section, where a stranger actually needs it. This one now adds the
      // thing that section does not say.
      q: "I already speak Tibetan but cannot read it. Is this for me?",
      a: "Yes, and you are who I had in mind. The Read track assumes you already know how the words sound, so you are learning to recognise something you can already say.",
    },
    {
      q: "I have never seen the script. Is it too hard to start?",
      a: `You start with single letters and build up from there. There are ${stats.letters} letters and vowel marks in all, and you meet them a few at a time.`,
    },
    {
      q: "Which Tibetan does it teach?",
      a: "Lhasa Tibetan, the spoken standard, recorded from my own speech. The script is uchen, the printed form you see on signs and in books.",
    },
    {
      q: "Is the audio a real voice?",
      a: "Every word, phrase and syllable you are asked to imitate is recorded by a person. Nothing you repeat is synthesised.",
    },
    {
      q: "How is this different from a general language app?",
      a: "General apps teach vocabulary well and culture not at all. Butter tea, the khata scarf, the two goodbyes: that part is why this exists.",
    },
    {
      q: "When does it open?",
      a: "Soon. Join the waitlist and you get one message on the day, and nothing else.",
    },
  ],
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
