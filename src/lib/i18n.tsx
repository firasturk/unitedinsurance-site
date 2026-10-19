import { createContext, useContext, useEffect, type ReactNode } from "react";
import { withLangPrefix, type Lang } from "./locale";

export type { Lang };

type Dict = Record<string, { en: string; ar: string }>;

export const dict: Dict = {
  // top bar
  "top.phone": { en: "+962 6 200 3333", ar: "+962 6 200 3333" },
  "top.email": { en: "uic@unitedjo.com", ar: "uic@unitedjo.com" },
  "top.hours": { en: "Sun – Thu · 8:00 – 16:00", ar: "الأحد - الخميس · 8:00 - 16:00" },

  // nav
  "nav.home": { en: "Home", ar: "الرئيسية" },
  "nav.about": { en: "About Us", ar: "من نحن" },
  "nav.about.company": { en: "Company Overview", ar: "نبذة عن الشركة" },
  "nav.insurance": { en: "Insurance Products", ar: "منتجات التأمين" },
  "nav.team": { en: "Management", ar: "الإدارة" },
  "nav.team.board": { en: "Board of Directors", ar: "مجلس الإدارة" },
  "nav.team.executive": { en: "Executive Management", ar: "الإدارة التنفيذية" },
  "nav.reports": { en: "Annual Reports", ar: "التقارير السنوية" },
  "nav.governance": { en: "Governance", ar: "الحوكمة" },
  "nav.gov.manual": { en: "Governance Manual", ar: "دليل الحوكمة" },
  "nav.gov.conduct": { en: "Code of Conduct Regulation", ar: "تعليمات أصول ممارسة المهنة" },
  "gov.download": { en: "Download Governance Manual 2026 (PDF)", ar: "تحميل دليل الحوكمة 2026 (PDF)" },
  "nav.news": { en: "News", ar: "الأخبار" },
  "nav.contact": { en: "Contact Us", ar: "اتصل بنا" },
  "nav.complaints": { en: "Complaints", ar: "الشكاوى" },
  "nav.whistleblower": { en: "Whistleblower", ar: "الإبلاغ عن المخالفات" },
  "nav.agents": { en: "Agents", ar: "الوكلاء" },
  "nav.careers": { en: "Careers", ar: "الوظائف" },
  "nav.quote": { en: "Request a Quote", ar: "اطلب عرض سعر" },

  // hero
  "hero.eyebrow": { en: "Trusted since 1972", ar: "موثوق منذ 1972" },
  "hero.title": { en: "A Safe Future Starts Today", ar: "مستقبل آمن يبدأ اليوم" },
  "hero.subtitle": {
    en: "Premium insurance coverage engineered for individuals, families, and the enterprises that shape tomorrow.",
    ar: "تغطية تأمينية متميزة مصممة للأفراد والعائلات والشركات التي تصنع الغد.",
  },
  "hero.cta1": { en: "Get Insurance Quote", ar: "اطلب عرض تأمين" },
  "hero.cta2": { en: "Explore Services", ar: "اكتشف خدماتنا" },
  "hero.stat1": { en: "54 years", ar: "٥٤ عاماً" },
  "hero.stat1l": { en: "Years of experience", ar: "من الخبرة" },
  "hero.stat2": { en: "100,000+", ar: "+ ١٠٠،٠٠٠" },
  "hero.stat2l": { en: "Active Policies", ar: "وثيقة فعالة" },
  "hero.stat3": { en: "A+ rated", ar: "تصنيف +A" },
  "hero.stat3l": { en: "financial strength", ar: "ملاءة مالية" },

  // services
  "svc.title": { en: "\n", ar: "\n" },
  "svc.tagline": {
    en: "United Insurance offers a diverse range of tailor-made insurance solutions, ensuring optimal protection against risks across various sectors.",
    ar: "توفر الشركة المتحدة للتأمين مجموعة متنوعة من حلول التأمين المصممة خصيصاً، لضمان الحماية المثلى ضد المخاطر في مختلف القطاعات.",
  },
  "svc.subtitle": {
    en: "Insurance Services",
    ar: "حلول التأمين",
  },
  "svc.description_legacy": {
    en: "A complete portfolio of personal and commercial coverage, underwritten with care.",
    ar: "محفظة كاملة من التغطيات الشخصية والتجارية، مكتتبة بعناية.",
  },
  "svc.motor": { en: "Motor Insurance", ar: "تأمين المركبات" },
  "svc.motor.d": { en: "Comprehensive and third-party plans with rapid claims service.", ar: "خطط شاملة وضد الغير مع خدمة مطالبات سريعة." },
  "svc.medical": { en: "Medical Insurance", ar: "التأمين الطبي" },
  "svc.medical.d": { en: "Direct billing across a network of leading hospitals and clinics.", ar: "دفع مباشر عبر شبكة من أفضل المستشفيات والعيادات." },
  "svc.life": { en: "Life Insurance", ar: "التأمين على الحياة" },
  "svc.life.d": { en: "Long-term protection that safeguards the people you love.", ar: "حماية طويلة الأمد للأشخاص الذين تحبهم." },
  "svc.travel": { en: "Travel Insurance", ar: "تأمين السفر" },
  "svc.travel.d": { en: "Worldwide assistance, medical care, and trip protection.", ar: "مساعدة عالمية ورعاية طبية وحماية الرحلات." },
  "svc.marine": { en: "Marine Insurance", ar: "التأمين البحري" },
  "svc.marine.d": { en: "Cargo, hull, and liability cover for maritime trade.", ar: "تغطية البضائع والهياكل والمسؤولية للتجارة البحرية." },
  "svc.fire": { en: "Fire, General Accident & Engineering", ar: "تأمين الحريق والحوادث العامة والهندسي" },
  "svc.fire.d": { en: "Property, fire, and general accident protection for business.", ar: "حماية الممتلكات والحريق والحوادث العامة للأعمال." },
  "svc.learn": { en: "Learn more", ar: "اعرف المزيد" },

  // about
  "about.eyebrow": { en: "\n", ar: "\n" },
  "about.title": { en: "Over half a century of protecting what matters", ar: "أكثر من نصف قرن من حماية ما يهم" },
  "about.body": {
    en: "Founded in 1972, United Insurance Company PLC is one of Jordan's leading insurance providers, offering both Life Insurance and General Insurance solutions. Over the years, the company has built a strong reputation founded on financial stability, excellence, and a deep understanding of its clients' evolving needs.",
    ar: "تأسست الشركة المتحدة للتأمين المساهمة العامة المحدودة عام 1972، كإحدى الشركات الرائدة في قطاع التأمين في الأردن، حيث تقدم حلول التأمين على الحياة والتأمينات العامة. وعلى مرّ السنين، رسخت الشركة سمعة قوية تقوم على الاستقرار المالي، والتميّز، والفهم العميق للاحتياجات المتطورة لعملائها.",
  },
  "about.p1": { en: "Licensed & regulated", ar: "مرخّصة وخاضعة للرقابة" },
  "about.p1d": { en: "By Central Bank of Jordan.", ar: "من البنك المركزي الأردني." },
  "about.p2": { en: "Global reinsurance", ar: "شراكات مع نخبة" },
  "about.p2d": { en: "Partnerships with leading global reinsurers.", ar: "من أبرز شركات إعادة التأمين العالمية." },
  "about.p3": { en: "Customer first", ar: "العميل أولاً" },
  "about.p3d": { en: "Customer satisfaction is our top priority.", ar: "رضا العملاء أولى أولوياتنا." },
  "about.mv.title": { en: "Mission & Vision", ar: "الرسالة والرؤية" },
  "about.mission.t": { en: "Our Mission", ar: "رسالتنا" },
  "about.mission.d": {
    en: "To provide reliable and comprehensive insurance solutions that protect our clients' assets and secure their future delivered with integrity, speed, and professionalism.",
    ar: "تقديم حلول تأمينية موثوقة وشاملة تحمي ممتلكات عملائنا وتؤمّن مستقبلهم بمهنية وسرعة ونزاهة.",
  },
  "about.vision.t": { en: "Our Vision", ar: "رؤيتنا" },
  "about.vision.d": {
    en: "To be the leading insurance company in Jordan and the region, setting the benchmark for trust, innovation, and customer experience.",
    ar: "أن نكون شركة التأمين الرائدة في الأردن والمنطقة، ونضع المعيار في الثقة والابتكار وتجربة العملاء.",
  },

  // news
  "news.title": { en: "\n", ar: "\n" },
  "news.subtitle": { en: "Announcements, financial results, and market insights", ar: "إعلانات ونتائج مالية ورؤى السوق" },
  "news.read": { en: "Read article", ar: "اقرأ المقال" },
  "news.back": { en: "Back to news", ar: "العودة إلى الأخبار" },
  "news.related": { en: "Related articles", ar: "مقالات ذات صلة" },
  "news.published": { en: "Published on", ar: "نُشر في" },
  "news.all": { en: "All articles", ar: "جميع المقالات" },
  "news.attachment": { en: "Read the full article (PDF)", ar: "اقرأ المقال كاملاً (PDF)" },
  "news.attachmentNote": { en: "Original publication", ar: "النسخة الأصلية من المنشور" },


  // partners
  "partners.title": { en: "Reinsurance Partners", ar: "شركاؤنا في إعادة التأمين" },
  "partners.sub": { en: "Trusted partnerships with leading reinsurers worldwide", ar: "شراكات موثوقة مع نخبة من أبرز شركات إعادة التأمين حول العالم" },

  // contact / footer
  "footer.cta": { en: "Ready for a better future?", ar: "جاهز لمستقبل أفضل؟" },
  "footer.ctas": { en: "Speak with a senior advisor today.", ar: "تحدث مع مستشار اليوم." },
  "footer.contact": { en: "Contact us", ar: "تواصل معنا" },
  "footer.address": { en: "Amman, Zahran Street, Building No. 188", ar: "عمّان، شارع زهران، بناية رقم 188" },
  "footer.rights": { en: "All rights reserved.", ar: "جميع الحقوق محفوظة." },
  "footer.quick": { en: "Quick links", ar: "روابط سريعة" },
  "footer.services": { en: "Services", ar: "الخدمات" },
  "footer.privacy": { en: "Privacy Policy", ar: "سياسة الخصوصية" },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: keyof typeof dict) => string; dir: "ltr" | "rtl" };
const LangCtx = createContext<Ctx | null>(null);

// The language comes from the URL ("/en/…" = English, otherwise Arabic) and is decided
// by the root route on the server, so the first HTML render is already in the right language.
export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    try {
      localStorage.setItem("lang", lang);
    } catch {}
  }, [lang]);

  // Switching language = loading the same page under the other prefix (a full navigation,
  // so the server renders it in the new language and search engines see two real URLs).
  const setLang = (l: Lang) => {
    if (typeof window === "undefined" || l === lang) return;
    const { pathname, search, hash } = window.location;
    window.location.assign(withLangPrefix(pathname, l) + search + hash);
  };

  const t = (k: string) => dict[k]?.[lang] ?? String(k);
  const dir = lang === "ar" ? "rtl" : "ltr";

  return <LangCtx.Provider value={{ lang, setLang, t, dir }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
