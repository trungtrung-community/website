import { Card } from "@/components/primitives/Card";
import { Section } from "@/components/primitives/Section";
import { PhoneFrame } from "@/components/screens/PhoneFrame";
import { journey } from "@/content/site";
import { stats } from "@/content/stats.generated";

/**
 * The journey is a place.
 *
 * The district strip is a real sequence — the arc runs arrive, settle, be let
 * deeper, go out, leave, and district 24 reprises district 1 — so the numbers
 * here carry information rather than decorating the list. That is the only
 * reason they are numbered.
 */
export function Journey() {
  return (
    <Section
      id="the-walk"
      eyebrow={journey.eyebrow}
      heading={journey.heading}
      body={journey.body}
    >
      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14">
        <div className="min-w-0">
          {/* Places, not a numbered list of strings. Each district is its own
              tile so the eye can take the walk in at a glance; a flat <ol> of
              "1 The Tea House / 2 The Market" read as a table of contents. The
              numbers stay because the sequence is real information — this is a
              walk in order, not a menu. */}
          <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {journey.districts.map((name, i) => {
              // Eight of twenty-four. The gap before Departure is the rest of
              // the walk, and is marked rather than hidden.
              const last = i === journey.districts.length - 1;
              return (
                <li key={name} className="contents">
                  {last && (
                    <span className="flex items-center justify-center rounded-card bg-surface-sunken px-4 py-3 text-center type-caption text-fg-subtle">
                      and {stats.districts - journey.districts.length} more
                    </span>
                  )}
                  <span className="flex min-w-0 flex-col gap-1 rounded-card bg-surface-card px-4 py-3">
                    <span className="type-label tabular-nums text-fg-accent">
                      {last ? stats.districts : i + 1}
                    </span>
                    <span className="type-body-strong text-fg-heading">{name}</span>
                  </span>
                </li>
              );
            })}
          </ol>

          <Card className="mt-8">
            <h3 className="card-title text-fg-heading">{journey.koraHeading}</h3>
            <p className="type-body mt-3 text-fg-body">{journey.koraBody}</p>
          </Card>
        </div>

        <figure className="flex min-w-0 flex-col items-center gap-4">
          <PhoneFrame screen="exercise" label={journey.phoneLabel} />
          <figcaption className="type-caption text-center text-fg-muted">
            {journey.caption}
          </figcaption>
        </figure>
      </div>
    </Section>
  );
}
