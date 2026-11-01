import test from 'node:test';
import assert from 'node:assert/strict';
import { commerceConfig } from '../../lib/server/config.ts';
import { ApiError } from '../../lib/server/errors.ts';
import { boundedBody, errorResponse, readJson, requireOrigin } from '../../lib/server/http.ts';

const fixture: Record<string, string> = {
  SOLTASITE_COMMERCE_ENABLED: 'true', SOLTASITE_APP_ORIGIN: 'https://soltasite.example',
  SOLTASITE_STRIPE_MODE: 'test', SUPABASE_URL: 'https://testproject.supabase.co',
  SUPABASE_SECRET_KEY: 'sb_secret_fixture_only', STRIPE_SECRET_KEY: 'sk_test_fixture_only',
  STRIPE_WEBHOOK_SECRET: 'whsec_fixture_only', STRIPE_PRICE_ID: 'price_fixture',
  TURNSTILE_SECRET_KEY: 'turnstile-fixture-only', TURNSTILE_ALLOWED_HOSTNAMES: 'soltasite.example',
  ORDER_ACCESS_SECRET: 'fixture-only-secret-at-least-thirty-two-characters',
};

test('commerce fails closed before any providers are configured or explicitly enabled', () => {
  for (const env of [{}, { ...fixture, SOLTASITE_COMMERCE_ENABLED: 'false' }, { ...fixture, SUPABASE_SECRET_KEY: '' }, { ...fixture, ORDER_ACCESS_SECRET: 'short' }]) {
    assert.throws(() => commerceConfig(env), (error: unknown) => error instanceof ApiError && error.status === 503);
  }
});
test('commerce rejects mixed live/test credentials and unexpected database/origin URLs', () => {
  assert.equal(commerceConfig(fixture).live, false);
  for (const change of [
    { STRIPE_SECRET_KEY: 'sk_live_fixture_only' }, { SUPABASE_URL: 'https://attacker.example' },
    { SUPABASE_URL: 'https://testproject.supabase.co?extra=1' },
    { SOLTASITE_APP_ORIGIN: 'https://user:password@soltasite.example' },
  ]) assert.throws(() => commerceConfig({ ...fixture, ...change }), ApiError);
});
test('write origin checks reject absent and cross-origin requests', () => {
  assert.throws(() => requireOrigin(new Request('https://soltasite.example/api/checkout'), fixture.SOLTASITE_APP_ORIGIN!), ApiError);
  assert.throws(() => requireOrigin(new Request('https://soltasite.example/api/checkout', { headers: { origin: 'https://other.example' } }), fixture.SOLTASITE_APP_ORIGIN!), ApiError);
  assert.doesNotThrow(() => requireOrigin(new Request('https://soltasite.example/api/checkout', { headers: { origin: 'https://soltasite.example' } }), fixture.SOLTASITE_APP_ORIGIN!));
});
test('bounded bodies reject streamed oversize content without relying on content-length', async () => {
  const request = new Request('https://soltasite.example/api/checkout', { method: 'POST', body: '12345' });
  await assert.rejects(boundedBody(request, 4), (error: unknown) => error instanceof ApiError && error.status === 413);
});
test('a stalled body times out and cancels the input stream', async () => {
  let cancelled = false;
  const body = new ReadableStream({ cancel() { cancelled = true; } });
  const request = new Request('https://soltasite.example/api/checkout', { method: 'POST', body, duplex: 'half' } as RequestInit);
  await assert.rejects(boundedBody(request, 128, 20), (error: unknown) => error instanceof ApiError && error.status === 408);
  assert.equal(cancelled, true);
});
test('JSON parsing rejects invalid UTF-8 and non-JSON content types', async () => {
  const badBytes = new Request('https://soltasite.example/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: new Uint8Array([0xff]) });
  await assert.rejects(readJson(badBytes), (error: unknown) => error instanceof ApiError && error.status === 400);
  await assert.rejects(readJson(new Request('https://soltasite.example/api/checkout', { method: 'POST', body: '{}' })), (error: unknown) => error instanceof ApiError && error.status === 415);
});
test('unexpected provider errors never disclose secrets or personal information', async () => {
  const response = errorResponse(new Error('secret sk_test_sensitive customer@example.com'));
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(response.headers.get('referrer-policy'), 'no-referrer');
  const text = await response.text();
  assert.doesNotMatch(text, /sk_test|customer@example/);
});
