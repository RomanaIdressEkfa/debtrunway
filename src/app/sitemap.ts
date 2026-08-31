/** Emitted at build time — required by `output: "export"`. */
export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { calculators } from "@/lib/calculators";

const SITE = "https://debtrunway.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...calculators.map((c) => ({
      url: `${SITE}${c.slug === "/" ? "" : c.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      // The homepage is the entry point; the rest carry equal weight.
      priority: c.slug === "/" ? 1 : 0.8,
    })),
    ...["/about", "/privacy"].map((path) => ({
      url: `${SITE}${path}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
