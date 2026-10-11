import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { getSiteContent } from "@/lib/public.functions";
import { upsertSiteContent } from "@/lib/admin.functions";
import { uploadToBucket } from "@/lib/admin-upload";
import { toast } from "sonner";
import { ImageUp, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/homepage")({
  component: HomepageAdmin,
});

type Hero = { eyebrow_en: string; eyebrow_ar: string; title_en: string; title_ar: string; subtitle_en: string; subtitle_ar: string; image_url?: string | null };
type Notice = { enabled: boolean; eyebrow_en: string; eyebrow_ar: string; title_en: string; title_ar: string; link_slug: string };

function HomepageAdmin() {
  const qc = useQueryClient();
  const get = useServerFn(getSiteContent);
  const save = useServerFn(upsertSiteContent);

  const heroQ = useQuery({ queryKey: ["sc-hero"], queryFn: () => get({ data: { key: "hero" } }) });
  const noticeQ = useQuery({ queryKey: ["sc-notice"], queryFn: () => get({ data: { key: "assembly_notice" } }) });

  const [hero, setHero] = useState<Hero>({ eyebrow_en: "", eyebrow_ar: "", title_en: "", title_ar: "", subtitle_en: "", subtitle_ar: "", image_url: null });
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState<Notice>({ enabled: true, eyebrow_en: "", eyebrow_ar: "", title_en: "", title_ar: "", link_slug: "" });

  useEffect(() => { if (heroQ.data?.json) setHero(JSON.parse(heroQ.data.json)); }, [heroQ.data]);
  useEffect(() => { if (noticeQ.data?.json) setNotice(JSON.parse(noticeQ.data.json)); }, [noticeQ.data]);

  async function saveHero() {
    await save({ data: { key: "hero", value: hero } });
    toast.success("Hero saved");
    qc.invalidateQueries({ queryKey: ["sc-hero"] });
  }
  async function saveNotice() {
    await save({ data: { key: "assembly_notice", value: notice } });
    toast.success("Notice saved");
    qc.invalidateQueries({ queryKey: ["sc-notice"] });
  }
  async function onHeroImage(file: File) {
    try {
      setUploading(true);
      const url = await uploadToBucket("insurance", file);
      setHero((h) => ({ ...h, image_url: url }));
      toast.success("Image uploaded — click Save hero to publish");
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="p-8 max-w-4xl space-y-10">
      <div>
        <h1 className="text-3xl font-bold">Homepage</h1>
        <p className="text-muted-foreground mt-1">Edit the hero section and the shareholders notice banner.</p>
      </div>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-xl font-bold">Hero section</h2>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div><Label>Eyebrow (EN)</Label><Input value={hero.eyebrow_en} onChange={(e) => setHero({ ...hero, eyebrow_en: e.target.value })} /></div>
          <div><Label>Eyebrow (AR)</Label><Input value={hero.eyebrow_ar} onChange={(e) => setHero({ ...hero, eyebrow_ar: e.target.value })} dir="rtl" /></div>
          <div><Label>Title (EN)</Label><Input value={hero.title_en} onChange={(e) => setHero({ ...hero, title_en: e.target.value })} /></div>
          <div><Label>Title (AR)</Label><Input value={hero.title_ar} onChange={(e) => setHero({ ...hero, title_ar: e.target.value })} dir="rtl" /></div>
          <div className="col-span-2"><Label>Subtitle (EN)</Label><Textarea rows={2} value={hero.subtitle_en} onChange={(e) => setHero({ ...hero, subtitle_en: e.target.value })} /></div>
          <div className="col-span-2"><Label>Subtitle (AR)</Label><Textarea rows={2} value={hero.subtitle_ar} onChange={(e) => setHero({ ...hero, subtitle_ar: e.target.value })} dir="rtl" /></div>
        </div>
        <div className="mt-6">
          <Label>Banner image</Label>
          <div className="mt-2 flex items-start gap-4">
            <div className="relative h-28 w-44 overflow-hidden rounded-lg border border-border bg-secondary">
              {hero.image_url ? (
                <>
                  <img src={hero.image_url} alt="Hero banner" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setHero({ ...hero, image_url: null })}
                    className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                    aria-label="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </>
              ) : (
                <div className="grid h-full place-items-center text-xs text-muted-foreground">Default image</div>
              )}
            </div>
            <div className="flex-1">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-secondary">
                <ImageUp className="h-4 w-4" />
                {uploading ? "Uploading…" : "Upload new banner"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) onHeroImage(f); e.currentTarget.value = ""; }}
                />
              </label>
              <p className="mt-2 text-xs text-muted-foreground">Recommended: wide landscape image (1920×1080 or larger).</p>
            </div>
          </div>
        </div>
        <Button className="mt-4" onClick={saveHero}>Save hero</Button>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Shareholders notice banner</h2>
          <div className="flex items-center gap-2"><Label htmlFor="notice-enabled">Visible</Label><Switch id="notice-enabled" checked={notice.enabled} onCheckedChange={(v) => setNotice({ ...notice, enabled: v })} /></div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div><Label>Eyebrow (EN)</Label><Input value={notice.eyebrow_en} onChange={(e) => setNotice({ ...notice, eyebrow_en: e.target.value })} /></div>
          <div><Label>Eyebrow (AR)</Label><Input value={notice.eyebrow_ar} onChange={(e) => setNotice({ ...notice, eyebrow_ar: e.target.value })} dir="rtl" /></div>
          <div><Label>Title (EN)</Label><Input value={notice.title_en} onChange={(e) => setNotice({ ...notice, title_en: e.target.value })} /></div>
          <div><Label>Title (AR)</Label><Input value={notice.title_ar} onChange={(e) => setNotice({ ...notice, title_ar: e.target.value })} dir="rtl" /></div>
          <div className="col-span-2"><Label>Linked article slug</Label><Input value={notice.link_slug} onChange={(e) => setNotice({ ...notice, link_slug: e.target.value })} placeholder="general-assembly-53-invitation" /></div>
        </div>
        <Button className="mt-4" onClick={saveNotice}>Save notice</Button>
      </section>
    </div>
  );
}
