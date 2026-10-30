-- Target: NEW SoltaSite project rarcknqbxaeffevgpbvj, after commerce migration.
-- Execute the entire script as the migration/admin role. No external services run.
-- Only random synthetic records are written. Every write is rolled back.
-- Failure raises an exception; the caller must stop and ROLLBACK before continuing.
begin;
set local lock_timeout = '3s';
set local statement_timeout = '25s';

do $verify$
declare
  table_name text;
  role_name text;
  privilege_name text;
  function_id oid;
  denied boolean;
  matched boolean;
  nonce text := replace(gen_random_uuid()::text, '-', '');
  request_a uuid := gen_random_uuid();
  request_b uuid := gen_random_uuid();
  request_c uuid := gen_random_uuid();
  asset_request uuid := gen_random_uuid();
  materials_request uuid := gen_random_uuid();
  order_a uuid;
  order_b uuid;
  order_c uuid;
  asset_a uuid;
  receipt jsonb;
  replay jsonb;
  payload jsonb;
  synthetic_name text := 'Synthetic hosted verification';
  fingerprint_a text := repeat('a', 64);
  fingerprint_b text := repeat('b', 64);
  app_tables text[] := array[
    'soltasite_checkout_intents','soltasite_orders','soltasite_webhook_events',
    'soltasite_assets','soltasite_materials_submissions','soltasite_commerce_outbox'
  ];
  rpc_names text[] := array[
    'soltasite_begin_checkout','soltasite_attach_checkout_session',
    'soltasite_record_paid_order','soltasite_revoke_refunded_order',
    'soltasite_reserve_asset','soltasite_submit_materials'
  ];
begin
  -- Catalog/effective grants, not merely policies attached to the table.
  foreach table_name in array app_tables loop
    if not exists(select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace
      where n.nspname='public' and c.relname=table_name and c.relkind='r' and c.relrowsecurity)
      then raise exception 'Hosted verification: missing table or RLS: %', table_name; end if;
    foreach role_name in array array['anon','authenticated'] loop
      foreach privilege_name in array array['SELECT','INSERT','UPDATE','DELETE','TRUNCATE','REFERENCES','TRIGGER'] loop
        if has_table_privilege(role_name,'public.'||table_name,privilege_name)
          then raise exception 'Hosted verification: unexpected table grant: % % %',role_name,table_name,privilege_name; end if;
      end loop;
      foreach privilege_name in array array['SELECT','INSERT','UPDATE','REFERENCES'] loop
        if has_any_column_privilege(role_name,'public.'||table_name,privilege_name)
          then raise exception 'Hosted verification: unexpected column grant: % % %',role_name,table_name,privilege_name; end if;
      end loop;
    end loop;
    if not has_table_privilege('service_role','public.'||table_name,'SELECT') or
       not has_table_privilege('service_role','public.'||table_name,'INSERT')
      then raise exception 'Hosted verification: missing service grant: %',table_name; end if;
  end loop;
  if not has_schema_privilege('service_role','public','USAGE') or
     not exists(select 1 from pg_roles where rolname='service_role' and rolbypassrls)
    then raise exception 'Hosted verification: service role lacks required schema usage or RLS bypass'; end if;
  if (select count(*) from pg_proc p where p.pronamespace='public'::regnamespace and p.proname=any(rpc_names))<>6
    then raise exception 'Hosted verification: expected exactly six service RPCs'; end if;
  for function_id in select p.oid from pg_proc p where p.pronamespace='public'::regnamespace and p.proname=any(rpc_names) loop
    if exists(select 1 from pg_proc p where p.oid=function_id and (p.prosecdef or not coalesce(p.proconfig @> array['search_path=""'],false)))
      then raise exception 'Hosted verification: RPC is definer or lacks fixed empty search_path'; end if;
    if has_function_privilege('anon',function_id,'EXECUTE') or has_function_privilege('authenticated',function_id,'EXECUTE') or
       not has_function_privilege('service_role',function_id,'EXECUTE')
      then raise exception 'Hosted verification: incorrect effective RPC permissions'; end if;
  end loop;

  -- Bucket privacy and byte/type caps are enforced by hosted Storage settings.
  if not exists(select 1 from storage.buckets where id='soltasite-headshots' and public=false and file_size_limit=26214400
      and allowed_mime_types @> array['image/jpeg','image/png'] and allowed_mime_types <@ array['image/jpeg','image/png']) or
     not exists(select 1 from storage.buckets where id='soltasite-files' and public=false and file_size_limit=10485760
      and allowed_mime_types @> array['application/pdf','font/otf','font/ttf','font/woff','font/woff2','application/font-woff','application/octet-stream']
      and allowed_mime_types <@ array['application/pdf','font/otf','font/ttf','font/woff','font/woff2','application/font-woff','application/octet-stream'])
    then raise exception 'Hosted verification: private bucket limits or MIME allowlists differ'; end if;

  -- Exercise actual role switching. A failure to SET ROLE itself fails the test.
  foreach role_name in array array['anon','authenticated'] loop
    execute format('set local role %I',role_name);
    foreach table_name in array app_tables loop
      denied:=false;
      begin
        execute format('select 1 from public.%I where false',table_name);
      exception when insufficient_privilege then denied:=true;
      end;
      if not denied then raise exception 'Hosted verification: role could read protected table: % %',role_name,table_name; end if;
    end loop;
    denied:=false;
    begin
      perform public.soltasite_begin_checkout(gen_random_uuid(),fingerprint_a,synthetic_name,'denied-'||nonce||'@example.invalid','verification-only');
    exception when insufficient_privilege then denied:=true;
    end;
    if not denied then raise exception 'Hosted verification: public role could call service RPC'; end if;
    execute 'reset role';
  end loop;

  -- All following writes run as the same role the server API key uses.
  execute 'set local role service_role';
  receipt:=public.soltasite_begin_checkout(request_a,fingerprint_a,synthetic_name,'verify-a-'||nonce||'@example.invalid','verification-only');
  if receipt->>'created_at' is null or receipt->>'stripe_session_id' is not null
    then raise exception 'Hosted verification: malformed new checkout receipt'; end if;
  matched:=false;
  begin
    perform public.soltasite_begin_checkout(request_a,fingerprint_b,synthetic_name,'verify-a-'||nonce||'@example.invalid','verification-only');
  exception when unique_violation then
    if sqlerrm<>'idempotency_conflict' then raise; end if;
    matched:=true;
  end;
  if not matched then raise exception 'Hosted verification: changed checkout fingerprint was accepted'; end if;
  perform public.soltasite_attach_checkout_session(request_a,'cs_test_verify_'||nonce||'_a');
  perform public.soltasite_attach_checkout_session(request_a,'cs_test_verify_'||nonce||'_a');
  order_a:=public.soltasite_record_paid_order('evt_verify_'||nonce||'_a','cs_test_verify_'||nonce||'_a',request_a,'pi_verify_'||nonce||'_a',49900,'usd',false,'verify-a-'||nonce||'@example.invalid');
  if public.soltasite_record_paid_order('evt_verify_'||nonce||'_a','cs_test_verify_'||nonce||'_a',request_a,'pi_verify_'||nonce||'_a',49900,'usd',false,'verify-a-'||nonce||'@example.invalid')<>order_a
    then raise exception 'Hosted verification: paid retry changed order identity'; end if;
  if (select count(*) from public.soltasite_commerce_outbox where order_id=order_a and event_type='v1.order.paid' and status='pending')<>2
    then raise exception 'Hosted verification: payment did not atomically queue exactly two destinations'; end if;

  -- This failure occurs AFTER the function tries to insert a new event row.
  -- Its event row must roll back, proving the hosted function's transactional boundary.
  matched:=false;
  begin
    perform public.soltasite_record_paid_order('evt_verify_'||nonce||'_bad_mode','cs_test_verify_'||nonce||'_a',request_a,'pi_verify_'||nonce||'_a',49900,'usd',true,'verify-a-'||nonce||'@example.invalid');
  exception when raise_exception then
    if sqlerrm<>'invalid_order' then raise; end if;
    matched:=true;
  end;
  if not matched or exists(select 1 from public.soltasite_webhook_events where event_id='evt_verify_'||nonce||'_bad_mode')
    then raise exception 'Hosted verification: failed payment left a partial event'; end if;

  perform public.soltasite_begin_checkout(request_b,fingerprint_a,synthetic_name,'verify-b-'||nonce||'@example.invalid','verification-only');
  matched:=false;
  begin
    perform public.soltasite_record_paid_order('evt_verify_'||nonce||'_a','cs_test_verify_'||nonce||'_b',request_b,'pi_verify_'||nonce||'_b',49900,'usd',false,'verify-b-'||nonce||'@example.invalid');
  exception when unique_violation then
    if sqlerrm<>'idempotency_conflict' then raise; end if;
    matched:=true;
  end;
  if not matched or exists(select 1 from public.soltasite_orders where request_id=request_b)
    then raise exception 'Hosted verification: event identity reuse created an order'; end if;
  order_b:=public.soltasite_record_paid_order('evt_verify_'||nonce||'_b','cs_test_verify_'||nonce||'_b',request_b,'pi_verify_'||nonce||'_b',49900,'usd',false,'verify-b-'||nonce||'@example.invalid');

  -- A synthetic reservation has no physical object. Finalize must reject it first.
  receipt:=public.soltasite_reserve_asset(order_a,asset_request,fingerprint_a,'headshot','synthetic.jpg','image/jpeg',100);
  asset_a:=(receipt->>'id')::uuid;
  payload:=jsonb_build_object('headshots',jsonb_build_array(asset_a),'resume',null,'font_file',null);
  matched:=false;
  begin
    perform public.soltasite_submit_materials(order_a,materials_request,fingerprint_a,jsonb_build_object('name',synthetic_name),payload);
  exception when raise_exception then
    if sqlerrm<>'invalid_assets' then raise; end if;
    matched:=true;
  end;
  if not matched then raise exception 'Hosted verification: unverified asset was accepted'; end if;
  -- Database-only verification marker for synthetic ownership tests; no Storage request.
  update public.soltasite_assets set verified_at=now() where id=asset_a and order_id=order_a;
  matched:=false;
  begin
    perform public.soltasite_submit_materials(order_b,materials_request,fingerprint_a,jsonb_build_object('name',synthetic_name),payload);
  exception when raise_exception then
    if sqlerrm<>'invalid_assets' then raise; end if;
    matched:=true;
  end;
  if not matched or exists(select 1 from public.soltasite_materials_submissions where request_id=materials_request)
    then raise exception 'Hosted verification: foreign asset was accepted or failure left a submission'; end if;
  receipt:=public.soltasite_submit_materials(order_a,materials_request,fingerprint_a,jsonb_build_object('name',synthetic_name),payload);
  replay:=public.soltasite_submit_materials(order_a,materials_request,fingerprint_a,jsonb_build_object('name',synthetic_name),payload);
  if receipt is distinct from replay or (select count(*) from public.soltasite_materials_submissions where request_id=materials_request)<>1 or
     (select count(*) from public.soltasite_commerce_outbox where submission_id=(receipt->>'submission_id')::uuid and status='pending')<>2 or
     (select materials_submitted_at from public.soltasite_orders where id=order_a) is null
    then raise exception 'Hosted verification: materials receipt/progress/outbox is not idempotent and atomic'; end if;

  -- Refund after payment cancels queued work; a paid replay cannot restore access.
  perform public.soltasite_revoke_refunded_order('evt_verify_'||nonce||'_refund_a','pi_verify_'||nonce||'_a');
  perform public.soltasite_record_paid_order('evt_verify_'||nonce||'_a','cs_test_verify_'||nonce||'_a',request_a,'pi_verify_'||nonce||'_a',49900,'usd',false,'verify-a-'||nonce||'@example.invalid');
  if (select payment_status from public.soltasite_orders where id=order_a)<>'refunded' or
     exists(select 1 from public.soltasite_commerce_outbox where order_id=order_a and status<>'cancelled')
    then raise exception 'Hosted verification: paid replay resurrected refunded work'; end if;

  -- Refund before paid-event delivery creates a tombstone, never a paid window.
  perform public.soltasite_begin_checkout(request_c,fingerprint_a,synthetic_name,'verify-c-'||nonce||'@example.invalid','verification-only');
  perform public.soltasite_revoke_refunded_order('evt_verify_'||nonce||'_refund_c','pi_verify_'||nonce||'_c');
  order_c:=public.soltasite_record_paid_order('evt_verify_'||nonce||'_c','cs_test_verify_'||nonce||'_c',request_c,'pi_verify_'||nonce||'_c',49900,'usd',false,'verify-c-'||nonce||'@example.invalid');
  if (select payment_status from public.soltasite_orders where id=order_c)<>'refunded' or
     exists(select 1 from public.soltasite_commerce_outbox where order_id=order_c)
    then raise exception 'Hosted verification: refund-before-paid opened access or queued work'; end if;
  matched:=false;
  begin
    perform public.soltasite_reserve_asset(order_c,gen_random_uuid(),fingerprint_a,'headshot','synthetic.jpg','image/jpeg',100);
  exception when raise_exception then
    if sqlerrm<>'invalid_order' then raise; end if;
    matched:=true;
  end;
  if not matched then raise exception 'Hosted verification: refunded order could reserve an upload'; end if;

  execute 'reset role';
  raise notice 'Hosted verification passed: ACL/RLS, service RPCs, private buckets, paid replay, transactional rollback, event identity, asset ownership, materials receipt, and both refund orders. All synthetic rows will be rolled back.';
end
$verify$;

select jsonb_build_object('status','passed','persistence','ROLLBACK follows; no synthetic data retained',
  'checks',array['effective ACL and RLS','private bucket caps','service-role execution','paid idempotency',
  'late-failure rollback','webhook identity','asset ownership and verification','materials idempotency','refund ordering']) as hosted_verification;
rollback;
