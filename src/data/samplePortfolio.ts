import { type Transaction } from "../import/types";

export const SAMPLE_PORTFOLIO: Transaction[] = [
  { ticker: "KO", date: "2025-01-01", shares: 500 },
  { ticker: "JNJ", date: "2025-01-01", shares: 200 },
  { ticker: "NESN", date: "2025-01-01", shares: 250 },
  { ticker: "ROG", date: "2025-01-01", shares: 50 },
  { ticker: "ALV", date: "2025-01-01", shares: 30 },
  { ticker: "MSFT", date: "2025-03-15", shares: 50 },
  { ticker: "KO", date: "2025-07-20", shares: -100 },
  { ticker: "TTE", date: "2025-09-10", shares: 80 },
];
