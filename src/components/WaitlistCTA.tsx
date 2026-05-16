import { useEffect, useRef, useState } from "react";
import {
  isValidEmail,
  submitWaitlist,
  type WaitlistPayload,
} from "../api/waitlist";
import { type Transaction } from "../import/types";
import { secondsSince, track } from "../lib/analytics";

export function WaitlistCTA({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [email, setEmail] = useState("");
  const [keep, setKeep] = useState(false);
  const [missingTickers, setMissingTickers] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "ok" | "error"
  >("idle");
  const [err, setErr] = useState("");

  const sectionRef = useRef<HTMLElement | null>(null);
  const ctaViewedRef = useRef(false);

  useEffect(() => {
    if (ctaViewedRef.current) return;
    const target = sectionRef.current;
    if (!target) return;
    if (typeof IntersectionObserver === "undefined") {
      ctaViewedRef.current = true;
      track("cta_viewed", {
        seconds_since_calculate: secondsSince("calculate"),
      });
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          ctaViewedRef.current = true;
          track("cta_viewed", {
            seconds_since_calculate: secondsSince("calculate"),
          });
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setErr("Email no parece válido.");
      track("email_error", { error_type: "invalid_email" });
      return;
    }
    setErr("");
    setStatus("submitting");
    const payload: WaitlistPayload = { email };
    if (keep && transactions.length > 0) {
      payload.portfolio = {
        positions: transactions,
        snapshot_at: new Date().toISOString(),
      };
    }
    const trimmed = missingTickers.trim();
    if (trimmed.length > 0) {
      payload.missingTickers = trimmed.slice(0, 500);
    }
    const res = await submitWaitlist(payload);
    if (res.ok) {
      setStatus("ok");
      track("email_submitted", {
        has_saved_cartera: Boolean(payload.portfolio),
        had_missing_tickers: Boolean(payload.missingTickers),
        seconds_since_result: secondsSince("view_result"),
      });
    } else {
      setStatus("error");
      setErr(res.error ?? "No se pudo enviar.");
      track("email_error", {
        error_type: res.error ?? "network_or_server",
      });
    }
  };

  if (status === "ok") {
    return (
      <section className="cta cta-ok" ref={sectionRef}>
        <p className="cta-ok-mark">✓</p>
        <h2>Apuntado.</h2>
        <p>
          {missingTickers.trim()
            ? "Tenemos tu petición de tickers y te avisamos cuando los añadamos."
            : keep
              ? "Te avisamos cuando esté lista la versión que analiza tu cartera automáticamente cada semana."
              : "Te avisamos cuando esté lista la versión automática. Sin spam — solo el lanzamiento."}
        </p>
      </section>
    );
  }

  return (
    <section className="cta" ref={sectionRef}>
      <div className="cta-copy">
        <h2>¿Quieres una versión que haga esto solo cada semana?</h2>
        <p>
          Apúntate a la lista y te avisamos cuando la versión automática esté
          lista — análisis semanal de tu cartera, sin volver a pegar nada.
        </p>
      </div>
      <form onSubmit={onSubmit} className="cta-form" noValidate>
        <input
          type="email"
          value={email}
          placeholder="tu@email.es"
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email"
          required
        />
        <label className="cta-keep">
          <input
            type="checkbox"
            checked={keep}
            onChange={(e) => setKeep(e.target.checked)}
            disabled={transactions.length === 0}
          />
          Guarda mi cartera
        </label>
        <label className="cta-missing">
          <span>¿Te faltan tickers? Dinos cuáles (opcional)</span>
          <textarea
            value={missingTickers}
            onChange={(e) => setMissingTickers(e.target.value.slice(0, 500))}
            placeholder="IBE, REP, BBVA…"
            rows={2}
            spellCheck={false}
          />
        </label>
        <button
          type="submit"
          className="btn-primary cta-btn"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Enviando…" : "Apuntarme"}
        </button>
        {err && <p className="error-text">{err}</p>}
      </form>
    </section>
  );
}
