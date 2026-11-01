-- Privacy-light search and conversion attribution for SEO/AEO/GEO measurement.
-- Server-only table. No names, emails, IP addresses, or raw user agents are stored.
create table public.soltasite_search_events (
  id uuid primary key default gen_random_uuid(),
  dedupe_key text not null unique check (char_length(dedupe_key) between 8 and 200),
  event_name text not null check (event_name in ('page_view','start_click','checkout_submit','checkout_session_created','purchase')),
  session_id uuid not null,
  request_id uuid,
  path text not null check (char_length(path) between 1 and 500 and path like '/%'),
  landing_path text not null check (char_length(landing_path) between 1 and 500 and landing_path like '/%'),
  referrer_host text check (referrer_host is null or char_length(referrer_host) between 1 and 255),
  source_group text not null check (source_group in ('direct','google','bing','other_search','chatgpt','perplexity','copilot','claude','gemini','social','paid','referral','unknown')),
  utm_source text check (utm_source is null or char_length(utm_source) <= 120),
  utm_medium text check (utm_medium is null or char_length(utm_medium) <= 120),
  utm_campaign text check (utm_campaign is null or char_length(utm_campaign) <= 180),
  utm_content text check (utm_content is null or char_length(utm_content) <= 180),
  utm_term text check (utm_term is null or char_length(utm_term) <= 180),
  created_at timestamptz not null default now()
);

create index soltasite_search_events_time on public.soltasite_search_events(created_at desc);
create index soltasite_search_events_name_time on public.soltasite_search_events(event_name, created_at desc);
create index soltasite_search_events_source_time on public.soltasite_search_events(source_group, created_at desc);
create index soltasite_search_events_request on public.soltasite_search_events(request_id) where request_id is not null;

alter table public.soltasite_search_events enable row level security;
revoke all on public.soltasite_search_events from public, anon, authenticated, service_role;
grant usage on schema public to service_role;
grant select, insert on public.soltasite_search_events to service_role;
