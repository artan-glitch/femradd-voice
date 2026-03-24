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
  lang?: string;
}

function setOrCreateLink(rel: string, href: string, extra?: Record<string, string>): HTMLLinkElement {
  const selector = extra
    ? `link[rel="${rel}"][hreflang="${extra.hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang]):not([type])`;
  let el = document.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    if (extra) Object.entries(extra).forEach(([k, v]) => el!.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.href = href;
  return el;
}

export default function ArticleHead({ title, description, image, imageAlt, url, publishedAt, modifiedAt, author, section, lang = "sq" }: Props) {
  useEffect(() => {
    // Title
    document.title = `${title} — FemraDD`;

    // Ensure absolute image URL for social sharing
    const absImage = image.startsWith("http") ? image : `https://www.femradd.com${image}`;

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

    // Hreflang — dynamic per page and language
    const hreflangTag = setOrCreateLink("alternate", url, { hreflang: lang });
    const hreflangDefault = setOrCreateLink("alternate", url, { hreflang: "x-default" });

    // Open Graph
    setMeta("property", "og:type", "article");
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", absImage);
    setMeta("property", "og:image:width", "1200");
    setMeta("property", "og:image:height", "630");
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
    setMeta("name", "twitter:image", absImage);
    if (imageAlt) {
      setMeta("name", "twitter:image:alt", imageAlt);
    }

    return () => {
      document.title = "FemraDD — Zëri i Gruas Shqiptare";
      // Clean up hreflang tags
      hreflangTag.remove();
      hreflangDefault.remove();
    };
  }, [title, description, image, imageAlt, url, publishedAt, modifiedAt, author, section, lang]);

  return null;
}
