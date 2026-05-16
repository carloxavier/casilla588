import { type Transaction } from "../import/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(s: string): boolean {
  return EMAIL_RE.test(s);
}

export interface WaitlistPayload {
  email: string;
  portfolio?: { positions: Transaction[]; snapshot_at: string };
  missingTickers?: string;
}

export interface WaitlistResponse {
  ok: boolean;
  error?: string;
}

function endpoint(): string | null {
  const base = import.meta.env.VITE_WAITLIST_URL;
  return typeof base === "string" && base.length > 0 ? base : null;
}

export async function submitWaitlist(
  payload: WaitlistPayload,
): Promise<WaitlistResponse> {
  const url = endpoint();
  if (!url) {
    // No backend configured — succeed locally so the UI still flows in dev.
    // (Production deploy must set VITE_WAITLIST_URL.)
    await new Promise((r) => setTimeout(r, 250));
    return { ok: true };
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "network" };
  }
}
