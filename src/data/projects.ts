import siteData from "@/data/siteData.json";

// Pages in the "other" nav section that are info/meta pages, already linked
// elsewhere in the navigation — everything else is a standalone project.
const EXCLUDED_SLUGS = new Set(["home", "about", "BIOGRAPHY", "in-the-news", "manifesto"]);

export type ProjectNavItem = {
  slug: string;
  title: string;
  image_count: number;
  href?: string;
  image?: string;
  meta?: string;
};

const standaloneProjects: ProjectNavItem[] = siteData.navigation.other.items
  .filter((item) => !EXCLUDED_SLUGS.has(item.slug));

export const projectItems: ProjectNavItem[] = [
  ...standaloneProjects,
  {
    slug: "mortality-austria",
    title: "WORAN ÖSTERREICH STIRBT",
    image_count: 1,
    href: "/mortality/",
    image: "/images/sarkophag-leopold.jpg",
    meta: "Interactive data project",
  },
]
  .sort((a, b) => a.title.localeCompare(b.title));
