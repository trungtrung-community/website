# Working in this repo

The landing page for Trungtrung. Read `README.md` first — it covers the design
pipeline, the launch switch and the rules.

The three things most likely to trip you up:

1. **Never hand-edit a colour, size, radius or shadow.** They come from the
   design system via `npm run sync:design`. To change how a token maps, edit
   `scripts/token-map.ts`. Files with a do-not-edit header mean it.
2. **Never type a number into copy.** `docs/02` in the design system says
   "Recount, never quote". Counts come from `content/stats.generated.ts`.
3. **The never-do list in the design system's `docs/01-vision.md` governs this
   page.** Run `npm run check:adherence`. It catches the mechanical rules; the
   ones it cannot see are listed at the end of the README.

All user-facing copy lives in `content/site.ts`. Components hold no prose.

Before claiming anything works: `npm run verify`, then `npm run build`.
