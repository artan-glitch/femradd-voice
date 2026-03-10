import { Link } from "react-router-dom";
import type { Author } from "@/data/articles";

export default function AuthorBio({ author }: { author: Author }) {
  return (
    <div className="flex items-start gap-4 p-6 bg-card rounded-xl border border-border my-10">
      <Link to={`/autore/${author.slug}`} className="shrink-0">
        <img
          src={author.avatar}
          alt={author.name}
          className="w-14 h-14 rounded-full object-cover"
          width={56}
          height={56}
        />
      </Link>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Shkruar nga</p>
        <Link to={`/autore/${author.slug}`} className="font-serif font-semibold text-foreground hover:text-primary transition-colors">
          {author.name}
        </Link>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{author.bio}</p>
      </div>
    </div>
  );
}
