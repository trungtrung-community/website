/* GENERATED FILE — DO NOT EDIT.
 *
 * Regenerate with:  npm run sync:screens
 * Verify with:      npm run sync:screens -- --check
 *
 * Photographed from the design system's own boards, so the phones on this page
 * show the real app rather than someone's memory of it. The mapping, and the
 * reason each screen was chosen, live in scripts/sync-screens.ts.
 *
 * `digest` is a hash of the frame's rendered text and height — not its pixels,
 * which move with every Chromium and font update.
 */

export const screens = {
  "journey": {
    src: "/screens/journey.png",
    width: 390,
    height: 760,
    chip: "S2",
    label: "S2 Journey Speak",
    digest: "aa265efd0ad09917",
    /* uses: Button, HeadRail, IconButton, SectionHeader, SegmentedControl, TabBar */
    /* Journey (home) — Speak/Read is a switch, not two tabs · the switch is wired both ways: Read → R1, and R1’s own switch returns here · 24 districts in 5 sections, shown unrolled · each section header ca */
  },
  "exercise": {
    src: "/screens/exercise.png",
    width: 390,
    height: 760,
    chip: "S7",
    label: "S7 Which one means",
    digest: "a686158e3747c3c2",
    /* uses: AnswerChoice, AudioButton, Icon, ProgressBar, TibetanText */
    /* Which one means — renamed from “translate”, which promised production this product never asks for · meaning-pick’s one home, in stop and drill alike: Tibetan prompt, four English options — the English */
  },
  "card-found": {
    src: "/screens/card-found.png",
    width: 390,
    height: 760,
    chip: "G4",
    label: "G4 Card found",
    digest: "bc122d57277d23ad",
    /* uses: Button, MascotSpeech, Sheet, TibetanText */
    /* Card found — moved out of the teach-and-check rhythm to the end of the stop, where it rewards finishing rather than scrolling past a word · it rises over the recap at S8, not over an exercise; the int */
  },
} as const;

export type ScreenId = keyof typeof screens;
