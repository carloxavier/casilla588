import { getCountries, type CountryCode } from "../data/countries";
import { getTickerAnnual, getTickerInfo } from "../data/tickers";
import { type Transaction } from "../import/types";
import { sharesHeldOn, tickersInPortfolio } from "./transactions";

export const IRPF_RATE = 0.19;

// User-controlled toggles that change how withholding is computed. Defaults
// assume the conservative "no forms filed" case so estimates aren't overly
// optimistic. Field is extensible (hasForm86, hasDERefund) without breaking
// existing callers.
export interface CalcSettings {
  hasW8Ben: boolean;
}

const DEFAULT_SETTINGS: CalcSettings = { hasW8Ben: false };

// Effective rate of retention applied AT ORIGIN (before any IRPF deduction).
// W-8BEN, if signed, causes the US broker to apply the 15% treaty rate
// directly instead of the 30% nominal. Spain↔other-country forms (Form 86
// CH, Form 5000 FR, etc.) are not modelled in v1 — they're rare among the
// target audience and adding toggles for each would clutter the UI.
function effectiveNominal(
  country: CountryCode,
  countryNominal: number,
  countryTreaty: number,
  settings: CalcSettings,
): number {
  if (country === "US" && settings.hasW8Ben) return countryTreaty;
  return countryNominal;
}

export interface PositionResult {
  ticker: string;
  name: string;
  country: CountryCode;
  sharesEoy: number;
  paymentsHit: number;
  paymentsTotal: number;
  bruto: number;
  retOrigen: number;
  recuperable588: number;
  excesoOrigen: number;
  irpfTeorico: number;
  irpfTrasDeduccion: number;
  netoFinal: number;
}

export interface PortfolioTotals {
  bruto: number;
  retOrigen: number;
  recuperable588: number;
  excesoOrigen: number;
  irpfTeorico: number;
  irpfTrasDeduccion: number;
  netoFinal: number;
}

export interface CountryRollup {
  country: CountryCode;
  name: string;
  bruto: number;
  recuperable588: number;
  excesoOrigen: number;
}

export interface PortfolioResult {
  positions: PositionResult[];
  totals: PortfolioTotals;
  byCountry: CountryRollup[];
}

const ZERO_TOTALS: PortfolioTotals = {
  bruto: 0,
  retOrigen: 0,
  recuperable588: 0,
  excesoOrigen: 0,
  irpfTeorico: 0,
  irpfTrasDeduccion: 0,
  netoFinal: 0,
};

export function calcPosition(
  transactions: readonly Transaction[],
  ticker: string,
  taxYear: number,
  settings: CalcSettings = DEFAULT_SETTINGS,
): PositionResult | null {
  const info = getTickerInfo(ticker);
  if (!info) return null;
  const country = getCountries(taxYear)[info.country];
  const ann = getTickerAnnual(ticker, taxYear);

  let bruto = 0;
  let paymentsHit = 0;
  for (const p of ann.paymentsInYear) {
    const shares = Math.max(0, sharesHeldOn(transactions, ticker, p.exDivDate));
    if (shares > 0) {
      bruto += shares * p.amountEur;
      paymentsHit++;
    }
  }
  // recuperable588 stays bounded by the treaty rate regardless of toggles —
  // the 588 deduction is capped at the convention rate by law. What changes
  // with the W-8BEN toggle is how much was retained at origin, not how much
  // you can deduct.
  const nominalApplied = effectiveNominal(
    info.country,
    country.nominal,
    country.treaty,
    settings,
  );
  const retOrigen = bruto * nominalApplied;
  const recuperable588 = bruto * country.treaty;
  const excesoOrigen = Math.max(
    0,
    bruto * (nominalApplied - country.treaty),
  );
  const irpfTeorico = bruto * IRPF_RATE;
  const irpfTrasDeduccion = Math.max(0, irpfTeorico - recuperable588);
  const netoFinal = bruto - retOrigen - irpfTrasDeduccion;
  const sharesEoy = Math.max(
    0,
    sharesHeldOn(transactions, ticker, `${taxYear}-12-31`),
  );

  return {
    ticker,
    name: info.name,
    country: info.country,
    sharesEoy,
    paymentsHit,
    paymentsTotal: ann.paymentsInYear.length,
    bruto,
    retOrigen,
    recuperable588,
    excesoOrigen,
    irpfTeorico,
    irpfTrasDeduccion,
    netoFinal,
  };
}

export function calcPortfolio(
  transactions: readonly Transaction[],
  taxYear: number,
  settings: CalcSettings = DEFAULT_SETTINGS,
): PortfolioResult {
  const positions: PositionResult[] = [];
  for (const ticker of tickersInPortfolio(transactions)) {
    const r = calcPosition(transactions, ticker, taxYear, settings);
    if (r) positions.push(r);
  }

  const totals = positions.reduce<PortfolioTotals>(
    (acc, p) => ({
      bruto: acc.bruto + p.bruto,
      retOrigen: acc.retOrigen + p.retOrigen,
      recuperable588: acc.recuperable588 + p.recuperable588,
      excesoOrigen: acc.excesoOrigen + p.excesoOrigen,
      irpfTeorico: acc.irpfTeorico + p.irpfTeorico,
      irpfTrasDeduccion: acc.irpfTrasDeduccion + p.irpfTrasDeduccion,
      netoFinal: acc.netoFinal + p.netoFinal,
    }),
    { ...ZERO_TOTALS },
  );

  const countries = getCountries(taxYear);
  const byCountryMap = new Map<CountryCode, CountryRollup>();
  for (const p of positions) {
    const cur = byCountryMap.get(p.country) ?? {
      country: p.country,
      name: countries[p.country].name,
      bruto: 0,
      recuperable588: 0,
      excesoOrigen: 0,
    };
    cur.bruto += p.bruto;
    cur.recuperable588 += p.recuperable588;
    cur.excesoOrigen += p.excesoOrigen;
    byCountryMap.set(p.country, cur);
  }
  const byCountry = [...byCountryMap.values()].sort(
    (a, b) => b.bruto - a.bruto,
  );

  return { positions, totals, byCountry };
}
