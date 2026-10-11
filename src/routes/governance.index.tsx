import { createFileRoute } from "@tanstack/react-router";
import { govManual } from "@/lib/media";
import { Scale, Users, ShieldCheck, FileCheck, Download } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/governance/")({
  head: () => ({
    meta: [
      { title: "Governance — United Insurance" },
      { name: "description", content: "Corporate governance, ethics and compliance at United Insurance." },
    ],
    links: [{ rel: "canonical", href: "/governance" }],
  }),
  component: GovPage,
});

const pillars = [
  { Icon: Scale, en: ["Board of Directors", "Independent oversight, audit and risk committees aligned with global best practice."], ar: ["مجلس الإدارة", "إشراف مستقل ولجان تدقيق ومخاطر متوافقة مع أفضل الممارسات العالمية."] },
  { Icon: Users, en: ["Shareholder Rights", "Equal treatment and transparent communication with all shareholders."], ar: ["حقوق المساهمين", "معاملة عادلة وتواصل شفاف مع جميع المساهمين."] },
  { Icon: ShieldCheck, en: ["Risk Management", "Enterprise risk framework covering underwriting, market and operational risk."], ar: ["إدارة المخاطر", "إطار شامل لإدارة مخاطر الاكتتاب والسوق والمخاطر التشغيلية."] },
  { Icon: FileCheck, en: ["Compliance", "Strict adherence to regulatory requirements and ethical standards."], ar: ["الامتثال", "الالتزام التام بالمتطلبات التنظيمية والمعايير الأخلاقية."] },
];

function GovPage() {
  const { lang } = useLang();
  return (
    <SiteLayout>
      <PageHero art="governance"
        eyebrow={lang === "ar" ? "\n" : "\n"}
        title={lang === "ar" ? "نزاهة في صميم كل قرار" : "Integrity at the core of every decision"}
        subtitle={lang === "ar" ? "إطار الحوكمة لدينا يضمن المساءلة والشفافية والثقة." : "Our governance framework ensures accountability, transparency and trust."}
      />
      <section className="pt-16">
        <div className="mx-auto max-w-7xl px-6">
          <a
            href={govManual}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-12 px-6 rounded-full gradient-royal text-white text-sm font-semibold shadow-soft hover:shadow-glow transition"
          >
            <Download className="h-4 w-4" />
            {lang === "ar" ? "تحميل دليل الحوكمة 2026 (PDF)" : "Download Governance Manual 2026 (PDF)"}
          </a>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 grid sm:grid-cols-2 gap-5">
          {pillars.map(p => {
            const [title, desc] = lang === "ar" ? p.ar : p.en;
            return (
              <div key={title} className="rounded-3xl bg-card border border-border p-8 shadow-soft">
                <div className="grid h-12 w-12 place-items-center rounded-xl gradient-royal text-white"><p.Icon className="h-5 w-5" /></div>
                <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}
