#!/usr/bin/env node
/**
 * Download article featured images from Pexels API (free, professional photos).
 *
 * Uses category-aware search queries to find relevant stock photos.
 * Smart image reuse: horoscope by zodiac sign, weather by city, TV shared.
 *
 * Run: PEXELS_KEY=xxx node scripts/generate-images.mjs
 *
 * Options:
 *   --start=N        Start from article index N (0-based, default 0)
 *   --limit=N        Process only N articles (default: all)
 *   --dry-run        Print search queries without downloading
 *   --concurrency=N  Concurrent downloads (default 3)
 *   --force          Re-download even if image exists
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync, statSync } from "fs";
import { join } from "path";

const ROOT = new URL("..", import.meta.url).pathname;
const INDEX_PATH = join(ROOT, "src/data/articles/index.ts");
const IMAGES_DIR = join(ROOT, "public/images/articles");
const SHARED_DIR = join(ROOT, "public/images/shared");

const PEXELS_KEY = process.env.PEXELS_KEY;
const PEXELS_API = "https://api.pexels.com/v1/search";

// Parse CLI args
const args = process.argv.slice(2);
const getArg = (name) => {
  const arg = args.find((a) => a.startsWith(`--${name}=`));
  return arg ? arg.split("=")[1] : null;
};
const START = parseInt(getArg("start") || "0", 10);
const LIMIT = parseInt(getArg("limit") || "999999", 10);
const DRY_RUN = args.includes("--dry-run");
const FORCE = args.includes("--force");
const CONCURRENCY = parseInt(getArg("concurrency") || "3", 10);

if (!PEXELS_KEY && !DRY_RUN) {
  console.error("ERROR: PEXELS_KEY environment variable required.");
  console.error("Get a free key at: https://www.pexels.com/api/");
  console.error("Usage: PEXELS_KEY=xxx node scripts/generate-images.mjs");
  process.exit(1);
}

// Ensure output directories exist
mkdirSync(IMAGES_DIR, { recursive: true });
mkdirSync(SHARED_DIR, { recursive: true });

/* ── Zodiac signs for horoscope image reuse ───────────────────────── */

const zodiacSigns = {
  dashi: "aries", demi: "taurus", binjaket: "gemini", gaforja: "cancer",
  luani: "leo", virgjeresha: "virgo", peshorja: "libra", akrepi: "scorpio",
  shigjetari: "sagittarius", bricjapi: "capricorn", ujori: "aquarius", peshqit: "pisces",
};

// Pexels search queries per zodiac sign
const zodiacQueries = {
  aries: "fire stars constellation sky",
  taurus: "earth nature green field stars",
  gemini: "twin stars mirror reflection sky",
  cancer: "moon ocean night silver",
  leo: "golden sun lion fire",
  virgo: "wheat field flowers nature harvest",
  libra: "balance scales golden sunset",
  scorpio: "dark red mysterious water night",
  sagittarius: "arrow sky adventure mountain",
  capricorn: "mountain peak snow ambitious",
  aquarius: "water waves blue sky ocean",
  pisces: "ocean fish water blue dreamy",
};

/* ── City map for weather article reuse ───────────────────────────── */

const cityMap = {
  "prishtine": "prishtina", "prishtinë": "prishtina", "prishtina": "prishtina",
  "tirane": "tirana", "tiranë": "tirana", "tirana": "tirana",
  "shkoder": "shkodra", "shkodër": "shkodra", "shkodra": "shkodra",
  "durres": "durres", "durrës": "durres",
  "vlore": "vlora", "vlorë": "vlora", "vlora": "vlora",
  "elbasan": "elbasan",
  "korce": "korca", "korçë": "korca", "korça": "korca",
  "berat": "berat",
  "fier": "fier",
  "lushnje": "lushnja", "lushnjë": "lushnja",
  "gjakove": "gjakova", "gjakovë": "gjakova", "gjakova": "gjakova",
  "peje": "peja", "pejë": "peja", "peja": "peja",
  "prizren": "prizren",
  "ferizaj": "ferizaj",
  "mitrovice": "mitrovica", "mitrovicë": "mitrovica",
  "gjilan": "gjilan",
  "sarande": "saranda", "sarandë": "saranda",
  "pogradec": "pogradec",
  "permet": "permeti", "përmet": "permeti",
  "kukes": "kukesi", "kukës": "kukesi",
  "kline": "klina", "klinë": "klina",
  "tropoje": "tropoja", "tropojë": "tropoja",
  "kavaje": "kavaja", "kavajë": "kavaja",
  "lezhe": "lezha", "lezhë": "lezha",
  "kruje": "kruja", "krujë": "kruja",
  "bulqize": "bulqiza", "bulqizë": "bulqiza",
  "shqiperi": "albania", "shqipëri": "albania",
  "kosove": "kosovo", "kosovë": "kosovo",
};

// City-specific Pexels queries
const cityQueries = {
  tirana: "tirana albania city",
  prishtina: "pristina city balkan",
  shkodra: "shkodra lake albania",
  durres: "durres beach albania coast",
  vlora: "vlora beach albania sea",
  elbasan: "elbasan albania city",
  korca: "korce albania city",
  berat: "berat albania castle city",
  fier: "albania city landscape",
  lushnja: "albania countryside landscape",
  gjakova: "gjakova kosovo bazaar",
  peja: "peja kosovo mountains",
  prizren: "prizren kosovo city castle",
  ferizaj: "kosovo city landscape",
  mitrovica: "kosovo city river",
  gjilan: "kosovo city landscape",
  saranda: "saranda albania beach coast",
  pogradec: "ohrid lake albania",
  permeti: "permet albania river canyon",
  kukesi: "kukes albania lake",
  klina: "kosovo landscape valley",
  tropoja: "tropoja albania mountains alps",
  kavaja: "albania coast beach",
  lezha: "lezha albania city castle",
  kruja: "kruja albania castle mountain",
  bulqiza: "albania mountains mining",
  albania: "albania landscape mountains",
  kosovo: "kosovo landscape city",
};

/* ── Determine shared vs unique image ─────────────────────────────── */

function getSharedImageInfo(title, category) {
  const lower = title.toLowerCase();

  // Horoscopes: share by zodiac sign
  if (category === "horoskopi") {
    for (const [alb, eng] of Object.entries(zodiacSigns)) {
      if (lower.includes(alb)) {
        return {
          sharedKey: `zodiac-${eng}`,
          query: zodiacQueries[eng] || "zodiac constellation stars",
        };
      }
    }
    return {
      sharedKey: "zodiac-general",
      query: "zodiac constellation stars galaxy purple",
    };
  }

  // Weather: share by city
  if (category === "moti") {
    for (const [variant, normalized] of Object.entries(cityMap)) {
      if (lower.includes(variant)) {
        return {
          sharedKey: `city-${normalized}`,
          query: cityQueries[normalized] || "albania city landscape weather",
        };
      }
    }
    return {
      sharedKey: "city-general",
      query: "albania landscape mountains dramatic sky",
    };
  }

  // TV: all share one image
  if (category === "tv-shqip") {
    return {
      sharedKey: "tv-studio",
      query: "modern television studio screens broadcast",
    };
  }

  return null; // Unique image needed
}

/* ── Category search queries (for unique images) ──────────────────── */

function generateSearchQuery(title, category) {
  const lower = title.toLowerCase();

  switch (category) {
    case "udhetime": {
      const place = title.replace(/^(Si të|Çfarë|Ku|Pse|Plazhi|Shpella)\s+/i, "").replace(/\s*[-–:].*/g, "").trim();
      if (lower.includes("plazh")) return "beautiful beach travel vacation";
      if (lower.includes("shpell")) return "cave nature adventure underground";
      if (lower.includes("mal")) return "mountain hiking travel landscape";
      if (lower.includes("liqen")) return "lake nature landscape peaceful";
      return `travel ${place} landscape beautiful`;
    }

    case "dashuri":
      if (lower.includes("mesazh") || lower.includes("fjal") || lower.includes("let")) return "love letter romantic vintage roses";
      if (lower.includes("takime") || lower.includes("dating")) return "romantic couple date coffee";
      if (lower.includes("martesa") || lower.includes("fejes")) return "wedding rings romantic elegant";
      return "romantic couple love warm coffee";

    case "personale":
      if (lower.includes("sukses") || lower.includes("produktiv")) return "success productivity workspace laptop notebook";
      if (lower.includes("introvert")) return "peaceful solitude reading cozy window";
      if (lower.includes("emocional") || lower.includes("mental")) return "mental health mindfulness calm peaceful";
      if (lower.includes("motivim") || lower.includes("frymëzim")) return "inspiration motivation sunrise mountain";
      if (lower.includes("zakon") || lower.includes("rutinë")) return "morning routine healthy lifestyle journal";
      if (lower.includes("grat") || lower.includes("femr") || lower.includes("vajz")) return "empowered woman confidence professional";
      if (lower.includes("vetbesim") || lower.includes("besim")) return "confidence self-love mirror empowerment";
      return "personal development journal flowers tea";

    case "kuriozitete":
      if (lower.includes("hapësir") || lower.includes("planet")) return "space nebula galaxy stars deep";
      if (lower.includes("kafsh") || lower.includes("natyr")) return "exotic animal nature wildlife close-up";
      if (lower.includes("histori")) return "antique vintage history old books map";
      if (lower.includes("shkenc")) return "science laboratory experiment colorful";
      if (lower.includes("det") || lower.includes("oqean")) return "deep ocean underwater marine life";
      if (lower.includes("trup") || lower.includes("tru")) return "human brain neuroscience medical";
      return "curiosity discovery magnifying glass vintage books";

    case "argetim":
      if (lower.includes("big brother") || lower.includes("serial") || lower.includes("film")) return "television entertainment popcorn movie night";
      if (lower.includes("fjal") || lower.includes("thëni") || lower.includes("urt")) return "wisdom quotes vintage books typewriter";
      if (lower.includes("mesazh")) return "text message phone communication hearts";
      if (lower.includes("quiz") || lower.includes("test")) return "quiz game fun colorful questions";
      if (lower.includes("muzik")) return "music headphones vinyl records colorful";
      return "entertainment fun celebration colorful confetti";

    case "lifestyle":
      if (lower.includes("mode") || lower.includes("vesh") || lower.includes("stil")) return "fashion style outfit accessories elegant";
      if (lower.includes("bukur") || lower.includes("kujdes") || lower.includes("lëkur")) return "skincare beauty products self-care";
      if (lower.includes("shtëpi") || lower.includes("dekor")) return "interior design modern home decoration";
      return "lifestyle flatlay coffee fashion accessories marble";

    case "grate-shqiptare":
      if (lower.includes("biografi")) return "spotlight stage achievement golden elegant";
      return "women empowerment achievement golden spotlight podium";

    case "letersi":
      if (lower.includes("poezi") || lower.includes("poem")) return "poetry book open vintage roses quill pen";
      return "vintage books literary classic roses antique";

    case "te-ndryshme":
      if (lower.includes("familj") || lower.includes("fëmij")) return "family home cozy warm children toys";
      if (lower.includes("shëndet") || lower.includes("ushqim") || lower.includes("dieta")) return "healthy food colorful fruits vegetables";
      if (lower.includes("pun") || lower.includes("karrier")) return "professional workspace career modern office";
      if (lower.includes("teknologji") || lower.includes("internet")) return "technology smartphone modern digital";
      if (lower.includes("ëndërr") || lower.includes("gjum")) return "dreamy bedroom peaceful sleep moon night";
      if (lower.includes("festë") || lower.includes("bajram") || lower.includes("vit")) return "celebration festive holiday decorations";
      if (lower.includes("recet") || lower.includes("gatim")) return "cooking recipe kitchen food preparation";
      return "abstract modern geometric art warm colors";

    default:
      return "beautiful feminine lifestyle magazine aesthetic";
  }
}

/* ── Pexels API search + download ─────────────────────────────────── */

// Track used photo IDs to avoid duplicates across articles
const usedPhotoIds = new Set();

async function searchPexels(query, perPage = 15) {
  const url = `${PEXELS_API}?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape&size=large`;

  const res = await fetch(url, {
    headers: { Authorization: PEXELS_KEY },
  });

  if (res.status === 429) {
    throw new Error("RATE_LIMIT");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Pexels API ${res.status}: ${text.slice(0, 100)}`);
  }

  const data = await res.json();
  return data.photos || [];
}

function pickBestPhoto(photos) {
  // Pick first unused photo that's landscape orientation
  for (const photo of photos) {
    if (!usedPhotoIds.has(photo.id) && photo.width >= photo.height) {
      usedPhotoIds.add(photo.id);
      return photo;
    }
  }
  // If all used, just pick the first landscape one
  for (const photo of photos) {
    if (photo.width >= photo.height) {
      return photo;
    }
  }
  // Fallback: pick any
  return photos[0] || null;
}

async function downloadPhoto(photo, outputPath, retries = 3) {
  // Use the "large2x" size (1280px wide) — good for blog headers
  const url = photo.src.large2x || photo.src.large || photo.src.original;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length < 5000) throw new Error(`Image too small: ${buffer.length}b`);

      writeFileSync(outputPath, buffer);
      return buffer.length;
    } catch (err) {
      if (attempt === retries) throw err;
      console.log(`    Retry download ${attempt}/${retries}: ${err.message.slice(0, 60)}`);
      await sleep(2000);
    }
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/* ── Process single article ───────────────────────────────────────── */

async function processArticle(article) {
  const { slug, title, category } = article;
  const outputPath = join(IMAGES_DIR, `${slug}.jpg`);

  // Skip if already exists (unless --force)
  if (!FORCE && existsSync(outputPath) && statSync(outputPath).size > 5000) {
    return { slug, status: "skipped", path: outputPath };
  }

  // Check if this article can reuse a shared image
  const shared = getSharedImageInfo(title, category);

  if (shared) {
    const sharedPath = join(SHARED_DIR, `${shared.sharedKey}.jpg`);

    // Generate shared image if it doesn't exist yet
    if (!existsSync(sharedPath) || (FORCE && statSync(sharedPath).size < 5000)) {
      if (DRY_RUN) {
        return { slug, status: "dry-run", shared: shared.sharedKey, query: shared.query };
      }

      console.log(`  [shared] Searching: "${shared.query}" → ${shared.sharedKey}`);
      try {
        const photos = await searchPexels(shared.query);
        const photo = pickBestPhoto(photos);
        if (!photo) {
          return { slug, status: "error", error: `No photos for query: ${shared.query}` };
        }
        const size = await downloadPhoto(photo, sharedPath);
        console.log(`  [shared] Downloaded ${shared.sharedKey} (${(size / 1024).toFixed(0)}KB) — Pexels #${photo.id}`);
      } catch (err) {
        if (err.message === "RATE_LIMIT") throw err; // Bubble up rate limits
        return { slug, status: "error", error: `Shared ${shared.sharedKey}: ${err.message}` };
      }
    }

    // Copy shared image to article-specific path
    if (!DRY_RUN) {
      copyFileSync(sharedPath, outputPath);
      const size = statSync(outputPath).size;
      return { slug, status: "ok", path: outputPath, shared: shared.sharedKey, size };
    }
    return { slug, status: "dry-run", shared: shared.sharedKey, query: shared.query };
  }

  // Unique image — search and download
  const query = generateSearchQuery(title, category);

  if (DRY_RUN) {
    return { slug, status: "dry-run", query };
  }

  try {
    const photos = await searchPexels(query);
    const photo = pickBestPhoto(photos);
    if (!photo) {
      // Fallback: try a broader query
      const fallbackQuery = category.replace(/-/g, " ") + " lifestyle";
      console.log(`  No results for "${query}", trying "${fallbackQuery}"`);
      const fallbackPhotos = await searchPexels(fallbackQuery);
      const fallbackPhoto = pickBestPhoto(fallbackPhotos);
      if (!fallbackPhoto) {
        return { slug, status: "error", error: `No photos for: ${query} or ${fallbackQuery}` };
      }
      const size = await downloadPhoto(fallbackPhoto, outputPath);
      return { slug, status: "ok", path: outputPath, size, pexelsId: fallbackPhoto.id, query: fallbackQuery };
    }
    const size = await downloadPhoto(photo, outputPath);
    return { slug, status: "ok", path: outputPath, size, pexelsId: photo.id, query };
  } catch (err) {
    if (err.message === "RATE_LIMIT") throw err;
    return { slug, status: "error", error: err.message };
  }
}

/* ── Batch processing with concurrency + rate limit handling ──────── */

async function processBatch(tasks, concurrency) {
  const results = [];
  let index = 0;
  let rateLimitPause = false;

  async function worker(workerId) {
    while (index < tasks.length) {
      // If rate limited, all workers pause
      if (rateLimitPause) {
        await sleep(1000);
        continue;
      }

      const i = index++;
      try {
        const result = await tasks[i]();
        results.push(result);
      } catch (err) {
        if (err.message === "RATE_LIMIT") {
          rateLimitPause = true;
          console.log(`\n⚠ Rate limited! Pausing all workers for 60s...\n`);
          await sleep(60000);
          rateLimitPause = false;
          index = i; // Re-try this task
          continue;
        }
        results.push({ slug: "unknown", status: "error", error: err.message });
      }
      // Respectful delay between requests (200 req/hr = ~1 per 18s, but burst OK)
      await sleep(800);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, (_, i) => worker(i));
  await Promise.all(workers);
  return results;
}

/* ── Main execution ─────────────────────────────────────────────── */

async function main() {
  console.log("=== Generating article images via Pexels API ===");
  console.log("    (Professional stock photos, landscape orientation)\n");

  // Parse article metadata from index.ts
  const indexSrc = readFileSync(INDEX_PATH, "utf-8");
  const articles = [];
  const blockRe = /\{[^{}]*?"id":\s*"(\d+)"[\s\S]*?\}/g;
  let blockMatch;

  while ((blockMatch = blockRe.exec(indexSrc)) !== null) {
    const block = blockMatch[0];
    const id = block.match(/"id":\s*"(\d+)"/)?.[1];
    const slug = block.match(/"slug":\s*"([^"]+)"/)?.[1];
    const title = block.match(/"title":\s*"([^"]+)"/)?.[1];
    const category = block.match(/"category":\s*"([^"]+)"/)?.[1];
    if (id && slug && title && category) {
      articles.push({ id, slug, title, category });
    }
  }

  const subset = articles.slice(START, START + LIMIT);
  console.log(`Total articles found: ${articles.length}`);
  console.log(`Processing: ${subset.length} (from index ${START})`);
  console.log(`Concurrency: ${CONCURRENCY}`);
  console.log(`Force re-download: ${FORCE}\n`);

  // Count shared vs unique
  let sharedCount = 0;
  let uniqueCount = 0;
  const sharedKeys = new Set();
  for (const a of subset) {
    const shared = getSharedImageInfo(a.title, a.category);
    if (shared) {
      sharedCount++;
      sharedKeys.add(shared.sharedKey);
    } else {
      uniqueCount++;
    }
  }
  console.log(`Image strategy:`);
  console.log(`  ${uniqueCount} unique images (1 per article)`);
  console.log(`  ${sharedCount} articles reusing ${sharedKeys.size} shared images`);
  console.log(`  → ~${uniqueCount + sharedKeys.size} total Pexels API calls needed\n`);

  // Build task list
  const tasks = subset.map((a, i) => async () => {
    const num = START + i + 1;
    const shared = getSharedImageInfo(a.title, a.category);
    const label = shared ? `→ shared:${shared.sharedKey}` : "";
    console.log(`[${num}/${START + subset.length}] ${a.slug} (${a.category}) ${label}`);
    return processArticle(a);
  });

  // Process with concurrency
  const results = await processBatch(tasks, CONCURRENCY);

  // Summary
  const ok = results.filter((r) => r.status === "ok");
  const skipped = results.filter((r) => r.status === "skipped");
  const errors = results.filter((r) => r.status === "error");
  const dryRuns = results.filter((r) => r.status === "dry-run");

  console.log("\n=== Summary ===");
  if (DRY_RUN) {
    console.log(`Dry run: ${dryRuns.length} articles analyzed (no downloads)`);
    console.log(`\nSample queries:`);
    for (const r of dryRuns.slice(0, 10)) {
      console.log(`  ${r.slug}: "${r.query}"${r.shared ? ` (shared: ${r.shared})` : ""}`);
    }
    return;
  }

  console.log(`Downloaded: ${ok.length}`);
  console.log(`Skipped (already exist): ${skipped.length}`);
  console.log(`Errors: ${errors.length}`);

  // Shared image stats
  const sharedUsed = ok.filter((r) => r.shared);
  const uniqueGenerated = ok.filter((r) => !r.shared);
  if (sharedUsed.length > 0) {
    const uniqueSharedImages = new Set(sharedUsed.map((r) => r.shared));
    console.log(`\nShared images: ${sharedUsed.length} articles used ${uniqueSharedImages.size} unique shared images`);
  }
  if (uniqueGenerated.length > 0) {
    console.log(`Unique images downloaded: ${uniqueGenerated.length}`);
  }

  if (errors.length > 0) {
    console.log("\nFailed articles:");
    for (const e of errors) {
      console.log(`  ${e.slug}: ${e.error}`);
    }
  }

  if (ok.length > 0) {
    const totalSize = ok.reduce((sum, r) => sum + (r.size || 0), 0);
    console.log(`\nTotal size: ${(totalSize / 1024 / 1024).toFixed(1)} MB`);
    console.log(`Avg size: ${ok.length > 0 ? (totalSize / ok.length / 1024).toFixed(0) : 0} KB`);
  }

  // Update article index with new image paths
  const toUpdate = [...ok, ...skipped].filter((r) => r.path);
  if (toUpdate.length > 0) {
    console.log("\nUpdating articles/index.ts with new image paths...");
    let newIndex = readFileSync(INDEX_PATH, "utf-8");
    let updatedCount = 0;

    for (const r of toUpdate) {
      const newImagePath = `/images/articles/${r.slug}.jpg`;
      const slugEscaped = r.slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const re = new RegExp(
        `("slug":\\s*"${slugEscaped}"[\\s\\S]*?"image":\\s*)"[^"]*"`,
        "m"
      );
      if (re.test(newIndex)) {
        newIndex = newIndex.replace(re, `$1"${newImagePath}"`);
        updatedCount++;
      }
    }

    if (updatedCount > 0) {
      writeFileSync(INDEX_PATH, newIndex);
      console.log(`Updated ${updatedCount} image paths in index.ts`);
    }
  }

  console.log("\nDone!");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
