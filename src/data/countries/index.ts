import { COUNTRIES_2025, type CountryCode, type CountryInfo } from "./2025";

export { COUNTRIES_2025, RATES_VERIFIED_AT, RATES_NEXT_REVIEW } from "./2025";
export type { CountryCode, CountryInfo };

export function getCountries(
  taxYear: number,
): Record<CountryCode, CountryInfo> {
  switch (taxYear) {
    case 2025:
      return COUNTRIES_2025;
    default:
      throw new Error(`Unsupported tax year: ${taxYear}`);
  }
}
