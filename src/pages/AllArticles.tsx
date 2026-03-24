import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { articles, categories, categoryColors, getArticlesByCategory } from "@/data/articles";
import type { ArticleMeta } from "@/data/articles";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";
import PageHead from "@/components/PageHead";
import FadeIn from "@/components/FadeIn";

const ARTICLES_PER_PAGE = 30;

export default function AllArticles() {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get("kategori") || "te-gjitha";
  const page = Math.max(1, parseInt(searchParams.get("faqe") || "1", 10) || 1);

  const filteredArticles: ArticleMeta[] = useMemo(
    () =>
      activeCategory === "te-gjitha"
        ? articles
        : getArticlesByCategory(activeCategory),
    [activeCategory]
  );

  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  const safePage = Math.min(page, Math.max(1, totalPages));

  const paginatedArticles = filteredArticles.slice(
    (safePage - 1) * ARTICLES_PER_PAGE,
    safePage * ARTICLES_PER_PAGE
  );

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams();
    if (slug !== "te-gjitha") params.set("kategori", slug);
    // Reset to page 1 on category change
    setSearchParams(params, { replace: true });
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    if (newPage <= 1) {
      params.delete("faqe");
    } else {
      params.set("faqe", String(newPage));
    }
    setSearchParams(params, { replace: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Build canonical URL
  const urlParams = new URLSearchParams();
  if (activeCategory !== "te-gjitha") urlParams.set("kategori", activeCategory);
  if (safePage > 1) urlParams.set("faqe", String(safePage));
  const queryString = urlParams.toString();
  const canonicalUrl = `https://www.femradd.com/artikuj${queryString ? `?${queryString}` : ""}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: safePage > 1 ? `Të gjitha artikujt — Faqja ${safePage}` : "Të gjitha artikujt",
    description: `Lexo ${articles.length} artikuj nga FemraDD — revista online për gratë e reja shqiptare.`,
    inLanguage: "sq",
    url: canonicalUrl,
    publisher: {
      "@type": "Organization",
      name: "FemraDD",
      url: "https://www.femradd.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.femradd.com/og-image.png",
        width: 1200,
        height: 630,
      },
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: filteredArticles.length,
      itemListElement: paginatedArticles.map((a, i) => ({
        "@type": "ListItem",
        position: (safePage - 1) * ARTICLES_PER_PAGE + i + 1,
        name: a.title,
        url: `https://www.femradd.com/artikull/${a.slug}`,
      })),
    },
  };

  return (
    <main id="main-content">
      <PageHead
        title={safePage > 1 ? `Të gjitha artikujt — Faqja ${safePage}` : "Të gjitha artikujt"}
        description={`Lexo ${articles.length} artikuj nga FemraDD — revista online për gratë e reja shqiptare. Horoskopi, lifestyle, dashuri, udhëtime dhe shumë më tepër.`}
        url={canonicalUrl}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container py-8 md:py-12">
        <Breadcrumbs
          items={[
            { label: "Ballina", href: "/" },
            { label: "Të gjitha artikujt" },
          ]}
        />

        <FadeIn>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-2">
            Të gjitha artikujt
          </h1>
          <p className="text-muted-foreground mb-8">
            {filteredArticles.length} artikuj
            {activeCategory !== "te-gjitha" && (
              <> në kategorinë <strong>{categories.find((c) => c.slug === activeCategory)?.label}</strong></>
            )}
          </p>
        </FadeIn>

        {/* Category filter tabs */}
        <FadeIn>
          <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-border">
            <button
              onClick={() => handleCategoryChange("te-gjitha")}
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                activeCategory === "te-gjitha"
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Të gjitha ({articles.length})
            </button>
            {categories.map((cat) => {
              const count = getArticlesByCategory(cat.slug).length;
              return (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                    activeCategory === cat.slug
                      ? categoryColors[cat.slug] || "bg-gray-600 text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>
        </FadeIn>

        {/* Articles grid */}
        {paginatedArticles.length === 0 ? (
          <p className="text-muted-foreground py-8">Nuk ka artikuj në këtë kategori.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {paginatedArticles.map((article, i) => (
              <FadeIn key={article.id} delay={i * 80} className="h-full">
                <ArticleCard article={article} />
              </FadeIn>
            ))}
          </div>
        )}

        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </main>
  );
}
