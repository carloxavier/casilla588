import { useEffect, useRef } from "react";
import { type PortfolioResult } from "../domain/calc";
import { fmtEurInt } from "../domain/format";
import { markMilestone, track } from "../lib/analytics";

export function KeyMoment({ result }: { result: PortfolioResult }) {
  const ref = useRef<HTMLElement | null>(null);
  const firedRef = useRef(false);
  const { totals } = result;
  const hasResult = result.positions.length > 0 && totals.bruto > 0;

  useEffect(() => {
    if (!hasResult) {
      firedRef.current = false;
      return;
    }
    if (firedRef.current) return;
    const target = ref.current;
    if (!target) return;
    if (typeof IntersectionObserver === "undefined") {
      // Fallback: fire immediately if observer isn't available.
      firedRef.current = true;
      markMilestone("view_result");
      track("view_result", {
        net_eur: Math.round(totals.netoFinal),
        recoverable_eur: Math.round(totals.recuperable588),
        non_recoverable_eur: Math.round(totals.excesoOrigen),
      });
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          firedRef.current = true;
          markMilestone("view_result");
          track("view_result", {
            net_eur: Math.round(totals.netoFinal),
            recoverable_eur: Math.round(totals.recuperable588),
            non_recoverable_eur: Math.round(totals.excesoOrigen),
          });
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasResult, totals]);

  if (!hasResult) return null;

  return (
    <section className="key-moment" ref={ref}>
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
