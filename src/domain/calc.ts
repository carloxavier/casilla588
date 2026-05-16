import { getCountries, type CountryCode } from "../data/countries";
import { getTickerAnnual, getTickerInfo } from "../data/tickers";
import { type Transaction } from "../import/types";
import { sharesHeldOn, tickersInPortfolio } from "./transactions";

export const IRPF_RATE = 0.19;

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
  const retOrigen = bruto * country.nominal;
  const recuperable588 = bruto * country.treaty;
  const excesoOrigen = Math.max(
    0,
    bruto * (country.nominal - country.treaty),
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
): PortfolioResult {
  const positions: PositionResult[] = [];
  for (const ticker of tickersInPortfolio(transactions)) {
    const r = calcPosition(transactions, ticker, taxYear);
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
