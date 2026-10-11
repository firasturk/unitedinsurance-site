import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { listForms } from "@/lib/public.functions";
import { upsertForm, deleteForm } from "@/lib/admin.functions";
import { uploadToBucket } from "@/lib/admin-upload";
import { Pencil, Trash2, Plus, FileUp, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/forms")({
  component: FormsAdmin,
});

type Cat = "application" | "claim" | "report" | "complaint" | "other";
type F = { id?: string; slug: string; category: Cat; label_en: string; label_ar: string; file_url: string; sort_order: number };

function FormsAdmin() {
  const qc = useQueryClient();
  const list = useServerFn(listForms);
  const save = useServerFn(upsertForm);
  const del = useServerFn(deleteForm);
  const { data = [], isLoading } = useQuery({ queryKey: ["pub-forms"], queryFn: () => list() });

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<F>({ slug: "", category: "report", label_en: "", label_ar: "", file_url: "", sort_order: 1 });
  const [uploading, setUploading] = useState(false);

  function openNew() {
    setForm({ slug: "", category: "report", label_en: "", label_ar: "", file_url: "", sort_order: (data.length + 1) });
    setOpen(true);
  }
  function openEdit(f: any) {
    setForm({ id: f.id, slug: f.slug, category: f.category, label_en: f.label_en, label_ar: f.label_ar, file_url: f.file_url, sort_order: f.sort_order });
    setOpen(true);
  }
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") return toast.error("PDF files only");
    setUploading(true);
    try {
      const url = await uploadToBucket("forms", file);
      setForm((f) => ({ ...f, file_url: url }));
      toast.success("PDF uploaded");
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }
  function slugify(s: string) {
    return s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 100);
  }

  async function handleSave() {
    const label_en = form.label_en.trim();
    const label_ar = form.label_ar.trim();
    const slug = slugify(form.slug || label_en || label_ar);
    if (!label_en || !label_ar) return toast.error("Please fill both English and Arabic labels");
    if (!slug) return toast.error("Please enter a slug (letters and numbers)");
    if (!form.file_url) return toast.error("Please upload a PDF file first");
    try {
      await save({ data: { ...form, slug, label_en, label_ar } });
      toast.success("Saved");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["pub-forms"] });
    } catch (err: any) {
      toast.error(err?.message ?? "Save failed");
    }
  }
  async function handleDelete(id: string) {
    if (!confirm("Delete this form?")) return;
    await del({ data: { id } });
    qc.invalidateQueries({ queryKey: ["pub-forms"] });
    toast.success("Deleted");
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">PDF Forms</h1>
          <p className="text-muted-foreground mt-1">Annual reports, the complaints form, and other documents.</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />New form</Button>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card overflow-hidden">
        {isLoading ? <div className="p-6 text-muted-foreground">Loading…</div> : (
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr className="text-left">
                <th className="p-3">Label (EN)</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Category</th>
                <th className="p-3">File</th>
                <th className="p-3">Order</th>
                <th className="p-3 w-32"></th>
              </tr>
            </thead>
            <tbody>
              {data.map((f: any) => (
                <tr key={f.id} className="border-t border-border">
                  <td className="p-3 font-medium">{f.label_en}</td>
                  <td className="p-3 text-muted-foreground">{f.slug}</td>
                  <td className="p-3 text-muted-foreground capitalize">{f.category}</td>
                  <td className="p-3"><a href={f.file_url} target="_blank" rel="noreferrer" className="text-[var(--royal)] inline-flex items-center gap-1 hover:underline">Open <ExternalLink className="h-3 w-3" /></a></td>
                  <td className="p-3 text-muted-foreground">{f.sort_order}</td>
                  <td className="p-3 text-right">
                    <Button onClick={() => openEdit(f)} variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                    <Button onClick={() => handleDelete(f.id)} variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
              {!data.length && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No forms yet.</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{form.id ? "Edit form" : "New form"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="annual-report-2025" /></div>
            <div><Label>Category</Label>
              <select className="w-full h-9 border border-input rounded-md px-2 bg-background" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Cat })}>
                <option value="report">Report</option>
                <option value="complaint">Complaint</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div><Label>Label (EN)</Label><Input value={form.label_en} onChange={(e) => setForm({ ...form, label_en: e.target.value })} /></div>
            <div><Label>Label (AR)</Label><Input value={form.label_ar} onChange={(e) => setForm({ ...form, label_ar: e.target.value })} dir="rtl" /></div>
            <div><Label>Sort order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) || 0 })} /></div>
            <div className="col-span-2">
              <Label>PDF file</Label>
              <div className="flex items-center gap-3 mt-1">
                {form.file_url && <a href={form.file_url} target="_blank" rel="noreferrer" className="text-sm text-[var(--royal)] hover:underline truncate max-w-xs">{form.file_url}</a>}
                <label className="inline-flex items-center gap-2 cursor-pointer text-sm border border-border rounded-md px-3 py-2 hover:bg-secondary">
                  <FileUp className="h-4 w-4" />{uploading ? "Uploading…" : (form.file_url ? "Replace PDF" : "Upload PDF")}
                  <input type="file" accept="application/pdf" className="hidden" onChange={handleUpload} disabled={uploading} />
                </label>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Or paste a URL: <Input className="mt-1" value={form.file_url} onChange={(e) => setForm({ ...form, file_url: e.target.value })} /></p>
            </div>
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
