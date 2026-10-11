import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthenticated, fail, ok } from "../supabase";

export default defineTool({
  name: "list_forms",
  title: "List downloadable forms",
  description:
    "List the downloadable PDF forms and reports published on the United Insurance site, with their file URLs.",
  inputSchema: {
    category: z
      .enum(["application", "claim", "report", "complaint", "other"])
      .optional()
      .describe("Filter by form category."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    let query = supabaseForUser(ctx)
      .from("forms")
      .select("id, slug, category, label_en, label_ar, file_url, sort_order")
      .order("sort_order", { ascending: true });
    if (category) query = query.eq("category", category);
    const { data, error } = await query;
    return error ? fail(error.message) : ok(data ?? []);
  },
});
