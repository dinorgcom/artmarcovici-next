import { notFound } from "next/navigation";
import Link from "next/link";
import siteData from "@/data/siteData.json";
import ImageGallery from "@/components/ImageGallery";

type PageData = {
  title: string;
  images: string[];
  description: string;
  text_blocks: string[];
};

const pages = siteData.pages as Record<string, PageData>;

// Generate static params for all pages
export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({
    slug: slug.split("/"),
  }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  // We need to handle this synchronously for metadata
  return params.then(({ slug }) => {
    const fullSlug = slug.join("/");
    const page = pages[fullSlug];
    return {
      title: page?.title || "Art Marcovici",
      description: page?.description || "Contemporary Art by Michael Marcovici",
    };
  });
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const fullSlug = slug.join("/");
  const page = pages[fullSlug];

  if (!page) {
    notFound();
  }

  // Find sub-pages (e.g., for cado-bricks-1 -> cado-bricks-1/*)
  const subPages = Object.entries(pages)
    .filter(([key]) => key.startsWith(fullSlug + "/") && key !== fullSlug)
    .map(([key, value]) => ({ slug: key, ...value }));

  // Find category for breadcrumbs
  const parentSlug = fullSlug.includes("/") ? fullSlug.split("/")[0] : null;
  const parentPage = parentSlug ? pages[parentSlug] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        {parentPage && parentSlug && (
          <>
            <Link href={`/work/${parentSlug}`} className="hover:text-white transition-colors">
              {parentPage.title}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-white">{page.title}</span>
      </nav>

      {/* Title */}
      <div className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-wide mb-4">
          {page.title}
        </h1>
        {page.images.length > 0 && (
          <p className="text-sm text-gray-600 mt-2">{page.images.length} works</p>
        )}
        {fullSlug === "democratic-chess" && (
          <Link
            href="/democratic-chess"
            className="inline-block mt-6 px-8 py-3 border border-accent text-accent hover:bg-accent hover:text-black transition-all duration-300 tracking-widest text-sm uppercase"
          >
            Play Democratic Chess
          </Link>
        )}
      </div>

      {/* Sub-pages grid (for category pages) */}
      {subPages.length > 0 && (
        <div className="mb-16">
          <h2 className="font-serif text-2xl mb-6 text-gray-300">Browse Collection</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {subPages.map((sub) => (
              <Link
                key={sub.slug}
                href={`/work/${sub.slug}`}
                className="art-card group relative aspect-square bg-surface rounded-lg overflow-hidden"
              >
                {sub.images[0] ? (
                  <img
                    src={sub.images[0]}
                    alt={sub.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    No image
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-sm font-medium text-white truncate">{sub.title}</h3>
                  <p className="text-xs text-gray-400">{sub.images.length} images</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Image Gallery */}
      {page.images.length > 0 && (
        <ImageGallery images={page.images} title={page.title} />
      )}

      {/* Text Content */}
      {page.text_blocks && page.text_blocks.length > 0 && (
        <div className="mt-12 max-w-3xl">
          <div className="prose prose-invert prose-lg">
            {page.text_blocks.map((block, i) => (
              <p key={i} className="text-gray-400 leading-relaxed mb-4">
                {block}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
