import { type PortfolioResult } from "../domain/calc";
import { fmtEurInt } from "../domain/format";

export function KeyMoment({ result }: { result: PortfolioResult }) {
  if (result.positions.length === 0 || result.totals.bruto === 0) return null;
  const { totals } = result;
  return (
    <section className="key-moment">
      <p className="km-label">Recuperarías vía casilla 588 del Modelo 100</p>
      <div className="km-figure">
        <span className="km-symbol">€</span>
        <span className="km-number">
          {Math.round(totals.recuperable588).toLocaleString("es-ES")}
        </span>
        <span className="km-suffix">/año</span>
      </div>
      <ul className="km-annotation">
        <li>
          <span>Bruto</span>
          <strong>{fmtEurInt(totals.bruto)}</strong>
        </li>
        <li>
          <span>Retenido en origen</span>
          <strong>{fmtEurInt(totals.retOrigen)}</strong>
        </li>
        <li>
          <span>IRPF tras deducción</span>
          <strong>{fmtEurInt(totals.irpfTrasDeduccion)}</strong>
        </li>
        <li>
          <span>Neto</span>
          <strong>{fmtEurInt(totals.netoFinal)}</strong>
        </li>
        {totals.excesoOrigen > 0.5 && (
          <li className="km-bad">
            <span>Exceso a reclamar</span>
            <strong>{fmtEurInt(totals.excesoOrigen)}</strong>
          </li>
        )}
      </ul>
    </section>
  );
}
