-- Casilla 588 — anonymous usage events.
--
-- INSERT-only from the browser anon role; no SELECT/UPDATE/DELETE from anon.
-- The data is reachable from the Supabase dashboard and the SQL editor (which
-- use the service role and bypass RLS). The anon key is public — accepted risk
-- is that anyone could inject fake events. Since the project is isolated and
-- the rows carry no sensitive identifiers, the worst case is contaminated
-- analytics, which is recoverable.

create table public.tool_events (
  id            uuid default gen_random_uuid() primary key,
  session_id    text not null,
  event_name    text not null,
  event_data    jsonb default '{}'::jsonb,
  referrer      text,
  utm_source    text,
  utm_campaign  text,
  utm_medium    text,
  user_agent    text,
  created_at    timestamptz default now()
);

create index idx_tool_events_session on public.tool_events (session_id, created_at);
create index idx_tool_events_name on public.tool_events (event_name, created_at);
create index idx_tool_events_created on public.tool_events (created_at);

alter table public.tool_events enable row level security;

create policy "anon_can_insert_events"
  on public.tool_events
  for insert
  to anon
  with check (true);

-- No policy for SELECT/UPDATE/DELETE: denied by default for anon.
-- Reachable only via the Supabase dashboard or SQL editor (service role).
