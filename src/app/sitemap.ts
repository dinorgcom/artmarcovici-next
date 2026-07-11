import type { MetadataRoute } from "next";
import siteData from "@/data/siteData.json";
import book from "@/data/book.json";

const BASE = "https://biest.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const statics = [
    "",
    "/command-responsibility",
    "/command-responsibility/journey",
    "/befehlsnotstand",
    "/befehlsnotstand/reise",
    "/c3",
    "/democratic-chess",
    "/free-market-chess",
    "/gallery/artworks",
    "/gallery/mosaic",
    "/gallery/cado",
    "/gallery/projects",
  ];

  const works = Object.keys(siteData.pages as Record<string, unknown>).map(
    (slug) => `/work/${slug}`
  );

  const chapters = (book.chapters as { slug: string }[]).flatMap((c) => [
    `/command-responsibility/${c.slug}`,
    `/befehlsnotstand/${c.slug}`,
  ]);

  return [...statics, ...works, ...chapters].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "" ? 1 : path.startsWith("/work/") ? 0.6 : 0.8,
  }));
}
