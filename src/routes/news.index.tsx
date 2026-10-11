import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { News } from "@/components/site/News";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/news/")({
  head: () => ({
    meta: [
      { title: "News — United Insurance" },
      { name: "description", content: "Latest announcements, financial updates and market insights from United Insurance." },
    ],
    links: [{ rel: "canonical", href: "/news" }],
  }),
  component: NewsPage,
});

function NewsPage() {
  const { t } = useLang();
  return (
    <SiteLayout>
      <PageHero art="news" eyebrow={"\n"} title={t("news.subtitle")} />
      <News />
    </SiteLayout>
  );
}
