import { Link } from "react-router-dom";
import { articles, categories, categoryColors, resolveAuthor, getArticlesByCategory } from "@/data/articles";
import HeroArticle from "@/components/HeroArticle";
import ArticleCard from "@/components/ArticleCard";
import NewsletterForm from "@/components/NewsletterForm";
import PageHead from "@/components/PageHead";
import FadeIn from "@/components/FadeIn";

// Pick top categories to highlight on homepage (most articles, max 3)
const highlightCategories = [...categories]
  .map((cat) => ({ ...cat, count: getArticlesByCategory(cat.slug).length }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 3);

export default function Index() {
  const [heroArticle, ...restArticles] = articles;
  const latestArticles = restArticles.slice(0, 6);

  // Homepage structured data: WebSite + Organization
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FemraDD",
    alternateName: "Zëri i Gruas Shqiptare",
    url: "https://femradd.com",
    inLanguage: "sq",
    description:
      "Revista online për gratë e reja shqiptare. Kulturë, dashuri, lifestyle dhe argëtim — frymëzim çdo ditë.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://femradd.com/artikuj?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://femradd.com/#organization",
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://femradd.com/#organization",
    name: "FemraDD",
    url: "https://femradd.com",
    logo: {
      "@type": "ImageObject",
      url: "https://femradd.com/og-image.png",
      width: 1200,
      height: 630,
    },
    description:
      "Revista online për gratë e reja shqiptare. Kulturë, dashuri, lifestyle dhe argëtim.",
    inLanguage: "sq",
    sameAs: [
      "https://instagram.com/femradd",
      "https://facebook.com/femradd",
      "https://twitter.com/femradd",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: "https://femradd.com/kontakt",
      availableLanguage: "Albanian",
    },
  };

  return (
    <main id="main-content">
      <PageHead
        title="Ballina"
        description="Revista online për gratë e reja shqiptare. Kulturë, dashuri, lifestyle dhe argëtim — frymëzim çdo ditë."
        url="https://femradd.com"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      {/* Hero article */}
      <section className="container py-8 md:py-12" aria-label="Artikulli kryesor">
        <FadeIn>
          <HeroArticle article={heroArticle} />
        </FadeIn>
      </section>

      {/* Latest articles */}
      <section className="container pb-8 md:pb-12" aria-label="Artikujt e fundit">
        <FadeIn>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Artikujt e Fundit
            </h2>
            <Link
              to="/artikuj"
              className="text-sm font-medium text-primary hover:underline"
            >
              Shiko të gjitha &rarr;
            </Link>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {latestArticles.map((article, i) => (
            <FadeIn key={article.id} delay={i * 100}>
              <ArticleCard article={article} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <NewsletterForm variant="hero" />

      {/* Category highlight sections */}
      {highlightCategories.map((cat) => {
        const catArticles = getArticlesByCategory(cat.slug).slice(0, 4);
        if (catArticles.length === 0) return null;
        const [featuredCat, ...gridCat] = catArticles;
        const featuredAuthor = resolveAuthor(featuredCat.authorSlug);

        return (
          <section key={cat.slug} className="container py-8 md:py-12" aria-label={cat.label}>
            <FadeIn>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${categoryColors[cat.slug] || "bg-gray-600 text-white"}`}>
                    {cat.label}
                  </span>
                  <span className="text-sm text-muted-foreground">{cat.count} artikuj</span>
                </div>
                <Link
                  to={`/kategori/${cat.slug}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Shiko të gjitha &rarr;
                </Link>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {/* Featured article for category */}
              <FadeIn>
                <Link
                  to={`/artikull/${featuredCat.slug}`}
                  className="group block bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={featuredCat.image}
                      alt={featuredCat.title}
                      loading="lazy"
                      width={800}
                      height={500}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-5 md:p-6">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {featuredCat.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                      {featuredCat.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <img
                        src={featuredAuthor.avatar}
                        alt={featuredAuthor.name}
                        loading="lazy"
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="font-medium">{featuredAuthor.name}</span>
                      <span>&middot;</span>
                      <span>{featuredCat.readingTime} min lexim</span>
                    </div>
                  </div>
                </Link>
              </FadeIn>

              {/* 3 smaller cards */}
              <div className="flex flex-col gap-4">
                {gridCat.map((article, i) => {
                  const author = resolveAuthor(article.authorSlug);
                  return (
                    <FadeIn key={article.id} delay={i * 100}>
                      <Link
                        to={`/artikull/${article.slug}`}
                        className="group flex gap-4 bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 p-3"
                      >
                        <img
                          src={article.image}
                          alt={article.title}
                          loading="lazy"
                          width={120}
                          height={80}
                          className="w-[120px] h-[80px] rounded-lg object-cover shrink-0 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="flex flex-col justify-center min-w-0">
                          <h4 className="text-sm md:text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                            {article.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                            <span className="font-medium">{author.name}</span>
                            <span>&middot;</span>
                            <span>{article.readingTime} min lexim</span>
                          </div>
                        </div>
                      </Link>
                    </FadeIn>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      {/* Browse all categories */}
      <section className="container pb-8 md:pb-12" aria-label="Kategoritë">
        <FadeIn>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            Eksploro sipas kategorisë
          </h2>
        </FadeIn>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {categories.map((cat, i) => {
            const count = getArticlesByCategory(cat.slug).length;
            return (
              <FadeIn key={cat.slug} delay={i * 50}>
                <Link
                  to={`/kategori/${cat.slug}`}
                  className="group flex flex-col items-center gap-2 p-4 md:p-5 bg-card rounded-xl shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 text-center"
                >
                  <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${categoryColors[cat.slug] || "bg-gray-600 text-white"}`}>
                    {cat.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{count} artikuj</span>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* View all articles CTA */}
      <section className="container pb-12 md:pb-16 text-center">
        <FadeIn>
          <Link
            to="/artikuj"
            className="inline-block bg-primary text-white text-sm font-medium px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            Shiko të gjitha {articles.length} artikujt &rarr;
          </Link>
        </FadeIn>
      </section>
    </main>
  );
}
