import { Crane } from "@/components/Crane";
import { WaitlistForm } from "@/components/WaitlistForm";
import { TibetanText } from "@/components/primitives/TibetanText";
import { PhoneFrame } from "@/components/screens/PhoneFrame";
import { ScreenJourney } from "@/components/screens/ScreenJourney";
import { hero, site } from "@/content/site";

/**
 * Arrive.
 *
 * The thesis of the page is that the script is legible, so the script is the
 * largest thing on it. ཁྲུང་ཁྲུང་ is set at --text-tib-hero and carries the
 * naming triple beneath it — Tibetan, then the romanization, then the gloss —
 * which is both the brand mark and a worked example of the one convention the
 * whole product runs on.
 *
 * The phone shows S2, the journey rail, so the walk the page is about is
 * visible before a word of it is claimed.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="page gutter pb-16 pt-6 md:pb-24 md:pt-10">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_auto] lg:gap-16">
          <div className="min-w-0">
            <p className="eyebrow text-fg-accent">{hero.eyebrow}</p>

            {/* The name, as the naming triple. */}
            <div className="mt-1">
              <TibetanText
                as="p"
                roman={site.romanName}
                size="hero"
                className="tibetan-hero max-w-none"
              >
                {site.tibetanName}
              </TibetanText>
              <p className="type-body mt-1 text-fg-muted">
                <span className="italic">{site.romanName}</span>
                <span className="mx-2 text-fg-subtle">·</span>
                {site.gloss}
              </p>
            </div>

            <h1 className="hero-title mt-8 max-w-prose text-fg-heading">
              <span className="block">{hero.heading[0]}</span>{" "}
              <span className="block text-fg-accent">{hero.heading[1]}</span>
            </h1>

            <p className="type-body mt-6 max-w-prose text-fg-body">{hero.body}</p>

            <div className="mt-8">
              <WaitlistForm />
            </div>
          </div>

          <div className="relative flex min-w-0 justify-center lg:justify-end">
            {/* Crane one of three. At rest, beside the walk, never over it —
                and out of flow, so it never narrows the headline column. */}
            <Crane
              size="sm"
              priority
              className="pointer-events-none absolute bottom-0 -left-44 hidden xl:block"
            />

            <PhoneFrame label="The Journey screen, showing the winding rail of districts on the Speak track">
              <ScreenJourney />
            </PhoneFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
