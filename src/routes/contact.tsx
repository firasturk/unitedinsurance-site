import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitContactMessage } from "@/lib/public.functions";
import { SpamGuard } from "@/components/site/SpamGuard";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { ContactInfo } from "@/components/site/ContactInfo";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — United Insurance" },
      { name: "description", content: "Speak with a United Insurance advisor or request an insurance quote." },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t, lang } = useLang();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const send = useServerFn(submitContactMessage);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      full_name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      insurance_type: String(fd.get("type") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
    };
    const guard = {
      website: String(fd.get("website") ?? ""),
      turnstile: String(fd.get("cf-turnstile-response") ?? ""),
    };
    if (Object.values(payload).some((v) => !v)) {
      toast.error(L("Please fill in all fields.", "الرجاء تعبئة جميع الحقول."));
      return;
    }
    setSending(true);
    try {
      await send({ data: { ...payload, source: "contact", ...guard } });
      setSent(true);
      form.reset();
      toast.success(L("Your message has been sent.", "تم إرسال رسالتك بنجاح."));
    } catch (err: any) {
      toast.error(err?.message ?? L("Could not send your message.", "تعذّر إرسال الرسالة."));
    } finally {
      setSending(false);
    }
  }

  const L = (en: string, ar: string) => (lang === "ar" ? ar : en);

  return (
    <SiteLayout>
      <PageHero art="contact"
        eyebrow={t("footer.contact")}
        title={L("Let's talk insurance", "لنتحدث عن التأمين")}
        subtitle={L("Request the right quote for you.", "اطلب عرض السعر المناسب لك")}
      />
      <section className="pt-10 pb-24">
        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-5">
            {[
              { Icon: Phone, label: L("Phone", "الهاتف"), val: t("top.phone") },
              { Icon: Mail, label: L("Email", "البريد"), val: t("top.email") },
              { Icon: MapPin, label: L("Address", "العنوان"), val: t("footer.address") },
            ].map(c => (
              <div key={c.label} className="rounded-2xl bg-card border border-border p-5 flex items-start gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-xl gradient-royal text-white shrink-0"><c.Icon className="h-5 w-5" /></div>
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
                  <div className="mt-1 font-semibold text-sm break-words" dir="ltr">{c.val}</div>
                </div>
              </div>
            ))}
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="lg:col-span-3 rounded-3xl bg-card border border-border p-8 shadow-soft"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={L("Full name", "الاسم الكامل")} name="name" />
              <Field label={L("Email", "البريد الإلكتروني")} name="email" type="email" />
              <Field label={L("Phone", "رقم الهاتف")} name="phone" />
              <Field label={L("Insurance type", "نوع التأمين")} name="type" />
            </div>
            <label className="block mt-4">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{L("Message", "الرسالة")} *</span>
              <textarea name="message" rows={5} required minLength={5} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--royal)]/40" />
            </label>
            <SpamGuard />
            <button type="submit" disabled={sending} className="mt-6 disabled:opacity-60 inline-flex items-center gap-2 h-12 px-6 rounded-full gradient-royal text-white font-semibold text-sm shadow-soft hover:shadow-glow transition">
              {sending ? L("Sending…", "جارٍ الإرسال…") : sent ? L("Sent ✓", "تم الإرسال ✓") : <>{t("nav.quote")} <Send className="h-4 w-4 rtl:rotate-180" /></>}
            </button>
          </motion.form>
        </div>
      </section>
      <ContactInfo />
    </SiteLayout>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label} *</span>
      <input name={name} type={type} required className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--royal)]/40" />
    </label>
  );
}
