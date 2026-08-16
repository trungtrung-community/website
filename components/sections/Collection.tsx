import { Card } from "@/components/primitives/Card";
import { Section } from "@/components/primitives/Section";
import { TibetanText } from "@/components/primitives/TibetanText";
import { PhoneFrame } from "@/components/screens/PhoneFrame";
import { collection } from "@/content/site";
import { stats } from "@/content/stats.generated";

/**
 * What you find along the way.
 *
 * The prayer flags are the only place on this page where more than one colour
 * appears, and they appear as content rather than chrome — the design system is
 * explicit that these five mean one specific thing and are never reused as UI.
 * Because the rest of the page is a single teal on a single ground, five
 * colours arriving at once carries real weight. That is the whole reason to
 * ration them.
 *
 * The swatch is colour-only information, so each flag names its element in text
 * beside it, per the colour-with-text-equivalent rule.
 */
export function Collection() {
  return (
    <Section
      id="collection"
      eyebrow={collection.eyebrow}
      heading={collection.heading}
      body={collection.body}
    >
      {/* The phone carries this section. Describing a "card" never landed;
          G4 shows one being found, drawn by the design system's own
          ArtifactCard. */}
      <div className="mt-10 grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-14">
        <div className="grid min-w-0 gap-5">
        <Card className="min-w-0">
          <ol className="flex flex-col gap-4">
            {collection.flags.map((flag) => (
              <li key={flag.element} className="grid grid-cols-[2rem_1fr_auto_3.5rem] items-center gap-x-3">
                <span
                  aria-hidden="true"
                  className="size-8 shrink-0 rounded-sm"
                  style={{
                    background: `var(--${flag.token})`,
                    // The white flag is the page ground's own value, so it needs
                    // an edge to exist at all. This is the sanctioned inset ring,
                    // not a border.
                    boxShadow:
                      flag.token === "flag-white" ? "var(--ring-marker)" : undefined,
                  }}
                />
                <span className="type-body-strong shrink-0 text-fg-heading">
                  {flag.element}
                </span>
                <TibetanText roman={flag.roman} size="sm" className="max-w-none justify-self-end">
                  {flag.tibetan}
                </TibetanText>
                <span className="type-caption italic text-fg-muted">{flag.roman}</span>
              </li>
            ))}
          </ol>
          <p className="type-caption mt-6 text-fg-muted">{collection.flagsCaption}</p>
        </Card>

        <div className="grid min-w-0 gap-5 sm:grid-cols-2">
          <Card tone="sunken">
            <span className="block card-title text-fg-heading">{stats.cards}</span>
            <span className="type-caption text-fg-muted">
              cards across {stats.collections} collections
            </span>
            <p className="type-body mt-4 text-fg-body">{collection.cardsNote}</p>
          </Card>

          <Card tone="sunken">
            <span className="block card-title text-fg-heading">{stats.readableWords}</span>
            <span className="type-caption text-fg-muted">words you can read by the end</span>
            <p className="type-body mt-4 text-fg-body">{collection.readableNote}</p>
          </Card>
        </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <PhoneFrame screen="card-found" label={collection.phoneLabel} />
        </div>
      </div>
    </Section>
  );
}
