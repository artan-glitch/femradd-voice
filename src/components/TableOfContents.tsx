import { useEffect, useState } from "react";
import { List } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface Props {
  contentHtml: string;
  variant?: "inline" | "sidebar";
}

export default function TableOfContents({ contentHtml, variant = "inline" }: Props) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(contentHtml, "text/html");
    const headings = doc.querySelectorAll("h2, h3");
    const tocItems: TocItem[] = [];
    headings.forEach((h, i) => {
      const id = `heading-${i}`;
      tocItems.push({
        id,
        text: h.textContent || "",
        level: h.tagName === "H2" ? 2 : 3,
      });
    });
    setItems(tocItems);
  }, [contentHtml]);

  // Add IDs to rendered headings and track active heading
  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;
    const headings = article.querySelectorAll("h2, h3");
    headings.forEach((h, i) => {
      h.id = `heading-${i}`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  const isSidebar = variant === "sidebar";

  return (
    <nav
      className={
        isSidebar
          ? "sticky top-20 p-4"
          : "my-8 p-5 bg-card rounded-xl border border-border"
      }
      aria-label="Përmbajtja"
    >
      <div className="flex items-center gap-2 mb-3">
        <List className="w-4 h-4 text-primary" />
        <span className="font-serif font-semibold text-sm text-foreground">Përmbajtja</span>
      </div>
      <ol className="space-y-0.5">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? "ml-4" : ""}>
            <a
              href={`#${item.id}`}
              className={`block text-[13px] leading-snug py-1 transition-colors hover:text-primary ${
                activeId === item.id
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
