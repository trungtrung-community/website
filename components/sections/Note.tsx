import { Section } from "@/components/primitives/Section";
import { note } from "@/content/site";

/**
 * Why I am building this — section two.
 *
 * It sits this high on purpose. Thosam asked the page to reflect Sinek: people
 * buy why you do it, and what you do proves what you believe. So the reason
 * arrives before the feature list, and everything after this section reads as
 * evidence for it rather than as a catalogue.
 *
 * The words are his, given 2026-08-16, edited only to one idea per sentence.
 * The founder paragraph in the design system's docs/01 is still not used here:
 * it is marked "written by Claude, to be replaced, not kept".
 *
 * The first paragraph carries the weight — it is the sentence the section
 * exists for — so it is set at the heading role and the rest at body. No pull
 * quote, no portrait, no signature graphic: the design system separates by
 * fill and type, and this is the one section where plain type is the point.
 */
export function Note() {
  const [lead, ...rest] = note.body;

  return (
    <Section id="why" eyebrow={note.eyebrow} heading={note.heading}>
      <div className="mt-8 max-w-prose">
        <p className="type-heading text-fg-heading">{lead}</p>

        {rest.map((paragraph) => (
          <p key={paragraph} className="type-body mt-5 text-fg-body">
            {paragraph}
          </p>
        ))}

        <p className="type-caption mt-7 text-fg-muted">— {note.signoff}</p>
      </div>
    </Section>
  );
}
