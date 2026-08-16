import { AppBar, TabBar } from "./PhoneFrame";

/**
 * S2 — Journey, Speak track, as it appears on a first run.
 *
 * The winding rail of districts. This is the screen the whole page rhymes with:
 * the same walk, at phone scale.
 *
 * Rules this screen has to keep:
 *   - a district not yet reached is a hollow dotted waymark, never a padlock
 *   - the Speak/Read switch lives on this screen and on R1
 *   - `Days walking` counts up and cannot break, and carries no flame
 */

const DISTRICTS = [
  { n: 1, name: "The Circuit", state: "done" },
  { n: 2, name: "Meeting", state: "done" },
  { n: 3, name: "The Tea House", state: "here" },
  { n: 4, name: "Eating", state: "ahead" },
  { n: 5, name: "The Market", state: "ahead" },
] as const;

const NODE = 52;
const GAP = 34;
const SWAY = 46;

export function ScreenJourney() {
  const rowH = NODE + GAP;

  return (
    <div className="relative size-full bg-surface-app">
      <AppBar
        title="Journey"
        trailing={<span className="type-caption text-fg-muted">12 days walking</span>}
      />

      {/* The Speak / Read switch — this screen must carry it. */}
      <div className="px-5">
        <div className="flex gap-1 rounded-pill bg-surface-sunken p-1">
          <span className="flex-1 rounded-pill bg-surface-card py-2 text-center type-caption text-fg-heading">
            Speak
          </span>
          <span className="flex-1 py-2 text-center type-caption text-fg-muted">Read</span>
        </div>
      </div>

      <p className="eyebrow mt-6 px-5 text-fg-muted">Section 1 · Arriving</p>

      <div className="relative mt-4 px-5" style={{ height: DISTRICTS.length * rowH }}>
        {/* The rail behind the nodes. */}
        <svg
          className="absolute left-5 top-0 overflow-visible"
          width={SWAY * 2 + NODE}
          height={DISTRICTS.length * rowH}
          aria-hidden="true"
        >
          <path
            d={railPath(DISTRICTS.length, rowH)}
            fill="none"
            stroke="var(--rail-track)"
            strokeWidth={4}
            strokeLinecap="round"
          />
          <path
            d={railPath(3, rowH)}
            fill="none"
            stroke="var(--rail-done)"
            strokeWidth={4}
            strokeLinecap="round"
          />
        </svg>

        {DISTRICTS.map((d, i) => {
          const x = i % 2 === 0 ? 0 : SWAY;
          return (
            <div
              key={d.n}
              className="absolute flex items-center gap-4"
              style={{ top: i * rowH, left: 20 + x }}
            >
              <span
                className="grid place-items-center rounded-pill"
                style={{
                  width: NODE,
                  height: NODE,
                  background:
                    d.state === "ahead" ? "var(--surface-app)" : "var(--rail-node-done)",
                  boxShadow:
                    d.state === "here"
                      ? "var(--ring-node)"
                      : d.state === "ahead"
                        ? "var(--ring-marker)"
                        : "none",
                }}
              >
                <span
                  className={`type-body-strong ${
                    d.state === "ahead" ? "text-fg-subtle" : "text-fg-on-accent"
                  }`}
                >
                  {d.n}
                </span>
              </span>
              <span
                className={`type-caption whitespace-nowrap ${
                  d.state === "ahead" ? "text-fg-subtle" : "text-fg-heading"
                }`}
              >
                {d.name}
              </span>
            </div>
          );
        })}
      </div>

      <TabBar active="journey" />
    </div>
  );
}

/** A winding path through `count` nodes, alternating side to side. */
function railPath(count: number, rowH: number): string {
  const c = NODE / 2;
  const pts = Array.from({ length: count }, (_, i) => ({
    x: (i % 2 === 0 ? 0 : SWAY) + c,
    y: i * rowH + c,
  }));

  return pts
    .map((p, i) => {
      if (i === 0) return `M${p.x} ${p.y}`;
      const prev = pts[i - 1];
      const my = (prev.y + p.y) / 2;
      return `C${prev.x} ${my} ${p.x} ${my} ${p.x} ${p.y}`;
    })
    .join(" ");
}
