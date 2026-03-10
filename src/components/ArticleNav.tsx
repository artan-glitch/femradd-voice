import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Article } from "@/data/articles";

interface Props {
  prev: Article | undefined;
  next: Article | undefined;
}

export default function ArticleNav({ prev, next }: Props) {
  if (!prev && !next) return null;

  return (
    <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-10 border-t border-border pt-10" aria-label="Artikuj të tjerë">
      {prev ? (
        <Link
          to={`/artikull/${prev.slug}`}
          className="group flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-card transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground mb-1">Paraprake</p>
            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">{prev.title}</p>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          to={`/artikull/${next.slug}`}
          className="group flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-card transition-colors text-right sm:justify-end"
        >
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground mb-1">Tjetra</p>
            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">{next.title}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
