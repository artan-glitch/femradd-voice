#!/usr/bin/env node
/**
 * fix-wp-links.mjs
 * Rewrites legacy WordPress internal links in article content JSON files.
 * Old: href=\"https://femradd.com/sq/{slug}/\"
 * New: href=\"/artikull/{slug}\"
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, "..", "src", "data", "articles", "content");

const LINK_RE = /href=\\"(https?:\/\/femradd\.com\/sq\/[^\\]*)\\"/g;

const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".json"));
let modifiedCount = 0;
let totalLinks = 0;

for (const file of files) {
  const filePath = join(CONTENT_DIR, file);
  const original = readFileSync(filePath, "utf-8");

  if (!original.includes("femradd.com/sq/")) continue;

  let linkCount = 0;
  const updated = original.replace(LINK_RE, (_match, url) => {
    const cleanUrl = url.replace(/\/+$/, "");
    const segments = cleanUrl.split("/").filter(Boolean);
    const slug = segments[segments.length - 1];
    linkCount++;
    return `href=\\"/artikull/${slug}\\"`;
  });

  if (linkCount > 0) {
    writeFileSync(filePath, updated, "utf-8");
    modifiedCount++;
    totalLinks += linkCount;
    console.log(`  ${file}: ${linkCount} link(s) rewritten`);
  }
}

console.log(`\nTotal: ${totalLinks} links rewritten across ${modifiedCount} files.`);
