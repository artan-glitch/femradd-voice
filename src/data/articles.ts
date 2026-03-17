/**
 * Compatibility shim — re-exports from the new modular data structure.
 * Components can keep importing from "@/data/articles" without changes.
 */

export type { ArticleMeta, Article, ArticleFAQ } from "./articles/index";
export {
  articles,
  getArticleMetaBySlug as getArticleBySlug,
  getArticlesByCategory,
  getRelatedArticles,
  getArticlesByAuthor,
  resolveAuthor,
  loadArticleContent,
} from "./articles/index";

export type { Author, AuthorSocial } from "./authors";
export { authors, getAuthorBySlug } from "./authors";

export type { Category, CategoryConfig } from "./categories";
export {
  categories,
  categoryLabels,
  categoryColors,
  categoryMap,
  getCategoryConfig,
  navCategories,
  moreCategories,
} from "./categories";

// Legacy: AlbanianWoman interface (kept for backward compatibility)
export interface AlbanianWoman {
  id: string;
  name: string;
  title: string;
  image: string;
  slug: string;
}

export const albanianWomen: AlbanianWoman[] = [
  { id: "1", name: "Dua Lipa", title: "Këngëtare & Ikonë Globale", image: "/images/placeholders/grate-shqiptare.svg", slug: "dua-lipa" },
  { id: "2", name: "Rita Ora", title: "Këngëtare & Sipërmarrëse", image: "/images/placeholders/grate-shqiptare.svg", slug: "rita-ora" },
  { id: "3", name: "Elina Duni", title: "Artiste & Muzikante Jazz", image: "/images/placeholders/grate-shqiptare.svg", slug: "elina-duni" },
  { id: "4", name: "Majlinda Kelmendi", title: "Kampione Olimpike", image: "/images/placeholders/grate-shqiptare.svg", slug: "majlinda-kelmendi" },
];
