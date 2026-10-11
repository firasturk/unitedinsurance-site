import { createFileRoute, Outlet } from "@tanstack/react-router";
import { listTeam } from "@/lib/public.functions";

export const Route = createFileRoute("/team")({
  loader: async () => ({ team: await listTeam() }),
  component: TeamLayout,
});

function TeamLayout() {
  return <Outlet />;
}
