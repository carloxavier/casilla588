import { resolveTickerCode } from "../data/tickers";
import { type Adapter, type ImportError, type Transaction } from "./types";

// Tolerant of trailing extra columns so users can paste broker exports or
// spreadsheets that include country/currency/notes alongside ticker+shares.
// Tickers must start with a letter so that malformed date-prefixed lines
// (e.g. "2025 100") fall through to a clear "Formato no reconocido" error
// instead of being misread as a ticker named "2025".
const POSITION_RE =
  /^([A-Za-z][A-Za-z0-9.-]*)[\s,;:|]+(\d+(?:[.,]\d+)?)(?:[\s,;:|].*)?$/;
const MOVEMENT_RE =
  /^(\d{4}-\d{2}-\d{2})\s+([A-Za-z][A-Za-z0-9.-]*)\s+(compra|venta|\+|-)?\s*(\d+(?:[.,]\d+)?)(?:[\s,;:|].*)?$/i;

// Words that strongly suggest a CSV header row. If the first whitespace-
// or-comma-separated field matches one of these case-insensitively, we skip
// the line silently instead of surfacing it as an error.
const HEADER_KEYWORDS = new Set([
  "ticker",
  "tickers",
  "symbol",
  "símbolo",
  "simbolo",
  "shares",
  "qty",
  "quantity",
  "cantidad",
  "acciones",
  "ccy",
  "currency",
  "moneda",
  "country",
  "país",
  "pais",
  "name",
  "nombre",
  "date",
  "fecha",
]);

function looksLikeHeader(line: string): boolean {
  const firstField = line.split(/[\s,;:|]/)[0]?.toLowerCase().trim();
  return firstField !== undefined && HEADER_KEYWORDS.has(firstField);
}

function parseNumber(s: string): number {
  return parseFloat(s.replace(",", "."));
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
      if (looksLikeHeader(raw)) continue;
      const lineNo = i + 1;

      const mov = raw.match(MOVEMENT_RE);
      if (mov) {
        const [, date, tickerRaw, verbRaw, qtyRaw] = mov;
        const ticker = resolveTickerCode(tickerRaw);
        if (!ticker) {
          errors.push({
            line: lineNo,
            raw,
            reason: `Ticker desconocido: ${tickerRaw.toUpperCase()}`,
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
        const ticker = resolveTickerCode(tickerRaw);
        if (!ticker) {
          errors.push({
            line: lineNo,
            raw,
            reason: `Ticker desconocido: ${tickerRaw.toUpperCase()}`,
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
