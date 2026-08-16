"use client";

import { useEffect } from "react";

import { RAIL_LENGTH } from "./KoraRail";

/**
 * Drives the kora rail.
 *
 * The rail used to be a native CSS scroll-driven animation
 * (`animation-timeline: view()`). Measured 2026-08-16, that implementation is
 * correct in Chromium at every viewport tested — but it draws nothing at all in
 * Firefox, which has no support, or in Safari before 26. Both fall back to a
 * fully-drawn rail, which is safe and looks like a bug.
 *
 * ScrollTrigger does not depend on `animation-timeline`, so the rail now draws
 * everywhere. `start` / `end` are also far easier to reason about than the
 * entry/exit phase maths they replace.
 *
 * Three things this deliberately does NOT do:
 *
 *   - It does not make any section a client component. This is mounted once,
 *     finds the rail by class, and renders nothing. Sections stay server-
 *     rendered, and the copy never reaches the JS bundle.
 *   - It does not author an easing. The design system owns those tokens, so
 *     GSAP decides *when* and CSS decides *how*: the scrub is `ease: "none"`
 *     (correct for anything tied to scroll position), and the waymark settle
 *     is a CSS transition on `var(--ease-settle)` toggled by a class.
 *   - It does not run under `prefers-reduced-motion: reduce`. The rail renders
 *     complete, exactly as it does without JavaScript at all.
 *
 * gsap is imported dynamically, after hydration. The no-JS state is already
 * correct — `strokeDashoffset={0}` in KoraRail draws the full rail — so the
 * enhancement costs nothing on first paint.
 */

/** Where the draw front sits in the viewport. Slightly below centre, so the
 *  rail is drawn beside a line the reader has just passed. */
const FRONT = "60%";

export function RailMotion() {
  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Tells CSS that the enhancement is live, so it may hide what it is
        // about to reveal. Without this class every rest state stands as-is.
        document.documentElement.classList.add("js-rail");

        for (const path of gsap.utils.toArray<SVGPathElement>(".rail-active-path")) {
          gsap.fromTo(
            path,
            { strokeDashoffset: RAIL_LENGTH },
            {
              strokeDashoffset: 0,
              ease: "none", // tied to scroll position; an ease here would lie
              scrollTrigger: {
                trigger: path.closest("svg"),
                start: `top ${FRONT}`,
                end: `bottom ${FRONT}`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        }

        // Waymarks arrive as the draw front reaches them. GSAP only toggles the
        // class; the scale and the overshoot live in styles/site.css.
        for (const node of gsap.utils.toArray<HTMLElement>(".rail-node")) {
          ScrollTrigger.create({
            trigger: node,
            start: `top ${FRONT}`,
            invalidateOnRefresh: true,
            onEnter: () => node.classList.add("is-arrived"),
            onLeaveBack: () => node.classList.remove("is-arrived"),
          });
        }

        return () => {
          document.documentElement.classList.remove("js-rail");
        };
      });

      // Tibetan and the display face both change layout height once loaded, and
      // every trigger above is measured in pixels. Re-measure when they land.
      void document.fonts?.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });

      cleanup = () => mm.revert();
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return null;
}
