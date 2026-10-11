import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { useLang } from "@/lib/i18n";
import { codeOfConduct } from "@/data/code-of-conduct";

export const Route = createFileRoute("/governance/code-of-conduct")({
  head: () => ({
    meta: [
      { title: "Code of Conduct Regulation — United Insurance" },
      {
        name: "description",
        content:
          "Instructions No. 5 of 2025 on professional conduct and fair, transparent dealing with insurance clients.",
      },
      { property: "og:title", content: "Code of Conduct Regulation — United Insurance" },
      {
        property: "og:description",
        content: "تعليمات أصول ممارسة المهنة والضوابط اللازمة لتعامل شركة التأمين مع عملائها.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/governance/code-of-conduct" }],
  }),
  component: CodeOfConductPage,
});

function CodeOfConductPage() {
  const { lang } = useLang();
  const lines = codeOfConduct.split("\n").filter(Boolean);

  return (
    <SiteLayout>
      <PageHero art="governance"
        eyebrow={lang === "ar" ? "الحوكمة" : "Governance"}
        title={lang === "ar" ? "تعليمات أصول ممارسة المهنة" : "Code of Conduct Regulation"}
        subtitle={
          lang === "ar"
            ? "تعليمات رقم 5 لسنة 2025 الصادرة عن البنك المركزي الأردني."
            : "Instructions No. 5 of 2025 issued by the Central Bank of Jordan."
        }
      />
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6" dir="rtl" lang="ar">
          <article className="rounded-3xl bg-card border border-border p-8 md:p-12 shadow-soft space-y-4 text-right">
            {lines.map((line, i) => {
              const isArticle = /^المادة\s*\(/.test(line);
              const isHeading = !isArticle && line.length < 60 && !/[.:،]$/.test(line) && i > 0;
              if (isArticle)
                return (
                  <h2 key={i} className="pt-6 text-lg font-bold text-[var(--royal)]">
                    {line}
                  </h2>
                );
              if (isHeading)
                return (
                  <h3 key={i} className="text-base font-semibold">
                    {line}
                  </h3>
                );
              return (
                <p key={i} className="text-sm leading-loose text-muted-foreground">
                  {line}
                </p>
              );
            })}
          </article>
        </div>
      </section>
    </SiteLayout>
  );
}
