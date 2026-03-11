import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface Props {
  articleId: string;
}

type Reaction = "up" | "down" | null;

export default function ArticleReaction({ articleId }: Props) {
  const storageKey = `article-reaction-${articleId}`;
  const [reaction, setReaction] = useState<Reaction>(null);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved === "up" || saved === "down") setReaction(saved);
  }, [storageKey]);

  const handleReaction = (value: "up" | "down") => {
    const next = reaction === value ? null : value;
    setReaction(next);
    if (next) {
      localStorage.setItem(storageKey, next);
    } else {
      localStorage.removeItem(storageKey);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 py-8 my-6 border-y border-border">
      <p className="text-sm font-medium text-foreground">A ishte i dobishëm ky artikull?</p>
      <div className="flex gap-3">
        <button
          onClick={() => handleReaction("up")}
          aria-label="Po, ishte i dobishëm"
          aria-pressed={reaction === "up"}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
            reaction === "up"
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          Po
        </button>
        <button
          onClick={() => handleReaction("down")}
          aria-label="Jo, nuk ishte i dobishëm"
          aria-pressed={reaction === "down"}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
            reaction === "down"
              ? "bg-muted text-foreground border-border"
              : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <ThumbsDown className="w-4 h-4" />
          Jo
        </button>
      </div>
      {reaction && (
        <p className="text-xs text-muted-foreground mt-1">
          {reaction === "up" ? "Faleminderit për vlerësimin!" : "Faleminderit! Do t\u2019i përmirësojmë artikujt tanë."}
        </p>
      )}
    </div>
  );
}
