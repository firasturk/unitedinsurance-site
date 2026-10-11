import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { About } from "@/components/site/About";
import { News } from "@/components/site/News";
import { Partners } from "@/components/site/Partners";
import { AssemblyNotice } from "@/components/site/AssemblyNotice";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "United Insurance — A Safe Future Starts Today" },
      { name: "description", content: "Premium bilingual insurance: motor, medical, life, travel, marine and fire coverage, backed by global reinsurers." },
      { property: "og:title", content: "United Insurance" },
      { property: "og:description", content: "A Safe Future Starts Today — premium insurance for individuals and enterprises." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteLayout>
      <Hero />
      <AssemblyNotice />
      <Services />
      <About />
      <News />
      <Partners />
    </SiteLayout>
  );
}
