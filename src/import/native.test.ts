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
});
