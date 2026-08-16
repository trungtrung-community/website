/**
 * The kora rail — the page's spine.
 *
 * The design system draws the journey as a winding rail of waymarks, and the
 * product's first principle is that the journey is a place. So the page is not
 * decorated with a rail; the page IS the walk, and scrolling it is the walk
 * being taken. Section headings hang off waymarks the way district hubs hang
 * off nodes on screen S2.
 *
 * Each section renders one segment. Every segment enters and leaves at the
 * horizontal centre of the lane, so segments join seamlessly no matter how tall
 * a section turns out to be — no measurement, no JavaScript, no layout effect.
 *
 * Colour follows the design system's own rail semantics: --rail-track for the
 * path not yet walked and --rail-active for the part behind you. That keeps the
 * page mostly quiet grey and leaves teal free to be the loudest thing in one
 * place, which docs/04 requires.
 */

const VIEW_W = 168;
const VIEW_H = 1000;

/** How far the segment leans out of the lane, as a fraction of lane width. */
const SWAY = 0.46;

type Bow = "left" | "right" | "straight";

function pathFor(bow: Bow): string {
  const mid = VIEW_W / 2;
  if (bow === "straight") return `M${mid} 0 L${mid} ${VIEW_H}`;

  const x = bow === "left" ? mid - VIEW_W * SWAY : mid + VIEW_W * SWAY;
  // Enter and leave vertically at the lane centre so consecutive segments meet
  // without a kink; bow out to `x` through the middle of the section.
  return [
    `M${mid} 0`,
    `C${mid} ${VIEW_H * 0.22} ${x} ${VIEW_H * 0.3} ${x} ${VIEW_H * 0.5}`,
    `C${x} ${VIEW_H * 0.7} ${mid} ${VIEW_H * 0.78} ${mid} ${VIEW_H}`,
  ].join(" ");
}

export function RailSegment({
  bow = "left",
  onInk = false,
}: {
  bow?: Bow;
  /** Inside the full-bleed teal panel the rail has to lighten to stay visible. */
  onInk?: boolean;
}) {
  const d = pathFor(bow);

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
        d={d}
        fill="none"
        stroke={onInk ? "var(--teal-500)" : "var(--rail-track)"}
        strokeWidth={2}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      {/* The path already walked, drawn as the section passes through view.
          pathLength normalises the dash maths to 0..1 whatever the geometry. */}
      <path
        className="rail-active-path"
        d={d}
        fill="none"
        stroke={onInk ? "var(--ground-050)" : "var(--rail-active)"}
        strokeWidth={2}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={0}
      />
    </svg>
  );
}

/**
 * A waymark on the rail.
 *
 * `reached` is solid teal. `waymark` is a hollow dotted marker — the design
 * system is explicit that a not-yet state is a waymark and never a padlock.
 */
export function RailNode({
  kind = "reached",
  className = "",
}: {
  kind?: "reached" | "waymark";
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`${kind === "reached" ? "rail-node" : "rail-waymark"} ${className}`}
    />
  );
}
