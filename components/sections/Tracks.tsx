import { Card } from "@/components/primitives/Card";
import { Section } from "@/components/primitives/Section";
import { TibetanText } from "@/components/primitives/TibetanText";
import { tracks } from "@/content/site";

/**
 * Two tracks.
 *
 * The point of this section is a product decision, not a feature list: both
 * tracks are open from the first launch. docs/01 says v1 does not let a learner
 * skip, and what makes that acceptable rather than restrictive is exactly this
 * — someone who already speaks starts on Read rather than having to get past
 * Speak to reach it. That is the sentence a diaspora reader is looking for.
 */
export function Tracks() {
  return (
    <Section
      id="two-tracks"
      eyebrow={tracks.eyebrow}
      heading={tracks.heading}
      body={tracks.body}
    >
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {tracks.items.map((track) => (
          <Card key={track.id} className="flex flex-col">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="card-title text-fg-heading">{track.name}</h3>
              <TibetanText roman={track.roman} size="md" className="max-w-none shrink-0">
                {track.tibetan}
              </TibetanText>
            </div>

            <p className="type-caption mt-1 text-fg-accent">{track.subtitle}</p>
            <p className="type-body mt-4 text-fg-body">{track.body}</p>

            {/* Only the Read track has one. It is the outcome that track
                exists for, and inventing a matching line for Speak to keep the
                cards symmetrical would be writing copy to fill a shape. */}
            {"payoff" in track && (
              <p className="type-body-strong mt-4 text-fg-accent">{track.payoff}</p>
            )}

            <dl className="mt-auto flex gap-6 pt-7">
              {track.facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="sr-only">{fact.label}</dt>
                  <dd>
                    <span className="block card-title text-fg-heading">{fact.value}</span>
                    <span className="type-caption text-fg-muted">{fact.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
        ))}
      </div>
    </Section>
  );
}
