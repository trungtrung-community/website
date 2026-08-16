/**
 * The kora rail — the page's spine.
 *
 * The product's first principle is that the journey is a place, so the page is
 * not decorated with a rail: the page IS the walk, and scrolling it is the walk
 * being taken. Each section renders one segment; the segments stack into one
 * unbroken line down the page, with a waymark beside every section heading.
 *
 * It is straight, and deliberately so. It used to bow left and right through
 * each section, and it looked like a stray pencil line: `preserveAspectRatio`
 * stretched every segment to whatever height its section happened to be, so
 * the sway amplitude and rhythm changed section to section and read as
 * accidental rather than as a walk. Straight, tight against the content, with
 * the waymarks anchored to the headings, the line means something — teal for
 * the part behind you, grey for the part ahead. That is also what earns the
 * scroll draw in RailMotion: it now says "you are here" instead of wobbling.
 *
 * Colour follows the design system's own rail semantics: --rail-track for the
 * path not yet walked and --rail-active for the part behind you. So the page
 * stays mostly quiet grey and teal is still the loudest thing in one place,
 * which docs/04 requires.
 */

/** A one-unit-wide viewBox; preserveAspectRatio="none" stretches it to the lane. */
const VIEW_W = 1;
const VIEW_H = 1000;

/**
 * The dash maths is normalised to this, so it is independent of how tall any
 * particular segment actually is.
 *
 * It is 1000 rather than the obvious 1 because animation engines round
 * pixel-valued properties to whole numbers: at pathLength 1 the entire draw
 * happens inside a single pixel unit and collapses to either 0 or 1, so the
 * rail snaps instead of drawing. Measured, not guessed — GSAP reported a clean
 * 0.5 tween progress while rendering `stroke-dashoffset: 0px`. Any scale with
 * room to round in is fine; 1000 makes the steps invisible.
 */
export const RAIL_LENGTH = 1000;

const PATH = `M${VIEW_W / 2} 0 L${VIEW_W / 2} ${VIEW_H}`;

export function RailSegment({
  onInk = false,
}: {
  /** Inside the full-bleed teal panel the rail has to lighten to stay visible. */
  onInk?: boolean;
}) {
  return (
    <svg
      className="rail-svg"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* The path ahead. */}
      <path
        d={PATH}
        fill="none"
        stroke={onInk ? "var(--teal-500)" : "var(--rail-track)"}
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
      />
      {/* The path already walked, drawn as the section passes through view by
          components/rail/RailMotion.tsx. dashoffset 0 is the fully-drawn rest
          state, so the rail is complete without JavaScript rather than
          invisible. */}
      <path
        className="rail-active-path"
        d={PATH}
        fill="none"
        stroke={onInk ? "var(--ground-050)" : "var(--rail-active)"}
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
        pathLength={RAIL_LENGTH}
        strokeDasharray={RAIL_LENGTH}
        strokeDashoffset={0}
      />
    </svg>
  );
}

/**
 * A waymark on the rail, sitting beside a section heading.
 *
 * At rest it is solid — that is what a reader with JavaScript off or reduced
 * motion on sees, and a finished rail is the right static state. Once
 * RailMotion is live it starts hollow and fills as the draw front reaches it,
 * so the page reads as walked-behind / not-yet-ahead. The design system is
 * explicit that a not-yet state is a hollow waymark and never a padlock.
 */
export function RailNode({
  onInk = false,
  className = "",
}: {
  onInk?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`rail-node ${onInk ? "rail-node-ink" : ""} ${className}`}
    />
  );
}
