import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { calcPortfolio } from "../domain/calc";
import { type Transaction } from "../import/types";

const ANIM_POSITIONS: Transaction[] = [
  { ticker: "KO", date: "2025-01-01", shares: 500 },
  { ticker: "JNJ", date: "2025-01-01", shares: 200 },
  { ticker: "NESN", date: "2025-01-01", shares: 250 },
  { ticker: "ROG", date: "2025-01-01", shares: 50 },
  { ticker: "ALV", date: "2025-01-01", shares: 30 },
];

// 2.5 s counting up, 2.5 s holding, then loop. Short and unobtrusive.
const COUNT_MS = 2500;
const LOOP_MS = 5000;

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
}

export function DemoAnimation({ onCta }: { onCta: () => void }) {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(reduced ? 1 : 0);

  const result = useMemo(() => calcPortfolio(ANIM_POSITIONS, 2025), []);

  useEffect(() => {
    if (reduced) {
      setProgress(1);
      return;
    }
    let raf = 0;
    let start: number | null = null;
    const tick = (now: number) => {
      if (start === null) start = now;
      const elapsed = (now - start) % LOOP_MS;
      setProgress(easeOutCubic(Math.min(1, elapsed / COUNT_MS)));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const animatedRecuperable = Math.round(
    result.totals.recuperable588 * progress,
  );

  return (
    <section className="demo" aria-label="Vista previa de la calculadora">
      <div className="demo-window">
        <div className="demo-titlebar" aria-hidden="true">
          <div className="demo-titlebar-dots">
            <span className="demo-dot demo-dot-red" />
            <span className="demo-dot demo-dot-yellow" />
            <span className="demo-dot demo-dot-green" />
          </div>
          <span className="demo-titlebar-title">casilla588.es</span>
          <span className="demo-titlebar-spacer" />
        </div>
        <div className="demo-content">
          <p className="demo-caption">
            Con una cartera de ejemplo de 5 posiciones en 4 países
          </p>
          <div className="demo-number">
            <span className="dn-symbol">€</span>
            <span className="dn-figure">
              {animatedRecuperable.toLocaleString("es-ES")}
            </span>
            <span className="dn-suffix">/año</span>
          </div>
          <p className="demo-result-label">
            recuperables vía <abbr title="Casilla 588 del Modelo 100">588</abbr>
          </p>
          <div
            className="demo-country-bar"
            role="img"
            aria-label="Composición por país"
          >
            {result.byCountry.map((c) => (
              <div
                key={c.country}
                className={`cseg cseg-${c.country}`}
                style={{ flexGrow: c.bruto }}
              />
            ))}
          </div>
          <ul className="demo-country-legend">
            {result.byCountry.map((c) => (
              <li key={c.country}>
                <span className={`cdot cseg-${c.country}`} aria-hidden="true" />
                <span>{c.country}</span>
              </li>
            ))}
          </ul>
          <button type="button" className="demo-cta" onClick={onCta}>
            Probar con mi cartera
          </button>
        </div>
      </div>
    </section>
  );
}
