import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { agentsList } from "@/lib/media";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listAgentNews, getSiteContent } from "@/lib/public.functions";
import { ArrowLeft, Download, FileText, Megaphone } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/agents")({
  head: ({ match }) =>
    pageHead({
      lang: match.context.lang,
      path: "/agents",
      title: {"en": "Agents", "ar": "الوكلاء"},
      description: {"en": "Licensed agents of United Insurance Company PLC, the official agent list and the latest agents news.", "ar": "وكلاء الشركة المتحدة للتأمين المرخّصون، القائمة الرسمية للوكلاء وآخر تعاميم الوكلاء."},
    }),
  loader: async () => {
    const [news, content] = await Promise.all([listAgentNews(), getSiteContent({ data: { key: "agents_pdf" } })]);
    return { news: news as AgentNews[], pdf: content.json ? (JSON.parse(content.json) as { url?: string }) : null };
  },
  component: AgentsPage,
});

type AgentNews = {
  id: string;
  date: string;
  title_en: string;
  title_ar: string;
  body_en: string[];
  body_ar: string[];
  published: boolean;
};

function AgentsPage() {
  const { lang } = useLang();
  const [active, setActive] = useState<AgentNews | null>(null);
  const initial = Route.useLoaderData();
  const fetchNews = useServerFn(listAgentNews);
  const fetchContent = useServerFn(getSiteContent);
  const { data: news = [] } = useQuery({
    queryKey: ["agent-news-public"],
    queryFn: async () => (await fetchNews()) as AgentNews[],
    initialData: initial.news,
    staleTime: 300_000,
  });
  const { data: pdf } = useQuery({
    queryKey: ["site-content", "agents_pdf"],
    queryFn: async () => {
      const res = await fetchContent({ data: { key: "agents_pdf" } });
      return res.json ? (JSON.parse(res.json) as { url?: string }) : null;
    },
    initialData: initial.pdf,
    staleTime: 300_000,
  });
  const pdfUrl = pdf?.url || agentsList;
  const L = (en: string, ar: string) => (lang === "ar" ? ar : en);

  return (
    <SiteLayout>
      <PageHero art="agents"
        eyebrow={L("\n", "\n")}
        title={L("Agents", "الوكلاء")}
        subtitle={L(
          "Our licensed agents across the Kingdom, and the latest updates about them.",
          "وكلاؤنا المرخصون في جميع أنحاء المملكة، وآخر المستجدات المتعلقة بهم."
        )}
      />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-3xl bg-card border border-border p-8 sm:p-10 shadow-soft flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl gradient-royal text-white">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{L("Select the agent list", "قائمة الوكلاء")}</h2>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {L(
                    "View the official list of licensed insurance agents approved by United Insurance Company PLC.",
                    "اطّلع على القائمة الرسمية لوكلاء التأمين المرخصين المعتمدين لدى الشركة المتحدة للتأمين م.ع.م."
                  )}
                </p>
              </div>
            </div>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              download="agent-licensing-instructions.pdf"
              className="inline-flex shrink-0 items-center gap-2 h-12 px-6 rounded-full gradient-royal text-white text-sm font-semibold shadow-soft hover:shadow-glow transition"
            >
              <Download className="h-4 w-4" />
              {L("Click here (PDF)", "اضغط هنا (PDF)")}
            </a>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-10">
            <div className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">
              {L("Last updated from", "آخر تحديث من")}
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold">{L("Agents News", "أخبار الوكلاء")}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {news.map((n) => (
              <article key={n.id} className="rounded-3xl bg-card border border-border p-7 shadow-soft hover:shadow-elevated transition flex flex-col">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--royal)]/10 text-[var(--royal)]">
                  <Megaphone className="h-5 w-5" />
                </div>
                <div className="mt-4 text-xs text-muted-foreground">{n.date}</div>
                <p className="mt-2 text-base font-medium leading-relaxed">{L(n.title_en, n.title_ar)}</p>
                <button
                  type="button"
                  onClick={() => setActive(n)}
                  className="mt-5 inline-flex items-center gap-2 self-start text-sm font-semibold text-[var(--royal)] hover:underline"
                >
                  {L("Read More", "اقرأ المزيد")}
                  <ArrowLeft className="h-4 w-4 rtl:rotate-0 ltr:rotate-180" />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-2xl" dir={lang === "ar" ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle className="text-start">
              {active ? L(active.title_en, active.title_ar) : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <div className="text-xs">{active?.date}</div>
            {(lang === "ar" ? active?.body_ar : active?.body_en)?.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </SiteLayout>
  );
}
