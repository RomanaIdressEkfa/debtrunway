/** Emitted at build time — required by `output: "export"`. */
export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { ANSWERS } from "@/lib/answers";
import { calculators } from "@/lib/calculators";

const SITE = "https://debtrunway.com";

/**
 * The address a page actually lives at.
 *
 * `trailingSlash: true` means every page is served at a path ending in "/",
 * and the bare form 308-redirects to it. Listing the bare form here pointed
 * Google at a redirect on every entry but the root: it still reached the page
 * and indexed it, but each hop was logged as "Page with redirect — not
 * indexed" and spent a crawl arriving. A sitemap should name the destination,
 * not the doormat.
 */
const loc = (path: string) => `${SITE}${path === "/" ? "/" : `${path}/`}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: loc("/"),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    ...calculators.map((c) => ({
      url: loc(c.slug),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    // The answers index, then every answer. They are content rather than
    // tools, so they sit between the calculators and the standing pages.
    {
      url: loc("/answers"),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    ...ANSWERS.map((a) => ({
      url: loc(`/answers/${a.slug}`),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...["/about", "/contact", "/privacy", "/terms"].map((path) => ({
      url: loc(path),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
