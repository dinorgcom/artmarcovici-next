// Re-scrape image URLs from the original Google Site and download them into
// public/images/, then rewrite src/data/siteData.json to use local paths.
// The lh3.googleusercontent.com/sitesv/ URLs stored during the original
// extraction are expiring signed URLs and now return 403.
//
// Usage: node scripts/migrate-images.mjs

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA_PATH = join(ROOT, "src/data/siteData.json");
const SITE_BASE = "https://sites.google.com/site/artmarcovici";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";

const data = JSON.parse(readFileSync(DATA_PATH, "utf8"));

const EXT_BY_TYPE = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
};

async function fetchWithRetry(url, opts = {}, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow", ...opts });
      if (res.ok) return res;
      if (res.status === 404) return res;
      console.warn(`  HTTP ${res.status} for ${url.slice(0, 80)} (try ${i + 1})`);
    } catch (e) {
      console.warn(`  fetch error ${e.message} (try ${i + 1})`);
    }
    await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
  }
  return null;
}

// Extract sitesv image URLs in DOM order, deduped by token (ignoring size param).
function extractImageUrls(html) {
  const re = /https:\/\/lh3\.googleusercontent\.com\/sitesv\/[A-Za-z0-9_-]+(?:=[A-Za-z0-9_-]+)?/g;
  const seen = new Set();
  const urls = [];
  for (const m of html.matchAll(re)) {
    const url = m[0];
    const token = url.split("=")[0];
    if (seen.has(token)) continue;
    seen.add(token);
    urls.push(url);
  }
  return urls;
}

async function downloadImage(url, destBase) {
  const res = await fetchWithRetry(url);
  if (!res || !res.ok) return null;
  const type = (res.headers.get("content-type") || "").split(";")[0];
  const ext = EXT_BY_TYPE[type] || ".jpg";
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 100) return null;
  const dest = destBase + ext;
  mkdirSync(dirname(join(ROOT, "public", dest)), { recursive: true });
  writeFileSync(join(ROOT, "public", dest), buf);
  return "/" + dest.replace(/\\/g, "/");
}

async function processPage(slug, page) {
  const pageUrl = slug === "home" ? SITE_BASE : `${SITE_BASE}/${slug}`;
  const res = await fetchWithRetry(pageUrl);
  if (!res || !res.ok) {
    console.error(`PAGE FAILED ${slug}: HTTP ${res ? res.status : "n/a"}`);
    return { slug, status: "page-failed" };
  }
  const html = await res.text();
  const urls = extractImageUrls(html);
  const expected = (page.images || []).length;

  const localPaths = [];
  let idx = 0;
  for (const url of urls) {
    const base = join("images", slug, String(idx).padStart(2, "0"));
    let local = null;
    // small per-image retry loop already inside fetchWithRetry
    local = await downloadImage(url, base);
    if (local) {
      localPaths.push(local);
      idx++;
    } else {
      console.error(`  IMG FAILED ${slug} #${idx}`);
    }
  }

  page.images = localPaths;
  const note = localPaths.length === expected ? "" : ` (expected ${expected})`;
  console.log(`${slug}: ${localPaths.length} images${note}`);
  return { slug, status: "ok", count: localPaths.length, expected };
}

async function run() {
  const slugs = Object.keys(data.pages);
  console.log(`Processing ${slugs.length} pages...`);
  const results = [];
  const CONCURRENCY = 4;
  let cursor = 0;
  async function worker() {
    while (cursor < slugs.length) {
      const slug = slugs[cursor++];
      results.push(await processPage(slug, data.pages[slug]));
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
  const failed = results.filter((r) => r.status !== "ok");
  const mismatched = results.filter((r) => r.status === "ok" && r.count !== r.expected);
  const total = results.reduce((s, r) => s + (r.count || 0), 0);
  console.log(`\nDone. ${total} images downloaded.`);
  console.log(`Pages failed: ${failed.length}${failed.length ? " -> " + failed.map((r) => r.slug).join(", ") : ""}`);
  console.log(`Count mismatches: ${mismatched.length}${mismatched.length ? " -> " + mismatched.map((r) => `${r.slug}(${r.count}/${r.expected})`).join(", ") : ""}`);
}

run();
