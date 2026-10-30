import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { after, afterEach, before, beforeEach, test } from "node:test";
import { PGlite } from "@electric-sql/pglite";

// Real local PostgreSQL WASM execution. This is not hosted Supabase/Auth/Storage QA.
// Only Supabase's built-in roles and bucket catalog are emulated; RPCs are unmodified.
let db: PGlite;
const fingerprint = "a".repeat(64);
const noAssets = { headshots: [], resume: null, font_file: null };
type Checkout = { requestId: string; sessionId: string; paymentId: string; eventId: string; email: string };

before(async () => {
  db = new PGlite();
  await db.exec(`
    create role anon nologin;
    create role authenticated nologin;
    create role service_role nologin bypassrls;
    create schema storage;
    create table storage.buckets (
      id text primary key, name text, public boolean,
      file_size_limit bigint, allowed_mime_types text[]
    );
  `);
  const directory = new URL("../../supabase/migrations/", import.meta.url);
  for (const file of (await readdir(directory)).filter(name => name.endsWith(".sql")).sort()) {
    await db.exec(await readFile(new URL(file, directory), "utf8"));
  }
});
beforeEach(async () => { await db.exec("begin; set local role service_role;"); });
afterEach(async () => { await db.exec("rollback;"); });
after(async () => { await db?.close(); });

async function rejectSql(sql: string, params: unknown[], code: string, message?: string) {
  await db.exec("savepoint expected_failure;");
  let failure: unknown;
  try { await db.query(sql, params); } catch (error) { failure = error; }
  await db.exec("rollback to savepoint expected_failure; release savepoint expected_failure;");
  assert.ok(failure, "Operation unexpectedly succeeded");
  assert.equal((failure as { code?: string }).code, code);
  if (message) assert.equal((failure as Error).message, message);
}

async function checkout(label: string): Promise<Checkout> {
  const id = randomUUID();
  const value = { requestId: id, sessionId: `cs_test_${id.replaceAll("-", "")}`, paymentId: `pi_${id.replaceAll("-", "")}`, eventId: `evt_${id.replaceAll("-", "")}`, email: `${label}@example.test` };
  await db.query("select public.soltasite_begin_checkout($1::uuid,$2,$3,$4,$5)", [id, fingerprint, "Synthetic Actor", value.email, "test-terms-v1"]);
  return value;
}

const paidSql = "select public.soltasite_record_paid_order($1,$2,$3::uuid,$4,$5::integer,$6,$7::boolean,$8) as id";
function paidArgs(value: Checkout, overrides: { eventId?: string; livemode?: boolean } = {}) {
  return [overrides.eventId ?? value.eventId, value.sessionId, value.requestId, value.paymentId, 49900, "usd", overrides.livemode ?? false, value.email];
}
async function paid(value: Checkout): Promise<string> {
  return (await db.query<{ id: string }>(paidSql, paidArgs(value))).rows[0].id;
}
async function count(table: "soltasite_orders" | "soltasite_webhook_events" | "soltasite_materials_submissions" | "soltasite_commerce_outbox") {
  return (await db.query<{ total: number }>(`select count(*)::integer as total from public.${table}`)).rows[0].total;
}

test("a paid event creates one order and durable KP/email events; payment retry does not duplicate them", async () => {
  const value = await checkout("paid-retry");
  const id = await paid(value);
  assert.equal(await paid(value), id);
  assert.equal(await count("soltasite_orders"), 1);
  assert.equal(await count("soltasite_webhook_events"), 1);
  const events = await db.query<{ destination: string; status: string; order_id: string }>("select destination,status,order_id from public.soltasite_commerce_outbox order by destination");
  assert.deepEqual(events.rows, [{ destination: "email", status: "pending", order_id: id }, { destination: "kp", status: "pending", order_id: id }]);
  await rejectSql(paidSql, paidArgs(value, { eventId: "evt_changed_mode", livemode: true }), "P0001", "invalid_order");
  assert.equal(await count("soltasite_webhook_events"), 1);
  assert.equal(await count("soltasite_commerce_outbox"), 2);
});

test("a checkout request key cannot be reused for a changed fingerprint", async () => {
  const value = await checkout("checkout-conflict");
  await rejectSql("select public.soltasite_begin_checkout($1::uuid,$2,$3,$4,$5)", [value.requestId, "b".repeat(64), "Changed Actor", value.email, "test-terms-v1"], "23505", "idempotency_conflict");
  const rows = await db.query<{ name: string; fingerprint: string }>("select name,fingerprint from public.soltasite_checkout_intents where request_id=$1", [value.requestId]);
  assert.deepEqual(rows.rows, [{ name: "Synthetic Actor", fingerprint }]);
});

test("an outbox failure rolls back payment, webhook receipt, and checkout attachment together", async () => {
  const value = await checkout("payment-rollback");
  await db.exec("reset role; alter table public.soltasite_commerce_outbox add constraint simulate_outbox_failure check (false) not valid; set local role service_role;");
  await rejectSql(paidSql, paidArgs(value), "23514");
  assert.equal(await count("soltasite_orders"), 0);
  assert.equal(await count("soltasite_webhook_events"), 0);
  const intent = await db.query<{ stripe_session_id: string | null }>("select stripe_session_id from public.soltasite_checkout_intents where request_id=$1", [value.requestId]);
  assert.equal(intent.rows[0].stripe_session_id, null);
});

test("a refund received before payment is a tombstone and cannot later open paid access or enqueue work", async () => {
  const value = await checkout("refund-first");
  await db.query("select public.soltasite_revoke_refunded_order($1,$2)", ["evt_refund_first", value.paymentId]);
  const id = await paid(value);
  assert.equal(await paid(value), id);
  const order = await db.query<{ payment_status: string }>("select payment_status from public.soltasite_orders where id=$1", [id]);
  assert.equal(order.rows[0].payment_status, "refunded");
  assert.equal(await count("soltasite_commerce_outbox"), 0);
  await rejectSql("select public.soltasite_reserve_asset($1::uuid,$2::uuid,$3,$4,$5,$6,$7::bigint)", [id, randomUUID(), fingerprint, "headshot", "photo.jpg", "image/jpeg", 100], "P0001", "invalid_order");
  await rejectSql("select public.soltasite_submit_materials($1::uuid,$2::uuid,$3,$4::jsonb,$5::jsonb)", [id, randomUUID(), fingerprint, JSON.stringify({ name: "Synthetic Actor" }), JSON.stringify(noAssets)], "P0001", "invalid_order");
});

test("a refund after payment cancels pending deliveries and a paid retry never reactivates them", async () => {
  const value = await checkout("refund-after");
  await paid(value);
  await db.query("select public.soltasite_revoke_refunded_order($1,$2)", ["evt_refund_after", value.paymentId]);
  await paid(value);
  const events = await db.query<{ status: string }>("select status from public.soltasite_commerce_outbox");
  assert.equal(events.rows.length, 2);
  assert.ok(events.rows.every(event => event.status === "cancelled"));
});

test("a webhook event ID cannot be reused for a different payment or event kind", async () => {
  const first = await checkout("event-owner-one");
  await paid(first);
  const second = await checkout("event-owner-two");
  await rejectSql(paidSql, paidArgs(second, { eventId: first.eventId }), "23505", "idempotency_conflict");
  await rejectSql("select public.soltasite_revoke_refunded_order($1,$2)", [first.eventId, first.paymentId], "23505", "idempotency_conflict");
  await db.query("select public.soltasite_revoke_refunded_order($1,$2)", ["evt_distinct_refund", second.paymentId]);
  await rejectSql("select public.soltasite_revoke_refunded_order($1,$2)", ["evt_distinct_refund", first.paymentId], "23505", "idempotency_conflict");
  assert.equal(await count("soltasite_orders"), 1);
  assert.equal(await count("soltasite_commerce_outbox"), 2);
});

test("anonymous and authenticated users cannot read commerce data or call service RPCs; RLS also defaults to deny", async () => {
  const value = await checkout("private-order");
  await paid(value);
  await db.exec("reset role;");
  const buckets = await db.query<{ id: string; public: boolean; file_size_limit: number }>("select id,public,file_size_limit::integer from storage.buckets order by id");
  assert.deepEqual(buckets.rows, [
    { id: "soltasite-files", public: false, file_size_limit: 10 * 1024 * 1024 },
    { id: "soltasite-headshots", public: false, file_size_limit: 25 * 1024 * 1024 },
  ]);
  const tables = await db.query<{ relname: string; relrowsecurity: boolean }>("select relname,relrowsecurity from pg_class where relnamespace='public'::regnamespace and relkind='r' and relname like 'soltasite_%'");
  assert.ok(tables.rows.length >= 6);
  assert.ok(tables.rows.every(table => table.relrowsecurity));
  for (const role of ["anon", "authenticated"] as const) {
    const grants = await db.query<{ allowed: boolean }>("select has_function_privilege($1,p.oid,'EXECUTE') as allowed from pg_proc p where p.pronamespace='public'::regnamespace and p.proname like 'soltasite_%'", [role]);
    assert.ok(grants.rows.length >= 6);
    assert.ok(grants.rows.every(grant => !grant.allowed));
    await db.exec(`set local role ${role};`);
    for (const table of tables.rows) await rejectSql(`select * from public.${table.relname}`, [], "42501");
    await rejectSql("select public.soltasite_begin_checkout($1::uuid,$2,$3,$4,$5)", [randomUUID(), fingerprint, "Unauthorized", "unauthorized@example.test", "test-v1"], "42501");
    await db.exec("reset role;");
  }
  // Prove the second layer: a stray SELECT grant alone does not expose existing order rows.
  await db.exec("grant select on public.soltasite_orders to anon,authenticated;");
  for (const role of ["anon", "authenticated"] as const) {
    await db.exec(`set local role ${role};`);
    assert.equal(await count("soltasite_orders"), 0);
    await db.exec("reset role;");
  }
});

test("materials cannot claim another order's verified asset and retries preserve one receipt", async () => {
  const first = await paid(await checkout("materials-owner-one"));
  const second = await paid(await checkout("materials-owner-two"));
  const reserved = await db.query<{ receipt: { id: string } }>("select public.soltasite_reserve_asset($1::uuid,$2::uuid,$3,$4,$5,$6,$7::bigint) as receipt", [first, randomUUID(), fingerprint, "headshot", "photo.jpg", "image/jpeg", 100]);
  const assetId = reserved.rows[0].receipt.id;
  await db.query("update public.soltasite_assets set verified_at=now() where id=$1", [assetId]);
  const assetJson = JSON.stringify({ ...noAssets, headshots: [assetId] });
  const sql = "select public.soltasite_submit_materials($1::uuid,$2::uuid,$3,$4::jsonb,$5::jsonb) as receipt";
  const request = randomUUID();
  const args = [first, request, fingerprint, JSON.stringify({ name: "Synthetic Actor" }), assetJson];
  await rejectSql(sql, [second, randomUUID(), ...args.slice(2)], "P0001", "invalid_assets");
  assert.equal(await count("soltasite_materials_submissions"), 0);
  const one = (await db.query<{ receipt: { submission_id: string } }>(sql, args)).rows[0].receipt;
  const replay = (await db.query<{ receipt: { submission_id: string } }>(sql, args)).rows[0].receipt;
  assert.deepEqual(replay, one);
  await rejectSql(sql, [first, request, "b".repeat(64), ...args.slice(3)], "23505", "idempotency_conflict");
  assert.equal(await count("soltasite_materials_submissions"), 1);
  assert.equal(await count("soltasite_commerce_outbox"), 6);
});

test("a materials outbox failure rolls back the submission and order progress timestamp", async () => {
  const id = await paid(await checkout("materials-rollback"));
  await db.exec("reset role; alter table public.soltasite_commerce_outbox add constraint simulate_materials_failure check (event_type <> 'v1.materials.submitted') not valid; set local role service_role;");
  await rejectSql("select public.soltasite_submit_materials($1::uuid,$2::uuid,$3,$4::jsonb,$5::jsonb)", [id, randomUUID(), fingerprint, JSON.stringify({ name: "Synthetic Actor" }), JSON.stringify(noAssets)], "23514");
  assert.equal(await count("soltasite_materials_submissions"), 0);
  const order = await db.query<{ materials_submitted_at: string | null }>("select materials_submitted_at from public.soltasite_orders where id=$1", [id]);
  assert.equal(order.rows[0].materials_submitted_at, null);
  assert.equal(await count("soltasite_commerce_outbox"), 2);
});
