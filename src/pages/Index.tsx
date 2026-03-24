import { Link } from "react-router-dom";
import { articles, categories, categoryColors, getArticlesByCategory } from "@/data/articles";
import HeroArticle from "@/components/HeroArticle";
import ArticleCard from "@/components/ArticleCard";
import NewsletterForm from "@/components/NewsletterForm";
import PageHead from "@/components/PageHead";
import FadeIn from "@/components/FadeIn";
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
  horoskopi: <Sparkles className="w-6 h-6" />,
  kuriozitete: <HelpCircle className="w-6 h-6" />,
  argetim: <PartyPopper className="w-6 h-6" />,
  personale: <TrendingUp className="w-6 h-6" />,
  udhetime: <Plane className="w-6 h-6" />,
  lifestyle: <Gem className="w-6 h-6" />,
  "grate-shqiptare": <Users className="w-6 h-6" />,
  dashuri: <Heart className="w-6 h-6" />,
  letersi: <BookOpen className="w-6 h-6" />,
  "tv-shqip": <Tv className="w-6 h-6" />,
  moti: <CloudSun className="w-6 h-6" />,
  "te-ndryshme": <Layers className="w-6 h-6" />,
};

// Top 6 categories by article count for the homepage grid
const topCategories = [...categories]
  .map((cat) => ({ ...cat, count: getArticlesByCategory(cat.slug).length }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 6);

export default function Index() {
  const [heroArticle, ...restArticles] = articles;
  const latestArticles = restArticles.slice(0, 8);

  // Homepage structured data: WebSite + Organization
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FemraDD",
    alternateName: "Zëri i Gruas Shqiptare",
    url: "https://www.femradd.com",
    inLanguage: "sq",
    description:
      "Revista online për gratë e reja shqiptare. Kulturë, dashuri, lifestyle dhe argëtim — frymëzim çdo ditë.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.femradd.com/artikuj?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://www.femradd.com/#organization",
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://www.femradd.com/#organization",
    name: "FemraDD",
    url: "https://www.femradd.com",
    logo: {
      "@type": "ImageObject",
      url: "https://www.femradd.com/og-image.png",
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
      url: "https://www.femradd.com/kontakt",
      availableLanguage: "Albanian",
    },
  };

  return (
    <main id="main-content">
      <PageHead
        title="Revista për Gratë Shqiptare | Kulturë, Dashuri & Lifestyle"
        description="Revista online për gratë e reja shqiptare. Kulturë, dashuri, lifestyle dhe argëtim — frymëzim çdo ditë."
        url="https://www.femradd.com"
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

      {/* About FemraDD intro */}
      <section className="container pb-8 md:pb-12" aria-label="Rreth FemraDD">
        <FadeIn>
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            {/* Text column */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Mirë se vini në FemraDD
              </h2>
              <p className="text-lg text-foreground leading-relaxed mb-4">
                FemraDD është revista online e parë kushtuar grave të reja shqiptare. Çdo ditë sjellim artikuj origjinalë për kulturën, dashurinë, stilin e jetesës, argëtimin dhe zhvillimin personal.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Nga historitë frymëzuese të grave shqiptare që po ndryshojnë botën, deri te këshillat praktike për marrëdhëniet, karrierën dhe mirëqenien — FemraDD është hapësira ku çdo grua gjen veten.
              </p>
              <Link
                to="/rreth-nesh"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Lexo më shumë rreth nesh →
              </Link>
            </div>
            {/* Stats column */}
            <div className="flex md:flex-col gap-4 shrink-0">
              <div className="flex-1 md:w-40 rounded-xl border border-border bg-card p-5 text-center">
                <div className="text-3xl font-bold text-primary">600+</div>
                <div className="text-sm text-muted-foreground mt-1">Artikuj</div>
              </div>
              <div className="flex-1 md:w-40 rounded-xl border border-border bg-card p-5 text-center">
                <div className="text-3xl font-bold text-primary">12</div>
                <div className="text-sm text-muted-foreground mt-1">Kategori</div>
              </div>
              <div className="flex-1 md:w-40 rounded-xl border border-border bg-card p-5 text-center">
                <div className="text-3xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground mt-1">Lexuese</div>
              </div>
            </div>
          </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {latestArticles.map((article, i) => (
            <FadeIn key={article.id} delay={i * 100} className="h-full">
              <ArticleCard article={article} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Popular articles by category */}
      {topCategories.slice(0, 6).map((cat, catIdx) => {
        const catArticles = getArticlesByCategory(cat.slug).slice(0, 6);
        return (
          <section key={cat.slug} className="container pb-8 md:pb-12" aria-label={cat.label}>
            <FadeIn>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                  {cat.label}
                </h2>
                <Link
                  to={`/kategori/${cat.slug}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Shiko të gjitha &rarr;
                </Link>
              </div>
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {catArticles.map((article, i) => (
                <FadeIn key={article.id} delay={i * 80}>
                  <ArticleCard article={article} />
                </FadeIn>
              ))}
            </div>
          </section>
        );
      })}

      {/* Browse categories */}
      <section className="container pb-8 md:pb-12" aria-label="Kategoritë">
        <FadeIn>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Eksploro sipas kategorisë
            </h2>
            <Link
              to="/artikuj"
              className="text-sm font-medium text-primary hover:underline"
            >
              Të gjitha rubrikat &rarr;
            </Link>
          </div>
        </FadeIn>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {topCategories.map((cat, i) => {
            const bgColor = (categoryColors[cat.slug] || "bg-gray-600 text-white").split(" ")[0];
            return (
              <FadeIn key={cat.slug} delay={i * 60}>
                <Link
                  to={`/kategori/${cat.slug}`}
                  className={`group relative flex flex-col items-center text-center p-5 md:p-6 rounded-2xl ${bgColor} overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                >
                  {/* Decorative glow */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-black/10" />

                  {/* Icon */}
                  <div className="relative w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white mb-3 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300 shadow-sm">
                    {categoryIcons[cat.slug] || <Layers className="w-6 h-6" />}
                  </div>

                  {/* Label */}
                  <h3 className="relative font-bold text-white text-sm leading-tight mb-1">
                    {cat.label}
                  </h3>
                  <span className="relative text-[11px] font-medium text-white/60">
                    {cat.count} artikuj
                  </span>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* Newsletter — compact bar */}
      <NewsletterForm variant="hero" />
    </main>
  );
}
