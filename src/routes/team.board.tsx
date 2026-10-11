import { createFileRoute } from "@tanstack/react-router";
import { TeamSectionPage } from "@/components/site/TeamContent";

export const Route = createFileRoute("/team/board")({
  head: () => ({
    meta: [
      { title: "Board of Directors — United Insurance" },
      { name: "description", content: "Board of Directors of United Insurance Company PLC." },
      { property: "og:title", content: "Board of Directors — United Insurance" },
      { property: "og:description", content: "Meet the Board of Directors of United Insurance." },
    ],
    links: [{ rel: "canonical", href: "/team/board" }],
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
