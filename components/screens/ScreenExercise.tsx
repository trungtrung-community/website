import { TibetanText } from "@/components/primitives/TibetanText";

import { AppBar } from "./PhoneFrame";

/**
 * S7 — "Which one means", answered correctly.
 *
 * The word is real: ཞིམ་པོ / shiimpo / delicious, from district 3, the Tea
 * House, in content/vocabulary.json.
 *
 * Rules this screen has to keep, and why it looks the way it does:
 *   - the prompt is the glyph alone; the romanization is the one thing S7
 *     withholds, so the answer band is where it appears
 *   - the band names what was withheld, never restates what is already on screen
 *   - a card holding Tibetan holds a play button BEFORE the answer, not after —
 *     audio is never a reward for getting it right
 *   - `n of m` is a position, never paired with a tally of how many were right
 *   - no timer, no score, no hearts
 *   - the correct option is --grass-600, the band --surface-correct
 */

export function ScreenExercise() {
  return (
    <div className="relative size-full bg-surface-app">
      <AppBar
        title={<span className="type-caption text-fg-muted">The Tea House</span>}
        trailing={<span className="type-caption text-fg-muted">7 of 12</span>}
      />

      <div className="px-5">
        <p className="type-caption text-fg-muted">Which one means</p>

        <div className="mt-5 rounded-card bg-surface-card p-6">
          <div className="flex items-start justify-between gap-4">
            <TibetanText roman="shiimpo" size="xl">
              ཞིམ་པོ
            </TibetanText>
            {/* The play control sits above the fold, on both tones. */}
            <span
              className="mt-2 grid size-11 shrink-0 place-items-center rounded-pill bg-surface-accent-soft"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none">
                <path
                  d="M8 5.5v13l11-6.5-11-6.5Z"
                  fill="var(--teal-700)"
                  stroke="var(--teal-700)"
                  strokeWidth={2}
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2.5">
          <Option label="quiet" />
          <Option label="delicious" state="correct" />
          <Option label="expensive" />
          <Option label="warm" />
        </div>
      </div>

      {/* The answer band. It reveals the romanization — the one thing the
          prompt withheld — and nothing the learner is already looking at. */}
      <div className="absolute inset-x-0 bottom-0 bg-surface-correct px-5 pt-5 pb-8">
        <p className="type-body-strong text-fg-heading">
          Yes — <span className="italic">shiimpo</span> is &ldquo;delicious&rdquo;.
        </p>
        <div className="mt-4 rounded-control bg-grass-600 py-3.5 text-center type-body-strong text-fg-on-accent">
          Keep walking
        </div>
      </div>
    </div>
  );
}

function Option({ label, state }: { label: string; state?: "correct" }) {
  const correct = state === "correct";
  return (
    <div
      className="rounded-control bg-surface-card px-4 py-3.5 type-body text-fg-heading"
      style={{
        background: correct ? "var(--surface-correct)" : undefined,
        boxShadow: correct ? "var(--edge-correct)" : "var(--edge-ground-sm)",
      }}
    >
      {label}
    </div>
  );
}
