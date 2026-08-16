import type { ReactNode } from "react";

import { RailNode, RailSegment } from "@/components/rail/KoraRail";

/**
 * A stop on the page.
 *
 * Every section is a waymark on the kora rail: it renders its own rail segment
 * and hangs its heading off a waymark, so the spine reads as a sequence of
 * stops rather than as a border.
 *
 * `tone` controls the ground. The design system allows at most two background
 * fills per view, and at most one full-bleed accent panel in a whole product.
 * The page spent it on The Crossing until that section was cut, so `accent` is
 * currently unused — and if a section takes it, it is the only one that may.
 */

const TONES = {
  ground: "bg-surface-app text-fg-body",
  raised: "bg-surface-raised text-fg-body",
  accent: "bg-surface-accent text-fg-on-accent",
} as const;

type Props = {
  id?: string;
  eyebrow?: string;
  heading?: string;
  body?: string;
  tone?: keyof typeof TONES;
  /** Set false for a section that should carry the line but no waymark. */
  node?: boolean;
  /** Headings are h2 by default; the hero owns the only h1. */
  headingLevel?: 2 | 3;
  children?: ReactNode;
  className?: string;
};

export function Section({
  id,
  eyebrow,
  heading,
  body,
  tone = "ground",
  node = true,
  headingLevel = 2,
  children,
  className = "",
}: Props) {
  const onInk = tone === "accent";
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <section id={id} className={`relative ${TONES[tone]} ${className}`}>
      <div className="page gutter">
        <div className="rail-lane py-16 md:py-24">
          <RailSegment onInk={onInk} />
          {/* The waymark sits on the eyebrow's line, which is why the offset
              matches the section's own top padding. That anchoring is the
              whole point of the spine: a marker floating in the margin is a
              dot, a marker beside a heading is a stop on the walk. */}
          {node && <RailNode onInk={onInk} className="top-16 md:top-24" />}

          {(eyebrow || heading || body) && (
            <header className="max-w-prose">
              {eyebrow && (
                <p className={`eyebrow ${onInk ? "text-teal-200" : "text-fg-accent"}`}>
                  {eyebrow}
                </p>
              )}
              {heading && (
                <Heading
                  className={`section-title mt-3 ${onInk ? "text-fg-on-accent" : "text-fg-heading"}`}
                >
                  {heading}
                </Heading>
              )}
              {body && (
                <p className={`type-body mt-4 ${onInk ? "text-teal-100" : "text-fg-body"}`}>
                  {body}
                </p>
              )}
            </header>
          )}

          {children}
        </div>
      </div>
    </section>
  );
}
