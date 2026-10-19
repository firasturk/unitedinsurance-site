import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { listArticlesAdmin, upsertArticle, deleteArticle } from "@/lib/admin.functions";
import { uploadToBucket } from "@/lib/admin-upload";
import { Pencil, Trash2, Plus, ImageUp, FileUp, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/articles")({
  component: ArticlesAdmin,
});

type Form = {
  id?: string;
  slug: string;
  date: string;
  category: string;
  cover_url: string | null;
  attachment_url: string | null; // original document (PDF) offered for download on the article page
  title_en: string;
  title_ar: string;
  excerpt_en: string;
  excerpt_ar: string;
  body_en: string; // textarea, joined by \n\n
  body_ar: string;
  published: boolean;
};

/** "Haddadin interview with MEIR" → "haddadin-interview-with-meir" (Arabic-only titles give an empty string). */
function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

const empty: Form = {
  slug: "",
  date: new Date().toISOString().slice(0, 10),
  category: "Press",
  cover_url: null,
  attachment_url: null,
  title_en: "",
  title_ar: "",
  excerpt_en: "",
  excerpt_ar: "",
  body_en: "",
  body_ar: "",
  published: true,
};

function ArticlesAdmin() {
  const qc = useQueryClient();
  const list = useServerFn(listArticlesAdmin);
  const save = useServerFn(upsertArticle);
  const del = useServerFn(deleteArticle);
  const { data: articles = [], isLoading } = useQuery({ queryKey: ["adm-articles-list"], queryFn: () => list() });

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(empty);
  const [uploading, setUploading] = useState(false);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setForm(empty);
    setOpen(true);
  }

  function openEdit(a: any) {
    setForm({
      id: a.id,
      slug: a.slug,
      date: a.date,
      category: a.category,
      cover_url: a.cover_url,
      attachment_url: a.attachment_url ?? null,
      title_en: a.title_en,
      title_ar: a.title_ar,
      excerpt_en: a.excerpt_en,
      excerpt_ar: a.excerpt_ar,
      body_en: (a.body_en ?? []).join("\n\n"),
      body_ar: (a.body_ar ?? []).join("\n\n"),
      published: a.published,
    });
    setOpen(true);
  }

  const MAX_ATTACHMENT_MB = 25;

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // so picking the same file again re-triggers onChange
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("The cover must be an image (JPG/PNG). To publish a PDF, use “Attachment (PDF)” below.");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadToBucket("articles", file);
      setForm((f) => ({ ...f, cover_url: url }));
      toast.success("Cover uploaded");
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleAttachmentUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
      toast.error("Only PDF files can be attached.");
      return;
    }
    if (file.size > MAX_ATTACHMENT_MB * 1024 * 1024) {
      toast.error(`The PDF is too large (max ${MAX_ATTACHMENT_MB} MB).`);
      return;
    }
    setUploadingAttachment(true);
    try {
      const url = await uploadToBucket("articles", file);
      setForm((f) => ({ ...f, attachment_url: url }));
      toast.success("PDF attached");
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setUploadingAttachment(false);
    }
  }

  async function handleSave() {
    // Plain-language checks before the request, so a missing field never looks like a hung save.
    const title_en = form.title_en.trim();
    const title_ar = form.title_ar.trim();
    if (!title_en || !title_ar) {
      toast.error("Please fill in both titles (English and Arabic).");
      return;
    }
    // The slug (address of the page) is derived from the English title when left empty.
    const slug = (form.slug.trim() || slugify(title_en) || `article-${Date.now()}`).toLowerCase();
    if (!/^[a-z0-9-]+$/.test(slug)) {
      toast.error("The slug may only contain lowercase letters, numbers and hyphens.");
      return;
    }
    if (form.slug !== slug) setForm((f) => ({ ...f, slug }));

    setSaving(true);
    try {
      await save({
        data: {
          ...form,
          slug,
          title_en,
          title_ar,
          body_en: form.body_en.split(/\n\n+/).map((s) => s.trim()).filter(Boolean),
          body_ar: form.body_ar.split(/\n\n+/).map((s) => s.trim()).filter(Boolean),
        },
      });
      toast.success(form.published ? "Saved and published" : "Saved as draft");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["adm-articles-list"] });
      qc.invalidateQueries({ queryKey: ["pub-articles"] });
    } catch (err: any) {
      const msg: string = err?.message ?? "Save failed";
      toast.error(
        /duplicate key|articles_slug/i.test(msg)
          ? `An article with the slug “${slug}” already exists — change the slug.`
          : `Save failed: ${msg}`,
        { duration: 8000 },
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this article?")) return;
    try {
      await del({ data: { id } });
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["adm-articles-list"] });
      qc.invalidateQueries({ queryKey: ["pub-articles"] });
    } catch (err: any) {
      toast.error(err?.message ?? "Delete failed");
    }
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Articles</h1>
          <p className="text-muted-foreground mt-1">News, press, and announcements.</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />New article</Button>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-muted-foreground">Loading…</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr className="text-left">
                <th className="p-3">Cover</th>
                <th className="p-3">Title (EN)</th>
                <th className="p-3">Date</th>
                <th className="p-3">Category</th>
                <th className="p-3">Status</th>
                <th className="p-3 w-32"></th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a: any) => (
                <tr key={a.id} className="border-t border-border">
                  <td className="p-3">{a.cover_url ? <img src={a.cover_url} alt="" className="h-10 w-16 object-cover rounded" /> : <div className="h-10 w-16 bg-secondary rounded" />}</td>
                  <td className="p-3 font-medium">{a.title_en}</td>
                  <td className="p-3 text-muted-foreground">{a.date}</td>
                  <td className="p-3 text-muted-foreground">{a.category}</td>
                  <td className="p-3">{a.published ? <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Published</span> : <span className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded">Draft</span>}</td>
                  <td className="p-3 text-right">
                    <Button onClick={() => openEdit(a)} variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                    <Button onClick={() => handleDelete(a.id)} variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
              {!articles.length && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No articles yet.</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit article" : "New article"}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Slug <span className="text-muted-foreground font-normal">(page address — filled from the English title if left empty)</span></Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder={slugify(form.title_en) || "my-article-slug"} />
            </div>
            <div><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Label>Published</Label>
                <div className="h-9 flex items-center"><Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} /></div>
              </div>
            </div>
          </div>

          <div>
            <Label>Cover image</Label>
            <div className="flex items-center gap-3 mt-1">
              {form.cover_url && <img src={form.cover_url} alt="" className="h-16 w-24 object-cover rounded" />}
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm border border-border rounded-md px-3 py-2 hover:bg-secondary">
                <ImageUp className="h-4 w-4" />
                {uploading ? "Uploading…" : "Upload cover"}
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} disabled={uploading} />
              </label>
            </div>
          </div>

          <div>
            <Label>Attachment (PDF)</Label>
            <p className="text-xs text-muted-foreground mt-0.5">Optional — the original article or press release. Visitors get a “Read the full article (PDF)” button on the page.</p>
            <div className="flex items-center gap-3 mt-2">
              {form.attachment_url ? (
                <>
                  <a href={form.attachment_url} target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-sm text-[var(--royal)] font-medium hover:underline">
                    <FileUp className="h-4 w-4" />
                    {decodeURIComponent(form.attachment_url.split("/").pop() ?? "attachment.pdf")}
                  </a>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setForm({ ...form, attachment_url: null })} aria-label="Remove attachment">
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <label className="inline-flex items-center gap-2 cursor-pointer text-sm border border-border rounded-md px-3 py-2 hover:bg-secondary">
                  <FileUp className="h-4 w-4" />
                  {uploadingAttachment ? "Uploading…" : "Attach PDF"}
                  <input type="file" accept="application/pdf,.pdf" className="hidden" onChange={handleAttachmentUpload} disabled={uploadingAttachment} />
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div><Label>Title (EN)</Label><Input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} /></div>
            <div><Label>Title (AR)</Label><Input value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} dir="rtl" /></div>
            <div><Label>Excerpt (EN)</Label><Textarea rows={3} value={form.excerpt_en} onChange={(e) => setForm({ ...form, excerpt_en: e.target.value })} /></div>
            <div><Label>Excerpt (AR)</Label><Textarea rows={3} value={form.excerpt_ar} onChange={(e) => setForm({ ...form, excerpt_ar: e.target.value })} dir="rtl" /></div>
            <div className="col-span-2"><Label>Body (EN) — paragraphs separated by blank line</Label><Textarea rows={6} value={form.body_en} onChange={(e) => setForm({ ...form, body_en: e.target.value })} /></div>
            <div className="col-span-2"><Label>Body (AR) — paragraphs separated by blank line</Label><Textarea rows={6} value={form.body_ar} onChange={(e) => setForm({ ...form, body_ar: e.target.value })} dir="rtl" /></div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
