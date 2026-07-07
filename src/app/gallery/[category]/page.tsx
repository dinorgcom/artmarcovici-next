import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import siteData from "@/data/siteData.json";
import { projectItems } from "@/data/projects";

type NavItem = {
  slug: string;
  title: string;
  image_count: number;
};

type NavCategory = {
  label: string;
  items: NavItem[];
};

const navigation = siteData.navigation as Record<string, NavCategory>;
const pages = siteData.pages as Record<string, { title: string; images: string[]; description: string }>;

const categoryMap: Record<string, string> = {
  artworks: "artworks",
  mosaic: "mosaic",
  cado: "cado",
  more: "other",
};

function getNav(category: string): NavCategory | null {
  if (category === "projects") {
    return { label: "Projects", items: projectItems };
  }
  const navKey = categoryMap[category];
  return navKey ? navigation[navKey] ?? null : null;
}

export function generateStaticParams() {
  return [...Object.keys(categoryMap), "projects"].map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const nav = getNav(category);
  return {
    title: nav?.label || "Gallery",
  };
}

export default async function GalleryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const nav = getNav(category);
  if (!nav) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white">{nav.label}</span>
        </nav>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-wide">
          {nav.label}
        </h1>
        <p className="text-gray-500 mt-2">{nav.items.length} collections</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {nav.items.map((item) => {
          const page = pages[item.slug];
          const thumbnail = page?.images?.[0];

          return (
            <Link
              key={item.slug}
              href={`/work/${item.slug}`}
              className="art-card group relative aspect-[4/3] bg-surface rounded-lg overflow-hidden"
            >
              {thumbnail ? (
                <Image
                  src={thumbnail}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-700 text-lg font-serif">
                  {item.title}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-serif text-xl text-white tracking-wide">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {item.image_count} works
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
