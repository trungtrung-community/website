import { TibetanText } from "@/components/primitives/TibetanText";

import { AppBar } from "./PhoneFrame";

/**
 * B1 — the first readable word, resolving letter by letter.
 *
 * The word is real and is genuinely the kind you can read first: ཀུ་ཤུ,
 * "ku shu", apple — decodable from Read section 2, per
 * content/json/read/words.json.
 *
 * Two rules shape this screen:
 *
 *   - Highlight by dimming, not by decorating. To point at one syllable, hold
 *     it at full ink and drop the other to a muted token. Same font, same size,
 *     same weight, same baseline. No box, no arrow, no underline, no second
 *     colour.
 *   - Dimming is colour-only, so it always carries a text equivalent: the
 *     caption names what is highlighted.
 *
 * And the prose contract: a headline that is a phrase not a sentence, at most
 * three words of emphasis naming the outcome, then one sentence.
 */

const STEPS = [
  { letter: "ཀ", roman: "ka", plus: "ུ", becomes: "ku" },
  { letter: "ཤ", roman: "sha", plus: "ུ", becomes: "shu" },
];

export function ScreenFirstWord() {
  return (
    <div className="relative size-full bg-surface-app">
      <AppBar title={<span className="type-caption text-fg-muted">The Printing House</span>} />

      <div className="px-5">
        <p className="eyebrow text-fg-accent">Your first word</p>

        {/* The word. The first syllable is held at full ink; the second is
            dropped to --text-subtle. Nothing else changes. */}
        <div className="mt-5 rounded-card bg-surface-card px-6 py-7">
          <p className="tibetan tibetan-wrap text-tib-xl">
            <span style={{ color: "var(--text-tibetan)" }}>ཀུ་</span>
            <span style={{ color: "var(--text-subtle)" }}>ཤུ</span>
          </p>
          {/* The text equivalent for the dimming above. Every element holding
              Tibetan goes through TibetanText, this caption included. */}
          <p className="type-caption mt-2 flex items-baseline gap-1.5 text-fg-muted">
            first syllable
            <TibetanText roman="ku" size="xs" className="max-w-none">
              ཀུ
            </TibetanText>
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-2.5">
          {STEPS.map((s) => (
            <div
              key={s.letter}
              className="flex items-center gap-3 rounded-control bg-surface-card px-4 py-3"
            >
              <TibetanText roman={s.roman} size="sm" className="shrink-0">
                {s.letter}
              </TibetanText>
              <span className="type-caption text-fg-muted italic">{s.roman}</span>
              <span className="type-caption text-fg-subtle">+</span>
              <TibetanText roman="u" size="sm" className="shrink-0">
                {s.plus}
              </TibetanText>
              <span className="ml-auto type-body-strong text-fg-accent italic">{s.becomes}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-card bg-surface-accent-soft px-5 py-4">
          <p className="type-body-strong text-fg-heading">
            <span className="italic">ku shu</span> — apple
          </p>
          <p className="type-caption mt-1.5 text-fg-body">
            You read that from the letters, not from memory.
          </p>
        </div>
      </div>

      {/* The docked control. A screen in this system always has somewhere to go
          next — docs/04's no-dead-ends rule — and the last row of a scroll
          clears the docked height plus a gap. */}
      <div className="absolute inset-x-0 bottom-0 px-5 pb-8">
        <div className="rounded-control bg-surface-accent py-3.5 text-center type-body-strong text-fg-on-accent">
          Read another
        </div>
      </div>
    </div>
  );
}
