import { articles } from "@/data/articles";
import HeroArticle from "@/components/HeroArticle";
import ArticleCard from "@/components/ArticleCard";
import PageHead from "@/components/PageHead";
import FadeIn from "@/components/FadeIn";

export default function Index() {
  const [heroArticle, ...restArticles] = articles;

  return (
    <main id="main-content">
      <PageHead
        title="Ballina"
        description="Revista online për gratë e reja shqiptare. Kulturë, dashuri, lifestyle dhe argëtim — frymëzim çdo ditë."
        url="https://femradd.com"
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
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
            Artikujt e Fundit
          </h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {restArticles.slice(0, 3).map((article, i) => (
            <FadeIn key={article.id} delay={i * 100}>
              <ArticleCard article={article} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* More articles */}
      <section className="container pb-8 md:pb-12" aria-label="Më shumë artikuj">
        <FadeIn>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
            Zbulo Më Shumë
          </h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {restArticles.slice(3).map((article, i) => (
            <FadeIn key={article.id} delay={i * 100}>
              <ArticleCard article={article} />
            </FadeIn>
          ))}
        </div>
      </section>

    </main>
  );
}
