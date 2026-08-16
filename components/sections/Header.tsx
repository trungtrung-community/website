import { Wordmark } from "@/components/Wordmark";
import { Button } from "@/components/primitives/Button";
import { nav } from "@/content/site";

/**
 * The header is deliberately quiet, and its call to action is a ghost.
 *
 * docs/04: teal is the loudest thing at one place per view, and if two teal
 * buttons compete one of them is wrong. The hero owns the teal; a sticky teal
 * button in the corner would take it away from there on every scroll position.
 */
export function Header() {
  return (
    <header className="relative">
      <div className="page gutter flex items-center justify-between gap-6 py-5">
        <Wordmark />

        <nav aria-label="Sections" className="hidden items-center gap-1 md:flex">
          {nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-control px-3 py-2 type-caption text-fg-body no-underline hover:bg-surface-sunken"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Button as="a" href="#join" variant="ghost">
          {nav.cta}
        </Button>
      </div>
    </header>
  );
}
