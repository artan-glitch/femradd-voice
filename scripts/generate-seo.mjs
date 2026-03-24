#!/usr/bin/env node
/**
 * generate-seo.mjs
 * Generates public/sitemap.xml and public/rss.xml from TypeScript data files.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const SITE = "https://www.femradd.com";
const TODAY = new Date().toISOString().split("T")[0];

// Parse articles
const articlesRaw = readFileSync(resolve(ROOT, "src/data/articles/index.ts"), "utf-8");
const articleBlockRe = /\{\s*"id"\s*:\s*"[^"]*"[\s\S]*?"modifiedAt"\s*:\s*"[^"]*"(?:\s*,\s*"faqs"\s*:\s*\[[\s\S]*?\])?\s*\}/g;
const articleBlocks = articlesRaw.match(articleBlockRe) || [];

function extractField(block, field) {
  const strRe = new RegExp(`"${field}"\\s*:\\s*"([^"]*?)"`);
  const numRe = new RegExp(`"${field}"\\s*:\\s*(\\d+)`);
  const strMatch = block.match(strRe);
  if (strMatch) return strMatch[1];
  const numMatch = block.match(numRe);
  if (numMatch) return numMatch[1];
  return null;
}

const articles = articleBlocks.map((block) => ({
  slug: extractField(block, "slug"),
  title: extractField(block, "title"),
  excerpt: extractField(block, "excerpt"),
  categoryLabel: extractField(block, "categoryLabel"),
  publishedAt: extractField(block, "publishedAt"),
  modifiedAt: extractField(block, "modifiedAt"),
}));
console.log(`Parsed ${articles.length} articles`);

// Parse categories
const categoriesRaw = readFileSync(resolve(ROOT, "src/data/categories.ts"), "utf-8");
const catBlockRe = /\{\s*"slug"\s*:\s*"[^"]*"[\s\S]*?"navPriority"\s*:\s*\d+\s*\}/g;
const catBlocks = categoriesRaw.match(catBlockRe) || [];
const categories = catBlocks.map((block) => ({ slug: extractField(block, "slug") }));
console.log(`Parsed ${categories.length} categories`);

// Parse authors
const authorsRaw = readFileSync(resolve(ROOT, "src/data/authors.ts"), "utf-8");
const authorSlugRe = /slug:\s*"([^"]*)"/g;
const authorSlugs = [...authorsRaw.matchAll(authorSlugRe)].map((m) => m[1]);
console.log(`Parsed ${authorSlugs.length} authors`);

// Generate sitemap.xml — only <loc> and <lastmod>, no changefreq/priority (ignored by Google)
function sitemapUrl(loc, lastmod) {
  let xml = `  <url>\n    <loc>${loc}</loc>\n`;
  if (lastmod) xml += `    <lastmod>${lastmod}</lastmod>\n`;
  xml += `  </url>`;
  return xml;
}

const urls = [];
urls.push(sitemapUrl(`${SITE}/`, TODAY));
urls.push(sitemapUrl(`${SITE}/artikuj`, TODAY));
for (const p of ["rreth-nesh", "kontakt", "privatesia", "kushtet", "redaksia"]) {
  urls.push(sitemapUrl(`${SITE}/${p}`));
}
for (const cat of categories) {
  urls.push(sitemapUrl(`${SITE}/kategori/${cat.slug}`, TODAY));
}
for (const slug of authorSlugs) {
  urls.push(sitemapUrl(`${SITE}/autore/${slug}`));
}
for (const a of articles) {
  urls.push(sitemapUrl(`${SITE}/artikull/${a.slug}`, a.modifiedAt || a.publishedAt));
}

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
writeFileSync(resolve(ROOT, "public/sitemap.xml"), sitemapXml, "utf-8");
console.log(`Wrote sitemap.xml — ${urls.length} URLs`);

// Generate rss.xml
const sorted = [...articles].sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || "")).slice(0, 50);

function esc(s) {
  return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function truncateDesc(s, max = 155) {
  if (!s) return "";
  if (s.length <= max) return s;
  return s.slice(0, max).replace(/\s+\S*$/, "") + "...";
}

const rssItems = sorted.map((a) => {
  const link = `${SITE}/artikull/${a.slug}`;
  const pubDate = new Date(a.publishedAt + "T12:00:00Z").toUTCString();
  return `    <item>\n      <title>${esc(a.title)}</title>\n      <link>${link}</link>\n      <description>${esc(truncateDesc(a.excerpt))}</description>\n      <pubDate>${pubDate}</pubDate>\n      <guid>${link}</guid>\n      <category>${esc(a.categoryLabel)}</category>\n    </item>`;
});

const rssXml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>FemraDD — Zëri i Gruas Shqiptare</title>\n    <link>${SITE}</link>\n    <description>Revista online për gratë e reja shqiptare. Kulturë, dashuri, lifestyle dhe argëtim — frymëzim çdo ditë.</description>\n    <language>sq</language>\n    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>\n${rssItems.join("\n")}\n  </channel>\n</rss>\n`;
writeFileSync(resolve(ROOT, "public/rss.xml"), rssXml, "utf-8");
console.log(`Wrote rss.xml — ${rssItems.length} items`);
