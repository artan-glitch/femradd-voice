import { Bookmark, BookmarkCheck } from "lucide-react";
import { useBookmark } from "@/hooks/useBookmark";

interface Props {
  slug: string;
  variant?: "icon" | "labeled";
}

export default function SaveArticleButton({ slug, variant = "icon" }: Props) {
  const { saved, toggle } = useBookmark(slug);

  if (variant === "labeled") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={saved}
        aria-label={saved ? "Hiq nga ruajturat" : "Ruaj artikullin"}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
          saved
            ? "bg-primary text-primary-foreground shadow-sm"
            : "bg-muted text-foreground hover:bg-primary/10 hover:text-primary"
        }`}
      >
        {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        {saved ? "Ruajtur" : "Ruaj artikullin"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? "Hiq nga ruajturat" : "Ruaj artikullin"}
      title={saved ? "Hiq nga ruajturat" : "Ruaj artikullin"}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-full border border-border transition-all ${
        saved
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/40"
      }`}
    >
      {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
    </button>
  );
}
