import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { listComplaints, updateComplaintStatus, deleteComplaint } from "@/lib/admin.functions";
import { Trash2, Mail, Phone, Hash } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/complaints")({
  component: ComplaintsAdmin,
});

const STATUSES = ["new", "in_progress", "resolved", "closed"] as const;
const KIND_LABEL: Record<string, string> = { suggestion: "Suggestion", complaint: "Complaint", inquiry: "Inquiry" };

function ComplaintsAdmin() {
  const qc = useQueryClient();
  const list = useServerFn(listComplaints);
  const setStatus = useServerFn(updateComplaintStatus);
  const del = useServerFn(deleteComplaint);

  const { data = [], isLoading, error } = useQuery({ queryKey: ["admin-complaints"], queryFn: () => list() });
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const rows = (data as any[]).filter(
    (m) =>
      (filter === "all" || m.status === filter) &&
      `${m.reference} ${m.full_name} ${m.email} ${m.phone} ${m.national_id} ${m.policy_number} ${m.subject} ${m.message}`
        .toLowerCase()
        .includes(q.toLowerCase()),
  );

  async function changeStatus(id: string, status: (typeof STATUSES)[number]) {
    await setStatus({ data: { id, status } });
    qc.invalidateQueries({ queryKey: ["admin-complaints"] });
  }

  async function remove(id: string) {
    if (!confirm("Delete this case permanently?")) return;
    await del({ data: { id } });
    qc.invalidateQueries({ queryKey: ["admin-complaints"] });
    toast.success("Deleted");
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Suggestions &amp; Complaints</h1>
          <p className="text-muted-foreground mt-1">Cases submitted from the complaints page. Each has a reference number the customer received.</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="h-9 rounded-md border border-border bg-background px-2 text-sm" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
          </select>
          <Input className="max-w-xs" placeholder="Search reference, name, subject" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {isLoading && <div className="text-muted-foreground">Loading…</div>}
        {error && (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive">
            {(error as Error).message.includes("complaints")
              ? "The complaints table does not exist yet — run supabase/migrations/20261012000000_complaints.sql in the Supabase SQL editor."
              : (error as Error).message}
          </div>
        )}
        {!isLoading && !error && !rows.length && (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">No cases yet.</div>
        )}
        {rows.map((m) => (
          <div key={m.id} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1 font-mono text-sm font-semibold" dir="ltr"><Hash className="h-3.5 w-3.5" />{m.reference}</span>
                  <Badge variant="outline">{KIND_LABEL[m.kind] ?? m.kind}</Badge>
                  <Badge variant={m.status === "new" ? "default" : "secondary"}>{m.status.replace("_", " ")}</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</span>
                </div>
                <div className="mt-2 font-semibold">{m.subject}</div>
                <div className="mt-1 text-sm">{m.full_name} · National ID <span dir="ltr">{m.national_id}</span>{m.policy_number ? <> · Policy <span dir="ltr">{m.policy_number}</span></> : null}</div>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground" dir="ltr">
                  <a href={`mailto:${m.email}?subject=${encodeURIComponent(`[${m.reference}] ${m.subject}`)}`} className="inline-flex items-center gap-1 hover:underline"><Mail className="h-3.5 w-3.5" />{m.email}</a>
                  <a href={`tel:${m.phone}`} className="inline-flex items-center gap-1 hover:underline"><Phone className="h-3.5 w-3.5" />{m.phone}</a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  className="h-9 rounded-md border border-border bg-background px-2 text-sm"
                  value={m.status}
                  onChange={(e) => changeStatus(m.id, e.target.value as any)}
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                </select>
                <Button variant="ghost" size="icon" className="text-destructive" aria-label="Delete case" onClick={() => remove(m.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed" dir={m.lang === "ar" ? "rtl" : "ltr"}>{m.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
