import type { MetadataRoute } from "next";

import { site } from "@/content/site";

/**
 * robots.txt, served at /robots.txt.
 *
 * Everything public is crawlable. `/api/` is disallowed because the one route
 * under it is a POST-only waitlist handler with nothing to index.
 *
 * Note what is deliberately absent: there is no block on GPTBot, ClaudeBot,
 * PerplexityBot or any other assistant crawler. Someone asking an assistant
 * where to learn Tibetan is one of the few discovery channels an app that has
 * not shipped actually has, so being readable there is worth more than the
 * content is worth withholding. Silence here would read as an oversight, so:
 * it is a decision.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `https://${site.domain}/sitemap.xml`,
  };
}
