import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { Services } from "@/components/site/Services";
import { listInsuranceServices, listPartners } from "@/lib/public.functions";
import { Partners } from "@/components/site/Partners";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/insurance/")({
  head: ({ match }) =>
    pageHead({
      lang: match.context.lang,
      path: "/insurance",
      title: {"en": "Insurance Solutions", "ar": "حلول التأمين"},
      description: {"en": "Motor, medical, life, travel, marine, fire and engineering insurance for individuals and businesses in Jordan.", "ar": "تأمين المركبات والطبي والحياة والسفر والبحري والحريق والهندسي للأفراد والشركات في الأردن."},
    }),
  loader: async () => {
    const [services, partners] = await Promise.all([listInsuranceServices(), listPartners()]);
    return { services, partners };
  },
  component: InsurancePage,
});

function InsurancePage() {
  const { t } = useLang();
  const { services, partners } = Route.useLoaderData();
  return (
    <SiteLayout>
      <PageHero art="insurance" eyebrow={t("svc.title")} title={t("svc.subtitle")} />
      <Services initial={services} />
      <Partners initial={partners} />
    </SiteLayout>
  );
}
