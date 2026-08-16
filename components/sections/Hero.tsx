import { Crane } from "@/components/Crane";
import { WaitlistForm } from "@/components/WaitlistForm";
import { PhoneFrame } from "@/components/screens/PhoneFrame";
import { hero } from "@/content/site";

/**
 * Arrive.
 *
 * The phone shows S2, the journey rail, so the walk the page is about is
 * visible before a word of it is claimed.
 *
 * This used to open with ཁྲུང་ཁྲུང་ at --text-tib-hero, carrying the naming
 * triple beneath it, on the argument that a page promising "then learn to read
 * it" should show the script at hero scale. Thosam cut it on 2026-08-16: it
 * cost 172px at the top of the hero, Tibetan's mandatory 2.1 line-height left
 * an awkward gap before the romanization, and the header wordmark already says
 * the name two inches above. The headline now starts almost immediately. The
 * script still appears in the track cards, the collection and the footer.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Tighter than a Section's py-24 on purpose: the hero has to fit a
          laptop viewport, and the next section brings its own top padding, so
          the gap between them is still generous. */}
      <div className="page gutter pb-16 pt-6 md:pb-12 md:pt-8">
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

            <h1 className="hero-title mt-4 max-w-prose text-fg-heading">
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
