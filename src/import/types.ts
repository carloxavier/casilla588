export type ISODate = string; // "YYYY-MM-DD"

export interface Transaction {
  ticker: string;
  date: ISODate;
  shares: number; // signed: + buy, − sell
}

export interface ImportError {
  line: number;
  raw: string;
  reason: string;
}

export interface ImportResult {
  transactions: Transaction[];
  errors: ImportError[];
}

export interface Adapter {
  id: "native" | "degiro" | "trade-republic";
  label: string;
  parse(input: string, taxYear: number): ImportResult;
}
