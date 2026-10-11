import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { News } from "@/components/site/News";
import { listLatestArticles } from "@/lib/public.functions";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/news/")({
  head: ({ match }) =>
    pageHead({
      lang: match.context.lang,
      path: "/news",
      title: {"en": "News", "ar": "الأخبار"},
      description: {"en": "Latest announcements, financial updates and market insights from United Insurance.", "ar": "آخر الإعلانات والنتائج المالية ورؤى السوق من الشركة المتحدة للتأمين."},
    }),
  loader: async () => ({ articles: await listLatestArticles({ data: { limit: 24 } }) }),
  component: NewsPage,
});

function NewsPage() {
  const { t } = useLang();
  const { articles } = Route.useLoaderData();
  return (
    <SiteLayout>
      <PageHero art="news" eyebrow={"\n"} title={t("news.subtitle")} />
      <News initial={articles} limit={24} />
    </SiteLayout>
  );
}
