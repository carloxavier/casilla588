export type CountryCode = "US" | "UK" | "NL" | "DE" | "CH" | "FR" | "IT";

export interface CountryInfo {
  name: string;
  flag: CountryCode;
  nominal: number;
  treaty: number;
  note: string;
  source: string;
}

export const COUNTRIES_2025: Record<CountryCode, CountryInfo> = {
  US: {
    name: "Estados Unidos",
    flag: "US",
    nominal: 0.3,
    treaty: 0.15,
    note: "Retención del 30% al pagador; tras presentar W-8BEN al broker se aplica el 15% del convenio España–EE. UU. Sin W-8BEN, los 15pp adicionales no son recuperables vía 588.",
    source: "BOE-A-1990-30574 — Convenio España–EE. UU.",
  },
  UK: {
    name: "Reino Unido",
    flag: "UK",
    nominal: 0.0,
    treaty: 0.0,
    note: "Reino Unido no aplica retención en origen sobre dividendos pagados a no residentes. El IRPF español del 19% es el único impuesto.",
    source: "BOE-A-2014-3941 — Convenio España–Reino Unido",
  },
  NL: {
    name: "Países Bajos",
    flag: "NL",
    nominal: 0.15,
    treaty: 0.15,
    note: "Retención nominal del 15%, alineada con el convenio España–Países Bajos. Recuperable íntegramente vía 588.",
    source: "BOE-A-1972-1538 — Convenio España–Países Bajos",
  },
  DE: {
    name: "Alemania",
    flag: "DE",
    nominal: 0.26375,
    treaty: 0.15,
    note: "Retención alemana del 26,375% (25% Kapitalertragsteuer + 5,5% Solidaritätszuschlag). El convenio limita al 15%; los 11,375pp restantes se reclaman a la Bundeszentralamt für Steuern.",
    source: "BOE-A-2012-15390 — Convenio España–Alemania",
  },
  CH: {
    name: "Suiza",
    flag: "CH",
    nominal: 0.35,
    treaty: 0.15,
    note: "Verrechnungssteuer del 35%. El convenio reduce al 15%; el 20% restante se reclama a la ESTV con el formulario 85 (3 años de plazo).",
    source: "BOE-A-1967-4885 — Convenio España–Suiza",
  },
  FR: {
    name: "Francia",
    flag: "FR",
    nominal: 0.25,
    treaty: 0.15,
    note: "Retención francesa del 25% por defecto. Con formularios 5000/5001 se aplica el 15% del convenio; sin ellos, la diferencia se reclama a la DGFiP.",
    source: "BOE-A-1997-15824 — Convenio España–Francia",
  },
  IT: {
    name: "Italia",
    flag: "IT",
    nominal: 0.26,
    treaty: 0.15,
    note: "Retención italiana del 26%. AEAT acepta históricamente el 15% del convenio; los 11pp adicionales son objeto de disputa interpretativa con la Agenzia delle Entrate.",
    source: "BOE-A-1978-23381 — Convenio España–Italia",
  },
};

export const RATES_VERIFIED_AT = "2025-11-12";
export const RATES_NEXT_REVIEW = "2026-11-12";
