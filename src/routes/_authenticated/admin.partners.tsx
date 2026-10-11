import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { listPartnersAdmin, upsertPartner, deletePartner } from "@/lib/admin.functions";
import { uploadToBucket } from "@/lib/admin-upload";
import { Pencil, Trash2, Plus, ImageUp, Handshake } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/partners")({
  component: PartnersAdmin,
});

type Form = {
  id?: string;
  name: string;
  logo_url: string;
  sort_order: number;
  active: boolean;
};

const EMPTY: Form = { name: "", logo_url: "", sort_order: 100, active: true };

function PartnersAdmin() {
  const qc = useQueryClient();
  const list = useServerFn(listPartnersAdmin);
  const save = useServerFn(upsertPartner);
  const del = useServerFn(deletePartner);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["partners-admin"],
    queryFn: () => list(),
  });

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setForm({ ...EMPTY, sort_order: (rows.length + 1) * 10 });
    setOpen(true);
  }
  function openEdit(r: any) {
    setForm({
      id: r.id,
      name: r.name,
      logo_url: r.logo_url,
      sort_order: r.sort_order,
      active: r.active,
    });
    setOpen(true);
  }

  async function onLogo(file: File) {
    try {
      setUploading(true);
      const url = await uploadToBucket("logos", file);
      setForm((f) => ({ ...f, logo_url: url }));
      toast.success("Logo uploaded");
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onSave() {
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.logo_url) return toast.error("Logo is required");
    try {
      setSaving(true);
      await save({ data: form });
      toast.success("Saved");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["partners-admin"] });
      qc.invalidateQueries({ queryKey: ["partners"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Remove this partner logo from the website?")) return;
    try {
      await del({ data: { id } });
      toast.success("Removed");
      qc.invalidateQueries({ queryKey: ["partners-admin"] });
      qc.invalidateQueries({ queryKey: ["partners"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Delete failed");
    }
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Handshake className="h-7 w-7" /> Reinsurance Partners</h1>
          <p className="text-muted-foreground mt-1">Add or remove logos shown in the homepage partners strip.</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" /> Add partner</Button>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading && <div className="text-muted-foreground">Loading…</div>}
        {!isLoading && rows.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-12 border border-dashed border-border rounded-2xl">
            No partners yet. Click "Add partner" to upload the first logo.
          </div>
        )}
        {rows.map((r: any) => (
          <div key={r.id} className="rounded-2xl border border-border bg-card p-4 flex flex-col">
            <div className="h-24 grid place-items-center bg-secondary/40 rounded-lg">
              {r.logo_url ? (
                <img src={r.logo_url} alt={r.name} className="max-h-16 max-w-[80%] object-contain" />
              ) : (
                <span className="text-xs text-muted-foreground">No logo</span>
              )}
            </div>
            <div className="mt-3 flex-1">
              <div className="font-semibold truncate">{r.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Order: {r.sort_order} · {r.active ? "Visible" : "Hidden"}
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(r)}>
                <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(r.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit partner" : "Add partner"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Munich Re" />
            </div>
            <div>
              <Label>Logo</Label>
              <div className="mt-2 flex items-start gap-4">
                <div className="relative h-24 w-40 overflow-hidden rounded-lg border border-border bg-secondary grid place-items-center">
                  {form.logo_url ? (
                    <img src={form.logo_url} alt="" className="max-h-16 max-w-[80%] object-contain" />
                  ) : (
                    <span className="text-xs text-muted-foreground">No logo</span>
                  )}
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-secondary">
                  <ImageUp className="h-4 w-4" />
                  {uploading ? "Uploading…" : "Upload logo"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) onLogo(f); e.currentTarget.value = ""; }}
                  />
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Sort order</Label>
                <Input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-end gap-2">
                <Label htmlFor="active">Visible</Label>
                <Switch id="active" checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={onSave} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
