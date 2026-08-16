import type { ReactNode } from "react";

import { RailNode, RailSegment } from "@/components/rail/KoraRail";

/**
 * A stop on the page.
 *
 * Every section is a waymark on the kora rail: it renders its own rail segment
 * and hangs its heading off a node. Sections alternate which way the rail bows
 * so the spine reads as a walk rather than a ruler.
 *
 * `tone` controls the ground. The design system allows at most two background
 * fills per view, and exactly one full-bleed accent panel in a whole product —
 * this page spends it on The Crossing, and nowhere else.
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
  bow?: "left" | "right" | "straight";
  /** Sections after the reader's position show a hollow waymark instead. */
  node?: "reached" | "waymark" | "none";
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
  bow = "left",
  node = "reached",
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
          <RailSegment bow={bow} onInk={onInk} />
          {node !== "none" && <RailNode kind={node} className="top-16 md:top-24" />}

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
