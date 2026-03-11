import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { articles, categoryColors } from "@/data/articles";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = query.trim().length >= 2
    ? articles.filter((a) => {
        const q = query.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.categoryLabel.toLowerCase().includes(q) ||
          a.author.name.toLowerCase().includes(q)
        );
      })
    : [];

  const handleSelect = useCallback(
    (slug: string) => {
      navigate(`/artikull/${slug}`);
      setQuery("");
      onClose();
    },
    [navigate, onClose]
  );

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // Keyboard navigation
  const [activeIndex, setActiveIndex] = useState(-1);
  useEffect(() => setActiveIndex(-1), [query]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
      handleSelect(results[activeIndex].slug);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-labelledby="search-modal-title">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative mx-auto mt-[10vh] w-[90%] max-w-xl bg-background rounded-2xl shadow-xl overflow-hidden border border-border">
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <label id="search-modal-title" htmlFor="search-input" className="sr-only">Kërko artikuj</label>
          <input
            ref={inputRef}
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Kërko artikuj, tema, autorë..."
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-base"
            aria-autocomplete="list"
            aria-controls="search-results"
          />
          <button onClick={onClose} className="p-1 rounded hover:bg-muted transition-colors" aria-label="Mbyll">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Results */}
        <div id="search-results" className="max-h-[50vh] overflow-y-auto" role="listbox" aria-live="polite">
          {query.trim().length < 2 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">
              Shkruaj të paktën 2 shkronja për të kërkuar...
            </div>
          ) : results.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">
              Asnjë rezultat për "{query}"
            </div>
          ) : (
            <ul className="py-2">
              {results.map((article, i) => (
                <li key={article.id}>
                  <button
                    onClick={() => handleSelect(article.slug)}
                    className={`w-full flex items-start gap-4 px-5 py-3 text-left transition-colors ${
                      i === activeIndex ? "bg-muted" : "hover:bg-muted/60"
                    }`}
                  >
                    <img
                      src={article.image}
                      alt=""
                      loading="lazy"
                      width={56}
                      height={40}
                      className="w-14 h-10 rounded-lg object-cover shrink-0 mt-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground line-clamp-1">
                        {article.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${categoryColors[article.category]}`}>
                          {article.categoryLabel}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {article.author.name}
                        </span>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-5 py-2.5 border-t border-border text-[11px] text-muted-foreground flex items-center gap-4">
          <span><kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">↑↓</kbd> navigim</span>
          <span><kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Enter</kbd> hap</span>
          <span><kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Esc</kbd> mbyll</span>
        </div>
      </div>
    </div>
  );
}
