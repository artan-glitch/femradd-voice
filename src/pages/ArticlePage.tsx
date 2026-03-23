import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getArticleBySlug, getRelatedArticles, categoryColors, resolveAuthor, loadArticleContent } from "@/data/articles";
import { formatDateAlbanian } from "@/lib/utils";
import { Calendar, RefreshCw } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleCard from "@/components/ArticleCard";
import NotFound from "./NotFound";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import TableOfContents from "@/components/TableOfContents";
import AuthorBio from "@/components/AuthorBio";

import BackToTop from "@/components/BackToTop";
import ShareButtons from "@/components/ShareButtons";
import ArticleTags from "@/components/ArticleTags";
import ArticleHead from "@/components/ArticleHead";
import ImageLightbox from "@/components/ImageLightbox";
import FontSizeToggle from "@/components/FontSizeToggle";
import ArticleReaction from "@/components/ArticleReaction";
import ArticleFAQ from "@/components/ArticleFAQ";

type FontSize = "normal" | "large" | "x-large";

const fontSizeClass: Record<FontSize, string> = {
  normal: "",
  large: "text-lg md:text-xl [&>p]:text-lg [&>p]:md:text-xl",
  "x-large": "text-xl md:text-2xl [&>p]:text-xl [&>p]:md:text-2xl",
};

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;
  const articleRef = useRef<HTMLElement>(null);

  // Async content loading
  const [content, setContent] = useState<string>("");
  const [contentLoading, setContentLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setContentLoading(true);
      loadArticleContent(slug).then((c) => {
        setContent(c);
        setContentLoading(false);
      });
    }
  }, [slug]);

  // Lightbox state
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState("");

  // Font size state
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const saved = localStorage.getItem("article-font-size");
    return (saved as FontSize) || "normal";
  });

  const handleFontSize = useCallback((size: FontSize) => {
    setFontSize(size);
    localStorage.setItem("article-font-size", size);
  }, []);

  // Add click handlers to article body images for lightbox
  useEffect(() => {
    const el = articleRef.current;
    if (!el || contentLoading) return;

    const images = el.querySelectorAll("img");
    const handler = (e: Event) => {
      const img = e.currentTarget as HTMLImageElement;
      setLightboxSrc(img.src);
      setLightboxAlt(img.alt || "");
    };

    images.forEach((img) => {
      img.style.cursor = "zoom-in";
      if (img.loading !== "lazy") img.loading = "lazy";
      img.addEventListener("click", handler);
    });

    return () => {
      images.forEach((img) => img.removeEventListener("click", handler));
    };
  }, [content, contentLoading]);

  if (!article) return <NotFound />;

  const author = resolveAuthor(article.authorSlug);
  const related = getRelatedArticles(article.id, 6);
  const pageUrl = `https://femradd.com/artikull/${article.slug}`;

  // Detect English articles by checking if the title has mostly ASCII letters
  const englishSlugs = new Set(["why-dating-apps-are-good", "what-is-a-real-date", "how-to-compliment-a-guy", "what-should-men-wear-on-a-first-date"]);
  const articleLang = englishSlugs.has(article.slug) ? "en" : "sq";

  // Build absolute image URL
  const absoluteImage = article.image.startsWith("http")
    ? article.image
    : `https://femradd.com${article.image}`;

  // Extract meaningful keywords from title + category
  const titleWords = article.title
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 5);
  const keywords = [
    article.categoryLabel,
    ...titleWords,
    "FemraDD",
    "shqiptare",
    "gratë shqiptare",
  ];

  // Article JSON-LD
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    headline: article.title,
    description: article.excerpt,
    image: {
      "@type": "ImageObject",
      url: absoluteImage,
      width: 1200,
      height: 600,
    },
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt,
    inLanguage: articleLang,
    articleSection: article.categoryLabel,
    about: {
      "@type": "Thing",
      name: article.categoryLabel,
    },
    keywords,
    wordCount: article.readingTime * 200,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#main-content h1", ".prose h2", ".prose p:first-of-type"],
    },
    author: {
      "@type": "Person",
      name: author.name,
      url: `https://femradd.com/autore/${author.slug}`,
      image: author.avatar?.startsWith("http")
        ? author.avatar
        : `https://femradd.com${author.avatar}`,
      ...(author.socials?.length && {
        sameAs: author.socials.map((s) => s.url),
      }),
    },
    publisher: {
      "@type": "Organization",
      name: "FemraDD",
      url: "https://femradd.com",
      logo: {
        "@type": "ImageObject",
        url: "https://femradd.com/og-image.png",
        width: 1200,
        height: 630,
      },
    },
    isAccessibleForFree: true,
  };

  // FAQ JSON-LD (only if article has FAQs)
  const faqJsonLd = article.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: article.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }
    : null;

  return (
    <main id="main-content">
      <ArticleHead
        title={article.title}
        description={article.excerpt}
        image={article.image}
        imageAlt={article.title}
        url={pageUrl}
        publishedAt={article.publishedAt}
        modifiedAt={article.modifiedAt}
        author={author.name}
        section={article.categoryLabel}
        lang={articleLang}
      />
      <ReadingProgressBar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      {/* Lightbox */}
      <ImageLightbox src={lightboxSrc} alt={lightboxAlt} onClose={() => setLightboxSrc(null)} />

      {/* Full article layout */}
      <div className="container max-w-5xl xl:max-w-6xl pt-8 md:pt-12">
        <div className="lg:grid lg:grid-cols-[1fr_220px] xl:grid-cols-[48px_1fr_220px] lg:gap-8 xl:gap-10">
          {/* Sticky share sidebar — xl only */}
          <div className="hidden xl:block" aria-label="Ndaj artikullin">
            <div className="sticky top-24 flex flex-col gap-2 pt-[420px]">
              <ShareButtons title={article.title} url={pageUrl} variant="vertical" />
            </div>
          </div>

          {/* Main content column */}
          <div className="max-w-3xl">
            {/* Featured image */}
            <div className="w-full aspect-[2/1] overflow-hidden rounded-xl mb-8">
              <img
                src={article.image}
                alt={article.title}
                width={1200}
                height={600}
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <Breadcrumbs
              items={[
                { label: "Ballina", href: "/" },
                { label: article.categoryLabel, href: `/kategori/${article.category}` },
                { label: article.title },
              ]}
            />

            <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${categoryColors[article.category] || "bg-gray-600 text-white"} inline-block mb-4`}>
              {article.categoryLabel}
            </span>

            <h1 className="text-3xl md:text-5xl font-bold leading-tight text-foreground mb-4">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-border">
              <Link to={`/autore/${author.slug}`} className="flex items-center gap-3">
                <img src={author.avatar} alt={author.name} loading="lazy" className="w-10 h-10 rounded-full object-cover" width={40} height={40} />
                <div>
                  <p className="text-sm font-semibold text-foreground">{author.name}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-0.5">
                    <time dateTime={article.publishedAt} className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDateAlbanian(article.publishedAt)}
                    </time>
                    <time dateTime={article.modifiedAt} className="inline-flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" />
                      Përditësuar {formatDateAlbanian(article.modifiedAt)}
                    </time>
                    <span>&middot; {article.readingTime} min lexim</span>
                  </div>
                </div>
              </Link>
              <div className="flex items-center gap-2 ml-auto">
                <FontSizeToggle size={fontSize} onChange={handleFontSize} />
                <div className="xl:hidden">
                  <ShareButtons title={article.title} url={pageUrl} />
                </div>
              </div>
            </div>

            {/* Inline ToC — mobile only */}
            {!contentLoading && content && (
              <div className="lg:hidden">
                <TableOfContents contentHtml={content} variant="inline" />
              </div>
            )}

            {/* Article content */}
            {contentLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              <article
                ref={articleRef}
                lang={articleLang}
                className={`prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-primary prose-blockquote:text-muted-foreground prose-li:text-muted-foreground prose-hr:border-border prose-h2:mt-12 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3 prose-img:rounded-xl prose-img:my-8 ${fontSizeClass[fontSize]}`}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}

            {/* Bottom share */}
            <div className="flex items-center gap-4 mt-10 pt-6 border-t border-border">
              <span className="text-sm text-muted-foreground font-medium">Ndaj artikullin:</span>
              <ShareButtons title={article.title} url={pageUrl} />
            </div>

            {/* Tags */}
            <ArticleTags category={article.category} />

            {/* Was this helpful? */}
            <ArticleReaction articleId={article.id} />

            {/* FAQ section */}
            {article.faqs && <ArticleFAQ faqs={article.faqs} />}

            {/* Author bio */}
            <AuthorBio author={author} />
          </div>

          {/* Sidebar ToC — desktop only */}
          {!contentLoading && content && (
            <aside className="hidden lg:block">
              <TableOfContents contentHtml={content} variant="sidebar" />
            </aside>
          )}
        </div>
      </div>

      {/* Related articles */}
      <section className="container pb-12 md:pb-16" aria-label="Lexo gjithashtu">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Lexo Gjithashtu
          </h2>
          <Link
            to={`/kategori/${article.category}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            Më shumë nga {article.categoryLabel} &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {related.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </section>

      <BackToTop />
    </main>
  );
}
