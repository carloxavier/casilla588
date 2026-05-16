// Editorial "Configuración" strip above the input section. Currently holds
// one toggle (W-8BEN). Extending to additional toggles in the future is a
// matter of adding rows here and fields to CalcSettings.

export function Settings({
  hasW8Ben,
  onToggleW8Ben,
}: {
  hasW8Ben: boolean;
  onToggleW8Ben: (value: boolean) => void;
}) {
  return (
    <section className="settings">
      <div className="section-head">
        <h2>Configuración</h2>
        <p className="section-sub">
          Cambia esto si tu broker ya te aplica la tasa reducida del convenio
          en origen. Sin tocar nada, calculamos asumiendo retención nominal
          completa.
        </p>
      </div>
      <label className="settings-row">
        <input
          type="checkbox"
          checked={hasW8Ben}
          onChange={(e) => onToggleW8Ben(e.target.checked)}
        />
        <span>
          Tengo <abbr title="Formulario W-8BEN del IRS estadounidense, que reduce la retención en origen al 15% del convenio">W-8BEN</abbr>{" "}
          firmado en mi broker
          <span className="settings-hint">
            (aplica el 15% del convenio directo a dividendos US en lugar del
            30% nominal — el exceso a reclamar desaparece para esas
            posiciones).
          </span>
        </span>
      </label>
    </section>
  );
}
