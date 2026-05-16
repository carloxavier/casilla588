import { describe, expect, it } from "vitest";
import { resolveTickerCode, TICKERS } from "./index";

describe("resolveTickerCode", () => {
  it("resolves the canonical symbol itself (case-insensitive)", () => {
    expect(resolveTickerCode("KO")).toBe("KO");
    expect(resolveTickerCode("ko")).toBe("KO");
    expect(resolveTickerCode("  KO  ")).toBe("KO");
  });

  it("resolves Realty Income's single-letter code", () => {
    expect(resolveTickerCode("O")).toBe("O");
  });

  it("resolves BAT, BATS and BATS.L to the canonical BATS", () => {
    expect(resolveTickerCode("BAT")).toBe("BATS");
    expect(resolveTickerCode("BATS")).toBe("BATS");
    expect(resolveTickerCode("BATS.L")).toBe("BATS");
    expect(resolveTickerCode("bats.l")).toBe("BATS");
  });

  it("returns null for unknown symbols", () => {
    expect(resolveTickerCode("ZZZZZ")).toBeNull();
    expect(resolveTickerCode("BTI")).toBeNull(); // ADR is intentionally not an alias
    expect(resolveTickerCode("")).toBeNull();
  });

  it("aliases never collide with another ticker's canonical code", () => {
    const canonicals = new Set(TICKERS.map((t) => t.t));
    for (const t of TICKERS) {
      for (const alias of t.aliases ?? []) {
        // alias may equal own canonical conceptually, but should never equal a
        // *different* ticker's canonical, or callers will see ambiguous lookups.
        const other = TICKERS.find((x) => x.t === alias && x.t !== t.t);
        expect(other, `alias ${alias} on ${t.t} collides with ${other?.t}`).toBeUndefined();
        expect(canonicals.has(alias) && alias !== t.t).toBe(false);
      }
    }
  });
});
