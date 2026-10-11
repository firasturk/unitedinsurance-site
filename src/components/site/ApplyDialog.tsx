import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, UploadCloud, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLang } from "@/lib/i18n";
import { submitJobApplication } from "@/lib/public.functions";

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function ApplyDialog({
  vacancySlug,
  vacancyTitle,
  trigger,
}: {
  vacancySlug?: string | null;
  vacancyTitle?: string;
  trigger: React.ReactNode;
}) {
  const { lang } = useLang();
  const L = (en: string, ar: string) => (lang === "ar" ? ar : en);
  const submit = useServerFn(submitJobApplication);

  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", cover_note: "" });
  const [file, setFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return toast.error(L("Please attach your CV", "الرجاء إرفاق سيرتك الذاتية"));
    if (file.size > 5 * 1024 * 1024) return toast.error(L("CV must be under 5MB", "يجب أن يكون حجم الملف أقل من 5 ميجابايت"));
    setBusy(true);
    try {
      const cv_base64 = await toBase64(file);
      await submit({
        data: {
          vacancy_slug: vacancySlug ?? null,
          ...form,
          cv_name: file.name,
          cv_type: file.type,
          cv_base64,
        },
      });
      setDone(true);
      setForm({ full_name: "", email: "", phone: "", cover_note: "" });
      setFile(null);
    } catch (err: any) {
      toast.error(err?.message ?? L("Submission failed", "تعذّر إرسال الطلب"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setDone(false);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        {done ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="h-12 w-12 mx-auto text-[var(--royal)]" />
            <h3 className="mt-4 text-xl font-bold">{L("Application received", "تم استلام طلبك")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {L(
                "Thank you. Our HR team will review your profile and contact you if there is a match.",
                "شكراً لك. سيقوم فريق الموارد البشرية بمراجعة ملفك والتواصل معك في حال وجود فرصة مناسبة."
              )}
            </p>
            <Button className="mt-6" onClick={() => setOpen(false)}>{L("Close", "إغلاق")}</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{vacancyTitle ? L("Apply for", "التقديم على") + " " + vacancyTitle : L("Join our talent pool", "انضم إلى قاعدة المواهب")}</DialogTitle>
              <DialogDescription>
                {L("Fill in your details and upload your CV (PDF or Word, max 5MB).", "املأ بياناتك وأرفق سيرتك الذاتية (PDF أو Word، بحد أقصى 5 ميجابايت).")}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>{L("Full name", "الاسم الكامل")}</Label>
                  <Input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>{L("Email", "البريد الإلكتروني")}</Label>
                  <Input type="email" required dir="ltr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>{L("Phone", "رقم الهاتف")}</Label>
                <Input dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>{L("Cover note (optional)", "نبذة تعريفية (اختياري)")}</Label>
                <Textarea rows={4} value={form.cover_note} onChange={(e) => setForm({ ...form, cover_note: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>{L("CV / Resume", "السيرة الذاتية")}</Label>
                <label className="flex items-center gap-3 rounded-xl border border-dashed border-border px-4 py-4 cursor-pointer hover:border-[var(--royal)]/50 transition">
                  <UploadCloud className="h-5 w-5 text-[var(--royal)]" />
                  <span className="text-sm text-muted-foreground truncate">
                    {file ? file.name : L("Choose a PDF or Word file", "اختر ملف PDF أو Word")}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
              <Button type="submit" disabled={busy} className="w-full h-11 rounded-full">
                {busy && <Loader2 className="h-4 w-4 me-2 animate-spin" />}
                {L("Submit application", "إرسال الطلب")}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
