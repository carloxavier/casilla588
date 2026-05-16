import { TICKERS } from "../data/tickers";
import { type Adapter, type ImportError, type Transaction } from "./types";

const POSITION_RE = /^([A-Za-z0-9.-]+)[\s,;:|]+(\d+(?:[.,]\d+)?)\s*$/;
const MOVEMENT_RE =
  /^(\d{4}-\d{2}-\d{2})\s+([A-Za-z0-9.-]+)\s+(compra|venta|\+|-)?\s*(\d+(?:[.,]\d+)?)\s*$/i;

function parseNumber(s: string): number {
  return parseFloat(s.replace(",", "."));
}

function isKnownTicker(t: string): boolean {
  return TICKERS.some((info) => info.t === t);
}

export const nativeAdapter: Adapter = {
  id: "native",
  label: "Formato Casilla 588",
  parse(input, taxYear) {
    const transactions: Transaction[] = [];
    const errors: ImportError[] = [];
    const lines = input.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i].trim();
      if (!raw || raw.startsWith("#")) continue;
      const lineNo = i + 1;

      const mov = raw.match(MOVEMENT_RE);
      if (mov) {
        const [, date, tickerRaw, verbRaw, qtyRaw] = mov;
        const ticker = tickerRaw.toUpperCase();
        if (!isKnownTicker(ticker)) {
          errors.push({
            line: lineNo,
            raw,
            reason: `Ticker desconocido: ${ticker}`,
          });
          continue;
        }
        const qty = parseNumber(qtyRaw);
        if (!Number.isFinite(qty) || qty <= 0) {
          errors.push({
            line: lineNo,
            raw,
            reason: "La cantidad debe ser mayor que 0.",
          });
          continue;
        }
        const verb = (verbRaw ?? "compra").toLowerCase();
        const sign = verb === "venta" || verb === "-" ? -1 : 1;
        transactions.push({ ticker, date, shares: sign * qty });
        continue;
      }

      const pos = raw.match(POSITION_RE);
      if (pos) {
        const [, tickerRaw, qtyRaw] = pos;
        const ticker = tickerRaw.toUpperCase();
        if (!isKnownTicker(ticker)) {
          errors.push({
            line: lineNo,
            raw,
            reason: `Ticker desconocido: ${ticker}`,
          });
          continue;
        }
        const qty = parseNumber(qtyRaw);
        if (!Number.isFinite(qty) || qty <= 0) {
          errors.push({
            line: lineNo,
            raw,
            reason: "Las acciones deben ser mayor que 0.",
          });
          continue;
        }
        transactions.push({
          ticker,
          date: `${taxYear}-01-01`,
          shares: qty,
        });
        continue;
      }

      errors.push({ line: lineNo, raw, reason: "Formato no reconocido." });
    }
    return { transactions, errors };
  },
};
