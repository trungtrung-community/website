import type { ReactNode } from "react";

/**
 * A card.
 *
 * The design system separates surfaces by fill value, never by hairlines or
 * drop shadows: --ground-000 is reserved for cards precisely so they read as
 * lifted off the --ground-100 page ground without a border. So there is no
 * border prop here, and there will not be one.
 */

const TONES = {
  /** The default: white on ground. */
  card: "bg-surface-card",
  /** One step down, for a card sitting on a card. */
  sunken: "bg-surface-sunken",
  /** Soft teal, for a card that is the point of its section. */
  accent: "bg-surface-accent-soft",
} as const;

export function Card({
  tone = "card",
  children,
  className = "",
}: {
  tone?: keyof typeof TONES;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-card p-5 md:p-7 ${TONES[tone]} ${className}`}>{children}</div>
  );
}
