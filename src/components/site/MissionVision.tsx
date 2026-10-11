import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";
import { useLang } from "@/lib/i18n";

export function MissionVision() {
  const { t } = useLang();
  const cards = [
    { Icon: Target, t: "about.mission.t" as const, d: "about.mission.d" as const },
    { Icon: Eye, t: "about.vision.t" as const, d: "about.vision.d" as const },
  ];

  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-balance sm:text-4xl">{t("about.mv.title")}</h2>
        </motion.div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {cards.map((c, i) => (
            <motion.div
              key={c.t}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-soft"
            >
              <div className="absolute -top-16 -end-16 h-48 w-48 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.48_0.18_264_/_0.14),transparent_70%)] blur-2xl" />
              <div className="gradient-royal grid h-12 w-12 place-items-center rounded-2xl text-white shadow-soft">
                <c.Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-2xl font-bold">{t(c.t)}</h3>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">{t(c.d)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
