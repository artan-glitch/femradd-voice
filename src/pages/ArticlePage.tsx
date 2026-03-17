import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getArticleBySlug, getRelatedArticles, categoryColors } from "@/data/articles";
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
    if (!el) return;

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
  }, [article?.content]);

  if (!article) return <NotFound />;

  const related = getRelatedArticles(article.id, 3);
  const pageUrl = `https://femradd.com/artikull/${article.slug}`;
  // Article JSON-LD
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt,
    inLanguage: "sq",
    articleSection: article.categoryLabel,
    wordCount: article.content.replace(/<[^>]*>/g, "").split(/\s+/).length,
    about: {
      "@type": "Thing",
      name: article.categoryLabel,
    },
    keywords: [article.categoryLabel, "FemraDD", "shqiptare"],
    author: {
      "@type": "Person",
      name: article.author.name,
      url: `https://femradd.com/autore/${article.author.slug}`,
      image: article.author.avatar,
      ...(article.author.socials?.length && {
        sameAs: article.author.socials.map((s) => s.url),
      }),
    },
    publisher: {
      "@type": "Organization",
      name: "FemraDD",
      url: "https://femradd.com",
      logo: {
        "@type": "ImageObject",
        url: "https://femradd.com/logo.png",
      },
    },
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
        author={article.author.name}
        section={article.categoryLabel}
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
                className="w-full h-full object-cover"
              />
            </div>
            <Breadcrumbs
              items={[
                { label: "Ballina", href: "/" },
                { label: article.categoryLabel, href: `/kategori/${article.category}` },
                { label: article.title },
              ]}
            />

            <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${categoryColors[article.category]} inline-block mb-4`}>
              {article.categoryLabel}
            </span>

            <h1 className="text-3xl md:text-5xl font-bold leading-tight text-foreground mb-4">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-border">
              <Link to={`/autore/${article.author.slug}`} className="flex items-center gap-3">
                <img src={article.author.avatar} alt={article.author.name} loading="lazy" className="w-10 h-10 rounded-full object-cover" width={40} height={40} />
                <div>
                  <p className="text-sm font-semibold text-foreground">{article.author.name}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-0.5">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDateAlbanian(article.publishedAt)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" />
                      Përditësuar {formatDateAlbanian(article.modifiedAt)}
                    </span>
                    <span>· {article.readingTime} min lexim</span>
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
            <div className="lg:hidden">
              <TableOfContents contentHtml={article.content} variant="inline" />
            </div>

            <article
              ref={articleRef}
              className={`prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-primary prose-blockquote:text-muted-foreground prose-li:text-muted-foreground prose-hr:border-border prose-h2:mt-12 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3 prose-img:rounded-xl prose-img:my-8 ${fontSizeClass[fontSize]}`}
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

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
            <AuthorBio author={article.author} />


          </div>

          {/* Sidebar ToC — desktop only */}
          <aside className="hidden lg:block">
            <TableOfContents contentHtml={article.content} variant="sidebar" />
          </aside>
        </div>
      </div>

      {/* Related articles */}
      <section className="container pb-12 md:pb-16" aria-label="Lexo gjithashtu">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
          Lexo Gjithashtu
        </h2>
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
