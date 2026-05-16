import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/masthead.css";
import "./styles/doc-head.css";
import "./styles/demo-anim.css";
import "./styles/input.css";
import "./styles/positions.css";
import "./styles/key-moment.css";
import "./styles/ledger.css";
import "./styles/country.css";
import "./styles/cta.css";
import "./styles/sources.css";
import "./styles/footer.css";
import { App } from "./App";

const root = document.getElementById("root");
if (!root) throw new Error("Root element #root not found");
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
