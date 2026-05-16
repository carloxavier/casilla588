import { type PortfolioResult } from "../domain/calc";
import { fmtEur } from "../domain/format";

export function CountryBreakdown({ result }: { result: PortfolioResult }) {
  const total = result.totals.bruto;
  if (total === 0) return null;
  const ariaLabel = result.byCountry
    .map(
      (c) =>
        `${c.name}: ${Math.round((c.bruto / total) * 100)}%`,
    )
    .join(", ");
  return (
    <section className="country">
      <div className="section-head">
        <h2>Por país</h2>
        <p className="section-sub">
          Cuánto bruto viene de dónde, y cuánto de eso recuperas.
        </p>
      </div>
      <div
        className="country-bar"
        role="img"
        aria-label={`Composición por país: ${ariaLabel}`}
      >
        {result.byCountry.map((c) => (
          <div
            key={c.country}
            className={`cseg cseg-${c.country}`}
            style={{ flexGrow: c.bruto }}
            title={`${c.name}: ${fmtEur(c.bruto, 0)}`}
          />
        ))}
      </div>
      <ul className="country-legend">
        {result.byCountry.map((c) => (
          <li key={c.country}>
            <span className={`cdot cseg-${c.country}`} />
            <span className="cname">{c.name}</span>
            <span className="cbruto">{fmtEur(c.bruto, 0)} bruto</span>
            <span className="crec">{fmtEur(c.recuperable588, 0)} recup.</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
