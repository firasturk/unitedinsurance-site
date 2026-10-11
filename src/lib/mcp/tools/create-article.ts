import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthenticated, fail, ok } from "../supabase";

export default defineTool({
  name: "create_article",
  title: "Create a news article",
  description:
    "Create a new bilingual news article. Requires admin rights on the United Insurance site.",
  inputSchema: {
    slug: z.string().describe("URL slug, lowercase letters, numbers and hyphens."),
    date: z.string().describe("Publication date, e.g. '2026-07-30'."),
    category: z.string().describe("Category label, e.g. 'Announcement'."),
    title_en: z.string(),
    title_ar: z.string(),
    excerpt_en: z.string().optional(),
    excerpt_ar: z.string().optional(),
    body_en: z.array(z.string()).optional().describe("English body, one entry per paragraph."),
    body_ar: z.array(z.string()).optional().describe("Arabic body, one entry per paragraph."),
    published: z.boolean().optional().describe("Publish immediately (default true)."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    const { data, error } = await supabaseForUser(ctx)
      .from("articles")
      .insert({
        slug: input.slug,
        date: input.date,
        category: input.category,
        title_en: input.title_en,
        title_ar: input.title_ar,
        excerpt_en: input.excerpt_en ?? "",
        excerpt_ar: input.excerpt_ar ?? "",
        body_en: input.body_en ?? [],
        body_ar: input.body_ar ?? [],
        published: input.published ?? true,
      })
      .select()
      .single();
    return error ? fail(error.message) : ok(data);
  },
});
