import Link from "next/link";

import { site } from "@/content/site";

/**
 * The wordmark.
 *
 * No logo file exists. The design system's readme is explicit that the mark is
 * set type — Gabarito 800 — and that supplying a logo later becomes a one-file
 * change. This is that one file.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={site.name}
      className={`inline-flex items-baseline gap-2 no-underline ${className}`}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: "var(--weight-display)",
          letterSpacing: "var(--tracking-display)",
        }}
        className="text-xl text-fg-heading"
      >
        {site.name}
      </span>
    </Link>
  );
}
