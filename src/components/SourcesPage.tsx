import {
  COUNTRIES_2025,
  RATES_NEXT_REVIEW,
  RATES_VERIFIED_AT,
  type CountryCode,
} from "../data/countries";
import { PAYMENTS_VERIFIED_AT } from "../data/tickers";
import { fmtPct } from "../domain/format";

export function SourcesPage() {
  const codes = Object.keys(COUNTRIES_2025) as CountryCode[];
  return (
    <section className="sources">
      <div className="section-head">
        <h2>Sobre los datos</h2>
        <p className="section-sub">
          Tasas de retención en origen por país y referencias normativas. Si
          encuentras una discrepancia, abre un issue.
        </p>
      </div>

      <p className="meta-source">
        Tasas verificadas el {RATES_VERIFIED_AT}. Próxima revisión:{" "}
        {RATES_NEXT_REVIEW}. Dividendos verificados el {PAYMENTS_VERIFIED_AT}.
      </p>

      <ul className="source-cards">
        {codes.map((code) => {
          const c = COUNTRIES_2025[code];
          return (
            <li key={code} className="source-card">
              <header>
                <span className={`cdot cseg-${code}`} />
                <h3>{c.name}</h3>
                <span className="src-code">{code}</span>
              </header>
              <dl>
                <div>
                  <dt>Retención nominal</dt>
                  <dd>{fmtPct(c.nominal, 2)}</dd>
                </div>
                <div>
                  <dt>Reducida por convenio</dt>
                  <dd>{fmtPct(c.treaty, 2)}</dd>
                </div>
                <div>
                  <dt>Recuperable vía 588</dt>
                  <dd>{fmtPct(c.treaty, 2)}</dd>
                </div>
                <div>
                  <dt>Exceso (a reclamar al país de origen)</dt>
                  <dd>{fmtPct(Math.max(0, c.nominal - c.treaty), 2)}</dd>
                </div>
              </dl>
              <p className="src-note">{c.note}</p>
              <p className="src-ref">{c.source}</p>
            </li>
          );
        })}
      </ul>

      <footer className="sources-footer">
        <p>
          Las tasas <em>nominal</em> son las que aplica la hacienda del país
          pagador por defecto a no residentes. Las tasas <em>de convenio</em>{" "}
          son las reducidas por los convenios de doble imposición que España
          tiene firmados con cada país. La{" "}
          <abbr title="Casilla 588 del Modelo 100">casilla 588</abbr> permite
          deducir en tu IRPF español hasta la tasa de convenio. El exceso (si
          el broker te retuvo más) requiere una reclamación separada al país
          de origen.
        </p>
      </footer>
    </section>
  );
}
