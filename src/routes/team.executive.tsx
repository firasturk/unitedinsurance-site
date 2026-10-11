import { createFileRoute } from "@tanstack/react-router";
import { TeamSectionPage } from "@/components/site/TeamContent";

export const Route = createFileRoute("/team/executive")({
  head: () => ({
    meta: [
      { title: "Executive Management — United Insurance" },
      { name: "description", content: "Executive Management of United Insurance Company PLC." },
      { property: "og:title", content: "Executive Management — United Insurance" },
      { property: "og:description", content: "Meet the Executive Management of United Insurance." },
    ],
    links: [{ rel: "canonical", href: "/team/executive" }],
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
