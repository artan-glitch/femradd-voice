#!/usr/bin/env node
/**
 * convert-webp.mjs
 * Converts all JPG/PNG images in public/images/ to WebP format.
 * Also updates all references in src/data/ files from .jpg/.png to .webp.
 *
 * Usage: node scripts/convert-webp.mjs
 *   --dry-run   Show what would be done without making changes
 *   --quality N  WebP quality (default: 82)
 */

import { readFileSync, writeFileSync, readdirSync, statSync, unlinkSync, existsSync } from "node:fs";
import { resolve, dirname, extname, basename, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const qualityIdx = args.indexOf("--quality");
const QUALITY = qualityIdx !== -1 ? parseInt(args[qualityIdx + 1], 10) : 82;

// Dynamically import sharp
const sharp = (await import("sharp")).default;

/**
 * Recursively find all files matching extensions in a directory.
 */
function findFiles(dir, extensions) {
  const results = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...findFiles(fullPath, extensions));
    } else if (extensions.includes(extname(entry).toLowerCase())) {
      results.push(fullPath);
    }
  }
  return results;
}

// 1. Find all JPG/PNG images in public/images/
const imagesDir = resolve(ROOT, "public/images");
const imageFiles = findFiles(imagesDir, [".jpg", ".jpeg", ".png"]);
console.log(`Found ${imageFiles.length} images to convert\n`);

let converted = 0;
let totalOriginalSize = 0;
let totalWebpSize = 0;

for (const imgPath of imageFiles) {
  const ext = extname(imgPath);
  const webpPath = imgPath.replace(/\.(jpg|jpeg|png)$/i, ".webp");
  const relativePath = imgPath.replace(ROOT + "/", "");

  const originalSize = statSync(imgPath).size;
  totalOriginalSize += originalSize;

  if (DRY_RUN) {
    console.log(`  [dry-run] ${relativePath} → .webp`);
    converted++;
    continue;
  }

  try {
    // Convert to WebP
    const buffer = await sharp(imgPath)
      .webp({ quality: QUALITY, effort: 4 })
      .toBuffer();

    writeFileSync(webpPath, buffer);
    const webpSize = buffer.length;
    totalWebpSize += webpSize;

    const savings = ((1 - webpSize / originalSize) * 100).toFixed(1);
    console.log(`  ✓ ${relativePath} → .webp (${(originalSize / 1024).toFixed(0)}K → ${(webpSize / 1024).toFixed(0)}K, -${savings}%)`);

    // Remove original file
    unlinkSync(imgPath);
    converted++;
  } catch (err) {
    console.error(`  ✗ ${relativePath}: ${err.message}`);
  }
}

console.log(`\nConverted ${converted}/${imageFiles.length} images`);
if (!DRY_RUN && totalOriginalSize > 0) {
  const totalSavings = ((1 - totalWebpSize / totalOriginalSize) * 100).toFixed(1);
  console.log(`Total: ${(totalOriginalSize / 1024 / 1024).toFixed(1)}MB → ${(totalWebpSize / 1024 / 1024).toFixed(1)}MB (-${totalSavings}%)`);
}

// 2. Update references in source code files
console.log("\nUpdating image references in source files...");

const srcDataDir = resolve(ROOT, "src/data");
const srcFiles = findFiles(srcDataDir, [".ts", ".tsx"]);
// Also check components and pages
srcFiles.push(...findFiles(resolve(ROOT, "src/components"), [".ts", ".tsx"]));
srcFiles.push(...findFiles(resolve(ROOT, "src/pages"), [".ts", ".tsx"]));

let filesUpdated = 0;

for (const filePath of srcFiles) {
  const original = readFileSync(filePath, "utf-8");
  // Replace .jpg, .jpeg, .png references in image paths
  const updated = original
    .replace(/\/images\/([\w\-\/]+)\.(jpg|jpeg|png)/g, "/images/$1.webp");

  if (updated !== original) {
    const relativePath = filePath.replace(ROOT + "/", "");
    const count = (original.match(/\/images\/([\w\-\/]+)\.(jpg|jpeg|png)/g) || []).length;
    if (DRY_RUN) {
      console.log(`  [dry-run] ${relativePath}: ${count} references`);
    } else {
      writeFileSync(filePath, updated, "utf-8");
      console.log(`  ✓ ${relativePath}: ${count} references updated`);
    }
    filesUpdated++;
  }
}

console.log(`\nUpdated ${filesUpdated} source files`);
if (DRY_RUN) console.log("\n⚠ Dry run — no changes were made. Run without --dry-run to apply.");
else console.log("\n✅ Done! All images converted to WebP and references updated.");
