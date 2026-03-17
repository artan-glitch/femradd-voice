import { Link } from "react-router-dom";
import { Tag } from "lucide-react";
import { categories as allCategoryConfigs, categoryLabels } from "@/data/articles";

interface Props {
  category: string;
  relatedCategories?: string[];
}

export default function ArticleTags({ category, relatedCategories }: Props) {
  const allCategorySlugs = allCategoryConfigs.map((c) => c.slug);

  const displayCategories = relatedCategories
    ? [category, ...relatedCategories.filter((c) => c !== category)]
    : [category, ...allCategorySlugs.filter((c) => c !== category).slice(0, 2)];

  return (
    <div className="flex flex-wrap items-center gap-2 my-8 pt-8 border-t border-border">
      <Tag className="w-4 h-4 text-muted-foreground" />
      {displayCategories.map((cat) => (
        <Link
          key={cat}
          to={`/kategori/${cat}`}
          className="text-xs font-medium px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          {categoryLabels[cat] || cat}
        </Link>
      ))}
    </div>
  );
}
