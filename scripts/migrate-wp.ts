/**
 * WordPress XML to FemraDD migration script
 *
 * Usage: npx tsx scripts/migrate-wp.ts <path-to-wordpress-export.xml>
 *
 * Outputs:
 *   src/data/categories.ts
 *   src/data/authors.ts
 *   src/data/articles/index.ts
 *   src/data/articles/content/{slug}.json
 */

import { XMLParser } from "fast-xml-parser";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Configuration ───────────────────────────────────────────────────

const WP_CATEGORY_MAP: Record<string, string> = {
  "horoskopi-shqip": "horoskopi",
  "parashikimi-i-motit": "moti",
  "kuriozitete": "kuriozitete",
  "fun": "argetim",
  "personale": "personale",
  "udhetime": "udhetime",
  "tvshqiplive": "tv-shqip",
  "letersia": "letersi",
  "poezi": "letersi",
  "lifestyle": "lifestyle",
  "dashuri": "dashuri",
  "dating": "dashuri",
  "marredhenie": "dashuri",
  "martesa": "dashuri",
  "femra": "grate-shqiptare",
  "biografi-shqip": "grate-shqiptare",
  "shqiptare": "te-ndryshme",
  "tjera": "te-ndryshme",
  "shpjegimi-i-endrrave": "te-ndryshme",
  "pune": "te-ndryshme",
  "shendet": "te-ndryshme",
  "teknologji": "te-ndryshme",
  "festat": "te-ndryshme",
  "duanews": "te-ndryshme",
  "uncategorised": "te-ndryshme",
  "uncategorized-sq": "te-ndryshme",
};

const CATEGORY_CONFIGS = [
  { slug: "horoskopi", label: "Horoskopi", description: "Parashikime astrologjike ditore, javore dhe mujore.", colorClass: "bg-purple-600 text-white", navPriority: 1 },
  { slug: "kuriozitete", label: "Kuriozitete", description: "Fakte interesante dhe informacione nga bota.", colorClass: "bg-amber-600 text-white", navPriority: 2 },
  { slug: "argetim", label: "Argëtim", description: "Artikuj argëtues, humor dhe përmbajtje e lehtë.", colorClass: "bg-primary text-white", navPriority: 3 },
  { slug: "personale", label: "Zhvillim Personal", description: "Këshilla për rritje personale, produktivitet dhe sukses.", colorClass: "bg-teal-600 text-white", navPriority: 4 },
  { slug: "udhetime", label: "Udhëtime", description: "Destinacione, këshilla udhëtimi dhe vende të bukura.", colorClass: "bg-sky-600 text-white", navPriority: 5 },
  { slug: "lifestyle", label: "Lifestyle", description: "Moda, stili i jetës, trende dhe mirëqenie.", colorClass: "bg-sage text-white", navPriority: 6 },
  { slug: "grate-shqiptare", label: "Gratë Shqiptare", description: "Histori frymëzuese të grave shqiptare në botë.", colorClass: "bg-charcoal text-white", navPriority: 7 },
  { slug: "dashuri", label: "Dashuri & Takime", description: "Këshilla për dashurinë, marrëdhëniet dhe takimet.", colorClass: "bg-warm-rose text-white", navPriority: 8 },
  { slug: "letersi", label: "Letërsi & Poezi", description: "Letërsia shqipe, poezi dhe tregime frymëzuese.", colorClass: "bg-terracotta text-white", navPriority: 9 },
  { slug: "tv-shqip", label: "TV Shqip", description: "Kanalet shqiptare live dhe programe televizive.", colorClass: "bg-red-600 text-white", navPriority: 10 },
  { slug: "moti", label: "Parashikimi i Motit", description: "Parashikimi i motit për qytetet shqiptare.", colorClass: "bg-blue-500 text-white", navPriority: 11 },
  { slug: "te-ndryshme", label: "Të Ndryshme", description: "Artikuj të ndryshëm mbi tema të larmishme.", colorClass: "bg-gray-600 text-white", navPriority: 12 },
];

const AUTHOR_MAP: Record<string, { id: string; name: string; slug: string; bio: string }> = {
  "Eduard": { id: "1", name: "Eduard", slug: "eduard", bio: "Themelues dhe redaktor kryesor i FemraDD. Pasionant i kulturës shqiptare dhe përmbajtjes cilësore." },
  "Ilir Trstena": { id: "2", name: "Ilir Trstena", slug: "ilir-trstena", bio: "Shkrimtar dhe kontributor i rregullt në FemraDD." },
  "cukuwotu": { id: "3", name: "Cukuwotu", slug: "cukuwotu", bio: "Kontributor në FemraDD." },
};

// ─── Helpers ─────────────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanWpContent(html: string): string {
  let cleaned = html;

  // Remove WordPress block comments
  cleaned = cleaned.replace(/<!--\s*\/?wp:[^>]*-->/g, "");

  // Remove wp-block-* classes
  cleaned = cleaned.replace(/\s*class="wp-block-[^"]*"/g, "");

  // Remove data-* attributes
  cleaned = cleaned.replace(/\s*data-[a-z-]+="[^"]*"/g, "");

  // Remove inline styles
  cleaned = cleaned.replace(/\s*style="[^"]*"/g, "");

  // Remove empty class attributes
  cleaned = cleaned.replace(/\s*class=""/g, "");

  // Remove id attributes from headings/paragraphs (WP adds random ones)
  cleaned = cleaned.replace(/\s*id="[^"]*"/g, "");

  // Remove empty paragraphs
  cleaned = cleaned.replace(/<p>\s*<\/p>/g, "");
  cleaned = cleaned.replace(/<p>&nbsp;<\/p>/g, "");

  // Remove empty divs
  cleaned = cleaned.replace(/<div>\s*<\/div>/g, "");

  // Clean up figure/figcaption
  cleaned = cleaned.replace(/\s*class="[^"]*"/g, "");

  // Add target blank to external links
  cleaned = cleaned.replace(
    /<a\s+href="(https?:\/\/[^"]*)"(?![^>]*target)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer"'
  );

  // Remove excessive whitespace
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  cleaned = cleaned.trim();

  return cleaned;
}

function generateExcerpt(html: string, maxLength = 160): string {
  const text = stripHtml(html);
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "...";
}

function calculateReadingTime(html: string): number {
  const text = stripHtml(html);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

function sanitizeSlug(slug: unknown): string {
  if (!slug) return "";
  const str = typeof slug === "object" ? JSON.stringify(slug) : String(slug);
  return str
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function ensureArray<T>(val: T | T[] | undefined): T[] {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

// ─── Main ────────────────────────────────────────────────────────────

async function main() {
  const xmlPath = process.argv[2];
  if (!xmlPath) {
    console.error("Usage: npx tsx scripts/migrate-wp.ts <path-to-wordpress-export.xml>");
    process.exit(1);
  }

  const projectRoot = path.resolve(__dirname, "..");
  const xmlContent = fs.readFileSync(xmlPath, "utf-8");

  console.log("Parsing WordPress XML...");

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    textNodeName: "#text",
    cdataPropName: "__cdata",
    isArray: (tagName) => {
      return ["item", "wp:postmeta", "wp:termmeta", "category", "wp:category", "wp:author", "wp:tag"].includes(tagName);
    },
  });

  const parsed = parser.parse(xmlContent);
  const channel = parsed.rss.channel;
  const items = ensureArray(channel.item);

  console.log(`Found ${items.length} items in export`);

  // ─── Extract posts (published + draft) ───

  interface WpPost {
    title: string;
    slug: string;
    content: string;
    publishedAt: string;
    modifiedAt: string;
    authorName: string;
    categories: string[];
    status: string;
    postId: string;
  }

  const posts: WpPost[] = [];
  const seenSlugs = new Set<string>();

  for (const item of items) {
    const postType = item["wp:post_type"]?.__cdata || item["wp:post_type"] || "";
    const status = item["wp:status"]?.__cdata || item["wp:status"] || "";

    if (postType !== "post") continue;
    if (status !== "publish" && status !== "draft") continue;

    const rawContent = item["content:encoded"]?.__cdata || item["content:encoded"] || "";
    if (!rawContent || rawContent.trim().length < 20) continue; // Skip empty posts

    const rawSlugVal = item["wp:post_name"]?.__cdata || item["wp:post_name"] || "";
    let rawSlug = sanitizeSlug(rawSlugVal);

    const rawTitleVal = item.title?.__cdata || item.title || "";
    const rawTitle = typeof rawTitleVal === "string" ? rawTitleVal : String(rawTitleVal);
    if (!rawTitle || !rawSlug) continue;

    // Deduplicate slugs
    if (seenSlugs.has(rawSlug)) {
      rawSlug = `${rawSlug}-${item["wp:post_id"]}`;
    }
    seenSlugs.add(rawSlug);

    // Extract categories
    const cats = ensureArray(item.category);
    const wpCategorySlugs: string[] = [];
    for (const cat of cats) {
      if (cat?.["@_domain"] === "category") {
        const nicename = cat["@_nicename"] || "";
        if (nicename) wpCategorySlugs.push(nicename);
      }
    }

    const pubDate = item["wp:post_date"]?.__cdata || item["wp:post_date"] || item.pubDate || "";
    const modDate = item["wp:post_modified"]?.__cdata || item["wp:post_modified"] || pubDate;

    const author = item["dc:creator"]?.__cdata || item["dc:creator"] || "Eduard";

    posts.push({
      title: rawTitle,
      slug: rawSlug,
      content: rawContent,
      publishedAt: pubDate ? pubDate.split(" ")[0] : "2025-01-01",
      modifiedAt: modDate ? modDate.split(" ")[0] : pubDate?.split(" ")[0] || "2025-01-01",
      authorName: author,
      categories: wpCategorySlugs,
      status,
      postId: String(item["wp:post_id"] || ""),
    });
  }

  // Sort by date (newest first)
  posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  console.log(`Extracted ${posts.length} posts (published + drafts with content)`);

  // ─── Map categories ───

  function mapCategory(wpCats: string[]): string {
    for (const wpCat of wpCats) {
      const mapped = WP_CATEGORY_MAP[wpCat];
      if (mapped) return mapped;
    }
    return "te-ndryshme";
  }

  // ─── Generate content JSON files ───

  const contentDir = path.join(projectRoot, "src", "data", "articles", "content");
  fs.mkdirSync(contentDir, { recursive: true });

  // Clean old content files
  if (fs.existsSync(contentDir)) {
    for (const f of fs.readdirSync(contentDir)) {
      if (f.endsWith(".json")) {
        fs.unlinkSync(path.join(contentDir, f));
      }
    }
  }

  console.log("Generating content JSON files...");

  for (const post of posts) {
    const cleanedContent = cleanWpContent(post.content);
    const jsonPath = path.join(contentDir, `${post.slug}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify({ content: cleanedContent }, null, 2));
  }

  console.log(`Generated ${posts.length} content JSON files`);

  // ─── Generate articles/index.ts ───

  interface ArticleMeta {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    image: string;
    category: string;
    categoryLabel: string;
    authorSlug: string;
    readingTime: number;
    publishedAt: string;
    modifiedAt: string;
  }

  const articlesMeta: ArticleMeta[] = posts.map((post, i) => {
    const category = mapCategory(post.categories);
    const catConfig = CATEGORY_CONFIGS.find(c => c.slug === category);
    const authorConfig = AUTHOR_MAP[post.authorName] || AUTHOR_MAP["Eduard"];

    return {
      id: String(i + 1),
      slug: post.slug,
      title: post.title,
      excerpt: generateExcerpt(post.content),
      image: `/images/placeholders/${category}.jpg`,
      category,
      categoryLabel: catConfig?.label || "Të Ndryshme",
      authorSlug: authorConfig.slug,
      readingTime: calculateReadingTime(post.content),
      publishedAt: post.publishedAt,
      modifiedAt: post.modifiedAt,
    };
  });

  // Count by category
  const catCounts: Record<string, number> = {};
  for (const a of articlesMeta) {
    catCounts[a.category] = (catCounts[a.category] || 0) + 1;
  }
  console.log("\nArticles by category:");
  for (const [cat, count] of Object.entries(catCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat}: ${count}`);
  }

  // Generate the index.ts file
  const indexPath = path.join(projectRoot, "src", "data", "articles", "index.ts");

  const indexContent = `// Auto-generated by scripts/migrate-wp.ts — do not edit manually
import type { Author } from "../authors";
import { authors } from "../authors";

export interface ArticleFAQ {
  question: string;
  answer: string;
}

export interface ArticleMeta {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  categoryLabel: string;
  authorSlug: string;
  readingTime: number;
  publishedAt: string;
  modifiedAt: string;
  faqs?: ArticleFAQ[];
}

export interface Article extends ArticleMeta {
  content: string;
  author: Author;
}

export const articles: ArticleMeta[] = ${JSON.stringify(articlesMeta, null, 2)};

// Helper functions

export function resolveAuthor(authorSlug: string): Author {
  return authors.find((a) => a.slug === authorSlug) ?? authors[0];
}

export function getArticleMetaBySlug(slug: string): ArticleMeta | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: string): ArticleMeta[] {
  return articles.filter((a) => a.category === category);
}

export function getRelatedArticles(articleId: string, count = 3): ArticleMeta[] {
  const article = articles.find((a) => a.id === articleId);
  if (!article) return articles.slice(0, count);
  return articles
    .filter((a) => a.id !== articleId && a.category === article.category)
    .concat(articles.filter((a) => a.id !== articleId && a.category !== article.category))
    .slice(0, count);
}

export function getArticlesByAuthor(authorSlug: string): ArticleMeta[] {
  return articles.filter((a) => a.authorSlug === authorSlug);
}

export async function loadArticleContent(slug: string): Promise<string> {
  try {
    const mod = await import(\`./content/\${slug}.json\`);
    return (mod.default as { content: string }).content;
  } catch {
    return "";
  }
}
`;

  fs.writeFileSync(indexPath, indexContent);
  console.log(`\nGenerated articles/index.ts with ${articlesMeta.length} articles`);

  // ─── Generate categories.ts ───

  const categoriesPath = path.join(projectRoot, "src", "data", "categories.ts");
  const categoriesContent = `// Auto-generated by scripts/migrate-wp.ts — do not edit manually

export interface CategoryConfig {
  slug: string;
  label: string;
  description: string;
  colorClass: string;
  navPriority: number;
}

export const categories: CategoryConfig[] = ${JSON.stringify(CATEGORY_CONFIGS, null, 2)};

export type Category = string;

export const categoryMap = new Map(categories.map((c) => [c.slug, c]));

export function getCategoryConfig(slug: string): CategoryConfig | undefined {
  return categoryMap.get(slug);
}

export const categoryLabels: Record<string, string> = Object.fromEntries(
  categories.map((c) => [c.slug, c.label])
);

export const categoryColors: Record<string, string> = Object.fromEntries(
  categories.map((c) => [c.slug, c.colorClass])
);

export const navCategories = categories
  .filter((c) => c.navPriority <= 6)
  .sort((a, b) => a.navPriority - b.navPriority);

export const moreCategories = categories
  .filter((c) => c.navPriority > 6)
  .sort((a, b) => a.navPriority - b.navPriority);
`;

  fs.writeFileSync(categoriesPath, categoriesContent);
  console.log("Generated categories.ts");

  // ─── Generate authors.ts ───

  const authorsPath = path.join(projectRoot, "src", "data", "authors.ts");
  const authorsContent = `// Auto-generated by scripts/migrate-wp.ts — do not edit manually

export interface AuthorSocial {
  platform: "instagram" | "twitter" | "linkedin" | "facebook";
  url: string;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  bio: string;
  socials?: AuthorSocial[];
}

export const authors: Author[] = [
  {
    id: "1",
    name: "Eduard",
    slug: "eduard",
    avatar: "/images/placeholders/author-default.jpg",
    bio: "Themelues dhe redaktor kryesor i FemraDD. Pasionant i kulturës shqiptare dhe përmbajtjes cilësore.",
    socials: [],
  },
  {
    id: "2",
    name: "Ilir Trstena",
    slug: "ilir-trstena",
    avatar: "/images/placeholders/author-default.jpg",
    bio: "Shkrimtar dhe kontributor i rregullt në FemraDD.",
    socials: [],
  },
  {
    id: "3",
    name: "Cukuwotu",
    slug: "cukuwotu",
    avatar: "/images/placeholders/author-default.jpg",
    bio: "Kontributor në FemraDD.",
    socials: [],
  },
];

export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}
`;

  fs.writeFileSync(authorsPath, authorsContent);
  console.log("Generated authors.ts");

  // ─── Summary ───

  console.log("\n✅ Migration complete!");
  console.log(`   ${posts.length} articles migrated`);
  console.log(`   ${CATEGORY_CONFIGS.length} categories configured`);
  console.log(`   ${Object.keys(AUTHOR_MAP).length} authors mapped`);
  console.log(`   ${posts.length} content JSON files created`);
  console.log("\nNext steps:");
  console.log("  1. Add placeholder images to public/images/placeholders/");
  console.log("  2. Update src/data/articles.ts as compatibility shim");
  console.log("  3. Update components to use new data structure");
}

main().catch(console.error);
