import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Briefcase, CalendarDays, CheckCircle2, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { ApplyDialog } from "@/components/site/ApplyDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLang } from "@/lib/i18n";
import { getVacancyBySlug, type VacancyRow } from "@/lib/public.functions";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/careers/$slug")({
  loader: async ({ params }) => {
    const vacancy = await getVacancyBySlug({ data: { slug: params.slug } });
    if (!vacancy) throw notFound();
    return { vacancy };
  },
  head: ({ match, loaderData }) => {
    const v = loaderData?.vacancy;
    const lang = match.context.lang;
    if (!v) return pageHead({ lang, path: `/careers/${match.params.slug}`, title: { en: "Vacancy", ar: "وظيفة شاغرة" }, description: "", noindex: true });
    const title = lang === "ar" ? v.title_ar : v.title_en;
    const summary = lang === "ar" ? v.summary_ar : v.summary_en;
    return pageHead({
      lang,
      path: `/careers/${v.slug}`,
      title: { en: `${v.title_en} — Careers`, ar: `${v.title_ar} — الوظائف` },
      description: summary || (lang === "ar" ? "تفاصيل الوظيفة والمهام والمؤهلات — قدّم طلبك عبر الموقع." : "Job details, responsibilities and qualifications — apply online with your CV."),
      type: "article",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "JobPosting",
          title,
          description: summary,
          datePosted: (v as { created_at?: string }).created_at?.slice(0, 10),
          ...(v.closing_date ? { validThrough: v.closing_date } : {}),
          employmentType: /part/i.test(v.type_en) ? "PART_TIME" : "FULL_TIME",
          hiringOrganization: { "@type": "Organization", name: "United Insurance Company PLC", sameAs: "https://unitedjo.com" },
          jobLocation: {
            "@type": "Place",
            address: { "@type": "PostalAddress", addressLocality: v.location_en || "Amman", addressCountry: "JO" },
          },
          ...(v.department_en ? { occupationalCategory: v.department_en } : {}),
        },
      ],
    });
  },
  notFoundComponent: () => <VacancyNotFound />,
  component: VacancyPage,
});

function VacancyNotFound() {
  const { lang } = useLang();
  const L = (en: string, ar: string) => (lang === "ar" ? ar : en);
  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-6 py-32 text-center">
        <h1 className="text-2xl font-bold">{L("Vacancy not found", "الشاغر غير موجود")}</h1>
        <Link to="/careers">
          <Button className="mt-6 rounded-full">{L("Back to careers", "العودة إلى الوظائف")}</Button>
        </Link>
      </div>
    </SiteLayout>
  );
}

function VacancyPage() {
  const { vacancy } = Route.useLoaderData();
  const { lang } = useLang();
  const L = (en: string, ar: string) => (lang === "ar" ? ar : en);

  const t = (v: VacancyRow, key: string) => (v as any)[`${key}_${lang === "ar" ? "ar" : "en"}`];

  const lists = [
    { title: L("Key responsibilities", "المهام الرئيسية"), items: t(vacancy, "responsibilities") as string[] },
    { title: L("Qualifications", "المؤهلات"), items: t(vacancy, "qualifications") as string[] },
  ];
  const skills = (t(vacancy, "skills") as string[]) ?? [];

  return (
    <SiteLayout>
      <PageHero art="careers" eyebrow={t(vacancy, "department")} title={t(vacancy, "title")} subtitle={t(vacancy, "summary")}>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/80">
          {t(vacancy, "type") && (
            <span className="inline-flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" /> {t(vacancy, "type")}
            </span>
          )}
          {t(vacancy, "location") && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {t(vacancy, "location")}
            </span>
          )}
          {vacancy.closing_date && (
            <span className="inline-flex items-center gap-1.5" dir="ltr">
              <CalendarDays className="h-4 w-4" /> {L("Closing", "آخر موعد")}: {vacancy.closing_date}
            </span>
          )}
        </div>
      </PageHero>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {lists.map(
              (l) =>
                l.items?.length > 0 && (
                  <div key={l.title}>
                    <h2 className="text-xl font-bold">{l.title}</h2>
                    <ul className="mt-4 space-y-3">
                      {l.items.map((item) => (
                        <li key={item} className="flex gap-3 text-[15px] leading-relaxed">
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--royal)]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
            )}
            {skills.length > 0 && (
              <div>
                <h2 className="text-xl font-bold">{L("Skills", "المهارات")}</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <Badge key={s} variant="secondary" className="rounded-full">{s}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-28 h-fit rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold">{L("Ready to apply?", "جاهز للتقديم؟")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {L("Submit your application and CV directly online.", "أرسل طلبك وسيرتك الذاتية مباشرة عبر الموقع.")}
            </p>
            <ApplyDialog
              vacancySlug={vacancy.slug}
              vacancyTitle={t(vacancy, "title")}
              trigger={<Button className="mt-5 w-full rounded-full h-11">{L("Apply now", "قدّم الآن")}</Button>}
            />
            <Link to="/careers" className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--royal)]">
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {L("All vacancies", "كل الشواغر")}
            </Link>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}
