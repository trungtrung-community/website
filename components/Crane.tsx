import Image from "next/image";

/**
 * The mascot.
 *
 * docs/04 governs where it may appear and how: at most one crane per screen,
 * at rest, never as wallpaper, never rotated, skewed, recoloured, or given
 * accessories beyond the teal scarf it already wears. A single two-frame bob is
 * the whole character-animation budget.
 *
 * This page's budget is three appearances — the hero, The Crossing, and the
 * close — and this component is deliberately the only way to draw it, so that
 * budget stays countable.
 *
 * The crane is decoration next to copy that already says everything, so it is
 * hidden from assistive technology unless a caller passes an explicit alt.
 */

const SRC = "/mascot/mascot-crane-full-cutout.png";
const NATURAL = { width: 1023, height: 1537 };

/* Box widths. The artwork sits inside roughly 60% of its own canvas, so these
 * are larger than the bird you see — measure the bird, not the number. */
const SIZES = {
  sm: 150,
  md: 210,
  lg: 300,
} as const;

export function Crane({
  size = "md",
  alt,
  priority = false,
  className = "",
}: {
  size?: keyof typeof SIZES;
  /** Omit unless the crane is carrying meaning no nearby text carries. */
  alt?: string;
  priority?: boolean;
  className?: string;
}) {
  const width = SIZES[size];

  return (
    <Image
      src={SRC}
      alt={alt ?? ""}
      aria-hidden={alt ? undefined : true}
      width={NATURAL.width}
      height={NATURAL.height}
      priority={priority}
      sizes={`${width}px`}
      className={`h-auto select-none ${className}`}
      style={{ width }}
    />
  );
}
