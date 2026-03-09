import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  items: Crumb[];
}

export default function Breadcrumbs({ items }: Props) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `https://femradd.com${item.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ol className="flex items-center flex-wrap gap-1">
        {items.map((crumb, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="w-3.5 h-3.5" />}
            {crumb.href && i < items.length - 1 ? (
              <Link to={crumb.href} className="hover:text-foreground transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className={i === items.length - 1 ? "text-foreground font-medium" : ""}>
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
