import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { LangProvider } from "../lib/i18n";
import { langFromPathname, type Lang } from "../lib/locale";
import { pageHead, organizationJsonLd, SITE_NAME } from "../lib/seo";
import { SiteLayout } from "../components/site/Layout";

function NotFoundComponent() {
  const { lang } = Route.useRouteContext();
  const ar = lang === "ar";
  // The root head() already emits the site title; a second <title> would be invalid, so set it on mount.
  useEffect(() => {
    document.title = ar ? "الصفحة غير موجودة — الشركة المتحدة للتأمين" : "Page not found — United Insurance";
  }, [ar]);
  return (
    <SiteLayout>
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 py-24 text-center">
        <div className="text-7xl font-bold text-[var(--royal)]">404</div>
        <h1 className="mt-4 text-2xl font-bold text-foreground">{ar ? "الصفحة غير موجودة" : "Page not found"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {ar
            ? "الصفحة التي تبحث عنها غير موجودة أو تم نقلها."
            : "The page you're looking for doesn't exist or has been moved."}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="inline-flex items-center h-11 px-6 rounded-full gradient-royal text-white text-sm font-semibold shadow-soft">
            {ar ? "العودة للرئيسية" : "Go to homepage"}
          </Link>
          <Link to="/contact" className="inline-flex items-center h-11 px-6 rounded-full border border-border text-sm font-semibold hover:bg-secondary/60 transition">
            {ar ? "اتصل بنا" : "Contact us"}
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const DESCRIPTION = {
  en: "United Insurance Company PLC — trusted in Jordan since 1972. Motor, medical, life, travel, marine, fire and engineering insurance, backed by leading global reinsurers.",
  ar: "الشركة المتحدة للتأمين م.ع.م — ثقة في الأردن منذ 1972. تأمين المركبات والطبي والحياة والسفر والبحري والحريق والهندسي، بدعم من كبرى شركات إعادة التأمين العالمية.",
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient; lang: Lang }>()({
  // The language is read from the public URL ("/en/…" → English); the router has already
  // stripped the prefix for route matching. Available to every route as context.lang.
  beforeLoad: ({ location }): { lang: Lang } => ({
    lang: langFromPathname((location as { publicHref?: string }).publicHref ?? location.pathname),
  }),
  head: ({ match }) => {
    const lang = match.context.lang;
    const page = pageHead({
      lang,
      path: "/",
      title: { en: "United Insurance — A Safe Future Starts Today", ar: "الشركة المتحدة للتأمين — مستقبل آمن يبدأ اليوم" },
      description: DESCRIPTION,
      jsonLd: [organizationJsonLd(lang)],
    });
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#0b2a5b" },
        { name: "application-name", content: SITE_NAME[lang] },
        ...page.meta,
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "icon", type: "image/png", href: "/media/favicon.png" },
        { rel: "apple-touch-icon", href: "/media/favicon.png" },
        // canonical + hreflang are emitted by each page (links are not de-duplicated across routes)
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const { lang } = Route.useRouteContext();
  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient, lang } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LangProvider lang={lang}>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </LangProvider>
    </QueryClientProvider>
  );
}
