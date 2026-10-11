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
import { listInsuranceServicesAdmin, upsertInsuranceService, deleteInsuranceService } from "@/lib/admin.functions";
import { uploadToBucket } from "@/lib/admin-upload";
import { Pencil, Trash2, Plus, ImageUp, Shield } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/services")({
  component: ServicesAdmin,
});

const ICON_OPTIONS = [
  "Car", "HeartPulse", "Sparkles", "Plane", "Anchor", "Flame", "Shield",
  "ShieldCheck", "Building", "Briefcase", "Home", "Truck", "Users", "Globe2",
];

const TONE_PRESETS = [
  { label: "Royal Blue", value: "from-[oklch(0.6_0.18_258)] to-[oklch(0.45_0.18_268)]" },
  { label: "Rose Red", value: "from-[oklch(0.65_0.2_15)] to-[oklch(0.5_0.18_350)]" },
  { label: "Teal Green", value: "from-[oklch(0.7_0.18_160)] to-[oklch(0.5_0.16_190)]" },
  { label: "Sky Blue", value: "from-[oklch(0.7_0.16_220)] to-[oklch(0.5_0.18_250)]" },
  { label: "Deep Navy", value: "from-[oklch(0.55_0.15_230)] to-[oklch(0.35_0.12_260)]" },
  { label: "Sunset Orange", value: "from-[oklch(0.72_0.18_55)] to-[oklch(0.55_0.2_30)]" },
];

type Form = {
  id?: string;
  slug: string;
  sort_order: number;
  active: boolean;
  icon: string;
  emoji: string;
  image_url: string | null;
  tone: string;
  title_en: string;
  title_ar: string;
  summary_en: string;
  summary_ar: string;
  overview_en: string;
  overview_ar: string;
  covered_en: string;
  covered_ar: string;
  why_en: string;
  why_ar: string;
};

const EMPTY: Form = {
  slug: "",
  sort_order: 100,
  active: true,
  icon: "Shield",
  emoji: "🛡️",
  image_url: null,
  tone: TONE_PRESETS[0].value,
  title_en: "",
  title_ar: "",
  summary_en: "",
  summary_ar: "",
  overview_en: "",
  overview_ar: "",
  covered_en: "",
  covered_ar: "",
  why_en: "",
  why_ar: "",
};

function ServicesAdmin() {
  const qc = useQueryClient();
  const list = useServerFn(listInsuranceServicesAdmin);
  const save = useServerFn(upsertInsuranceService);
  const del = useServerFn(deleteInsuranceService);

  const { data = [], isLoading } = useQuery({
    queryKey: ["adm-insurance-services"],
    queryFn: () => list(),
  });

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(EMPTY);
  const [uploading, setUploading] = useState(false);

  function openNew() {
    const maxOrder = Math.max(0, ...data.map((s: any) => s.sort_order));
    setForm({ ...EMPTY, sort_order: maxOrder + 1 });
    setOpen(true);
  }

  function openEdit(s: any) {
    setForm({
      id: s.id,
      slug: s.slug,
      sort_order: s.sort_order,
      active: s.active,
      icon: s.icon,
      emoji: s.emoji ?? "",
      image_url: s.image_url,
      tone: s.tone,
      title_en: s.title_en,
      title_ar: s.title_ar,
      summary_en: s.summary_en,
      summary_ar: s.summary_ar,
      overview_en: s.overview_en,
      overview_ar: s.overview_ar,
      covered_en: (s.covered_en ?? []).join("\n"),
      covered_ar: (s.covered_ar ?? []).join("\n"),
      why_en: s.why_en,
      why_ar: s.why_ar,
    });
    setOpen(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToBucket("insurance", file);
      setForm((f) => ({ ...f, image_url: url }));
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    try {
      const payload = {
        ...form,
        emoji: form.emoji || null,
        covered_en: form.covered_en.split("\n").map((s) => s.trim()).filter(Boolean),
        covered_ar: form.covered_ar.split("\n").map((s) => s.trim()).filter(Boolean),
      };
      await save({ data: payload });
      toast.success("Saved");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["adm-insurance-services"] });
      qc.invalidateQueries({ queryKey: ["pub-insurance-services"] });
    } catch (err: any) {
      toast.error(err?.message ?? "Save failed");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this service?")) return;
    try {
      await del({ data: { id } });
      qc.invalidateQueries({ queryKey: ["adm-insurance-services"] });
      qc.invalidateQueries({ queryKey: ["pub-insurance-services"] });
      toast.success("Deleted");
    } catch (err: any) {
      toast.error(err?.message ?? "Delete failed");
    }
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Insurance Services</h1>
          <p className="text-muted-foreground mt-1">Manage the services shown on the homepage and on each /insurance/[type] page.</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" />Add service</Button>
      </div>

      {isLoading ? (
        <div className="mt-8 text-muted-foreground">Loading…</div>
      ) : (
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((s: any) => (
            <div key={s.id} className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="aspect-[16/10] bg-secondary relative">
                {s.image_url ? (
                  <img src={s.image_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full grid place-items-center">
                    <Shield className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                {!s.active && (
                  <span className="absolute top-2 right-2 text-[10px] uppercase tracking-widest font-bold bg-destructive text-destructive-foreground px-2 py-0.5 rounded">Hidden</span>
                )}
              </div>
              <div className="p-4">
                <div className="text-xs text-muted-foreground">/{s.slug} · order {s.sort_order}</div>
                <div className="font-semibold mt-1">{s.title_en}</div>
                <div className="text-sm text-muted-foreground" dir="rtl">{s.title_ar}</div>
                <div className="mt-3 flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => openEdit(s)}><Pencil className="h-3.5 w-3.5 mr-1" />Edit</Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(s.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{form.id ? "Edit service" : "Add service"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Cover image</Label>
              <div className="flex items-center gap-3 mt-1">
                {form.image_url && <img src={form.image_url} alt="" className="h-20 w-32 rounded-xl object-cover" />}
                <label className="inline-flex items-center gap-2 cursor-pointer text-sm border border-border rounded-md px-3 py-2 hover:bg-secondary">
                  <ImageUp className="h-4 w-4" />{uploading ? "Uploading…" : "Upload image"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
                {form.image_url && (
                  <Button size="sm" variant="ghost" onClick={() => setForm({ ...form, image_url: null })}>Remove</Button>
                )}
              </div>
            </div>

            <div>
              <Label>Slug (URL)</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="motor" />
              <p className="text-xs text-muted-foreground mt-1">URL: /insurance/{form.slug || "..."}</p>
            </div>
            <div>
              <Label>Sort order</Label>
              <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) || 0 })} />
            </div>

            <div>
              <Label>Icon (Lucide name)</Label>
              <select className="w-full h-9 border border-input rounded-md px-2 bg-background" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
                {ICON_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <Label>Emoji (detail page)</Label>
              <Input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} placeholder="🛡️" />
            </div>

            <div className="col-span-2">
              <Label>Color tone</Label>
              <select className="w-full h-9 border border-input rounded-md px-2 bg-background" value={form.tone} onChange={(e) => setForm({ ...form, tone: e.target.value })}>
                {TONE_PRESETS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            <div className="col-span-2 flex items-center gap-3">
              <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
              <Label>Active (visible on site)</Label>
            </div>

            <div><Label>Title (EN)</Label><Input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} /></div>
            <div><Label>Title (AR)</Label><Input value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} dir="rtl" /></div>

            <div className="col-span-2"><Label>Short summary (EN)</Label><Textarea rows={2} value={form.summary_en} onChange={(e) => setForm({ ...form, summary_en: e.target.value })} /></div>
            <div className="col-span-2"><Label>Short summary (AR)</Label><Textarea rows={2} value={form.summary_ar} onChange={(e) => setForm({ ...form, summary_ar: e.target.value })} dir="rtl" /></div>

            <div className="col-span-2"><Label>Overview (EN)</Label><Textarea rows={4} value={form.overview_en} onChange={(e) => setForm({ ...form, overview_en: e.target.value })} /></div>
            <div className="col-span-2"><Label>Overview (AR)</Label><Textarea rows={4} value={form.overview_ar} onChange={(e) => setForm({ ...form, overview_ar: e.target.value })} dir="rtl" /></div>

            <div className="col-span-2"><Label>What's covered (EN) — one item per line</Label><Textarea rows={6} value={form.covered_en} onChange={(e) => setForm({ ...form, covered_en: e.target.value })} /></div>
            <div className="col-span-2"><Label>What's covered (AR) — one item per line</Label><Textarea rows={6} value={form.covered_ar} onChange={(e) => setForm({ ...form, covered_ar: e.target.value })} dir="rtl" /></div>

            <div className="col-span-2"><Label>Why United? (EN)</Label><Textarea rows={3} value={form.why_en} onChange={(e) => setForm({ ...form, why_en: e.target.value })} /></div>
            <div className="col-span-2"><Label>Why United? (AR)</Label><Textarea rows={3} value={form.why_ar} onChange={(e) => setForm({ ...form, why_ar: e.target.value })} dir="rtl" /></div>
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
