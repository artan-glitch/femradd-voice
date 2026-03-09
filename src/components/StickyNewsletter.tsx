import { useState, useEffect } from "react";
import { X } from "lucide-react";
import NewsletterForm from "./NewsletterForm";

export default function StickyNewsletter() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 600 && !dismissed) {
        setVisible(true);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border shadow-nav animate-slide-up">
      <div className="container flex items-center justify-between py-3 gap-4">
        <p className="hidden md:block text-sm font-medium text-foreground whitespace-nowrap">
          📩 Abonohu për lajme javore
        </p>
        <NewsletterForm variant="sticky" />
        <button
          onClick={() => setDismissed(true)}
          aria-label="Mbyll"
          className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
