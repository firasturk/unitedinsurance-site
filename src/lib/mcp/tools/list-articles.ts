import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthenticated, fail, ok } from "../supabase";

export default defineTool({
  name: "list_articles",
  title: "List news articles",
  description: "List news articles of United Insurance, newest first.",
  inputSchema: {
    limit: z.number().int().optional().describe("Maximum number of articles to return (default 20)."),
    published_only: z.boolean().optional().describe("Only return published articles."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit, published_only }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    let query = supabaseForUser(ctx)
      .from("articles")
      .select("id, slug, date, category, title_en, title_ar, excerpt_en, excerpt_ar, published")
      .order("date", { ascending: false })
      .limit(Math.min(limit ?? 20, 100));
    if (published_only) query = query.eq("published", true);
    const { data, error } = await query;
    return error ? fail(error.message) : ok(data ?? []);
  },
});
