import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listArticles, listTeam, listForms, listInsuranceServices } from "@/lib/public.functions";
import { Newspaper, Users, FileText, Home, Shield } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const a = useServerFn(listArticles);
  const t = useServerFn(listTeam);
  const f = useServerFn(listForms);
  const s = useServerFn(listInsuranceServices);
  const articles = useQuery({ queryKey: ["adm-articles"], queryFn: () => a() });
  const team = useQuery({ queryKey: ["adm-team"], queryFn: () => t() });
  const forms = useQuery({ queryKey: ["adm-forms"], queryFn: () => f() });
  const services = useQuery({ queryKey: ["adm-services-count"], queryFn: () => s() });

  const cards = [
    { label: "Insurance services", count: services.data?.length ?? "—", icon: Shield, to: "/admin/services" },
    { label: "Articles", count: articles.data?.length ?? "—", icon: Newspaper, to: "/admin/articles" },
    { label: "Team members", count: team.data?.length ?? "—", icon: Users, to: "/admin/team" },
    { label: "PDF forms", count: forms.data?.length ?? "—", icon: FileText, to: "/admin/forms" },
    { label: "Homepage", count: "Edit", icon: Home, to: "/admin/homepage" },
  ];


  return (
    <div className="p-8 max-w-6xl">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Manage everything that appears on the public website.</p>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              to={c.to}
              className="rounded-2xl border border-border bg-card p-6 hover:shadow-elevated transition group"
            >
              <Icon className="h-6 w-6 text-[var(--royal)]" />
              <div className="mt-4 text-3xl font-bold">{c.count}</div>
              <div className="mt-1 text-sm text-muted-foreground group-hover:text-foreground transition">{c.label}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
