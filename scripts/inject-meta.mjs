#!/usr/bin/env node
/**
 * inject-meta.mjs
 * Lightweight pre-renderer that creates static HTML files for each route
 * with correct canonical, title, and description tags.
 * No browser needed — just string replacement on the built index.html.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const SITE = "https://www.femradd.com";

// Read the built index.html as template
const template = readFileSync(resolve(DIST, "index.html"), "utf-8");

function extractField(block, field) {
  const re = new RegExp(`"${field}"\\s*:\\s*"([^"]*?)"`);
  const m = block.match(re);
  return m ? m[1] : null;
}

// Parse articles
const articlesRaw = readFileSync(resolve(ROOT, "src/data/articles/index.ts"), "utf-8");
const articleBlockRe = /\{\s*"id"\s*:\s*"[^"]*"[\s\S]*?"modifiedAt"\s*:\s*"[^"]*"(?:\s*,\s*"faqs"\s*:\s*\[[\s\S]*?\])?\s*\}/g;
const articleBlocks = articlesRaw.match(articleBlockRe) || [];
const articles = articleBlocks.map((block) => ({
  slug: extractField(block, "slug"),
  title: extractField(block, "title"),
  excerpt: extractField(block, "excerpt"),
  image: extractField(block, "image"),
  category: extractField(block, "category"),
  categoryLabel: extractField(block, "categoryLabel"),
}));

// Parse categories
const categoriesRaw = readFileSync(resolve(ROOT, "src/data/categories.ts"), "utf-8");
const catBlockRe = /\{\s*"slug"\s*:\s*"[^"]*"[\s\S]*?"navPriority"\s*:\s*\d+\s*\}/g;
const catBlocks = categoriesRaw.match(catBlockRe) || [];
const categories = catBlocks.map((block) => ({
  slug: extractField(block, "slug"),
  label: extractField(block, "label"),
}));

// Parse authors
const authorsRaw = readFileSync(resolve(ROOT, "src/data/authors.ts"), "utf-8");
const authorRe = /slug:\s*"([^"]*)"[\s\S]*?name:\s*"([^"]*)"/g;
const authors = [];
for (const m of authorsRaw.matchAll(authorRe)) {
  authors.push({ slug: m[1], name: m[2] });
}

function injectMeta(html, { title, description, url, image, type = "website" }) {
  const fullTitle = `${title} — FemraDD`;
  const ogImage = image ? (image.startsWith("http") ? image : `${SITE}${image}`) : `${SITE}/og-image.png`;

  let result = html;

  // Replace title
  result = result.replace(/<title>[^<]*<\/title>/, `<title>${fullTitle}</title>`);

  // Replace meta description
  result = result.replace(
    /(<meta name="description" content=")[^"]*(")/,
    `$1${description}$2`
  );

  // Replace canonical
  result = result.replace(
    /(<link rel="canonical" href=")[^"]*(")/,
    `$1${url}$2`
  );

  // Replace og tags
  result = result.replace(/(<meta property="og:title" content=")[^"]*(")/,`$1${fullTitle}$2`);
  result = result.replace(/(<meta property="og:description" content=")[^"]*(")/,`$1${description}$2`);
  result = result.replace(/(<meta property="og:url" content=")[^"]*(")/,`$1${url}$2`);
  result = result.replace(/(<meta property="og:image" content=")[^"]*(")/,`$1${ogImage}$2`);
  result = result.replace(/(<meta property="og:type" content=")[^"]*(")/,`$1${type}$2`);

  // Replace twitter tags
  result = result.replace(/(<meta name="twitter:title" content=")[^"]*(")/,`$1${fullTitle}$2`);
  result = result.replace(/(<meta name="twitter:description" content=")[^"]*(")/,`$1${description}$2`);
  result = result.replace(/(<meta name="twitter:image" content=")[^"]*(")/,`$1${ogImage}$2`);

  return result;
}

function writePage(route, meta) {
  const html = injectMeta(template, meta);
  const dir = resolve(DIST, route.replace(/^\//, ""));
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, "index.html"), html, "utf-8");
}

let count = 0;

// Static pages
const staticPages = [
  { route: "/artikuj", title: "Të Gjitha Artikujt", desc: "Shfleto të gjitha artikujt e FemraDD — kulturë, dashuri, lifestyle dhe argëtim për gratë shqiptare." },
  { route: "/rreth-nesh", title: "Rreth Nesh", desc: "Mëso më shumë rreth FemraDD, revistës online për gratë e reja shqiptare." },
  { route: "/kontakt", title: "Kontakt", desc: "Na kontaktoni për bashkëpunime, sugjerime ose pyetje." },
  { route: "/privatesia", title: "Politika e Privatësisë", desc: "Politika e privatësisë së FemraDD." },
  { route: "/kushtet", title: "Kushtet e Përdorimit", desc: "Kushtet e përdorimit të faqes FemraDD." },
  { route: "/redaksia", title: "Redaksia", desc: "Njohuni me ekipin e redaksisë së FemraDD." },
];

for (const p of staticPages) {
  writePage(p.route, { title: p.title, description: p.desc, url: `${SITE}${p.route}` });
  count++;
}

// Article pages
for (const a of articles) {
  if (!a.slug) continue;
  const desc = a.excerpt || `Lexo artikullin "${a.title}" në FemraDD.`;
  writePage(`/artikull/${a.slug}`, {
    title: a.title,
    description: desc.slice(0, 160),
    url: `${SITE}/artikull/${a.slug}`,
    image: a.image,
    type: "article",
  });
  count++;
}

// Category pages
for (const c of categories) {
  if (!c.slug) continue;
  writePage(`/kategori/${c.slug}`, {
    title: `${c.label} — Artikuj`,
    description: `Shfleto artikujt më të fundit në kategorinë "${c.label}" në FemraDD.`,
    url: `${SITE}/kategori/${c.slug}`,
  });
  count++;
}

// Author pages
for (const a of authors) {
  writePage(`/autore/${a.slug}`, {
    title: `${a.name} — Autore`,
    description: `Lexo artikujt e ${a.name} në FemraDD.`,
    url: `${SITE}/autore/${a.slug}`,
  });
  count++;
}

console.log(`Injected meta tags for ${count} pages`);
