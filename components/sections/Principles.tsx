import { Section } from "@/components/primitives/Section";
import { principles } from "@/content/site";

/**
 * How it is made.
 *
 * These are standing decisions from docs/01, not launch promises, and they are
 * the sharpest differentiation the product has: every one of them is something
 * a growth-driven language app cannot say.
 *
 * No dividers, no cards-within-cards. The design system separates surfaces by
 * fill value rather than by hairlines, so the group gets one white panel and
 * the items inside are separated by space and type weight alone. A rule between
 * every row would be eight more lines than the system permits.
 */
export function Principles() {
  return (
    <Section
      id="how-its-built"
      eyebrow={principles.eyebrow}
      heading={principles.heading}
      body={principles.body}
    >
      <dl className="mt-10 grid gap-x-12 gap-y-8 rounded-card bg-surface-card p-6 md:grid-cols-2 md:p-10">
        {principles.items.map((item) => (
          <div key={item.title}>
            <dt className="type-body-strong text-fg-heading">{item.title}</dt>
            <dd className="type-body mt-2 text-fg-body">{item.body}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
