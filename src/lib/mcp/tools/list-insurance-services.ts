import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthenticated, fail, ok } from "../supabase";

export default defineTool({
  name: "list_insurance_services",
  title: "List insurance services",
  description: "List the insurance services offered by United Insurance, with bilingual details.",
  inputSchema: {
    active_only: z.boolean().optional().describe("Only return active services."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ active_only }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    let query = supabaseForUser(ctx)
      .from("insurance_services")
      .select("id, slug, sort_order, active, title_en, title_ar, summary_en, summary_ar, overview_en, overview_ar, covered_en, covered_ar")
      .order("sort_order", { ascending: true });
    if (active_only) query = query.eq("active", true);
    const { data, error } = await query;
    return error ? fail(error.message) : ok(data ?? []);
  },
});
