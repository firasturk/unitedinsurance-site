import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { listAllVacancies, upsertVacancy, deleteVacancy } from "@/lib/admin.functions";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/vacancies")({
  component: VacanciesAdmin,
});

type Form = {
  id?: string;
  slug: string;
  title_en: string;
  title_ar: string;
  department_en: string;
  department_ar: string;
  level_en: string;
  level_ar: string;
  type_en: string;
  type_ar: string;
  location_en: string;
  location_ar: string;
  summary_en: string;
  summary_ar: string;
  responsibilities_en: string;
  responsibilities_ar: string;
  qualifications_en: string;
  qualifications_ar: string;
  skills_en: string;
  skills_ar: string;
  closing_date: string;
  published: boolean;
  sort_order: number;
};

const empty: Form = {
  slug: "",
  title_en: "",
  title_ar: "",
  department_en: "",
  department_ar: "",
  level_en: "",
  level_ar: "",
  type_en: "Full-time",
  type_ar: "دوام كامل",
  location_en: "Amman, Jordan",
  location_ar: "عمّان، الأردن",
  summary_en: "",
  summary_ar: "",
  responsibilities_en: "",
  responsibilities_ar: "",
  qualifications_en: "",
  qualifications_ar: "",
  skills_en: "",
  skills_ar: "",
  closing_date: "",
  published: true,
  sort_order: 1,
};

const toLines = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);

function VacanciesAdmin() {
  const qc = useQueryClient();
  const list = useServerFn(listAllVacancies);
  const save = useServerFn(upsertVacancy);
  const del = useServerFn(deleteVacancy);

  const { data = [], isLoading } = useQuery({ queryKey: ["admin-vacancies"], queryFn: () => list() });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(empty);

  function openNew() {
    setForm({ ...empty, sort_order: data.length + 1 });
    setOpen(true);
  }

  function openEdit(v: any) {
    setForm({
      id: v.id,
      slug: v.slug,
      title_en: v.title_en,
      title_ar: v.title_ar,
      department_en: v.department_en ?? "",
      department_ar: v.department_ar ?? "",
      level_en: v.level_en ?? "",
      level_ar: v.level_ar ?? "",
      type_en: v.type_en ?? "",
      type_ar: v.type_ar ?? "",
      location_en: v.location_en ?? "",
      location_ar: v.location_ar ?? "",
      summary_en: v.summary_en ?? "",
      summary_ar: v.summary_ar ?? "",
      responsibilities_en: (v.responsibilities_en ?? []).join("\n"),
      responsibilities_ar: (v.responsibilities_ar ?? []).join("\n"),
      qualifications_en: (v.qualifications_en ?? []).join("\n"),
      qualifications_ar: (v.qualifications_ar ?? []).join("\n"),
      skills_en: (v.skills_en ?? []).join("\n"),
      skills_ar: (v.skills_ar ?? []).join("\n"),
      closing_date: v.closing_date ?? "",
      published: v.published,
      sort_order: v.sort_order,
    });
    setOpen(true);
  }

  async function handleSave() {
    try {
      await save({
        data: {
          ...form,
          slug: form.slug.trim() || form.title_en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
          responsibilities_en: toLines(form.responsibilities_en),
          responsibilities_ar: toLines(form.responsibilities_ar),
          qualifications_en: toLines(form.qualifications_en),
          qualifications_ar: toLines(form.qualifications_ar),
          skills_en: toLines(form.skills_en),
          skills_ar: toLines(form.skills_ar),
          closing_date: form.closing_date || null,
        },
      });
      toast.success("Saved");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["admin-vacancies"] });
    } catch (err: any) {
      toast.error(err?.message ?? "Save failed");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this vacancy?")) return;
    await del({ data: { id } });
    qc.invalidateQueries({ queryKey: ["admin-vacancies"] });
    toast.success("Deleted");
  }

  const field = (label: string, key: keyof Form, dir?: "rtl") => (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input dir={dir} value={String(form[key] ?? "")} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
    </div>
  );

  const area = (label: string, key: keyof Form, dir?: "rtl") => (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Textarea rows={4} dir={dir} value={String(form[key] ?? "")} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
    </div>
  );

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vacancies</h1>
          <p className="text-muted-foreground mt-1">Publish and manage the job openings shown on the Careers page.</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />New vacancy</Button>
      </div>

      <div className="mt-8 space-y-3">
        {isLoading && <p className="text-muted-foreground">Loading…</p>}
        {(data as any[]).map((v) => (
          <div key={v.id} className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold truncate">{v.title_en}</h3>
                {!v.published && <Badge variant="secondary">Draft</Badge>}
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {[v.department_en, v.level_en, v.type_en, v.location_en].filter(Boolean).join(" · ")}
                {v.closing_date ? ` · closes ${v.closing_date}` : ""}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => openEdit(v)}><Pencil className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(v.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {!isLoading && data.length === 0 && (
          <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">No vacancies yet.</div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[88vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{form.id ? "Edit vacancy" : "New vacancy"}</DialogTitle></DialogHeader>
          <div className="grid sm:grid-cols-2 gap-4">
            {field("Title (EN)", "title_en")}
            {field("العنوان (AR)", "title_ar", "rtl")}
            {field("Department (EN)", "department_en")}
            {field("القسم (AR)", "department_ar", "rtl")}
            {field("Level (EN)", "level_en")}
            {field("المستوى (AR)", "level_ar", "rtl")}
            {field("Type (EN)", "type_en")}
            {field("النوع (AR)", "type_ar", "rtl")}
            {field("Location (EN)", "location_en")}
            {field("الموقع (AR)", "location_ar", "rtl")}
            {area("Summary (EN)", "summary_en")}
            {area("الملخص (AR)", "summary_ar", "rtl")}
            {area("Responsibilities (EN) — one per line", "responsibilities_en")}
            {area("المهام (AR) — سطر لكل بند", "responsibilities_ar", "rtl")}
            {area("Qualifications (EN) — one per line", "qualifications_en")}
            {area("المؤهلات (AR) — سطر لكل بند", "qualifications_ar", "rtl")}
            {area("Skills (EN) — one per line", "skills_en")}
            {area("المهارات (AR) — سطر لكل بند", "skills_ar", "rtl")}
            {field("Slug (URL)", "slug")}
            <div className="space-y-1.5">
              <Label>Closing date</Label>
              <Input type="date" value={form.closing_date} onChange={(e) => setForm({ ...form, closing_date: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Sort order</Label>
              <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
              <Label>Published</Label>
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
