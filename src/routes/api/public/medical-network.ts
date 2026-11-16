import { createFileRoute } from "@tanstack/react-router";

// Latest medical-network snapshot uploaded from Admin → Medical Network.
// 404 when nothing has been uploaded yet; the page then falls back to /media/medical-network.json.
export const Route = createFileRoute("/api/public/medical-network")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin
          .from("medical_network")
          .select("data")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (error || !data) return new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
        return new Response(JSON.stringify(data.data), {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            // an upload shows up within ~5 minutes
            "Cache-Control": "public, max-age=60, s-maxage=300",
          },
        });
      },
    },
  },
});
