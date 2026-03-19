#!/usr/bin/env node
/**
 * routes.mjs
 * Generates all site routes by parsing data files.
 * Used by prerender.mjs to know which pages to pre-render.
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

function extractField(block, field) {
  const re = new RegExp(`"${field}"\\s*:\\s*"([^"]*?)"`);
  const m = block.match(re);
  return m ? m[1] : null;
}

export function getAllRoutes() {
  const routes = [];

  // Static pages
  routes.push("/");
  routes.push("/artikuj");
  routes.push("/rreth-nesh");
  routes.push("/kontakt");
  routes.push("/privatesia");
  routes.push("/kushtet");
  routes.push("/redaksia");

  // Article pages — parse slugs from src/data/articles/index.ts
  const articlesRaw = readFileSync(resolve(ROOT, "src/data/articles/index.ts"), "utf-8");
  const articleBlockRe = /\{\s*"id"\s*:\s*"[^"]*"[\s\S]*?"modifiedAt"\s*:\s*"[^"]*"(?:\s*,\s*"faqs"\s*:\s*\[[\s\S]*?\])?\s*\}/g;
  const articleBlocks = articlesRaw.match(articleBlockRe) || [];
  for (const block of articleBlocks) {
    const slug = extractField(block, "slug");
    if (slug) routes.push(`/artikull/${slug}`);
  }

  // Category pages — parse slugs from src/data/categories.ts
  const categoriesRaw = readFileSync(resolve(ROOT, "src/data/categories.ts"), "utf-8");
  const catBlockRe = /\{\s*"slug"\s*:\s*"[^"]*"[\s\S]*?"navPriority"\s*:\s*\d+\s*\}/g;
  const catBlocks = categoriesRaw.match(catBlockRe) || [];
  for (const block of catBlocks) {
    const slug = extractField(block, "slug");
    if (slug) routes.push(`/kategori/${slug}`);
  }

  // Author pages — parse slugs from src/data/authors.ts
  const authorsRaw = readFileSync(resolve(ROOT, "src/data/authors.ts"), "utf-8");
  const authorSlugRe = /slug:\s*"([^"]*)"/g;
  for (const m of authorsRaw.matchAll(authorSlugRe)) {
    routes.push(`/autore/${m[1]}`);
  }

  return routes;
}

// If run directly, print all routes
if (process.argv[1] && (process.argv[1].endsWith("routes.mjs") || process.argv[1].endsWith("routes"))) {
  const routes = getAllRoutes();
  console.log(`Found ${routes.length} routes:`);
  console.log(`  - 7 static pages`);
  console.log(`  - ${routes.filter(r => r.startsWith("/artikull/")).length} article pages`);
  console.log(`  - ${routes.filter(r => r.startsWith("/kategori/")).length} category pages`);
  console.log(`  - ${routes.filter(r => r.startsWith("/autore/")).length} author pages`);
}
