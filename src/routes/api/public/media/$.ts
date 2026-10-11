import { createFileRoute } from "@tanstack/react-router";

// Serves dashboard-uploaded files from the site's own address.
// Buckets are private, so the file is fetched server-side and streamed back.
const ALLOWED_BUCKETS = new Set(["articles", "team", "forms", "insurance", "logos", "cvs"]);

const MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  avif: "image/avif",
  ico: "image/x-icon",
  pdf: "application/pdf",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
  woff: "font/woff",
  woff2: "font/woff2",
  txt: "text/plain; charset=utf-8",
};

function mimeFor(path: string, fallback?: string) {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  return MIME[ext] ?? fallback ?? "application/octet-stream";
}

export const Route = createFileRoute("/api/public/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const splat = params._splat ?? "";
        const slash = splat.indexOf("/");
        const bucket = splat.slice(0, slash);
        const path = decodeURIComponent(splat.slice(slash + 1));

        if (
          slash < 1 ||
          !ALLOWED_BUCKETS.has(bucket) ||
          !path ||
          path.includes("..") ||
          path.startsWith("/")
        ) {
          return new Response("Not found", { status: 404 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from(bucket).download(path);

        if (error || !data) {
          return new Response("Not found", { status: 404 });
        }

        return new Response(data, {
          headers: {
            "Content-Type": mimeFor(path, data.type),
            "Content-Length": String(data.size),
            "Cache-Control": "public, max-age=31536000, immutable",
            "Content-Disposition": `inline; filename="${path.split("/").pop() ?? "file"}"`,
            "X-Content-Type-Options": "nosniff",
          },
        });
      },
    },
  },
});
