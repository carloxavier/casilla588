// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_ORIGIN =
  Deno.env.get("ALLOWED_ORIGIN") ?? "https://casilla588.es";
const RATE_LIMIT_PER_DAY = 5;
const MAX_PORTFOLIO_BYTES = 4 * 1024;

function corsHeaders(origin: string | null) {
  const allow =
    origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : ALLOWED_ORIGIN;
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Max-Age": "86400",
  } as Record<string, string>;
}

async function sha256(s: string): Promise<string> {
  const data = new TextEncoder().encode(s);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function dailySalt(): string {
  const baseSalt = Deno.env.get("IP_HASH_SALT") ?? "default-rotate-me";
  const day = new Date().toISOString().slice(0, 10);
  return `${baseSalt}:${day}`;
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "method" }), {
      status: 405,
      headers: { ...headers, "content-type": "application/json" },
    });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "bad-json" }), {
      status: 400,
      headers: { ...headers, "content-type": "application/json" },
    });
  }

  const email = typeof body?.email === "string" ? body.email.trim() : "";
  if (!EMAIL_RE.test(email)) {
    return new Response(JSON.stringify({ ok: false, error: "bad-email" }), {
      status: 400,
      headers: { ...headers, "content-type": "application/json" },
    });
  }

  let portfolio: unknown = body?.portfolio ?? null;
  if (portfolio) {
    const serialized = JSON.stringify(portfolio);
    if (serialized.length > MAX_PORTFOLIO_BYTES) {
      return new Response(
        JSON.stringify({ ok: false, error: "portfolio-too-large" }),
        {
          status: 400,
          headers: { ...headers, "content-type": "application/json" },
        },
      );
    }
  }

  const missingTickersRaw =
    typeof body?.missingTickers === "string" ? body.missingTickers.trim() : "";
  const missingTickers =
    missingTickersRaw.length > 0
      ? missingTickersRaw.slice(0, 500)
      : null;

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "0.0.0.0";
  const ipHash = await sha256(`${ip}:${dailySalt()}`);

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRole);

  // Rate limit: distinct emails per ip_hash in last 24h
  const dayAgo = new Date(Date.now() - 86_400_000).toISOString();
  const { data: recent, error: rateErr } = await supabase
    .from("casilla_waitlist")
    .select("email_norm", { count: "exact" })
    .eq("ip_hash", ipHash)
    .gte("created_at", dayAgo);
  if (rateErr) {
    return new Response(JSON.stringify({ ok: false, error: "rate-check" }), {
      status: 500,
      headers: { ...headers, "content-type": "application/json" },
    });
  }
  const distinct = new Set((recent ?? []).map((r) => r.email_norm));
  distinct.add(email.toLowerCase().trim());
  if (distinct.size > RATE_LIMIT_PER_DAY) {
    return new Response(
      JSON.stringify({ ok: false, error: "rate-limited" }),
      {
        status: 429,
        headers: { ...headers, "content-type": "application/json" },
      },
    );
  }

  const { error: insertErr } = await supabase
    .from("casilla_waitlist")
    .insert({
      email,
      portfolio,
      missing_tickers: missingTickers,
      user_agent: req.headers.get("user-agent") ?? null,
      ip_hash: ipHash,
    });

  // unique-violation on email_norm is a no-op (idempotent signup)
  if (insertErr && !String(insertErr.code).startsWith("23505")) {
    return new Response(JSON.stringify({ ok: false, error: "insert" }), {
      status: 500,
      headers: { ...headers, "content-type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...headers, "content-type": "application/json" },
  });
});
