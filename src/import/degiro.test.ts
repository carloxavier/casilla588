import { describe, expect, it } from "vitest";
import { degiroAdapter } from "./degiro";

const HEADER = "Datum,Tijd,Product,ISIN,Beurs,Reference,Venue,Aantal,Koers";

describe("degiroAdapter", () => {
  it("parses a basic buy row", () => {
    const csv = [
      HEADER,
      "15-03-2025,10:32,Coca-Cola,US1912161007,NYSE,X,X,100,42,50",
    ].join("\n");
    const r = degiroAdapter.parse(csv, 2025);
    expect(r.transactions).toEqual([
      { ticker: "KO", date: "2025-03-15", shares: 100 },
    ]);
  });

  it("parses sells as negative shares", () => {
    const csv = [
      HEADER,
      "20-07-2025,10:00,Coca-Cola,US1912161007,NYSE,X,X,-100,42",
    ].join("\n");
    const r = degiroAdapter.parse(csv, 2025);
    expect(r.transactions[0].shares).toBe(-100);
  });

  it("skips rows with non-date values in date column (dividends, summaries)", () => {
    const csv = [
      HEADER,
      ",,Dividend cash,,,,,,",
      "15-03-2025,10:00,Allianz,DE0008404005,XETRA,X,X,10,300,00",
    ].join("\n");
    const r = degiroAdapter.parse(csv, 2025);
    expect(r.transactions).toHaveLength(1);
    expect(r.transactions[0].ticker).toBe("ALV");
  });

  it("reports unknown products without crashing", () => {
    const csv = [
      HEADER,
      "15-03-2025,10:00,Tesla Inc,US88160R1014,NASDAQ,X,X,5,250",
    ].join("\n");
    const r = degiroAdapter.parse(csv, 2025);
    expect(r.transactions).toEqual([]);
    expect(r.errors).toHaveLength(1);
  });

  it("rejects unrecognized headers", () => {
    const csv = "foo,bar,baz\n1,2,3";
    const r = degiroAdapter.parse(csv, 2025);
    expect(r.errors).toHaveLength(1);
    expect(r.errors[0].reason).toMatch(/Cabecera/);
  });
});
