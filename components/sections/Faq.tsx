import { Section } from "@/components/primitives/Section";
import { faq } from "@/content/site";

/**
 * Questions.
 *
 * These answer *arrival* doubts — am I the right person for this, is the script
 * too hard, which Tibetan is it — and deliberately not the product stances,
 * which Principles already owns one section earlier. An FAQ that restates the
 * section above it is padding.
 *
 * Answers are shown, not folded into an accordion. Six short answers read
 * faster open than they do behind six clicks, and a disclosure widget would be
 * the page's only interactive chrome outside the waitlist field.
 *
 * A definition list is the right element: the questions are the terms.
 */
export function Faq() {
  return (
    <Section
      id="faq"
      eyebrow={faq.eyebrow}
      heading={faq.heading}
    >
      <dl className="mt-10 grid gap-x-12 gap-y-8 rounded-card bg-surface-card p-6 md:grid-cols-2 md:p-10">
        {faq.items.map((item) => (
          <div key={item.q} className="min-w-0">
            <dt className="type-body-strong text-fg-heading">{item.q}</dt>
            <dd className="type-body mt-2 text-fg-body">{item.a}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
