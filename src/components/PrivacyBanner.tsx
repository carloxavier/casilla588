import { useEffect, useState } from "react";
import { buildPath } from "../lib/routing";

const STORAGE_KEY = "c588_privacy_acknowledged";

export function PrivacyBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ack = localStorage.getItem(STORAGE_KEY);
    if (!ack) setVisible(true);
  }, []);

  if (!visible) return null;

  const ack = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore quota / privacy errors */
    }
    setVisible(false);
  };

  return (
    <div className="privacy-banner" role="region" aria-label="Aviso de privacidad">
      <p>
        Esta herramienta registra de forma anónima cómo se usa para mejorarla.
        Sin cookies de terceros, sin tracking entre sitios.{" "}
        <a href={buildPath("privacidad")}>Más información</a>.
      </p>
      <button type="button" onClick={ack} className="btn-primary">
        Entendido
      </button>
    </div>
  );
}
