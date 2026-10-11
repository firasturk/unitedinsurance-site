import { motion } from "framer-motion";
import { Pic, webpFor } from "@/components/site/Pic";
import { useEffect, useState } from "react";
import { marineHero, heroVideo, heroVideoWebm } from "@/lib/media";
import { ArrowRight, Shield, Heart, Car, Plane, Anchor, Flame } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useLang } from "@/lib/i18n";
import { getSiteContent } from "@/lib/public.functions";


const floaters = [
  { Icon: Shield, x: "8%", y: "20%", d: 0 },
  { Icon: Heart, x: "85%", y: "28%", d: 0.6 },
  { Icon: Car, x: "12%", y: "72%", d: 1.2 },
  { Icon: Plane, x: "80%", y: "70%", d: 0.3 },
  { Icon: Anchor, x: "92%", y: "50%", d: 0.9 },
  { Icon: Flame, x: "4%", y: "48%", d: 1.5 },
];

type HeroContent = { eyebrow_en: string; eyebrow_ar: string; title_en: string; title_ar: string; subtitle_en: string; subtitle_ar: string; image_url?: string | null };

export function Hero({ initial }: { initial?: { json: string | null } }) {
  const { t, lang } = useLang();
  const fetchSC = useServerFn(getSiteContent);
  const { data } = useQuery({ queryKey: ["sc-hero"], queryFn: () => fetchSC({ data: { key: "hero" } }), initialData: initial, staleTime: 300_000 });
  const hero: HeroContent | null = data?.json ? JSON.parse(data.json) : null;
  const eyebrow = hero ? (lang === "ar" ? hero.eyebrow_ar : hero.eyebrow_en) : t("hero.eyebrow");
  const title = hero ? (lang === "ar" ? hero.title_ar : hero.title_en) : t("hero.title");
  const subtitle = hero ? (lang === "ar" ? hero.subtitle_ar : hero.subtitle_en) : t("hero.subtitle");
  const bannerSrc = hero?.image_url || marineHero;
  const [showVideo, setShowVideo] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    const update = () => setShowVideo(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[88svh] text-white">
      {/* The poster renders on the server (fast first paint); the decorative video only
          mounts on larger screens for people who haven't asked for reduced motion. */}
      <Pic
        src={bannerSrc}
        alt=""
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {showVideo && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          poster={webpFor(bannerSrc) ?? bannerSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src={heroVideoWebm} type="video/webm" />
          <source src={heroVideo} type="video/mp4" />
        </video>
      )}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.14_0.04_260_/_0.18)_0%,oklch(0.16_0.05_260_/_0.32)_45%,oklch(0.14_0.04_260_/_0.62)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,oklch(0.72_0.12_240_/_0.32),transparent_42%)]" />

      <div className="absolute inset-0 pointer-events-none opacity-[0.08]" style={{
        backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
        backgroundSize: "72px 72px",
      }} />

      {floaters.map(({ Icon, x, y, d }, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.38, scale: 1 }}
          transition={{ delay: 0.4 + d, duration: 1 }}
          className="absolute hidden xl:block"
          style={{ left: x, top: y }}
        >
          <motion.div
            animate={{ y: [0, -18, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 8 + d * 2, repeat: Infinity, ease: "easeInOut", delay: d }}
            className="glass rounded-2xl p-3.5 text-white/85"
          >
            <Icon className="h-5 w-5" />
          </motion.div>
        </motion.div>
      ))}

      <div className="relative mx-auto grid min-h-[88svh] max-w-7xl items-end gap-10 px-6 pb-16 pt-28 md:items-center md:grid-cols-[minmax(0,1.15fr)_360px] md:pb-20 md:pt-32">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium tracking-wide"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            {eyebrow}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-6 max-w-3xl text-balance text-4xl font-bold leading-[1.02] sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-5 max-w-2xl text-balance text-base leading-relaxed text-white/80 sm:text-lg"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/contact"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[var(--navy-deep)] shadow-elevated transition-all hover:-translate-y-0.5 hover:shadow-glow"
            >
              {t("hero.cta1")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
            <Link
              to="/insurance"
              className="inline-flex h-12 items-center gap-2 rounded-full glass px-6 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              {t("hero.cta2")}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="mt-12 grid max-w-2xl grid-cols-2 gap-3 sm:gap-6"
          >
            {[
              [t("hero.stat1"), t("hero.stat1l")],
              [t("hero.stat2"), t("hero.stat2l")],
            ].map(([v, l]) => (
              <div key={l} className="glass rounded-2xl px-3 py-4">
                <div className="text-lg font-bold tracking-tight sm:text-2xl">{v}</div>
                <div className="mt-0.5 text-[11px] text-white/72 sm:text-xs">{l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 24, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="hidden md:block"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-br from-white/10 to-white/[0.03] shadow-elevated backdrop-blur-md">
            <div className="relative aspect-[3/4] p-6">
              {/* Animated orbital rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full border border-white/15"
                    style={{ width: `${55 + i * 18}%`, height: `${55 + i * 18}%` }}
                    animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                    transition={{ duration: 26 + i * 10, repeat: Infinity, ease: "linear" }}
                  >
                    <span
                      className="absolute h-2 w-2 rounded-full bg-gold shadow-[0_0_18px_4px_oklch(0.82_0.15_85_/_0.55)]"
                      style={{ top: -4, left: "50%" }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Pulsing center shield */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute h-40 w-40 rounded-full bg-[radial-gradient(circle,oklch(0.72_0.12_240_/_0.55),transparent_70%)]"
                />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.6 }}
                  className="relative grid h-24 w-24 place-items-center rounded-3xl bg-white/10 backdrop-blur-xl border border-white/25 shadow-elevated"
                >
                  <Shield className="h-11 w-11 text-white" strokeWidth={1.5} />
                </motion.div>
              </div>

              {/* Floating mini icons */}
              {[
                { Icon: Heart, angle: 0 },
                { Icon: Car, angle: 72 },
                { Icon: Plane, angle: 144 },
                { Icon: Anchor, angle: 216 },
                { Icon: Flame, angle: 288 },
              ].map(({ Icon, angle }, i) => {
                const rad = (angle * Math.PI) / 180;
                const r = 38;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
                    transition={{
                      opacity: { duration: 0.6, delay: 0.8 + i * 0.1 },
                      scale: { duration: 0.6, delay: 0.8 + i * 0.1 },
                      y: { duration: 4 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 },
                    }}
                    className="absolute"
                    style={{
                      left: `calc(50% + ${Math.sin(rad) * r}% - 22px)`,
                      top: `calc(50% - ${Math.cos(rad) * r}% - 22px)`,
                    }}
                  >
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/12 backdrop-blur-md border border-white/20 text-white/90">
                      <Icon className="h-5 w-5" />
                    </div>
                  </motion.div>
                );
              })}

              <div className="absolute inset-x-0 bottom-0 p-6 text-center">
                <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">United Insurance</div>
                <div className="mt-2 text-lg font-semibold text-white">{t("hero.eyebrow")}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <svg className="block w-full text-background" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden>
        <path fill="currentColor" d="M0,32 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" />
      </svg>
    </section>
  );
}
