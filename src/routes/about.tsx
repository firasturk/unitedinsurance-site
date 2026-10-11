import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { About as AboutSection } from "@/components/site/About";
import { MissionVision } from "@/components/site/MissionVision";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: ({ match }) =>
    pageHead({
      lang: match.context.lang,
      path: "/about",
      title: {"en": "About Us", "ar": "من نحن"},
      description: {"en": "Half a century of disciplined underwriting and trusted service — United Insurance Company PLC, Amman, Jordan, since 1972.", "ar": "أكثر من نصف قرن من الاكتتاب المنضبط والخدمة الموثوقة — الشركة المتحدة للتأمين م.ع.م، عمّان، الأردن، منذ 1972."},
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
