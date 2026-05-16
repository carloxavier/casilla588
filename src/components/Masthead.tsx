import { type View } from "../App";
import { buildPath } from "../lib/routing";

export function Masthead({
  view,
  onNavigate,
}: {
  view: View;
  onNavigate: (view: View, slug: string) => void;
}) {
  return (
    <header className="masthead">
      <a
        className="wordmark"
        href={buildPath("")}
        onClick={(e) => {
          e.preventDefault();
          onNavigate("calc", "");
        }}
      >
        Casilla <span className="wm-num">588</span>
      </a>
      <nav className="masthead-nav">
        <a
          className={view === "sources" ? "active" : ""}
          href={buildPath("sobre-los-datos")}
          onClick={(e) => {
            e.preventDefault();
            onNavigate("sources", "sobre-los-datos");
          }}
        >
          Sobre los datos
        </a>
      </nav>
    </header>
  );
}
