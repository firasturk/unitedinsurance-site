import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Users, Mail, Copy, Check, Lock } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { useLang } from "@/lib/i18n";

const REPORT_EMAIL = "whistleblower@unitedjo.com";

export const Route = createFileRoute("/whistleblower")({
  head: () => ({
    meta: [
      { title: "Whistleblower — United Insurance Company PLC" },
      {
        name: "description",
        content:
          "Report fraud, corruption, conflicts of interest or any violation of law, regulation or instructions to United Insurance. All reports are handled in strict confidence by an independent department.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Whistleblower — United Insurance Company PLC" },
      {
        property: "og:description",
        content:
          "A whistleblowing policy built on transparency and independence. Report any violation — internally or externally — in strict confidence.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Whistleblower — United Insurance Company PLC" },
      {
        name: "twitter:description",
        content:
          "Report fraud, corruption or any violation of law, regulation or instructions in strict confidence.",
      },
    ],
    links: [{ rel: "canonical", href: "https://unitedinsurance.life/whistleblower" }],
  }),
  component: WhistleblowerPage,
});

function WhistleblowerPage() {
  const { lang } = useLang();
  const [copied, setCopied] = useState(false);
  const L = (en: string, ar: string) => (lang === "ar" ? ar : en);

  const pillars = [
    {
      Icon: Lock,
      t: L("Strict confidentiality", "سرية تامة"),
      d: L(
        "All reports submitted to the company are handled with utmost confidentiality and transparency.",
        "تُعامل جميع البلاغات الواردة إلى الشركة بأقصى درجات السرية والشفافية.",
      ),
    },
    {
      Icon: Eye,
      t: L("Independent handling", "متابعة مستقلة"),
      d: L(
        "Reports are forwarded as received to an independent department for appropriate action.",
        "تُحال البلاغات كما ترد إلى دائرة مستقلة لاتخاذ الإجراء المناسب.",
      ),
    },
    {
      Icon: Users,
      t: L("Internal or external", "من الداخل أو الخارج"),
      d: L(
        "The whistleblower may be an internal member of the company or an external stakeholder.",
        "المبلِّغ قد يكون من داخل الشركة أو من الأطراف الخارجية ذات العلاقة.",
      ),
    },
  ];

  return (
    <SiteLayout>
      <PageHero
        art="governance"
        title={L("Whistleblower", "الإبلاغ عن المخالفات")}
        subtitle={L(
          "United Insurance Co. P.L.C. adopts a whistleblowing policy characterized by transparency and independence.",
          "تعتمد الشركة المتحدة للتأمين م.ع.م سياسة إبلاغ عن المخالفات تتّسم بالشفافية والاستقلالية."
        )}
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-card border border-border p-8 sm:p-10"
          >
            <p className="text-lg leading-relaxed text-foreground/85">
              {L(
                "We uphold transparency and integrity and encourage reporting suspected fraud, corruption, regulatory violations, or misconduct, while ensuring confidentiality and protecting whistleblowers.",
                "نلتزم بالشفافية والنزاهة، ونشجع الإبلاغ عن أي اشتباه في احتيال أو فساد أو مخالفة للأنظمة أو سلوك غير مهني، مع ضمان سرية البلاغات وحماية المبلّغين."
              )}
            </p>

          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6 mt-6">
            {pillars.map((p) => (
              <div key={p.t} className="rounded-2xl bg-card border border-border p-6">
                <div className="grid h-11 w-11 place-items-center rounded-xl gradient-royal text-white mb-4">
                  <p.Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{p.t}</h3>
                <p className="text-sm text-muted-foreground mt-1">{p.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl gradient-hero text-white p-8 sm:p-10 shadow-elevated">
            <Mail className="h-7 w-7 mb-4 opacity-80" />
            <h2 className="text-xl font-bold sm:text-2xl">
              {L("Submit a report", "أرسل بلاغك")}
            </h2>
            <p className="text-sm text-white/75 mt-2 max-w-2xl">
              {L(
                "The email address for submitting reports is:",
                "البريد الإلكتروني المخصّص لاستقبال البلاغات هو:"
              )}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${REPORT_EMAIL}`}
                dir="ltr"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-white text-[var(--navy-deep)] font-semibold text-sm shadow-soft hover:shadow-glow transition-shadow"
              >
                <Mail className="h-4 w-4" />
                <span>{REPORT_EMAIL}</span>
              </a>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(REPORT_EMAIL);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  } catch {
                    /* clipboard unavailable */
                  }
                }}
                className="inline-flex items-center gap-2 h-12 px-5 rounded-full border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? L("Copied", "تم النسخ") : L("Copy address", "نسخ العنوان")}
              </button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
