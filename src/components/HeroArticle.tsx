import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import type { ArticleMeta } from "@/data/articles";
import { categoryColors, resolveAuthor } from "@/data/articles";

interface Props {
  article: ArticleMeta;
}

export default function HeroArticle({ article }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const author = resolveAuthor(article.authorSlug);

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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-14">
          <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${categoryColors[article.category] || "bg-gray-600 text-white"} inline-block mb-3`}>
            {article.categoryLabel}
          </span>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3 max-w-3xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            {article.title}
          </h1>
          <p className="text-sm md:text-base text-white/90 max-w-2xl leading-relaxed hidden sm:block drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-3 mt-4 text-white/70 text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            <span>{author.name}</span>
            <span>&middot;</span>
            <span>{article.readingTime} min lexim</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
