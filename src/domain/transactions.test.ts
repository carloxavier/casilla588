import { describe, expect, it } from "vitest";
import { sharesHeldOn, validateRunningShares } from "./transactions";

describe("sharesHeldOn", () => {
  it("returns 0 for empty portfolio", () => {
    expect(sharesHeldOn([], "KO", "2025-06-01")).toBe(0);
  });

  it("returns the buy amount after the buy date", () => {
    const txs = [{ ticker: "KO", date: "2025-03-15", shares: 100 }];
    expect(sharesHeldOn(txs, "KO", "2025-06-01")).toBe(100);
  });

  it("returns 0 before the buy date", () => {
    const txs = [{ ticker: "KO", date: "2025-03-15", shares: 100 }];
    expect(sharesHeldOn(txs, "KO", "2025-02-01")).toBe(0);
  });

  it("subtracts sells", () => {
    const txs = [
      { ticker: "KO", date: "2025-01-01", shares: 100 },
      { ticker: "KO", date: "2025-06-01", shares: -40 },
    ];
    expect(sharesHeldOn(txs, "KO", "2025-12-31")).toBe(60);
  });

  it("aggregates same-day buys", () => {
    const txs = [
      { ticker: "KO", date: "2025-03-15", shares: 50 },
      { ticker: "KO", date: "2025-03-15", shares: 30 },
    ];
    expect(sharesHeldOn(txs, "KO", "2025-03-15")).toBe(80);
  });

  it("ignores other tickers", () => {
    const txs = [
      { ticker: "KO", date: "2025-01-01", shares: 100 },
      { ticker: "JNJ", date: "2025-01-01", shares: 200 },
    ];
    expect(sharesHeldOn(txs, "KO", "2025-12-31")).toBe(100);
    expect(sharesHeldOn(txs, "JNJ", "2025-12-31")).toBe(200);
  });
});

describe("validateRunningShares", () => {
  it("returns no errors for valid sequence", () => {
    const txs = [
      { ticker: "KO", date: "2025-01-01", shares: 100 },
      { ticker: "KO", date: "2025-06-01", shares: -50 },
    ];
    expect(validateRunningShares(txs)).toEqual([]);
  });

  it("flags oversell", () => {
    const txs = [
      { ticker: "KO", date: "2025-01-01", shares: 100 },
      { ticker: "KO", date: "2025-06-01", shares: -150 },
    ];
    const errors = validateRunningShares(txs);
    expect(errors).toHaveLength(1);
    expect(errors[0].ticker).toBe("KO");
  });
});
