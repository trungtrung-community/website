/* GENERATED FILE — DO NOT EDIT.
 *
 * Regenerate with:  npm run sync:stats
 * Verify with:      npm run sync:stats -- --check
 *
 * Counted from the design system's own content JSON, because docs/02 says to
 * recount and never quote. The mapping lives in scripts/sync-stats.ts.
 */

export const stats = {
  vocabulary: 952,    // words on the Speak track, both walks (vocabulary.json)
  phrases: 416,       // phrases, drilled whole (phrases.json)
  speakStops: 175,    // lesson stops across both walks (stops.json)
  districts: 24,      // places on the journey (circuit-manifest.json)
  collections: 10,    // card collections (collections.json)
  cards: 110,         // cultural cards found along the way (collections.json)
  letters: 44,        // uchen consonants and vowel marks (json/read/letters.json)
  stacks: 122,        // stacked combinations (json/read/stacks.json)
  syllables: 226,     // syllables built from them (json/read/syllables.json)
  readStops: 44,      // stops on the Read track (json/read/stops.json)
  readSections: 11,   // sections in the Printing House (read/sections.json)
  readableWords: 452, // words readable by the end of the Read track (json/read/words.json)
} as const;

export type Stats = typeof stats;
