import { type CountryCode } from "../countries";

export type Currency = "USD" | "EUR" | "CHF" | "GBP";

export interface TickerInfo {
  t: string;
  name: string;
  country: CountryCode;
  ccy: Currency;
}

export const TICKERS: TickerInfo[] = [
  // US
  { t: "KO", name: "Coca-Cola", country: "US", ccy: "USD" },
  { t: "JNJ", name: "Johnson & Johnson", country: "US", ccy: "USD" },
  { t: "PEP", name: "PepsiCo", country: "US", ccy: "USD" },
  { t: "MSFT", name: "Microsoft", country: "US", ccy: "USD" },
  { t: "PG", name: "Procter & Gamble", country: "US", ccy: "USD" },
  { t: "MMM", name: "3M", country: "US", ccy: "USD" },
  { t: "XOM", name: "ExxonMobil", country: "US", ccy: "USD" },
  { t: "CVX", name: "Chevron", country: "US", ccy: "USD" },
  { t: "VZ", name: "Verizon", country: "US", ccy: "USD" },
  { t: "T", name: "AT&T", country: "US", ccy: "USD" },
  { t: "KMB", name: "Kimberly-Clark", country: "US", ccy: "USD" },
  { t: "CL", name: "Colgate-Palmolive", country: "US", ccy: "USD" },
  { t: "ABT", name: "Abbott Laboratories", country: "US", ccy: "USD" },
  { t: "HD", name: "Home Depot", country: "US", ccy: "USD" },
  { t: "LOW", name: "Lowe's", country: "US", ccy: "USD" },
  { t: "MCD", name: "McDonald's", country: "US", ccy: "USD" },
  { t: "ADP", name: "ADP", country: "US", ccy: "USD" },
  { t: "MDT", name: "Medtronic", country: "US", ccy: "USD" },
  { t: "MO", name: "Altria", country: "US", ccy: "USD" },
  { t: "PM", name: "Philip Morris International", country: "US", ccy: "USD" },
  { t: "IBM", name: "IBM", country: "US", ccy: "USD" },
  { t: "WMT", name: "Walmart", country: "US", ccy: "USD" },
  { t: "JPM", name: "JPMorgan Chase", country: "US", ccy: "USD" },
  { t: "BLK", name: "BlackRock", country: "US", ccy: "USD" },
  { t: "NEE", name: "NextEra Energy", country: "US", ccy: "USD" },
  { t: "DUK", name: "Duke Energy", country: "US", ccy: "USD" },
  { t: "SO", name: "Southern Company", country: "US", ccy: "USD" },
  { t: "TROW", name: "T. Rowe Price", country: "US", ccy: "USD" },
  { t: "ITW", name: "Illinois Tool Works", country: "US", ccy: "USD" },
  { t: "EMR", name: "Emerson Electric", country: "US", ccy: "USD" },
  { t: "GILD", name: "Gilead Sciences", country: "US", ccy: "USD" },
  { t: "AMGN", name: "Amgen", country: "US", ccy: "USD" },
  { t: "ORCL", name: "Oracle", country: "US", ccy: "USD" },

  // UK
  { t: "SHEL", name: "Shell", country: "UK", ccy: "GBP" },
  { t: "BP", name: "BP", country: "UK", ccy: "GBP" },
  { t: "AZN", name: "AstraZeneca", country: "UK", ccy: "GBP" },
  { t: "ULVR", name: "Unilever", country: "UK", ccy: "GBP" },
  { t: "DGE", name: "Diageo", country: "UK", ccy: "GBP" },
  { t: "GSK", name: "GSK", country: "UK", ccy: "GBP" },
  { t: "BATS", name: "British American Tobacco", country: "UK", ccy: "GBP" },
  { t: "RIO", name: "Rio Tinto", country: "UK", ccy: "GBP" },
  { t: "IMB", name: "Imperial Brands", country: "UK", ccy: "GBP" },

  // NL
  { t: "ASML", name: "ASML Holding", country: "NL", ccy: "EUR" },
  { t: "UNA", name: "Unilever NV", country: "NL", ccy: "EUR" },
  { t: "HEIA", name: "Heineken", country: "NL", ccy: "EUR" },
  { t: "PHIA", name: "Philips", country: "NL", ccy: "EUR" },
  { t: "AGN", name: "Aegon", country: "NL", ccy: "EUR" },
  { t: "AD", name: "Ahold Delhaize", country: "NL", ccy: "EUR" },
  { t: "STM", name: "STMicroelectronics", country: "NL", ccy: "USD" },
  { t: "RACE", name: "Ferrari", country: "NL", ccy: "EUR" },

  // DE
  { t: "ALV", name: "Allianz", country: "DE", ccy: "EUR" },
  { t: "SAP", name: "SAP", country: "DE", ccy: "EUR" },
  { t: "BAS", name: "BASF", country: "DE", ccy: "EUR" },
  { t: "SIE", name: "Siemens", country: "DE", ccy: "EUR" },
  { t: "MUV2", name: "Munich Re", country: "DE", ccy: "EUR" },
  { t: "BMW", name: "BMW", country: "DE", ccy: "EUR" },
  { t: "EOAN", name: "E.ON", country: "DE", ccy: "EUR" },
  { t: "BAYN", name: "Bayer", country: "DE", ccy: "EUR" },
  { t: "DHL", name: "DHL Group", country: "DE", ccy: "EUR" },
  { t: "RWE", name: "RWE", country: "DE", ccy: "EUR" },
  { t: "DTE", name: "Deutsche Telekom", country: "DE", ccy: "EUR" },
  { t: "FRE", name: "Fresenius", country: "DE", ccy: "EUR" },

  // CH
  { t: "NESN", name: "Nestlé", country: "CH", ccy: "CHF" },
  { t: "ROG", name: "Roche", country: "CH", ccy: "CHF" },
  { t: "NOVN", name: "Novartis", country: "CH", ccy: "CHF" },
  { t: "ZURN", name: "Zurich Insurance", country: "CH", ccy: "CHF" },
  { t: "UBSG", name: "UBS Group", country: "CH", ccy: "USD" },
  { t: "ABBN", name: "ABB", country: "CH", ccy: "CHF" },
  { t: "GIVN", name: "Givaudan", country: "CH", ccy: "CHF" },

  // FR
  { t: "MC", name: "LVMH", country: "FR", ccy: "EUR" },
  { t: "TTE", name: "TotalEnergies", country: "FR", ccy: "EUR" },
  { t: "BNP", name: "BNP Paribas", country: "FR", ccy: "EUR" },
  { t: "SAN", name: "Sanofi", country: "FR", ccy: "EUR" },
  { t: "AI", name: "Air Liquide", country: "FR", ccy: "EUR" },
  { t: "OR", name: "L'Oréal", country: "FR", ccy: "EUR" },
  { t: "SU", name: "Schneider Electric", country: "FR", ccy: "EUR" },
  { t: "DG", name: "Vinci", country: "FR", ccy: "EUR" },

  // IT
  { t: "ENI", name: "Eni", country: "IT", ccy: "EUR" },
  { t: "ENEL", name: "Enel", country: "IT", ccy: "EUR" },
  { t: "ISP", name: "Intesa Sanpaolo", country: "IT", ccy: "EUR" },
  { t: "G", name: "Generali", country: "IT", ccy: "EUR" },
  { t: "UCG", name: "UniCredit", country: "IT", ccy: "EUR" },
  { t: "MB", name: "Mediobanca", country: "IT", ccy: "EUR" },
];
