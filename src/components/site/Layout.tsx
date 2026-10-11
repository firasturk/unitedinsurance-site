import type { ReactNode } from "react";
import { TopBar } from "./TopBar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useLang } from "@/lib/i18n";

export function SiteLayout({ children }: { children: ReactNode }) {
  const { lang } = useLang();
  return (
    <div className="min-h-screen overflow-x-clip flex flex-col text-start">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[100] focus:rounded-full focus:bg-[var(--royal)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        {lang === "ar" ? "تخطّي إلى المحتوى" : "Skip to content"}
      </a>
      <TopBar />
      <Header />
      <main id="main" className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
