-- Initial commerce schema for the dedicated Solta Site Supabase project.
-- Application access is server-only; no customer Auth accounts are required.
create table public.soltasite_checkout_intents (
  request_id uuid primary key,
  fingerprint text not null check (fingerprint ~ '^[a-f0-9]{64}$'),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254 and email = lower(email)),
  terms_version text not null check (char_length(terms_version) between 1 and 100),
  stripe_session_id text unique,
  created_at timestamptz not null default now()
);
create index soltasite_checkout_email_time on public.soltasite_checkout_intents(email, created_at);

create table public.soltasite_orders (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique references public.soltasite_checkout_intents(request_id),
  stripe_session_id text not null unique,
  stripe_payment_intent_id text not null unique,
  name text not null,
  email text not null,
  amount_cents integer not null check (amount_cents = 49900),
  currency text not null check (currency = 'usd'),
  livemode boolean not null,
  payment_status text not null check (payment_status in ('paid','refunded')),
  materials_submitted_at timestamptz,
  created_at timestamptz not null default now()
);
create table public.soltasite_webhook_events (
  event_id text primary key,
  payment_intent_id text not null,
  kind text not null check (kind in ('paid','refunded')),
  created_at timestamptz not null default now()
);
create index soltasite_webhooks_payment on public.soltasite_webhook_events(payment_intent_id,kind);

create table public.soltasite_assets (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.soltasite_orders(id),
  request_id uuid not null unique,
  fingerprint text not null check (fingerprint ~ '^[a-f0-9]{64}$'),
  kind text not null check (kind in ('headshot','resume','font')),
  file_name text not null check (char_length(file_name) between 1 and 180 and file_name !~ '[/\\]'),
  path text not null unique,
  content_type text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 26214400),
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  check (kind = 'headshot' or size_bytes <= 10485760)
);
create index soltasite_assets_order_kind on public.soltasite_assets(order_id,kind);

create table public.soltasite_materials_submissions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.soltasite_orders(id),
  request_id uuid not null unique,
  fingerprint text not null check (fingerprint ~ '^[a-f0-9]{64}$'),
  answers jsonb not null check (jsonb_typeof(answers) = 'object' and octet_length(answers::text) <= 80000),
  assets jsonb not null check (jsonb_typeof(assets) = 'object'),
  created_at timestamptz not null default now()
);
create index soltasite_materials_order_time on public.soltasite_materials_submissions(order_id,created_at desc);

create table public.soltasite_commerce_outbox (
  id uuid primary key default gen_random_uuid(),
  event_id text not null,
  destination text not null check (destination in ('kp','email')),
  event_type text not null check (event_type in ('v1.order.paid','v1.materials.submitted')),
  source_system text not null default 'soltasite' check (source_system = 'soltasite'),
  order_id uuid not null references public.soltasite_orders(id),
  submission_id uuid references public.soltasite_materials_submissions(id),
  status text not null default 'pending' check (status in ('pending','delivered','failed','cancelled')),
  attempts integer not null default 0 check (attempts >= 0),
  next_attempt_at timestamptz not null default now(),
  last_error_code text,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  unique(destination,event_id)
);
create index soltasite_outbox_pending on public.soltasite_commerce_outbox(next_attempt_at) where status = 'pending';

alter table public.soltasite_checkout_intents enable row level security;
alter table public.soltasite_orders enable row level security;
alter table public.soltasite_webhook_events enable row level security;
alter table public.soltasite_assets enable row level security;
alter table public.soltasite_materials_submissions enable row level security;
alter table public.soltasite_commerce_outbox enable row level security;
revoke all on public.soltasite_checkout_intents, public.soltasite_orders,
  public.soltasite_webhook_events, public.soltasite_assets,
  public.soltasite_materials_submissions, public.soltasite_commerce_outbox
  from public, anon, authenticated, service_role;
grant usage on schema public to service_role;
grant select, insert, update on public.soltasite_checkout_intents, public.soltasite_orders,
  public.soltasite_assets, public.soltasite_commerce_outbox to service_role;
grant select, insert on public.soltasite_webhook_events, public.soltasite_materials_submissions to service_role;

create function public.soltasite_begin_checkout(p_request_id uuid,p_fingerprint text,p_name text,p_email text,p_terms_version text)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare row public.soltasite_checkout_intents; inserted boolean;
begin
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_email,0));
  insert into public.soltasite_checkout_intents(request_id,fingerprint,name,email,terms_version)
    values(p_request_id,p_fingerprint,p_name,p_email,p_terms_version) on conflict(request_id) do nothing;
  inserted := found;
  select * into strict row from public.soltasite_checkout_intents where request_id=p_request_id for update;
  if row.fingerprint <> p_fingerprint then raise exception 'idempotency_conflict' using errcode='23505'; end if;
  if inserted and (select count(*) from public.soltasite_checkout_intents where email=p_email and created_at>now()-interval '1 hour') > 5
    then raise exception 'rate_limited'; end if;
  return jsonb_build_object('stripe_session_id',row.stripe_session_id,'created_at',row.created_at);
end $$;

create function public.soltasite_attach_checkout_session(p_request_id uuid,p_session_id text)
returns void language plpgsql security invoker set search_path = '' as $$
declare existing text;
begin
  select stripe_session_id into strict existing from public.soltasite_checkout_intents where request_id=p_request_id for update;
  if existing is not null and existing <> p_session_id then raise exception 'idempotency_conflict' using errcode='23505'; end if;
  update public.soltasite_checkout_intents set stripe_session_id=p_session_id where request_id=p_request_id;
end $$;

create function public.soltasite_record_paid_order(p_event_id text,p_session_id text,p_request_id uuid,p_payment_intent_id text,p_amount integer,p_currency text,p_livemode boolean,p_customer_email text)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare intent public.soltasite_checkout_intents; result public.soltasite_orders; refunded boolean;
begin
  if p_amount <> 49900 or p_currency <> 'usd' then raise exception 'invalid_order'; end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_payment_intent_id,1));
  select * into strict intent from public.soltasite_checkout_intents where request_id=p_request_id for update;
  if intent.stripe_session_id is not null and intent.stripe_session_id <> p_session_id then raise exception 'invalid_order'; end if;
  insert into public.soltasite_webhook_events(event_id,payment_intent_id,kind) values(p_event_id,p_payment_intent_id,'paid') on conflict do nothing;
  if not exists(select 1 from public.soltasite_webhook_events where event_id=p_event_id and payment_intent_id=p_payment_intent_id and kind='paid')
    then raise exception 'idempotency_conflict' using errcode='23505'; end if;
  select exists(select 1 from public.soltasite_webhook_events where payment_intent_id=p_payment_intent_id and kind='refunded') into refunded;
  insert into public.soltasite_orders(request_id,stripe_session_id,stripe_payment_intent_id,name,email,amount_cents,currency,livemode,payment_status)
    values(p_request_id,p_session_id,p_payment_intent_id,intent.name,coalesce(nullif(lower(p_customer_email),''),intent.email),p_amount,p_currency,p_livemode,case when refunded then 'refunded' else 'paid' end)
    on conflict(stripe_session_id) do nothing;
  select * into strict result from public.soltasite_orders where stripe_session_id=p_session_id;
  if result.request_id <> p_request_id or result.stripe_payment_intent_id <> p_payment_intent_id or result.livemode <> p_livemode then raise exception 'invalid_order'; end if;
  update public.soltasite_checkout_intents set stripe_session_id=p_session_id where request_id=p_request_id;
  if result.payment_status='paid' then
    insert into public.soltasite_commerce_outbox(event_id,destination,event_type,order_id)
      values('soltasite:order:'||result.id||':paid','kp','v1.order.paid',result.id),
            ('soltasite:order:'||result.id||':paid','email','v1.order.paid',result.id) on conflict do nothing;
  end if;
  return result.id;
end $$;

create function public.soltasite_revoke_refunded_order(p_event_id text,p_payment_intent_id text)
returns void language plpgsql security invoker set search_path = '' as $$
begin
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_payment_intent_id,1));
  insert into public.soltasite_webhook_events(event_id,payment_intent_id,kind) values(p_event_id,p_payment_intent_id,'refunded') on conflict do nothing;
  if not exists(select 1 from public.soltasite_webhook_events where event_id=p_event_id and payment_intent_id=p_payment_intent_id and kind='refunded')
    then raise exception 'idempotency_conflict' using errcode='23505'; end if;
  update public.soltasite_orders set payment_status='refunded' where stripe_payment_intent_id=p_payment_intent_id;
  update public.soltasite_commerce_outbox set status='cancelled'
    where order_id in (select id from public.soltasite_orders where stripe_payment_intent_id=p_payment_intent_id) and status in ('pending','failed');
end $$;

create function public.soltasite_reserve_asset(p_order_id uuid,p_request_id uuid,p_fingerprint text,p_kind text,p_file_name text,p_content_type text,p_size_bytes bigint)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare asset public.soltasite_assets; new_id uuid; extension text; total bigint; per_kind bigint;
begin
  perform 1 from public.soltasite_orders where id=p_order_id and payment_status='paid' for update;
  if not found then raise exception 'invalid_order'; end if;
  select * into asset from public.soltasite_assets where request_id=p_request_id;
  if found then
    if asset.order_id<>p_order_id or asset.fingerprint<>p_fingerprint then raise exception 'idempotency_conflict' using errcode='23505'; end if;
    return jsonb_build_object('id',asset.id,'path',asset.path);
  end if;
  select count(*),count(*) filter(where kind=p_kind) into total,per_kind from public.soltasite_assets where order_id=p_order_id;
  -- Final submissions permit 12/1/1. Reservation headroom permits replacing a draft file.
  -- A bounded number of abandoned reservations is cleaned up before enabling real uploads.
  if total>=32 or (p_kind='headshot' and per_kind>=24) or (p_kind in ('resume','font') and per_kind>=4) then raise exception 'upload_limit'; end if;
  extension := lower(substring(p_file_name from '\.([^.]+)$'));
  if extension is null or extension not in ('jpg','jpeg','png','pdf','otf','ttf','woff','woff2') then raise exception 'invalid_asset'; end if;
  if not ((p_kind='headshot' and p_content_type in ('image/jpeg','image/png') and extension in ('jpg','jpeg','png')) or
          (p_kind='resume' and p_content_type='application/pdf' and extension='pdf') or
          (p_kind='font' and p_content_type in ('font/otf','font/ttf','font/woff','font/woff2','application/font-woff','application/octet-stream') and extension in ('otf','ttf','woff','woff2')))
    then raise exception 'invalid_asset'; end if;
  new_id := gen_random_uuid();
  insert into public.soltasite_assets(id,order_id,request_id,fingerprint,kind,file_name,path,content_type,size_bytes)
    values(new_id,p_order_id,p_request_id,p_fingerprint,p_kind,p_file_name,p_order_id||'/'||new_id||'.'||extension,p_content_type,p_size_bytes) returning * into asset;
  return jsonb_build_object('id',asset.id,'path',asset.path);
end $$;

create function public.soltasite_submit_materials(p_order_id uuid,p_request_id uuid,p_fingerprint text,p_answers jsonb,p_assets jsonb)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare submission public.soltasite_materials_submissions; ids uuid[]; expected integer;
begin
  perform 1 from public.soltasite_orders where id=p_order_id and payment_status='paid' for update;
  if not found then raise exception 'invalid_order'; end if;
  select * into submission from public.soltasite_materials_submissions where request_id=p_request_id;
  if found then
    if submission.order_id<>p_order_id or submission.fingerprint<>p_fingerprint then raise exception 'idempotency_conflict' using errcode='23505'; end if;
    return jsonb_build_object('submission_id',submission.id);
  end if;
  if jsonb_typeof(p_assets->'headshots') is distinct from 'array' or jsonb_array_length(p_assets->'headshots')>12 then raise exception 'invalid_assets'; end if;
  select coalesce(array_agg(value::uuid),array[]::uuid[]) into ids from jsonb_array_elements_text(p_assets->'headshots');
  if p_assets->>'resume' is not null then ids:=array_append(ids,(p_assets->>'resume')::uuid); end if;
  if p_assets->>'font_file' is not null then ids:=array_append(ids,(p_assets->>'font_file')::uuid); end if;
  expected:=cardinality(ids);
  if expected <> (select count(distinct x) from unnest(ids) x) then raise exception 'invalid_assets'; end if;
  if expected <> (select count(*) from public.soltasite_assets where id=any(ids) and order_id=p_order_id and verified_at is not null) then raise exception 'invalid_assets'; end if;
  if exists(select 1 from jsonb_array_elements_text(p_assets->'headshots') h(value) join public.soltasite_assets a on a.id=h.value::uuid where a.kind<>'headshot') or
    exists(select 1 from public.soltasite_assets where id=(p_assets->>'resume')::uuid and kind<>'resume') or
    exists(select 1 from public.soltasite_assets where id=(p_assets->>'font_file')::uuid and kind<>'font') then raise exception 'invalid_assets'; end if;
  if (select count(*) from public.soltasite_materials_submissions where order_id=p_order_id and created_at>now()-interval '1 hour')>=10 then raise exception 'rate_limited'; end if;
  insert into public.soltasite_materials_submissions(order_id,request_id,fingerprint,answers,assets)
    values(p_order_id,p_request_id,p_fingerprint,p_answers,p_assets) returning * into submission;
  update public.soltasite_orders set materials_submitted_at=now() where id=p_order_id;
  insert into public.soltasite_commerce_outbox(event_id,destination,event_type,order_id,submission_id)
    values('soltasite:materials:'||submission.id||':submitted','kp','v1.materials.submitted',p_order_id,submission.id),
          ('soltasite:materials:'||submission.id||':submitted','email','v1.materials.submitted',p_order_id,submission.id);
  return jsonb_build_object('submission_id',submission.id);
end $$;

revoke all on function public.soltasite_begin_checkout(uuid,text,text,text,text),
  public.soltasite_attach_checkout_session(uuid,text),
  public.soltasite_record_paid_order(text,text,uuid,text,integer,text,boolean,text),
  public.soltasite_revoke_refunded_order(text,text),
  public.soltasite_reserve_asset(uuid,uuid,text,text,text,text,bigint),
  public.soltasite_submit_materials(uuid,uuid,text,jsonb,jsonb) from public,anon,authenticated;
grant execute on function public.soltasite_begin_checkout(uuid,text,text,text,text),
  public.soltasite_attach_checkout_session(uuid,text),
  public.soltasite_record_paid_order(text,text,uuid,text,integer,text,boolean,text),
  public.soltasite_revoke_refunded_order(text,text),
  public.soltasite_reserve_asset(uuid,uuid,text,text,text,text,bigint),
  public.soltasite_submit_materials(uuid,uuid,text,jsonb,jsonb) to service_role;

-- Private bucket: there are deliberately no anon/authenticated object policies.
-- The backend creates short-lived, object-specific upload/download capabilities.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('soltasite-headshots','soltasite-headshots',false,26214400,array['image/jpeg','image/png']),
      ('soltasite-files','soltasite-files',false,10485760,
       array['application/pdf','font/otf','font/ttf','font/woff','font/woff2','application/font-woff','application/octet-stream']);
