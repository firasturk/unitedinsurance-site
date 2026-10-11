import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { listTeam } from "@/lib/public.functions";
import { upsertTeamMember, deleteTeamMember } from "@/lib/admin.functions";
import { uploadToBucket } from "@/lib/admin-upload";
import { Pencil, Trash2, Plus, ImageUp } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/team")({
  component: TeamAdmin,
});

type Section = "board" | "executive" | "senior";
type Form = {
  id?: string;
  section: Section;
  sort_order: number;
  name_en: string;
  name_ar: string;
  role_en: string;
  role_ar: string;
  photo_url: string | null;
};

function TeamAdmin() {
  const qc = useQueryClient();
  const list = useServerFn(listTeam);
  const save = useServerFn(upsertTeamMember);
  const del = useServerFn(deleteTeamMember);
  const { data = [], isLoading } = useQuery({ queryKey: ["pub-team"], queryFn: () => list() });

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>({ section: "executive", sort_order: 1, name_en: "", name_ar: "", role_en: "", role_ar: "", photo_url: null });
  const [uploading, setUploading] = useState(false);

  function openNew(section: Section) {
    const maxOrder = Math.max(0, ...data.filter((m: any) => m.section === section).map((m: any) => m.sort_order));
    setForm({ section, sort_order: maxOrder + 1, name_en: "", name_ar: "", role_en: "", role_ar: "", photo_url: null });
    setOpen(true);
  }

  function openEdit(m: any) {
    setForm({ id: m.id, section: m.section, sort_order: m.sort_order, name_en: m.name_en, name_ar: m.name_ar, role_en: m.role_en, role_ar: m.role_ar, photo_url: m.photo_url });
    setOpen(true);
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToBucket("team", file);
      setForm((f) => ({ ...f, photo_url: url }));
      toast.success("Photo uploaded");
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    try {
      await save({ data: form });
      toast.success("Saved");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["pub-team"] });
    } catch (err: any) {
      toast.error(err?.message ?? "Save failed");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this member?")) return;
    await del({ data: { id } });
    qc.invalidateQueries({ queryKey: ["pub-team"] });
    toast.success("Deleted");
  }

  function Section({ section, title }: { section: Section; title: string }) {
    const items = data.filter((m: any) => m.section === section);
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <Button size="sm" onClick={() => openNew(section)}><Plus className="h-4 w-4 mr-1" />Add</Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((m: any) => (
            <div key={m.id} className="rounded-2xl border border-border bg-card p-4 flex gap-3">
              {m.photo_url ? <img src={m.photo_url} alt="" className="h-16 w-16 rounded-xl object-cover" /> : <div className="h-16 w-16 rounded-xl bg-secondary grid place-items-center text-xl font-bold text-muted-foreground">{m.name_en.charAt(0)}</div>}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{m.name_en}</div>
                <div className="text-xs text-muted-foreground truncate">{m.role_en}</div>
                <div className="mt-2 flex gap-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(m)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => handleDelete(m.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="text-3xl font-bold">Team</h1>
      <p className="text-muted-foreground mt-1">Board of Directors, Executive Management, and Senior Management.</p>

      {isLoading ? <div className="mt-6 text-muted-foreground">Loading…</div> : (
        <Tabs defaultValue="board" className="mt-6">
          <TabsList>
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="executive">Executive</TabsTrigger>
            <TabsTrigger value="senior">Senior</TabsTrigger>
          </TabsList>
          <TabsContent value="board" className="mt-6"><Section section="board" title="Board of Directors" /></TabsContent>
          <TabsContent value="executive" className="mt-6"><Section section="executive" title="Executive Management" /></TabsContent>
          <TabsContent value="senior" className="mt-6"><Section section="senior" title="Senior Management" /></TabsContent>
        </Tabs>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{form.id ? "Edit member" : "Add member"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Photo</Label>
              <div className="flex items-center gap-3 mt-1">
                {form.photo_url && <img src={form.photo_url} alt="" className="h-16 w-16 rounded-xl object-cover" />}
                <label className="inline-flex items-center gap-2 cursor-pointer text-sm border border-border rounded-md px-3 py-2 hover:bg-secondary">
                  <ImageUp className="h-4 w-4" />{uploading ? "Uploading…" : "Upload photo"}
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
                </label>
              </div>
            </div>
            <div><Label>Sort order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) || 0 })} /></div>
            <div><Label>Section</Label>
              <select className="w-full h-9 border border-input rounded-md px-2 bg-background" value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value as Section })}>
                <option value="board">Board</option><option value="executive">Executive</option><option value="senior">Senior</option>
              </select>
            </div>
            <div><Label>Name (EN)</Label><Input value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} /></div>
            <div><Label>Name (AR)</Label><Input value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} dir="rtl" /></div>
            <div><Label>Role (EN)</Label><Input value={form.role_en} onChange={(e) => setForm({ ...form, role_en: e.target.value })} /></div>
            <div><Label>Role (AR)</Label><Input value={form.role_ar} onChange={(e) => setForm({ ...form, role_ar: e.target.value })} dir="rtl" /></div>
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
