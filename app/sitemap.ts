import type { MetadataRoute } from "next";

import { site } from "@/content/site";

/**
 * sitemap.xml, served at /sitemap.xml. One page, so one entry.
 *
 * Carrying only <loc> is deliberate, and spec-valid — <loc> is the only
 * required child. `changeFrequency` and `priority` are ignored by Google, and
 * `lastModified` would have to come from `new Date()` at build time, which
 * announces that the page changed on every deploy and teaches the crawler to
 * distrust the field. With one URL the sitemap's real job is to declare the
 * canonical host and give Search Console something to submit.
 *
 * A section anchor is not a URL. If a real second route is ever added, it
 * belongs here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `https://${site.domain}/` }];
}
