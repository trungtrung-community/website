import { Crane } from "@/components/Crane";
import { Section } from "@/components/primitives/Section";
import { PhoneFrame } from "@/components/screens/PhoneFrame";
import { ScreenFirstWord } from "@/components/screens/ScreenFirstWord";
import { crossing } from "@/content/site";

/**
 * The crossing — the one full-bleed accent panel on the page.
 *
 * The design system allows exactly one, and this is where it is spent: the
 * moment docs/01 names as what success looks like, when someone who could only
 * ever speak the language finds they can read a prayer flag, a shop sign, their
 * own name. Nothing else on the page gets to be this loud.
 */
export function Crossing() {
  return (
    <Section
      id="the-crossing"
      eyebrow={crossing.eyebrow}
      heading={crossing.heading}
      body={crossing.body}
      tone="accent"
      bow="left"
    >
      <div className="mt-8 grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
        <div className="min-w-0">
          <p className="type-body max-w-prose text-teal-100">{crossing.detail}</p>

          {/* Crane two of three. */}
          <Crane size="lg" className="mt-4 hidden lg:block" />
        </div>

        <figure className="flex min-w-0 flex-col items-center gap-4">
          <PhoneFrame label="The first readable word: ku shu, apple, resolving one letter at a time">
            <ScreenFirstWord />
          </PhoneFrame>
          <figcaption className="type-caption text-center text-teal-100">
            {crossing.caption}
          </figcaption>
        </figure>
      </div>
    </Section>
  );
}
