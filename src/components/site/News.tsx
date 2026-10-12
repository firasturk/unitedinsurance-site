import { motion } from "framer-motion";
import { formatDate } from "@/lib/dates";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Pic } from "./Pic";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useLang } from "@/lib/i18n";
import { listLatestArticles, type ArticleCard } from "@/lib/public.functions";


export function News({ initial, limit = 6 }: { initial?: ArticleCard[]; limit?: number }) {
  const { t, lang } = useLang();
  const fetchArticles = useServerFn(listLatestArticles);
  const { data: articles = [] } = useQuery({
    queryKey: ["pub-articles-latest", limit],
    queryFn: () => fetchArticles({ data: { limit } }),
    initialData: initial,
    staleTime: 300_000,
  });
  const items = articles.slice(0, limit);

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between flex-wrap gap-6">
          <div className="max-w-xl">
            <div className="text-xs font-semibold tracking-widest text-[var(--royal)] uppercase">{t("news.title")}</div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-balance">{t("news.subtitle")}</h2>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-5 auto-rows-fr">
          {items.map((n, i) => (
            <motion.div
              key={n.slug}
              className="h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.08 }}
            >
              <Link
                to="/news/$slug"
                params={{ slug: n.slug }}
                className="group flex h-full flex-col rounded-3xl overflow-hidden bg-card border border-border shadow-soft hover:shadow-elevated transition-all hover:-translate-y-1"
              >
                <div className="card-media relative aspect-[16/10] overflow-hidden bg-secondary">
                  {n.cover_url && (
                    <Pic
                      src={n.cover_url}
                      alt={lang === "ar" ? n.title_ar : n.title_en}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                    />
                  )}
                  {/* 80% → 65% tint; one step lighter (50%) on hover so the photo shows through */}
                  <div className="absolute inset-0 bg-navy-deep/65 transition-colors duration-300 group-hover:bg-navy-deep/50" />
                  <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 inline-flex items-center px-2.5 py-1 rounded-full glass text-white text-[10px] font-semibold tracking-wide">
                    {n.category}
                  </div>
                  <ArrowUpRight className="absolute bottom-4 right-4 rtl:right-auto rtl:left-4 h-10 w-10 p-2.5 rounded-full glass text-white opacity-0 group-hover:opacity-100 transition" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="text-xs text-muted-foreground">{formatDate(n.date, lang, "short")}</div>
                  <h3 className="mt-2 text-lg font-semibold leading-snug line-clamp-2">
                    {lang === "ar" ? n.title_ar : n.title_en}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                    {lang === "ar" ? n.excerpt_ar : n.excerpt_en}
                  </p>
                  <div className="mt-auto pt-4 text-sm font-semibold text-[var(--royal)]">{t("news.read")} →</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
