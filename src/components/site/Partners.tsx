import { useLang } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listPartners, type PartnerRow } from "@/lib/public.functions";

export function Partners({ initial }: { initial?: PartnerRow[] }) {
  const { t } = useLang();
  const fetchPartners = useServerFn(listPartners);
  const { data } = useQuery({ queryKey: ["partners"], queryFn: () => fetchPartners(), initialData: initial, staleTime: 300_000 });
  const partners = data ?? [];

  if (partners.length === 0) {
    return (
      <section className="py-20 bg-secondary/40 border-y border-border">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="text-xs font-semibold tracking-widest text-[var(--royal)] uppercase">{t("partners.title")}</div>
          <h3 className="mt-2 text-xl sm:text-2xl font-semibold text-muted-foreground">{t("partners.sub")}</h3>
        </div>
      </section>
    );
  }

  const row = [...partners, ...partners];

  return (
    <section className="py-20 bg-secondary/40 border-y border-border overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <div className="text-xs font-semibold tracking-widest text-[var(--royal)] uppercase">{t("partners.title")}</div>
        <h3 className="mt-2 text-xl sm:text-2xl font-semibold text-muted-foreground">{t("partners.sub")}</h3>
      </div>
      <div className="mt-12 relative">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-secondary/80 to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-secondary/80 to-transparent z-10" />
        <div className="flex gap-8 animate-marquee w-max items-center">
          {row.map((p, i) => (
            <div
              key={`${p.id}-${i}`}
              className="shrink-0 h-24 px-8 flex items-center justify-center rounded-2xl bg-card border border-border min-w-[200px]"
            >
              <img
                src={p.logo_url}
                alt={p.name}
                loading="lazy"
                className="max-h-12 max-w-[140px] w-auto object-contain opacity-80 hover:opacity-100 transition"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
