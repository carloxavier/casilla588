import { PAYMENTS_2025, type DividendPayment } from "./payments-2025";
import { TICKERS, type TickerInfo } from "./tickers";

export { PAYMENTS_2025, PAYMENTS_VERIFIED_AT } from "./payments-2025";
export { TICKERS } from "./tickers";
export type { TickerInfo, DividendPayment };

export interface AnnualSummary {
  paymentsInYear: DividendPayment[];
  divEur: number;
  basis: "complete" | "estimated";
}

export function getTickerInfo(ticker: string): TickerInfo | undefined {
  return TICKERS.find((t) => t.t === ticker);
}

export function getTickerAnnual(
  ticker: string,
  taxYear: number,
): AnnualSummary {
  const payments =
    taxYear === 2025 ? (PAYMENTS_2025[ticker] ?? []) : [];
  const yearStart = `${taxYear}-01-01`;
  const yearEnd = `${taxYear}-12-31`;
  const inYear = payments.filter(
    (p) => p.exDivDate >= yearStart && p.exDivDate <= yearEnd,
  );
  const divEur = inYear.reduce((s, p) => s + p.amountEur, 0);
  return {
    paymentsInYear: inYear,
    divEur,
    basis: "complete",
  };
}
