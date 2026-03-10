import { useParams, Link } from "react-router-dom";
import { getArticleBySlug, getRelatedArticles, getAdjacentArticles, categoryColors } from "@/data/articles";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleCard from "@/components/ArticleCard";
import NotFound from "./NotFound";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import TableOfContents from "@/components/TableOfContents";
import AuthorBio from "@/components/AuthorBio";
import ArticleNav from "@/components/ArticleNav";
import BackToTop from "@/components/BackToTop";
import ShareButtons from "@/components/ShareButtons";
import ArticleTags from "@/components/ArticleTags";
import ArticleHead from "@/components/ArticleHead";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;

  if (!article) return <NotFound />;

  const related = getRelatedArticles(article.id, 3);
  const { prev, next } = getAdjacentArticles(article.id);
  const pageUrl = `https://femradd.com/artikull/${article.slug}`;

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
      <ArticleHead
        title={article.title}
        description={article.excerpt}
        image={article.image}
        url={pageUrl}
        publishedAt={article.publishedAt}
        modifiedAt={article.modifiedAt}
        author={article.author.name}
      />
      <ReadingProgressBar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      {/* Full article layout — single grid so header + body share the same left edge */}
      <div className="container max-w-5xl pt-8 md:pt-12">
        <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-10">
          {/* Main content column */}
          <div className="max-w-3xl">
            {/* Featured image */}
            <div className="w-full aspect-[2/1] overflow-hidden rounded-xl mb-8">
              <img
                src={article.image}
                alt={article.title}
                width={1200}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
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
              <div className="ml-auto">
                <ShareButtons title={article.title} url={pageUrl} />
              </div>
            </div>

            {/* Inline ToC — mobile only */}
            <div className="lg:hidden">
              <TableOfContents contentHtml={article.content} variant="inline" />
            </div>

            <article
              className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-h2:mt-12 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3 prose-img:rounded-xl prose-img:my-8"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Tags */}
            <ArticleTags category={article.category} />

            {/* Author bio */}
            <AuthorBio author={article.author} />

            {/* Previous / Next */}
            <ArticleNav prev={prev} next={next} />
          </div>

          {/* Sidebar ToC — desktop only */}
          <aside className="hidden lg:block">
            <TableOfContents contentHtml={article.content} variant="sidebar" />
          </aside>
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

      <BackToTop />
    </main>
  );
}
