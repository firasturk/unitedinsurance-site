import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { spamGuardFields } from "./antispam.server";

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

export type ArticleCard = Pick<ArticleRow, "id" | "slug" | "date" | "category" | "cover_url" | "title_en" | "title_ar" | "excerpt_en" | "excerpt_ar">;

/** Latest published articles with only the columns a card needs (homepage). */
export const listLatestArticles = createServerFn({ method: "GET" })
  .inputValidator((d: { limit?: number }) => z.object({ limit: z.number().int().min(1).max(24).default(6) }).parse(d ?? {}))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("articles")
      .select("id,slug,date,category,cover_url,title_en,title_ar,excerpt_en,excerpt_ar")
      .eq("published", true)
      .order("date", { ascending: false })
      .limit(data.limit);
    if (error) throw new Error(error.message);
    return (rows ?? []) as ArticleCard[];
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
    .eq("published", true)
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
  ...spamGuardFields,
});

// Detects the real document type from the first bytes (the browser-supplied MIME type is not trusted).
function detectCvType(bytes: Uint8Array): { ext: "pdf" | "doc" | "docx"; mime: string } | null {
  if (bytes.length < 8) return null;
  // %PDF-
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
    return { ext: "pdf", mime: "application/pdf" };
  }
  // OLE compound document (legacy .doc): D0 CF 11 E0 A1 B1 1A E1
  if (bytes[0] === 0xd0 && bytes[1] === 0xcf && bytes[2] === 0x11 && bytes[3] === 0xe0) {
    return { ext: "doc", mime: "application/msword" };
  }
  // ZIP container (.docx): PK\x03\x04 — must contain the Word package marker
  if (bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04) {
    const head = new TextDecoder("latin1").decode(bytes.subarray(0, Math.min(bytes.length, 4000)));
    if (head.includes("word/") || head.includes("[Content_Types].xml")) {
      return { ext: "docx", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" };
    }
  }
  return null;
}

export const submitJobApplication = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => applicationInput.parse(d))
  .handler(async ({ data }) => {
    const { assertHuman } = await import("./antispam.server");
    await assertHuman(data, getRequest());
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const bytes = Uint8Array.from(atob(data.cv_base64), (c) => c.charCodeAt(0));
    if (bytes.byteLength > 5 * 1024 * 1024) throw new Error("CV must be smaller than 5MB");
    const detected = detectCvType(bytes);
    if (!detected) throw new Error("CV must be a PDF or Word document");

    let vacancy: { id: string; title_en: string } | null = null;
    if (data.vacancy_slug) {
      const { data: row } = await supabaseAdmin
        .from("job_vacancies")
        .select("id,title_en")
        .eq("slug", data.vacancy_slug)
        .maybeSingle();
      vacancy = (row ?? null) as any;
    }

    const path = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${detected.ext}`;
    const { error: upErr } = await supabaseAdmin.storage.from("cvs").upload(path, bytes, {
      contentType: detected.mime,
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

    const { sendNotification } = await import("./notify.server");
    await sendNotification({
      subject: `New job application — ${vacancy?.title_en ?? "Talent Pool"}`,
      replyTo: data.email,
      lines: [
        ["Vacancy", vacancy?.title_en ?? "Talent Pool"],
        ["Name", data.full_name],
        ["Email", data.email],
        ["Phone", data.phone || "—"],
        ["Cover note", data.cover_note || "—"],
        ["CV", "Download from Admin → Applications"],
      ],
    });
    return { ok: true };
  });

// ===== Contact messages =====
const contactInput = z.object({
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(6).max(40),
  insurance_type: z.string().trim().min(2).max(120),
  message: z.string().trim().min(5).max(3000),
  source: z.enum(["contact", "quote"]).default("contact"),
  ...spamGuardFields,
});

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => contactInput.parse(d))
  .handler(async ({ data }) => {
    const { assertHuman, withoutSpamGuard } = await import("./antispam.server");
    await assertHuman(data, getRequest());
    const { source, ...row } = withoutSpamGuard(data);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_messages").insert(row as any);
    if (error) throw new Error(error.message);

    const { sendNotification } = await import("./notify.server");
    await sendNotification({
      subject: `${source === "quote" ? "Quote request" : "Contact message"} — ${row.insurance_type} — ${row.full_name}`,
      replyTo: row.email,
      lines: [
        ["Name", row.full_name],
        ["Email", row.email],
        ["Phone", row.phone],
        ["Insurance type", row.insurance_type],
        ["Message", row.message],
      ],
    });
    return { ok: true };
  });

// ===== Suggestions & complaints =====
const complaintInput = z.object({
  kind: z.enum(["suggestion", "complaint", "inquiry"]),
  full_name: z.string().trim().min(2).max(120),
  national_id: z.string().trim().min(5).max(40),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(6).max(40),
  policy_number: z.string().trim().max(60).default(""),
  subject: z.string().trim().min(2).max(200),
  message: z.string().trim().min(10).max(5000),
  lang: z.enum(["ar", "en"]).default("ar"),
  ...spamGuardFields,
});

function makeReference() {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rnd = Array.from(crypto.getRandomValues(new Uint8Array(4)), (b) => alphabet[b % alphabet.length]).join("");
  return `UIC-${ymd}-${rnd}`;
}

export const submitComplaint = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => complaintInput.parse(d))
  .handler(async ({ data }) => {
    const { assertHuman, withoutSpamGuard } = await import("./antispam.server");
    await assertHuman(data, getRequest());
    const row = withoutSpamGuard(data);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let reference = makeReference();
    let lastError: string | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      const { error } = await supabaseAdmin.from("complaints").insert({ ...row, reference } as any);
      if (!error) {
        lastError = null;
        break;
      }
      lastError = error.message;
      if (error.code === "42P01") {
        // Table not created yet (migration 20261012000000_complaints.sql not applied).
        console.error("[complaints] table missing — run the complaints migration");
        throw new Error(
          row.lang === "ar"
            ? "خدمة الشكاوى الإلكترونية غير متاحة مؤقتاً — يرجى المراسلة على Complaints@unitedjo.com"
            : "Online complaints are temporarily unavailable — please email Complaints@unitedjo.com",
        );
      }
      if (error.code !== "23505") break; // not a duplicate reference
      reference = makeReference();
    }
    if (lastError) throw new Error(lastError);

    const { sendNotification, sendComplaintReceipt } = await import("./notify.server");
    const kindLabel = { suggestion: "Suggestion", complaint: "Complaint", inquiry: "Inquiry" }[row.kind];
    await sendNotification({
      subject: `${kindLabel} ${reference} — ${row.subject}`,
      replyTo: row.email,
      lines: [
        ["Reference", reference],
        ["Type", kindLabel],
        ["Name", row.full_name],
        ["National ID", row.national_id],
        ["Email", row.email],
        ["Phone", row.phone],
        ["Policy number", row.policy_number || "—"],
        ["Subject", row.subject],
        ["Details", row.message],
      ],
    });
    await sendComplaintReceipt({ to: row.email, reference, lang: row.lang, name: row.full_name });

    return { ok: true, reference };
  });
