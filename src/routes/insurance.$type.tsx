import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, FileText, Shield, Clock, Users, Download } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { getInsuranceServiceBySlug } from "@/lib/public.functions";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/insurance/$type")({
  loader: async ({ params }) => {
    const service = await getInsuranceServiceBySlug({ data: { slug: params.type } });
    if (!service) throw notFound();
    return { service };
  },
  head: ({ match, loaderData }) => {
    const s = loaderData?.service;
    const lang = match.context.lang;
    if (!s) return pageHead({ lang, path: `/insurance/${match.params.type}`, title: { en: "Insurance", ar: "التأمين" }, description: "", noindex: true });
    return pageHead({
      lang,
      path: `/insurance/${s.slug}`,
      title: { en: s.title_en, ar: s.title_ar },
      description: { en: s.summary_en, ar: s.summary_ar },
      image: s.image_url,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Service",
          name: lang === "ar" ? s.title_ar : s.title_en,
          description: lang === "ar" ? s.summary_ar : s.summary_en,
          serviceType: "Insurance",
          areaServed: "JO",
          provider: { "@type": "InsuranceAgency", name: "United Insurance Company PLC", url: "https://unitedjo.com" },
        },
      ],
    });
  },
  notFoundComponent: () => <NotFoundView />,
  component: InsuranceTypePage,
});

function NotFoundView() {
  const { lang } = useLang();
  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="text-3xl font-bold">{lang === "ar" ? "الخدمة غير موجودة" : "Service not found"}</h1>
        <Link to="/insurance" className="mt-6 inline-flex items-center gap-2 text-[var(--royal)] font-semibold">
          {lang === "ar" ? "→ جميع حلول التأمين" : "← All insurance solutions"}
        </Link>
      </div>
    </SiteLayout>
  );
}

function InsuranceTypePage() {
  const { service } = Route.useLoaderData();
  const { t, lang } = useLang();

  const title = lang === "ar" ? service.title_ar : service.title_en;
  const summary = lang === "ar" ? service.summary_ar : service.summary_en;
  const overview = lang === "ar" ? service.overview_ar : service.overview_en;
  const covered = lang === "ar" ? service.covered_ar : service.covered_en;
  const why = lang === "ar" ? service.why_ar : service.why_en;

  const features = [
    { icon: Shield, label: lang === "ar" ? "تغطية شاملة" : "Comprehensive Coverage" },
    { icon: Clock, label: lang === "ar" ? "مطالبات سريعة" : "Fast Claims" },
    { icon: Users, label: lang === "ar" ? "دعم على مدار الساعة" : "24/7 Support" },
    { icon: FileText, label: lang === "ar" ? "وثائق مرنة" : "Flexible Policies" },
  ];

  return (
    <SiteLayout>
      <PageHero art="insurance" eyebrow={t("svc.title")} title={title} subtitle={summary} />

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-10">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl font-bold sm:text-3xl">
                  {lang === "ar" ? "نظرة عامة" : "Overview"}
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed whitespace-pre-line">
                  {overview}
                </p>
              </motion.div>

              {covered.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h3 className="text-xl font-semibold">
                    {lang === "ar" ? "ما يغطيه التأمين" : "What's Covered"}
                  </h3>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {covered.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 shrink-0 text-[var(--royal)]" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {why && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-border bg-card p-6 sm:p-8"
                >
                  <h3 className="text-xl font-semibold">
                    {lang === "ar" ? "لماذا المتحدة؟" : "Why United?"}
                  </h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed whitespace-pre-line">
                    {why}
                  </p>
                </motion.div>
              )}
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${service.tone} text-2xl text-white shadow-soft`}>
                  {service.emoji ?? "🛡️"}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{summary}</p>

                <div className="mt-6 space-y-4">
                  {features.map((f) => (
                    <div key={f.label} className="flex items-center gap-3">
                      <f.icon className="h-5 w-5 text-[var(--royal)]" />
                      <span className="text-sm font-medium">{f.label}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/contact"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--royal)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  {lang === "ar" ? "اطلب عرض سعر" : "Request a Quote"}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Link>
              </motion.div>

            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
