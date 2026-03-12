import { useEffect } from "react";

interface Props {
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
  url: string;
  publishedAt: string;
  modifiedAt: string;
  author: string;
  section?: string;
}

export default function ArticleHead({ title, description, image, imageAlt, url, publishedAt, modifiedAt, author, section }: Props) {
  useEffect(() => {
    // Title
    document.title = `${title} — FemraDD`;

    // Helper to set/create meta tag
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    // Basic meta
    setMeta("name", "description", description);
    setMeta("name", "author", author);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    // Open Graph
    setMeta("property", "og:type", "article");
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", image);
    setMeta("property", "og:url", url);
    setMeta("property", "og:site_name", "FemraDD");
    setMeta("property", "og:locale", "sq_AL");
    setMeta("property", "article:published_time", publishedAt);
    setMeta("property", "article:modified_time", modifiedAt);
    setMeta("property", "article:author", author);
    if (section) {
      setMeta("property", "article:section", section);
      setMeta("property", "article:tag", section);
    }
    if (imageAlt) {
      setMeta("property", "og:image:alt", imageAlt);
    }

    // Twitter
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);
    if (imageAlt) {
      setMeta("name", "twitter:image:alt", imageAlt);
    }

    return () => {
      document.title = "FemraDD — Zëri i Gruas Shqiptare";
    };
  }, [title, description, image, imageAlt, url, publishedAt, modifiedAt, author, section]);

  return null;
}
