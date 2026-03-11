import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Article } from "@/data/articles";
import { categoryColors } from "@/data/articles";

interface Props {
  article: Article;
}

export default function HeroArticle({ article }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);

  // Set fetchpriority via ref to avoid React 18 prop warning
  useEffect(() => {
    imgRef.current?.setAttribute("fetchpriority", "high");
  }, []);

  return (
    <article className="relative overflow-hidden rounded-2xl group">
      <Link to={`/artikull/${article.slug}`} className="block">
        <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden">
          <img
            ref={imgRef}
            src={article.image}
            alt={article.title}
            width={1920}
            height={823}
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-14">
          <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${categoryColors[article.category]} inline-block mb-3`}>
            {article.categoryLabel}
          </span>
          <h1 className="font-serif text-2xl md:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight mb-3 max-w-3xl">
            {article.title}
          </h1>
          <p className="text-sm md:text-base text-primary-foreground/80 max-w-2xl leading-relaxed hidden sm:block">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-3 mt-4 text-primary-foreground/60 text-sm">
            <span>{article.author.name}</span>
            <span>·</span>
            <span>{article.readingTime} min lexim</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
