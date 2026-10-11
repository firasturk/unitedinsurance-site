import { createFileRoute } from "@tanstack/react-router";
import { pageHead, organizationJsonLd } from "@/lib/seo";
import { getSiteContent, listInsuranceServices, listLatestArticles, listPartners } from "@/lib/public.functions";
import { SiteLayout } from "@/components/site/Layout";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { About } from "@/components/site/About";
import { News } from "@/components/site/News";
import { Partners } from "@/components/site/Partners";
import { AssemblyNotice } from "@/components/site/AssemblyNotice";

export const Route = createFileRoute("/")({
  // Everything the homepage shows is loaded on the server, so the first HTML already
  // contains the hero text, services, news and partners (crawlers see real content).
  loader: async () => {
    const [hero, notice, services, articles, partners] = await Promise.all([
      getSiteContent({ data: { key: "hero" } }),
      getSiteContent({ data: { key: "assembly_notice" } }),
      listInsuranceServices(),
      listLatestArticles({ data: { limit: 6 } }),
      listPartners(),
    ]);
    return { hero, notice, services, articles, partners };
  },
  head: ({ match }) =>
    pageHead({
      lang: match.context.lang,
      path: "/",
      title: { en: "United Insurance — A Safe Future Starts Today", ar: "الشركة المتحدة للتأمين — مستقبل آمن يبدأ اليوم" },
      description: {
        en: "United Insurance Company PLC — trusted in Jordan since 1972. Motor, medical, life, travel, marine, fire and engineering insurance, backed by leading global reinsurers.",
        ar: "الشركة المتحدة للتأمين م.ع.م — ثقة في الأردن منذ 1972. تأمين المركبات والطبي والحياة والسفر والبحري والحريق والهندسي، بدعم من كبرى شركات إعادة التأمين العالمية.",
      },
      jsonLd: [organizationJsonLd(match.context.lang)],
    }),
  component: Home,
});

function Home() {
  const { hero, notice, services, articles, partners } = Route.useLoaderData();
  return (
    <SiteLayout>
      <Hero initial={hero} />
      <AssemblyNotice initial={notice} />
      <Services initial={services} />
      <About />
      <News initial={articles} />
      <Partners initial={partners} />
    </SiteLayout>
  );
}
