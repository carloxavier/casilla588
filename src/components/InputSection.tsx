import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { TICKERS } from "../data/tickers";
import { SAMPLE_PORTFOLIO } from "../data/samplePortfolio";
import { ADAPTERS } from "../import";
import { type Adapter, type Transaction } from "../import/types";
import { validateRunningShares } from "../domain/transactions";

const TAX_YEAR = 2025;
const YEAR_START = `${TAX_YEAR}-01-01`;
const YEAR_END = `${TAX_YEAR}-12-31`;

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function defaultMovementDate(): string {
  const today = todayIso();
  if (today >= YEAR_START && today <= YEAR_END) return today;
  return YEAR_END;
}

export interface InputSectionHandle {
  focusFirstInput: () => void;
}

export const InputSection = forwardRef<
  InputSectionHandle,
  {
    transactions: Transaction[];
    onChange: (txs: Transaction[]) => void;
  }
>(function InputSection({ transactions, onChange }, ref) {
  const startingRowRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => ({
    focusFirstInput: () => startingRowRef.current?.focus(),
  }));

  const startingHoldings = useMemo(
    () => transactions.filter((tx) => tx.date === YEAR_START),
    [transactions],
  );
  const movements = useMemo(
    () =>
      transactions
        .filter((tx) => tx.date !== YEAR_START)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [transactions],
  );

  const validationErrors = useMemo(
    () => validateRunningShares(transactions),
    [transactions],
  );

  const addStartingHolding = (ticker: string, shares: number) => {
    onChange([
      ...transactions,
      { ticker, date: YEAR_START, shares },
    ]);
  };

  const addMovement = (
    ticker: string,
    date: string,
    shares: number, // signed
  ) => {
    onChange([...transactions, { ticker, date, shares }]);
  };

  const removeAt = (idx: number, dateFilter: string) => {
    // remove the idx-th transaction whose date matches the filter rule
    let found = -1;
    let seen = 0;
    for (let i = 0; i < transactions.length; i++) {
      const isStarting = transactions[i].date === YEAR_START;
      const match = dateFilter === "starting" ? isStarting : !isStarting;
      if (match) {
        if (seen === idx) {
          found = i;
          break;
        }
        seen++;
      }
    }
    if (found < 0) return;
    onChange(transactions.filter((_, i) => i !== found));
  };

  const loadSample = () => onChange(SAMPLE_PORTFOLIO);
  const clearAll = () => onChange([]);

  const isEmpty = transactions.length === 0;

  return (
    <section className="input-section">
      <div className="section-head">
        <h2>Tu cartera</h2>
        {!isEmpty && (
          <button
            type="button"
            className="link-btn"
            onClick={clearAll}
            aria-label="Vaciar cartera"
          >
            vaciar
          </button>
        )}
      </div>

      <div className="input-grid">
        <StartingHoldingsPanel
          firstInputRef={startingRowRef}
          onAdd={addStartingHolding}
        />
        <MovementsPanel onAdd={addMovement} />
      </div>

      <ImportPanel
        onImported={(txs) => onChange([...transactions, ...txs])}
      />

      {isEmpty ? (
        <div className="empty-state">
          Aún no has añadido nada. Empieza por una posición arriba — o{" "}
          <button type="button" className="link-btn" onClick={loadSample}>
            carga la cartera de ejemplo
          </button>{" "}
          para trastear.
        </div>
      ) : (
        <>
          <PositionList
            title={`A 1 de enero de ${TAX_YEAR}`}
            rows={startingHoldings}
            onRemove={(i) => removeAt(i, "starting")}
            showDate={false}
          />
          {movements.length > 0 && (
            <PositionList
              title={`Movimientos durante ${TAX_YEAR}`}
              rows={movements}
              onRemove={(i) => removeAt(i, "movement")}
              showDate
            />
          )}
        </>
      )}

      {validationErrors.length > 0 && (
        <ul className="error-list" aria-live="polite">
          {validationErrors.map((e, i) => (
            <li key={i} className="error-text">
              {e.ticker} · {e.date} — {e.reason}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
});

function TickerAutocomplete({
  inputRef,
  value,
  onChange,
  onSelect,
  placeholder,
  id,
}: {
  inputRef?: React.Ref<HTMLInputElement>;
  value: string;
  onChange: (s: string) => void;
  onSelect: (ticker: string) => void;
  placeholder?: string;
  id?: string;
}) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const upper = value.toUpperCase();

  const matches = useMemo(() => {
    if (!upper) return [] as typeof TICKERS;
    const starts = TICKERS.filter((t) => t.t.startsWith(upper));
    const nameMatch = TICKERS.filter(
      (t) =>
        !t.t.startsWith(upper) && t.name.toUpperCase().includes(upper),
    );
    return [...starts, ...nameMatch].slice(0, 6);
  }, [upper]);

  useEffect(() => {
    setHighlight(0);
  }, [value]);

  const visible = open && matches.length > 0;

  return (
    <div className="autocomplete">
      <input
        ref={inputRef}
        type="text"
        id={id}
        value={value}
        placeholder={placeholder ?? "Ticker"}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 80)}
        onKeyDown={(e) => {
          if (!visible) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlight((h) => Math.min(matches.length - 1, h + 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlight((h) => Math.max(0, h - 1));
          } else if (e.key === "Enter") {
            e.preventDefault();
            const pick = matches[highlight];
            if (pick) {
              onSelect(pick.t);
              setOpen(false);
            }
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={visible}
        aria-controls={`${id}-listbox`}
      />
      {visible && (
        <ul
          className="autocomplete-list"
          id={`${id}-listbox`}
          role="listbox"
        >
          {matches.map((t, i) => (
            <li
              key={t.t}
              role="option"
              aria-selected={i === highlight}
              className={i === highlight ? "highlight" : ""}
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(t.t);
                setOpen(false);
              }}
            >
              <span className="ac-ticker">{t.t}</span>
              <span className="ac-name">{t.name}</span>
              <span className="ac-country">{t.country}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StartingHoldingsPanel({
  firstInputRef,
  onAdd,
}: {
  firstInputRef: React.RefObject<HTMLInputElement>;
  onAdd: (ticker: string, shares: number) => void;
}) {
  const [ticker, setTicker] = useState("");
  const [shares, setShares] = useState("");
  const [err, setErr] = useState("");

  const submit = () => {
    setErr("");
    const t = ticker.toUpperCase().trim();
    if (!TICKERS.some((x) => x.t === t)) {
      setErr("Ticker desconocido.");
      return;
    }
    const n = parseFloat(shares.replace(",", "."));
    if (!Number.isFinite(n) || n <= 0) {
      setErr("Acciones inválidas.");
      return;
    }
    onAdd(t, n);
    setTicker("");
    setShares("");
    firstInputRef.current?.focus();
  };

  return (
    <div className="panel">
      <h3>A 1 de enero de {TAX_YEAR}</h3>
      <p className="panel-sub">Tus posiciones al empezar el año.</p>
      <div className="row-input">
        <TickerAutocomplete
          inputRef={firstInputRef}
          id="start-ticker"
          value={ticker}
          onChange={setTicker}
          onSelect={setTicker}
        />
        <input
          type="text"
          inputMode="decimal"
          placeholder="Acciones"
          value={shares}
          onChange={(e) => setShares(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
        />
        <button type="button" className="btn-primary" onClick={submit}>
          Añadir
        </button>
      </div>
      {err && <p className="error-text">{err}</p>}
    </div>
  );
}

function MovementsPanel({
  onAdd,
}: {
  onAdd: (ticker: string, date: string, shares: number) => void;
}) {
  const [date, setDate] = useState(defaultMovementDate());
  const [ticker, setTicker] = useState("");
  const [side, setSide] = useState<"compra" | "venta">("compra");
  const [shares, setShares] = useState("");
  const [err, setErr] = useState("");

  const submit = () => {
    setErr("");
    const t = ticker.toUpperCase().trim();
    if (!TICKERS.some((x) => x.t === t)) {
      setErr("Ticker desconocido.");
      return;
    }
    const n = parseFloat(shares.replace(",", "."));
    if (!Number.isFinite(n) || n <= 0) {
      setErr("Acciones inválidas.");
      return;
    }
    const signed = side === "venta" ? -n : n;
    onAdd(t, date, signed);
    setTicker("");
    setShares("");
  };

  return (
    <div className="panel">
      <h3>Movimientos durante {TAX_YEAR}</h3>
      <p className="panel-sub">Compras y ventas a lo largo del año.</p>
      <div className="row-input movement-row">
        <input
          type="date"
          value={date}
          min={YEAR_START}
          max={YEAR_END}
          onChange={(e) => setDate(e.target.value)}
        />
        <TickerAutocomplete
          id="mov-ticker"
          value={ticker}
          onChange={setTicker}
          onSelect={setTicker}
        />
        <select
          value={side}
          onChange={(e) => setSide(e.target.value as "compra" | "venta")}
          aria-label="Compra o venta"
        >
          <option value="compra">compra</option>
          <option value="venta">venta</option>
        </select>
        <input
          type="text"
          inputMode="decimal"
          placeholder="Acciones"
          value={shares}
          onChange={(e) => setShares(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
        />
        <button type="button" className="btn-primary" onClick={submit}>
          Apuntar
        </button>
      </div>
      {err && <p className="error-text">{err}</p>}
    </div>
  );
}

function ImportPanel({
  onImported,
}: {
  onImported: (txs: Transaction[]) => void;
}) {
  const [adapterId, setAdapterId] = useState<Adapter["id"]>("native");
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<
    { line: number; raw: string; reason: string }[]
  >([]);
  const [info, setInfo] = useState("");

  const adapter =
    ADAPTERS.find((a) => a.id === adapterId) ?? ADAPTERS[0];

  const ingest = (raw: string) => {
    const result = adapter.parse(raw, TAX_YEAR);
    setErrors(result.errors);
    if (result.transactions.length > 0) {
      onImported(result.transactions);
      setInfo(
        `${result.transactions.length} ${
          result.transactions.length === 1 ? "movimiento" : "movimientos"
        } añadido${result.transactions.length === 1 ? "" : "s"}.`,
      );
      setText("");
    } else if (result.errors.length === 0) {
      setInfo("Nada que importar.");
    } else {
      setInfo("");
    }
  };

  const onFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const content = String(reader.result ?? "");
      ingest(content);
    };
    reader.readAsText(file);
  };

  return (
    <details className="import-panel">
      <summary>Importar de un broker o pegar lista entera</summary>
      <div className="import-body">
        <div className="import-controls">
          <label>
            Formato:{" "}
            <select
              value={adapterId}
              onChange={(e) => setAdapterId(e.target.value as Adapter["id"])}
            >
              {ADAPTERS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
          </label>
          <label className="file-label">
            <input
              type="file"
              accept=".csv,.txt,text/csv,text/plain"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFile(f);
                e.target.value = "";
              }}
            />
            Subir CSV
          </label>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            adapterId === "native"
              ? "Ejemplos:\nKO 500\nJNJ 200\n2025-03-15 MSFT compra 50\n2025-07-20 KO venta 100"
              : "Pega aquí el contenido del CSV de DEGIRO (incluyendo la cabecera)."
          }
          rows={6}
          spellCheck={false}
        />
        <div className="import-actions">
          <button
            type="button"
            className="btn-primary"
            disabled={!text.trim()}
            onClick={() => ingest(text)}
          >
            Procesar
          </button>
          {info && <span className="info-text">{info}</span>}
        </div>
        {errors.length > 0 && (
          <ul className="error-list">
            {errors.slice(0, 4).map((e, i) => (
              <li key={i} className="error-text">
                línea {e.line}: {e.reason}
              </li>
            ))}
            {errors.length > 4 && (
              <li className="error-text">+{errors.length - 4} más</li>
            )}
          </ul>
        )}
      </div>
    </details>
  );
}

function PositionList({
  title,
  rows,
  onRemove,
  showDate,
}: {
  title: string;
  rows: Transaction[];
  onRemove: (idx: number) => void;
  showDate: boolean;
}) {
  if (rows.length === 0) return null;
  return (
    <div className="position-list">
      <h4>{title}</h4>
      <ul>
        {rows.map((tx, i) => {
          const info = TICKERS.find((t) => t.t === tx.ticker);
          const isSell = tx.shares < 0;
          return (
            <li className="position-row" key={`${tx.ticker}-${tx.date}-${i}`}>
              {showDate && (
                <span className="pr-date" data-label="fecha">
                  {tx.date}
                </span>
              )}
              <span className="pr-ticker" data-label="ticker">
                {tx.ticker}
              </span>
              <span className="pr-name" data-label="empresa">
                {info?.name ?? ""}
              </span>
              <span
                className={`pr-shares ${isSell ? "sell" : ""}`}
                data-label={isSell ? "venta" : "acciones"}
              >
                {isSell ? "−" : ""}
                {Math.abs(tx.shares).toLocaleString("es-ES")}
              </span>
              <button
                type="button"
                className="pr-remove"
                onClick={() => onRemove(i)}
                aria-label="Eliminar"
              >
                ✕
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
