import Image from "next/image";

import { screens, type ScreenId } from "@/content/screens.generated";

/**
 * A device frame around a real app screen.
 *
 * The screen inside is a photograph of the design system's own board, captured
 * by `npm run sync:screens`. It used to be hand-written React, and that was a
 * mistake worth recording: those components were built by reading the board and
 * guessing, and they were structurally wrong — the hand-drawn journey listed
 * districts flat where the real one groups 24 into 5 sections with a count line
 * on each, and the hand-drawn crossing invented ཀུ་ཤུ ("apple") where the real
 * one resolves ཇ་ཁང་ ("tea house").
 *
 * The design system ships 51 React components and 296 defined screens. This
 * repo should never hold a second, drifting copy of any of them — and could
 * not anyway, since 22 of those components exist only compiled inside
 * `_ds_bundle.js`. So the page shows the design system's render, and a board
 * change reaches this page through the script rather than through someone
 * noticing.
 *
 * Proportions still come from the board: a 390×760 frame, 60px app bar, 76px
 * tab bar, 20px gutters. The frame scales by width via the `phone` utility.
 *
 * These are illustrations of the app, not the app, so each is announced as a
 * single labelled image rather than as a pile of decorative text.
 */

export const FRAME_W = 390;
export const FRAME_H = 760;

export function PhoneFrame({
  screen,
  label,
  priority = false,
  className = "",
}: {
  /** Which captured screen to show. See scripts/sync-screens.ts. */
  screen: ScreenId;
  /** What this screen shows, announced instead of the image itself. */
  label: string;
  priority?: boolean;
  className?: string;
}) {
  const shot = screens[screen];

  return (
    // w-fit as well as shrink-0: shrink-0 only holds in a flex parent, and a
    // PhoneFrame dropped straight into a grid track stretches to the column,
    // leaving the bezel wide and the 390px screen stranded against its left
    // edge. w-fit makes the frame the right size wherever it is put.
    <div className={`phone w-fit shrink-0 ${className}`}>
      {/* The bezel. Ink, because every outline in this system derives from it. */}
      <div className="rounded-sheet bg-ink-900 p-3 shadow-float">
        <div
          className="relative overflow-hidden rounded-xl bg-surface-app"
          style={{ width: FRAME_W, height: FRAME_H }}
        >
          <Image
            src={shot.src}
            alt={label}
            width={shot.width}
            height={shot.height}
            priority={priority}
            // Captured at 3x; the frame never renders wider than 390 CSS px.
            sizes={`${FRAME_W}px`}
            className="block size-full object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
}
