// One-time cleanup of siteData.json after the image migration:
// 1. Remove the site-wide ART MARCOVICI logo/banner from every page's image
//    list (it was scraped as the first image of all 111 pages) and delete
//    the duplicate files from public/images/.
// 2. Remove Google Sites chrome text blocks ("Search this site...Skip to
//    main content..." sidebar dump) from text_blocks.
// 3. Rebuild each page's description from its real text content (was the
//    sidebar dump on all pages).
// 4. Decode HTML entities (&amp; &nbsp; ...) in all titles and texts.
// 5. Refresh navigation image_count values.
//
// Usage: node scripts/clean-sitedata.mjs

import { readFileSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA_PATH = join(ROOT, "src/data/siteData.json");
const data = JSON.parse(readFileSync(DATA_PATH, "utf8"));

const decodeEntities = (s) =>
  String(s)
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

const isChromeText = (s) =>
  s.includes("Search this site") || s.includes("Skip to main content");

// --- 1. find the logo: the image hash referenced by (almost) every page ---
const hashOf = new Map(); // local path -> md5
const pagesUsingHash = new Map(); // md5 -> count of pages
for (const page of Object.values(data.pages)) {
  const seen = new Set();
  for (const ref of page.images || []) {
    const file = join(ROOT, "public", ref);
    if (!existsSync(file)) continue;
    let h = hashOf.get(ref);
    if (!h) {
      h = createHash("md5").update(readFileSync(file)).digest("hex");
      hashOf.set(ref, h);
    }
    if (!seen.has(h)) {
      seen.add(h);
      pagesUsingHash.set(h, (pagesUsingHash.get(h) || 0) + 1);
    }
  }
}
const pageCount = Object.keys(data.pages).length;
const chromeHashes = new Set(
  [...pagesUsingHash.entries()].filter(([, n]) => n >= pageCount * 0.9).map(([h]) => h)
);
console.log(`chrome image hashes (on >=90% of ${pageCount} pages):`, [...chromeHashes]);

// --- 2-4. clean every page ---
let removedImages = 0;
let removedBlocks = 0;
for (const page of Object.values(data.pages)) {
  const keptImages = [];
  for (const ref of page.images || []) {
    if (chromeHashes.has(hashOf.get(ref))) {
      removedImages++;
      const file = join(ROOT, "public", ref);
      if (existsSync(file)) unlinkSync(file);
    } else {
      keptImages.push(ref);
    }
  }
  page.images = keptImages;

  const blocks = (page.text_blocks || []).map(String);
  const kept = blocks.filter((b) => !isChromeText(b));
  removedBlocks += blocks.length - kept.length;
  page.text_blocks = kept.map(decodeEntities).filter(Boolean);

  page.title = decodeEntities(page.title);

  const full = page.text_blocks.join(" ");
  page.description =
    full.length <= 200 ? full : full.slice(0, 200).replace(/\s+\S*$/, "") + "…";
}

// --- 5. navigation: decode titles, refresh image counts ---
for (const section of Object.values(data.navigation)) {
  for (const item of section.items || []) {
    item.title = decodeEntities(item.title);
    const page = data.pages[item.slug];
    if (page) item.image_count = page.images.length;
  }
  if (section.label) section.label = decodeEntities(section.label);
}

writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
console.log(`removed ${removedImages} chrome image refs (files deleted)`);
console.log(`removed ${removedBlocks} chrome text blocks`);
console.log("done");
