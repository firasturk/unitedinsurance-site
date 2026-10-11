import { motion } from "framer-motion";
import { MapPin, Phone, Printer, Mail, Clock } from "lucide-react";
import { useLang } from "@/lib/i18n";

export const branches = [
  {
    key: "hq",
    Icon: MapPin,
    title: { en: "Head Office", ar: "المقر الرئيسي" },
    address: {
      en: "Amman, Zahran Street, Building No. 188",
      ar: "عمّان، شارع زهران، بناية رقم 188",
    },
    phone: "+962 6 200 3333",
  },
  {
    key: "irbid",
    Icon: MapPin,
    title: { en: "Irbid Branch", ar: "فرع إربد" },
    address: {
      en: "Irbid – next to Hayat Irbid Hall – Fouad Al-Hajji Complex – 3rd floor – Office No. 52",
      ar: "إربد - بجانب صالة حياة إربد - مجمع فؤاد الحجي - الطابق الثالث - مكتب رقم 52",
    },
    phone: "+962 2 726 0200",
  },
  {
    key: "fax",
    Icon: Printer,
    title: { en: "Fax", ar: "فاكس" },
    address: { en: "", ar: "" },
    phone: "+962 6 200 3334",
  },
  {
    key: "email",
    Icon: Mail,
    title: { en: "Email", ar: "البريد الإلكتروني" },
    address: { en: "", ar: "" },
    phone: "uic@unitedjo.com",
  },
];

export const hours = [
  {
    en: "Sunday – Thursday",
    ar: "الأحد – الخميس",
    time: "08:00 AM – 4:00 PM",
  },
  {
    en: "Motor Claims Department",
    ar: "دائرة مطالبات المركبات",
    time: "08:30 AM – 2:00 PM",
  },
];

export function ContactInfo() {
  const { lang } = useLang();
  const L = (en: string, ar: string) => (lang === "ar" ? ar : en);

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          className="max-w-2xl"
        >
          <div className="text-xs font-semibold uppercase tracking-widest text-[var(--royal)]">
            {L("Branches & Contact", "الفروع والتواصل")}
          </div>
          <h2 className="mt-3 text-3xl font-bold text-balance sm:text-4xl">
            {L("How to reach United Insurance", "كيف تتواصل مع المتحدة للتأمين")}
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {branches.map((b, i) => (
            <motion.div
              key={b.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="group rounded-3xl border border-border bg-card p-7 text-center shadow-soft transition hover:-translate-y-1 hover:shadow-elevated"
            >
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--navy-deep)] text-white shadow-soft">
                <b.Icon className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{L(b.title.en, b.title.ar)}</h3>
              {b.address.en && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {L(b.address.en, b.address.ar)}
                </p>
              )}
              <div className="mt-3 text-sm font-semibold text-foreground" dir="ltr">
                {b.key === "email" ? (
                  <a href={`mailto:${b.phone}`} className="hover:text-[var(--royal)] transition">{b.phone}</a>
                ) : (
                  <a href={`tel:${b.phone.replace(/\s/g, "")}`} className="hover:text-[var(--royal)] transition">
                    {b.phone}
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="mt-10 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[var(--navy-deep)] to-[oklch(0.22_0.07_260)] p-8 text-white shadow-elevated sm:p-10"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 backdrop-blur">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-white/60">
                  {L("Working Hours", "أوقات العمل")}
                </div>
                <h3 className="mt-1 text-xl font-semibold">
                  {L("We're here when you need us", "نحن هنا عندما تحتاجنا")}
                </h3>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 md:gap-8">
              {hours.map((h) => (
                <div key={h.en} className="rounded-2xl bg-white/5 px-5 py-4 backdrop-blur">
                  <div className="text-sm text-white/70">{L(h.en, h.ar)}</div>
                  <div className="mt-1 text-base font-semibold" dir="ltr">{h.time}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
