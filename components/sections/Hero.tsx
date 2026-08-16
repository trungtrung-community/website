import { Crane } from "@/components/Crane";
import { WaitlistForm } from "@/components/WaitlistForm";
import { TibetanText } from "@/components/primitives/TibetanText";
import { PhoneFrame } from "@/components/screens/PhoneFrame";
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
        {/* The crane gets its own track at xl rather than being absolutely
            positioned over the text column. It used to sit at -left-44 inside
            the phone column, which reads as "beside the walk" only while the
            copy happens to wrap short: measured 2026-08-16, its box spans the
            last ~115px of the text lane at every width, because --page-max caps
            the layout so a wider viewport never opens a gap. A real track
            cannot collide. */}
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_auto_auto] xl:gap-10">
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

            {/* The why, before the product is described. Set at the heading
                role so the reason outranks the feature list, which is the whole
                point of putting it here — see components/sections/Note.tsx. */}
            <p className="type-heading mt-6 max-w-prose text-fg-heading">{hero.why}</p>

            <p className="type-body mt-4 max-w-prose text-fg-body">{hero.body}</p>

            <div className="mt-8">
              <WaitlistForm />
            </div>
          </div>

          {/* Crane one of three. At rest, beside the walk, never over it. */}
          <div className="hidden self-end xl:block">
            <Crane size="sm" priority className="pointer-events-none" />
          </div>

          <div className="relative flex min-w-0 justify-center lg:justify-end">
            <PhoneFrame screen="journey" label={hero.phoneLabel} priority />
          </div>
        </div>
      </div>
    </section>
  );
}
