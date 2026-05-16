import { useEffect, useMemo, useRef, useState } from "react";
import { Masthead } from "./components/Masthead";
import { DocHead } from "./components/DocHead";
import { DemoAnimation } from "./components/DemoAnimation";
import { InputSection, type InputSectionHandle } from "./components/InputSection";
import { Settings } from "./components/Settings";
import { KeyMoment } from "./components/KeyMoment";
import { Ledger } from "./components/Ledger";
import { CountryBreakdown } from "./components/CountryBreakdown";
import { WaitlistCTA } from "./components/WaitlistCTA";
import { SourcesPage } from "./components/SourcesPage";
import { PrivacyPage } from "./components/PrivacyPage";
import { PrivacyBanner } from "./components/PrivacyBanner";
import { Footer } from "./components/Footer";
import { calcPortfolio, type CalcSettings } from "./domain/calc";
import { TICKERS } from "./data/tickers";
import { type Transaction } from "./import/types";
import { buildPath, slugFromLocation } from "./lib/routing";
import { markMilestone, track } from "./lib/analytics";

export type View = "calc" | "sources" | "privacy";

const TAX_YEAR = 2025;
const W8BEN_STORAGE_KEY = "c588_settings_w8ben";

function viewFromPath(path: string): View {
  const slug = slugFromLocation(path);
  if (slug.startsWith("sobre-los-datos")) return "sources";
  if (slug.startsWith("privacidad")) return "privacy";
  return "calc";
}

export function App() {
  const [view, setView] = useState<View>(() =>
    typeof window === "undefined" ? "calc" : viewFromPath(window.location.pathname),
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hasW8Ben, setHasW8Ben] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(W8BEN_STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });
  const inputRef = useRef<InputSectionHandle>(null);
  const calculatedRef = useRef(false);

  const settings: CalcSettings = useMemo(
    () => ({ hasW8Ben }),
    [hasW8Ben],
  );

  const onToggleW8Ben = (value: boolean) => {
    try {
      window.localStorage.setItem(W8BEN_STORAGE_KEY, value ? "1" : "0");
    } catch {
      /* ignore quota / privacy errors */
    }
    setHasW8Ben(value);
    const usCount = transactions.reduce((n, tx) => {
      const info = TICKERS.find((t) => t.t === tx.ticker);
      return info?.country === "US" ? n + 1 : n;
    }, 0);
    track("w8ben_toggled", {
      value,
      position_count: transactions.length,
      us_position_count: usCount,
    });
  };

  useEffect(() => {
    track("visit", { view });
    // intentional: fire only once per page-load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    () => calcPortfolio(transactions, TAX_YEAR, settings),
    [transactions, settings],
  );

  // Fire `calculate` once per non-empty portfolio. Reset when the user empties
  // the portfolio so that a re-build counts again.
  useEffect(() => {
    if (transactions.length === 0) {
      calculatedRef.current = false;
      return;
    }
    if (calculatedRef.current) return;
    if (result.totals.bruto <= 0) return;
    calculatedRef.current = true;
    markMilestone("calculate");
    track("calculate", {
      total_positions: result.positions.length,
      countries: result.byCountry.map((c) => c.country),
      total_gross_eur: Math.round(result.totals.bruto),
    });
  }, [result, transactions.length]);

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
        ) : view === "privacy" ? (
          <PrivacyPage />
        ) : (
          <>
            <DocHead />
            <DemoAnimation onCta={focusInput} />
            <div id="calculator">
              <Settings
                hasW8Ben={hasW8Ben}
                onToggleW8Ben={onToggleW8Ben}
              />
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
      <PrivacyBanner onNavigate={navigate} />
    </div>
  );
}
