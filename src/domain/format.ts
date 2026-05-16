export function fmtEur(n: number, decimals = 0): string {
  return n.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function fmtEurInt(n: number): string {
  return fmtEur(Math.round(n), 0);
}

export function fmtPct(n: number, decimals = 1): string {
  return `${(n * 100).toLocaleString("es-ES", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })} %`;
}

export function fmtShares(n: number): string {
  return n.toLocaleString("es-ES", {
    maximumFractionDigits: 4,
  });
}
