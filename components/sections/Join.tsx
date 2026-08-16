import { Crane } from "@/components/Crane";
import { WaitlistForm } from "@/components/WaitlistForm";
import { Section } from "@/components/primitives/Section";
import { launch, waitlist } from "@/content/site";

/**
 * The close, and the last waymark on the rail.
 *
 * The crane appears here for the third and final time. docs/04 sanctions it in
 * flight only at J4, the return; at the end of a page that is a walk rather
 * than a kora completed, it stays at rest.
 */
export function Join() {
  const open = launch.status === "launched";

  return (
    <Section
      id="join"
      heading={open ? waitlist.launched.heading : waitlist.heading}
      body={open ? waitlist.launched.body : waitlist.body}
      className="pb-4"
    >
      <div className="mt-8 flex flex-wrap items-end gap-x-16 gap-y-8">
        <WaitlistForm />
        {/* Crane three of three. */}
        <Crane size="md" className="hidden sm:block" />
      </div>
    </Section>
  );
}
