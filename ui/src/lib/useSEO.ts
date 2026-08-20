import { useEffect } from "react";

const BASE_URL = "https://ooshare.io";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;
const SITE_NAME = "Only Once Share";
const LANGUAGES = ["en", "zh", "es", "hi", "ar", "pt"];

interface SEOProps {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  /**
   * When true, marks the page "noindex, nofollow" and omits the canonical URL
   * and hreflang alternates. Used for internal dev pages (e.g. /components)
   * that must never advertise a canonical or alternates to search engines.
   */
  noindex?: boolean;
}

function setMeta(selector: string, attribute: string, value: string) {
  document.querySelector(selector)?.setAttribute(attribute, value);
}

export default function useSEO({ title, description, path, ogImage, noindex = false }: SEOProps) {
  useEffect(() => {
    const url = `${BASE_URL}${path}`;
    const image = ogImage ?? DEFAULT_OG_IMAGE;

    document.title = title;
    setMeta('meta[name="description"]', "content", description);

    // Open Graph + Twitter set for both indexed and no-index pages, so social
    // previews keep working on an internal dev page.
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:image"]', "content", image);
    setMeta('meta[property="og:site_name"]', "content", SITE_NAME);
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", image);

    // No-index pages: block indexing and omit canonical + hreflang entirely so
    // an unindexed dev page never advertises a canonical/alternates.
    if (noindex) {
      setMeta('meta[name="robots"]', "content", "noindex, nofollow");
      document.querySelectorAll("link[rel='canonical']").forEach((el) => el.remove());
      document.querySelectorAll("link[hreflang]").forEach((el) => el.remove());
      return;
    }

    setMeta('meta[name="robots"]', "content", "index, follow");
    setMeta('link[rel="canonical"]', "href", url);

    // Hreflang tags
    document.querySelectorAll("link[hreflang]").forEach((el) => el.remove());
    for (const lang of LANGUAGES) {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = lang;
      link.href = `${url}?lng=${lang}`;
      document.head.appendChild(link);
    }
    const xDefault = document.createElement("link");
    xDefault.rel = "alternate";
    xDefault.setAttribute("hreflang", "x-default");
    xDefault.href = url;
    document.head.appendChild(xDefault);
  }, [title, description, path, ogImage, noindex]);
}
