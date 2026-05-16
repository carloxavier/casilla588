-- Casilla 588 waitlist
-- Stores email-only opt-ins for the future automated weekly analysis,
-- plus optional "missing tickers" requests from users whose stocks aren't yet supported.
-- portfolio JSONB is optional; only present if the user checked "guarda mi cartera".
-- IP is never stored; we keep a hashed-with-daily-salt token for abuse rate-limiting.
--
-- Lives in a dedicated Supabase project for Casilla 588.

create table public.casilla_waitlist (
  id               bigserial primary key,
  email            text not null,
  email_norm       text generated always as (lower(trim(email))) stored,
  portfolio        jsonb,
  missing_tickers  text,
  user_agent       text,
  ip_hash          text,
  created_at       timestamptz not null default now()
);

create unique index casilla_waitlist_email_norm_idx
  on public.casilla_waitlist (email_norm);

create index casilla_waitlist_ip_hash_idx
  on public.casilla_waitlist (ip_hash, created_at);

-- RLS: this table is only ever written/read by the service role inside the
-- waitlist-signup edge function. No anon or authenticated access.
alter table public.casilla_waitlist enable row level security;
-- (No policies created on purpose. Without a policy, RLS denies all access
-- to anon/auth, which is what we want.)
