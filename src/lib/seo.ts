import type React from "react";
import { absoluteUrl, SITE_URL, type Lang } from "./locale";

type Bi = { en: string; ar: string };

export const SITE_NAME: Bi = { en: "United Insurance", ar: "الشركة المتحدة للتأمين" };
export const DEFAULT_OG_IMAGE = `${SITE_URL}/media/og-image.jpg`;

export type PageSeo = {
  lang: Lang;
  /** Site-relative path WITHOUT language prefix, e.g. "/about" or "/news/some-slug". */
  path: string;
  title: Bi | string;
  description: Bi | string;
  /** Absolute or site-relative image for social previews. */
  image?: string | null;
  type?: "website" | "article";
  noindex?: boolean;
  /** Extra JSON-LD objects to embed. */
  jsonLd?: Record<string, unknown>[];
};

const pick = (v: Bi | string, lang: Lang) => (typeof v === "string" ? v : v[lang]);

function absImage(img: string | null | undefined) {
  if (!img) return DEFAULT_OG_IMAGE;
  if (/^https?:\/\//i.test(img)) return img;
  return `${SITE_URL}${img.startsWith("/") ? "" : "/"}${img}`;
}

/** Builds the head() result for a public page: title, description, canonical, hreflang, Open Graph, Twitter, JSON-LD. */
export function pageHead(seo: PageSeo) {
  const { lang, path } = seo;
  const title = pick(seo.title, lang);
  const description = pick(seo.description, lang);
  const fullTitle = title.includes(SITE_NAME.en) || title.includes(SITE_NAME.ar) ? title : `${title} — ${SITE_NAME[lang]}`;
  const url = absoluteUrl(path, lang);
  const image = absImage(seo.image);

  // The router accepts `{ "script:ld+json": object }` entries in meta (rendered as JSON-LD),
  // which React's MetaHTMLAttributes type does not know about — hence the cast.
  const meta: Array<Record<string, unknown>> = [
      { title: fullTitle },
      { name: "description", content: description },
      ...(seo.noindex ? [{ name: "robots", content: "noindex, nofollow" }] : []),
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: seo.type ?? "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { property: "og:locale", content: lang === "ar" ? "ar_JO" : "en_US" },
      { property: "og:locale:alternate", content: lang === "ar" ? "en_US" : "ar_JO" },
      { property: "og:site_name", content: SITE_NAME[lang] },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
      // JSON-LD rides on the meta list so the router merges it with the page's other tags.
      ...(seo.jsonLd ?? []).map((obj) => ({ "script:ld+json": obj })),
  ];

  return {
    meta: meta as Array<React.MetaHTMLAttributes<HTMLMetaElement>>,
    links: [
      { rel: "canonical", href: url },
      { rel: "alternate", hrefLang: "ar", href: absoluteUrl(path, "ar") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl(path, "en") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl(path, "ar") },
    ],
  };
}

/** Organization schema (shared by the homepage and as a fallback). */
export function organizationJsonLd(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    name: SITE_NAME[lang],
    alternateName: lang === "ar" ? SITE_NAME.en : SITE_NAME.ar,
    url: SITE_URL,
    logo: `${SITE_URL}/media/united-logo.png`,
    image: DEFAULT_OG_IMAGE,
    foundingDate: "1972",
    telephone: "+962-6-200-3333",
    email: "uic@unitedjo.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: lang === "ar" ? "شارع زهران، بناية رقم 188" : "Zahran Street, Building No. 188",
      addressLocality: lang === "ar" ? "عمّان" : "Amman",
      addressCountry: "JO",
    },
    sameAs: ["https://www.instagram.com/unitedinsurancejor/"],
  };
}
