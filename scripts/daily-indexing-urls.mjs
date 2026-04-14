#!/usr/bin/env node
/**
 * daily-indexing-urls.mjs
 * Picks 10 URLs from the sitemap that haven't been submitted to Google yet.
 * Tracks submitted URLs in .github/submitted-urls.txt
 * Outputs the 10 URLs for the email workflow.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SITEMAP_PATH = resolve(ROOT, "public/sitemap.xml");
const SUBMITTED_PATH = resolve(ROOT, ".github/submitted-urls.txt");
const BATCH_SIZE = 10;

// Ensure directory exists
if (!existsSync(dirname(SUBMITTED_PATH))) {
  mkdirSync(dirname(SUBMITTED_PATH), { recursive: true });
}

// Load sitemap URLs
const sitemapContent = readFileSync(SITEMAP_PATH, "utf-8");
const urlMatches = sitemapContent.match(/<loc>([^<]+)<\/loc>/g) || [];
const allUrls = urlMatches.map(m => m.replace(/<\/?loc>/g, ""));

// Load already-submitted URLs
let submitted = new Set();
if (existsSync(SUBMITTED_PATH)) {
  const content = readFileSync(SUBMITTED_PATH, "utf-8");
  submitted = new Set(content.split("\n").filter(Boolean));
}

// Priority order: homepage first, then categories, then authors, then articles
function priority(url) {
  if (url.match(/\/$/) && !url.match(/\/artikull\/|\/kategori\/|\/autore\//)) return 0;
  if (url.includes("/kategori/")) return 1;
  if (url.includes("/autore/")) return 2;
  if (url.includes("/artikull/")) return 3;
  return 4;
}

const unsubmitted = allUrls
  .filter(url => !submitted.has(url))
  .sort((a, b) => {
    const pa = priority(a);
    const pb = priority(b);
    if (pa !== pb) return pa - pb;
    return a.localeCompare(b);
  });

if (unsubmitted.length === 0) {
  console.log("All URLs have been submitted already!");
  if (process.env.GITHUB_OUTPUT) {
    writeFileSync(process.env.GITHUB_OUTPUT, "has_urls=false\n", { flag: "a" });
  }
  process.exit(0);
}

const batch = unsubmitted.slice(0, BATCH_SIZE);

// Mark as submitted
submitted = new Set([...submitted, ...batch]);
writeFileSync(SUBMITTED_PATH, Array.from(submitted).join("\n") + "\n");

// Output for email
const urlsHtml = batch.map((url, i) => `<li><a href="${url}">${url}</a></li>`).join("\n");
const urlsText = batch.map((url, i) => `${i + 1}. ${url}`).join("\n");

console.log(`Found ${batch.length} URLs to submit:\n`);
console.log(urlsText);
console.log(`\n${allUrls.length - submitted.size} URLs remaining in queue.`);

if (process.env.GITHUB_OUTPUT) {
  const outputs = [
    "has_urls=true",
    `count=${batch.length}`,
    `remaining=${allUrls.length - submitted.size}`,
    `urls_text<<ENDTEXT\n${urlsText}\nENDTEXT`,
    `urls_html<<ENDHTML\n${urlsHtml}\nENDHTML`,
  ].join("\n") + "\n";
  writeFileSync(process.env.GITHUB_OUTPUT, outputs, { flag: "a" });
}
