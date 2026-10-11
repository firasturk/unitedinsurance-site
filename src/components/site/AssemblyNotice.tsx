import { Link } from "@tanstack/react-router";
import { Megaphone, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useLang } from "@/lib/i18n";
import { getSiteContent } from "@/lib/public.functions";

type Notice = { enabled: boolean; eyebrow_en: string; eyebrow_ar: string; title_en: string; title_ar: string; link_slug: string };

export function AssemblyNotice({ initial }: { initial?: { json: string | null } }) {
  const { lang } = useLang();
  const fetch = useServerFn(getSiteContent);
  const { data } = useQuery({ queryKey: ["sc-notice"], queryFn: () => fetch({ data: { key: "assembly_notice" } }), initialData: initial, staleTime: 300_000 });
  const notice: Notice | null = data?.json ? JSON.parse(data.json) : null;
  if (!notice || !notice.enabled) return null;

  return (
    <section className="px-6 pt-8">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/news/$slug"
          params={{ slug: notice.link_slug }}
          className="group flex items-center justify-between gap-6 rounded-2xl border border-[var(--royal)]/20 bg-gradient-to-r from-[var(--royal)]/10 via-[var(--royal)]/5 to-transparent px-5 py-4 hover:border-[var(--royal)]/40 transition"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--royal)] text-white">
              <Megaphone className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--royal)]">
                {lang === "ar" ? notice.eyebrow_ar : notice.eyebrow_en}
              </div>
              <div className="mt-0.5 text-sm sm:text-base font-semibold text-foreground truncate">
                {lang === "ar" ? notice.title_ar : notice.title_en}
              </div>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--royal)] shrink-0">
            {lang === "ar" ? "عرض التفاصيل" : "View details"}
            <ArrowRight className="h-4 w-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition" />
          </span>
        </Link>
      </div>
    </section>
  );
}
