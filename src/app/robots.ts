import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/exploration-chess"], // unlisted game-logic preview
      },
    ],
    sitemap: "https://biest.com/sitemap.xml",
  };
}
