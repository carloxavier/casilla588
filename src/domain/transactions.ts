import { type ISODate, type Transaction } from "../import/types";

export function sharesHeldOn(
  transactions: readonly Transaction[],
  ticker: string,
  date: ISODate,
): number {
  let total = 0;
  for (const tx of transactions) {
    if (tx.ticker === ticker && tx.date <= date) total += tx.shares;
  }
  return total;
}

export function tickersInPortfolio(
  transactions: readonly Transaction[],
): string[] {
  const set = new Set<string>();
  for (const tx of transactions) set.add(tx.ticker);
  return [...set].sort();
}

export interface ValidationError {
  ticker: string;
  date: ISODate;
  reason: string;
}

export function validateRunningShares(
  transactions: readonly Transaction[],
): ValidationError[] {
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
  const running: Record<string, number> = {};
  const errors: ValidationError[] = [];
  for (const tx of sorted) {
    const prev = running[tx.ticker] ?? 0;
    const next = prev + tx.shares;
    if (next < 0) {
      errors.push({
        ticker: tx.ticker,
        date: tx.date,
        reason: `Venta supera la posición actual (${prev} acciones).`,
      });
    } else {
      running[tx.ticker] = next;
    }
  }
  return errors;
}
