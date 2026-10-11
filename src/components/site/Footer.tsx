import { Link } from "@tanstack/react-router";
import { logo } from "@/lib/media";
import { MapPin, Phone, Mail, Facebook, Linkedin, Instagram, ArrowRight } from "lucide-react";
import { useLang } from "@/lib/i18n";

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="relative bg-[var(--navy-deep)] text-white">
      <div className="absolute inset-x-0 -top-20 h-20 bg-gradient-to-b from-transparent to-[var(--navy-deep)] pointer-events-none" />
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl glass p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold">{t("footer.cta")}</h3>
            <p className="mt-2 text-white/70 text-sm">{t("footer.ctas")}</p>
          </div>
          <Link
            to="/quote"
            className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-white text-[var(--navy-deep)] font-semibold text-sm shadow-elevated hover:shadow-glow transition"
          >
            {t("nav.quote")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center">
              <img src={logo} alt="United Insurance" className="h-14 w-auto brightness-0 invert" />
            </div>
            <div className="mt-5 flex gap-3">
              <a href="https://www.facebook.com/unitedjocom" target="_blank" rel="noopener noreferrer" className="grid h-9 w-9 place-items-center rounded-full glass hover:bg-white/15 transition" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://www.linkedin.com/company/unitedjo" target="_blank" rel="noopener noreferrer" className="grid h-9 w-9 place-items-center rounded-full glass hover:bg-white/15 transition" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="https://www.instagram.com/unitedinsurancejor/" target="_blank" rel="noopener noreferrer" className="grid h-9 w-9 place-items-center rounded-full glass hover:bg-white/15 transition" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold mb-4">{t("footer.quick")}</div>
            <ul className="space-y-2.5 text-sm text-white/70">
              {[["nav.about", "/about"], ["nav.insurance", "/insurance"], ["nav.reports", "/reports"], ["nav.governance", "/governance"], ["nav.news", "/news"], ["nav.complaints", "/complaints"], ["nav.whistleblower", "/whistleblower"], ["nav.agents", "/agents"], ["nav.careers", "/careers"]].map(([k, to]) => (
                <li key={to}><Link to={to as any} className="hover:text-white transition">{t(k as any)}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold mb-4">{t("footer.services")}</div>
            <ul className="space-y-2.5 text-sm text-white/70">
              {([["svc.motor","motor"],["svc.medical","medical"],["svc.life","life"],["svc.travel","travel"],["svc.marine","marine"],["svc.fire","fire"]] as const).map(([k, slug]) => (
                <li key={slug}><Link to="/insurance/$type" params={{ type: slug }} className="hover:text-white transition">{t(k)}</Link></li>
              ))}
            </ul>
          </div>


          <div>
            <div className="text-sm font-semibold mb-4">{t("footer.contact")}</div>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2.5"><MapPin className="h-4 w-4 mt-0.5 shrink-0" /><span>{t("footer.address")}</span></li>
              <li className="flex items-center gap-2.5" dir="ltr"><Phone className="h-4 w-4 shrink-0" /><span>+962 6 200 3333</span></li>
              <li className="flex items-center gap-2.5" dir="ltr"><Phone className="h-4 w-4 shrink-0" /><span>+962 2 726 0200 (Irbid Branch)</span></li>
              <li className="flex items-center gap-2.5"><Mail className="h-4 w-4 shrink-0" /><a href="mailto:uic@unitedjo.com" className="hover:text-white transition">uic@unitedjo.com</a></li>
            </ul>
            <a href="https://maps.app.goo.gl/AhrsDefPeNER1BsY7" target="_blank" rel="noopener noreferrer" className="block mt-4 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition">
              <iframe
                src="https://maps.google.com/maps?q=31.9614315,35.8759078&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="120"
                style={{ border: 0, filter: "grayscale(1) invert(0.9)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="United Insurance Location"
              />
            </a>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <div>© {new Date().getFullYear()} United Insurance. {t("footer.rights")}</div>
          <div>Amman · Jordan</div>
        </div>
      </div>
    </footer>
  );
}
