// All app navigation routes through these helpers so it works both under
// a Vite `base` (GitHub Pages: /casilla588/) and at the document root
// (custom domain: /).

const BASE: string = import.meta.env.BASE_URL; // always ends with "/"

export function buildPath(slug: string): string {
  if (!slug || slug === "/") return BASE;
  return `${BASE}${slug.replace(/^\//, "")}`;
}

export function slugFromLocation(pathname: string): string {
  if (pathname.startsWith(BASE)) return pathname.slice(BASE.length);
  return pathname.replace(/^\//, "");
}
