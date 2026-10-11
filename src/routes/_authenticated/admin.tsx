import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { meIsAdmin } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Newspaper, Users, Home, FileText, LogOut, ShieldAlert, ArrowLeft, Shield, Handshake, Briefcase, Inbox, MailOpen, MessageSquareWarning } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const NAV: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/services", label: "Insurance Services", icon: Shield },
  { to: "/admin/partners", label: "Reinsurance Partners", icon: Handshake },
  { to: "/admin/articles", label: "Articles", icon: Newspaper },
  { to: "/admin/team", label: "Team", icon: Users },
  { to: "/admin/homepage", label: "Homepage", icon: Home },
  { to: "/admin/forms", label: "Forms (PDF)", icon: FileText },
  { to: "/admin/agents", label: "Agents", icon: Handshake },
  { to: "/admin/vacancies", label: "Vacancies", icon: Briefcase },
  { to: "/admin/applications", label: "Applications", icon: Inbox },
  { to: "/admin/messages", label: "Contact Messages", icon: MailOpen },
  { to: "/admin/complaints", label: "Complaints", icon: MessageSquareWarning },
];


function AdminLayout() {
  const navigate = useNavigate();
  const fetchIsAdmin = useServerFn(meIsAdmin);
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["me-is-admin"],
    queryFn: () => fetchIsAdmin(),
  });
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", search: { next: undefined }, replace: true });
  }

  if (isLoading) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center px-6">
        <div className="max-w-md text-center rounded-3xl border border-border bg-card p-10 shadow-elevated">
          <ShieldAlert className="h-10 w-10 mx-auto text-destructive" />
          <h1 className="mt-4 text-2xl font-bold">Not authorized</h1>
          <p className="mt-2 text-muted-foreground">Your account doesn't have admin access. Contact the system owner.</p>
          <div className="mt-6 flex gap-3 justify-center">
            <Button asChild variant="outline"><Link to="/">Back to site</Link></Button>
            <Button onClick={signOut} variant="destructive">Sign out</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-secondary/30">
      <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col">
        <div className="p-5 border-b border-border">
          <div className="text-xs font-semibold tracking-widest uppercase text-[var(--royal)]">Admin</div>
          <div className="font-bold text-lg leading-tight mt-0.5">United Insurance CMS</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                  active ? "bg-[var(--royal)] text-white font-semibold" : "hover:bg-secondary text-foreground/80"
                }`}
              >
                <Icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border space-y-2">
          <Button asChild variant="outline" size="sm" className="w-full justify-start">
            <Link to="/"><ArrowLeft className="h-4 w-4 mr-2" />View site</Link>
          </Button>
          <Button onClick={signOut} variant="ghost" size="sm" className="w-full justify-start text-destructive hover:text-destructive">
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
