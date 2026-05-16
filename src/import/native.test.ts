import { describe, expect, it } from "vitest";
import { nativeAdapter } from "./native";

const parse = (s: string) => nativeAdapter.parse(s, 2025);

describe("nativeAdapter", () => {
  it("parses a starting holding line", () => {
    const r = parse("KO 100");
    expect(r.errors).toEqual([]);
    expect(r.transactions).toEqual([
      { ticker: "KO", date: "2025-01-01", shares: 100 },
    ]);
  });

  it("accepts comma-separated and decimal comma", () => {
    const r = parse("JNJ, 200,5");
    expect(r.errors).toEqual([]);
    expect(r.transactions[0].shares).toBeCloseTo(200.5);
  });

  it("parses a movement with compra/venta verbs", () => {
    const r = parse(
      "2025-03-15 KO compra 100\n2025-07-20 KO venta 50",
    );
    expect(r.errors).toEqual([]);
    expect(r.transactions).toEqual([
      { ticker: "KO", date: "2025-03-15", shares: 100 },
      { ticker: "KO", date: "2025-07-20", shares: -50 },
    ]);
  });

  it("parses +N / -N shorthand", () => {
    const r = parse("2025-03-15 KO +100\n2025-07-20 KO -50");
    expect(r.transactions[0].shares).toBe(100);
    expect(r.transactions[1].shares).toBe(-50);
  });

  it("flags unknown tickers", () => {
    const r = parse("ZZZZ 100");
    expect(r.transactions).toEqual([]);
    expect(r.errors).toHaveLength(1);
    expect(r.errors[0].reason).toMatch(/desconocido/);
  });

  it("flags malformed lines", () => {
    const r = parse("this is gibberish");
    expect(r.errors).toHaveLength(1);
  });

  it("ignores blank lines and comments", () => {
    const r = parse("# a comment\n\nKO 100\n\n");
    expect(r.errors).toEqual([]);
    expect(r.transactions).toHaveLength(1);
  });

  it("silently skips a CSV header row", () => {
    const r = parse("ticker,shares,country,notes\nKO,100,US,Caso base");
    expect(r.errors).toEqual([]);
    expect(r.transactions).toEqual([
      { ticker: "KO", date: "2025-01-01", shares: 100 },
    ]);
  });

  it("accepts extra trailing columns on position lines", () => {
    const r = parse("KO,100,US,2.00,USD,Caso base US");
    expect(r.errors).toEqual([]);
    expect(r.transactions).toEqual([
      { ticker: "KO", date: "2025-01-01", shares: 100 },
    ]);
  });

  it("accepts extra trailing columns on movement lines", () => {
    const r = parse("2025-03-15 KO compra 50 US 2.00 USD");
    expect(r.errors).toEqual([]);
    expect(r.transactions[0].shares).toBe(50);
  });

  it("rejects digit-prefixed 'tickers' as unrecognized format", () => {
    // Malformed movement (date without dashes). Must not be misread as a
    // position with ticker "2025".
    const r = parse("2025 100");
    expect(r.transactions).toEqual([]);
    expect(r.errors).toHaveLength(1);
    expect(r.errors[0].reason).toBe("Formato no reconocido.");
  });

  describe("regression: CSV with header + metadata columns", () => {
    // Reproduces the user-reported case where a CSV like the one below was
    // rejected wholesale because the position regex was anchored after the
    // share count and the header row didn't match any branch.
    const csv = `ticker,shares,country,annual_dividend_per_share,currency,notes
KO,100,US,2.00,USD,Caso base US con W-8BEN (15%)
JNJ,50,US,5.04,USD,Otro US típico
O,40,US,3.16,USD,REIT mensual — flag esperado
NESN,30,CH,3.10,CHF,Caso crítico Suiza 35%/15%
BAT,80,GB,2.36,GBP,UK 0% retención
SHEL,60,GB,1.29,GBP,Otro UK 0%
ALV,15,DE,15.40,EUR,Alemania 26.375%/15%
ASML,5,NL,6.40,EUR,Países Bajos 15%`;

    it("imports the 6 known tickers and flags the 2 unknown ones", () => {
      const r = parse(csv);
      expect(r.transactions).toEqual([
        { ticker: "KO", date: "2025-01-01", shares: 100 },
        { ticker: "JNJ", date: "2025-01-01", shares: 50 },
        { ticker: "NESN", date: "2025-01-01", shares: 30 },
        { ticker: "SHEL", date: "2025-01-01", shares: 60 },
        { ticker: "ALV", date: "2025-01-01", shares: 15 },
        { ticker: "ASML", date: "2025-01-01", shares: 5 },
      ]);
      expect(r.errors).toHaveLength(2);
      expect(r.errors.map((e) => e.reason)).toEqual([
        "Ticker desconocido: O",
        "Ticker desconocido: BAT",
      ]);
    });

    it("does not emit a 'Formato no reconocido' error for the header row", () => {
      const r = parse(csv);
      expect(
        r.errors.find((e) => e.reason === "Formato no reconocido."),
      ).toBeUndefined();
    });

    it("reports the correct line numbers for the unknown tickers", () => {
      const r = parse(csv);
      // The two errors should point at lines 4 (O) and 6 (BAT) in the
      // original input — header is line 1, KO is 2, JNJ is 3, O is 4,
      // NESN is 5, BAT is 6.
      const oError = r.errors.find((e) => e.reason.includes("O"));
      const batError = r.errors.find((e) => e.reason.includes("BAT"));
      expect(oError?.line).toBe(4);
      expect(batError?.line).toBe(6);
    });
  });
});
