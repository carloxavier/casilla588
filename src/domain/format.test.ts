import { describe, expect, it } from "vitest";
import { fmtEur, fmtPct } from "./format";

describe("format", () => {
  it("formats euros with the € symbol", () => {
    expect(fmtEur(1234, 0)).toMatch(/€/);
  });

  it("uses comma as decimal separator (es-ES)", () => {
    expect(fmtEur(12.5, 2)).toContain(",");
    expect(fmtPct(0.19, 2)).toContain("19,00");
  });

  it("formats percentages with the given decimals", () => {
    expect(fmtPct(0.5, 1)).toContain("50,0");
  });
});
