import { Link } from "react-router-dom";
import { getArticlesByCategory, type ArticleMeta } from "@/data/articles";

interface Props {
  currentSlug: string;
  category: string;
  categoryLabel: string;
}

const zodiacSigns = [
  "dashi", "demi", "binjaket", "gaforrja", "luani", "virgjeresha",
  "peshorja", "akrepi", "shigjetari", "bricjapi", "ujori", "peshqit",
];

const zodiacLabels: Record<string, string> = {
  dashi: "Dashi",
  demi: "Demi",
  binjaket: "Binjakët",
  gaforrja: "Gaforrja",
  luani: "Luani",
  virgjeresha: "Virgjëresha",
  peshorja: "Peshorja",
  akrepi: "Akrepi",
  shigjetari: "Shigjetari",
  bricjapi: "Bricjapi",
  ujori: "Ujori",
  peshqit: "Peshqit",
};

/**
 * Renders a navigation block of related category articles.
 * Specifically designed to create internal links for orphan pages
 * (horoscope daily/weekly articles, zodiac signs, weather cities).
 */
export default function CategoryNavLinks({ currentSlug, category, categoryLabel }: Props) {
  const allInCategory = getArticlesByCategory(category);

  if (category === "horoskopi") {
    // Show zodiac signs navigation
    const zodiacArticles = allInCategory.filter((a) => zodiacSigns.includes(a.slug));
    // Show recent horoscope articles (daily/weekly/monthly)
    const horoscopeArticles = allInCategory
      .filter((a) => a.slug !== currentSlug && !zodiacSigns.includes(a.slug))
      .slice(0, 12);

    if (zodiacArticles.length === 0 && horoscopeArticles.length === 0) return null;

    return (
      <nav className="container pb-10" aria-label="Navigimi i horoskopit">
        {zodiacArticles.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-foreground mb-4">Shenjat e Horoskopit</h3>
            <div className="flex flex-wrap gap-2">
              {zodiacArticles.map((a) => (
                <Link
                  key={a.slug}
                  to={`/artikull/${a.slug}`}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    a.slug === currentSlug
                      ? "bg-primary text-white"
                      : "bg-muted text-foreground hover:bg-primary/10"
                  }`}
                >
                  {zodiacLabels[a.slug] || a.title}
                </Link>
              ))}
            </div>
          </div>
        )}
        {horoscopeArticles.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Horoskope të Tjera</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
              {horoscopeArticles.map((a) => (
                <li key={a.slug}>
                  <Link
                    to={`/artikull/${a.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors line-clamp-1"
                  >
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    );
  }

  if (category === "moti") {
    // Show links to other weather city articles
    const otherWeather = allInCategory
      .filter((a) => a.slug !== currentSlug)
      .slice(0, 20);

    if (otherWeather.length === 0) return null;

    return (
      <nav className="container pb-10" aria-label="Moti në qytete të tjera">
        <h3 className="text-lg font-bold text-foreground mb-4">Moti në Qytete të Tjera</h3>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2">
          {otherWeather.map((a) => (
            <li key={a.slug}>
              <Link
                to={`/artikull/${a.slug}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors line-clamp-1"
              >
                {a.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  // For other categories with many orphan articles, show a compact list
  const moreArticles = allInCategory
    .filter((a) => a.slug !== currentSlug)
    .slice(0, 8);

  if (moreArticles.length < 4) return null;

  return (
    <nav className="container pb-10" aria-label={`Më shumë nga ${categoryLabel}`}>
      <h3 className="text-lg font-bold text-foreground mb-4">
        Më Shumë nga {categoryLabel}
      </h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
        {moreArticles.map((a) => (
          <li key={a.slug}>
            <Link
              to={`/artikull/${a.slug}`}
              className="text-sm text-muted-foreground hover:text-primary transition-colors line-clamp-1"
            >
              {a.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
