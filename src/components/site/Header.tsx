import { Link } from "@tanstack/react-router";
import { logo } from "@/lib/media";
import { Pic } from "@/components/site/Pic";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { useLang } from "@/lib/i18n";

type NavItem =
  | { k: string; to: string; children?: { k: string; to: string; hash?: string }[] }
  | { k: string; to: string; hash?: string };

const navKeys: NavItem[] = [
  { k: "nav.home", to: "/" },
  {
    k: "nav.about",
    to: "/about",
    children: [
      { k: "nav.about.company", to: "/about" },
      { k: "nav.team.board", to: "/team/board" },
      { k: "nav.team.executive", to: "/team/executive" },
    ],
  },
  { k: "nav.insurance", to: "/insurance" },
  { k: "nav.reports", to: "/reports" },
  {
    k: "nav.governance",
    to: "/governance",
    children: [
      { k: "nav.gov.manual", to: "/governance" },
      { k: "nav.gov.conduct", to: "/governance/code-of-conduct" },
      { k: "nav.whistleblower", to: "/whistleblower" },
    ],
  },
  { k: "nav.news", to: "/news" },
  { k: "nav.complaints", to: "/complaints" },
  { k: "nav.agents", to: "/agents" },
  { k: "nav.careers", to: "/careers" },
  { k: "nav.contact", to: "/contact" },
];

export function Header() {
  const { t, lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile drawer: Escape closes it, focus moves inside while open and returns to the
  // menu button afterwards, and the page behind it stops scrolling.
  const menuButton = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && drawer.current) {
        const focusables = drawer.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => drawer.current?.querySelector<HTMLElement>("button, a")?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      clearTimeout(t);
      menuButton.current?.focus();
    };
  }, [open]);

  return (
    <header className={`sticky top-0 z-50 transition-all ${scrolled ? "glass-light shadow-soft" : "bg-background/60 backdrop-blur"}`}>
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6">
        <Link to="/" className="flex items-center shrink-0" aria-label="United Insurance">
          <Pic src={logo} alt="United Insurance" width={230} height={65} className="h-9 w-auto" />
        </Link>

        <nav className="hidden min-w-0 2xl:flex items-center justify-center gap-0.5 rounded-full px-1.5 py-1 bg-background/50 backdrop-blur-md border border-white/20 shadow-sm">
          {navKeys.map(n =>
            "children" in n && n.children ? (
              <div key={n.to} className="relative group">
              <Link
                  to={n.to}
                  className="inline-flex items-center gap-1 px-2 py-1.5 text-[11px] font-medium text-foreground/80 hover:text-foreground hover:bg-white/30 rounded-full transition-colors whitespace-nowrap 2xl:px-2.5 2xl:text-xs"
                  activeProps={{ className: "inline-flex items-center gap-1 px-2 py-1.5 text-[11px] font-semibold text-[var(--royal)] bg-white/40 rounded-full whitespace-nowrap 2xl:px-2.5 2xl:text-xs" }}
                >
                  {t(n.k)}
                  <ChevronDown className="h-3.5 w-3.5" />
                </Link>
                <div className="absolute top-full start-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition">
                  <div className="min-w-56 rounded-2xl bg-background border border-border shadow-elevated p-2">
                    {n.children.map(c => (
                      <Link
                        key={c.to + (c.hash || "")}
                        to={c.to}
                        hash={c.hash}
                        className="block px-3 py-2 rounded-xl text-sm text-foreground/80 hover:bg-accent hover:text-foreground transition whitespace-nowrap"
                        activeProps={{ className: "block px-3 py-2 rounded-xl text-sm font-semibold text-[var(--royal)] bg-accent whitespace-nowrap" }}
                        activeOptions={{ exact: true }}
                      >
                        {t(c.k)}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={n.to}
                to={n.to}
                className="px-2 py-1.5 text-[11px] font-medium text-foreground/80 hover:text-foreground hover:bg-white/30 rounded-full transition-colors whitespace-nowrap 2xl:px-2.5 2xl:text-xs"
                activeProps={{ className: "px-2 py-1.5 text-[11px] font-semibold text-[var(--royal)] bg-white/40 rounded-full whitespace-nowrap 2xl:px-2.5 2xl:text-xs" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {t(n.k)}
              </Link>
            )
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-xs font-semibold border border-border hover:bg-accent transition"
            lang={lang === "en" ? "ar" : "en"}
            aria-label={lang === "en" ? "التبديل إلى العربية" : "Switch to English"}
          >
            <Globe className="h-3.5 w-3.5" aria-hidden="true" />
            {lang === "en" ? "العربية" : "English"}
          </button>
          <Link
            to="/quote"
            className="hidden sm:inline-flex items-center h-9 px-4 rounded-full gradient-royal text-white text-xs font-semibold shadow-soft hover:shadow-glow transition-shadow"
          >
            {t("nav.quote")}
          </Link>
          <button
            ref={menuButton}
            className="2xl:hidden grid place-items-center h-9 w-9 rounded-md hover:bg-accent"
            onClick={() => setOpen(true)}
            aria-label={lang === "ar" ? "فتح القائمة" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {typeof document !== "undefined" && createPortal(
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[var(--navy-deep)]/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              ref={drawer}
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label={lang === "ar" ? "القائمة" : "Menu"}
              initial={{ x: lang === "ar" ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: lang === "ar" ? "-100%" : "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className={`fixed top-0 ${lang === "ar" ? "left-0 border-r" : "right-0 border-l"} z-50 h-full w-80 max-w-[85vw] bg-white shadow-elevated p-6 flex flex-col border-border text-start`}
            >
              <div className="flex items-center justify-between mb-8">
                <Pic src={logo} alt="United Insurance" width={230} height={65} className="h-8 w-auto" />
                <button onClick={() => setOpen(false)} className="grid place-items-center h-9 w-9 rounded-md bg-white/60 hover:bg-white transition" aria-label={lang === "ar" ? "إغلاق" : "Close"}>
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <nav className="flex flex-col gap-1.5">
                {navKeys.map(n => (
                  <div key={n.to}>
                    <Link
                      to={n.to}
                      onClick={() => setOpen(false)}
                      className="block px-3 py-3 rounded-lg text-base font-medium bg-white/60 hover:bg-white/90 transition"
                      activeProps={{ className: "block px-3 py-3 rounded-lg text-base font-semibold text-[var(--royal)] bg-white/90" }}
                      activeOptions={{ exact: n.to === "/" }}
                    >
                      {t(n.k)}
                    </Link>
                    {"children" in n && n.children && (
                      <div className="ms-4 flex flex-col gap-1 mt-1">
                        {n.children.map(c => (
                          <Link
                            key={c.to + (c.hash || "")}
                            to={c.to}
                            hash={c.hash}
                            onClick={() => setOpen(false)}
                            className="block px-3 py-2 rounded-lg text-sm text-muted-foreground bg-white/50 hover:bg-white/80 transition"
                            activeProps={{ className: "block px-3 py-2 rounded-lg text-sm font-semibold text-[var(--royal)] bg-white/80" }}
                            activeOptions={{ exact: true }}
                          >
                            {t(c.k)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
              <Link
                to="/quote"
                onClick={() => setOpen(false)}
                className="mt-auto inline-flex items-center justify-center h-11 rounded-full gradient-royal text-white text-sm font-semibold"
              >
                {t("nav.quote")}
              </Link>
            </motion.aside>
          </>
        )}
      </AnimatePresence>,
      document.body
      )}
    </header>
  );
}
