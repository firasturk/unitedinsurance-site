import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { useLang } from "@/lib/i18n";
import { listForms, type FormRow } from "@/lib/public.functions";

export const Route = createFileRoute("/reports")({
  head: ({ match }) =>
    pageHead({
      lang: match.context.lang,
      path: "/reports",
      title: {"en": "Annual Reports", "ar": "التقارير السنوية"},
      description: {"en": "Download United Insurance annual reports and financial disclosures.", "ar": "تحميل التقارير السنوية والإفصاحات المالية للشركة المتحدة للتأمين."},
    }),
  loader: async () => ({ forms: await listForms() }),
  component: ReportsPage,
});

function ReportsPage() {
  const { lang } = useLang();
  const initial = Route.useLoaderData();
  const fetchForms = useServerFn(listForms);
  const { data = initial.forms } = useQuery({
    queryKey: ["pub-forms"],
    queryFn: () => fetchForms(),
    initialData: initial.forms,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    refetchInterval: 15_000,
  });

  const reports = (data as FormRow[]).filter((f) => f.category === "report" || f.category === "other");

  return (
    <SiteLayout>
      <PageHero art="reports"
        eyebrow={lang === "ar" ? "\n" : "\n"}
        title={lang === "ar" ? "التقارير السنوية" : "Annual Reports"}
        subtitle={lang === "ar" ? "\n" : "\n"}
      />
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6 grid sm:grid-cols-2 gap-4">
          {reports.map((f) => (
            <a
              key={f.id}
              href={f.file_url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 rounded-2xl bg-card border border-border p-5 hover:shadow-elevated hover:border-[var(--royal)]/40 transition"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl gradient-royal text-white"><FileText className="h-5 w-5" /></div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{lang === "ar" ? f.label_ar : f.label_en}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {lang === "ar" ? "PDF · اضغط للتحميل" : "PDF · Click to download"}
                </div>
              </div>
              <Download className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-[var(--royal)] transition" />
            </a>
          ))}
          {!reports.length && (
            <div className="sm:col-span-2 rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
              {lang === "ar" ? "لا توجد تقارير منشورة حالياً." : "No reports published yet."}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
