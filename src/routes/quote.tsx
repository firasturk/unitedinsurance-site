import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listInsuranceServices, submitContactMessage, type InsuranceServiceRow } from "@/lib/public.functions";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, Send, Shield } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/quote")({
  head: () => ({
    meta: [
      { title: "Request a Quote — United Insurance" },
      { name: "description", content: "Pick your insurance type and share your details — a United Insurance advisor will send you a tailored quote." },
      { property: "og:title", content: "Request a Quote — United Insurance" },
      { property: "og:description", content: "Two quick steps to get a tailored insurance quote from United Insurance." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://unitedinsurance.life/quote" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://unitedinsurance.life/quote" }],
  }),
  loader: async () => ({ services: await listInsuranceServices() }),
  component: QuotePage,
});

function QuotePage() {
  const { services } = Route.useLoaderData() as { services: InsuranceServiceRow[] };
  const { lang } = useLang();
  const L = (en: string, ar: string) => (lang === "ar" ? ar : en);

  const [step, setStep] = useState<1 | 2>(1);
  const [picked, setPicked] = useState<string>("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const send = useServerFn(submitContactMessage);

  function choose(title: string) {
    setPicked(title);
    setStep(2);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      full_name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      insurance_type: picked,
      message: String(fd.get("message") ?? "").trim() || L(`Quote request: ${picked}`, `طلب عرض سعر: ${picked}`),
    };
    if (!payload.full_name || !payload.email || !payload.phone || !payload.insurance_type) {
      toast.error(L("Please fill in all fields.", "الرجاء تعبئة جميع الحقول."));
      return;
    }
    setSending(true);
    try {
      await send({ data: payload });
      setSent(true);
      form.reset();
      toast.success(L("Your quote request has been sent.", "تم إرسال طلب عرض السعر."));
    } catch (err: any) {
      toast.error(err?.message ?? L("Could not send your request.", "تعذّر إرسال الطلب."));
    } finally {
      setSending(false);
    }
  }

  return (
    <SiteLayout>
      <PageHero
        art="contact"
        eyebrow={L("Request a Quote", "اطلب عرض سعر")}
        title={L("Get your quote in two steps", "احصل على عرض سعرك بخطوتين")}
        subtitle={L("Choose your insurance type, then share your details.", "اختر نوع التأمين، ثم أدخل بياناتك.")}
      />

      <section className="pt-10 pb-24">
        <div className="mx-auto max-w-4xl px-6">
          <ol className="flex items-center gap-4 mb-10">
            {[
              { n: 1, label: L("Insurance type", "نوع التأمين") },
              { n: 2, label: L("Your details", "بياناتك") },
            ].map((s) => {
              const active = step >= (s.n as 1 | 2);
              return (
                <li key={s.n} className="flex items-center gap-3 flex-1">
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold ${
                      active ? "gradient-royal text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s.n ? <Check className="h-4 w-4" /> : s.n}
                  </span>
                  <span className={`text-sm font-semibold ${active ? "" : "text-muted-foreground"}`}>{s.label}</span>
                  <span className="h-px flex-1 bg-border last:hidden" />
                </li>
              );
            })}
          </ol>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {services.map((s) => {
                  const title = lang === "ar" ? s.title_ar : s.title_en;
                  const summary = lang === "ar" ? s.summary_ar : s.summary_en;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => choose(title)}
                      className="text-start rounded-2xl border border-border bg-card p-5 h-full flex flex-col hover:border-[var(--royal)] hover:shadow-soft transition"
                    >
                      <div className="grid h-11 w-11 place-items-center rounded-xl gradient-royal text-white text-lg">
                        {s.emoji ?? <Shield className="h-5 w-5" />}
                      </div>
                      <div className="mt-3 font-bold">{title}</div>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-3">{summary}</p>
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => choose(L("Other", "أخرى"))}
                  className="text-start rounded-2xl border border-dashed border-border bg-card p-5 h-full flex flex-col hover:border-[var(--royal)] transition"
                >
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-muted text-lg">✉️</div>
                  <div className="mt-3 font-bold">{L("Other / not sure", "أخرى / غير متأكد")}</div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {L("Tell us what you need and we'll advise.", "أخبرنا باحتياجك وسنقدّم لك المشورة.")}
                  </p>
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="step2"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                onSubmit={handleSubmit}
                className="rounded-3xl bg-card border border-border p-8 shadow-soft"
              >
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      {L("Selected", "النوع المختار")}
                    </div>
                    <div className="mt-1 font-bold">{picked}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--royal)] hover:underline"
                  >
                    <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {L("Change", "تغيير")}
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={L("Full name", "الاسم الكامل")} name="name" />
                  <Field label={L("Email", "البريد الإلكتروني")} name="email" type="email" />
                  <Field label={L("Phone", "رقم الهاتف")} name="phone" />
                </div>
                <label className="block mt-4">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {L("Details (optional)", "تفاصيل إضافية (اختياري)")}
                  </span>
                  <textarea
                    name="message"
                    rows={4}
                    maxLength={3000}
                    className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--royal)]/40"
                  />
                </label>

                <button
                  type="submit"
                  disabled={sending || sent}
                  className="mt-6 disabled:opacity-60 inline-flex items-center gap-2 h-12 px-6 rounded-full gradient-royal text-white font-semibold text-sm shadow-soft hover:shadow-glow transition"
                >
                  {sending
                    ? L("Sending…", "جارٍ الإرسال…")
                    : sent
                    ? L("Sent ✓", "تم الإرسال ✓")
                    : <>{L("Send request", "إرسال الطلب")} <Send className="h-4 w-4 rtl:rotate-180" /></>}
                </button>

                {sent && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    {L("We'll contact you shortly. ", "سنتواصل معك قريباً. ")}
                    <Link to="/contact" className="text-[var(--royal)] font-semibold hover:underline">
                      {L("Contact us", "تواصل معنا")}
                    </Link>
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label} *</span>
      <input
        name={name}
        type={type}
        required
        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--royal)]/40"
      />
    </label>
  );
}
