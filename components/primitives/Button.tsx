import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

/**
 * Two button skins. Only two.
 *
 * docs/04: "Two button skins only: teal primary and ghost. Nothing else — no
 * white shadowed pill, no navy." A third variant here would be a design-system
 * change, not a component change.
 *
 * The primary carries the system's signature depth: a solid 4px offset edge
 * rather than a blur, and a press that sinks the control 2px onto that edge as
 * the edge shrinks to meet it. Both come from tokens via the edge-accent
 * utility in styles/site.css.
 */

const VARIANTS = {
  primary:
    "bg-surface-accent text-fg-on-accent edge-accent hover:bg-teal-500",
  ghost:
    "text-fg-accent hover:bg-surface-accent-soft",
} as const;

const SIZES = {
  md: "px-5 py-3 type-body-strong",
  lg: "px-7 py-4 type-heading",
} as const;

type Props<T extends ElementType> = {
  as?: T;
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function Button<T extends ElementType = "button">({
  as,
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...rest
}: Props<T>) {
  const Tag = (as ?? "button") as ElementType;

  return (
    <Tag
      className={[
        "inline-flex items-center justify-center gap-2 rounded-control",
        // --touch-min: nothing the finger has to find is smaller than 48px.
        "min-h-[var(--touch-min)] no-underline",
        "select-none",
        VARIANTS[variant],
        SIZES[size],
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </Tag>
  );
}
