// The old Joomla site lived under /index.php/<lang>/<slug>…  Google and old links still point
// there, so every such URL gets a permanent redirect to the matching page of the new site
// (language preserved). Unknown slugs fall back to the section they most likely belonged to,
// and finally to the homepage — never a 404 and never a "blocked" page for a real visitor.

type Rule = [test: RegExp, target: string];

// Order matters: first match wins. Patterns run against the lower-cased, URL-decoded slug
// path after /index.php/<lang>/ (e.g. "insurance-ar/motors-insurance-ar").
const RULES: Rule[] = [
  // specific news articles that exist on the new site
  [/^news(-ar)?\/230-/, "/news/raed-haddadin-meir-interview-2024"],
  [/^news(-ar)?\/228-/, "/news/ceo-akhbarelyom-interview-2024"],
  [/^news(-ar)?\/235-/, "/news/honoring-distinguished-employees-2025"],
  [/^(news|videos)/, "/news"],

  // insurance lines
  [/motor/, "/insurance/motor"],
  [/medical/, "/insurance/medical"],
  [/life-insurance|life\b/, "/insurance/life"],
  [/travel/, "/insurance/travel"],
  [/marine-insurance(-ar)?$|^insurance(-ar)?\/marine/, "/insurance/marine"],
  [/fire|general-accidents|engineering|property/, "/insurance/fire"],
  [/insurance-request|request-a-quote|quote/, "/quote"],
  [/^(insurance|products-and-services|marine-insurance-form|pet-insurance)/, "/insurance"],

  // company
  [/about/, "/about"],
  [/contact/, "/contact"],
  [/board-of-directors|مجلس-الإدارة|مجلس-الادارة/, "/team/board"],
  [/senior-management|upper-management|management|team-members|swaidan/, "/team/executive"],
  [/agents|الوكلاء/, "/agents"],
  [/customer-complaints|complaint|شكاوى|شكوى/, "/complaints"],
  [/report-violations|violation|whistle/, "/whistleblower"],
  [/annual-report|report/, "/reports"],
  [/instructions-on-the-principle|governance|conduct|الحوكمة|الترشح/, "/governance"],
  [/career|job|vacanc|وظائف|التوظيف/, "/careers"],
];

/** Returns the new-site path for a legacy /index.php URL, or null when the URL isn't a legacy one. */
export function legacyRedirect(pathname: string): string | null {
  if (!/^\/index\.php(\/|$)/i.test(pathname)) return null;
  let rest = pathname.replace(/^\/index\.php\/?/i, "");
  try {
    rest = decodeURIComponent(rest);
  } catch {
    /* keep raw */
  }
  rest = rest.toLowerCase().replace(/\/+$/, "");

  let lang: "en" | "ar" = "ar";
  const m = rest.match(/^(en|ar)(?:\/|$)/);
  if (m) {
    lang = m[1] as "en" | "ar";
    rest = rest.slice(m[0].length);
  }
  // Joomla internals (component/…, feeds, search) carry nothing worth mapping
  if (!rest || rest.startsWith("component/")) return lang === "en" ? "/en" : "/";

  const slug = rest.replace(/-ar(\/|$)/g, "$1"); // "insurance-ar/motors-insurance-ar" → "insurance/motors-insurance"
  const target = RULES.find(([re]) => re.test(slug))?.[1] ?? "/";
  if (lang === "en") return target === "/" ? "/en" : `/en${target}`;
  return target;
}
