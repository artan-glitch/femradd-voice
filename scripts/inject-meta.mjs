#!/usr/bin/env node
/**
 * inject-meta.mjs — Full static HTML pre-renderer (no browser needed)
 *
 * Generates complete HTML pages with:
 * - Correct meta tags (title, description, canonical, OG, Twitter)
 * - Full article content in the body (H1, paragraphs, links)
 * - Navigation links (fixes "no outgoing links")
 * - Related articles per page (fixes orphan pages)
 * - Proper hreflang tags
 * - JSON-LD structured data
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const SITE = "https://www.femradd.com";

// Read the built index.html as template
const template = readFileSync(resolve(DIST, "index.html"), "utf-8");

// ── Parse data ──────────────────────────────────────────────────────

function extractField(block, field) {
  const re = new RegExp(`"${field}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*?)"`);
  const m = block.match(re);
  return m ? m[1].replace(/\\"/g, '"').replace(/\\n/g, "\n") : null;
}

// Parse articles
const articlesRaw = readFileSync(resolve(ROOT, "src/data/articles/index.ts"), "utf-8");
const articleBlockRe = /\{\s*"id"\s*:\s*"[^"]*"[\s\S]*?"modifiedAt"\s*:\s*"[^"]*"(?:\s*,\s*"faqs"\s*:\s*\[[\s\S]*?\])?\s*\}/g;
const articleBlocks = articlesRaw.match(articleBlockRe) || [];
const articles = articleBlocks.map((block) => ({
  id: extractField(block, "id"),
  slug: extractField(block, "slug"),
  title: extractField(block, "title"),
  excerpt: extractField(block, "excerpt"),
  image: extractField(block, "image"),
  category: extractField(block, "category"),
  categoryLabel: extractField(block, "categoryLabel"),
  authorSlug: extractField(block, "authorSlug"),
  readingTime: extractField(block, "readingTime"),
  publishedAt: extractField(block, "publishedAt"),
  modifiedAt: extractField(block, "modifiedAt"),
}));

// Parse categories
const categoriesRaw = readFileSync(resolve(ROOT, "src/data/categories.ts"), "utf-8");
const catBlockRe = /\{\s*"slug"\s*:\s*"[^"]*"[\s\S]*?"navPriority"\s*:\s*\d+\s*\}/g;
const catBlocks = categoriesRaw.match(catBlockRe) || [];
const categories = catBlocks.map((block) => ({
  slug: extractField(block, "slug"),
  label: extractField(block, "label"),
  description: extractField(block, "description"),
}));

// Parse authors
const authorsRaw = readFileSync(resolve(ROOT, "src/data/authors.ts"), "utf-8");
const authorRe = /slug:\s*"([^"]*)"[\s\S]*?name:\s*"([^"]*)"[\s\S]*?bio:\s*"((?:[^"\\]|\\.)*)"/g;
const authors = [];
for (const m of authorsRaw.matchAll(authorRe)) {
  authors.push({ slug: m[1], name: m[2], bio: m[3].replace(/\\"/g, '"') });
}

// Load article content files
const contentDir = resolve(ROOT, "src/data/articles/content");
function loadContent(slug) {
  const file = resolve(contentDir, `${slug}.json`);
  if (!existsSync(file)) return null;
  try {
    const raw = readFileSync(file, "utf-8");
    return JSON.parse(raw).content || null;
  } catch { return null; }
}

// Group articles by category
const articlesByCategory = {};
for (const a of articles) {
  if (!a.category) continue;
  if (!articlesByCategory[a.category]) articlesByCategory[a.category] = [];
  articlesByCategory[a.category].push(a);
}

// ── HTML helpers ────────────────────────────────────────────────────

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function truncateDesc(str, max = 155) {
  if (!str) return "";
  // Strip HTML tags for description
  const clean = str.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max).replace(/\s+\S*$/, "") + "...";
}

// Navigation HTML (appears on every page)
function navHtml() {
  const catLinks = categories.slice(0, 8).map(c =>
    `<li><a href="/kategori/${c.slug}">${escapeHtml(c.label)}</a></li>`
  ).join("\n");

  return `<nav aria-label="Navigimi kryesor">
  <a href="/" aria-label="FemraDD - Kreu">FemraDD</a>
  <ul>
    ${catLinks}
    <li><a href="/rreth-nesh">Rreth Nesh</a></li>
    <li><a href="/kontakt">Kontakt</a></li>
  </ul>
</nav>`;
}

// Related articles HTML (fixes orphan pages + adds outgoing links)
function relatedArticlesHtml(currentSlug, category, maxItems = 6) {
  const pool = articlesByCategory[category] || articles;
  const related = pool
    .filter(a => a.slug !== currentSlug && a.slug)
    .slice(0, maxItems);

  if (related.length === 0) return "";

  return `<section aria-label="Artikuj të ngjashëm">
  <h2>Artikuj të ngjashëm</h2>
  <ul>
    ${related.map(a => `<li><a href="/artikull/${a.slug}">${escapeHtml(a.title)}</a></li>`).join("\n    ")}
  </ul>
</section>`;
}

// Footer HTML with links
function footerHtml() {
  return `<footer>
  <nav aria-label="Footer">
    <a href="/">Kreu</a>
    <a href="/artikuj">Artikuj</a>
    <a href="/rreth-nesh">Rreth Nesh</a>
    <a href="/kontakt">Kontakt</a>
    <a href="/privatesia">Privatësia</a>
    <a href="/kushtet">Kushtet</a>
    <a href="/redaksia">Redaksia</a>
  </nav>
  <p>&copy; 2025 FemraDD. Të gjitha të drejtat e rezervuara.</p>
</footer>`;
}

// Albanian month names for dates
const MONTHS_SQ = ["Janar","Shkurt","Mars","Prill","Maj","Qershor","Korrik","Gusht","Shtator","Tetor","Nëntor","Dhjetor"];
function formatDateAlbanian(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getDate()} ${MONTHS_SQ[d.getMonth()]} ${d.getFullYear()}`;
}

// ── Meta injection ──────────────────────────────────────────────────

function injectMeta(html, { title, description, url, image, type = "website", author, publishedAt, modifiedAt }) {
  const fullTitle = title.includes("FemraDD") ? title : `${title} — FemraDD`;
  const ogImage = image ? (image.startsWith("http") ? image : `${SITE}${image}`) : `${SITE}/og-image.png`;
  const desc = truncateDesc(description);

  let result = html;

  // Replace title
  result = result.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(fullTitle)}</title>`);

  // Replace meta description
  result = result.replace(
    /(<meta name="description" content=")[^"]*(")/,
    `$1${escapeHtml(desc)}$2`
  );

  // Add author meta if available
  if (author) {
    result = result.replace(
      /(<meta name="author" content=")[^"]*(")/,
      `$1${escapeHtml(author)}$2`
    );
  }

  // Replace canonical
  result = result.replace(
    /(<link rel="canonical" href=")[^"]*(")/,
    `$1${url}$2`
  );

  // Replace og tags
  result = result.replace(/(<meta property="og:title" content=")[^"]*(")/,`$1${escapeHtml(fullTitle)}$2`);
  result = result.replace(/(<meta property="og:description" content=")[^"]*(")/,`$1${escapeHtml(desc)}$2`);
  result = result.replace(/(<meta property="og:url" content=")[^"]*(")/,`$1${url}$2`);
  result = result.replace(/(<meta property="og:image" content=")[^"]*(")/,`$1${ogImage}$2`);
  result = result.replace(/(<meta property="og:type" content=")[^"]*(")/,`$1${type}$2`);

  // Replace twitter tags
  result = result.replace(/(<meta name="twitter:title" content=")[^"]*(")/,`$1${escapeHtml(fullTitle)}$2`);
  result = result.replace(/(<meta name="twitter:description" content=")[^"]*(")/,`$1${escapeHtml(desc)}$2`);
  result = result.replace(/(<meta name="twitter:image" content=")[^"]*(")/,`$1${ogImage}$2`);

  // Fix hreflang — ensure correct per-page URLs
  result = result.replace(
    /(<link rel="alternate" hreflang="sq" href=")[^"]*(")/,
    `$1${url}$2`
  );
  result = result.replace(
    /(<link rel="alternate" hreflang="x-default" href=")[^"]*(")/,
    `$1${url}$2`
  );

  return result;
}

// ── Body content injection ──────────────────────────────────────────

function injectBody(html, bodyContent) {
  // Replace <div id="root"></div> with content inside
  return html.replace(
    /<div id="root"><\/div>/,
    `<div id="root">${bodyContent}</div>`
  );
}

// ── Page generators ─────────────────────────────────────────────────

function generateArticlePage(article) {
  const content = loadContent(article.slug);
  const authorObj = authors.find(a => a.slug === article.authorSlug);
  const authorName = authorObj ? authorObj.name : "";

  // Build body HTML
  let body = navHtml();
  body += `\n<main>`;
  body += `\n<article>`;
  body += `\n<header>`;
  body += `\n  <a href="/kategori/${article.category}">${escapeHtml(article.categoryLabel)}</a>`;
  body += `\n  <h1>${escapeHtml(article.title)}</h1>`;
  body += `\n  <p>${escapeHtml(article.excerpt)}</p>`;
  if (authorName) {
    body += `\n  <p>Nga <a href="/autore/${article.authorSlug}">${escapeHtml(authorName)}</a> · ${formatDateAlbanian(article.modifiedAt)} · ${article.readingTime} min lexim</p>`;
  }
  body += `\n</header>`;

  if (article.image) {
    body += `\n<img src="${article.image}" alt="${escapeHtml(article.title)}" width="1200" height="630" loading="lazy">`;
  }

  if (content) {
    body += `\n<div class="prose">${content}</div>`;
  }

  body += `\n</article>`;
  body += `\n${relatedArticlesHtml(article.slug, article.category)}`;
  body += `\n</main>`;
  body += `\n${footerHtml()}`;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": truncateDesc(article.excerpt),
    "image": article.image ? (article.image.startsWith("http") ? article.image : `${SITE}${article.image}`) : undefined,
    "author": authorName ? { "@type": "Person", "name": authorName, "url": `${SITE}/autore/${article.authorSlug}` } : undefined,
    "publisher": { "@type": "Organization", "name": "FemraDD", "url": SITE, "logo": { "@type": "ImageObject", "url": `${SITE}/og-image.png` } },
    "datePublished": article.publishedAt,
    "dateModified": article.modifiedAt,
    "mainEntityOfPage": { "@type": "WebPage", "@id": `${SITE}/artikull/${article.slug}` },
    "url": `${SITE}/artikull/${article.slug}`,
    "inLanguage": "sq",
  };

  let html = injectMeta(template, {
    title: article.title,
    description: article.excerpt,
    url: `${SITE}/artikull/${article.slug}`,
    image: article.image,
    type: "article",
    author: authorName,
    publishedAt: article.publishedAt,
    modifiedAt: article.modifiedAt,
  });

  // Inject JSON-LD before </head>
  html = html.replace(
    "</head>",
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n</head>`
  );

  return injectBody(html, body);
}

function generateCategoryPage(cat) {
  const catArticles = articlesByCategory[cat.slug] || [];

  let body = navHtml();
  body += `\n<main>`;
  body += `\n<h1>${escapeHtml(cat.label)}</h1>`;
  body += `\n<p>${escapeHtml(cat.description || `Artikuj në kategorinë ${cat.label}`)}</p>`;
  body += `\n<ul>`;
  for (const a of catArticles.slice(0, 50)) {
    body += `\n  <li><a href="/artikull/${a.slug}">${escapeHtml(a.title)}</a></li>`;
  }
  body += `\n</ul>`;
  // Cross-link to other categories
  body += `\n<section><h2>Kategoritë tjera</h2><ul>`;
  for (const c of categories) {
    if (c.slug !== cat.slug) {
      body += `\n  <li><a href="/kategori/${c.slug}">${escapeHtml(c.label)}</a></li>`;
    }
  }
  body += `\n</ul></section>`;
  body += `\n</main>`;
  body += `\n${footerHtml()}`;

  const html = injectMeta(template, {
    title: `${cat.label} — Artikuj`,
    description: cat.description || `Shfleto artikujt më të fundit në kategorinë "${cat.label}" në FemraDD.`,
    url: `${SITE}/kategori/${cat.slug}`,
  });

  return injectBody(html, body);
}

function generateAuthorPage(author) {
  const authorArticles = articles.filter(a => a.authorSlug === author.slug).slice(0, 50);

  let body = navHtml();
  body += `\n<main>`;
  body += `\n<h1>${escapeHtml(author.name)}</h1>`;
  body += `\n<p>${escapeHtml(author.bio)}</p>`;
  body += `\n<h2>Artikujt e ${escapeHtml(author.name)}</h2>`;
  body += `\n<ul>`;
  for (const a of authorArticles) {
    body += `\n  <li><a href="/artikull/${a.slug}">${escapeHtml(a.title)}</a></li>`;
  }
  body += `\n</ul>`;
  body += `\n</main>`;
  body += `\n${footerHtml()}`;

  const html = injectMeta(template, {
    title: `${author.name} — Autore`,
    description: truncateDesc(author.bio) || `Lexo artikujt e ${author.name} në FemraDD.`,
    url: `${SITE}/autore/${author.slug}`,
  });

  return injectBody(html, body);
}

function generateHomePage() {
  const latestArticles = articles.slice(0, 20);

  let body = navHtml();
  body += `\n<main>`;
  body += `\n<h1>FemraDD — Revista për Gratë Shqiptare</h1>`;
  body += `\n<p>Revista online e parë kushtuar grave të reja shqiptare. Çdo ditë sjellim artikuj origjinalë për kulturën, dashurinë, stilin e jetesës, argëtimin dhe zhvillimin personal.</p>`;
  body += `\n<section><h2>Artikujt e fundit</h2><ul>`;
  for (const a of latestArticles) {
    body += `\n  <li><a href="/artikull/${a.slug}">${escapeHtml(a.title)}</a> — ${escapeHtml(a.categoryLabel)}</li>`;
  }
  body += `\n</ul></section>`;
  body += `\n<section><h2>Kategoritë</h2><ul>`;
  for (const c of categories) {
    body += `\n  <li><a href="/kategori/${c.slug}">${escapeHtml(c.label)}</a> — ${escapeHtml(c.description)}</li>`;
  }
  body += `\n</ul></section>`;
  body += `\n</main>`;
  body += `\n${footerHtml()}`;

  const html = injectMeta(template, {
    title: "Revista për Gratë Shqiptare | Kulturë, Dashuri & Lifestyle",
    description: "Revista online për gratë e reja shqiptare. Kulturë, dashuri, lifestyle dhe argëtim — frymëzim çdo ditë.",
    url: SITE,
  });

  return injectBody(html, body);
}

function generateStaticPage(route, title, desc, bodyContent) {
  let body = navHtml();
  body += `\n<main>`;
  body += `\n<h1>${escapeHtml(title)}</h1>`;
  body += bodyContent;
  body += `\n</main>`;
  body += `\n${footerHtml()}`;

  const html = injectMeta(template, {
    title,
    description: desc,
    url: `${SITE}${route}`,
  });

  return injectBody(html, body);
}

// ── Write pages ─────────────────────────────────────────────────────

function writePage(route, html) {
  const dir = resolve(DIST, route.replace(/^\//, ""));
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, "index.html"), html, "utf-8");
}

let count = 0;
let errors = 0;

// Homepage
try {
  const homeHtml = generateHomePage();
  // Don't overwrite dist/index.html directly, write to a temp then copy
  writeFileSync(resolve(DIST, "index.html"), homeHtml, "utf-8");
  count++;
} catch (e) {
  console.error("Error generating homepage:", e.message);
  errors++;
}

// Static pages
const staticPages = [
  { route: "/artikuj", title: "Të Gjitha Artikujt", desc: "Shfleto të gjitha artikujt e FemraDD — kulturë, dashuri, lifestyle dhe argëtim për gratë shqiptare.", body: `\n<p>Shfleto mbi 600 artikuj në 12 kategori të ndryshme.</p>\n<ul>${articles.slice(0, 100).map(a => `<li><a href="/artikull/${a.slug}">${escapeHtml(a.title)}</a></li>`).join("\n")}</ul>` },
  { route: "/rreth-nesh", title: "Rreth Nesh", desc: "Mëso më shumë rreth FemraDD, revistës online për gratë e reja shqiptare.", body: `\n<p>FemraDD është revista online e parë kushtuar grave të reja shqiptare.</p>\n<a href="/kontakt">Na kontaktoni</a>` },
  { route: "/kontakt", title: "Kontakt", desc: "Na kontaktoni për bashkëpunime, sugjerime ose pyetje.", body: `\n<p>Na kontaktoni në info@femradd.com për çdo pyetje apo sugjerim.</p>\n<a href="/rreth-nesh">Rreth Nesh</a>` },
  { route: "/privatesia", title: "Politika e Privatësisë", desc: "Politika e privatësisë së FemraDD — si i mbrojmë të dhënat tuaja.", body: `\n<p>Privatësia juaj është e rëndësishme për ne.</p>\n<a href="/kushtet">Kushtet e Përdorimit</a>` },
  { route: "/kushtet", title: "Kushtet e Përdorimit", desc: "Kushtet e përdorimit të faqes FemraDD — rregullat për përdoruesit.", body: `\n<p>Duke përdorur faqen FemraDD, ju pranoni këto kushte.</p>\n<a href="/privatesia">Politika e Privatësisë</a>` },
  { route: "/redaksia", title: "Redaksia", desc: "Njohuni me ekipin e redaksisë së FemraDD — autoret dhe redaktoret.", body: `\n<ul>${authors.map(a => `<li><a href="/autore/${a.slug}">${escapeHtml(a.name)}</a></li>`).join("\n")}</ul>` },
];

for (const p of staticPages) {
  try {
    writePage(p.route, generateStaticPage(p.route, p.title, p.desc, p.body));
    count++;
  } catch (e) {
    console.error(`Error generating ${p.route}:`, e.message);
    errors++;
  }
}

// Article pages
for (const a of articles) {
  if (!a.slug) continue;
  try {
    writePage(`/artikull/${a.slug}`, generateArticlePage(a));
    count++;
  } catch (e) {
    console.error(`Error generating /artikull/${a.slug}:`, e.message);
    errors++;
  }
}

// Category pages
for (const c of categories) {
  if (!c.slug) continue;
  try {
    writePage(`/kategori/${c.slug}`, generateCategoryPage(c));
    count++;
  } catch (e) {
    console.error(`Error generating /kategori/${c.slug}:`, e.message);
    errors++;
  }
}

// Author pages
for (const a of authors) {
  try {
    writePage(`/autore/${a.slug}`, generateAuthorPage(a));
    count++;
  } catch (e) {
    console.error(`Error generating /autore/${a.slug}:`, e.message);
    errors++;
  }
}

console.log(`✅ Generated ${count} full HTML pages (${errors} errors)`);
