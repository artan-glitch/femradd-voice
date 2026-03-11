import { useParams } from "react-router-dom";
import { getAuthorBySlug, getArticlesByAuthor } from "@/data/articles";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleCard from "@/components/ArticleCard";
import PageHead from "@/components/PageHead";
import FadeIn from "@/components/FadeIn";
import NotFound from "./NotFound";

export default function AuthorPage() {
  const { slug } = useParams<{ slug: string }>();
  const author = slug ? getAuthorBySlug(slug) : undefined;

  if (!author) return <NotFound />;

  const articles = getArticlesByAuthor(author.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: author.name,
      description: author.bio,
      image: author.avatar,
    },
    inLanguage: "sq",
    url: `https://femradd.com/autore/${author.slug}`,
  };

  return (
    <main id="main-content">
      <PageHead
        title={author.name}
        description={author.bio}
        url={`https://femradd.com/autore/${author.slug}`}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container py-8 md:py-12">
        <Breadcrumbs
          items={[
            { label: "Ballina", href: "/" },
            { label: author.name },
          ]}
        />

        <FadeIn>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-10">
            <img
              src={author.avatar}
              alt={author.name}
              loading="lazy"
              width={96}
              height={96}
              className="w-24 h-24 rounded-full object-cover ring-2 ring-primary/20 ring-offset-4 ring-offset-background"
            />
            <div>
              <h1 className="font-serif text-2xl md:text-4xl font-bold text-foreground">{author.name}</h1>
              <p className="text-muted-foreground mt-1 max-w-lg leading-relaxed">{author.bio}</p>
              <p className="text-sm text-primary font-medium mt-2">
                {articles.length} {articles.length === 1 ? "artikull" : "artikuj"} të publikuar
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <h2 className="font-serif text-xl font-bold text-foreground mb-6">
            Artikujt nga {author.name}
          </h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {articles.map((article, i) => (
            <FadeIn key={article.id} delay={i * 100}>
              <ArticleCard article={article} />
            </FadeIn>
          ))}
        </div>
      </div>
    </main>
  );
}
