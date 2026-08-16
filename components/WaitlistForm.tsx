"use client";

import { useId, useState } from "react";

import { Button } from "@/components/primitives/Button";
import { launch, waitlist } from "@/content/site";
import { isPlausibleEmail } from "@/lib/waitlist";

/**
 * The one call to action.
 *
 * While `launch.status` is "waitlist" this collects an address. Flip it to
 * "launched", fill in the two store URLs, and every instance becomes store
 * links instead — no other file changes.
 *
 * The copy stays in the product's register: it says what happens, it does not
 * sell, and the failure state explains what to do rather than apologising.
 */

type State = "idle" | "pending" | "done" | "invalid" | "error";

export function WaitlistForm({ tone = "ground" }: { tone?: "ground" | "accent" }) {
  const id = useId();
  const [state, setState] = useState<State>("idle");
  const [email, setEmail] = useState("");
  const onInk = tone === "accent";

  if (launch.status === "launched") {
    return (
      <div className="flex flex-wrap gap-3">
        {launch.appStoreUrl && (
          <Button as="a" href={launch.appStoreUrl} size="lg">
            App Store
          </Button>
        )}
        {launch.playStoreUrl && (
          <Button as="a" href={launch.playStoreUrl} variant="ghost" size="lg">
            Google Play
          </Button>
        )}
      </div>
    );
  }

  if (state === "done") {
    return (
      <p
        role="status"
        className={`type-body-strong ${onInk ? "text-fg-on-accent" : "text-fg-accent"}`}
      >
        {waitlist.success}
      </p>
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isPlausibleEmail(email)) {
      setState("invalid");
      return;
    }

    setState("pending");
    const form = new FormData(event.currentTarget);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company: form.get("company") }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  const message =
    state === "invalid" ? waitlist.invalid : state === "error" ? waitlist.error : null;

  return (
    <form onSubmit={onSubmit} noValidate className="w-full max-w-[30rem]">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor={id} className="sr-only">
          Email address
        </label>
        <input
          id={id}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "invalid" || state === "error") setState("idle");
          }}
          placeholder={waitlist.placeholder}
          aria-describedby={message ? `${id}-message` : undefined}
          aria-invalid={state === "invalid" || undefined}
          className="min-h-[var(--touch-min)] flex-1 rounded-control bg-surface-card px-4 type-body text-fg-heading placeholder:text-fg-subtle"
        />

        {/* The honeypot. Off-screen rather than hidden, so it stays fillable by
            anything that ignores CSS, and out of the tab order for everyone else. */}
        <div aria-hidden="true" className="absolute left-[-9999px] w-px overflow-hidden">
          <label htmlFor={`${id}-company`}>Company</label>
          <input id={`${id}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <Button type="submit" disabled={state === "pending"}>
          {state === "pending" ? waitlist.pending : waitlist.submit}
        </Button>
      </div>

      {message && (
        <p
          id={`${id}-message`}
          role="alert"
          className={`type-caption mt-3 ${onInk ? "text-teal-100" : "text-fg-body"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
