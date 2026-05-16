import { type PortfolioResult } from "../domain/calc";
import { fmtEur, fmtShares } from "../domain/format";

export function Ledger({ result }: { result: PortfolioResult }) {
  if (result.positions.length === 0) return null;
  const { positions, totals } = result;
  return (
    <section className="ledger">
      <div className="section-head">
        <h2>El detalle</h2>
        <p className="section-sub">
          Posición a posición —{" "}
          <abbr title="Casilla 588 del Modelo 100">588</abbr> es lo que
          recuperas en la declaración.
        </p>
      </div>
      <div className="ledger-scroll">
        <table>
          <thead>
            <tr>
              <th>Ticker</th>
              <th>País</th>
              <th className="num">Acciones</th>
              <th className="num">Bruto</th>
              <th className="num">Retenido</th>
              <th className="num">588 ↓</th>
              <th className="num">Exceso</th>
              <th className="num">IRPF tras</th>
              <th className="num">Neto</th>
              <th>Días</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((p) => (
              <tr key={p.ticker}>
                <td data-label="Ticker">
                  <span className="lg-ticker">{p.ticker}</span>
                  <span className="lg-name">{p.name}</span>
                </td>
                <td data-label="País">{p.country}</td>
                <td data-label="Acciones" className="num">
                  {fmtShares(p.sharesEoy)}
                </td>
                <td data-label="Bruto" className="num">
                  {fmtEur(p.bruto, 2)}
                </td>
                <td data-label="Retenido" className="num">
                  {fmtEur(p.retOrigen, 2)}
                </td>
                <td data-label="Recuperable 588" className="num lg-good">
                  {fmtEur(p.recuperable588, 2)}
                </td>
                <td data-label="Exceso" className="num lg-bad">
                  {p.excesoOrigen > 0.005 ? fmtEur(p.excesoOrigen, 2) : "—"}
                </td>
                <td data-label="IRPF tras" className="num">
                  {fmtEur(p.irpfTrasDeduccion, 2)}
                </td>
                <td data-label="Neto" className="num">
                  {fmtEur(p.netoFinal, 2)}
                </td>
                <td data-label="Cobertura" className="lg-cover">
                  {p.paymentsTotal > 0
                    ? `${p.paymentsHit}/${p.paymentsTotal} divid.`
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="totals">
              <td colSpan={3}>Total</td>
              <td className="num">{fmtEur(totals.bruto, 2)}</td>
              <td className="num">{fmtEur(totals.retOrigen, 2)}</td>
              <td className="num lg-good">
                {fmtEur(totals.recuperable588, 2)}
              </td>
              <td className="num lg-bad">
                {totals.excesoOrigen > 0.005
                  ? fmtEur(totals.excesoOrigen, 2)
                  : "—"}
              </td>
              <td className="num">{fmtEur(totals.irpfTrasDeduccion, 2)}</td>
              <td className="num">{fmtEur(totals.netoFinal, 2)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
