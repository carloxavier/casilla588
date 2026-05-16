// Anonymous client-side analytics.
//
// Fire-and-forget POSTs to public.tool_events via Supabase PostgREST. Never
// blocks UX, never throws. INSERT-only RLS is configured in migration 0002.
//
// The session id is generated client-side as a v4 UUID and persisted in
// localStorage so the same browser reports a stable identifier across reloads.
// It is NOT a user identifier — there is no login. It's a stable handle for
// joining events within a single browser's stream.

const SESSION_KEY = "c588_session_id";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

export type EventName =
  | "visit"
  | "add_position"
  | "paste_portfolio"
  | "calculate"
  | "view_result"
  | "cta_viewed"
  | "email_submitted"
  | "email_error"
  | "w8ben_toggled";

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function getSessionId(): string {
  return getOrCreateSessionId();
}

// Per-page-load milestones so we can compute relative timings like
// "seconds since result was viewed" without sending wall-clock timestamps.
const milestones: Record<string, number> = {};

export function markMilestone(name: string): void {
  if (milestones[name] === undefined) {
    milestones[name] = Date.now();
  }
}

export function secondsSince(name: string): number | null {
  const t = milestones[name];
  if (t === undefined) return null;
  return Math.round((Date.now() - t) / 1000);
}

export function track(eventName: EventName, eventData: object = {}): void {
  if (typeof window === "undefined") return;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return; // unconfigured (dev or test) — no-op

  let referrer: string | null = null;
  let utmSource: string | null = null;
  let utmCampaign: string | null = null;
  let utmMedium: string | null = null;
  try {
    referrer = document.referrer || null;
    const url = new URL(window.location.href);
    utmSource = url.searchParams.get("utm_source");
    utmCampaign = url.searchParams.get("utm_campaign");
    utmMedium = url.searchParams.get("utm_medium");
  } catch {
    /* ignore parse errors */
  }

  const payload = {
    session_id: getOrCreateSessionId(),
    event_name: eventName,
    event_data: eventData,
    referrer,
    utm_source: utmSource,
    utm_campaign: utmCampaign,
    utm_medium: utmMedium,
    user_agent: navigator.userAgent,
  };

  try {
    fetch(`${SUPABASE_URL}/rest/v1/tool_events`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      // Silent. Dropped events aren't critical for this analytics layer.
    });
  } catch {
    // Some environments (older Safari + keepalive limits) throw synchronously.
    // Swallow — analytics must never break the app.
  }
}
