import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { articles } from "@/data/articles";
import ArticleCard from "@/components/ArticleCard";
import PageHead from "@/components/PageHead";

export default function Bookmarks() {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    const saved: string[] = JSON.parse(localStorage.getItem("femradd-bookmarks") || "[]");
    setSlugs(saved);

    const onStorage = () => {
      setSlugs(JSON.parse(localStorage.getItem("femradd-bookmarks") || "[]"));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const savedArticles = slugs
    .map(slug => articles.find(a => a.slug === slug))
    .filter(Boolean);

  return (
    <main id="main-content" className="container py-8 md:py-12 min-h-[60vh]">
      <PageHead
        title="Ruajturat e Mia"
        description="Artikujt e ruajtur nga ju në FemraDD — lexoni më vonë artikujt tuaj të preferuar."
        url="https://www.femradd.com/ruajturat"
      />
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Ruajturat e Mia</h1>
      <p className="text-muted-foreground mb-8">Artikujt që keni ruajtur për lexim më vonë</p>

      {savedArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedArticles.map(article => (
            <ArticleCard key={article!.id} article={article!} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Bookmark className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Nuk keni asnjë artikull të ruajtur</h2>
          <p className="text-muted-foreground mb-6">Klikoni ikonën e ruajtjes në çdo artikull për ta shtuar këtu</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Kthehu në Ballina
          </Link>
        </div>
      )}
    </main>
  );
}
