import { useParams } from "react-router-dom";
import { getArticlesByCategory, categoryLabels, type Category } from "@/data/articles";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleCard from "@/components/ArticleCard";
import NewsletterForm from "@/components/NewsletterForm";
import NotFound from "./NotFound";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = slug as Category;
  const label = categoryLabels[category];

  if (!label) return <NotFound />;

  const articles = getArticlesByCategory(category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: label,
    description: `Artikuj rreth ${label} në FemraDD`,
    inLanguage: "sq",
    url: `https://femradd.com/kategori/${category}`,
  };

  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container py-8 md:py-12">
        <Breadcrumbs
          items={[
            { label: "Ballina", href: "/" },
            { label },
          ]}
        />

        <h1 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-2">
          {label}
        </h1>
        <p className="text-muted-foreground mb-10">
          {articles.length} artikuj
        </p>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Nuk ka artikuj ende në këtë kategori.</p>
        )}

        <div className="mt-12">
          <NewsletterForm variant="inline" />
        </div>
      </div>
    </main>
  );
}
