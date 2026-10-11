import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Briefcase, CalendarDays, CheckCircle2, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { ApplyDialog } from "@/components/site/ApplyDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLang } from "@/lib/i18n";
import { getVacancyBySlug, type VacancyRow } from "@/lib/public.functions";

export const Route = createFileRoute("/careers/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Vacancy — ${params.slug.replace(/-/g, " ")} | United Insurance Careers` },
      { name: "description", content: "Job details, responsibilities and qualifications for this vacancy at United Insurance. Apply online with your CV." },
      { property: "og:title", content: "Vacancy — United Insurance Careers" },
      { property: "og:description", content: "Review the role requirements and submit your application online." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VacancyPage,
});

function VacancyPage() {
  const { slug } = Route.useParams();
  const { lang } = useLang();
  const L = (en: string, ar: string) => (lang === "ar" ? ar : en);
  const fetchVacancy = useServerFn(getVacancyBySlug);
  const { data: vacancy, isLoading } = useQuery({
    queryKey: ["vacancy", slug],
    queryFn: () => fetchVacancy({ data: { slug } }),
  });

  const t = (v: VacancyRow, key: string) => (v as any)[`${key}_${lang === "ar" ? "ar" : "en"}`];

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-4xl px-6 py-32 text-muted-foreground">{L("Loading…", "جارٍ التحميل…")}</div>
      </SiteLayout>
    );
  }

  if (!vacancy) {
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
