import siteData from "@/data/siteData.json";

// Pages in the "other" nav section that are info/meta pages, already linked
// elsewhere in the navigation — everything else is a standalone project.
const EXCLUDED_SLUGS = new Set(["home", "about", "BIOGRAPHY", "in-the-news", "manifesto"]);

export type ProjectNavItem = {
  slug: string;
  title: string;
  image_count: number;
};

export const projectItems: ProjectNavItem[] = siteData.navigation.other.items
  .filter((item) => !EXCLUDED_SLUGS.has(item.slug))
  .sort((a, b) => a.title.localeCompare(b.title));
