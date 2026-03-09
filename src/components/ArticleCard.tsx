import { Link } from "react-router-dom";
import type { Article } from "@/data/articles";
import { categoryColors } from "@/data/articles";

interface Props {
  article: Article;
}

export default function ArticleCard({ article }: Props) {
  return (
    <article className="group flex flex-col bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
      <Link to={`/artikull/${article.slug}`} className="block overflow-hidden aspect-[16/10]">
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          width={800}
          height={500}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[article.category]}`}>
            {article.categoryLabel}
          </span>
          <span className="text-xs text-muted-foreground">{article.readingTime} min lexim</span>
        </div>
        <Link to={`/artikull/${article.slug}`}>
          <h3 className="font-serif text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
            {article.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4 flex-1">
          {article.excerpt}
        </p>
        <Link to={`/autore/${article.author.slug}`} className="flex items-center gap-2 mt-auto">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            loading="lazy"
            width={28}
            height={28}
            className="w-7 h-7 rounded-full object-cover"
          />
          <span className="text-xs font-medium text-muted-foreground">{article.author.name}</span>
        </Link>
      </div>
    </article>
  );
}
