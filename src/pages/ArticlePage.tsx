import { useParams, Link } from "react-router-dom";
import { getArticleBySlug, getRelatedArticles, categoryColors } from "@/data/articles";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleCard from "@/components/ArticleCard";
import NewsletterForm from "@/components/NewsletterForm";
import NotFound from "./NotFound";
import { Share2, Facebook, Twitter } from "lucide-react";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;

  if (!article) return <NotFound />;

  const related = getRelatedArticles(article.id, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt,
    inLanguage: "sq",
    articleSection: article.categoryLabel,
    author: {
      "@type": "Person",
      name: article.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "FemraDD",
      url: "https://femradd.com",
    },
  };

  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      {/* Hero image */}
      <div className="w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          width={1920}
          height={823}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container max-w-3xl py-8 md:py-12">
        <Breadcrumbs
          items={[
            { label: "Ballina", href: "/" },
            { label: article.categoryLabel, href: `/kategori/${article.category}` },
            { label: article.title },
          ]}
        />

        <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${categoryColors[article.category]} inline-block mb-4`}>
          {article.categoryLabel}
        </span>

        <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight text-foreground mb-4">
          {article.title}
        </h1>

        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
          <Link to={`/autore/${article.author.slug}`} className="flex items-center gap-3">
            <img src={article.author.avatar} alt={article.author.name} className="w-10 h-10 rounded-full object-cover" width={40} height={40} />
            <div>
              <p className="text-sm font-semibold text-foreground">{article.author.name}</p>
              <p className="text-xs text-muted-foreground">{article.publishedAt} · {article.readingTime} min lexim</p>
            </div>
          </Link>
          <div className="ml-auto flex gap-2">
            <button aria-label="Ndaj" className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"><Share2 className="w-4 h-4" /></button>
            <button aria-label="Facebook" className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"><Facebook className="w-4 h-4" /></button>
            <button aria-label="Twitter" className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"><Twitter className="w-4 h-4" /></button>
          </div>
        </div>

        <article
          className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Inline newsletter */}
        <div className="my-12">
          <NewsletterForm variant="inline" />
        </div>
      </div>

      {/* Related articles */}
      <section className="container pb-12 md:pb-16" aria-label="Lexo gjithashtu">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
          Lexo Gjithashtu
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {related.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </section>
    </main>
  );
}
