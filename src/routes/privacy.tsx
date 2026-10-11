import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { useLang } from "@/lib/i18n";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: ({ match }) =>
    pageHead({
      lang: match.context.lang,
      path: "/privacy",
      title: { en: "Privacy Policy", ar: "سياسة الخصوصية" },
      description: {
        en: "How United Insurance Company PLC collects, uses and protects the personal data you share through unitedjo.com.",
        ar: "كيف تجمع الشركة المتحدة للتأمين م.ع.م البيانات الشخصية التي تشاركها عبر unitedjo.com وتستخدمها وتحميها.",
      },
    }),
  component: PrivacyPage,
});

type Section = { h: string; p: string[] };

const SECTIONS: Record<"en" | "ar", { updated: string; intro: string; sections: Section[] }> = {
  en: {
    updated: "Last updated: October 2026",
    intro:
      "United Insurance Company PLC (“United Insurance”, “we”) respects your privacy. This policy explains what personal data this website collects, why, and the choices you have. It applies to unitedjo.com only; insurance policies and claims are governed by their own terms and by the regulations of the Central Bank of Jordan.",
    sections: [
      {
        h: "1. Data you give us",
        p: [
          "When you use a form on this site we collect what you type: your name, email address, phone number and, depending on the form, the insurance type you are interested in, your message, your policy number, your national ID number (complaints only) and your CV (job applications only).",
          "Providing this data is voluntary, but without it we cannot answer your request.",
        ],
      },
      {
        h: "2. Why we use it",
        p: [
          "To answer contact messages and quote requests, to register and follow up on suggestions and complaints (including issuing a reference number and contacting you about the case), and to assess job applications.",
          "We do not sell personal data and we do not use it for marketing unless you asked us to.",
        ],
      },
      {
        h: "3. Where it is stored and who sees it",
        p: [
          "Submissions are stored in a secured database hosted in the European Union (Supabase, Frankfurt) and are accessible only to authorised United Insurance staff. The website itself is delivered through Cloudflare, which processes technical data such as your IP address to serve and protect the site.",
          "Notification emails about submissions may be sent to our staff through an email delivery provider. We do not share your data with other third parties except where the law or the regulator requires it.",
        ],
      },
      {
        h: "4. How long we keep it",
        p: [
          "Contact messages and quote requests: up to 24 months. Complaints: as required by the Central Bank of Jordan complaint-handling instructions. Job applications and CVs: up to 12 months after the vacancy closes, unless you ask us to delete them sooner.",
        ],
      },
      {
        h: "5. Cookies and analytics",
        p: [
          "This site does not use advertising or tracking cookies. Your language choice is remembered in your browser. If anonymous, cookie-free traffic statistics are enabled, they do not identify you personally.",
        ],
      },
      {
        h: "6. Your rights",
        p: [
          "You may ask what data we hold about you, request a correction or deletion, or withdraw your consent, by writing to uic@unitedjo.com or calling +962 6 200 3333. We answer within a reasonable period and in line with the applicable Jordanian laws.",
        ],
      },
      {
        h: "7. Changes",
        p: ["We may update this policy from time to time; the date at the top shows the latest version."],
      },
    ],
  },
  ar: {
    updated: "آخر تحديث: تشرين الأول 2026",
    intro:
      "تحترم الشركة المتحدة للتأمين م.ع.م («المتحدة للتأمين»، «نحن») خصوصيتك. توضح هذه السياسة البيانات الشخصية التي يجمعها هذا الموقع، وسبب جمعها، والخيارات المتاحة لك. وتنطبق على موقع unitedjo.com فقط؛ أما وثائق التأمين والمطالبات فتحكمها شروطها الخاصة وتعليمات البنك المركزي الأردني.",
    sections: [
      {
        h: "1. البيانات التي تقدّمها لنا",
        p: [
          "عند استخدام أي نموذج في هذا الموقع نجمع ما تكتبه: اسمك، بريدك الإلكتروني، رقم هاتفك، وبحسب النموذج: نوع التأمين الذي يهمك، رسالتك، رقم الوثيقة، رقمك الوطني (في نموذج الشكاوى فقط)، وسيرتك الذاتية (في طلبات التوظيف فقط).",
          "تقديم هذه البيانات اختياري، لكن دونها لا نستطيع الرد على طلبك.",
        ],
      },
      {
        h: "2. لماذا نستخدمها",
        p: [
          "للرد على رسائل التواصل وطلبات عروض الأسعار، ولتسجيل الاقتراحات والشكاوى ومتابعتها (بما في ذلك إصدار رقم مرجعي والتواصل معك بشأن الحالة)، ولتقييم طلبات التوظيف.",
          "لا نبيع البيانات الشخصية ولا نستخدمها للتسويق ما لم تطلب ذلك.",
        ],
      },
      {
        h: "3. أين تُحفظ ومن يطّلع عليها",
        p: [
          "تُخزَّن الطلبات في قاعدة بيانات مؤمَّنة مستضافة في الاتحاد الأوروبي (Supabase، فرانكفورت) ولا يصل إليها إلا موظفو المتحدة للتأمين المخوّلون. ويُقدَّم الموقع نفسه عبر Cloudflare التي تعالج بيانات تقنية مثل عنوان IP لتشغيل الموقع وحمايته.",
          "قد تُرسل إشعارات بريدية بالطلبات إلى موظفينا عبر مزوّد خدمة بريد. ولا نشارك بياناتك مع أطراف أخرى إلا إذا اقتضى القانون أو الجهة الرقابية ذلك.",
        ],
      },
      {
        h: "4. مدة الاحتفاظ بها",
        p: [
          "رسائل التواصل وطلبات الأسعار: حتى 24 شهراً. الشكاوى: وفق تعليمات معالجة الشكاوى الصادرة عن البنك المركزي الأردني. طلبات التوظيف والسير الذاتية: حتى 12 شهراً بعد إغلاق الشاغر، ما لم تطلب حذفها قبل ذلك.",
        ],
      },
      {
        h: "5. ملفات تعريف الارتباط والإحصاءات",
        p: [
          "لا يستخدم هذا الموقع ملفات تعريف ارتباط إعلانية أو تتبّعية. يُحفظ اختيارك للغة في متصفحك. وإذا فُعِّلت إحصاءات زيارات مجهولة بلا ملفات تعريف، فإنها لا تحدد هويتك شخصياً.",
        ],
      },
      {
        h: "6. حقوقك",
        p: [
          "يمكنك الاستفسار عن البيانات التي نحتفظ بها عنك، أو طلب تصحيحها أو حذفها، أو سحب موافقتك، بمراسلتنا على uic@unitedjo.com أو الاتصال على 3333 200 6 962+. نرد خلال فترة معقولة ووفق القوانين الأردنية المعمول بها.",
        ],
      },
      {
        h: "7. التعديلات",
        p: ["قد نحدّث هذه السياسة من وقت لآخر؛ ويُظهر التاريخ في الأعلى أحدث نسخة."],
      },
    ],
  },
};

function PrivacyPage() {
  const { lang } = useLang();
  const c = SECTIONS[lang];
  return (
    <SiteLayout>
      <PageHero
        eyebrow={"\n"}
        title={lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
        subtitle={c.intro}
      />
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <article className="rounded-3xl bg-card border border-border p-8 md:p-12 shadow-soft">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.updated}</p>
            {c.sections.map((s) => (
              <section key={s.h} className="mt-8">
                <h2 className="text-lg font-bold text-[var(--royal)]">{s.h}</h2>
                {s.p.map((para, i) => (
                  <p key={i} className="mt-3 text-sm leading-loose text-muted-foreground">
                    {para}
                  </p>
                ))}
              </section>
            ))}
            <p className="mt-10 text-sm">
              <Link to="/contact" className="font-semibold text-[var(--royal)] hover:underline">
                {lang === "ar" ? "للاستفسار عن بياناتك: اتصل بنا →" : "Questions about your data? Contact us →"}
              </Link>
            </p>
          </article>
        </div>
      </section>
    </SiteLayout>
  );
}
