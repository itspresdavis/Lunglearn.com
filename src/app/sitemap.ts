import type { MetadataRoute } from "next";
import { indexablePaths } from "@/lib/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://lunglearn.com";
  return indexablePaths().map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly" as const, priority: path === "/" ? 1 : 0.6 }));
}
