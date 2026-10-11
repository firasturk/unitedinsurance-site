import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { useLang } from "@/lib/i18n";
import { getArticleBySlug, listLatestArticles } from "@/lib/public.functions";
import { pageHead } from "@/lib/seo";
import { SITE_URL, absoluteUrl } from "@/lib/locale";

// Social previews need a full address, so a site-relative image path is expanded
// to the address the page was served from.
function absolutize(url: string, origin: string) {
  if (/^https?:/i.test(url)) return url;
  if (!origin) return url;
  return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
}

export const Route = createFileRoute("/news/$slug")({
  loader: async (ctx) => {
    const [article, latest] = await Promise.all([
      getArticleBySlug({ data: { slug: ctx.params.slug } }),
      listLatestArticles({ data: { limit: 3 } }),
    ]);
    if (!article) throw notFound();
    return { article, related: latest.filter((a) => a.slug !== article.slug).slice(0, 2) };
  },
  head: ({ match, loaderData }) => {
    const a = loaderData?.article;
    const lang = match.context.lang;
    if (!a) return pageHead({ lang, path: `/news/${match.params.slug}`, title: { en: "Article", ar: "مقال" }, description: "", noindex: true });
    const title = lang === "ar" ? a.title_ar : a.title_en;
    const excerpt = lang === "ar" ? a.excerpt_ar : a.excerpt_en;
    return pageHead({
      lang,
      path: `/news/${a.slug}`,
      title: { en: a.title_en, ar: a.title_ar },
      description: { en: a.excerpt_en, ar: a.excerpt_ar },
      image: a.cover_url,
      type: "article",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: title,
          description: excerpt,
          datePublished: a.date,
          inLanguage: lang,
          ...(a.cover_url ? { image: [absolutize(a.cover_url, SITE_URL)] } : {}),
          author: { "@type": "Organization", name: "United Insurance Company PLC" },
          publisher: { "@type": "Organization", name: "United Insurance Company PLC", logo: { "@type": "ImageObject", url: `${SITE_URL}/media/united-logo.png` } },
          mainEntityOfPage: absoluteUrl(`/news/${a.slug}`, lang),
        },
      ],
    });
  },
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="text-3xl font-bold">Article not found</h1>
        <p className="mt-3 text-muted-foreground">The article you're looking for doesn't exist or has been moved.</p>
        <Link to="/news" className="mt-6 inline-flex items-center gap-2 text-[var(--royal)] font-semibold">← Back to news</Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="text-3xl font-bold">Couldn't load article</h1>
        <Link to="/news" className="mt-6 inline-flex items-center gap-2 text-[var(--royal)] font-semibold">← Back to news</Link>
      </div>
    </SiteLayout>
  ),
  component: ArticlePage,
});

function formatDate(iso: string, lang: "en" | "ar") {
  return new Date(iso).toLocaleDateString(lang === "ar" ? "ar-JO" : "en-US", { year: "numeric", month: "long", day: "numeric" });
}

function ArticlePage() {
  const { article, related } = Route.useLoaderData();
  const { lang, t } = useLang();

  const title = lang === "ar" ? article.title_ar : article.title_en;
  const excerpt = lang === "ar" ? article.excerpt_ar : article.excerpt_en;
  const body = lang === "ar" ? article.body_ar : article.body_en;

  return (
    <SiteLayout>
      <section className="relative overflow-hidden text-white gradient-hero">
        <div className="relative mx-auto max-w-4xl px-6 pt-36 pb-20">
          <Link to="/news" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />{t("news.back")}
          </Link>
          <div className="mt-6 inline-flex items-center px-3 py-1 rounded-full glass text-white text-[11px] font-semibold tracking-wide">{article.category}</div>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mt-5 text-3xl sm:text-4xl md:text-5xl font-bold text-balance leading-tight">{title}</motion.h1>
          <div className="mt-4 text-sm text-white/72">{t("news.published")} {formatDate(article.date, lang)}</div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-lg leading-relaxed text-muted-foreground border-l-4 rtl:border-l-0 rtl:border-r-4 border-[var(--royal)] pl-5 rtl:pl-0 rtl:pr-5">{excerpt}</p>
          <div className="mt-10 space-y-6">
            {body.map((p: string, i: number) => <p key={i} className="text-base leading-[1.85] text-foreground">{p}</p>)}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-20 bg-secondary/50 border-t border-border">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-2xl sm:text-3xl font-bold">{t("news.related")}</h2>
            <div className="mt-8 grid md:grid-cols-2 gap-5">
              {related.map((a) => (
                <Link key={a.slug} to="/news/$slug" params={{ slug: a.slug }} className="group block rounded-3xl overflow-hidden bg-card border border-border shadow-soft hover:shadow-elevated transition-all hover:-translate-y-1">
                  <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
                    {a.cover_url && <img src={a.cover_url} alt={lang === "ar" ? a.title_ar : a.title_en} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />}
                    <div className="absolute inset-0 bg-navy-deep/80" />
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-muted-foreground">{formatDate(a.date, lang)}</div>
                    <h3 className="mt-2 text-lg font-semibold leading-snug">{lang === "ar" ? a.title_ar : a.title_en}</h3>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link to="/news" className="inline-flex items-center gap-2 text-[var(--royal)] font-semibold hover:underline">{t("news.all")} →</Link>
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
