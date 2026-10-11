import { useMemo, useState } from "react";
import { pageHead } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowRight,
  Briefcase,
  CalendarDays,
  GraduationCap,
  HeartHandshake,
  MapPin,
  Search,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { ApplyDialog } from "@/components/site/ApplyDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLang } from "@/lib/i18n";
import { listVacancies, type VacancyRow } from "@/lib/public.functions";

export const Route = createFileRoute("/careers/")({
  head: ({ match }) =>
    pageHead({
      lang: match.context.lang,
      path: "/careers",
      title: {"en": "Careers — United by People, Driven by Purpose", "ar": "الوظائف — أفراد متميزون وثقافة راسخة"},
      description: {"en": "Build your career at United Insurance. Explore our culture, learning and development, career journey and current job openings in Jordan.", "ar": "ابنِ مسيرتك المهنية في الشركة المتحدة للتأمين: ثقافتنا، التعلم والتطوير، والوظائف الشاغرة حالياً في الأردن."},
    }),
  loader: async () => ({ vacancies: await listVacancies() }),
  component: CareersPage,
});

function CareersPage() {
  const { lang } = useLang();
  const L = (en: string, ar: string) => (lang === "ar" ? ar : en);
  const initial = Route.useLoaderData();
  const fetchVacancies = useServerFn(listVacancies);
  const { data: vacancies = [] } = useQuery({
    queryKey: ["vacancies"],
    queryFn: () => fetchVacancies(),
    initialData: initial.vacancies,
    staleTime: 300_000,
  });

  const [q, setQ] = useState("");
  const [dept, setDept] = useState("");
  const [level, setLevel] = useState("");
  const [type, setType] = useState("");
  const [loc, setLoc] = useState("");

  const t = (v: VacancyRow, key: string) => (v as any)[`${key}_${lang === "ar" ? "ar" : "en"}`] as string;

  const options = (key: string) =>
    Array.from(new Set(vacancies.map((v) => t(v, key)).filter(Boolean)));

  const filtered = useMemo(
    () =>
      vacancies.filter((v) => {
        const hay = `${t(v, "title")} ${t(v, "summary")} ${t(v, "department")}`.toLowerCase();
        return (
          (!q || hay.includes(q.toLowerCase())) &&
          (!dept || t(v, "department") === dept) &&
          (!level || t(v, "level") === level) &&
          (!type || t(v, "type") === type) &&
          (!loc || t(v, "location") === loc)
        );
      }),
    [vacancies, q, dept, level, type, loc, lang],
  );

  const pillars = [
    {
      Icon: TrendingUp,
      t: L("Career Growth", "النمو الوظيفي"),
      d: L(
        "Clear career paths, internal mobility and promotion from within across all departments.",
        "مسارات وظيفية واضحة وتنقّل داخلي وترقيات من داخل الشركة في جميع الأقسام.",
      ),
    },
    {
      Icon: GraduationCap,
      t: L("Learning & Development", "التعلّم والتطوير"),
      d: L(
        "Technical academies, professional certifications and structured mentoring.",
        "برامج تدريب فنية وشهادات مهنية وبرامج إرشاد منظّمة.",
      ),
    },
    {
      Icon: Users,
      t: L("Culture", "ثقافة العمل"),
      d: L(
        "A collaborative, respectful workplace where every voice counts.",
        "بيئة عمل تعاونية قائمة على الاحترام حيث لكل صوت قيمة.",
      ),
    },
    {
      Icon: Trophy,
      t: L("Professional Excellence", "التميّز المهني"),
      d: L(
        "54 years of underwriting discipline and service standards you can be proud of.",
        "٥٤ عاماً من الانضباط الفني ومعايير خدمة تفخر بالانتماء إليها.",
      ),
    },
    {
      Icon: HeartHandshake,
      t: L("Employee Wellbeing", "رعاية الموظفين"),
      d: L(
        "Medical and life coverage, work-life balance and family-friendly policies.",
        "تأمين صحي وعلى الحياة وتوازن بين العمل والحياة وسياسات داعمة للأسرة.",
      ),
    },
  ];

  const journey = [
    { k: "JOIN", en: "Join", ar: "الانضمام", d: L("Structured onboarding and a buddy from day one.", "برنامج تعريفي منظّم ومرافق مهني من اليوم الأول.") },
    { k: "LEARN", en: "Learn", ar: "التعلّم", d: L("Technical and soft-skill training tailored to your role.", "تدريب فني ومهارات شخصية مصمّم لدورك الوظيفي.") },
    { k: "DEVELOP", en: "Develop", ar: "التطوير", d: L("Certifications, cross-functional projects and coaching.", "شهادات مهنية ومشاريع مشتركة وجلسات إرشاد.") },
    { k: "GROW", en: "Grow", ar: "النمو", d: L("Expanded ownership and measurable career progression.", "مسؤوليات أوسع وتقدّم وظيفي قابل للقياس.") },
    { k: "LEAD", en: "Lead", ar: "القيادة", d: L("Leadership development for future managers of United.", "برامج إعداد القادة لمدراء المستقبل في المتحدة.") },
  ];

  const selectCls =
    "h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--royal)]/40";

  return (
    <SiteLayout>
      <PageHero art="careers"
        eyebrow={L("\n", "\n")}
        title={L("Great People. Strong Culture. Exceptional Performance.", "أفراد متميزون. ثقافة راسخة. أداء استثنائي")}
        subtitle={L(
          "For over five decades our people have been the reason clients trust United Insurance. Join a team where expertise, integrity and care define every day.",
          "على مدى أكثر من خمسة عقود، كان موظفونا سبب ثقة عملائنا بالمتحدة للتأمين. انضم إلى فريق تُشكّل فيه الخبرة والنزاهة والاهتمام ملامح كل يوم.",
        )}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#openings">
            <Button className="rounded-full h-11 px-6 bg-white text-[var(--navy-deep)] hover:bg-white/90">
              {L("View current opportunities", "شاهد الشواغر الحالية")}
            </Button>
          </a>
          <ApplyDialog
            trigger={
              <Button variant="outline" className="rounded-full h-11 px-6 border-white/40 bg-transparent text-white hover:bg-white/10">
                {L("Join our talent pool", "انضم إلى قاعدة المواهب")}
              </Button>
            }
          />
        </div>
      </PageHero>

      {/* Why United */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold tracking-widest uppercase text-[var(--royal)]">
              {L("Why United Insurance", "لماذا المتحدة للتأمين")}
            </div>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">
              {L("A place to build a career, not just a job", "مكان لبناء مسيرة مهنية، لا مجرد وظيفة")}
            </h2>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((p) => (
              <div key={p.t} className="rounded-2xl bg-card border border-border p-6 hover:shadow-lg transition">
                <div className="grid h-11 w-11 place-items-center rounded-xl gradient-royal text-white mb-4">
                  <p.Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{p.t}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career journey */}
      <section className="py-20 bg-muted/40">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-xs font-semibold tracking-widest uppercase text-[var(--royal)]">
            {L("Career Development", "التطوير الوظيفي")}
          </div>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold">{L("Your journey with us", "رحلتك المهنية معنا")}</h2>
          <div className="mt-12 grid md:grid-cols-5 gap-4">
            {journey.map((s, i) => (
              <div key={s.k} className="relative rounded-2xl bg-card border border-border p-6">
                <div className="text-4xl font-bold text-[var(--royal)]/20">{String(i + 1).padStart(2, "0")}</div>
                <div className="mt-2 font-bold tracking-wide">{lang === "ar" ? s.ar : s.en.toUpperCase()}</div>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.d}</p>
                {i < journey.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -end-5 h-5 w-5 text-[var(--royal)]/40 rtl:rotate-180" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Openings */}
      <section id="openings" className="py-20 bg-muted/40 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-xs font-semibold tracking-widest uppercase text-[var(--royal)]">
            {L("Current Opportunities", "الشواغر الحالية")}
          </div>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold">{L("Open vacancies", "الوظائف المتاحة")}</h2>

          <div className="mt-8 rounded-2xl border border-border bg-card p-4 grid gap-3 md:grid-cols-5">
            <div className="relative md:col-span-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={L("Search", "بحث")}
                className="ps-9 h-10"
              />
            </div>
            <select className={selectCls} value={dept} onChange={(e) => setDept(e.target.value)}>
              <option value="">{L("All departments", "كل الأقسام")}</option>
              {options("department").map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            <select className={selectCls} value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="">{L("All levels", "كل المستويات")}</option>
              {options("level").map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            <select className={selectCls} value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">{L("All types", "كل الأنواع")}</option>
              {options("type").map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            <select className={selectCls} value={loc} onChange={(e) => setLoc(e.target.value)}>
              <option value="">{L("All locations", "كل المواقع")}</option>
              {options("location").map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          <div className="mt-6 space-y-4">
            {filtered.map((v) => (
              <div key={v.id} className="rounded-2xl border border-border bg-card p-6 flex flex-col md:flex-row md:items-center gap-5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl gradient-royal text-white">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold">{t(v, "title")}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{t(v, "summary")}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {[t(v, "department"), t(v, "level"), t(v, "type")].filter(Boolean).map((b) => (
                      <Badge key={b} variant="secondary" className="rounded-full">{b}</Badge>
                    ))}
                    {t(v, "location") && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" /> {t(v, "location")}
                      </span>
                    )}
                    {v.closing_date && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground" dir="ltr">
                        <CalendarDays className="h-3.5 w-3.5" /> {v.closing_date}
                      </span>
                    )}
                  </div>
                </div>
                <Link to="/careers/$slug" params={{ slug: v.slug }} className="shrink-0">
                  <Button className="rounded-full h-10 px-5">{L("View & apply", "التفاصيل والتقديم")}</Button>
                </Link>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
                {L("No vacancies match your search right now.", "لا توجد شواغر مطابقة لبحثك حالياً.")}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Talent pool */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-3xl gradient-royal text-white p-10 md:p-14 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">{L("Join our talent pool", "انضم إلى قاعدة المواهب")}</h2>
            <p className="mt-4 text-white/80 max-w-2xl mx-auto">
              {L(
                "Didn't find a suitable vacancy? Share your CV with us and our HR team will reach out when the right opportunity opens.",
                "لم تجد شاغراً مناسباً؟ شاركنا سيرتك الذاتية وسيتواصل معك فريق الموارد البشرية عند توفر الفرصة المناسبة.",
              )}
            </p>
            <ApplyDialog
              trigger={
                <Button className="mt-8 rounded-full h-12 px-8 bg-white text-[var(--navy-deep)] hover:bg-white/90">
                  {L("Submit your CV", "أرسل سيرتك الذاتية")}
                </Button>
              }
            />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
