import { useParams } from "react-router-dom";
import { getAuthorBySlug, getArticlesByAuthor } from "@/data/articles";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleCard from "@/components/ArticleCard";
import NotFound from "./NotFound";

export default function AuthorPage() {
  const { slug } = useParams<{ slug: string }>();
  const author = slug ? getAuthorBySlug(slug) : undefined;

  if (!author) return <NotFound />;

  const articles = getArticlesByAuthor(author.slug);

  return (
    <main id="main-content">
      <div className="container py-8 md:py-12">
        <Breadcrumbs
          items={[
            { label: "Ballina", href: "/" },
            { label: author.name },
          ]}
        />

        <div className="flex items-center gap-5 mb-10">
          <img
            src={author.avatar}
            alt={author.name}
            width={80}
            height={80}
            className="w-20 h-20 rounded-full object-cover ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
          />
          <div>
            <h1 className="font-serif text-2xl md:text-4xl font-bold text-foreground">{author.name}</h1>
            <p className="text-muted-foreground mt-1 max-w-lg">{author.bio}</p>
          </div>
        </div>

        <h2 className="font-serif text-xl font-bold text-foreground mb-6">
          Artikujt nga {author.name}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </main>
  );
}
