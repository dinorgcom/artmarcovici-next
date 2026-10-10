import siteData from "@/data/siteData.json";

// Pages in the "other" nav section that are info/meta pages, already linked
// elsewhere in the navigation — everything else is a standalone art project.
// Statistical / current-affairs data dossiers are NOT projects: they live in
// src/data/dataProjects.ts and get their own "Data" menu.
const EXCLUDED_SLUGS = new Set(["home", "about", "BIOGRAPHY", "in-the-news", "manifesto"]);

export type ProjectNavItem = {
  slug: string;
  title: string;
  image_count: number;
  href?: string;
  image?: string;
  meta?: string;
};

// Projects that are not part of the original site export (siteData.json) and
// have their own route instead of a /work/<slug> page. They are merged with
// the siteData items and sorted alphabetically together with them.
const ADDITIONAL_PROJECTS: ProjectNavItem[] = [
  {
    slug: "yuki",
    title: "YUKI · KAHLENBERG",
    image_count: 1,
    href: "/yuki",
    image: "https://waacvuw8uzwtsy98.public.blob.vercel-storage.com/yuki/v2/hero_poster.jpg",
    meta: "Onsen, snow monkeys & AI waste heat · Vienna",
  },
];

export const projectItems: ProjectNavItem[] = [
  ...siteData.navigation.other.items.filter((item) => !EXCLUDED_SLUGS.has(item.slug)),
  ...ADDITIONAL_PROJECTS,
].sort((a, b) => a.title.localeCompare(b.title));
