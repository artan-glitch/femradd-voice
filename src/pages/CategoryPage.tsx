import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getArticlesByCategory, categories, categoryColors, getCategoryConfig, resolveAuthor } from "@/data/articles";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleCard from "@/components/ArticleCard";
import NewsletterForm from "@/components/NewsletterForm";
import Pagination from "@/components/Pagination";
import PageHead from "@/components/PageHead";
import FadeIn from "@/components/FadeIn";
import NotFound from "./NotFound";
import {
  Sparkles,
  HelpCircle,
  PartyPopper,
  TrendingUp,
  Plane,
  Heart,
  BookOpen,
  Tv,
  CloudSun,
  Gem,
  Users,
  Layers,
} from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  horoskopi: <Sparkles className="w-7 h-7" />,
  kuriozitete: <HelpCircle className="w-7 h-7" />,
  argetim: <PartyPopper className="w-7 h-7" />,
  personale: <TrendingUp className="w-7 h-7" />,
  udhetime: <Plane className="w-7 h-7" />,
  lifestyle: <Gem className="w-7 h-7" />,
  "grate-shqiptare": <Users className="w-7 h-7" />,
  dashuri: <Heart className="w-7 h-7" />,
  letersi: <BookOpen className="w-7 h-7" />,
  "tv-shqip": <Tv className="w-7 h-7" />,
  moti: <CloudSun className="w-7 h-7" />,
  "te-ndryshme": <Layers className="w-7 h-7" />,
};

const ARTICLES_PER_PAGE = 9;

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = slug || "";
  const config = getCategoryConfig(category);
  const [page, setPage] = useState(1);

  if (!config) return <NotFound />;

  const label = config.label;
  const description = config.description;
  const articles = getArticlesByCategory(category);
  const [featured, ...rest] = articles;

  // Related categories (exclude current, pick 5 with most articles)
  const relatedCategories = categories
    .filter((c) => c.slug !== category)
    .map((c) => ({ ...c, count: getArticlesByCategory(c.slug).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const totalPages = Math.ceil(rest.length / ARTICLES_PER_PAGE);
  const paginatedArticles = rest.slice(
    (page - 1) * ARTICLES_PER_PAGE,
    page * ARTICLES_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Extract just the bg color class from the colorClass (e.g. "bg-purple-600 text-white" → "bg-purple-600")
  const bgColor = (config.colorClass || "bg-gray-600 text-white").split(" ")[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: label,
    description: description || `Artikuj rreth ${label} në FemraDD`,
    inLanguage: "sq",
    url: `https://femradd.com/kategori/${category}`,
    publisher: {
      "@type": "Organization",
      name: "FemraDD",
      url: "https://femradd.com",
      logo: {
        "@type": "ImageObject",
        url: "https://femradd.com/favicon.svg",
      },
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: articles.length,
      itemListElement: articles.slice(0, 20).map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: a.title,
        url: `https://femradd.com/artikull/${a.slug}`,
      })),
    },
  };

  return (
    <main id="main-content">
      <PageHead
        title={label}
        description={description || `Artikuj rreth ${label} në FemraDD — revista online për gratë e reja shqiptare.`}
        url={`https://femradd.com/kategori/${category}`}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Category hero banner */}
      <section className={`${bgColor} relative overflow-hidden`}>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/4" />

        <div className="container relative py-10 md:py-14">
          <Breadcrumbs
            items={[
              { label: "Ballina", href: "/" },
              { label },
            ]}
            className="mb-6 [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white/50 [&_li:last-child_span]:text-white/90"
          />

          <div className="flex items-start gap-5">
            {/* Icon */}
            <div className="hidden sm:flex shrink-0 w-14 h-14 rounded-2xl bg-white/15 items-center justify-center text-white mt-1">
              {categoryIcons[category] || <Layers className="w-7 h-7" />}
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
                {label}
              </h1>
              {description && (
                <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-2xl mb-4">
                  {description}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-white/60">
                <span className="flex items-center gap-1.5">
                  <span className="font-semibold text-white">{articles.length}</span> artikuj
                </span>
                {totalPages > 1 && (
                  <span className="flex items-center gap-1.5">
                    <span className="font-semibold text-white">{totalPages}</span> faqe
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-8 md:py-12">
        {articles.length === 0 ? (
          <p className="text-muted-foreground">Nuk ka artikuj ende në këtë kategori.</p>
        ) : (
          <>
            {/* Featured article — editorial hero */}
            {featured && (
              <FadeIn className="mb-10">
                <Link
                  to={`/artikull/${featured.slug}`}
                  className="group block md:grid md:grid-cols-2 gap-6 md:gap-8 bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
                    <img
                      src={featured.image}
                      alt={featured.title}
                      loading="lazy"
                      width={800}
                      height={500}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6 md:py-8 md:pr-8 flex flex-col justify-center">
                    <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${categoryColors[featured.category]} inline-block mb-4 self-start`}>
                      {featured.categoryLabel}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-3 group-hover:text-primary transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                      {featured.excerpt}
                    </p>
                    {(() => {
                      const author = resolveAuthor(featured.authorSlug);
                      return (
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <img
                            src={author.avatar}
                            alt={author.name}
                            loading="lazy"
                            width={28}
                            height={28}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span className="font-medium">{author.name}</span>
                          <span>·</span>
                          <span>{featured.readingTime} min lexim</span>
                        </div>
                      );
                    })()}
                  </div>
                </Link>
              </FadeIn>
            )}

            {/* Section heading for article grid */}
            {paginatedArticles.length > 0 && (
              <FadeIn>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">
                    {page === 1 ? "Të gjitha artikujt" : `Faqja ${page} nga ${totalPages}`}
                  </h2>
                  {totalPages > 1 && (
                    <span className="text-sm text-muted-foreground">
                      {rest.length} artikuj gjithsej
                    </span>
                  )}
                </div>
              </FadeIn>
            )}

            {/* Articles grid */}
            {paginatedArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {paginatedArticles.map((article, i) => (
                  <FadeIn key={article.id} delay={i * 100} className="h-full">
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

            {/* Newsletter CTA */}
            <FadeIn>
              <div className="mt-12">
                <NewsletterForm variant="inline" />
              </div>
            </FadeIn>

            {/* Related categories */}
            {relatedCategories.length > 0 && (
              <FadeIn>
                <section className="mt-12 pt-10 border-t border-border" aria-label="Kategori të tjera">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
                    Eksploro kategori të tjera
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                    {relatedCategories.map((cat) => {
                      const catBg = (categoryColors[cat.slug] || "bg-gray-600 text-white").split(" ")[0];
                      return (
                        <Link
                          key={cat.slug}
                          to={`/kategori/${cat.slug}`}
                          className={`group relative flex flex-col items-center text-center p-5 rounded-2xl ${catBg} overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-black/10" />

                          <div className="relative w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-white mb-2.5 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                            {categoryIcons[cat.slug] || <Layers className="w-5 h-5" />}
                          </div>
                          <h3 className="relative font-bold text-white text-sm leading-tight mb-0.5">
                            {cat.label}
                          </h3>
                          <span className="relative text-[11px] font-medium text-white/60">
                            {cat.count} artikuj
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              </FadeIn>
            )}
          </>
        )}

      </div>
    </main>
  );
}
