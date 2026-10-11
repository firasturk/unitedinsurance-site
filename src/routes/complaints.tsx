import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { complaintFormPdf } from "@/lib/media";
import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, ShieldCheck, Clock, Send, CheckCircle2, FileText, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { SpamGuard } from "@/components/site/SpamGuard";
import { useLang } from "@/lib/i18n";
import { submitComplaint } from "@/lib/public.functions";

export const Route = createFileRoute("/complaints")({
  head: () => ({
    meta: [
      { title: "Suggestions & Complaints — United Insurance" },
      { name: "description", content: "Submit a suggestion or complaint to United Insurance. We respond within 5 business days." },
    ],
    links: [{ rel: "canonical", href: "/complaints" }],
  }),
  component: ComplaintsPage,
});

function ComplaintsPage() {
  const { lang } = useLang();
  const [reference, setReference] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const send = useServerFn(submitComplaint);
  const L = (en: string, ar: string) => (lang === "ar" ? ar : en);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const str = (k: string) => String(fd.get(k) ?? "").trim();
    const payload = {
      kind: str("type") as "suggestion" | "complaint" | "inquiry",
      full_name: str("name"),
      national_id: str("id"),
      email: str("email"),
      phone: str("phone"),
      policy_number: str("policy"),
      subject: str("subject"),
      message: str("message"),
      lang,
      website: str("website"),
      turnstile: str("cf-turnstile-response"),
    };
    const required = [payload.full_name, payload.national_id, payload.email, payload.phone, payload.subject, payload.message];
    if (required.some((v) => !v)) {
      toast.error(L("Please fill in all required fields.", "الرجاء تعبئة جميع الحقول المطلوبة."));
      return;
    }
    if (payload.message.length < 10) {
      toast.error(L("Please describe your case in more detail.", "الرجاء وصف الحالة بمزيد من التفصيل."));
      return;
    }
    setSending(true);
    try {
      const res = await send({ data: payload });
      setReference(res.reference);
      form.reset();
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      toast.error(err?.message ?? L("Could not submit your case.", "تعذّر إرسال الحالة."));
    } finally {
      setSending(false);
    }
  }

  const pillars = [
    { Icon: ShieldCheck, t: L("Confidential", "سرية تامة"), d: L("Your data is handled with strict confidentiality.", "نتعامل مع بياناتك بسرية تامة.") },
    { Icon: Clock, t: L("2 business days", "يومان عمل"), d: L("Initial response within two business days.", "ردّ مبدئي خلال يومي عمل.") },
    { Icon: CheckCircle2, t: L("Tracked & resolved", "متابعة وحلّ"), d: L("Every case is logged, escalated and closed.", "تُسجَّل كل حالة وتتم متابعتها حتى الإغلاق.") },
  ];

  return (
    <SiteLayout>
      <PageHero art="complaints"
        eyebrow={L("\n", "\n")}
        title={L("Suggestions & Complaints", "الاقتراحات والشكاوى")}
        subtitle={L(
          "Your feedback shapes our service. Share a suggestion or file a complaint and our complaints team will personally follow up and resolve it as soon as possible.",
          "ملاحظاتك تصنع خدمتنا. شاركنا اقتراحك أو قدّم شكواك وسيتولّى فريق إدارة الشكاوى لدينا متابعتها وحلها في أقرب وقت ممكن."
        )}
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-3 gap-6 mb-12">
          {pillars.map((p) => (
            <div key={p.t} className="rounded-2xl bg-card border border-border p-6">
              <div className="grid h-11 w-11 place-items-center rounded-xl gradient-royal text-white mb-4"><p.Icon className="h-5 w-5" /></div>
              <h3 className="font-semibold">{p.t}</h3>
              <p className="text-sm text-muted-foreground mt-1">{p.d}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-3xl gradient-hero text-white p-8 shadow-elevated">
              <MessageSquare className="h-7 w-7 mb-4 opacity-80" />
              <h3 className="text-xl font-bold">{L("How it works", "كيف تعمل العملية")}</h3>
              <ol className="mt-4 space-y-3 text-sm text-white/85 list-decimal list-inside rtl:list-inside">
                <li>{L("Submit the form with full details.", "قدّم النموذج مع كامل التفاصيل.")}</li>
                <li>{L("You receive a reference number by email.", "ستتلقى رقم مرجعي عبر البريد.")}</li>
                <li>{L("Compliance reviews and contacts you.", "يقوم فريق الالتزام بالمراجعة والتواصل معك.")}</li>
                <li>{L("Resolution within 10 working days.", "حلّ نهائي خلال 10 أيام عمل.")}</li>
              </ol>
            </div>
            <div className="rounded-2xl bg-card border border-border p-6 text-sm">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{L("Direct line", "خط مباشر")}</div>
              <div className="mt-1 font-semibold">Complaints@unitedjo.com</div>
              <div className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">{L("Hotline", "الخط الساخن")}</div>
              <div className="mt-1 font-semibold" dir="ltr">+962 6 200 3333 <span className="font-normal text-muted-foreground">({L("ext. 1235", "فرعي 1235")})</span></div>
            </div>
            <a
              href={complaintFormPdf}
              download
              className="group flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-5 py-4 hover:border-[var(--royal)]/40 hover:bg-secondary/50 transition"
            >
              <span className="flex items-center gap-3 min-w-0">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--royal)]/10 text-[var(--royal)]">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold truncate">
                    {L("Printable complaint form (PDF)", "نموذج الشكوى للطباعة (PDF)")}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {L("Submit in person at any branch", "يُسلَّم باليد في أي فرع")}
                  </span>
                </span>
              </span>
              <Download className="h-4 w-4 text-muted-foreground group-hover:text-[var(--royal)] shrink-0" />
            </a>
          </div>

          {reference ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-3 rounded-3xl bg-card border border-border p-8 shadow-soft"
              role="status"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl gradient-royal text-white mb-4"><CheckCircle2 className="h-6 w-6" /></div>
              <h2 className="text-2xl font-bold">{L("Your case has been received", "تم استلام حالتك")}</h2>
              <p className="text-sm text-muted-foreground mt-2">
                {L("Keep this reference number for any follow-up:", "احتفظ بهذا الرقم المرجعي لأي متابعة:")}
              </p>
              <div className="mt-4 inline-block rounded-xl border border-border bg-secondary/60 px-5 py-3 font-mono text-xl font-bold tracking-wider" dir="ltr">{reference}</div>
              <p className="text-sm text-muted-foreground mt-4">
                {L("Our complaints team will contact you within two business days.", "سيتواصل معك فريق إدارة الشكاوى خلال يومي عمل.")}
              </p>
              <button
                type="button"
                onClick={() => setReference(null)}
                className="mt-6 inline-flex items-center gap-2 h-11 px-5 rounded-full border border-border text-sm font-semibold hover:bg-secondary/60 transition"
              >
                {L("Submit another case", "إرسال حالة أخرى")}
              </button>
            </motion.div>
          ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="lg:col-span-3 rounded-3xl bg-card border border-border p-8 shadow-soft"
          >
            <h2 className="text-2xl font-bold">{L("Submit your case", "أرسل حالتك")}</h2>
            <p className="text-sm text-muted-foreground mt-1">{L("All fields are required unless marked optional.", "جميع الحقول مطلوبة ما لم يُذكر أنها اختيارية.")}</p>

            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              <Field label={L("Full name", "الاسم الكامل")} name="name" autoComplete="name" required />
              <Field label={L("National ID", "الرقم الوطني")} name="id" required />
              <Field label={L("Email", "البريد الإلكتروني")} name="email" type="email" autoComplete="email" required />
              <Field label={L("Phone", "رقم الهاتف")} name="phone" type="tel" autoComplete="tel" required />
              <Field label={L("Policy number (optional)", "رقم الوثيقة (اختياري)")} name="policy" />
              <label className="block">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{L("Type", "النوع")}</span>
                <select name="type" defaultValue="complaint" className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--royal)]/40">
                  <option value="suggestion">{L("Suggestion", "اقتراح")}</option>
                  <option value="complaint">{L("Complaint", "شكوى")}</option>
                  <option value="inquiry">{L("Inquiry", "استفسار")}</option>
                </select>
              </label>
            </div>

            <label className="block mt-4">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{L("Subject", "الموضوع")}</span>
              <input name="subject" required maxLength={200} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--royal)]/40" />
            </label>

            <label className="block mt-4">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{L("Details", "التفاصيل")}</span>
              <textarea name="message" rows={6} required minLength={10} maxLength={5000} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--royal)]/40" />
            </label>

            <SpamGuard />

            <label className="mt-4 flex items-start gap-3 text-xs text-muted-foreground">
              <input type="checkbox" required className="mt-0.5" />
              <span>{L(
                "I consent to United Insurance processing my data to handle this case in accordance with the privacy policy.",
                "أوافق على معالجة بياناتي من قبل المتحدة للتأمين لمتابعة هذه الحالة وفقاً لسياسة الخصوصية."
              )}</span>
            </label>

            <button type="submit" disabled={sending} className="mt-6 inline-flex items-center gap-2 h-12 px-6 rounded-full gradient-royal text-white font-semibold text-sm shadow-soft hover:shadow-glow transition disabled:opacity-70">
              {sending ? <><Loader2 className="h-4 w-4 animate-spin" /> {L("Sending…", "جارٍ الإرسال…")}</> : <>{L("Submit", "إرسال")} <Send className="h-4 w-4 rtl:rotate-180" /></>}
            </button>
          </motion.form>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({ label, name, type = "text", autoComplete, required }: { label: string; name: string; type?: string; autoComplete?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
      <input name={name} type={type} autoComplete={autoComplete} required={required} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--royal)]/40" />
    </label>
  );
}
