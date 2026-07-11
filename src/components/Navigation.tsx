"use client";

import Link from "next/link";
import { useState } from "react";
import siteData from "@/data/siteData.json";
import { projectItems } from "@/data/projects";

const navCategories = [
  {
    label: "Artworks",
    href: "/gallery/artworks",
    submenu: (siteData.navigation.artworks?.items || []).map((item: { slug: string; title: string }) => ({
      href: `/work/${item.slug}`,
      label: item.title,
    })),
  },
  {
    label: "Mosaic",
    href: "/gallery/mosaic",
    submenu: (siteData.navigation.mosaic?.items || [])
      .filter((item: { slug: string }) => !item.slug.includes("/"))
      .map((item: { slug: string; title: string }) => ({
        href: `/work/${item.slug}`,
        label: item.title,
      })),
  },
  {
    label: "CADO",
    href: "/gallery/cado",
    submenu: [
      { href: "/work/cado", label: "CADO ART" },
      { href: "/work/cado-bricks-1", label: "CADO ELEMENTS" },
      { href: "/work/cado-sets", label: "CADO SETS" },
      { href: "/work/cado-architect", label: "CADO ARCHITECT" },
    ],
  },
  {
    label: "Projects",
    href: "/gallery/projects",
    submenu: [
      ...projectItems.map((item) => ({
        href: `/work/${item.slug}`,
        label: item.title,
      })),
      { href: "/elements", label: "Elements" },
    ].sort((a, b) => a.label.localeCompare(b.label)),
  },
  {
    label: "Book",
    href: "/command-responsibility",
    submenu: [
      { href: "/command-responsibility", label: "Command Responsibility (English)" },
      { href: "/befehlsnotstand", label: "Befehlsnotstand anders gesehen (Deutsch)" },
    ],
  },
  { label: "Biography", href: "/work/BIOGRAPHY" },
  { label: "News", href: "/work/in-the-news" },
  { label: "Contact", href: "/work/about" },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-baseline gap-3 group">
            <span className="font-serif text-xl tracking-wider text-accent group-hover:text-white transition-colors">
              ART MARCOVICI
            </span>
            <span className="font-serif text-sm tracking-widest text-red-600">
              BIEST.COM
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navCategories.map((cat) => (
              <div
                key={cat.label}
                className="relative"
                onMouseEnter={() => cat.submenu && setActiveDropdown(cat.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={cat.href}
                  className="px-3 py-2 text-sm tracking-wide text-gray-300 hover:text-white transition-colors"
                >
                  {cat.label}
                </Link>
                {cat.submenu && activeDropdown === cat.label && (
                  <div className="absolute top-full left-0 w-64 bg-surface border border-white/10 rounded-lg shadow-2xl py-2 max-h-96 overflow-y-auto">
                    {cat.submenu.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface border-t border-white/10 max-h-[80vh] overflow-y-auto">
          {navCategories.map((cat) => (
            <div key={cat.label}>
              <Link
                href={cat.href}
                onClick={() => setMobileOpen(false)}
                className="block px-6 py-3 text-sm font-medium tracking-wide text-gray-300 hover:text-white hover:bg-white/5"
              >
                {cat.label}
              </Link>
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}
