import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { calcPortfolio } from "../domain/calc";
import { fmtEurInt } from "../domain/format";
import { type Transaction } from "../import/types";

const TL = {
  step1End: 3600,
  step2Start: 4000,
  step2End: 7500,
  step3Start: 7700,
  step3End: 10800,
  step4Start: 11200,
  step4End: 14000,
  loopEnd: 14400,
} as const;

const ANIM_POSITIONS: Transaction[] = [
  { ticker: "KO", date: "2025-01-01", shares: 500 },
  { ticker: "JNJ", date: "2025-01-01", shares: 200 },
  { ticker: "NESN", date: "2025-01-01", shares: 250 },
  { ticker: "ROG", date: "2025-01-01", shares: 50 },
  { ticker: "ALV", date: "2025-01-01", shares: 30 },
];

const PASTE_TEXT = "JNJ 200\nNESN 250\nROG 50\nALV 30";

function typed(text: string, start: number, end: number, t: number): string {
  if (t < start) return "";
  if (t >= end) return text;
  const ratio = (t - start) / (end - start);
  const n = Math.min(text.length, Math.floor(ratio * (text.length + 2)));
  return text.slice(0, n);
}

function stepAt(t: number): 1 | 2 | 3 | 4 {
  if (t < TL.step2Start) return 1;
  if (t < TL.step3Start) return 2;
  if (t < TL.step4Start) return 3;
  return 4;
}

export function DemoAnimation({
  onCta,
}: {
  onCta: () => void;
}) {
  const reduced = useReducedMotion();
  const [t, setT] = useState(reduced ? TL.step4Start : 0);
  const [paused, setPaused] = useState(false);
  const startRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number>(0);

  useEffect(() => {
    if (reduced || paused) return;
    let raf = 0;
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now - pausedAtRef.current;
      const elapsed = now - startRef.current;
      const looped = elapsed % TL.loopEnd;
      setT(looped);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, paused]);

  const togglePause = () => {
    if (paused) {
      startRef.current = null;
      setPaused(false);
    } else {
      pausedAtRef.current = t;
      startRef.current = null;
      setPaused(true);
    }
  };

  const restart = () => {
    pausedAtRef.current = 0;
    startRef.current = null;
    setT(0);
    setPaused(false);
  };

  const result = useMemo(() => calcPortfolio(ANIM_POSITIONS, 2025), []);

  const currentStep = stepAt(t);

  // Step 1: type "KO" into manual ticker; then "500" into shares; first row lands.
  const koTicker = typed("KO", 600, 1200, t);
  const koShares = typed("500", 2300, 3000, t);
  const buttonPressed = t > 3400 && t < 3650;
  const firstRowLanded = t > TL.step1End;

  // Step 2: paste appears; textarea typing; remaining 4 positions land.
  const pasteTyped = typed(PASTE_TEXT, 4500, TL.step2End - 600, t);
  const processPressed = t > 7300 && t < 7550;

  const pastedLandedCount = (() => {
    const landingStart = 7500;
    const stagger = 130;
    const totalToLand = ANIM_POSITIONS.length - 1; // 4 from the paste
    if (t < landingStart) return 0;
    const n = Math.floor((t - landingStart) / stagger);
    return Math.min(totalToLand, n);
  })();

  // Step 3: result count-up
  const resultProgress = (() => {
    if (t < TL.step3Start) return 0;
    if (t > 9800) return 1;
    return (t - TL.step3Start) / (9800 - TL.step3Start);
  })();
  const animatedRecuperable = result.totals.recuperable588 * resultProgress;

  // Country bar fill
  const countryFill = (() => {
    if (t < 9800) return 0;
    if (t > 10800) return 1;
    return (t - 9800) / 1000;
  })();

  // Step 4: CTA pulse
  const ctaPulse = t > TL.step4Start && t < TL.step4End;

  const stepLabels = [
    "Añade una posición manualmente",
    "O pega tu cartera entera de golpe",
    "Mira cuánto recuperarías cada año",
    "Pruébalo con tu cartera real",
  ];

  const positionsToShow = firstRowLanded
    ? ANIM_POSITIONS.slice(0, 1 + pastedLandedCount)
    : [];

  return (
    <section
      className={`demo ${reduced ? "demo-reduced" : ""}`}
      aria-label="Demo de la calculadora"
    >
      <div className="demo-head">
        <p className="demo-step">
          <span className="demo-step-num">{currentStep}/4</span>
          {stepLabels[currentStep - 1]}
        </p>
        {!reduced && (
          <div className="demo-controls">
            <button
              type="button"
              className="link-btn"
              onClick={togglePause}
              aria-label={paused ? "Reanudar" : "Pausar"}
            >
              {paused ? "▶" : "❚❚"}
            </button>
            <button
              type="button"
              className="link-btn"
              onClick={restart}
              aria-label="Reiniciar"
            >
              ↺
            </button>
          </div>
        )}
      </div>

      <div className="demo-stage">
        <div className="demo-inputs">
          <div className={`demo-panel ${currentStep === 1 ? "active" : ""}`}>
            <span className="demo-panel-label">Manual</span>
            <div className="demo-row">
              <span className="demo-input">{koTicker || "—"}</span>
              <span className="demo-input">{koShares || "—"}</span>
              <span className={`demo-btn ${buttonPressed ? "pressed" : ""}`}>
                Añadir
              </span>
            </div>
          </div>
          <div className={`demo-panel ${currentStep === 2 ? "active" : ""}`}>
            <span className="demo-panel-label">Pegado masivo</span>
            <pre className="demo-textarea">
              {pasteTyped || "KO 500\nJNJ 200\n…"}
            </pre>
            <span className={`demo-btn ${processPressed ? "pressed" : ""}`}>
              Procesar
            </span>
          </div>
        </div>

        <div className="demo-outputs">
          <ul className="demo-positions" aria-label="Cartera demo">
            {positionsToShow.map((tx) => (
              <li key={tx.ticker} className="demo-position">
                <span className="dp-ticker">{tx.ticker}</span>
                <span className="dp-shares">
                  {tx.shares.toLocaleString("es-ES")}
                </span>
              </li>
            ))}
            {positionsToShow.length === 0 && (
              <li className="demo-position empty">aún nada</li>
            )}
          </ul>

          {/* Always rendered so the slot reserves layout space. Visibility is
              opacity-driven, which keeps mobile scroll position stable while
              the timeline progresses through steps 3 → 4. */}
          <div
            className={`demo-result ${currentStep >= 3 ? "is-visible" : ""}`}
            aria-hidden={currentStep < 3}
          >
            <div className="demo-number">
              <span className="dn-symbol">€</span>
              <span className="dn-figure">
                {Math.round(animatedRecuperable).toLocaleString("es-ES")}
              </span>
              <span className="dn-suffix">/año</span>
            </div>
            <p className="demo-result-label">
              Recuperable vía 588 con esta cartera
            </p>
            <div className="demo-country-bar">
              {result.byCountry.map((c) => (
                <div
                  key={c.country}
                  className={`cseg cseg-${c.country}`}
                  style={{
                    flexGrow: c.bruto * countryFill,
                  }}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            className={`demo-cta ${currentStep === 4 ? "is-visible" : ""} ${ctaPulse ? "pulse" : ""}`}
            onClick={onCta}
            aria-hidden={currentStep < 4}
            tabIndex={currentStep < 4 ? -1 : 0}
          >
            Probar con mi cartera
          </button>
        </div>
      </div>

      {reduced && (
        <p className="demo-static-note">
          Animación pausada por preferencias del sistema. Muestra el resultado
          final con la cartera de ejemplo: {fmtEurInt(result.totals.recuperable588)} recuperables/año.
        </p>
      )}
    </section>
  );
}
