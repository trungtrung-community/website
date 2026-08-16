import type { ElementType, ReactNode } from "react";
import { Fragment } from "react";

/** U+0F0B TIBETAN MARK INTERSYLLABIC TSHEG — the only place a line may break. */
const TSHEG = "་";

const SIZES = {
  xs: "text-tib-xs",
  sm: "text-tib-sm",
  md: "text-tib-md",
  lg: "text-tib-lg",
  xl: "text-tib-xl",
  hero: "text-tib-hero",
} as const;

export type TibetanSize = keyof typeof SIZES;

type Props = {
  /** The Tibetan itself. */
  children: string;
  /**
   * The Trungtrung romanization — this becomes the accessible name.
   *
   * Required, and not optional by oversight: a screen reader handed raw uchen
   * with an English voice produces noise. docs/04 is explicit that the
   * romanization is what is announced, and that THL never is.
   */
  roman: string;
  size?: TibetanSize;
  as?: ElementType;
  className?: string;
};

/**
 * Every element containing Tibetan goes through this component.
 *
 * It carries the design system's contract for the script, which docs/04 calls
 * the one non-negotiable rule of the system:
 *
 *   - line-height 2.1, so stacked subjoined letters and vowel marks never collide
 *   - the separate Tibetan size ramp, because uchen runs optically small
 *   - no letter-spacing, ever — tracking breaks stacks apart
 *   - a measure of 34ch, because Tibetan wraps badly over long lines
 *   - breaking only after a tsheg
 *   - the romanization as the accessible name
 *
 * All but the last two come from the .tibetan rule in styles/base.css, which is
 * lifted from the design system's own base.css.
 */
export function TibetanText({
  children,
  roman,
  size = "md",
  as: Tag = "span",
  className = "",
}: Props) {
  // Break opportunities go after each tsheg and nowhere else. The tsheg is kept
  // with the syllable it closes, which is where Tibetan typesetting puts it.
  const syllables = children.split(TSHEG);

  return (
    <Tag
      aria-label={roman}
      className={`tibetan tibetan-wrap ${SIZES[size]} ${className}`}
    >
      <span aria-hidden="true">
        {syllables.map((syllable, i) => (
          <Fragment key={i}>
            {syllable}
            {i < syllables.length - 1 && (
              <>
                {TSHEG}
                <wbr />
              </>
            )}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}


export type TibetanNode = ReactNode;
