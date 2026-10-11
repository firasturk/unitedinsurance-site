import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { listApplications, updateApplicationStatus, deleteApplication, getCvUrl } from "@/lib/admin.functions";
import { Download, Trash2, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/applications")({
  component: ApplicationsAdmin,
});

const STATUSES = ["new", "reviewing", "shortlisted", "rejected", "hired"] as const;

function ApplicationsAdmin() {
  const qc = useQueryClient();
  const list = useServerFn(listApplications);
  const setStatus = useServerFn(updateApplicationStatus);
  const del = useServerFn(deleteApplication);
  const signCv = useServerFn(getCvUrl);

  const { data = [], isLoading } = useQuery({ queryKey: ["admin-applications"], queryFn: () => list() });
  const [q, setQ] = useState("");

  const rows = (data as any[]).filter((a) =>
    `${a.full_name} ${a.email} ${a.vacancy_title}`.toLowerCase().includes(q.toLowerCase()),
  );

  async function openCv(path: string) {
    try {
      const { url } = await signCv({ data: { path } });
      window.open(url, "_blank", "noopener");
    } catch (err: any) {
      toast.error(err?.message ?? "Could not open CV");
    }
  }

  async function changeStatus(id: string, status: (typeof STATUSES)[number]) {
    await setStatus({ data: { id, status } });
    qc.invalidateQueries({ queryKey: ["admin-applications"] });
  }

  async function remove(id: string) {
    if (!confirm("Delete this application?")) return;
    await del({ data: { id } });
    qc.invalidateQueries({ queryKey: ["admin-applications"] });
    toast.success("Deleted");
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Applications</h1>
          <p className="text-muted-foreground mt-1">Candidate applications and talent-pool submissions.</p>
        </div>
        <Input className="max-w-xs" placeholder="Search name, email, role" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="mt-8 space-y-3">
        {isLoading && <p className="text-muted-foreground">Loading…</p>}
        {rows.map((a) => (
          <div key={a.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{a.full_name}</h3>
                  <Badge variant="secondary">{a.vacancy_title}</Badge>
                </div>
                <div className="mt-1 flex flex-wrap gap-4 text-sm text-muted-foreground" dir="ltr">
                  <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{a.email}</span>
                  {a.phone && <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{a.phone}</span>}
                  <span>{new Date(a.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <select
                className="h-9 rounded-lg border border-border bg-background px-2 text-sm"
                value={a.status}
                onChange={(e) => changeStatus(a.id, e.target.value as any)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {a.cv_path && (
                <Button variant="outline" size="sm" onClick={() => openCv(a.cv_path)}>
                  <Download className="h-4 w-4 mr-2" />CV
                </Button>
              )}
              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => remove(a.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            {a.cover_note && <p className="mt-3 text-sm text-muted-foreground whitespace-pre-line">{a.cover_note}</p>}
          </div>
        ))}
        {!isLoading && rows.length === 0 && (
          <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">No applications yet.</div>
        )}
      </div>
    </div>
  );
}
