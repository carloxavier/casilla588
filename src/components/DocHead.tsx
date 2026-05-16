import { RATES_VERIFIED_AT } from "../data/countries";
import { PAYMENTS_VERIFIED_AT } from "../data/tickers";

const verifiedAt =
  RATES_VERIFIED_AT < PAYMENTS_VERIFIED_AT
    ? RATES_VERIFIED_AT
    : PAYMENTS_VERIFIED_AT;

function fmtVerifiedDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function DocHead() {
  return (
    <section className="doc-head">
      <h1>
        Cuánto te <em>retienen</em> en origen sobre tus dividendos extranjeros,
        cuánto recuperas vía IRPF, y cuánto queda atrapado fuera.
      </h1>
      <p className="lede">
        Calculadora de doble imposición sobre dividendos extranjeros vía{" "}
        <abbr title="Casilla 588 del Modelo 100 — IRPF">588</abbr> del Modelo
        100. Para inversores en cazadividendos con cartera internacional.
      </p>
      <div className="meta-strip">
        <span>sin signup</span>
        <span>·</span>
        <span>sin tracking</span>
        <span>·</span>
        <span>todo client-side</span>
      </div>
      <p className="meta-source">
        Datos verificados el {fmtVerifiedDate(verifiedAt)}. Fuentes: BOE, AEAT,
        ECB.
      </p>
    </section>
  );
}
