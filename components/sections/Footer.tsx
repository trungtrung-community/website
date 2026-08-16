import { TibetanText } from "@/components/primitives/TibetanText";
import { footer, site } from "@/content/site";

export function Footer() {
  return (
    <footer className="bg-surface-ink text-fg-on-ink">
      <div className="page gutter py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            {/* The wordmark inverts here; the ink surface is the only place on
                the page where it does. */}
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: "var(--weight-display)",
                letterSpacing: "var(--tracking-display)",
              }}
              className="text-xl text-fg-on-ink"
            >
              {site.name}
            </span>
            <p className="type-caption mt-3 max-w-[24rem] text-ground-400">
              Named after the black-necked crane,{" "}
              <TibetanText
                roman={site.romanName}
                size="xs"
                className="inline max-w-none align-baseline text-ground-200"
                as="span"
              >
                {site.tibetanName}
              </TibetanText>
            </p>
          </div>

          {footer.columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <p className="eyebrow text-ground-400">{column.heading}</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="type-caption text-ground-200 no-underline hover:text-teal-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <p className="type-caption mt-12 text-ink-300">{footer.legal}</p>
      </div>
    </footer>
  );
}
