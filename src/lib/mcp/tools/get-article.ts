import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthenticated, fail, ok } from "../supabase";

export default defineTool({
  name: "get_article",
  title: "Get a news article",
  description: "Get the full bilingual content of one news article by its slug.",
  inputSchema: { slug: z.string().describe("Article slug, e.g. 'general-assembly-53'.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    const { data, error } = await supabaseForUser(ctx)
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) return fail(error.message);
    if (!data) return fail(`No article found with slug "${slug}".`);
    return ok(data);
  },
});
