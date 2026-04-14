/**
 * SEO Analyzer - Yoast-like content analysis
 * Analyzes articles against SEO best practices.
 */

import type { ArticleMeta } from "@/data/articles";

export type IssueSeverity = "error" | "warning" | "info" | "good";

export interface SeoIssue {
  severity: IssueSeverity;
  category: string;
  message: string;
}

export interface SeoAnalysis {
  slug: string;
  title: string;
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  // Metrics
  titleLength: number;
  descriptionLength: number;
  wordCount: number;
  internalLinks: number;
  externalLinks: number;
  h1Count: number;
  h2Count: number;
  h3Count: number;
  imageCount: number;
  imagesWithAlt: number;
  hasFaqs: boolean;
  readingTime: number;
  // Flags
  titleStatus: "good" | "short" | "long";
  descriptionStatus: "good" | "short" | "long";
  wordCountStatus: "good" | "short" | "thin";
  issues: SeoIssue[];
}

const TITLE_MIN = 30;
const TITLE_MAX = 60;
const DESC_MIN = 120;
const DESC_MAX = 155;
const WORDS_GOOD = 300;
const WORDS_MIN = 150;

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function countMatches(str: string, regex: RegExp): number {
  return (str.match(regex) || []).length;
}

function gradeFromScore(score: number): "A" | "B" | "C" | "D" | "F" {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

export function analyzeArticle(meta: ArticleMeta, contentHtml: string): SeoAnalysis {
  const issues: SeoIssue[] = [];
  let score = 100;

  // Title analysis (including " — FemraDD" suffix)
  const fullTitle = meta.title.length + " — FemraDD".length;
  const titleLength = fullTitle;
  let titleStatus: "good" | "short" | "long" = "good";
  if (titleLength > TITLE_MAX) {
    titleStatus = "long";
    score -= 10;
    issues.push({ severity: "warning", category: "Titulli", message: `Titulli është shumë i gjatë (${titleLength} karaktere, rekomandohet ${TITLE_MIN}-${TITLE_MAX})` });
  } else if (titleLength < TITLE_MIN) {
    titleStatus = "short";
    score -= 15;
    issues.push({ severity: "error", category: "Titulli", message: `Titulli është shumë i shkurtër (${titleLength} karaktere, minimum ${TITLE_MIN})` });
  } else {
    issues.push({ severity: "good", category: "Titulli", message: `Titulli ka gjatësi optimale (${titleLength} karaktere)` });
  }

  // Description analysis
  const descriptionLength = meta.excerpt.length;
  let descriptionStatus: "good" | "short" | "long" = "good";
  if (descriptionLength > DESC_MAX) {
    descriptionStatus = "long";
    score -= 10;
    issues.push({ severity: "warning", category: "Përshkrimi", message: `Përshkrimi është shumë i gjatë (${descriptionLength} karaktere, maksimumi ${DESC_MAX})` });
  } else if (descriptionLength < DESC_MIN) {
    descriptionStatus = "short";
    score -= 15;
    issues.push({ severity: "error", category: "Përshkrimi", message: `Përshkrimi është shumë i shkurtër (${descriptionLength} karaktere, minimumi ${DESC_MIN})` });
  } else {
    score += 5;
    issues.push({ severity: "good", category: "Përshkrimi", message: `Përshkrimi ka gjatësi optimale (${descriptionLength} karaktere)` });
  }

  // Content analysis
  const textContent = stripHtml(contentHtml);
  const words = textContent.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  let wordCountStatus: "good" | "short" | "thin" = "good";
  if (wordCount < WORDS_MIN) {
    wordCountStatus = "thin";
    score -= 20;
    issues.push({ severity: "error", category: "Përmbajtja", message: `Përmbajtje e hollë (${wordCount} fjalë, minimumi ${WORDS_MIN})` });
  } else if (wordCount < WORDS_GOOD) {
    wordCountStatus = "short";
    score -= 10;
    issues.push({ severity: "warning", category: "Përmbajtja", message: `Përmbajtje e shkurtër (${wordCount} fjalë, rekomandohet ${WORDS_GOOD}+)` });
  } else {
    issues.push({ severity: "good", category: "Përmbajtja", message: `Gjatësi e mirë e përmbajtjes (${wordCount} fjalë)` });
  }

  // Headings
  const h1Count = countMatches(contentHtml, /<h1[\s>]/gi);
  const h2Count = countMatches(contentHtml, /<h2[\s>]/gi);
  const h3Count = countMatches(contentHtml, /<h3[\s>]/gi);

  if (h1Count > 0) {
    score -= 5;
    issues.push({ severity: "warning", category: "Strukturimi", message: `Gjendën ${h1Count} h1 brenda përmbajtjes (duhet të jetë vetëm titulli kryesor)` });
  }
  if (h2Count === 0) {
    score -= 10;
    issues.push({ severity: "warning", category: "Strukturimi", message: "Nuk ka titra H2 në artikull" });
  } else {
    issues.push({ severity: "good", category: "Strukturimi", message: `${h2Count} titra H2 në artikull` });
  }

  // Internal links
  const internalLinkMatches = contentHtml.match(/<a[^>]+href=["'](?:\/|https:\/\/www\.femradd\.com|https:\/\/femradd\.com)[^"']*["']/gi) || [];
  const internalLinks = internalLinkMatches.length;
  if (internalLinks === 0) {
    score -= 15;
    issues.push({ severity: "error", category: "Lidhjet", message: "Nuk ka lidhje të brendshme (internal links)" });
  } else if (internalLinks < 2) {
    score -= 5;
    issues.push({ severity: "warning", category: "Lidhjet", message: `Vetëm ${internalLinks} lidhje e brendshme (rekomandohet 2+)` });
  } else {
    issues.push({ severity: "good", category: "Lidhjet", message: `${internalLinks} lidhje të brendshme` });
  }

  // External links
  const allLinks = contentHtml.match(/<a[^>]+href=["'](https?:\/\/[^"']+)["']/gi) || [];
  const externalLinks = allLinks.filter(link => !link.includes("femradd.com")).length;
  if (externalLinks === 0) {
    score -= 5;
    issues.push({ severity: "info", category: "Lidhjet", message: "Nuk ka lidhje të jashtme (authority)" });
  } else {
    issues.push({ severity: "good", category: "Lidhjet", message: `${externalLinks} lidhje të jashtme` });
  }

  // Images
  const imgMatches = contentHtml.match(/<img[^>]*>/gi) || [];
  const imageCount = imgMatches.length;
  const imagesWithAlt = imgMatches.filter(img => /alt=["'][^"']+["']/.test(img)).length;
  if (imageCount > 0 && imagesWithAlt < imageCount) {
    const missing = imageCount - imagesWithAlt;
    score -= 10;
    issues.push({ severity: "error", category: "Imazhet", message: `${missing} imazh${missing > 1 ? "e" : ""} pa tekst alternativ (alt)` });
  } else if (imageCount > 0) {
    issues.push({ severity: "good", category: "Imazhet", message: `${imageCount} imazhe me alt text` });
  }

  // FAQs bonus
  const hasFaqs = !!meta.faqs && meta.faqs.length > 0;
  if (hasFaqs) {
    score += 5;
    issues.push({ severity: "good", category: "FAQ", message: `${meta.faqs!.length} pyetje FAQ (schema.org)` });
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  return {
    slug: meta.slug,
    title: meta.title,
    score,
    grade: gradeFromScore(score),
    titleLength,
    descriptionLength,
    wordCount,
    internalLinks,
    externalLinks,
    h1Count,
    h2Count,
    h3Count,
    imageCount,
    imagesWithAlt,
    hasFaqs,
    readingTime: meta.readingTime,
    titleStatus,
    descriptionStatus,
    wordCountStatus,
    issues,
  };
}

export function analyzeMetaOnly(meta: ArticleMeta): SeoAnalysis {
  // Fast analysis without content — used when content can't be loaded
  return analyzeArticle(meta, "");
}
