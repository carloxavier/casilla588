import { TICKERS } from "../data/tickers";
import { type Adapter, type ImportError, type Transaction } from "./types";

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (c === '"') {
        inQ = false;
      } else {
        cur += c;
      }
    } else if (c === ",") {
      out.push(cur);
      cur = "";
    } else if (c === '"' && cur.length === 0) {
      inQ = true;
    } else {
      cur += c;
    }
  }
  out.push(cur);
  return out;
}

function parseDdMmYyyy(s: string): string | null {
  const m = s.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!m) return null;
  return `${m[3]}-${m[2]}-${m[1]}`;
}

function parseDecimal(s: string): number {
  // DEGIRO: "1.234,56" or "-50" or "50"
  const cleaned = s.replace(/\./g, "").replace(",", ".");
  return parseFloat(cleaned);
}

function resolveTicker(product: string): string | null {
  const upper = product.toUpperCase();
  // Exact name first
  for (const t of TICKERS) {
    if (upper === t.name.toUpperCase()) return t.t;
  }
  // Then substring match on name
  for (const t of TICKERS) {
    if (upper.includes(t.name.toUpperCase())) return t.t;
  }
  // Then a leading ticker symbol
  for (const t of TICKERS) {
    if (upper.startsWith(t.t + " ") || upper === t.t) return t.t;
  }
  return null;
}

export const degiroAdapter: Adapter = {
  id: "degiro",
  label: "CSV de DEGIRO",
  parse(input) {
    const transactions: Transaction[] = [];
    const errors: ImportError[] = [];
    const lines = input.split(/\r?\n/).filter((l) => l.length > 0);
    if (lines.length < 2) {
      return {
        transactions,
        errors: [
          {
            line: 1,
            raw: input.slice(0, 80),
            reason: "CSV vacío o sin cabecera.",
          },
        ],
      };
    }

    const header = parseCsvLine(lines[0]).map((s) => s.trim().toLowerCase());
    const findCol = (...names: string[]) =>
      names.reduce(
        (acc, n) => (acc >= 0 ? acc : header.findIndex((h) => h === n)),
        -1,
      );
    const idxDate = findCol("datum", "fecha", "date");
    const idxProduct = findCol("product", "producto");
    const idxIsin = findCol("isin");
    const idxQty = findCol("aantal", "cantidad", "quantity");

    if (idxDate < 0 || idxProduct < 0 || idxQty < 0) {
      return {
        transactions,
        errors: [
          {
            line: 1,
            raw: lines[0],
            reason:
              "Cabecera no reconocida. Esperamos columnas Datum, Product, ISIN, Aantal (neerlandés) o sus equivalentes.",
          },
        ],
      };
    }

    for (let i = 1; i < lines.length; i++) {
      const raw = lines[i];
      const cells = parseCsvLine(raw);
      const dateStr = cells[idxDate]?.trim() ?? "";
      const product = cells[idxProduct]?.trim() ?? "";
      const qtyStr = cells[idxQty]?.trim() ?? "";
      const date = parseDdMmYyyy(dateStr);
      if (!date) continue; // metadata/summary row
      const qty = parseDecimal(qtyStr);
      if (!Number.isFinite(qty) || qty === 0) continue;
      const ticker = resolveTicker(product);
      if (!ticker) {
        errors.push({
          line: i + 1,
          raw,
          reason: `Producto "${product}" no está en nuestra lista. Añádelo manualmente o omítelo.`,
        });
        continue;
      }
      transactions.push({ ticker, date, shares: qty });
    }

    // Silence unused-var warning for `_isin`
    void idxIsin;
    return { transactions, errors };
  },
};
