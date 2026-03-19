import { useEffect } from "react";

interface Props {
  title: string;
  description: string;
  url: string;
  type?: string;
  image?: string;
  imageAlt?: string;
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

export default function PageHead({ title, description, url, type = "website", image, imageAlt, lang = "sq" }: Props) {
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

    // Hreflang — dynamic per page
    const hreflangSq = setOrCreateLink("alternate", url, { hreflang: lang });
    const hreflangDefault = setOrCreateLink("alternate", url, { hreflang: "x-default" });

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
    setMeta("property", "og:image:width", "1200");
    setMeta("property", "og:image:height", "630");

    // Twitter
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", ogImage);
    setMeta("name", "twitter:image:alt", ogImageAlt);

    return () => {
      document.title = "FemraDD — Zëri i Gruas Shqiptare";
      // Clean up hreflang tags
      hreflangSq.remove();
      hreflangDefault.remove();
    };
  }, [title, description, url, type, image, imageAlt, lang]);

  return null;
}
