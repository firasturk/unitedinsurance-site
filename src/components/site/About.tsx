import { motion } from "framer-motion";
import { Pic } from "@/components/site/Pic";
import { futureTower } from "@/lib/media";
import { ShieldCheck, Globe2, Users } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useCountUp } from "@/hooks/useCountUp";

// showTitle=false on the About page, where the page hero already carries the title.
export function About({ showTitle = true }: { showTitle?: boolean }) {
  const { t, lang } = useLang();
  const { count: yearsCount, ref: yearsRef } = useCountUp(54, 2000);
  const pts = [
    { Icon: ShieldCheck, t: "about.p1" as const, d: "about.p1d" as const },
    { Icon: Globe2, t: "about.p2" as const, d: "about.p2d" as const },
    { Icon: Users, t: "about.p3" as const, d: "about.p3d" as const },
  ];

  return (
    <section className="relative bg-secondary/50 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {showTitle && (
            <>
              <div className="text-xs font-semibold uppercase tracking-widest text-[var(--royal)]">{t("about.eyebrow")}</div>
              <h2 className="mt-3 text-3xl font-bold text-balance sm:text-4xl md:text-5xl">{t("about.title")}</h2>
            </>
          )}
          <p className={`${showTitle ? "mt-5" : ""} max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg`}>{t("about.body")}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {pts.map((p) => (
              <div key={p.t} className="rounded-2xl border border-border bg-card p-5">
                <div className="gradient-royal grid h-10 w-10 place-items-center rounded-xl text-white">
                  <p.Icon className="h-5 w-5" />
                </div>
                <div className="mt-3 text-sm font-semibold">{t(p.t)}</div>
                <div className="mt-1 text-xs text-muted-foreground">{t(p.d)}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(circle_at_center,oklch(0.48_0.18_264_/_0.18),transparent_68%)] blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-elevated">
            <div className="relative aspect-[4/5]">
              <Pic
                src={futureTower}
                alt="Future-focused landmark symbolizing long-term stability"
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_5%,oklch(0.17_0.05_260_/_0.9)_100%)]" />
              <div className="absolute right-8 top-8 grid h-16 w-16 place-items-center rounded-2xl glass rtl:right-auto rtl:left-8">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white text-center">
                <div ref={yearsRef} className="text-[12rem] font-bold leading-none">{yearsCount}</div>
                <div className="mt-1 text-sm text-white/72">{lang === "ar" ? "عاماً من الخبرة" : "Years of experience"}</div>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-8 text-white text-center">
                <div className="h-px bg-white/20" />
                <div className="mt-6">
                  <div>
                  <div className="text-2xl font-bold">+ 100,000</div>
                  <div className="mt-1 text-xs text-white/72">{t("hero.stat2l")}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
