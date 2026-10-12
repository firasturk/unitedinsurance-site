import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// Roles: "admin" sees and manages everything; "hr" only sees job applications (and their CVs).
export type AdminRole = "admin" | "hr";

async function hasRole(supabase: any, userId: string, role: AdminRole): Promise<boolean> {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: role });
  return !error && !!data;
}

async function assertAdmin(supabase: any, userId: string) {
  if (!(await hasRole(supabase, userId, "admin"))) throw new Error("Forbidden: admin role required");
}

/** Allows any of the given roles (an admin always passes). */
async function assertRole(supabase: any, userId: string, roles: AdminRole[]) {
  for (const r of new Set<AdminRole>(["admin", ...roles])) if (await hasRole(supabase, userId, r)) return;
  throw new Error("Forbidden: insufficient role");
}

export const meIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => hasRole(context.supabase, context.userId, "admin"));

/** The signed-in user's admin-panel role, or null when they have none. */
export const meRole = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminRole | null> => {
    if (await hasRole(context.supabase, context.userId, "admin")) return "admin";
    if (await hasRole(context.supabase, context.userId, "hr")) return "hr";
    return null;
  });

// ===== Articles =====
const articleInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/i, "Lowercase letters, numbers, hyphens only"),
  date: z.string().min(4).max(20),
  category: z.string().min(1).max(50),
  cover_url: z.string().max(500).nullable().optional(),
  title_en: z.string().min(1).max(300),
  title_ar: z.string().min(1).max(300),
  excerpt_en: z.string().max(2000).default(""),
  excerpt_ar: z.string().max(2000).default(""),
  body_en: z.array(z.string().max(5000)).max(50).default([]),
  body_ar: z.array(z.string().max(5000)).max(50).default([]),
  published: z.boolean().default(true),
});

export const upsertArticle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => articleInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { id, ...rest } = data;
    const op = id
      ? context.supabase.from("articles").update(rest).eq("id", id).select().single()
      : context.supabase.from("articles").insert(rest).select().single();
    const { data: row, error } = await op;
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteArticle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("articles").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listArticlesAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("articles")
      .select("*")
      .order("date", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

// ===== Team =====
const teamInput = z.object({
  id: z.string().uuid().optional(),
  section: z.enum(["board", "executive", "senior"]),
  sort_order: z.number().int().min(0).max(1000),
  name_en: z.string().min(1).max(200),
  name_ar: z.string().min(1).max(200),
  role_en: z.string().min(1).max(200),
  role_ar: z.string().min(1).max(200),
  photo_url: z.string().max(500).nullable().optional(),
});

export const upsertTeamMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => teamInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { id, ...rest } = data;
    const op = id
      ? context.supabase.from("team_members").update(rest).eq("id", id).select().single()
      : context.supabase.from("team_members").insert(rest).select().single();
    const { data: row, error } = await op;
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteTeamMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("team_members").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ===== Forms =====
const formInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/i),
  category: z.enum(["application", "claim", "report", "complaint", "other"]),
  label_en: z.string().min(1).max(200),
  label_ar: z.string().min(1).max(200),
  file_url: z.string().min(1).max(4000),
  sort_order: z.number().int().min(0).max(1000),
});

export const upsertForm = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => formInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { id, ...rest } = data;
    const op = id
      ? context.supabase.from("forms").update(rest).eq("id", id).select().single()
      : context.supabase.from("forms").insert(rest).select().single();
    const { data: row, error } = await op;
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteForm = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("forms").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ===== Site Content =====
const siteInput = z.object({
  key: z.string().min(1).max(100),
  value: z.record(z.string(), z.any()),
});

export const upsertSiteContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => siteInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("site_content")
      .upsert({ key: data.key, value: data.value }, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ===== Insurance Services =====
const insuranceInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  sort_order: z.number().int().min(0).max(1000),
  active: z.boolean(),
  icon: z.string().min(1).max(50),
  emoji: z.string().max(10).nullable().optional(),
  image_url: z.string().max(500).nullable().optional(),
  tone: z.string().min(1).max(200),
  title_en: z.string().min(1).max(200),
  title_ar: z.string().min(1).max(200),
  summary_en: z.string().max(500).default(""),
  summary_ar: z.string().max(500).default(""),
  overview_en: z.string().max(5000).default(""),
  overview_ar: z.string().max(5000).default(""),
  covered_en: z.array(z.string().max(500)).max(30).default([]),
  covered_ar: z.array(z.string().max(500)).max(30).default([]),
  why_en: z.string().max(2000).default(""),
  why_ar: z.string().max(2000).default(""),
});

export const listInsuranceServicesAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("insurance_services")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const upsertInsuranceService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => insuranceInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { id, ...rest } = data;
    const op = id
      ? context.supabase.from("insurance_services").update(rest).eq("id", id).select().single()
      : context.supabase.from("insurance_services").insert(rest).select().single();
    const { data: row, error } = await op;
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteInsuranceService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("insurance_services").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ===== Partners =====
const partnerInput = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(200),
  logo_url: z.string().min(1).max(500),
  sort_order: z.number().int().min(0).max(1000),
  active: z.boolean(),
});

export const listPartnersAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("partners")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const upsertPartner = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => partnerInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { id, ...rest } = data;
    const op = id
      ? context.supabase.from("partners").update(rest).eq("id", id).select().single()
      : context.supabase.from("partners").insert(rest).select().single();
    const { data: row, error } = await op;
    if (error) throw new Error(error.message);
    return row;
  });

export const deletePartner = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("partners").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ===== Agent News =====
const agentNewsInput = z.object({
  id: z.string().uuid().optional(),
  date: z.string().min(1).max(40),
  title_en: z.string().max(400).default(""),
  title_ar: z.string().max(400).default(""),
  body_en: z.array(z.string().max(5000)).max(50).default([]),
  body_ar: z.array(z.string().max(5000)).max(50).default([]),
  sort_order: z.number().int().min(0).max(9999).default(1),
  published: z.boolean().default(true),
});

export const upsertAgentNews = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => agentNewsInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { id, ...rest } = data;
    const op = id
      ? context.supabase.from("agent_news").update(rest).eq("id", id).select().single()
      : context.supabase.from("agent_news").insert(rest).select().single();
    const { data: row, error } = await op;
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteAgentNews = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("agent_news").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const vacancyInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(120),
  title_en: z.string().min(1).max(200),
  title_ar: z.string().min(1).max(200),
  department_en: z.string().max(120).default(""),
  department_ar: z.string().max(120).default(""),
  level_en: z.string().max(120).default(""),
  level_ar: z.string().max(120).default(""),
  type_en: z.string().max(120).default(""),
  type_ar: z.string().max(120).default(""),
  location_en: z.string().max(160).default(""),
  location_ar: z.string().max(160).default(""),
  summary_en: z.string().max(2000).default(""),
  summary_ar: z.string().max(2000).default(""),
  responsibilities_en: z.array(z.string().max(600)).default([]),
  responsibilities_ar: z.array(z.string().max(600)).default([]),
  qualifications_en: z.array(z.string().max(600)).default([]),
  qualifications_ar: z.array(z.string().max(600)).default([]),
  skills_en: z.array(z.string().max(200)).default([]),
  skills_ar: z.array(z.string().max(200)).default([]),
  closing_date: z.string().max(20).nullable().optional(),
  published: z.boolean().default(true),
  sort_order: z.number().int().default(1),
});

export const listAllVacancies = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("job_vacancies")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const upsertVacancy = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => vacancyInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { id, ...rest } = data;
    const payload = { ...rest, closing_date: rest.closing_date || null };
    const op = id
      ? context.supabase.from("job_vacancies").update(payload).eq("id", id).select().single()
      : context.supabase.from("job_vacancies").insert(payload).select().single();
    const { data: row, error } = await op;
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteVacancy = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("job_vacancies").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listApplications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertRole(context.supabase, context.userId, ["hr"]);
    const { data, error } = await context.supabase
      .from("job_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const updateApplicationStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(["new", "reviewing", "shortlisted", "rejected", "hired"]) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, context.userId, ["hr"]);
    const { error } = await context.supabase.from("job_applications").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, context.userId, ["hr"]);
    const { error } = await context.supabase.from("job_applications").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// CVs are personal data: never served from a public URL. Admins and HR get a short-lived signed
// download link (60 s) generated through their own session, so storage RLS still applies.
// `inline` = a 10-minute link that opens in the browser (PDF preview); otherwise a 60-second download link.
export const getCvUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ path: z.string().min(1).max(300), inline: z.boolean().optional() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, context.userId, ["hr"]);
    const safe = data.path
      .split("/")
      .filter((s) => s && s !== "." && s !== "..")
      .join("/");
    const filename = safe.split("/").pop() ?? "cv";
    const { data: signed, error } = data.inline
      ? await context.supabase.storage.from("cvs").createSignedUrl(safe, 600)
      : await context.supabase.storage.from("cvs").createSignedUrl(safe, 60, { download: filename });
    if (error || !signed?.signedUrl) throw new Error(error?.message ?? "Could not create a download link");
    return { url: signed.signedUrl };
  });

// ===== Contact messages =====
export const listContactMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const updateContactStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(["new", "in_progress", "done"]) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("contact_messages").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteContactMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("contact_messages").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ===== Suggestions & complaints =====
export const listComplaints = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("complaints")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const updateComplaintStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(["new", "in_progress", "resolved", "closed"]) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("complaints").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteComplaint = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("complaints").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
