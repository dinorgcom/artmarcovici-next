import type { ProjectNavItem } from "@/data/projects";

// Statistical dossiers and current-affairs data projects. They live in their own
// "Data" menu and gallery (/gallery/data), separate from the art projects.
// New data dossiers belong here, not in projects.ts.
export const dataItems: ProjectNavItem[] = [
  {
    slug: "gaza",
    title: "GAZA — MAKE UP YOUR MIND",
    image_count: 1,
    href: "/gaza/",
    image: "/images/gaza-card.jpg",
    meta: "Data installation · 2023–2026",
  },
  {
    slug: "judea-samaria",
    title: "JUDEA & SAMARIA",
    image_count: 1,
    href: "/js/",
    image: "/og/og-js.jpg",
    meta: "Data & sources · 2023–2026",
  },
  {
    slug: "femizide-at",
    title: "FEMIZIDE IN ÖSTERREICH",
    image_count: 1,
    href: "/femizide/",
    image: "/images/femizide-card.jpg",
    meta: "Case database · 2019–2026",
  },
  {
    slug: "mortality-austria",
    title: "WORAN ÖSTERREICH STIRBT",
    image_count: 1,
    href: "/mortality/",
    image: "/images/sarkophag-leopold.jpg",
    meta: "Mortality data · Austria 1970–2026",
  },
  {
    slug: "frankreich-bildung",
    title: "FRANCE — MORE MONEY, LESS LEARNING?",
    image_count: 1,
    href: "/frankreich-bildung/",
    image: "/images/frankreich-schule-card.jpg",
    meta: "Data dossier · France 1980–2026",
  },
  {
    slug: "wien-sonne-temperatur",
    title: "VIENNA — SUN & TEMPERATURE",
    image_count: 1,
    href: "/wien-sonne-temperatur",
    image: "/images/vienna-weather-tornado.jpg",
    meta: "Climate data · Vienna 1880–2026",
  },
  {
    slug: "gapminder",
    title: "GAPMINDER 3D",
    image_count: 1,
    href: "/gapminder/",
    image: "/images/gapminder-card.png",
    meta: "110 indicators · 273 countries",
  },
  {
    slug: "elements",
    title: "ECONOMIC PERIODIC TABLE",
    image_count: 1,
    href: "/elements",
    image: "/images/elements-card.jpg",
    meta: "Every element, priced",
  },
].sort((a, b) => a.title.localeCompare(b.title));
