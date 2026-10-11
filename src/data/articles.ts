import { digital, family, marine, medical, partner, q3 } from "@/lib/media";

export type Article = {
  slug: string;
  date: string; // ISO
  category: "Financials" | "Product" | "Partnership" | "Market" | "Community" | "Governance" | "Press";
  cover: string;
  title_en: string;
  title_ar: string;
  excerpt_en: string;
  excerpt_ar: string;
  body_en: string[];
  body_ar: string[];
};

export const articles: Article[] = [
  {
    slug: "general-assembly-53-invitation",
    date: "2025-05-15",
    category: "Governance",
    cover: partner,
    title_en: "Invitation to the 53rd Ordinary General Assembly Meeting",
    title_ar: "دعوة لحضور اجتماع الهيئة العامة العادي الثالث والخمسون",
    excerpt_en:
      "Shareholders of United Insurance Company PLC are invited to attend the 53rd Ordinary General Assembly meeting.",
    excerpt_ar:
      "تتشرف الشركة المتحدة للتأمين بدعوة السادة المساهمين لحضور اجتماع الهيئة العامة العادي الثالث والخمسون.",
    body_en: [
      "The Board of Directors of United Insurance Company PLC has the honor of inviting all shareholders to attend the 53rd Ordinary General Assembly meeting.",
      "The meeting agenda includes the review and approval of the Board of Directors' report on the company's activities for the previous fiscal year, the auditor's report, the audited financial statements, and the discharge of the Board for its performance.",
      "Shareholders unable to attend in person may appoint a proxy in writing in accordance with the Companies Law and the company's bylaws. The full agenda, meeting link, and proxy forms are available from the Investor Relations office.",
    ],
    body_ar: [
      "يتشرف مجلس إدارة الشركة المتحدة للتأمين م.ع.م بدعوة السادة المساهمين الكرام لحضور اجتماع الهيئة العامة العادي الثالث والخمسون.",
      "يتضمن جدول الأعمال مناقشة تقرير مجلس الإدارة عن أعمال الشركة للسنة المالية المنصرمة وتقرير مدقق الحسابات والبيانات المالية المدققة، وإبراء ذمة مجلس الإدارة عن أعماله.",
      "للمساهمين الذين يتعذر عليهم الحضور شخصياً، يمكنهم تفويض من ينوب عنهم خطياً وفقاً لقانون الشركات والنظام الأساسي للشركة. ويمكن الاطلاع على جدول الأعمال الكامل ورابط الاجتماع ونماذج التفويض من خلال مكتب علاقات المستثمرين.",
    ],
  },
  {
    slug: "honoring-distinguished-employees-2025",
    date: "2025-03-20",
    category: "Community",
    cover: family,
    title_en: "United Insurance honors its distinguished employees",
    title_ar: "المتحدة للتأمين تكرم موظفيها المتميزين",
    excerpt_en:
      "An annual ceremony recognizing the outstanding performance and dedication of our team members across all departments.",
    excerpt_ar:
      "حفل سنوي لتكريم الأداء المتميز والتفاني لأعضاء فريقنا في جميع الدوائر.",
    body_en: [
      "United Insurance Company PLC held its annual ceremony to honor distinguished employees in recognition of their outstanding performance and dedication throughout the year.",
      "The Chief Executive Officer presented certificates of appreciation and awards to top performers across underwriting, claims, sales, customer service, and back-office functions.",
      "In his address, the CEO emphasized that the company's continued success is built on the commitment and professionalism of its people, and reaffirmed the company's commitment to investing in talent, training, and a healthy work environment.",
    ],
    body_ar: [
      "أقامت الشركة المتحدة للتأمين م.ع.م حفلها السنوي لتكريم الموظفين المتميزين تقديراً لأدائهم المميز وتفانيهم خلال العام.",
      "وقام الرئيس التنفيذي بتسليم شهادات التقدير والجوائز لأصحاب الأداء المتميز في دوائر الاكتتاب والمطالبات والمبيعات وخدمة العملاء والدوائر الداعمة.",
      "وأكد الرئيس التنفيذي في كلمته أن نجاح الشركة المستمر مبني على التزام واحترافية موظفيها، مجدداً التزام الشركة بالاستثمار في الكوادر والتدريب وتوفير بيئة عمل صحية.",
    ],
  },
  {
    slug: "raed-haddadin-meir-interview-2024",
    date: "2024-09-10",
    category: "Press",
    cover: q3,
    title_en: "CEO Raed Haddadin's interview with Middle East Insurance Review",
    title_ar: "مقابلة الرئيس التنفيذي رائد حدادين مع Middle East Insurance Review",
    excerpt_en:
      "CEO Raed Khalil Haddadin discusses the Jordanian insurance market, growth strategy, and the role of reinsurance in a featured interview with MEIR.",
    excerpt_ar:
      "الرئيس التنفيذي رائد خليل حدادين يتحدث عن سوق التأمين الأردني واستراتيجية النمو ودور إعادة التأمين في مقابلة مع مجلة Middle East Insurance Review.",
    body_en: [
      "In its September 2024 issue, Middle East Insurance Review (MEIR) featured an interview with Mr. Raed Khalil Haddadin, Chief Executive Officer of United Insurance Company PLC.",
      "The conversation covered the current state of the Jordanian insurance market, the regulatory environment under the Central Bank of Jordan, and United's strategy for sustainable, profitable growth across personal and commercial lines.",
      "Mr. Haddadin highlighted the importance of long-term partnerships with leading reinsurers, disciplined underwriting, and ongoing investment in digital channels and customer experience as the pillars of the company's strategy for the coming years.",
    ],
    body_ar: [
      "نشرت مجلة Middle East Insurance Review (MEIR) في عددها الصادر في أيلول/سبتمبر 2024 مقابلة مع السيد رائد خليل حدادين، الرئيس التنفيذي للشركة المتحدة للتأمين م.ع.م.",
      "تناول الحوار واقع سوق التأمين الأردني والبيئة التنظيمية في ظل إشراف البنك المركزي الأردني، واستراتيجية «المتحدة» للنمو المستدام والربحي في خطوط التأمين الشخصية والتجارية.",
      "وأكد السيد حدادين أهمية الشراكات طويلة الأمد مع كبرى شركات إعادة التأمين، والاكتتاب المنضبط، والاستثمار المستمر في القنوات الرقمية وتجربة العميل، باعتبارها ركائز استراتيجية الشركة للسنوات القادمة.",
    ],
  },
  {
    slug: "ceo-akhbarelyom-interview-2024",
    date: "2024-07-22",
    category: "Press",
    cover: digital,
    title_en: "CEO Raed Haddadin in an interview with Akhbar Al-Balad",
    title_ar: "الرئيس التنفيذي رائد حدادين في لقاء مع موقع أخبار البلد",
    excerpt_en:
      "CEO Raed Khalil Haddadin answers six key questions about the insurance sector in Jordan and the path forward.",
    excerpt_ar:
      "الرئيس التنفيذي رائد خليل حدادين يجيب على 6 أسئلة هامة حول قطاع التأمين في الأردن ويضع النقاط على الحروف.",
    body_en: [
      "In an interview with the Akhbar Al-Balad news website on 22 July 2024, United Insurance CEO Mr. Raed Khalil Haddadin addressed six key questions about the state of the Jordanian insurance sector.",
      "Topics included pricing pressure, the importance of compliance with the Insurance Commission's regulations, the future of motor and medical lines, and the role of digital transformation in raising service standards.",
      "Mr. Haddadin called for closer cooperation between insurers, regulators, and the broader financial sector to build a more sustainable and competitive insurance market that serves both consumers and the national economy.",
    ],
    body_ar: [
      "في لقاء مع موقع أخبار البلد بتاريخ 22 تموز/يوليو 2024، أجاب الرئيس التنفيذي للشركة المتحدة للتأمين السيد رائد خليل حدادين على ستة أسئلة هامة حول واقع قطاع التأمين الأردني.",
      "وتناولت الأسئلة ضغوط التسعير وأهمية الالتزام بتعليمات هيئة التأمين، ومستقبل تأمين المركبات والتأمين الطبي، ودور التحول الرقمي في رفع مستوى الخدمة المقدمة للعملاء.",
      "ودعا السيد حدادين إلى تعاون أوثق بين شركات التأمين والجهات الرقابية والقطاع المالي الأوسع، لبناء سوق تأمين أكثر استدامة وتنافسية يخدم المستهلك والاقتصاد الوطني.",
    ],
  },
  {
    slug: "expanded-hospital-network-2026",
    date: "2024-06-05",
    category: "Market",
    cover: medical,
    title_en: "Hospital network expansion across Jordan",
    title_ar: "توسيع شبكة المستشفيات في جميع أنحاء الأردن",
    excerpt_en:
      "We continue to expand our medical network to bring direct billing closer to every policyholder.",
    excerpt_ar:
      "نواصل توسيع شبكتنا الطبية لتقريب خدمة الدفع المباشر من كل حامل وثيقة.",
    body_en: [
      "United Insurance continues to expand its medical provider network to cover hospitals, clinics, and specialty centers across all governorates of Jordan.",
      "The expansion focuses on under-served areas and adds specialist coverage in oncology, cardiology, and pediatric care.",
      "All new providers support our direct-billing program, meaning policyholders pay no out-of-pocket fees for covered treatments at participating facilities.",
    ],
    body_ar: [
      "تواصل الشركة المتحدة للتأمين توسيع شبكة مزودي الخدمة الطبية لتشمل المستشفيات والعيادات والمراكز التخصصية في جميع محافظات المملكة.",
      "ويركّز التوسع على المناطق الأقل خدمةً ويضيف تغطية متخصصة في طب الأورام وأمراض القلب وطب الأطفال.",
      "تدعم جميع المنشآت الجديدة برنامج الدفع المباشر لدينا، مما يعني أن حاملي الوثائق لا يدفعون أي رسوم من جيوبهم مقابل العلاجات المغطاة في المنشآت المشاركة.",
    ],
  },
  {
    slug: "marine-cargo-program-aqaba",
    date: "2024-05-18",
    category: "Market",
    cover: marine,
    title_en: "Marine cargo program for Jordanian exporters",
    title_ar: "برنامج تأمين البضائع البحرية للمصدّرين الأردنيين",
    excerpt_en:
      "Tailored open-cover policies for SMEs shipping through Aqaba, with same-day binding.",
    excerpt_ar:
      "وثائق تغطية مفتوحة مصممة للشركات الصغيرة والمتوسطة التي تشحن عبر العقبة، مع إصدار في اليوم نفسه.",
    body_en: [
      "Building on our marine portfolio, United Insurance offers a dedicated cargo program for Jordanian small and medium-sized exporters shipping through the port of Aqaba.",
      "The program offers flexible open-cover arrangements, all-risks coverage, and same-day binding for declared shipments — eliminating the friction of per-voyage placements.",
      "Premiums are competitive, with discounts available for high-volume exporters and customers with strong loss histories.",
    ],
    body_ar: [
      "بناءً على محفظتنا البحرية، تقدم الشركة المتحدة للتأمين برنامج تأمين بضائع مخصصاً للمصدّرين الأردنيين الصغار والمتوسطين الذين يشحنون عبر ميناء العقبة.",
      "يقدّم البرنامج ترتيبات تغطية مفتوحة مرنة، وتغطية جميع الأخطار، وإصدار وثائق في اليوم نفسه للشحنات المُعلنة، مما يلغي تعقيد الإصدار لكل رحلة على حدة.",
      "الأقساط تنافسية، مع توفّر خصومات للمصدّرين ذوي الأحجام الكبيرة والعملاء أصحاب السجل الجيد في الخسائر.",
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function relatedArticles(slug: string, n = 2): Article[] {
  return articles.filter((a) => a.slug !== slug).slice(0, n);
}
