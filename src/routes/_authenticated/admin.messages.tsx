import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { listContactMessages, updateContactStatus, deleteContactMessage } from "@/lib/admin.functions";
import { Trash2, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/messages")({
  component: MessagesAdmin,
});

const STATUSES = ["new", "in_progress", "done"] as const;

function MessagesAdmin() {
  const qc = useQueryClient();
  const list = useServerFn(listContactMessages);
  const setStatus = useServerFn(updateContactStatus);
  const del = useServerFn(deleteContactMessage);

  const { data = [], isLoading } = useQuery({ queryKey: ["admin-contact-messages"], queryFn: () => list() });
  const [q, setQ] = useState("");

  const rows = (data as any[]).filter((m) =>
    `${m.full_name} ${m.email} ${m.phone} ${m.insurance_type} ${m.message}`.toLowerCase().includes(q.toLowerCase()),
  );

  async function changeStatus(id: string, status: (typeof STATUSES)[number]) {
    await setStatus({ data: { id, status } });
    qc.invalidateQueries({ queryKey: ["admin-contact-messages"] });
  }

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    await del({ data: { id } });
    qc.invalidateQueries({ queryKey: ["admin-contact-messages"] });
    toast.success("Deleted");
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Contact Messages</h1>
          <p className="text-muted-foreground mt-1">Quote requests and messages sent from the contact page.</p>
        </div>
        <Input className="max-w-xs" placeholder="Search name, email, type" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="mt-6 space-y-4">
        {isLoading && <div className="text-muted-foreground">Loading…</div>}
        {!isLoading && !rows.length && (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">No messages yet.</div>
        )}
        {rows.map((m) => (
          <div key={m.id} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{m.full_name}</span>
                  <Badge variant={m.status === "new" ? "default" : "secondary"}>{m.status}</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground" dir="ltr">
                  <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1 hover:underline"><Mail className="h-3.5 w-3.5" />{m.email}</a>
                  <a href={`tel:${m.phone}`} className="inline-flex items-center gap-1 hover:underline"><Phone className="h-3.5 w-3.5" />{m.phone}</a>
                  <span>{m.insurance_type}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  className="h-9 rounded-md border border-border bg-background px-2 text-sm"
                  value={m.status}
                  onChange={(e) => changeStatus(m.id, e.target.value as any)}
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => remove(m.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">{m.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
