#!/usr/bin/env node
/**
 * publish-next.mjs
 * Picks the next article from the queue, adds it to the live site,
 * regenerates SEO files, and outputs info for the GitHub Actions workflow.
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, renameSync, existsSync, copyFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const QUEUE_DIR = resolve(ROOT, "src/data/articles/queue");
const PUBLISHED_DIR = resolve(QUEUE_DIR, "published");
const CONTENT_DIR = resolve(ROOT, "src/data/articles/content");
const INDEX_FILE = resolve(ROOT, "src/data/articles/index.ts");

// Ensure published directory exists
if (!existsSync(PUBLISHED_DIR)) mkdirSync(PUBLISHED_DIR, { recursive: true });

// Find next article in queue (lowest numbered, not in published/)
const entries = readdirSync(QUEUE_DIR)
  .filter(f => /^\d{3}-/.test(f) && existsSync(join(QUEUE_DIR, f, "meta.json")))
  .sort();

if (entries.length === 0) {
  console.log("No articles in queue. Exiting.");
  // Set GitHub Actions outputs
  if (process.env.GITHUB_OUTPUT) {
    writeFileSync(process.env.GITHUB_OUTPUT, "published=false\n", { flag: "a" });
  }
  process.exit(0);
}

const nextEntry = entries[0];
const entryDir = join(QUEUE_DIR, nextEntry);
const meta = JSON.parse(readFileSync(join(entryDir, "meta.json"), "utf-8"));
const content = JSON.parse(readFileSync(join(entryDir, "content.json"), "utf-8"));

console.log(`Publishing: ${meta.title} (${meta.slug})`);

// 1. Copy content JSON to articles/content/
writeFileSync(join(CONTENT_DIR, `${meta.slug}.json`), JSON.stringify(content, null, 2));

// 2. Find the highest existing article ID
const indexContent = readFileSync(INDEX_FILE, "utf-8");
const idMatches = indexContent.match(/"id":\s*"(\d+)"/g) || [];
const maxId = idMatches.reduce((max, m) => {
  const num = parseInt(m.match(/\d+/)[0]);
  return num > max ? num : max;
}, 0);
const newId = String(maxId + 1);

// 3. Build the article entry
const today = new Date().toISOString().split("T")[0];
const entry = {
  id: newId,
  slug: meta.slug,
  title: meta.title,
  excerpt: meta.description,
  image: meta.image || `/images/categories/${meta.category}.webp`,
  category: meta.category,
  categoryLabel: meta.categoryLabel,
  authorSlug: meta.authorSlug,
  readingTime: meta.readingTime || 6,
  publishedAt: today,
  modifiedAt: today,
  faqs: meta.faqs || []
};

// 4. Append to index.ts (before the closing ];)
const entryJson = JSON.stringify(entry, null, 4);
const insertPoint = indexContent.lastIndexOf("];");
if (insertPoint === -1) {
  console.error("Could not find ]; in index.ts");
  process.exit(1);
}

// Add import for content
const importLine = `import ${meta.slug.replace(/-/g, "_")}_content from "./content/${meta.slug}.json";\n`;
const contentImportPoint = indexContent.indexOf("const _rawArticles");

let newIndexContent = indexContent.slice(0, contentImportPoint) +
  importLine +
  indexContent.slice(contentImportPoint, insertPoint) +
  ",\n  " + entryJson + "\n" +
  indexContent.slice(insertPoint);

writeFileSync(INDEX_FILE, newIndexContent);

// 5. Regenerate sitemap + RSS
try {
  execSync("node scripts/generate-seo.mjs", { cwd: ROOT, stdio: "inherit" });
} catch (e) {
  console.warn("SEO generation warning:", e.message);
}

// 6. Move to published/
renameSync(entryDir, join(PUBLISHED_DIR, nextEntry));

// 7. Output for GitHub Actions
const remaining = entries.length - 1;
console.log(`\nPublished: ${meta.title}`);
console.log(`URL: https://www.femradd.com/artikull/${meta.slug}`);
console.log(`Remaining in queue: ${remaining}`);

if (process.env.GITHUB_OUTPUT) {
  const outputs = [
    `published=true`,
    `title=${meta.title}`,
    `slug=${meta.slug}`,
    `category=${meta.categoryLabel}`,
    `remaining=${remaining}`,
    `url=https://www.femradd.com/artikull/${meta.slug}`,
  ].join("\n") + "\n";
  writeFileSync(process.env.GITHUB_OUTPUT, outputs, { flag: "a" });
}
