import { describe, expect, it } from "vitest";
import { calcPosition, calcPortfolio, IRPF_RATE } from "./calc";
import { PAYMENTS_2025 } from "../data/tickers/payments-2025";
import { type Transaction } from "../import/types";

const sumAmountEurOnOrAfter = (ticker: string, sharesPerDate: (d: string) => number) =>
  PAYMENTS_2025[ticker].reduce(
    (s, p) => s + p.amountEur * sharesPerDate(p.exDivDate),
    0,
  );

const fullYear = (ticker: string, shares: number): Transaction[] => [
  { ticker, date: "2025-01-01", shares },
];

describe("calcPosition", () => {
  it("returns null for unknown ticker", () => {
    expect(calcPosition(fullYear("ZZZ", 100), "ZZZ", 2025)).toBeNull();
  });

  it("computes a US position held all year (KO, 100 shares) from the payments file", () => {
    const r = calcPosition(fullYear("KO", 100), "KO", 2025);
    expect(r).not.toBeNull();
    expect(r!.paymentsHit).toBe(PAYMENTS_2025.KO.length);
    expect(r!.paymentsTotal).toBe(PAYMENTS_2025.KO.length);
    const expected = sumAmountEurOnOrAfter("KO", () => 100);
    expect(r!.bruto).toBeCloseTo(expected, 4);
    expect(r!.recuperable588).toBeCloseTo(r!.bruto * 0.15, 4);
    expect(r!.retOrigen).toBeCloseTo(r!.bruto * 0.3, 4);
    expect(r!.excesoOrigen).toBeCloseTo(r!.bruto * 0.15, 4);
    expect(r!.irpfTeorico).toBeCloseTo(r!.bruto * IRPF_RATE, 6);
  });

  it("UK with 0% nominal has zero recuperable and zero exceso (held all year)", () => {
    const r = calcPosition(fullYear("SHEL", 100), "SHEL", 2025);
    expect(r!.recuperable588).toBe(0);
    expect(r!.excesoOrigen).toBe(0);
    expect(r!.irpfTrasDeduccion).toBeCloseTo(r!.irpfTeorico, 6);
  });

  it("excludes Q1 dividend when bought after Q1 ex-div date", () => {
    const firstExDiv = PAYMENTS_2025.KO[0].exDivDate;
    const dayAfter = new Date(firstExDiv);
    dayAfter.setDate(dayAfter.getDate() + 1);
    const isoAfter = dayAfter.toISOString().slice(0, 10);
    const txs: Transaction[] = [
      { ticker: "KO", date: isoAfter, shares: 100 },
    ];
    const r = calcPosition(txs, "KO", 2025);
    expect(r!.paymentsHit).toBe(PAYMENTS_2025.KO.length - 1);
    const expected = sumAmountEurOnOrAfter("KO", (d) => (d >= isoAfter ? 100 : 0));
    expect(r!.bruto).toBeCloseTo(expected, 4);
  });

  it("excludes later dividends when sold mid-year", () => {
    const sellDate = "2025-07-01";
    const txs: Transaction[] = [
      { ticker: "KO", date: "2025-01-01", shares: 100 },
      { ticker: "KO", date: sellDate, shares: -100 },
    ];
    const r = calcPosition(txs, "KO", 2025);
    const expectedPayments = PAYMENTS_2025.KO.filter(
      (p) => p.exDivDate <= sellDate,
    ).length;
    expect(r!.paymentsHit).toBe(expectedPayments);
  });

  it("handles bought-then-sold-then-rebought", () => {
    const txs: Transaction[] = [
      { ticker: "KO", date: "2025-01-01", shares: 100 },
      { ticker: "KO", date: "2025-07-01", shares: -100 },
      { ticker: "KO", date: "2025-10-01", shares: 50 },
    ];
    const r = calcPosition(txs, "KO", 2025);
    const expected = sumAmountEurOnOrAfter("KO", (d) => {
      if (d <= "2025-07-01") return d < "2025-07-01" ? 100 : 0;
      if (d >= "2025-10-01") return 50;
      return 0;
    });
    expect(r!.bruto).toBeCloseTo(expected, 4);
  });

  it("German position has recoverable exceso (DE nominal 26.375%, treaty 15%)", () => {
    const r = calcPosition(fullYear("ALV", 10), "ALV", 2025);
    expect(r!.bruto).toBeCloseTo(10 * PAYMENTS_2025.ALV[0].amountEur, 4);
    expect(r!.recuperable588).toBeCloseTo(r!.bruto * 0.15, 4);
    expect(r!.excesoOrigen).toBeCloseTo(r!.bruto * (0.26375 - 0.15), 4);
  });

  it("Swiss position has the largest exceso (CH nominal 35%, treaty 15%)", () => {
    const r = calcPosition(fullYear("NESN", 10), "NESN", 2025);
    expect(r!.excesoOrigen).toBeCloseTo(r!.bruto * 0.2, 4);
  });
});

describe("calcPortfolio", () => {
  it("aggregates totals across mixed countries", () => {
    const txs: Transaction[] = [
      { ticker: "KO", date: "2025-01-01", shares: 100 },
      { ticker: "ALV", date: "2025-01-01", shares: 10 },
    ];
    const r = calcPortfolio(txs, 2025);
    const sum = r.positions.reduce((s, p) => s + p.bruto, 0);
    expect(r.totals.bruto).toBeCloseTo(sum, 6);
    expect(r.byCountry).toHaveLength(2);
  });

  it("ranks countries by bruto descending", () => {
    const txs: Transaction[] = [
      { ticker: "KO", date: "2025-01-01", shares: 100 },
      { ticker: "ALV", date: "2025-01-01", shares: 100 },
    ];
    const r = calcPortfolio(txs, 2025);
    // ALV (~€1540) > KO (~€178) so DE comes first
    expect(r.byCountry[0].country).toBe("DE");
    expect(r.byCountry[1].country).toBe("US");
  });
});
