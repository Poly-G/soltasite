import assert from 'node:assert/strict';
import test from 'node:test';
import { checkoutAttribution } from '../../lib/server/checkout-attribution.ts';
import { checkoutInput } from '../../lib/server/policies.ts';

const requestId = '22222222-2222-4222-8222-222222222222';

test('checkout and payment records retain the same site identity across production and preview', () => {
  for (const origin of ['https://soltasite.com', 'https://soltasite-preview.example']) {
    const attribution = checkoutAttribution(requestId, origin);
    for (const metadata of [attribution.metadata, attribution.payment_intent_data.metadata]) {
      assert.equal(metadata.source_system, 'soltasite');
      assert.equal(metadata.source_site, 'soltasite.com');
      assert.equal(metadata.source_origin, origin);
      assert.equal(metadata.request_id, requestId);
    }
    assert.match(attribution.payment_intent_data.description, /Solta Site.*Actor Website/);
    assert.equal(attribution.metadata.terms_version, 'soltasite-launch-v1');
  }
});

test('browser input cannot replace the site or payment attribution', () => {
  const customer = {
    requestId, name: 'Maya Ortiz', email: 'maya@example.test', termsAccepted: true,
    turnstileToken: 'test-verification-token', company: '',
  };
  for (const override of [
    { source_system: 'soltaworks' },
    { source_site: 'other.example' },
    { source_origin: 'https://other.example' },
    { metadata: { source_system: 'soltaworks' } },
    { payment_intent_data: { description: 'Another service' } },
  ]) {
    assert.equal(checkoutInput.safeParse({ ...customer, ...override }).success, false);
  }
});
