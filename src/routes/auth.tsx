import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({
    next: typeof s.next === "string" && s.next.startsWith("/") && !s.next.startsWith("//") ? s.next : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — United Insurance" },
      { name: "description", content: "Sign in to the admin panel." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { next } = Route.useSearch();
  const destination = next ?? "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) window.location.href = destination;
    });
  }, [destination]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Signed in");
    window.location.href = destination;
  }

  return (
    <SiteLayout>
      <section className="py-24 min-h-[70vh] grid place-items-center px-6">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-elevated">
          <div className="flex items-center gap-3 mb-6">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--royal)] text-white">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold tracking-widest uppercase text-[var(--royal)]">Admin</div>
              <h1 className="text-xl font-bold">Sign in to admin panel</h1>
            </div>
          </div>

          <form onSubmit={signIn} className="space-y-4 mt-2">
            <div>
              <Label htmlFor="email-in">Email</Label>
              <Input id="email-in" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="pw-in">Password</Label>
              <Input id="pw-in" type="password" autoComplete="current-password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" disabled={loading} className="w-full">{loading ? "Signing in…" : "Sign in"}</Button>
          </form>
          <p className="mt-4 text-xs text-muted-foreground text-center">
            Accounts are created by the site administrator. Forgot your password? Contact IT.
          </p>

          <p className="mt-6 text-xs text-muted-foreground text-center">
            <Link to="/" className="hover:underline">← Back to home</Link>
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
