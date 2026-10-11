import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthenticated, fail, ok } from "../supabase";

export default defineTool({
  name: "update_article",
  title: "Update a news article",
  description:
    "Update fields of an existing news article, identified by slug. Only provided fields change. Requires admin rights.",
  inputSchema: {
    slug: z.string().describe("Slug of the article to update."),
    date: z.string().optional(),
    category: z.string().optional(),
    title_en: z.string().optional(),
    title_ar: z.string().optional(),
    excerpt_en: z.string().optional(),
    excerpt_ar: z.string().optional(),
    body_en: z.array(z.string()).optional(),
    body_ar: z.array(z.string()).optional(),
    published: z.boolean().optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ slug, ...patch }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    const updates = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined));
    if (Object.keys(updates).length === 0) return fail("No fields to update.");
    const { data, error } = await supabaseForUser(ctx)
      .from("articles")
      .update(updates)
      .eq("slug", slug)
      .select()
      .maybeSingle();
    if (error) return fail(error.message);
    if (!data) return fail(`No article updated for slug "${slug}" (not found or not permitted).`);
    return ok(data);
  },
});
