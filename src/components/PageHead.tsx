import { useEffect } from "react";

interface Props {
  title: string;
  description: string;
  url: string;
  type?: string;
  image?: string;
  imageAlt?: string;
}

export default function PageHead({ title, description, url, type = "website", image, imageAlt }: Props) {
  useEffect(() => {
    document.title = `${title} — FemraDD`;

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

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    // Open Graph
    setMeta("property", "og:type", type);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:site_name", "FemraDD");
    setMeta("property", "og:locale", "sq_AL");
    if (image) {
      setMeta("property", "og:image", image);
      setMeta("property", "og:image:alt", imageAlt || title);
    }

    // Twitter
    setMeta("name", "twitter:card", image ? "summary_large_image" : "summary");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    if (image) {
      setMeta("name", "twitter:image", image);
      setMeta("name", "twitter:image:alt", imageAlt || title);
    }

    return () => {
      document.title = "FemraDD — Zëri i Gruas Shqiptare";
    };
  }, [title, description, url, type, image, imageAlt]);

  return null;
}
