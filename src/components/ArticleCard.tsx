import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bookmark } from "lucide-react";
import type { ArticleMeta } from "@/data/articles";
import { categoryColors, resolveAuthor } from "@/data/articles";
import { formatDateAlbanian } from "@/lib/utils";

const CATEGORY_BORDER_COLORS: Record<string, string> = {
  horoskopi: "#9333ea",
  kuriozitete: "#d97706",
  argetim: "hsl(14, 52%, 52%)",
  personale: "#0d9488",
  udhetime: "#0284c7",
  lifestyle: "#65a30d",
  "grate-shqiptare": "#374151",
  dashuri: "#e11d48",
  letersi: "hsl(14, 52%, 52%)",
  "tv-shqip": "#dc2626",
  moti: "#2563eb",
  "te-ndryshme": "#6b7280",
};

function useBookmark(slug: string) {
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    const bookmarks: string[] = JSON.parse(localStorage.getItem("femradd-bookmarks") || "[]");
    setSaved(bookmarks.includes(slug));
  }, [slug]);
  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const bookmarks: string[] = JSON.parse(localStorage.getItem("femradd-bookmarks") || "[]");
    const next = saved ? bookmarks.filter(s => s !== slug) : [...bookmarks, slug];
    localStorage.setItem("femradd-bookmarks", JSON.stringify(next));
    setSaved(!saved);
  };
  return { saved, toggle };
}

interface Props {
  article: ArticleMeta;
  trending?: boolean;
}

export default function ArticleCard({ article, trending }: Props) {
  const author = resolveAuthor(article.authorSlug);
  const { saved, toggle } = useBookmark(article.slug);
  const borderColor = CATEGORY_BORDER_COLORS[article.category] || "#6b7280";

  return (
    <article className="group flex flex-col h-full bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1" style={{ borderTop: `3px solid ${borderColor}` }}>
      <Link to={`/artikull/${article.slug}`} className="block overflow-hidden aspect-[16/10] relative">
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          width={800}
          height={500}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        {trending && (
          <span className="absolute top-2 left-2 bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Trending
          </span>
        )}
        <button onClick={toggle} className="absolute top-2 right-2 p-1.5 rounded-full bg-black/30 hover:bg-black/50 transition-colors" aria-label={saved ? "Hiq nga ruajturat" : "Ruaj artikullin"}>
          <Bookmark className={`w-4 h-4 ${saved ? "fill-white text-white" : "text-white"}`} />
        </button>
      </Link>
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[article.category] || "bg-gray-600 text-white"}`}>
            {article.categoryLabel}
          </span>
          <span className="text-xs text-muted-foreground">{article.readingTime} min lexim</span>
        </div>
        <Link to={`/artikull/${article.slug}`}>
          <h3 className="text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
            {article.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4 flex-1">
          {article.excerpt}
        </p>
        <Link to={`/autore/${author.slug}`} className="flex items-center gap-2 mt-auto">
          <img
            src={author.avatar}
            alt={author.name}
            loading="lazy"
            width={28}
            height={28}
            className="w-7 h-7 rounded-full object-cover"
          />
          <span className="text-xs font-medium text-muted-foreground">{author.name}</span>
          <time dateTime={article.publishedAt} className="text-xs text-muted-foreground/60 ml-auto">{formatDateAlbanian(article.publishedAt)}</time>
        </Link>
      </div>
    </article>
  );
}
