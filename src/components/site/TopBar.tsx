import { Phone, Mail, Clock, Facebook, Linkedin, Instagram } from "lucide-react";
import { useLang } from "@/lib/i18n";

export function TopBar() {
  const { t } = useLang();
  return (
    <div className="hidden md:block w-full bg-[var(--navy-deep)] text-white/80 text-xs">
      <div className="mx-auto max-w-7xl px-6 h-9 flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <a href="tel:+96262003333" className="inline-flex items-center gap-2 hover:text-white transition" dir="ltr"><Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />{t("top.phone")}</a>
          <a href="mailto:uic@unitedjo.com" className="inline-flex items-center gap-2 hover:text-white transition"><Mail className="h-3.5 w-3.5" aria-hidden="true" />{t("top.email")}</a>
          <span className="inline-flex items-center gap-2"><Clock className="h-3.5 w-3.5" />{t("top.hours")}</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="https://www.facebook.com/unitedjocom" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-white transition"><Facebook className="h-3.5 w-3.5" /></a>
          <a href="https://www.linkedin.com/company/unitedjo" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-white transition"><Linkedin className="h-3.5 w-3.5" /></a>
          <a href="https://www.instagram.com/unitedinsurancejor/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-white transition"><Instagram className="h-3.5 w-3.5" /></a>
        </div>
      </div>
    </div>
  );
}
