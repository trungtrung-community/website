import { Card } from "@/components/primitives/Card";
import { Section } from "@/components/primitives/Section";
import { PhoneFrame } from "@/components/screens/PhoneFrame";
import { ScreenExercise } from "@/components/screens/ScreenExercise";
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
      eyebrow="The shape of it"
      heading={journey.heading}
      body={journey.body}
      bow="right"
    >
      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14">
        <div className="min-w-0">
          <ol className="flex flex-col">
            {journey.districts.map((name, i) => {
              // The strip shows eight of twenty-four; the gap before Departure
              // is the rest of the walk, and is marked rather than hidden.
              const last = i === journey.districts.length - 1;
              const number = last ? stats.districts : i + 1;
              return (
                <li key={name}>
                  {last && (
                    <p className="py-3 pl-[3.25rem] type-caption text-fg-subtle">
                      and {stats.districts - journey.districts.length} more
                    </p>
                  )}
                  <div className="flex items-center gap-5">
                    <span className="w-8 shrink-0 text-right type-caption tabular-nums text-fg-subtle">
                      {number}
                    </span>
                    <span className="type-body-strong text-fg-heading">{name}</span>
                  </div>
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
          <PhoneFrame label="A word check in the Tea House: the Tibetan word shiimpo, four English options, and the answer band naming how it sounds">
            <ScreenExercise />
          </PhoneFrame>
          <figcaption className="type-caption text-center text-fg-muted">
            {journey.caption}
          </figcaption>
        </figure>
      </div>
    </Section>
  );
}
