import { useEffect, useMemo, useRef, useState } from "react";
import { Masthead } from "./components/Masthead";
import { DocHead } from "./components/DocHead";
import { DemoAnimation } from "./components/DemoAnimation";
import { InputSection, type InputSectionHandle } from "./components/InputSection";
import { KeyMoment } from "./components/KeyMoment";
import { Ledger } from "./components/Ledger";
import { CountryBreakdown } from "./components/CountryBreakdown";
import { WaitlistCTA } from "./components/WaitlistCTA";
import { SourcesPage } from "./components/SourcesPage";
import { Footer } from "./components/Footer";
import { calcPortfolio } from "./domain/calc";
import { type Transaction } from "./import/types";
import { buildPath, slugFromLocation } from "./lib/routing";

export type View = "calc" | "sources";

const TAX_YEAR = 2025;

function viewFromPath(path: string): View {
  return slugFromLocation(path).startsWith("sobre-los-datos")
    ? "sources"
    : "calc";
}

export function App() {
  const [view, setView] = useState<View>(() =>
    typeof window === "undefined" ? "calc" : viewFromPath(window.location.pathname),
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const inputRef = useRef<InputSectionHandle>(null);

  useEffect(() => {
    const onPop = () => setView(viewFromPath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (next: View, slug: string) => {
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", buildPath(slug));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setView(next);
  };

  const result = useMemo(
    () => calcPortfolio(transactions, TAX_YEAR),
    [transactions],
  );

  const focusInput = () => {
    const el = document.getElementById("calculator");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => inputRef.current?.focusFirstInput(), 400);
  };

  return (
    <div className="app">
      <div className="page">
        <Masthead view={view} onNavigate={navigate} />
        {view === "sources" ? (
          <SourcesPage />
        ) : (
          <>
            <DocHead />
            <DemoAnimation onCta={focusInput} />
            <div id="calculator">
              <InputSection
                ref={inputRef}
                transactions={transactions}
                onChange={setTransactions}
              />
            </div>
            <KeyMoment result={result} />
            <Ledger result={result} />
            <CountryBreakdown result={result} />
            <WaitlistCTA transactions={transactions} />
          </>
        )}
        <Footer onNavigate={navigate} />
      </div>
    </div>
  );
}
