import { buildPath } from "../lib/routing";

export function Footer({
  onNavigate,
}: {
  onNavigate: (view: "sources", slug: string) => void;
}) {
  return (
    <footer className="site-footer">
      <p className="footer-caveat">
        Esta calculadora es una herramienta orientativa, no asesoramiento
        fiscal. Las cifras dependen de tu situación personal, los formularios
        que hayas presentado al broker (W-8BEN, 5000, etc.) y el tramo de IRPF
        marginal que te aplique. Para tu declaración, consulta a un asesor o
        a la AEAT.
      </p>
      <p className="footer-attr">
        Hecho en Madrid. Datos abiertos.{" "}
        <a
          href={buildPath("sobre-los-datos")}
          onClick={(e) => {
            e.preventDefault();
            onNavigate("sources", "sobre-los-datos");
          }}
        >
          Sobre los datos
        </a>
        .
      </p>
    </footer>
  );
}
