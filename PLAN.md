# Casilla 588 — development plan

A port of the Claude Design handoff `Calculadora de Dividendos` into a
production app, shipped as a new standalone repo and product
(`casilla588.es`). This document captures the plan; implementation lives
elsewhere.

---

## 1. What we are building

A single-page calculator that tells a Spanish dividend investor how much
of the foreign-withholding tax on their dividends they can recover via
**casilla 588 of Modelo 100** of the IRPF, plus how much extra is stuck
at origin and would need a separate reclaim. The hero animates a
4-step tutorial; the body lets the user compose a portfolio (manual
entry or paste); the result block leads with one large number; a ledger
and a country breakdown justify it; a waitlist CTA captures emails for
the future automated product. A "Sobre los datos" view lists every
country tax rate with its BOE/AEAT source.

**Naming and brand** (from the chat transcript): wordmark `Casilla 588`,
domain `casilla588.es`, tagline framing around "calculadora de doble
imposición sobre dividendos extranjeros". The number "588" is the
recognition signal for the target user (cazadividendos) — keep it
prominent in masthead, title, meta tags.

**Scope decisions** (confirmed):

- **Standalone repo + product**, not a route inside this repo.
- **Email CTA writes to a new dedicated `casilla_waitlist` table** (not
  the existing digest subscribers).
- **Editorial style only.** Drop the Tweaks panel and the
  Terminal/Boletín variants and the density toggle from the prototype.
- **Year-scoped tax rates.** Country rates live in
  `data/countries/{year}.ts`. v1 ships 2025 only; the calculator takes
  `taxYear` as a parameter from day one so future years are a data PR.
- **Per-payment dividend data.** Each ticker has a list of declared
  dividends (`exDivDate`, `amount` in source currency, `amountEur` baked
  at data-entry time using the ECB reference rate on the ex-div date).
  The annual figure is *summed*, not stored — keeps the data honest and
  unblocks partial-year holdings.
- **Transaction-based portfolio.** The portfolio is a list of signed
  transactions (`{ticker, date, shares}`), not a snapshot of positions.
  Required for correctness: a static-position model overstates
  recuperable for mid-year buyers and understates for sellers.
- **Two import formats in v1**: a native paste format (`2025-03-15 KO
  compra 100` plus `+100`/`-50` shorthand) and DEGIRO CSV (via file
  upload *or* pasted text). All imports go through an adapter layer so
  Trade Republic, IBKR and others can be added without touching the
  calculator. Trade Republic is v1.5.

## 2. Source materials

The handoff bundle is at:
`https://api.anthropic.com/v1/design/h/V0lVqZbUUNdoYlshVgFBcA?open_file=index.html`
(downloads as `Calculadora de Dividendos-handoff.tar.gz`, ~264 KB).

Key files to mirror behavior from:

| File | Role |
|---|---|
| `project/index.html` | Document head, font/script imports, mount point. |
| `project/app.jsx` | All UI components: `Masthead`, `DocHead`, `DemoPreview` (static, replaced by animation), `InputSection`, `KeyMoment`, `Ledger`, `CountryBreakdown`, `CTA`, `SourcesPage`, `Footer`, `App`. |
| `project/demo-animation.jsx` | The 14-second hero tutorial: timeline, easing helpers, 4 steps (manual add → paste → reveal cifra → CTA pulse), with pause/restart controls. |
| `project/data.js` | `COUNTRIES` (7 countries, nominal vs treaty rates, notes), `TICKERS` (33 entries), `SAMPLE_PORTFOLIO`, `calcPosition`, `calcPortfolio`, `fmtEur`, `fmtPct`, `IRPF_RATE = 0.19`. |
| `project/styles.css` | Design tokens, paper-grain effect, layout, all component styles, responsive breakpoints (760px, 540px). |
| `project/tweaks-panel.jsx` | **Skip** — design-only scaffolding, not for production. |
| `chats/chat1.md` | Intent + iteration history. The hero animation requirement and the "remove auto-loaded portfolio" decision both come from here. |

## 3. Recommended stack

The prototype uses React 18 UMD + Babel-in-browser + plain CSS. For
production we want the same React surface but a real toolchain:

- **Vite 5 + React 18 + TypeScript (strict)**.
- **Plain CSS or CSS Modules**, not Tailwind. The design depends on
  CSS variables for tokens and on hand-tuned editorial type — Tailwind
  would obscure both. (One CSS file is fine; the prototype is already
  organized as one and is ~1.5k lines, which is small.)
- **No UI component library.** The widgets (autocomplete, textarea,
  table, segmented bar) are bespoke and small.
- **Google Fonts**: Source Serif 4, Inter, JetBrains Mono — same
  imports as the prototype.
- **Hosting**: initially **GitHub Pages** from the repo (free, zero-setup
  preview at `https://<user>.github.io/casilla588/`). The Vite `base` is
  driven by a `BASE_PATH` env var so the same code builds for `/casilla588/`
  on GH Pages and `/` for the eventual custom domain. Routing helpers in
  `src/lib/routing.ts` keep all internal links base-aware. Migration to
  Cloudflare Pages / Netlify (custom domain `casilla588.es`) is a config
  change, not a code change.
- **Backend**: a new Supabase project. Postgres for the waitlist
  table, one Edge Function (Deno) for the public insert. Recommended
  over piggybacking on the existing project so the products keep
  separate billing and access boundaries.

## 4. Repository layout (target)

```
casilla-588/
├── README.md                  # public-facing readme + dev quickstart
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html                 # ports project/index.html (no UMD/Babel)
├── public/
│   └── og-image.png           # social card with "588 €/año" mock
├── src/
│   ├── main.tsx               # ReactDOM root
│   ├── App.tsx                # top-level shell + route between calc and sources
│   ├── components/
│   │   ├── Masthead.tsx
│   │   ├── DocHead.tsx
│   │   ├── DemoAnimation.tsx  # ports demo-animation.jsx
│   │   ├── InputSection.tsx
│   │   ├── KeyMoment.tsx
│   │   ├── Ledger.tsx
│   │   ├── CountryBreakdown.tsx
│   │   ├── WaitlistCTA.tsx
│   │   ├── SourcesPage.tsx
│   │   └── Footer.tsx
│   ├── data/
│   │   ├── countries/
│   │   │   ├── 2025.ts        # COUNTRIES_2025, typed
│   │   │   └── index.ts       # getCountries(taxYear)
│   │   ├── tickers/
│   │   │   ├── tickers.ts     # TICKERS (static metadata)
│   │   │   ├── payments-2025.ts  # per-ticker dividend payments
│   │   │   └── index.ts       # getTickerAnnual(ticker, taxYear)
│   │   ├── sources.ts         # BOE refs + ECB FX source URL
│   │   └── samplePortfolio.ts # sample Transaction[]
│   ├── domain/
│   │   ├── calc.ts            # transaction-aware calcPosition/Portfolio (pure)
│   │   ├── transactions.ts    # sharesHeldOn, running-sum validation (pure)
│   │   └── format.ts          # fmtEur, fmtPct
│   ├── import/
│   │   ├── types.ts           # Transaction, ImportResult, Adapter
│   │   ├── native.ts          # native paste parser
│   │   └── degiro.ts          # DEGIRO CSV → Transaction[]
│   ├── api/
│   │   └── waitlist.ts        # POST to Supabase edge function
│   ├── styles/
│   │   ├── tokens.css         # :root vars (paper, ink, accent, type, gaps)
│   │   ├── base.css           # reset, body, grain, typography utilities
│   │   ├── layout.css         # .page, .section, .section-head, masthead
│   │   ├── doc-head.css
│   │   ├── input.css
│   │   ├── positions.css
│   │   ├── key-moment.css
│   │   ├── ledger.css
│   │   ├── country.css
│   │   ├── cta.css
│   │   ├── sources.css
│   │   ├── footer.css
│   │   └── demo-anim.css
│   ├── hooks/
│   │   └── useReducedMotion.ts
│   └── __tests__/             # unit tests (Vitest)
└── supabase/
    ├── migrations/
    │   └── 0001_casilla_waitlist.sql
    └── functions/
        └── waitlist-signup/
            └── index.ts
```

## 5. Component port plan

For each component below: **what it does**, **gotchas while porting**,
**typing notes**.

### 5.1 `Masthead`
- Wordmark "Casilla 588" with the "588" rendered in mono-accent.
- Single nav link toggles `<SourcesPage />` vs the calculator view (in
  prototype this is local state; can be a `<Link>` on `/sobre-los-datos`
  if we want share-able URLs — recommended, makes SEO trivially better).

### 5.2 `DocHead`
- H1 with one italicized accent word (`<em>retienen</em>`). The
  `text-wrap: balance` on H1 and `text-wrap: pretty` on the lede
  matter; preserve them.
- Meta strip: "sin signup · sin tracking · todo client-side", BOE
  source line, "Datos verificados <date>". The verified-date string
  should be a build-time constant fed from `data/countries.ts` so it
  cannot drift from the rate table.

### 5.3 `DemoAnimation` (the hero)
This is the single most complex component. The prototype uses a
`requestAnimationFrame` loop driven by a 14.4-second timeline (`TL`
object), with derived booleans for which input is "focused", which
key was just typed, which positions have "landed".

Port plan:

- Keep the `TL` constant verbatim (`demo-animation.jsx:20-53`) as a
  typed `Timeline` record.
- Keep helpers: `clamp`, `easeOutCubic`, `easeInOut`, `typed`,
  `rampUp`, `rampDown`, `pulseAround`, `stepAt`. Move to
  `domain/animation.ts` as pure functions (testable).
- The component holds `t` in state and updates via rAF. **Important**:
  call `setT` inside `requestAnimationFrame`, not on a fixed interval,
  so it stays in sync with display refresh.
- **Reduced motion**: if `useReducedMotion()` returns true, render the
  end-state of step 4 (positions populated, cifra revealed, CTA
  visible) statically and skip the rAF loop. Pause/restart controls
  still visible but no-op.
- **Pause/restart**: keep `togglePause` and `restart`. The clock-keeping
  trick (`startRef = performance.now() - pausedAt`) must be preserved or
  resume jumps.
- The result animation pulls live numbers from `calcPortfolio(ANIM_POSITIONS)`
  computed once via `useMemo`. Type the return.
- Visibility on mobile: the prototype collapses the two-column stage
  to one column at `760px`. Verify the animation still reads at 360px
  width (the textarea typing and the positions-list landing in
  particular).

### 5.4 `InputSection`

Two stacked subsections, both compiling to the same internal
`Transaction[]`:

**A. "A 1 de enero de 2025" — starting holdings.** Plain
`ticker + shares` rows, no date field. Internally each row becomes a
transaction dated Jan 1 of the tax year. This is what most users have
most of (positions held from prior years).

**B. "Movimientos durante 2025" — intra-year transactions.** Optional,
collapsed by default. Each row: `date + ticker + buy/sell + shares`.
Default date for a newly-added row: today if it falls within the tax
year, otherwise Dec 31 of the tax year (so the field is never empty).

Each subsection offers two input modes side-by-side in a CSS grid
(single column under 760px):

- **Manual**: same autocomplete/keyboard behavior as the prototype.
  ArrowUp/Down + Enter + Escape. `onMouseDown` (not `onClick`) on
  suggestions so blur fires after selection.
- **Import**: a single panel with both a paste textarea and a
  `<input type="file">`, plus a format selector ("Formato Casilla 588"
  / "CSV de DEGIRO"). Both inputs feed the same adapter (§6.5). Files
  are read via `FileReader.readAsText()` then passed to the adapter as
  a string. Per-line error list capped at 4 with "+N más".

Validation: running shares for any ticker must not go negative at any
ex-div date or transaction date. A sell that oversells is flagged
inline on the offending row and that transaction is dropped from the
running list. No short positions in v1.

Empty state: "Aún no has añadido nada. Empieza por una posición arriba
— o carga la cartera de ejemplo para trastear." Keep the
loaded-example link as escape hatch (now loads a `Transaction[]`, not a
static portfolio).

Each row has a `✕` remove button. Mobile collapses to a stacked layout
(`.position-row` media query in `styles.css`).

Expose subsection A's anchor ref upward so the demo CTA can `scrollTo` +
focus the first ticker input.

### 5.5 `KeyMoment`
- Renders nothing if portfolio is empty.
- The `figure` div is the design's hero number: Source Serif at weight
  300, ~9rem on desktop, currency glyph on the left and `/año` on the
  right both as smaller mono labels.
- The annotation row underneath summarizes Bruto / Retenido / IRPF tras
  deducción / Neto / Exceso (red). Order matters — it tells the story.

### 5.6 `Ledger`
- Wide table with horizontal scroll on mobile.
- Each row uses `data-label` attributes so a CSS rule can render the
  table as stacked cards under 700px (keep this — it's the only way
  to make a 9-column table usable on phones).
- Totals row pinned at the bottom with `<tr class="totals">`.
- "588" abbreviation tag has a tooltip via `<abbr title="…">`. Keep it.
- Per-row annotation column "Días tenidos" (or "X/Y dividendos") for any
  position not held the full tax year; empty when held all year.
  Rendered as Source Serif italic small so it reads as a footnote, not a
  primary metric. This is what tells the user *why* a number is smaller
  than they expected when they bought mid-year.

### 5.7 `CountryBreakdown`
- Single horizontal stacked bar segmented by country, with per-country
  legend below (name + bruto + recuperable in green).
- Each segment has class `cseg-${country}` whose color comes from
  `styles.css`. Need to add CSS classes for any new country code we
  ever support.

### 5.8 `WaitlistCTA`
- Form with email input + checkbox "guarda esta cartera".
- Client-side: validate email regex (the prototype's regex is fine —
  `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`), then POST to the edge function.
- Confirmation state: replaces the form with a green check + message;
  message wording branches on whether the cartera was saved.
- On error from edge function: render an inline `.error-text` and
  leave the form usable.
- See §7 for the API shape.

### 5.9 `SourcesPage`
- Renders one card per entry in `COUNTRIES`, with name, ISO code, the
  two rates, and the `note` field.
- Footer paragraph cites BOE article numbers verbatim. Keep them in a
  constant in `data/sources.ts` so updates are atomic.

### 5.10 `Footer`
- Two paragraphs, mono small-caps caveat about not-tax-advice and
  attribution. Verify the copy is final before launch — it is product
  voice.

## 6. Data layer

### 6.1 Types

```ts
// src/import/types.ts — the canonical internal model
export type ISODate = string;  // "YYYY-MM-DD"

export interface Transaction {
  ticker: string;
  date: ISODate;
  shares: number;  // signed: positive = buy, negative = sell
}

export interface ImportResult {
  transactions: Transaction[];
  errors: Array<{ line: number; raw: string; reason: string }>;
}

export interface Adapter {
  id: "native" | "degiro" | "trade-republic";
  parse(input: string, taxYear: number): ImportResult;
}
```

```ts
// src/data/countries/2025.ts
export type CountryCode = "US"|"UK"|"NL"|"DE"|"CH"|"FR"|"IT";
export interface CountryInfo {
  name: string;
  flag: CountryCode;
  nominal: number;       // 0..1
  treaty: number;        // 0..1
  note: string;
  source: string;        // BOE-A-...
}
export const COUNTRIES_2025: Record<CountryCode, CountryInfo> = { /* ... */ };
export const RATES_VERIFIED_AT = "2025-11-12";
export const RATES_NEXT_REVIEW = "2026-11-12";  // annual cadence

// src/data/countries/index.ts
export function getCountries(taxYear: number): Record<CountryCode, CountryInfo> {
  switch (taxYear) {
    case 2025: return COUNTRIES_2025;
    default: throw new Error(`Unsupported tax year: ${taxYear}`);
  }
}
```

```ts
// src/data/tickers/tickers.ts
export interface TickerInfo {
  t: string;
  name: string;
  country: CountryCode;
  ccy: "USD"|"EUR"|"CHF"|"GBP";
}
export const TICKERS: TickerInfo[] = [ /* 33 entries */ ];

// src/data/tickers/payments-2025.ts
export interface DividendPayment {
  exDivDate: ISODate;
  amount: number;       // in source currency
  amountEur: number;    // baked at data-entry time, ECB rate on exDivDate
}
export const PAYMENTS_2025: Record<string, DividendPayment[]> = { /* ... */ };
export const PAYMENTS_VERIFIED_AT = "2026-04-15";

// src/data/tickers/index.ts
export function getTickerAnnual(ticker: string, taxYear: number): {
  paymentsInYear: DividendPayment[];
  divEur: number;             // sum of amountEur in that year
  basis: "complete" | "estimated";  // estimated if year is in progress
};
```

The masthead's user-facing "verified" date is the *older* of
`RATES_VERIFIED_AT` and `PAYMENTS_VERIFIED_AT` (weaker guarantee wins).
Payment data will usually be the constraint.

For a tax year still in progress (e.g. asking about 2026 in May 2026),
`getTickerAnnual` extrapolates from prior-year payment count and marks
`basis: "estimated"`. The UI surfaces an "estimado" caveat on the key
moment number. v1 only ships 2025, by which point all 2025 payments are
declared, so this code path is dormant but the types are right.

### 6.2 Calc (transaction-aware, pure)

For portfolio P, tax year Y, ticker T:

```
country         = getCountries(Y)[tickerInfo.country]
paymentsT       = getTickerAnnual(T, Y).paymentsInYear
brutoT          = Σ over p in paymentsT:
                    sharesHeldOn(P, T, p.exDivDate) * p.amountEur
retOrigenT      = brutoT * country.nominal
recuperable588T = brutoT * country.treaty
excesoOrigenT   = max(0, brutoT * (country.nominal - country.treaty))
irpfTeoricoT    = brutoT * IRPF_RATE
irpfTrasT       = max(0, irpfTeoricoT - recuperable588T)
netoFinalT      = brutoT - retOrigenT - irpfTrasT
```

`IRPF_RATE = 0.19` (first bracket — caveat in Sources).

`sharesHeldOn(P, T, d) = Σ tx.shares for tx in P where tx.ticker == T
and tx.date <= d`. Implemented in `domain/transactions.ts`. The same
helper provides validation: `sharesHeldOn(P, T, d) >= 0` must hold for
every transaction date and every ex-div date in scope. First violation
surfaces as an inline error on the offending transaction row.

A `Portfolio` is just `Transaction[]`; the per-ticker `position` shown
in the Ledger is a *derived view*, computed by grouping transactions
by ticker and using `sharesHeldOn` at end-of-year for the displayed
share count.

### 6.3 Native paste parser

`src/import/native.ts`. Two grammars on the same input — the parser
detects which line is which by leading-date presence:

- **Position line** (no date): `^([A-Za-z0-9.\-]+)[\s,;:|]+(\d+(?:[.,]\d+)?)$`.
  Treated as a starting holding → emitted as a transaction dated Jan 1
  of the tax year.
- **Movement line** (date prefix): `^(\d{4}-\d{2}-\d{2})\s+([A-Za-z0-9.\-]+)\s+(compra|venta|\+|\-)?\s*(\d+(?:[.,]\d+)?)$`.
  Shorthand: `+100` / `-50` after the ticker is equivalent to
  `compra 100` / `venta 50`. The internal `shares` field is always
  signed (`compra`/`+` → positive, `venta`/`-` → negative).

Locale: decimal comma OR decimal dot accepted in input; normalized to
`number`. Errors collected: unknown ticker, zero/negative quantity,
malformed date, running-shares-go-negative.

### 6.4 Format (pure)

Port `fmtEur`/`fmtPct` with `toLocaleString("es-ES")`. Lock locale to
`es-ES` regardless of browser — the design depends on Spanish thousand
separators.

### 6.5 Import adapters

`src/import/` defines one adapter per supported format, all conforming
to the `Adapter` interface (§6.1). Each adapter produces the same
`Transaction[]` shape from a different raw format. The UI picks an
adapter from a dropdown; the calculator never sees broker-specific code.

**Native paste adapter (v1).** Wraps §6.3. ID: `"native"`.

**DEGIRO adapter (v1).** ID: `"degiro"`. Twelve columns; dates
`dd-MM-yyyy`; decimals `,`. Headers come in Dutch regardless of UI
language, so we match on Dutch header names. The description column
encodes the transaction kind — we filter to `Koop`/`Verkoop` (buy/sell).
Cash dividend lines are ignored (dividends come from our own table,
not the broker; using both would double-count). Unknown ticker/ISIN
is collected as a row error, not a hard fail.

**Trade Republic adapter (v1.5).** ID: `"trade-republic"`. Official
in-app export (`Date, Symbol, Type, Quantity, Price, Amount`). `Type`
distinguishes buy/sell/dividend. Less battle-tested than DEGIRO;
deferred to v1.5 — the adapter slot is wired so adding it is a single
file + dropdown entry.

Both file upload (`<input type="file">`) and pasted text feed the same
adapters — file is read with `FileReader.readAsText()` then handed to
`adapter.parse(text, taxYear)`.

## 7. Backend (Supabase)

### 7.1 Schema — migration `0001_casilla_waitlist.sql`

Lives in a new dedicated Supabase project for Casilla 588.

```sql
create table public.casilla_waitlist (
  id               bigserial primary key,
  email            text not null,
  email_norm       text generated always as (lower(trim(email))) stored,
  portfolio        jsonb,                   -- nullable; only present if user opted in
  missing_tickers  text,                    -- optional free-text request for unsupported tickers
  user_agent       text,
  ip_hash          text,                    -- sha256 of (ip || daily_salt) for abuse, not PII
  created_at       timestamptz not null default now()
);

create unique index casilla_waitlist_email_norm_idx
  on public.casilla_waitlist (email_norm);

create index casilla_waitlist_ip_hash_idx
  on public.casilla_waitlist (ip_hash, created_at);

-- row-level security: the table is only written/read by the service
-- role inside the edge function; deny everything from anon/auth.
alter table public.casilla_waitlist enable row level security;
-- (no policies = no access)
```
The `portfolio` JSONB shape is `{ positions: [{ ticker: string, date: ISODate, shares: number }], snapshot_at: ISO }`.

### 7.2 Edge function — `waitlist-signup`
```
POST /functions/v1/waitlist-signup
body: {
  email: string,
  portfolio?: { positions: Transaction[], snapshot_at: ISO },
  missingTickers?: string  // optional, max 500 chars
}
```
- Validate email server-side (same regex).
- Insert with conflict-on-email_norm: do nothing (idempotent — second
  signup of the same email is a 200, no error).
- Hash IP with a daily-rotated salt env var; store the hash, not the
  IP. Deny if more than 5 distinct emails from the same hash in 24h.
- Returns `{ ok: true }`. Never echoes the email back.
- CORS: `Access-Control-Allow-Origin: https://casilla588.es` only.

### 7.3 Future automation (out of scope for v1)
The CTA copy promises a future "weekly cartera analysis email". That
needs (a) a way to refresh ticker dividend data, (b) cron + email
sender (Resend), (c) per-user unsubscribe tokens. Punt to a v2 doc;
the schema above leaves room (`portfolio` JSONB is the seed).

## 8. Design tokens & styling

Lift these directly from `styles.css:6-45` into `tokens.css`:

- **Paper palette**: `--paper #f5f1e8`, `--paper-2 #ece6d6`,
  `--paper-3 #e3dbc6`.
- **Ink palette**: `--ink #1a1814`, `--ink-2 #4a4438`, `--ink-3 #7a7264`,
  `--ink-4 #a89f8c`, plus rule lines.
- **Accent**: `--accent #a8462e` (terracota óxido), `--accent-deep #7a3220`,
  `--accent-tint rgba(168,70,46,0.08)`. Applied to: italic accent words,
  hover underlines, the "588" in masthead, primary button background,
  "AGREGAR"/"Apuntar"/"Probar con mi cartera" CTAs, the recoverable
  number in the ledger column.
- **Signal colors**: `--good #2f6f4e` (recuperable), `--warn #b88a1a`,
  `--bad #8b3a2e` (exceso a reclamar).
- **Type stack**: `--serif Source Serif 4`, `--sans Inter`, `--mono JetBrains Mono`.
- **Gaps**: a 6-step scale (`--gap-xs 4 → --gap-2xl 64`).
- **Layout widths**: `--col-narrow 760` (text), `--col-wide 1120` (page).

**Drop**: `body[data-style="terminal"]`, `body[data-style="boletin"]`,
`body[data-density="compact"]` — Editorial only.

**Keep**: the SVG paper-grain effect at `body::before` (it is what
makes the design feel like paper, not a webpage). It's a tiny inline
data URL — no asset cost.

**Country segment colors**: each CountryCode has a `.cseg-XX`
background color. List today: US, UK, NL, DE, CH, FR, IT. When new
countries are added the rule must be added to `country.css`.

## 9. Animation timeline (reference)

For the implementer, the steps the hero animation walks through:

| Window (ms) | What happens |
|---|---|
| 0–600 | Empty input panel visible, paste panel dim. |
| 600–1200 | "KO" types into ticker field. |
| 1300–2000 | Autocomplete dropdown appears, KO row highlights. |
| 2000–2300 | Selection commits (KO stays in field). |
| 2300–3000 | "500" types into shares field. |
| 3400–3650 | "Añadir" button pressed state. |
| 3600–4000 | First position lands in cartera column (slide-in from right). |
| 4000–4500 | Manual panel dims, paste panel becomes active. |
| 4500–6900 | Paste textarea types `JNJ 200\nNESN 250\nROG 50\nALV 30`. |
| 7300–7550 | "Procesar" pressed. |
| 7500–8200 | Remaining 4 positions land sequentially (130 ms stagger). |
| 8200–9800 | Result block fades in, big number counts up to recuperable total. |
| 9800–10800 | Country bar fills in segment by segment. |
| 11200–12500 | CTA button pulses (terracota glow ring). |
| 14400 | Loop end → restart. |

Per-step labels at the top: "Añade una posición manualmente" → "O
pega tu cartera entera de golpe" → "Mira cuánto recuperarías cada
año" → "Pruébalo con tu cartera real".

## 10. Responsive plan

- **≥1120px**: full design as drawn. Page max width 1120, body
  padding 56px.
- **760px–1119px**: page padding scales from 16 to 56 via
  `clamp(16px, 4vw, 56px)`. Two-column input grid still side by side
  until 760, then stacks.
- **540px–760px**: input grid one column; demo animation stage one
  column; ledger gets horizontal scroll.
- **<540px**: row-input collapses to two-up grid with the button on
  its own row; position rows collapse to stacked label/value pairs;
  ledger renders as cards using the `data-label` trick.

Mobile-first checks before launch:
- 360px Samsung Galaxy S width.
- iPhone SE 375x667.
- iPad portrait 768x1024.

## 11. Accessibility

- All inputs have `<label htmlFor>` (already in prototype).
- The country bar has `role="img"` + `aria-label` summarizing
  composition. Keep it; for screen readers add an `<ul>` sibling that
  visually-hides but lists `country: pct` so the data is also linear.
- Autocomplete needs ARIA: `role="listbox"` on the `<ul>` (already
  there), `role="option"` + `aria-selected` on each `<li>`, and the
  ticker input needs `aria-controls`, `aria-expanded`, `aria-activedescendant`.
- `<abbr title="Casilla 588 del Modelo 100">588</abbr>` already
  exposes the expansion to AT.
- Demo animation must respect `prefers-reduced-motion: reduce` (see
  §5.3).
- Color contrast: terracota on paper passes AA at body sizes; verify
  the `--ink-3` and `--ink-4` greys on `--paper` (specifically the
  meta-strip, mono labels, and table secondary text) — these are the
  most likely WCAG misses. Run axe before launch.
- Pause/restart controls on the animation must be keyboard-reachable
  with visible focus rings.

## 12. SEO & social

- `<title>`: "Casilla 588 — Calculadora de retención fiscal sobre
  dividendos extranjeros" (already in `index.html`).
- Meta description: one sentence framing "casilla 588 / Modelo 100 /
  doble imposición / dividendos extranjeros". Target keyword:
  "casilla 588 IRPF dividendos extranjeros".
- Open Graph: `og:image` = pre-rendered card with the cifra-grande
  treatment. Build script can render this from the React tree once
  via Playwright.
- Sitemap.xml with `/` and `/sobre-los-datos`.
- robots.txt allow all.
- No analytics for v1 — the hero copy promises "sin tracking". If
  anonymous counts are needed later, use server-side log aggregation,
  not a client beacon.

## 13. Testing

Three layers, mirroring how this repo's `docs/testing.md` splits them:

**Unit (Vitest)** — pure-domain coverage:
- `sharesHeldOn`: empty list → 0; single buy → buy.shares; buy then
  partial sell → difference; sell-more-than-held detected at the
  offending date; multiple buys on the same date aggregate; transactions
  out of chronological order still produce correct point-in-time totals.
- `calcPosition` for one row of each country code (US, UK with 0%
  treaty, DE with reclaimable exceso, CH with the largest exceso, FR
  with treaty > nominal edge case, IT with the disputed delta).
- `calcPosition` for partial-year holdings: full-year (matches the old
  static result), bought 2025-04-01 (excludes Q1 dividend), sold
  2025-07-01 (excludes Q3 + Q4), bought-then-sold-then-rebought
  (per-payment lookup gets the right share count for each).
- `calcPortfolio` aggregates correctly across mixed countries and
  mixed holding periods; totals row matches the sum of children.
- Native parser: position line, movement line with each verb (compra,
  venta, +N, -N), decimals with comma vs dot, unknown ticker,
  malformed date, zero shares, running-shares-go-negative.
- DEGIRO adapter: Dutch headers detected regardless of UI locale;
  Koop/Verkoop extracted to signed shares; dividend lines ignored;
  locale parsing (dd-MM-yyyy + decimal comma); unknown ticker/ISIN
  collected as row errors; multi-currency rows handled.
- `fmtEur` / `fmtPct` produce Spanish locale strings deterministically
  regardless of `process.env.LANG`.

**Component (RTL + Vitest)**:
- `InputSection`: typing a ticker shows suggestions; ArrowDown +
  Enter selects; "Añadir" pushes a row; remove button removes.
- `WaitlistCTA`: invalid email shows error; valid email POSTs once;
  second submit after success is a no-op (or shows confirmation
  state again).
- `DemoAnimation`: with reduced-motion forced, the end-state renders
  immediately and rAF is never scheduled.

**E2E smoke (Playwright)** — a single happy path:
1. Land on `/`, hero animation visible.
2. Click "Probar con mi cartera" → page scrolls to input, ticker
   field focused.
3. Type `KO` + `100`, press Añadir → position row appears, key
   moment renders a non-zero recuperable.
4. Toggle to paste mode, paste 3 lines, Procesar → 4 positions in
   cartera total.
5. Submit waitlist with a fake email → confirmation appears.
6. Navigate to `/sobre-los-datos` → 7 country cards visible.

## 14. Performance budget

- First contentful paint < 1.5s on Slow 4G.
- Total JS bundle (gzipped) < 60 KB. The prototype's animation is the
  riskiest piece; if rAF + per-frame React rerenders push CPU too
  high, switch to a single CSS-keyframes timeline driving `--t` via
  one `setTimeout` per phase. Defer this optimization until measured.
- Fonts: subset Source Serif and Inter to Latin only; preload the
  display weight (300) of Source Serif because the cifra-grande is
  above the fold.
- The grain SVG is inlined as data URL — fine, ~400 bytes.

## 15. Phased milestones

A reasonable build order; each phase is one commit/PR boundary.

**P0 — Repo bootstrap (½ day)**
- New repo, Vite + React + TS scaffolding, prettier/eslint, CI
  (lint, typecheck, test, build).
- `tokens.css` + `base.css` checked in; index page renders Source Serif
  H1 to confirm fonts.

**P1 — Static design system (1 day)**
- Port `Masthead`, `DocHead`, `Footer`. No state.
- Port all tokens, layout, base, doc-head, footer styles.
- Design QA: open at 360 / 768 / 1280 / 1920 widths; compare to
  prototype.

**P2 — Calculator core (3 days)**
- Port `data/countries/`, `data/tickers/`, `domain/transactions.ts`,
  `domain/calc.ts`, `domain/format.ts` with full unit tests.
- Port `import/types.ts`, `import/native.ts`, `import/degiro.ts` with
  full unit tests (DEGIRO fixture: a real anonymised export).
- Port `InputSection` with both subsections (starting holdings +
  movements) and both import inputs (paste textarea + file upload),
  plus the format selector dropdown.
- Port `KeyMoment`, `Ledger` (with the new "Días tenidos" annotation),
  `CountryBreakdown`.
- Wire local state in `App.tsx`; verify with `SAMPLE_PORTFOLIO` (now a
  `Transaction[]`) including at least one mid-year buy and one sell so
  the partial-year math gets exercised in dev.

**P3 — Sources page (½ day)**
- Port `SourcesPage` + the BOE references constant.
- Add `/sobre-los-datos` route (or in-app toggle if React Router is
  overkill — recommend the route for SEO).

**P4 — Hero animation (1.5 days)**
- Port timeline + helpers as pure functions, with unit tests on
  `stepAt`, `typed`, `rampUp`, `pulseAround`.
- Port `DemoAnimation` component with rAF loop and pause/restart.
- Implement `useReducedMotion` and the static fallback render.
- Cross-browser check: Safari macOS, Safari iOS, Firefox, Chrome.

**P5 — Waitlist backend (1 day)**
- Create new Supabase project.
- Migration `0001_casilla_waitlist.sql` (see §7.1).
- Edge function `waitlist-signup` with rate limit + CORS.
- GitHub Actions workflow `.github/workflows/deploy-supabase.yml` applies
  migrations and deploys the function on push to `main` when `supabase/**`
  changes. Required secrets: `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`,
  `SUPABASE_DB_PASSWORD`, `IP_HASH_SALT`, `ALLOWED_ORIGIN`.
- Frontend `api/waitlist.ts` + wire `WaitlistCTA`.
- Smoke test the round-trip from a deployed preview.

**P6 — Production hardening (1 day)**
- Accessibility pass (axe, keyboard-only walkthrough, screen reader
  on the hero animation).
- SEO meta + OG image.
- Playwright smoke in CI.
- Lighthouse: ≥95 on perf/a11y/best-practices/SEO at mobile.
- Hook `casilla588.es` to the host (CF Pages or Netlify), configure
  TLS, set canonical URL.

**P7 — Launch (½ day)**
- Soft-launch to Cazadividendos forum / Reddit /r/Finanzas / X.
- Monitor waitlist signups, crash logs.
- Plan v2 (the automated weekly analysis) once signal exists.

Total: ~7 working days of focused build, plus launch.

## 16. Risks & mitigations

| Risk | Mitigation |
|---|---|
| **Tax data goes stale.** Rates change at ministerial level; the user trusts our number. | A `RATES_VERIFIED_AT` constant is rendered in the masthead and Sources page; calendarize a quarterly review with a single PR pattern (one file: `data/countries.ts`). Set a stale-threshold of 6 months — past that, render a banner. |
| **The IRPF 19% simplification is wrong for higher earners.** Anyone in the 21–28% IRPF brackets is under-recuperando in our number. | Ship v1 with explicit caveat in the lede + Sources page. v2: add a "tu IRPF marginal" toggle (19/21/23/27/28). |
| **rAF animation pegs the CPU on low-end mobile.** | Profile on a Moto G; if frame budget overruns 16 ms, drop to 30 fps timer or fall back to pure-CSS timeline. |
| **Email spam through the waitlist endpoint.** | IP-hash + daily salt + 5/day limit (§7.2); cap insert size; reject portfolio JSON > 4 KB. |
| **Domain `casilla588.es` unavailable.** | Fall back to `casilla588.com` / `lacasilla588.es`. The wordmark survives either. |
| **Ticker list is only top-30, will frustrate long-tail users.** | Show explicit copy under the input ("autocompletado sobre los 30 tickers más comunes") — already present in prototype. v2: paid-tier tickers via OpenFIGI or per-user ticker submissions. |
| **AEAT may dispute the IT 11-point delta interpretation.** | Note already present in `COUNTRIES.IT.note`; surface that note as inline footnote on the Italy line of the ledger. |

## 17. Out of scope for v1

- Real-time dividend data (we ship a snapshot).
- Multi-currency display toggle (Euro only).
- Account / login (everything client-side; cartera lives in
  `localStorage` only if we want refresh-survival; not in v1).
- Multi-language (Spanish only — the brand is Spanish-tax-specific).
- The promised "weekly automated analysis" — captured as v2.
- Higher IRPF bracket logic — captured as v2.
- Tweaks panel — explicitly dropped per scope decision §1.
- Trade Republic / IBKR / other broker imports — v1.5; adapter slot
  ready (§6.5). Native paste + DEGIRO is v1.
- Tax years other than 2025 — data files are year-keyed; adding 2026 is
  a data PR + `getCountries`/`getTickerAnnual` switch-case extension.
- Year selector UI — v1 hardcodes 2025. Once a second year is added,
  default the selector to the previous calendar year.
- Short positions — running shares going negative is a validation
  error, not a supported state.

## 18. Open follow-ups before P0

- Confirm domain availability and registrar.
- Confirm Supabase organization / billing for the new project.
- Decide hosting: Cloudflare Pages vs Netlify (both work; pick one).
- Decide whether `localStorage` cartera persistence is part of v1 (cheap; recommended).
- Source the actual 2025 dividend payment data for the 33 initial
  tickers (4 entries each ≈ 132 rows). Each entry needs `exDivDate`,
  `amount`, and the ECB EUR rate on that date to bake `amountEur`.
  This is the single biggest data-entry task before P2 can be tested
  against real numbers.
