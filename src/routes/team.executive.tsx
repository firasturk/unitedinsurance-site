import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { TeamSectionPage } from "@/components/site/TeamContent";

export const Route = createFileRoute("/team/executive")({
  head: ({ match }) =>
    pageHead({
      lang: match.context.lang,
      path: "/team/executive",
      title: {"en": "Executive Management", "ar": "الإدارة التنفيذية"},
      description: {"en": "Executive Management of United Insurance Company PLC.", "ar": "الإدارة التنفيذية للشركة المتحدة للتأمين م.ع.م."},
    }),
  component: TeamExecutivePage,
});

function TeamExecutivePage() {
  return (
    <TeamSectionPage
      eyebrow={{ en: "\n", ar: "\n" }}
      title={{ en: "Executive Management", ar: "الإدارة التنفيذية" }}
      subtitle={{
        en: "\n",
        ar: "\n",
      }}
      filter="executive"
    />
  );
}
