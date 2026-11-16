import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileSpreadsheet, ExternalLink, RotateCcw, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  listMedicalNetworkUploads,
  currentMedicalNetworkKeys,
  publishMedicalNetwork,
  restoreMedicalNetwork,
} from "@/lib/admin.functions";
import { buildNetwork, NetworkFileError, type NetworkData, type NetworkStats } from "@/lib/medical-network";

export const Route = createFileRoute("/_authenticated/admin/medical-network")({
  component: MedicalNetworkAdmin,
});

const GROUP_LABEL: Record<string, string> = {
  doctor: "Doctors", hospital: "Hospitals", emergency: "Emergency", lab: "Labs", radiology: "Radiology",
  physio: "Physiotherapy", optical: "Optical & hearing", center: "Medical centers", supplier: "Medical supplies", pharmacy: "Pharmacies",
};

type Parsed = { data: NetworkData; stats: NetworkStats; fileName: string; added: number; removed: number };

function thisMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function MedicalNetworkAdmin() {
  const qc = useQueryClient();
  const list = useServerFn(listMedicalNetworkUploads);
  const keys = useServerFn(currentMedicalNetworkKeys);
  const publish = useServerFn(publishMedicalNetwork);
  const restore = useServerFn(restoreMedicalNetwork);
  const { data: uploads = [], isLoading } = useQuery({ queryKey: ["adm-network"], queryFn: () => list() });

  const [period, setPeriod] = useState(thisMonth());
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState<Parsed | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setParsed(null);
    setError(null);
    if (!/\.xlsx$/i.test(file.name)) {
      setError("Please choose the Excel file (.xlsx) sent by NatHealth.");
      return;
    }
    // "Network_11.2026.xlsx" → month 2026-11
    const m = file.name.match(/(\d{1,2})[._-](20\d{2})/);
    const p = m ? `${m[2]}-${m[1].padStart(2, "0")}` : period;
    if (m) setPeriod(p);
    setParsing(true);
    try {
      const { default: readXlsxFile } = await import("read-excel-file");
      let rows: unknown[][];
      try {
        rows = (await readXlsxFile(file, { sheet: "All" })) as unknown[][];
      } catch {
        throw new NetworkFileError('The workbook has no sheet named "All".');
      }
      const { data, stats } = buildNetwork(rows, p);
      const prev = new Set(await keys());
      const next = new Set(data.rows.map((r) => r[11]));
      let added = 0, removed = 0;
      next.forEach((k) => { if (!prev.has(k)) added++; });
      prev.forEach((k) => { if (!next.has(k)) removed++; });
      setParsed({ data, stats, fileName: file.name, added: prev.size ? added : data.rows.length, removed });
    } catch (err: any) {
      setError(err instanceof NetworkFileError ? err.message : `Could not read the file: ${err?.message ?? err}`);
    } finally {
      setParsing(false);
    }
  }

  async function onPublish() {
    if (!parsed) return;
    setPublishing(true);
    try {
      await publish({ data: { period, fileName: parsed.fileName, data: { ...parsed.data, updated: period }, stats: parsed.stats as any } });
      toast.success("Published — the medical network page shows the new list within 5 minutes.");
      setParsed(null);
      qc.invalidateQueries({ queryKey: ["adm-network"] });
    } catch (err: any) {
      toast.error(`Publish failed: ${err?.message ?? err}`, { duration: 9000 });
    } finally {
      setPublishing(false);
    }
  }

  async function onRestore(id: string, label: string) {
    try {
      await restore({ data: { id } });
      toast.success(`${label} is live again.`);
      qc.invalidateQueries({ queryKey: ["adm-network"] });
    } catch (err: any) {
      toast.error(err?.message ?? "Restore failed");
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Medical Network</h1>
          <p className="text-sm text-muted-foreground mt-1">Upload the monthly NatHealth workbook. Nothing changes on the site until you press Publish.</p>
        </div>
        <a href="/medical-network" target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--royal)] hover:underline">
          View page <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <section className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <Label htmlFor="mn-period">Month</Label>
            <Input id="mn-period" type="month" value={period} onChange={(e) => setPeriod(e.target.value)} className="mt-1 w-44" />
          </div>
          <label className="inline-flex items-center gap-2 cursor-pointer text-sm border border-border rounded-md px-4 py-2 hover:bg-secondary">
            <FileSpreadsheet className="h-4 w-4" />
            {parsing ? "Reading…" : "Choose Excel file"}
            <input type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" className="hidden" onChange={onFile} disabled={parsing} />
          </label>
        </div>
        <p className="text-xs text-muted-foreground">The file must have a sheet named <b>All</b> with the usual NatHealth columns (HCP_ID, HCP_NAME, CITY, HCP_TYPES, HCP_SPEC, WORK_PHONE_1…). Only active providers and their public details are published.</p>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 text-sm p-3">{error}</div>}

        {parsed && (
          <div className="rounded-xl border border-border bg-background p-4 space-y-4">
            <div className="flex flex-wrap gap-3">
              <Stat label="Providers" value={parsed.stats.total} />
              <Stat label="New this month" value={parsed.added} tone="good" />
              <Stat label="Removed" value={parsed.removed} tone={parsed.removed ? "warn" : undefined} />
              <Stat label="Pharmacies" value={parsed.stats.pharmacies} />
              <Stat label="Without phone" value={parsed.stats.noPhone} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold mb-1">By type</div>
                {Object.entries(parsed.stats.byGroup).sort((a, b) => b[1] - a[1]).map(([g, n]) => (
                  <div key={g} className="flex justify-between border-b border-border/60 py-1"><span>{GROUP_LABEL[g] ?? g}</span><span className="tabular-nums">{n.toLocaleString()}</span></div>
                ))}
              </div>
              <div>
                <div className="font-semibold mb-1">By governorate</div>
                {Object.entries(parsed.stats.byCity).sort((a, b) => b[1] - a[1]).map(([c, n]) => (
                  <div key={c} className="flex justify-between border-b border-border/60 py-1"><span>{c}</span><span className="tabular-nums">{n.toLocaleString()}</span></div>
                ))}
              </div>
            </div>
            {parsed.removed > parsed.stats.total * 0.2 && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-sm p-3">
                This file removes {parsed.removed.toLocaleString()} providers compared with the live list. Check it is the full network (sheet "All") before publishing.
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={onPublish} disabled={publishing}><Upload className="h-4 w-4 me-1.5" />{publishing ? "Publishing…" : `Publish ${period}`}</Button>
              <Button variant="outline" onClick={() => setParsed(null)} disabled={publishing}>Cancel</Button>
            </div>
          </div>
        )}
      </section>

      <section>
        <h2 className="font-semibold mb-3">History</h2>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : uploads.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing uploaded yet — the page is showing the November 2026 list that shipped with the site.</p>
        ) : (
          <div className="rounded-2xl border border-border overflow-hidden">
            {uploads.map((u: any, i: number) => (
              <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-border last:border-b-0 bg-card">
                <div className="min-w-0">
                  <div className="font-medium">{u.period} {i === 0 && <span className="ms-2 text-xs rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5">Live</span>}</div>
                  <div className="text-xs text-muted-foreground truncate">{(u.stats?.total ?? 0).toLocaleString()} providers · {u.file_name ?? "—"} · {new Date(u.created_at).toLocaleString()}</div>
                </div>
                {i > 0 && (
                  <Button variant="outline" size="sm" onClick={() => onRestore(u.id, u.period)}><RotateCcw className="h-4 w-4 me-1.5" />Make live</Button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "good" | "warn" }) {
  const c = tone === "good" ? "text-emerald-700" : tone === "warn" ? "text-amber-700" : "text-foreground";
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-2 min-w-28">
      <div className={`text-xl font-bold tabular-nums ${c}`}>{value.toLocaleString()}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
