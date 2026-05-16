/**
 * 2025 cash dividend payments for the supported tickers.
 *
 * Each entry has the ex-dividend date, the declared amount in the issuer's
 * payment currency, and the EUR equivalent computed at the ECB reference
 * exchange rate published for that ex-div date (fallback: the most recent
 * prior ECB business day when the date is a weekend or ECB holiday).
 *
 * Source per ticker is cited inline. EUR-denominated payments have
 * amountEur === amount.
 */
export interface DividendPayment {
  exDivDate: string;
  amount: number;
  amountEur: number;
}

export const PAYMENTS_2025: Record<string, DividendPayment[]> = {
  KO: [
    // source: https://stockanalysis.com/stocks/ko/dividend/
    { exDivDate: "2025-03-14", amount: 0.51, amountEur: 0.4684 },
    { exDivDate: "2025-06-13", amount: 0.51, amountEur: 0.443 },
    { exDivDate: "2025-09-15", amount: 0.51, amountEur: 0.4335 },
    { exDivDate: "2025-12-01", amount: 0.51, amountEur: 0.4379 },
  ],
  JNJ: [
    // source: https://stockanalysis.com/stocks/jnj/dividend/
    { exDivDate: "2025-02-18", amount: 1.24, amountEur: 1.1869 },
    { exDivDate: "2025-05-27", amount: 1.3, amountEur: 1.1448 },
    { exDivDate: "2025-08-26", amount: 1.3, amountEur: 1.1153 },
    { exDivDate: "2025-11-25", amount: 1.3, amountEur: 1.1254 },
  ],
  PEP: [
    // source: https://www.dividendmax.com/united-states/nasdaq/beverages/pepsico-inc/dividends
    { exDivDate: "2025-03-07", amount: 1.355, amountEur: 1.248 },
    { exDivDate: "2025-06-06", amount: 1.4225, amountEur: 1.2466 },
    { exDivDate: "2025-09-05", amount: 1.4225, amountEur: 1.2161 },
    { exDivDate: "2025-12-05", amount: 1.4225, amountEur: 1.2216 },
  ],
  MSFT: [
    // source: https://stockanalysis.com/stocks/msft/dividend/
    { exDivDate: "2025-02-20", amount: 0.83, amountEur: 0.7948 },
    { exDivDate: "2025-05-15", amount: 0.83, amountEur: 0.7421 },
    { exDivDate: "2025-08-21", amount: 0.83, amountEur: 0.7131 },
    { exDivDate: "2025-11-20", amount: 0.91, amountEur: 0.7903 },
  ],
  PG: [
    // source: https://www.dividendmax.com/united-states/nyse/household-goods/procter-and-gamble-co/dividends
    { exDivDate: "2025-01-24", amount: 1.0065, amountEur: 0.9611 },
    { exDivDate: "2025-04-21", amount: 1.0568, amountEur: 0.9303 },
    { exDivDate: "2025-07-18", amount: 1.0568, amountEur: 0.9071 },
    { exDivDate: "2025-10-24", amount: 1.0568, amountEur: 0.9101 },
  ],
  MMM: [
    // source: https://stockanalysis.com/stocks/mmm/dividend/
    { exDivDate: "2025-02-14", amount: 0.73, amountEur: 0.6967 },
    { exDivDate: "2025-05-23", amount: 0.73, amountEur: 0.646 },
    { exDivDate: "2025-08-25", amount: 0.73, amountEur: 0.6241 },
    { exDivDate: "2025-11-14", amount: 0.73, amountEur: 0.6267 },
  ],
  XOM: [
    // source: https://stockanalysis.com/stocks/xom/dividend/
    { exDivDate: "2025-02-12", amount: 0.99, amountEur: 0.9547 },
    { exDivDate: "2025-05-15", amount: 0.99, amountEur: 0.8851 },
    { exDivDate: "2025-08-15", amount: 0.99, amountEur: 0.847 },
    { exDivDate: "2025-11-14", amount: 1.03, amountEur: 0.8843 },
  ],
  CVX: [
    // source: https://stockanalysis.com/stocks/cvx/dividend/
    { exDivDate: "2025-02-14", amount: 1.71, amountEur: 1.632 },
    { exDivDate: "2025-05-19", amount: 1.71, amountEur: 1.5184 },
    { exDivDate: "2025-08-19", amount: 1.71, amountEur: 1.4638 },
    { exDivDate: "2025-11-18", amount: 1.71, amountEur: 1.4754 },
  ],
  VZ: [
    // source: https://stockanalysis.com/stocks/vz/dividend/
    { exDivDate: "2025-01-10", amount: 0.6775, amountEur: 0.6575 },
    { exDivDate: "2025-04-10", amount: 0.6775, amountEur: 0.6114 },
    { exDivDate: "2025-07-10", amount: 0.6775, amountEur: 0.5786 },
    { exDivDate: "2025-10-10", amount: 0.69, amountEur: 0.5965 },
  ],
  T: [
    // source: https://stockanalysis.com/stocks/t/dividend/
    { exDivDate: "2025-01-10", amount: 0.2775, amountEur: 0.2693 },
    { exDivDate: "2025-04-10", amount: 0.2775, amountEur: 0.2504 },
    { exDivDate: "2025-07-10", amount: 0.2775, amountEur: 0.237 },
    { exDivDate: "2025-10-10", amount: 0.2775, amountEur: 0.2399 },
  ],
  SHEL: [
    // source: https://stockanalysis.com/quote/lon/SHEL/dividend/
    { exDivDate: "2025-02-13", amount: 0.2779, amountEur: 0.3336 },
    { exDivDate: "2025-05-15", amount: 0.2641, amountEur: 0.3135 },
    { exDivDate: "2025-08-14", amount: 0.2662, amountEur: 0.3092 },
    { exDivDate: "2025-11-13", amount: 0.2685, amountEur: 0.3045 },
  ],
  BP: [
    // source: https://stockanalysis.com/quote/lon/BP/dividend/
    { exDivDate: "2025-02-20", amount: 0.06176, amountEur: 0.0746 },
    { exDivDate: "2025-05-15", amount: 0.05899, amountEur: 0.07 },
    { exDivDate: "2025-08-14", amount: 0.06194, amountEur: 0.0719 },
    { exDivDate: "2025-11-07", amount: 0.06296, amountEur: 0.0715 },
  ],
  AZN: [
    // source: https://stockanalysis.com/quote/lon/AZN/dividend/
    { exDivDate: "2025-02-20", amount: 1.68, amountEur: 2.0284 },
    { exDivDate: "2025-08-07", amount: 0.767, amountEur: 0.8844 },
  ],
  ASML: [
    // source: https://www.asml.com/en/investors/why-invest-in-asml/capital-return-and-financing
    { exDivDate: "2025-04-24", amount: 2.7, amountEur: 2.7 },
    { exDivDate: "2025-07-28", amount: 1.6, amountEur: 1.6 },
    { exDivDate: "2025-10-27", amount: 1.6, amountEur: 1.6 },
  ],
  UNA: [
    // source: https://stockanalysis.com/quote/ams/UNA/dividend/
    { exDivDate: "2025-02-27", amount: 0.5094, amountEur: 0.5094 },
    { exDivDate: "2025-05-15", amount: 0.5094, amountEur: 0.5094 },
    { exDivDate: "2025-08-14", amount: 0.5094, amountEur: 0.5094 },
    { exDivDate: "2025-11-06", amount: 0.5094, amountEur: 0.5094 },
  ],
  HEIA: [
    // source: https://stockanalysis.com/quote/ams/HEIA/dividend/
    { exDivDate: "2025-04-23", amount: 1.17, amountEur: 1.17 },
    { exDivDate: "2025-07-30", amount: 0.74, amountEur: 0.74 },
  ],
  ALV: [
    // source: https://stockanalysis.com/quote/etr/ALV/dividend/
    { exDivDate: "2025-05-09", amount: 15.4, amountEur: 15.4 },
  ],
  SAP: [
    // source: https://stockanalysis.com/quote/etr/SAP/dividend/
    { exDivDate: "2025-05-14", amount: 2.35, amountEur: 2.35 },
  ],
  BAS: [
    // source: https://stockanalysis.com/quote/etr/BAS/dividend/
    { exDivDate: "2025-05-05", amount: 2.25, amountEur: 2.25 },
  ],
  SIE: [
    // source: https://stockanalysis.com/quote/etr/SIE/dividend/
    { exDivDate: "2025-02-14", amount: 5.2, amountEur: 5.2 },
  ],
  MUV2: [
    // source: https://stockanalysis.com/quote/etr/MUV2/dividend/
    { exDivDate: "2025-05-02", amount: 20.0, amountEur: 20.0 },
  ],
  NESN: [
    // source: https://stockanalysis.com/quote/swx/NESN/dividend/
    { exDivDate: "2025-04-22", amount: 3.05, amountEur: 3.2732 },
  ],
  ROG: [
    // source: https://stockanalysis.com/quote/swx/ROG/dividend/
    // FX: 2025-03-27 was Good Friday — used ECB rate from 2025-03-26.
    { exDivDate: "2025-03-27", amount: 9.7, amountEur: 10.1848 },
  ],
  NOVN: [
    // source: https://stockanalysis.com/quote/swx/NOVN/dividend/
    { exDivDate: "2025-03-11", amount: 3.5, amountEur: 3.6428 },
  ],
  ZURN: [
    // source: https://stockanalysis.com/quote/swx/ZURN/dividend/
    // FX: 2025-04-11 was Good Friday — used ECB rate from 2025-04-09.
    { exDivDate: "2025-04-11", amount: 28.0, amountEur: 30.2637 },
  ],
  MC: [
    // source: https://stockanalysis.com/quote/epa/MC/dividend/
    { exDivDate: "2025-04-24", amount: 7.5, amountEur: 7.5 },
    { exDivDate: "2025-12-02", amount: 5.5, amountEur: 5.5 },
  ],
  TTE: [
    // source: https://stockanalysis.com/quote/epa/TTE/dividend/
    { exDivDate: "2025-01-02", amount: 0.79, amountEur: 0.79 },
    { exDivDate: "2025-03-26", amount: 0.79, amountEur: 0.79 },
    { exDivDate: "2025-06-19", amount: 0.85, amountEur: 0.85 },
    { exDivDate: "2025-10-01", amount: 0.85, amountEur: 0.85 },
  ],
  BNP: [
    // source: https://stockanalysis.com/quote/epa/BNP/dividend/
    { exDivDate: "2025-05-19", amount: 4.79, amountEur: 4.79 },
    { exDivDate: "2025-09-26", amount: 2.59, amountEur: 2.59 },
  ],
  SAN: [
    // source: https://stockanalysis.com/quote/epa/SAN/dividend/
    { exDivDate: "2025-05-12", amount: 3.92, amountEur: 3.92 },
  ],
  ENI: [
    // source: https://stockanalysis.com/quote/bit/ENI/dividend/
    { exDivDate: "2025-03-24", amount: 0.25, amountEur: 0.25 },
    { exDivDate: "2025-05-19", amount: 0.25, amountEur: 0.25 },
    { exDivDate: "2025-09-22", amount: 0.26, amountEur: 0.26 },
    { exDivDate: "2025-11-24", amount: 0.26, amountEur: 0.26 },
  ],
  ENEL: [
    // source: https://stockanalysis.com/quote/fra/ENL/dividend/
    { exDivDate: "2025-01-20", amount: 0.215, amountEur: 0.215 },
    { exDivDate: "2025-07-21", amount: 0.255, amountEur: 0.255 },
  ],
  ISP: [
    // source: https://stockanalysis.com/quote/bit/ISP/dividend/
    { exDivDate: "2025-05-19", amount: 0.171, amountEur: 0.171 },
    { exDivDate: "2025-11-24", amount: 0.186, amountEur: 0.186 },
  ],
  G: [
    // source: https://stockanalysis.com/quote/bit/G/dividend/
    { exDivDate: "2025-05-19", amount: 1.43, amountEur: 1.43 },
  ],

  // --- US additions (added 2026-05-16) ---
  KMB: [
    // source: https://stockanalysis.com/stocks/kmb/dividend/
    { exDivDate: "2025-03-07", amount: 1.26, amountEur: 1.1605 },
    { exDivDate: "2025-06-06", amount: 1.26, amountEur: 1.1042 },
    { exDivDate: "2025-09-05", amount: 1.26, amountEur: 1.0772 },
    { exDivDate: "2025-12-05", amount: 1.26, amountEur: 1.082 },
  ],
  CL: [
    // source: https://stockanalysis.com/stocks/cl/dividend/
    { exDivDate: "2025-01-21", amount: 0.5, amountEur: 0.4828 },
    { exDivDate: "2025-04-17", amount: 0.52, amountEur: 0.4577 },
    { exDivDate: "2025-07-18", amount: 0.52, amountEur: 0.4464 },
    { exDivDate: "2025-10-17", amount: 0.52, amountEur: 0.4452 },
  ],
  ABT: [
    // source: https://stockanalysis.com/stocks/abt/dividend/
    { exDivDate: "2025-01-15", amount: 0.59, amountEur: 0.5728 },
    { exDivDate: "2025-04-15", amount: 0.59, amountEur: 0.521 },
    { exDivDate: "2025-07-15", amount: 0.59, amountEur: 0.5058 },
    { exDivDate: "2025-10-15", amount: 0.59, amountEur: 0.5077 },
  ],
  HD: [
    // source: https://stockanalysis.com/stocks/hd/dividend/
    { exDivDate: "2025-03-13", amount: 2.3, amountEur: 2.1237 },
    { exDivDate: "2025-06-05", amount: 2.3, amountEur: 2.0135 },
    { exDivDate: "2025-09-04", amount: 2.3, amountEur: 1.9748 },
    { exDivDate: "2025-12-04", amount: 2.3, amountEur: 1.9715 },
  ],
  LOW: [
    // source: https://stockanalysis.com/stocks/low/dividend/
    { exDivDate: "2025-01-22", amount: 1.15, amountEur: 1.1012 },
    { exDivDate: "2025-04-23", amount: 1.15, amountEur: 1.0074 },
    { exDivDate: "2025-07-23", amount: 1.2, amountEur: 1.0234 },
    { exDivDate: "2025-10-22", amount: 1.2, amountEur: 1.0356 },
  ],
  MCD: [
    // source: https://stockanalysis.com/stocks/mcd/dividend/
    { exDivDate: "2025-03-03", amount: 1.77, amountEur: 1.6914 },
    { exDivDate: "2025-06-02", amount: 1.77, amountEur: 1.55 },
    { exDivDate: "2025-09-02", amount: 1.77, amountEur: 1.5198 },
    { exDivDate: "2025-12-01", amount: 1.86, amountEur: 1.5971 },
  ],
  ADP: [
    // source: https://stockanalysis.com/stocks/adp/dividend/
    { exDivDate: "2025-03-14", amount: 1.54, amountEur: 1.4143 },
    { exDivDate: "2025-06-13", amount: 1.54, amountEur: 1.3377 },
    { exDivDate: "2025-09-12", amount: 1.54, amountEur: 1.3142 },
    { exDivDate: "2025-12-12", amount: 1.7, amountEur: 1.4492 },
  ],
  MDT: [
    // source: https://stockanalysis.com/stocks/mdt/dividend/
    { exDivDate: "2025-03-28", amount: 0.7, amountEur: 0.6483 },
    { exDivDate: "2025-06-27", amount: 0.71, amountEur: 0.6066 },
    { exDivDate: "2025-09-26", amount: 0.71, amountEur: 0.6083 },
    // FX fallback: 2025-12-24 (Dec 25-26 ECB closed)
    { exDivDate: "2025-12-26", amount: 0.71, amountEur: 0.6024 },
  ],
  MO: [
    // source: https://stockanalysis.com/stocks/mo/dividend/
    { exDivDate: "2025-03-25", amount: 1.02, amountEur: 0.9423 },
    { exDivDate: "2025-06-16", amount: 1.02, amountEur: 0.8813 },
    { exDivDate: "2025-09-15", amount: 1.06, amountEur: 0.9009 },
    // FX fallback: 2025-12-24
    { exDivDate: "2025-12-26", amount: 1.06, amountEur: 0.8993 },
  ],
  PM: [
    // source: https://stockanalysis.com/stocks/pm/dividend/
    { exDivDate: "2025-03-20", amount: 1.35, amountEur: 1.2462 },
    { exDivDate: "2025-06-27", amount: 1.35, amountEur: 1.1535 },
    { exDivDate: "2025-09-26", amount: 1.47, amountEur: 1.2594 },
    // FX fallback: 2025-12-24
    { exDivDate: "2025-12-26", amount: 1.47, amountEur: 1.2471 },
  ],
  IBM: [
    // source: https://stockanalysis.com/stocks/ibm/dividend/
    { exDivDate: "2025-02-10", amount: 1.67, amountEur: 1.6182 },
    { exDivDate: "2025-05-09", amount: 1.68, amountEur: 1.4931 },
    { exDivDate: "2025-08-08", amount: 1.68, amountEur: 1.4423 },
    { exDivDate: "2025-11-12", amount: 1.67, amountEur: 1.4426 },
  ],
  WMT: [
    // source: https://dividendhistory.org/payout/WMT/
    { exDivDate: "2025-03-21", amount: 0.235, amountEur: 0.217 },
    { exDivDate: "2025-05-09", amount: 0.235, amountEur: 0.2089 },
    { exDivDate: "2025-08-15", amount: 0.235, amountEur: 0.2011 },
    { exDivDate: "2025-12-12", amount: 0.235, amountEur: 0.2003 },
  ],
  JPM: [
    // source: https://dividendhistory.org/payout/JPM/
    { exDivDate: "2025-01-06", amount: 1.25, amountEur: 1.1989 },
    { exDivDate: "2025-04-04", amount: 1.4, amountEur: 1.2662 },
    { exDivDate: "2025-07-03", amount: 1.4, amountEur: 1.1883 },
    { exDivDate: "2025-10-06", amount: 1.5, amountEur: 1.2845 },
  ],
  BLK: [
    // source: https://stockanalysis.com/stocks/blk/dividend/
    { exDivDate: "2025-03-07", amount: 5.21, amountEur: 4.7987 },
    { exDivDate: "2025-06-05", amount: 5.21, amountEur: 4.561 },
    { exDivDate: "2025-09-05", amount: 5.21, amountEur: 4.4541 },
    { exDivDate: "2025-12-05", amount: 5.21, amountEur: 4.474 },
  ],
  NEE: [
    // source: https://stockanalysis.com/stocks/nee/dividend/
    { exDivDate: "2025-02-28", amount: 0.5665, amountEur: 0.5441 },
    { exDivDate: "2025-06-02", amount: 0.5665, amountEur: 0.4961 },
    { exDivDate: "2025-08-28", amount: 0.5665, amountEur: 0.4852 },
    { exDivDate: "2025-11-21", amount: 0.5665, amountEur: 0.4918 },
  ],
  DUK: [
    // source: https://stockanalysis.com/stocks/duk/dividend/
    { exDivDate: "2025-02-14", amount: 1.045, amountEur: 0.9973 },
    { exDivDate: "2025-05-16", amount: 1.045, amountEur: 0.9335 },
    { exDivDate: "2025-08-15", amount: 1.065, amountEur: 0.9112 },
    // FX fallback: 2025-11-14 (Nov 15 was Saturday)
    { exDivDate: "2025-11-15", amount: 1.065, amountEur: 0.9143 },
  ],
  SO: [
    // source: https://stockanalysis.com/stocks/so/dividend/
    { exDivDate: "2025-02-18", amount: 0.72, amountEur: 0.6892 },
    { exDivDate: "2025-05-19", amount: 0.74, amountEur: 0.6571 },
    { exDivDate: "2025-08-18", amount: 0.74, amountEur: 0.6339 },
    { exDivDate: "2025-11-17", amount: 0.74, amountEur: 0.6383 },
  ],
  TROW: [
    // source: https://stockanalysis.com/stocks/trow/dividend/
    { exDivDate: "2025-03-14", amount: 1.27, amountEur: 1.1663 },
    { exDivDate: "2025-06-13", amount: 1.27, amountEur: 1.1032 },
    { exDivDate: "2025-09-15", amount: 1.27, amountEur: 1.0794 },
    { exDivDate: "2025-12-15", amount: 1.27, amountEur: 1.0806 },
  ],
  ITW: [
    // source: https://stockanalysis.com/stocks/itw/dividend/
    { exDivDate: "2025-03-31", amount: 1.5, amountEur: 1.387 },
    { exDivDate: "2025-06-30", amount: 1.5, amountEur: 1.2799 },
    { exDivDate: "2025-09-30", amount: 1.61, amountEur: 1.3713 },
    { exDivDate: "2025-12-31", amount: 1.61, amountEur: 1.3702 },
  ],
  EMR: [
    // source: https://stockanalysis.com/stocks/emr/dividend/
    { exDivDate: "2025-02-14", amount: 0.5275, amountEur: 0.5034 },
    { exDivDate: "2025-05-16", amount: 0.5275, amountEur: 0.4712 },
    { exDivDate: "2025-08-15", amount: 0.5275, amountEur: 0.4513 },
    { exDivDate: "2025-11-14", amount: 0.555, amountEur: 0.4765 },
  ],
  GILD: [
    // source: https://stockanalysis.com/stocks/gild/dividend/
    { exDivDate: "2025-03-14", amount: 0.79, amountEur: 0.7255 },
    { exDivDate: "2025-06-13", amount: 0.79, amountEur: 0.6862 },
    { exDivDate: "2025-09-15", amount: 0.79, amountEur: 0.6714 },
    { exDivDate: "2025-12-15", amount: 0.79, amountEur: 0.6722 },
  ],
  AMGN: [
    // source: https://stockanalysis.com/stocks/amgn/dividend/
    { exDivDate: "2025-02-14", amount: 2.38, amountEur: 2.2714 },
    { exDivDate: "2025-05-16", amount: 2.38, amountEur: 2.1261 },
    { exDivDate: "2025-08-22", amount: 2.38, amountEur: 2.0503 },
    { exDivDate: "2025-11-21", amount: 2.38, amountEur: 2.066 },
  ],
  ORCL: [
    // source: https://stockanalysis.com/stocks/orcl/dividend/
    { exDivDate: "2025-01-10", amount: 0.4, amountEur: 0.3882 },
    { exDivDate: "2025-04-10", amount: 0.5, amountEur: 0.4512 },
    { exDivDate: "2025-07-10", amount: 0.5, amountEur: 0.427 },
    { exDivDate: "2025-10-09", amount: 0.5, amountEur: 0.4306 },
  ],

  // --- UK additions (added 2026-05-16) ---
  ULVR: [
    // source: https://stockanalysis.com/quote/lon/ULVR/dividend/
    // note: Unilever PLC declares in EUR; we use the LSE Sterling-equivalent
    // amounts for consistency with UK classification (0% WHT via LSE).
    { exDivDate: "2025-02-27", amount: 0.42469, amountEur: 0.5137 },
    { exDivDate: "2025-05-15", amount: 0.43729, amountEur: 0.5191 },
    { exDivDate: "2025-08-14", amount: 0.44055, amountEur: 0.5117 },
    { exDivDate: "2025-11-06", amount: 0.4419, amountEur: 0.5018 },
  ],
  DGE: [
    // source: https://stockanalysis.com/quote/lon/DGE/dividend/
    { exDivDate: "2025-02-27", amount: 0.3148, amountEur: 0.3808 },
    { exDivDate: "2025-10-16", amount: 0.4791, amountEur: 0.5522 },
  ],
  GSK: [
    // source: https://stockanalysis.com/quote/lon/GSK/dividend/
    { exDivDate: "2025-02-20", amount: 0.16, amountEur: 0.1932 },
    { exDivDate: "2025-05-15", amount: 0.16, amountEur: 0.1899 },
    { exDivDate: "2025-08-14", amount: 0.16, amountEur: 0.1858 },
    { exDivDate: "2025-11-13", amount: 0.16, amountEur: 0.1814 },
  ],
  BATS: [
    // source: https://www.dividendmax.com/united-kingdom/london-stock-exchange/tobacco/british-american-tobacco-plc/dividends
    { exDivDate: "2025-03-27", amount: 0.6006, amountEur: 0.7209 },
    { exDivDate: "2025-06-26", amount: 0.6006, amountEur: 0.7037 },
    { exDivDate: "2025-10-02", amount: 0.6006, amountEur: 0.6887 },
    { exDivDate: "2025-12-29", amount: 0.6006, amountEur: 0.6883 },
  ],
  RIO: [
    // source: https://stockanalysis.com/quote/lon/RIO/dividend/
    { exDivDate: "2025-03-06", amount: 1.75988, amountEur: 2.1003 },
    { exDivDate: "2025-08-14", amount: 1.0858, amountEur: 1.2611 },
  ],
  IMB: [
    // source: https://stockanalysis.com/quote/lon/IMB/dividend/
    { exDivDate: "2025-02-20", amount: 0.5426, amountEur: 0.6551 },
    { exDivDate: "2025-05-22", amount: 0.4008, amountEur: 0.4756 },
    { exDivDate: "2025-08-21", amount: 0.4008, amountEur: 0.4631 },
    { exDivDate: "2025-11-27", amount: 0.4008, amountEur: 0.4578 },
  ],

  // --- NL additions (added 2026-05-16) ---
  PHIA: [
    // source: https://www.dividendmax.com/netherlands/euronext-amsterdam/electronic-and-electrical-equipment/koninklijke-philips-nv/dividends
    { exDivDate: "2025-05-12", amount: 0.85, amountEur: 0.85 },
  ],
  AGN: [
    // source: https://stockanalysis.com/quote/ams/AGN/dividend/
    { exDivDate: "2025-06-16", amount: 0.19, amountEur: 0.19 },
    { exDivDate: "2025-09-03", amount: 0.19, amountEur: 0.19 },
  ],
  AD: [
    // source: https://stockanalysis.com/quote/ams/AD/dividend/
    { exDivDate: "2025-04-11", amount: 0.67, amountEur: 0.67 },
    { exDivDate: "2025-08-08", amount: 0.51, amountEur: 0.51 },
  ],
  STM: [
    // source: https://stockanalysis.com/quote/epa/STMPA/dividend/
    // STMicroelectronics declares in USD despite being Dutch-domiciled.
    { exDivDate: "2025-03-24", amount: 0.09, amountEur: 0.0831 },
    { exDivDate: "2025-06-23", amount: 0.09, amountEur: 0.0785 },
    { exDivDate: "2025-09-22", amount: 0.09, amountEur: 0.0764 },
    { exDivDate: "2025-12-15", amount: 0.09, amountEur: 0.0766 },
  ],
  RACE: [
    // source: https://www.ferrari.com/en-EN/corporate/articles/dividend-distribution-proposal-2025
    { exDivDate: "2025-04-22", amount: 2.986, amountEur: 2.986 },
  ],

  // --- DE additions (added 2026-05-16) ---
  BMW: [
    // source: https://stockanalysis.com/quote/etr/BMW/dividend/
    { exDivDate: "2025-05-15", amount: 4.3, amountEur: 4.3 },
  ],
  EOAN: [
    // source: https://stockanalysis.com/quote/etr/EOAN/dividend/
    { exDivDate: "2025-05-16", amount: 0.55, amountEur: 0.55 },
  ],
  BAYN: [
    // source: https://stockanalysis.com/quote/etr/BAYN/dividend/
    // note: cut from €2.40 to €0.11 (legal minimum) due to debt/litigation.
    { exDivDate: "2025-04-28", amount: 0.11, amountEur: 0.11 },
  ],
  DHL: [
    // source: https://stockanalysis.com/quote/etr/DHL/dividend/
    { exDivDate: "2025-05-05", amount: 1.85, amountEur: 1.85 },
  ],
  RWE: [
    // source: https://stockanalysis.com/quote/etr/RWE/dividend/
    { exDivDate: "2025-05-02", amount: 1.1, amountEur: 1.1 },
  ],
  DTE: [
    // source: https://stockanalysis.com/quote/etr/DTE/dividend/
    { exDivDate: "2025-04-10", amount: 0.9, amountEur: 0.9 },
  ],
  FRE: [
    // source: https://stockanalysis.com/quote/etr/FRE/dividend/
    // note: resumed in 2025 after the FY2023 pause.
    { exDivDate: "2025-05-26", amount: 1.0, amountEur: 1.0 },
  ],

  // --- CH additions (added 2026-05-16) ---
  UBSG: [
    // source: https://www.dividendmax.com/switzerland/six-swiss-exchange/banks/ubs-group-ag/dividends
    // UBS declares its dividend in USD despite being Swiss-domiciled.
    { exDivDate: "2025-04-15", amount: 0.9, amountEur: 0.7948 },
  ],
  ABBN: [
    // source: https://stockanalysis.com/quote/swx/ABBN/dividend/
    { exDivDate: "2025-03-31", amount: 0.9, amountEur: 0.9443 },
  ],
  GIVN: [
    // source: https://stockanalysis.com/quote/swx/GIVN/dividend/
    { exDivDate: "2025-03-24", amount: 70.0, amountEur: 73.3445 },
  ],

  // --- FR additions (added 2026-05-16) ---
  AI: [
    // source: https://stockanalysis.com/quote/epa/AI/dividend/
    { exDivDate: "2025-05-19", amount: 3.3, amountEur: 3.3 },
  ],
  OR: [
    // source: https://stockanalysis.com/quote/epa/OR/dividend/
    { exDivDate: "2025-05-05", amount: 7.0, amountEur: 7.0 },
  ],
  SU: [
    // source: https://stockanalysis.com/quote/epa/SU/dividend/
    { exDivDate: "2025-05-13", amount: 3.9, amountEur: 3.9 },
  ],
  DG: [
    // source: https://stockanalysis.com/quote/epa/DG/dividend/
    { exDivDate: "2025-04-22", amount: 3.7, amountEur: 3.7 },
    { exDivDate: "2025-10-14", amount: 1.05, amountEur: 1.05 },
  ],

  // --- IT additions (added 2026-05-16) ---
  UCG: [
    // source: https://stockanalysis.com/quote/bit/UCG/dividend/
    { exDivDate: "2025-04-22", amount: 1.4764, amountEur: 1.4764 },
    { exDivDate: "2025-11-24", amount: 1.4282, amountEur: 1.4282 },
  ],
  MB: [
    // source: https://stockanalysis.com/quote/bit/MB/dividend/
    { exDivDate: "2025-05-19", amount: 0.56, amountEur: 0.56 },
    { exDivDate: "2025-11-24", amount: 0.59, amountEur: 0.59 },
  ],
};

export const PAYMENTS_VERIFIED_AT = "2026-05-16";
