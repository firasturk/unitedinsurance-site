// Language lives in the URL: Arabic (default) at "/…", English at "/en/…".
// The router strips/adds the "/en" prefix (see src/router.tsx), so route files keep
// their plain paths and every <Link> automatically gets the prefix of the current language.

export type Lang = "en" | "ar";
export const DEFAULT_LANG: Lang = "ar";
export const LANGS: Lang[] = ["ar", "en"];

/** Canonical origin of the site — used for absolute canonical/og URLs and the sitemap. */
export const SITE_URL = "https://unitedjo.com";

/** Paths that are never language-prefixed (admin, auth, API, files). */
const UNPREFIXED = /^\/(admin|auth|api|sitemap\.xml|robots\.txt|media|forms|assets|favicon\.ico)(\/|$)/;

export function isUnprefixedPath(pathname: string): boolean {
  return UNPREFIXED.test(pathname);
}

export function langFromPathname(pathname: string): Lang {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "ar";
}

/** "/en/about" → "/about"; "/en" → "/"; "/about" → "/about" */
export function stripLangPrefix(pathname: string): string {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3);
  return pathname;
}

/** "/about" + "en" → "/en/about"; "/" + "en" → "/en"; anything + "ar" → unchanged */
export function withLangPrefix(pathname: string, lang: Lang): string {
  const clean = stripLangPrefix(pathname);
  if (lang !== "en" || isUnprefixedPath(clean)) return clean;
  return clean === "/" ? "/en" : `/en${clean}`;
}

export function absoluteUrl(pathname: string, lang?: Lang): string {
  const p = lang ? withLangPrefix(pathname, lang) : pathname;
  return `${SITE_URL}${p.startsWith("/") ? "" : "/"}${p}`;
}
