import { useState, useCallback } from "react";
import { articles, categories, categoryColors, getArticlesByCategory } from "@/data/articles";
import type { ArticleMeta } from "@/data/articles";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";
import PageHead from "@/components/PageHead";
import FadeIn from "@/components/FadeIn";

const ARTICLES_PER_PAGE = 12;

export default function AllArticles() {
  const [activeCategory, setActiveCategory] = useState<string>("te-gjitha");
  const [page, setPage] = useState(1);

  const filteredArticles: ArticleMeta[] =
    activeCategory === "te-gjitha"
      ? articles
      : getArticlesByCategory(activeCategory);

  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  const paginatedArticles = filteredArticles.slice(
    (page - 1) * ARTICLES_PER_PAGE,
    page * ARTICLES_PER_PAGE
  );

  const handleCategoryChange = useCallback((slug: string) => {
    setActiveCategory(slug);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <main id="main-content">
      <PageHead
        title="Të gjitha artikujt"
        description={`Lexo ${articles.length} artikuj nga FemraDD — revista online për gratë e reja shqiptare.`}
        url="https://femradd.com/artikuj"
      />

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
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </main>
  );
}
