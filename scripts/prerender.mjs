#!/usr/bin/env node
/**
 * prerender.mjs
 * Post-build script that pre-renders all routes using Playwright.
 * Produces static HTML files with full content, meta tags, and JSON-LD
 * so search engines can crawl the site without JavaScript.
 *
 * Usage: node scripts/prerender.mjs
 * (Run after `vite build` — typically chained via `npm run build`)
 */

import { createServer } from "node:http";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { getAllRoutes } from "./routes.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, "..", "dist");
const CONCURRENCY = 8;
const PAGE_TIMEOUT = 15_000; // 15 seconds per page

// MIME types for the static server
const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain",
};

/**
 * Start a simple static file server for the dist directory.
 * Returns { server, port, close() }.
 */
function startServer() {
  return new Promise((res) => {
    const server = createServer((req, resp) => {
      let urlPath = req.url.split("?")[0];
      // Try exact file, then index.html fallback (SPA)
      let filePath = join(DIST, urlPath);
      if (!extname(filePath)) {
        const tryIndex = join(filePath, "index.html");
        if (existsSync(tryIndex)) {
          filePath = tryIndex;
        } else {
          filePath = join(DIST, "index.html"); // SPA fallback
        }
      }

      if (!existsSync(filePath)) {
        // SPA fallback for all unmatched routes
        filePath = join(DIST, "index.html");
      }

      try {
        const data = readFileSync(filePath);
        const ext = extname(filePath);
        resp.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
        resp.end(data);
      } catch {
        resp.writeHead(404);
        resp.end("Not Found");
      }
    });

    // Listen on port 0 = OS picks a random available port
    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      res({ server, port, close: () => server.close() });
    });
  });
}

/**
 * Pre-render a single route.
 */
async function prerenderRoute(browser, baseUrl, route) {
  const context = await browser.newContext({
    javaScriptEnabled: true,
  });

  const page = await context.newPage();

  // Override IntersectionObserver so FadeIn components render immediately
  await page.addInitScript(() => {
    window.IntersectionObserver = class {
      constructor(cb) {
        this._cb = cb;
      }
      observe(el) {
        // Immediately report as intersecting
        this._cb([{ isIntersecting: true, target: el, intersectionRatio: 1 }], this);
      }
      unobserve() {}
      disconnect() {}
    };
  });

  const url = `${baseUrl}${route}`;
  await page.goto(url, { waitUntil: "networkidle", timeout: PAGE_TIMEOUT });

  // Wait for page-specific content to render
  const isArticle = route.startsWith("/artikull/");

  try {
    if (isArticle) {
      // Wait for the article prose content to load (async import)
      await page.waitForSelector("article.prose", { timeout: PAGE_TIMEOUT });
      // Also wait for JSON-LD structured data
      await page.waitForSelector('script[type="application/ld+json"]', { timeout: 5_000 });
    }

    // Wait for meta description to be set by PageHead component
    // (default in index.html is the site-level description)
    await page.waitForFunction(
      () => {
        const desc = document.querySelector('meta[name="description"]');
        return desc && desc.content && desc.content.length > 10;
      },
      { timeout: 5_000 }
    );
  } catch {
    // If waiting times out, proceed with whatever rendered
  }

  // Small extra settle time for React state updates
  await page.waitForTimeout(200);

  // Get the full rendered HTML
  const html = await page.content();

  await context.close();

  // Determine output path
  let outPath;
  if (route === "/") {
    outPath = join(DIST, "index.html");
  } else {
    const dir = join(DIST, route.slice(1)); // remove leading /
    mkdirSync(dir, { recursive: true });
    outPath = join(dir, "index.html");
  }

  writeFileSync(outPath, html, "utf-8");
  return outPath;
}

/**
 * Process routes in batches with concurrency.
 */
async function processInBatches(browser, baseUrl, routes, concurrency) {
  let completed = 0;
  let failed = 0;
  const total = routes.length;

  for (let i = 0; i < routes.length; i += concurrency) {
    const batch = routes.slice(i, i + concurrency);
    const results = await Promise.allSettled(
      batch.map((route) => prerenderRoute(browser, baseUrl, route))
    );

    for (let j = 0; j < results.length; j++) {
      if (results[j].status === "fulfilled") {
        completed++;
      } else {
        failed++;
        console.error(`  \u2717 ${batch[j]}: ${results[j].reason?.message || "Unknown error"}`);
      }
    }

    // Progress update every batch
    const pct = Math.round(((completed + failed) / total) * 100);
    process.stdout.write(`\r  Pre-rendering: ${completed + failed}/${total} (${pct}%) — ${failed} errors`);
  }

  console.log(); // newline after progress
  return { completed, failed };
}

// Main
async function main() {
  console.log("\n\ud83d\ude80 Pre-rendering site for SEO...\n");

  // Check dist exists
  if (!existsSync(DIST)) {
    console.error("Error: dist/ directory not found. Run `vite build` first.");
    process.exit(1);
  }

  // Get all routes
  const routes = getAllRoutes();
  console.log(`  Found ${routes.length} routes to pre-render`);

  // Start static server
  const { port, close } = await startServer();
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`  Static server on port ${port}`);

  // Launch browser
  console.log("  Launching Chromium...");
  const browser = await chromium.launch({ headless: true });

  const startTime = Date.now();

  try {
    const { completed, failed } = await processInBatches(browser, baseUrl, routes, CONCURRENCY);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log(`\n\u2705 Pre-rendering complete!`);
    console.log(`  ${completed} pages rendered, ${failed} errors`);
    console.log(`  Time: ${elapsed}s (${(routes.length / (elapsed || 1)).toFixed(0)} pages/sec)\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } finally {
    await browser.close();
    close();
  }
}

main().catch((err) => {
  console.error("Pre-rendering failed:", err);
  process.exit(1);
});
