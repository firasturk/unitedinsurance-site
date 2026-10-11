import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL, withLangPrefix, type Lang } from "@/lib/locale";

const STATIC_PATHS = [
  "/", "/about", "/insurance", "/team", "/team/board", "/team/executive", "/reports",
  "/governance", "/governance/code-of-conduct", "/whistleblower", "/news", "/complaints",
  "/agents", "/careers", "/contact", "/quote", "/privacy",
];

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** One <url> entry per language, each listing both alternates (hreflang). */
function entry(path: string, lastmod?: string | null) {
  const langs: Lang[] = ["ar", "en"];
  return langs
    .map((lang) => {
      const loc = `${SITE_URL}${withLangPrefix(path, lang)}`;
      const alts = langs
        .map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${esc(`${SITE_URL}${withLangPrefix(path, l)}`)}"/>`)
        .join("");
      const xdef = `<xhtml:link rel="alternate" hreflang="x-default" href="${esc(`${SITE_URL}${withLangPrefix(path, "ar")}`)}"/>`;
      return `<url><loc>${esc(loc)}</loc>${lastmod ? `<lastmod>${lastmod.slice(0, 10)}</lastmod>` : ""}${alts}${xdef}</url>`;
    })
    .join("");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const [articles, services, vacancies] = await Promise.all([
          supabaseAdmin.from("articles").select("slug,date").eq("published", true),
          supabaseAdmin.from("insurance_services").select("slug").eq("active", true),
          supabaseAdmin.from("job_vacancies").select("slug,created_at").eq("published", true),
        ]);

        const parts: string[] = [];
        for (const p of STATIC_PATHS) parts.push(entry(p));
        for (const s of services.data ?? []) parts.push(entry(`/insurance/${s.slug}`));
        for (const a of articles.data ?? []) parts.push(entry(`/news/${a.slug}`, a.date));
        for (const v of vacancies.data ?? []) parts.push(entry(`/careers/${v.slug}`, (v as { created_at?: string }).created_at));

        const xml =
          `<?xml version="1.0" encoding="UTF-8"?>` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">` +
          parts.join("") +
          `</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
