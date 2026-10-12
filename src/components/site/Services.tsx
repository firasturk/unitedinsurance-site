import { motion } from "framer-motion";
import { Pic } from "@/components/site/Pic";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Car, HeartPulse, Sparkles, Plane, Anchor, Flame, Shield, ShieldCheck, Building, Briefcase, Home, Truck, Users, Globe2, type LucideIcon } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { listInsuranceServices, type InsuranceServiceRow } from "@/lib/public.functions";

const ICONS: Record<string, LucideIcon> = {
  Car, HeartPulse, Sparkles, Plane, Anchor, Flame, Shield, ShieldCheck, Building, Briefcase, Home, Truck, Users, Globe2,
};

export function Services({ initial }: { initial?: InsuranceServiceRow[] }) {
  const { t, lang } = useLang();
  const fetchServices = useServerFn(listInsuranceServices);
  const { data: services = [] } = useQuery({
    queryKey: ["pub-insurance-services"],
    queryFn: () => fetchServices(),
    initialData: initial,
    staleTime: 300_000,
  });

  return (
    <section id="services" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-2xl"
        >
          <h2 className="text-4xl font-bold text-balance sm:text-5xl md:text-6xl text-foreground">{t("svc.title")}</h2>
          <p className="mt-4 max-w-4xl text-balance text-base font-medium leading-relaxed text-[var(--royal)] sm:text-lg md:text-xl">{t("svc.tagline")}</p>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s: InsuranceServiceRow, i: number) => {
            const Icon = ICONS[s.icon] ?? Shield;
            const title = lang === "ar" ? s.title_ar : s.title_en;
            const summary = lang === "ar" ? s.summary_ar : s.summary_en;
            return (
              <motion.article
                key={s.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated focus-within:ring-2 focus-within:ring-[var(--royal)]/40"
              >
                {/* the whole card is the link; the "learn more" line below is just its visual cue */}
                <Link to="/insurance/$type" params={{ type: s.slug }} className="block h-full outline-none" aria-label={title}>
                <div className="card-media relative aspect-[16/11] overflow-hidden bg-secondary">
                  {s.image_url && (
                    <Pic
                      src={s.image_url}
                      alt={title}
                      loading="lazy"
                      className={`h-full w-full object-cover transition duration-500 group-hover:scale-[1.04] ${s.slug === "motor" ? "object-[center_70%]" : s.slug === "medical" ? "object-[center_25%]" : ""}`}
                    />
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_15%,oklch(0.18_0.05_260_/_0.82)_100%)]" />
                  <div className={`absolute left-5 top-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${s.tone} text-white shadow-soft rtl:left-auto rtl:right-5`}>
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                </div>

                <div className="p-7">
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{summary}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--royal)] group-hover:underline">
                    {t("svc.learn")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                  </span>
                </div>
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
