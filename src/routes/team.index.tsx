import { createFileRoute } from "@tanstack/react-router";
import { TeamSectionPage } from "@/components/site/TeamContent";

export const Route = createFileRoute("/team/")({
  head: () => ({
    meta: [
      { title: "Leadership Team — United Insurance" },
      { name: "description", content: "Board of Directors and Executive Management of United Insurance Company PLC." },
      { property: "og:title", content: "Leadership Team — United Insurance" },
      { property: "og:description", content: "Meet the people leading United Insurance." },
    ],
    links: [{ rel: "canonical", href: "/team" }],
  }),
  component: TeamIndexPage,
});

function TeamIndexPage() {
  return (
    <TeamSectionPage
      subtitle={{
        en: "Board of Directors and Executive Management of United Insurance Company PLC.",
        ar: "مجلس الإدارة والإدارة التنفيذية للشركة المتحدة للتأمين م.ع.م.",
      }}
      filter="all"
    />
  );
}
