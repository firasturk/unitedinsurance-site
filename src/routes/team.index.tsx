import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { TeamSectionPage } from "@/components/site/TeamContent";

export const Route = createFileRoute("/team/")({
  head: ({ match }) =>
    pageHead({
      lang: match.context.lang,
      path: "/team",
      title: {"en": "Leadership Team", "ar": "الإدارة"},
      description: {"en": "Board of Directors and Executive Management of United Insurance Company PLC.", "ar": "مجلس الإدارة والإدارة التنفيذية للشركة المتحدة للتأمين م.ع.م."},
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
