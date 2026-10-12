import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listApplications, updateApplicationStatus, deleteApplication, getCvUrl } from "@/lib/admin.functions";
import { Download, Trash2, Mail, Phone, Eye, X, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/applications")({
  component: ApplicationsAdmin,
});

const STATUSES = ["new", "reviewing", "shortlisted", "rejected", "hired"] as const;
type Status = (typeof STATUSES)[number];

// One colour per stage: blue → amber → violet → red / green.
const STATUS_STYLE: Record<Status, string> = {
  new: "bg-sky-50 text-sky-800 border-sky-300",
  reviewing: "bg-amber-50 text-amber-800 border-amber-300",
  shortlisted: "bg-violet-50 text-violet-800 border-violet-300",
  rejected: "bg-red-50 text-red-700 border-red-400",
  hired: "bg-emerald-50 text-emerald-800 border-emerald-300",
};
const DOT: Record<Status, string> = {
  new: "bg-sky-500",
  reviewing: "bg-amber-500",
  shortlisted: "bg-violet-500",
  rejected: "bg-red-500",
  hired: "bg-emerald-500",
};

type AppRow = {
  id: string;
  vacancy_title: string;
  full_name: string;
  email: string;
  phone: string;
  cover_note: string;
  cv_path: string | null;
  status: Status;
  created_at: string;
};

function StatusSelect({ value, onChange, className = "" }: { value: Status; onChange: (s: Status) => void; className?: string }) {
  return (
    <select
      className={`h-9 rounded-lg border px-2.5 text-sm font-medium capitalize outline-none focus:ring-2 focus:ring-[var(--royal)]/30 ${STATUS_STYLE[value] ?? ""} ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value as Status)}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}

function ApplicationsAdmin() {
  const qc = useQueryClient();
  const list = useServerFn(listApplications);
  const setStatus = useServerFn(updateApplicationStatus);
  const del = useServerFn(deleteApplication);
  const signCv = useServerFn(getCvUrl);

  const { data = [], isLoading } = useQuery({ queryKey: ["admin-applications"], queryFn: () => list() });
  const all = data as AppRow[];
  const [q, setQ] = useState("");
  const [vacancy, setVacancy] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [previewId, setPreviewId] = useState<string | null>(null);

  // Vacancy chips come from the applications themselves, so a closed vacancy with candidates still shows.
  const vacancies = useMemo(() => {
    const m = new Map<string, number>();
    for (const a of all) m.set(a.vacancy_title, (m.get(a.vacancy_title) ?? 0) + 1);
    return [...m.entries()].sort((x, y) => y[1] - x[1]);
  }, [all]);

  const rows = all.filter(
    (a) =>
      (vacancy === "all" || a.vacancy_title === vacancy) &&
      (statusFilter === "all" || a.status === statusFilter) &&
      `${a.full_name} ${a.email} ${a.vacancy_title}`.toLowerCase().includes(q.toLowerCase()),
  );

  async function downloadCv(path: string) {
    try {
      const { url } = await signCv({ data: { path } });
      window.open(url, "_blank", "noopener");
    } catch (err: any) {
      toast.error(err?.message ?? "Could not open CV");
    }
  }

  async function changeStatus(id: string, status: Status) {
    // optimistic: colour changes at once, server confirms
    qc.setQueryData(["admin-applications"], (old: AppRow[] | undefined) => old?.map((a) => (a.id === id ? { ...a, status } : a)));
    try {
      await setStatus({ data: { id, status } });
    } catch (err: any) {
      toast.error(err?.message ?? "Could not update");
    }
    qc.invalidateQueries({ queryKey: ["admin-applications"] });
  }

  async function remove(id: string) {
    if (!confirm("Delete this application?")) return;
    await del({ data: { id } });
    qc.invalidateQueries({ queryKey: ["admin-applications"] });
    toast.success("Deleted");
    if (previewId === id) setPreviewId(null);
  }

  // stable identity so the preview doesn't re-sign (and reload the PDF) on every re-render
  const signInline = useCallback((path: string) => signCv({ data: { path, inline: true } }).then((r) => r.url), [signCv]);

  const previewIndex = rows.findIndex((a) => a.id === previewId);
  const preview = previewIndex >= 0 ? rows[previewIndex] : null;

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Applications</h1>
          <p className="text-muted-foreground mt-1">Candidate applications and talent-pool submissions.</p>
        </div>
        <Input className="max-w-xs" placeholder="Search name, email, role" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {/* Vacancy filter */}
      {vacancies.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <Chip active={vacancy === "all"} onClick={() => setVacancy("all")}>
            All <span className="opacity-60">({all.length})</span>
          </Chip>
          {vacancies.map(([title, n]) => (
            <Chip key={title} active={vacancy === title} onClick={() => setVacancy(title)}>
              {title} <span className="opacity-60">({n})</span>
            </Chip>
          ))}
        </div>
      )}

      {/* Status filter */}
      {all.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`rounded-full px-3 py-1 border transition ${statusFilter === "all" ? "bg-foreground text-background border-foreground" : "border-border hover:bg-secondary"}`}
          >
            Any status
          </button>
          {STATUSES.map((s) => {
            const n = all.filter((a) => a.status === s && (vacancy === "all" || a.vacancy_title === vacancy)).length;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 border capitalize transition ${
                  statusFilter === s ? STATUS_STYLE[s] + " ring-2 ring-offset-1 ring-current/20" : "border-border hover:bg-secondary"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${DOT[s]}`} />
                {s} <span className="opacity-60">({n})</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-6 space-y-3">
        {isLoading && <p className="text-muted-foreground">Loading…</p>}
        {rows.map((a) => (
          <div key={a.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${DOT[a.status] ?? "bg-muted"}`} title={a.status} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{a.full_name}</h3>
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">{a.vacancy_title}</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-4 text-sm text-muted-foreground" dir="ltr">
                  <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{a.email}</span>
                  {a.phone && <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{a.phone}</span>}
                  <span>{new Date(a.created_at).toLocaleDateString("en-GB")}</span>
                </div>
              </div>
              <StatusSelect value={a.status} onChange={(s) => changeStatus(a.id, s)} />
              {a.cv_path && (
                <>
                  <Button variant="default" size="sm" onClick={() => setPreviewId(a.id)}>
                    <Eye className="h-4 w-4 mr-2" />Preview CV
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => downloadCv(a.cv_path!)} title="Download CV">
                    <Download className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => remove(a.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            {a.cover_note && <p className="mt-3 text-sm text-muted-foreground whitespace-pre-line">{a.cover_note}</p>}
          </div>
        ))}
        {!isLoading && rows.length === 0 && (
          <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
            {all.length === 0 ? "No applications yet." : "No applications match these filters."}
          </div>
        )}
      </div>

      {preview && (
        <CvPreview
          app={preview}
          sign={signInline}
          onClose={() => setPreviewId(null)}
          onStatus={(s) => changeStatus(preview.id, s)}
          onDownload={() => preview.cv_path && downloadCv(preview.cv_path)}
          onPrev={previewIndex > 0 ? () => setPreviewId(rows[previewIndex - 1].id) : undefined}
          onNext={previewIndex < rows.length - 1 ? () => setPreviewId(rows[previewIndex + 1].id) : undefined}
          position={`${previewIndex + 1} / ${rows.length}`}
        />
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm border transition ${
        active ? "bg-[var(--royal)] text-white border-[var(--royal)]" : "border-border bg-card hover:bg-secondary"
      }`}
    >
      {children}
    </button>
  );
}

/** Full-screen CV viewer: the PDF on the left, candidate details + status on the right. */
function CvPreview({
  app,
  sign,
  onClose,
  onStatus,
  onDownload,
  onPrev,
  onNext,
  position,
}: {
  app: AppRow;
  sign: (path: string) => Promise<string>;
  onClose: () => void;
  onStatus: (s: Status) => void;
  onDownload: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  position: string;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isPdf = /\.pdf$/i.test(app.cv_path ?? "");

  useEffect(() => {
    let alive = true;
    setUrl(null);
    setError(null);
    if (!app.cv_path) return;
    sign(app.cv_path)
      .then((u) => alive && setUrl(u))
      .catch((e) => alive && setError(e?.message ?? "Could not load the CV"));
    return () => {
      alive = false;
    };
  }, [app.id, app.cv_path, sign]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 md:p-6" onClick={onClose}>
      <div
        className="mx-auto flex h-full max-w-7xl overflow-hidden rounded-2xl bg-card shadow-elevated"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`CV — ${app.full_name}`}
      >
        {/* document */}
        <div className="flex-1 min-w-0 bg-secondary/60 relative">
          {url && isPdf && <iframe title={`CV — ${app.full_name}`} src={`${url}#toolbar=1&view=FitH`} className="absolute inset-0 h-full w-full" />}
          {url && !isPdf && (
            <div className="absolute inset-0 grid place-items-center p-8 text-center">
              <div>
                <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="mt-4 font-medium">This CV is a Word document — the browser can't show it inline.</p>
                <Button className="mt-4" onClick={onDownload}><Download className="h-4 w-4 mr-2" />Download to open</Button>
              </div>
            </div>
          )}
          {!url && !error && <div className="absolute inset-0 grid place-items-center text-muted-foreground">Loading CV…</div>}
          {error && <div className="absolute inset-0 grid place-items-center text-destructive">{error}</div>}
        </div>

        {/* candidate */}
        <aside className="w-80 shrink-0 border-l border-border flex flex-col">
          <div className="p-5 border-b border-border flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{position}</div>
              <h2 className="mt-1 text-lg font-bold leading-tight">{app.full_name}</h2>
              <div className="mt-1 text-sm text-muted-foreground">{app.vacancy_title}</div>
            </div>
            <button type="button" onClick={onClose} className="rounded-full p-1.5 hover:bg-secondary" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-5 space-y-4 text-sm flex-1 overflow-y-auto">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Status</div>
              <StatusSelect value={app.status} onChange={onStatus} className="w-full h-10" />
            </div>
            <div className="space-y-1.5" dir="ltr">
              <a className="flex items-center gap-2 hover:underline" href={`mailto:${app.email}`}><Mail className="h-4 w-4 text-muted-foreground" />{app.email}</a>
              {app.phone && <a className="flex items-center gap-2 hover:underline" href={`tel:${app.phone}`}><Phone className="h-4 w-4 text-muted-foreground" />{app.phone}</a>}
              <div className="text-muted-foreground pl-6">{new Date(app.created_at).toLocaleDateString("en-GB")}</div>
            </div>
            {app.cover_note && (
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Cover note</div>
                <p className="whitespace-pre-line leading-relaxed">{app.cover_note}</p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-border flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onPrev} disabled={!onPrev} aria-label="Previous"><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" onClick={onNext} disabled={!onNext} aria-label="Next"><ChevronRight className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" className="ml-auto" onClick={onDownload}><Download className="h-4 w-4 mr-2" />Download</Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
