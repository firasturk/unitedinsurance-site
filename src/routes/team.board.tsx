import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { TeamSectionPage } from "@/components/site/TeamContent";

export const Route = createFileRoute("/team/board")({
  head: ({ match }) =>
    pageHead({
      lang: match.context.lang,
      path: "/team/board",
      title: {"en": "Board of Directors", "ar": "مجلس الإدارة"},
      description: {"en": "Board of Directors of United Insurance Company PLC.", "ar": "مجلس إدارة الشركة المتحدة للتأمين م.ع.م."},
    }),
  component: TeamBoardPage,
});

function TeamBoardPage() {
  return (
    <TeamSectionPage
      eyebrow={{ en: "\n", ar: "\n" }}
      title={{ en: "Board of Directors", ar: "مجلس الإدارة" }}
      subtitle={{
        en: "\n",
        ar: "\n",
      }}
      filter="board"
    />
  );
}
