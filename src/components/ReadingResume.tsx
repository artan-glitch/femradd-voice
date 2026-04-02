import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, BookOpen } from "lucide-react";

interface SavedReading {
  slug: string;
  title: string;
  percent: number;
}

export default function ReadingResume() {
  const [reading, setReading] = useState<SavedReading | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("femradd-reading");
      if (raw) {
        const data: SavedReading = JSON.parse(raw);
        if (data.percent > 20 && data.percent < 90) {
          setReading(data);
          const timer = setTimeout(() => setDismissed(true), 8000);
          return () => clearTimeout(timer);
        }
      }
    } catch {}
  }, []);

  if (!reading || dismissed) return null;

  return (
    <div className="fixed bottom-16 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-40 animate-in slide-in-from-bottom-4">
      <div className="bg-foreground text-background rounded-lg shadow-lg p-4 flex items-center gap-3">
        <BookOpen className="w-5 h-5 flex-shrink-0 text-primary" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-background/60">Vazhdo leximin</p>
          <Link
            to={`/artikull/${reading.slug}`}
            className="text-sm font-medium truncate block hover:text-primary transition-colors"
            onClick={() => setDismissed(true)}
          >
            {reading.title} &rarr;
          </Link>
        </div>
        <button onClick={() => setDismissed(true)} className="p-1 hover:bg-background/10 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
