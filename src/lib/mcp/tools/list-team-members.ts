import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthenticated, fail, ok } from "../supabase";

export default defineTool({
  name: "list_team_members",
  title: "List team members",
  description: "List United Insurance team members (board, executive management, senior management).",
  inputSchema: {
    section: z.enum(["board", "executive", "senior"]).optional().describe("Filter by section."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ section }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    let query = supabaseForUser(ctx)
      .from("team_members")
      .select("id, section, sort_order, name_en, name_ar, role_en, role_ar, photo_url")
      .order("section", { ascending: true })
      .order("sort_order", { ascending: true });
    if (section) query = query.eq("section", section);
    const { data, error } = await query;
    return error ? fail(error.message) : ok(data ?? []);
  },
});
