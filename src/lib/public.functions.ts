import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type ArticleRow = {
  id: string;
  slug: string;
  date: string;
  category: string;
  cover_url: string | null;
  title_en: string;
  title_ar: string;
  excerpt_en: string;
  excerpt_ar: string;
  body_en: string[];
  body_ar: string[];
  published: boolean;
};

export type TeamRow = {
  id: string;
  section: "board" | "executive" | "senior";
  sort_order: number;
  name_en: string;
  name_ar: string;
  role_en: string;
  role_ar: string;
  photo_url: string | null;
};

export type FormRow = {
  id: string;
  slug: string;
  category: "application" | "claim" | "report" | "complaint" | "other";
  label_en: string;
  label_ar: string;
  file_url: string;
  sort_order: number;
};

export type InsuranceServiceRow = {
  id: string;
  slug: string;
  sort_order: number;
  active: boolean;
  icon: string;
  emoji: string | null;
  image_url: string | null;
  tone: string;
  title_en: string;
  title_ar: string;
  summary_en: string;
  summary_ar: string;
  overview_en: string;
  overview_ar: string;
  covered_en: string[];
  covered_ar: string[];
  why_en: string;
  why_ar: string;
};


export const listArticles = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("articles")
    .select("*")
    .eq("published", true)
    .order("date", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as ArticleRow[];
});

export const getArticleBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("articles")
      .select("*")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    return (row ?? null) as ArticleRow | null;
  });

export const listTeam = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("team_members")
    .select("*")
    .order("section", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as TeamRow[];
});

// POST prevents browsers and the hosting layer from reusing a stale forms response
// after an administrator publishes a new report.
export const listForms = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("forms")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as FormRow[];
});

export const getSiteContent = createServerFn({ method: "GET" })
  .inputValidator((d: { key: string }) => z.object({ key: z.string().min(1).max(100) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("site_content")
      .select("value")
      .eq("key", data.key)
      .maybeSingle();
    // Serialize as JSON string to avoid TanStack serializer's index-signature restriction
    return { json: row?.value ? JSON.stringify(row.value) : null };
  });

export const listInsuranceServices = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("insurance_services")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as InsuranceServiceRow[];
});

export const getInsuranceServiceBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(100) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("insurance_services")
      .select("*")
      .eq("slug", data.slug)
      .eq("active", true)
      .maybeSingle();
    return (row ?? null) as InsuranceServiceRow | null;
  });

export type PartnerRow = {
  id: string;
  name: string;
  logo_url: string;
  sort_order: number;
  active: boolean;
};

export const listPartners = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("partners")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as PartnerRow[];
});

export type AgentNewsRow = {
  id: string;
  date: string;
  title_en: string;
  title_ar: string;
  body_en: string[];
  body_ar: string[];
  sort_order: number;
  published: boolean;
};

export const listAgentNews = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("agent_news")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as AgentNewsRow[];
});

export type VacancyRow = {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  department_en: string;
  department_ar: string;
  level_en: string;
  level_ar: string;
  type_en: string;
  type_ar: string;
  location_en: string;
  location_ar: string;
  summary_en: string;
  summary_ar: string;
  responsibilities_en: string[];
  responsibilities_ar: string[];
  qualifications_en: string[];
  qualifications_ar: string[];
  skills_en: string[];
  skills_ar: string[];
  closing_date: string | null;
  published: boolean;
  sort_order: number;
};

export const listVacancies = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("job_vacancies")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as VacancyRow[];
});

export const getVacancyBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("job_vacancies")
      .select("*")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    return (row ?? null) as unknown as VacancyRow | null;
  });

const applicationInput = z.object({
  vacancy_slug: z.string().max(120).optional().nullable(),
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(40).default(""),
  cover_note: z.string().trim().max(3000).default(""),
  cv_name: z.string().max(200),
  cv_type: z.string().max(120),
  cv_base64: z.string().min(10).max(7_000_000),
});

export const submitJobApplication = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => applicationInput.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(data.cv_type)) throw new Error("CV must be a PDF or Word document");

    const bytes = Uint8Array.from(atob(data.cv_base64), (c) => c.charCodeAt(0));
    if (bytes.byteLength > 5 * 1024 * 1024) throw new Error("CV must be smaller than 5MB");

    let vacancy: { id: string; title_en: string } | null = null;
    if (data.vacancy_slug) {
      const { data: row } = await supabaseAdmin
        .from("job_vacancies")
        .select("id,title_en")
        .eq("slug", data.vacancy_slug)
        .maybeSingle();
      vacancy = (row ?? null) as any;
    }

    const ext = data.cv_name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "pdf";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: upErr } = await supabaseAdmin.storage.from("cvs").upload(path, bytes, {
      contentType: data.cv_type,
      upsert: false,
    });
    if (upErr) throw new Error(upErr.message);

    const { error } = await supabaseAdmin.from("job_applications").insert({
      vacancy_id: vacancy?.id ?? null,
      vacancy_title: vacancy?.title_en ?? "Talent Pool",
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      cover_note: data.cover_note,
      cv_path: path,
    } as any);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ===== Contact messages =====
const contactInput = z.object({
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(6).max(40),
  insurance_type: z.string().trim().min(2).max(120),
  message: z.string().trim().min(5).max(3000),
});

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => contactInput.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_messages").insert(data as any);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
