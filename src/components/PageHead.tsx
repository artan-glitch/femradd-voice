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
    const ogImage = image || "https://femradd.com/og-image.png";
    const ogImageAlt = imageAlt || title;
    setMeta("property", "og:image", ogImage);
    setMeta("property", "og:image:alt", ogImageAlt);

    // Twitter
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", ogImage);
    setMeta("name", "twitter:image:alt", ogImageAlt);

    return () => {
      document.title = "FemraDD — Zëri i Gruas Shqiptare";
    };
  }, [title, description, url, type, image, imageAlt]);

  return null;
}
