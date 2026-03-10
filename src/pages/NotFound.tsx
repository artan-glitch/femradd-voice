import { Link } from "react-router-dom";
import { articles } from "@/data/articles";
import ArticleCard from "@/components/ArticleCard";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  // Pick 3 random articles to suggest
  const suggested = [...articles].sort(() => Math.random() - 0.5).slice(0, 3);

  return (
    <main id="main-content" className="min-h-[60vh]">
      <div className="container max-w-3xl py-16 md:py-24 text-center">
        {/* Big 404 */}
        <p className="font-serif text-8xl md:text-9xl font-bold text-primary/20 mb-2 select-none">
          404
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
          Faqja nuk u gjet
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-md mx-auto">
          Na vjen keq, por faqja që po kërkoni nuk ekziston ose mund të jetë zhvendosur.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            <Home className="w-4 h-4" />
            Kthehu në Ballina
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 border border-border text-foreground font-medium px-6 py-3 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kthehu Mbrapa
          </button>
        </div>
      </div>

      {/* Suggested articles */}
      <section className="container pb-12 md:pb-16" aria-label="Artikuj të sugjeruar">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
          Ndoshta ju intereson
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {suggested.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </section>
    </main>
  );
}
