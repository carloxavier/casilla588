-- Reference queries for the casilla 588 analytics events.
-- Run from the Supabase SQL editor; not executed automatically.

-- Funnel global, últimos 7 días.
select
  event_name,
  count(distinct session_id) as sessions,
  count(*) as total_events
from tool_events
where created_at > now() - interval '7 days'
group by event_name
order by sessions desc;

-- Tasa de conversión calc → email.
select
  count(distinct session_id) filter (where event_name = 'view_result') as reached_result,
  count(distinct session_id) filter (where event_name = 'email_submitted') as converted,
  round(
    100.0 * count(distinct session_id) filter (where event_name = 'email_submitted')
    / nullif(count(distinct session_id) filter (where event_name = 'view_result'), 0),
    1
  ) as conversion_pct
from tool_events
where created_at > now() - interval '7 days';

-- Sesiones que llegaron al resultado pero no convirtieron.
select
  session_id,
  count(*) filter (where event_name = 'add_position') as positions,
  max((event_data->>'total_gross_eur')::numeric) as gross_eur
from tool_events
where session_id in (
  select session_id from tool_events
  where event_name = 'view_result'
  and created_at > now() - interval '7 days'
)
group by session_id
having not bool_or(event_name = 'email_submitted')
order by positions desc;

-- Países más usados.
select
  event_data->>'country' as country,
  count(*) as additions,
  count(distinct session_id) as unique_sessions
from tool_events
where event_name = 'add_position'
  and created_at > now() - interval '7 days'
group by country
order by additions desc;

-- Distribución de posiciones por sesión que calculó.
select
  case
    when positions = 1 then '1'
    when positions between 2 and 5 then '2-5'
    when positions between 6 and 15 then '6-15'
    else '15+'
  end as bucket,
  count(*) as sessions
from (
  select
    session_id,
    count(*) filter (where event_name = 'add_position') as positions
  from tool_events
  where session_id in (
    select session_id from tool_events where event_name = 'calculate'
  )
  group by session_id
) buckets
group by bucket
order by bucket;

-- Top referrers.
select
  referrer,
  count(distinct session_id) as sessions
from tool_events
where event_name = 'visit'
  and created_at > now() - interval '7 days'
  and referrer is not null
  and referrer != ''
group by referrer
order by sessions desc;

-- Top UTM sources (campañas).
select
  utm_source,
  utm_campaign,
  count(distinct session_id) as sessions
from tool_events
where event_name = 'visit'
  and created_at > now() - interval '7 days'
  and utm_source is not null
group by utm_source, utm_campaign
order by sessions desc;
