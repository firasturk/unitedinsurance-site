import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { Services } from "@/components/site/Services";
import { Partners } from "@/components/site/Partners";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/insurance/")({
  head: () => ({
    meta: [
      { title: "Insurance Solutions — United Insurance" },
      { name: "description", content: "Motor, medical, life, travel, marine and fire insurance solutions." },
      { property: "og:title", content: "Insurance Solutions" },
      { property: "og:description", content: "A complete portfolio of personal and commercial coverage." },
    ],
    links: [{ rel: "canonical", href: "/insurance" }],
  }),
  component: InsurancePage,
});

function InsurancePage() {
  const { t } = useLang();
  return (
    <SiteLayout>
      <PageHero art="insurance" eyebrow={t("svc.title")} title={t("svc.subtitle")} />
      <Services />
      <Partners />
    </SiteLayout>
  );
}
