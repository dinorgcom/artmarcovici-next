import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-lg text-[--color-accent] mb-4">Art Marcovici</h3>
            <p className="text-sm text-gray-500">Contemporary Art by Michael Marcovici</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-3">Explore</h4>
            <div className="space-y-2">
              <Link href="/gallery/artworks" className="block text-sm text-gray-500 hover:text-white transition-colors">Artworks</Link>
              <Link href="/gallery/mosaic" className="block text-sm text-gray-500 hover:text-white transition-colors">Mosaic</Link>
              <Link href="/gallery/cado" className="block text-sm text-gray-500 hover:text-white transition-colors">CADO</Link>
              <Link href="/gallery/projects" className="block text-sm text-gray-500 hover:text-white transition-colors">Projects</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-3">Info</h4>
            <div className="space-y-2">
              <Link href="/work/BIOGRAPHY" className="block text-sm text-gray-500 hover:text-white transition-colors">Biography</Link>
              <Link href="/work/manifesto" className="block text-sm text-gray-500 hover:text-white transition-colors">Manifesto</Link>
              <Link href="/work/about" className="block text-sm text-gray-500 hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/5 text-center text-xs text-gray-600">
          &copy; {new Date().getFullYear()} Art Marcovici. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
