import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { BannerArt, type BannerArtVariant } from "./BannerArt";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  art,
  children,
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  art?: BannerArtVariant;
  children?: ReactNode;
}) {
  return (
    <section className="relative gradient-hero text-white overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute -top-32 start-1/3 w-[800px] h-[800px] rounded-full blur-3xl"
             style={{ background: "radial-gradient(circle, oklch(0.65 0.2 270 / 0.6), transparent 60%)" }} />
      </div>
      {art && <BannerArt variant={art} />}
      <div className={`relative mx-auto max-w-7xl px-6 pt-24 pb-20 ${art ? "sm:pe-[34%] lg:pe-[32%]" : ""}`}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
          {eyebrow && <div className="text-xs font-semibold tracking-widest uppercase text-white/70">{eyebrow}</div>}
          {title && <h1 className="mt-3 text-4xl sm:text-5xl md:text-6xl font-bold text-balance text-start leading-tight">{title}</h1>}
          {subtitle && <p className={`text-lg text-white/75 max-w-2xl ${title ? "mt-5" : "mt-3"}`}>{subtitle}</p>}
          {children}
        </motion.div>
      </div>
    </section>
  );
}
