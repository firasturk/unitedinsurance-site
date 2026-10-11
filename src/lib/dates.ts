import type { Lang } from "./locale";

// Deterministic date formatting (no Intl): the server (Cloudflare) and the browser must
// render the exact same text or React reports a hydration mismatch. Also avoids the
// Arabic-Indic digits Intl picks for "ar-JO", which the site's design doesn't use.
const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTHS_EN_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_AR = ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"];

function parts(iso: string): { y: number; m: number; d: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return null;
  return { y: Number(m[1]), m: Number(m[2]) - 1, d: Number(m[3]) };
}

/** "2025-03-20" → "20 آذار 2025" / "March 20, 2025" (or short "Mar 20, 2025"). */
export function formatDate(iso: string, lang: Lang, style: "long" | "short" = "long"): string {
  const p = parts(iso);
  if (!p) return iso;
  if (lang === "ar") return `${p.d} ${MONTHS_AR[p.m]} ${p.y}`;
  const month = style === "short" ? MONTHS_EN_SHORT[p.m] : MONTHS_EN[p.m];
  return `${month} ${p.d}, ${p.y}`;
}
