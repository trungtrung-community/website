import { Section } from "@/components/primitives/Section";
import { note } from "@/content/site";

/**
 * Why this exists.
 *
 * The founder paragraph in the design system's docs/01 is marked
 * "[DRAFT — written by Claude, to be replaced, not kept ... this paragraph
 * should not survive him reading it]", so it is not lifted here. What is below
 * is drawn only from the settled parts of the vision, and content/site.ts
 * carries `draft: true` against it until Thosam writes it in his own voice.
 */
export function Note() {
  return (
    <Section id="why" eyebrow="Why" heading={note.heading} bow="right">
      <div className="mt-8 max-w-prose">
        {note.body.map((paragraph) => (
          <p key={paragraph} className="type-body mt-5 text-fg-body first:mt-0">
            {paragraph}
          </p>
        ))}
        <p className="type-caption mt-7 text-fg-muted">— {note.signoff}</p>
      </div>
    </Section>
  );
}
