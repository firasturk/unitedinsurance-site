import { createFileRoute } from "@tanstack/react-router";
import { agentsPdfAsset } from "@/lib/media";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { listAgentNews, getSiteContent } from "@/lib/public.functions";
import { upsertAgentNews, deleteAgentNews, upsertSiteContent } from "@/lib/admin.functions";
import { uploadToBucket } from "@/lib/admin-upload";
import { Pencil, Trash2, Plus, FileUp, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/agents")({
  component: AgentsAdmin,
});

type N = {
  id?: string;
  date: string;
  title_en: string;
  title_ar: string;
  body_en: string;
  body_ar: string;
  sort_order: number;
  published: boolean;
};

const empty: N = { date: "", title_en: "", title_ar: "", body_en: "", body_ar: "", sort_order: 1, published: true };

function AgentsAdmin() {
  const qc = useQueryClient();
  const list = useServerFn(listAgentNews);
  const save = useServerFn(upsertAgentNews);
  const del = useServerFn(deleteAgentNews);
  const getContent = useServerFn(getSiteContent);
  const saveContent = useServerFn(upsertSiteContent);

  const { data = [], isLoading } = useQuery({ queryKey: ["agent-news"], queryFn: () => list() });
  const { data: pdf } = useQuery({
    queryKey: ["site-content", "agents_pdf"],
    queryFn: async () => {
      const res = await getContent({ data: { key: "agents_pdf" } });
      return res.json ? (JSON.parse(res.json) as { url?: string }) : null;
    },
  });

  const pdfUrl = pdf?.url || agentsPdfAsset;
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<N>(empty);
  const [uploading, setUploading] = useState(false);

  async function handlePdf(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") return toast.error("PDF files only");
    setUploading(true);
    try {
      const url = await uploadToBucket("forms", file);
      await saveContent({ data: { key: "agents_pdf", value: { url } } });
      qc.invalidateQueries({ queryKey: ["site-content", "agents_pdf"] });
      toast.success("Agents PDF updated");
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function openNew() {
    setForm({ ...empty, sort_order: data.length + 1 });
    setOpen(true);
  }
  function openEdit(n: any) {
    setForm({
      id: n.id,
      date: n.date,
      title_en: n.title_en,
      title_ar: n.title_ar,
      body_en: (n.body_en ?? []).join("\n\n"),
      body_ar: (n.body_ar ?? []).join("\n\n"),
      sort_order: n.sort_order,
      published: n.published,
    });
    setOpen(true);
  }
  async function handleSave() {
    try {
      await save({
        data: {
          ...form,
          body_en: form.body_en.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
          body_ar: form.body_ar.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
        },
      });
      toast.success("Saved");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["agent-news"] });
    } catch (err: any) {
      toast.error(err?.message ?? "Save failed");
    }
  }
  async function handleDelete(id: string) {
    if (!confirm("Delete this news item?")) return;
    await del({ data: { id } });
    qc.invalidateQueries({ queryKey: ["agent-news"] });
    toast.success("Deleted");
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agents</h1>
          <p className="text-muted-foreground mt-1">Manage the agents PDF and the agents news notices.</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />New news item</Button>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold">Agents PDF</h2>
        <p className="text-sm text-muted-foreground mt-1">The file behind the "Click here (PDF)" button on the Agents page.</p>
        <div className="mt-3 flex items-center gap-4">
          <a href={pdfUrl} target="_blank" rel="noreferrer" className="text-sm text-[var(--royal)] inline-flex items-center gap-1 hover:underline truncate max-w-md">
            Open current PDF <ExternalLink className="h-3 w-3" />
          </a>
          <label className="inline-flex items-center gap-2 cursor-pointer text-sm border border-border rounded-md px-3 py-2 hover:bg-secondary">
            <FileUp className="h-4 w-4" />{uploading ? "Uploading…" : "Replace PDF"}
            <input type="file" accept="application/pdf" className="hidden" onChange={handlePdf} disabled={uploading} />
          </label>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card overflow-hidden">
        {isLoading ? <div className="p-6 text-muted-foreground">Loading…</div> : (
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr className="text-left">
                <th className="p-3">Date</th>
                <th className="p-3">Title (EN)</th>
                <th className="p-3">Order</th>
                <th className="p-3">Published</th>
                <th className="p-3 w-32"></th>
              </tr>
            </thead>
            <tbody>
              {data.map((n: any) => (
                <tr key={n.id} className="border-t border-border">
                  <td className="p-3 text-muted-foreground">{n.date}</td>
                  <td className="p-3 font-medium">{n.title_en || n.title_ar}</td>
                  <td className="p-3 text-muted-foreground">{n.sort_order}</td>
                  <td className="p-3 text-muted-foreground">{n.published ? "Yes" : "No"}</td>
                  <td className="p-3 text-right">
                    <Button onClick={() => openEdit(n)} variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                    <Button onClick={() => handleDelete(n.id)} variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
              {!data.length && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No agents news yet.</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{form.id ? "Edit news item" : "New news item"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Date</Label><Input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="2026/03/08" /></div>
            <div><Label>Sort order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) || 0 })} /></div>
            <div><Label>Title (EN)</Label><Input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} /></div>
            <div><Label>Title (AR)</Label><Input value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} dir="rtl" /></div>
            <div className="col-span-2"><Label>Body (EN) — blank line between paragraphs</Label><Textarea rows={6} value={form.body_en} onChange={(e) => setForm({ ...form, body_en: e.target.value })} /></div>
            <div className="col-span-2"><Label>Body (AR) — سطر فارغ بين الفقرات</Label><Textarea rows={6} dir="rtl" value={form.body_ar} onChange={(e) => setForm({ ...form, body_ar: e.target.value })} /></div>
            <label className="col-span-2 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              Published
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
