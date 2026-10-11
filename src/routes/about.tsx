import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { About as AboutSection } from "@/components/site/About";
import { MissionVision } from "@/components/site/MissionVision";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — United Insurance" },
      { name: "description", content: "Half a century of disciplined underwriting and trusted service across the region." },
      { property: "og:title", content: "About United Insurance" },
      { property: "og:description", content: "Half a century of protecting what matters." },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useLang();
  return (
    <SiteLayout>
      <PageHero art="about" eyebrow={t("about.eyebrow")} title={t("about.title")} subtitle={t("about.body")} />
      <AboutSection />
      <MissionVision />
    </SiteLayout>
  );
}
