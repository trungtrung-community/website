import type { ReactNode } from "react";

/**
 * A device frame around a screen.
 *
 * Proportions come from the design system's board: a 390x760 frame, a 60px app
 * bar and a 76px tab bar, with 20px gutters. The frame scales by setting a
 * width; everything inside is laid out in the same units the board uses, so a
 * screen ported from a board frame keeps its measurements.
 *
 * The screens inside are hand-built React rather than screenshots, so they stay
 * crisp at any size and can be read by a screen reader. They are illustrations
 * of the app, not the app: each is labelled as such for assistive technology.
 */

export const FRAME_W = 390;
export const FRAME_H = 760;

export function PhoneFrame({
  children,
  label,
  className = "",
}: {
  children: ReactNode;
  /** What this screen shows, announced instead of the decorative interior. */
  label: string;
  className?: string;
}) {
  return (
    <div role="img" aria-label={label} className={`phone shrink-0 ${className}`}>
      {/* The bezel. Ink, because every outline in this system derives from it. */}
      <div className="rounded-sheet bg-ink-900 p-3 shadow-float">
        <div
          className="relative overflow-hidden rounded-xl bg-surface-app"
          style={{ width: FRAME_W, height: FRAME_H }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/** The app bar: 60px, per the board's authoring rules. */
export function AppBar({
  title,
  trailing,
}: {
  title: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-between px-5"
      style={{ height: 60 }}
    >
      <div className="type-body-strong text-fg-heading">{title}</div>
      {trailing}
    </div>
  );
}

/** The tab bar: 76px, four tabs, per the information architecture in docs/02. */
export function TabBar({ active }: { active: "journey" | "practice" | "collection" | "you" }) {
  const tabs = [
    { id: "journey", label: "Journey" },
    { id: "practice", label: "Practice" },
    { id: "collection", label: "Collection" },
    { id: "you", label: "You" },
  ] as const;

  return (
    <div
      className="absolute inset-x-0 bottom-0 flex items-start justify-around bg-surface-card px-2 pt-3"
      style={{ height: 76 }}
    >
      {tabs.map((t) => (
        <div key={t.id} className="flex flex-col items-center gap-1.5">
          <span
            className={`block size-5 rounded-sm ${
              t.id === active ? "bg-teal-600" : "bg-ground-300"
            }`}
          />
          <span
            className={`type-label ${t.id === active ? "text-fg-accent" : "text-fg-muted"}`}
          >
            {t.label}
          </span>
        </div>
      ))}
    </div>
  );
}
