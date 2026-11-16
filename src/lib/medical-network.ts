// Turns the monthly NatHealth network workbook (sheet "All") into the compact JSON the
// /medical-network page reads. Used in the browser by Admin → Medical Network, and by the
// one-off script that produced the first snapshot, so both always agree on the format.
//
// Only public business details are kept (name, type, specialty, address, work phone).
// Personal columns that appear in the Additions/Deletions sheets (owner, date of birth,
// e-mail, university…) are never read.

export type NetworkRow = [
  en: string,
  ar: string,
  group: string, // doctor | hospital | emergency | lab | radiology | physio | optical | center | supplier | pharmacy
  spec: number, // index into specs, -1 for non-doctors
  city: number, // index into cities
  area: number, // index into areas
  adrEn: string,
  adrAr: string,
  bldEn: string,
  bldAr: string,
  phone: string,
  key: string, // HCP_ID-BRN_ID, used to compare months
];

export type NetworkData = {
  updated: string; // "2026-11"
  cities: [en: string, ar: string][];
  areas: [city: number, en: string, ar: string][];
  specs: [en: string, ar: string][];
  rows: NetworkRow[];
};

export type NetworkStats = {
  total: number;
  medical: number;
  pharmacies: number;
  byGroup: Record<string, number>;
  byCity: Record<string, number>;
  noPhone: number;
  skippedInactive: number;
};

const REQUIRED = [
  "HCP_ID", "BRN_ID", "HCP_NAME", "HCP_ARABIC", "CITY", "DESCRIPTION", "STREET_NAME", "BUILDING",
  "DESCRIPTION_A", "STREET_NAME_A", "BUILDING_A", "HCP_TYPES", "HCP_SPEC", "HCP_SPEC_A", "WORK_PHONE_1", "STATUS",
] as const;

const CITY_AR: Record<string, string> = {
  amman: "عمّان", "al-zarqa": "الزرقاء", zarqa: "الزرقاء", irbid: "إربد", "al-balqa": "البلقاء", balqa: "البلقاء",
  kerak: "الكرك", karak: "الكرك", aqaba: "العقبة", madaba: "مادبا", "al-mafraq": "المفرق", mafraq: "المفرق",
  maan: "معان", "ma'an": "معان", jerash: "جرش", "al-tafila": "الطفيلة", tafila: "الطفيلة", ajlun: "عجلون", ajloun: "عجلون",
};
// English display names (the workbook spells some of them differently)
const CITY_EN: Record<string, string> = {
  kerak: "Karak", "al-zarqa": "Zarqa", "al-balqa": "Balqa", "al-mafraq": "Mafraq", "al-tafila": "Tafila", maan: "Ma'an", ajlun: "Ajloun",
};

const clean = (x: unknown) => {
  let s = x == null ? "" : String(x).trim();
  if (s === "." || s === "-" || s === "0") return "";
  s = s.replace(/\s+/g, " ").replace(/\s*\/\s*$/, "");
  return s;
};

/** 790998979 → 0790998979, 962790998979 → 0790998979; anything else → "" */
const phone = (p: unknown) => {
  const d = String(p ?? "").replace(/\D/g, "");
  if (d.length === 8 || d.length === 9) return "0" + d;
  if (d.length === 12 && d.startsWith("962")) return "0" + d.slice(3);
  if (d.length === 10 && d.startsWith("0")) return d;
  return "";
};

/** Same area spelled differently (ة/ه, أ/ا…) is one area. */
const normAr = (a: string) => a.replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/\s+/g, " ").trim();

function group(type: string, spec: string) {
  if (type === "Pharmacy") return "pharmacy";
  if (type === "Doctor") return "doctor";
  if (type === "In-Patient Facility") return "hospital";
  if (type === "Lab") return "lab";
  if (type === "Radiology Center" || spec === "Nuclear Medicine Center") return "radiology";
  if (type === "Emergency Center") return "emergency";
  if (type === "Optical Center" || spec === "Hearing Center") return "optical";
  if (spec === "Physiotherapy Center") return "physio";
  if (type === "Medical Supplier") return "supplier";
  return "center";
}

export class NetworkFileError extends Error {}

/**
 * rows: the "All" sheet as an array of rows, first row = headers.
 * updated: the month the file is for, "YYYY-MM".
 */
export function buildNetwork(sheet: unknown[][], updated: string): { data: NetworkData; stats: NetworkStats } {
  if (!sheet.length) throw new NetworkFileError("The sheet is empty.");
  const head = sheet[0].map((h) => String(h ?? "").trim().toUpperCase());
  const col: Record<string, number> = {};
  for (const name of REQUIRED) {
    const i = head.indexOf(name);
    if (i < 0) throw new NetworkFileError(`Column "${name}" is missing from the "All" sheet.`);
    col[name] = i;
  }
  const v = (r: unknown[], name: (typeof REQUIRED)[number]) => r[col[name]];

  const cities: [string, string][] = [];
  const cityIdx = new Map<string, number>();
  const specs: [string, string][] = [];
  const specIdx = new Map<string, number>();
  const raw: NetworkRow[] = [];
  const rowArea: { ci: number; en: string; ar: string }[] = [];
  let skippedInactive = 0;

  for (let k = 1; k < sheet.length; k++) {
    const r = sheet[k];
    if (!r || r.every((c) => c == null || c === "")) continue;
    const status = String(v(r, "STATUS") ?? "").trim().toLowerCase();
    if (status && status !== "active") { skippedInactive++; continue; }
    const cityRaw = clean(v(r, "CITY"));
    if (!cityRaw) continue;
    const cKey = cityRaw.toLowerCase();
    let ci = cityIdx.get(cKey);
    if (ci == null) {
      ci = cities.length;
      cityIdx.set(cKey, ci);
      cities.push([CITY_EN[cKey] ?? cityRaw, CITY_AR[cKey] ?? cityRaw]);
    }
    const aEn = clean(v(r, "DESCRIPTION")) || cities[ci][0];
    const aAr = clean(v(r, "DESCRIPTION_A")).replace(/[.\s]+$/, "");
    rowArea.push({ ci, en: aEn, ar: aAr });

    const type = clean(v(r, "HCP_TYPES"));
    const specEn = clean(v(r, "HCP_SPEC"));
    const g = group(type, specEn);
    let si = -1;
    if (g === "doctor") {
      const specAr = clean(v(r, "HCP_SPEC_A"));
      const sKey = `${specEn}|${specAr}`;
      si = specIdx.get(sKey) ?? -1;
      if (si < 0) { si = specs.length; specIdx.set(sKey, si); specs.push([specEn, specAr]); }
    }
    raw.push([
      clean(v(r, "HCP_NAME")), clean(v(r, "HCP_ARABIC")), g, si, ci, -1,
      clean(v(r, "STREET_NAME")), clean(v(r, "STREET_NAME_A")), clean(v(r, "BUILDING")), clean(v(r, "BUILDING_A")),
      phone(v(r, "WORK_PHONE_1")), `${String(v(r, "HCP_ID") ?? "").trim()}-${String(v(r, "BRN_ID") ?? "").trim()}`,
    ]);
  }

  // Areas: the English name is the reliable key (the Arabic column is sometimes empty, English
  // or another place). Each area takes its most common Arabic spelling, and English spellings
  // that share an Arabic name are merged ("Al-Jubiha" / "Jubeiha" → الجبيهة).
  const isAr = (s: string) => /[\u0600-\u06FF]/.test(s);
  type G = { ci: number; en: Map<string, number>; ar: Map<string, number>; n: number };
  const byEn = new Map<string, G>();
  const rowKey = rowArea.map(({ ci, en, ar }) => {
    const key = `${ci}|${en.toLowerCase()}`;
    let g = byEn.get(key);
    if (!g) { g = { ci, en: new Map(), ar: new Map(), n: 0 }; byEn.set(key, g); }
    g.n++;
    g.en.set(en, (g.en.get(en) ?? 0) + 1);
    if (isAr(ar)) g.ar.set(ar, (g.ar.get(ar) ?? 0) + 1);
    return key;
  });
  const top = (m: Map<string, number>) => [...m.entries()].sort((x, y) => y[1] - x[1])[0]?.[0] ?? "";
  const areas: [number, string, string][] = [];
  const areaOf = new Map<string, number>(); // en key → area index
  const byAr = new Map<string, number>(); // `${ci}|${normAr}` → area index
  [...byEn.entries()].sort((x, y) => y[1].n - x[1].n).forEach(([key, g]) => {
    const en = top(g.en), ar = top(g.ar) || en;
    const arKey = `${g.ci}|${normAr(ar)}`;
    let ai = isAr(ar) ? byAr.get(arKey) : undefined;
    if (ai == null) {
      ai = areas.length;
      areas.push([g.ci, en, ar]);
      if (isAr(ar)) byAr.set(arKey, ai);
    }
    areaOf.set(key, ai);
  });
  raw.forEach((r, k) => { r[5] = areaOf.get(rowKey[k])!; });

  if (!raw.length) throw new NetworkFileError("No active providers were found in the \"All\" sheet.");

  const data: NetworkData = {
    updated,
    cities,
    areas,
    specs,
    rows: raw as NetworkRow[],
  };
  const byGroup: Record<string, number> = {};
  const byCity: Record<string, number> = {};
  for (const r of data.rows) {
    byGroup[r[2]] = (byGroup[r[2]] ?? 0) + 1;
    const c = cities[r[4]][0];
    byCity[c] = (byCity[c] ?? 0) + 1;
  }
  const pharmacies = byGroup.pharmacy ?? 0;
  return {
    data,
    stats: {
      total: data.rows.length,
      medical: data.rows.length - pharmacies,
      pharmacies,
      byGroup,
      byCity,
      noPhone: data.rows.filter((r) => !r[10]).length,
      skippedInactive,
    },
  };
}

/** Providers added / removed between two snapshots (by HCP_ID-BRN_ID). */
export function diffNetworks(prev: NetworkData | null, next: NetworkData) {
  if (!prev) return { added: next.rows.length, removed: 0 };
  const a = new Set(prev.rows.map((r) => r[11]));
  const b = new Set(next.rows.map((r) => r[11]));
  let added = 0, removed = 0;
  b.forEach((k) => { if (!a.has(k)) added++; });
  a.forEach((k) => { if (!b.has(k)) removed++; });
  return { added, removed };
}
