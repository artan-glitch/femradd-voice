import { articles } from "@/data/articles";
import HeroArticle from "@/components/HeroArticle";
import ArticleCard from "@/components/ArticleCard";
import AlbanianWomenSection from "@/components/AlbanianWomenSection";
import NewsletterForm from "@/components/NewsletterForm";

export default function Index() {
  const [heroArticle, ...restArticles] = articles;

  return (
    <main id="main-content">
      {/* Newsletter hero banner */}
      <NewsletterForm variant="hero" />

      {/* Hero article */}
      <section className="container py-8 md:py-12" aria-label="Artikulli kryesor">
        <HeroArticle article={heroArticle} />
      </section>

      {/* Latest articles */}
      <section className="container pb-8 md:pb-12" aria-label="Artikujt e fundit">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
          Artikujt e Fundit
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {restArticles.slice(0, 3).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Albanian women profiles */}
      <AlbanianWomenSection />

      {/* More articles */}
      <section className="container pb-8 md:pb-12" aria-label="Më shumë artikuj">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
          Zbulo Më Shumë
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {restArticles.slice(3).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Inline newsletter */}
      <section className="container pb-12 md:pb-16">
        <NewsletterForm variant="inline" />
      </section>
    </main>
  );
}
