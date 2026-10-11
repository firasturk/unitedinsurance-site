import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/locale";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(
          [
            "User-agent: *",
            "Allow: /",
            "Disallow: /admin",
            "Disallow: /auth",
            "Disallow: /api/",
            "",
            `Sitemap: ${SITE_URL}/sitemap.xml`,
            "",
          ].join("\n"),
          { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" } },
        ),
    },
  },
});
