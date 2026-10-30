import test from 'node:test';
import assert from 'node:assert/strict';
import type Stripe from 'stripe';
import { ApiError } from '../../lib/server/errors.ts';
import { processVerifiedStripeEvent, type StripeEventEffects } from '../../lib/server/stripe-events.ts';

const requestId = 'a41c0d57-719e-4b9e-af52-c274aa32e73a';
const source = { source_system: 'soltasite', request_id: requestId };
const unrelatedMetadata: Stripe.Metadata[] = [{ source_system: 'soltaworks' }, {}];
function session(overrides: Partial<Stripe.Checkout.Session> = {}): Stripe.Checkout.Session {
  return {
    object: 'checkout.session', id: 'cs_test_fixture1234567890', mode: 'payment', status: 'complete',
    payment_status: 'paid', livemode: false, amount_total: 49900, currency: 'usd',
    metadata: { ...source }, client_reference_id: requestId, payment_intent: 'pi_fixture123',
    customer_email: 'synthetic@example.test', customer_details: null, ...overrides,
  } as Stripe.Checkout.Session;
}
function payment(overrides: Partial<Stripe.PaymentIntent> = {}): Stripe.PaymentIntent {
  return { object: 'payment_intent', id: 'pi_fixture123', livemode: false, amount: 49900,
    currency: 'usd', status: 'succeeded', metadata: { ...source }, ...overrides } as Stripe.PaymentIntent;
}
function charge(overrides: Partial<Stripe.Charge> = {}): Stripe.Charge {
  return { object: 'charge', id: 'ch_fixture123', livemode: false, amount: 49900, currency: 'usd',
    amount_refunded: 49900, paid: true, payment_intent: 'pi_fixture123', metadata: { ...source }, ...overrides } as Stripe.Charge;
}
function event(type: Stripe.Event.Type, object: Stripe.Checkout.Session | Stripe.Charge, livemode = false): Stripe.Event {
  return { id: 'evt_fixture123', object: 'event', type, livemode, data: { object } } as Stripe.Event;
}
function harness(values: { session?: Stripe.Checkout.Session; payment?: Stripe.PaymentIntent } = {}) {
  const calls = {
    sessions: [] as string[], payments: [] as string[],
    paid: [] as Parameters<StripeEventEffects['recordPaidOrder']>[0][],
    refunds: [] as Parameters<StripeEventEffects['revokeRefundedOrder']>[0][],
  };
  const effects: StripeEventEffects = {
    verifyPaidSession: async id => { calls.sessions.push(id); return values.session ?? session(); },
    retrievePaymentIntent: async id => { calls.payments.push(id); return values.payment ?? payment(); },
    recordPaidOrder: async input => { calls.paid.push(input); },
    revokeRefundedOrder: async input => { calls.refunds.push(input); },
  };
  return { effects, calls };
}
function invalidOrder(error: unknown): boolean { return error instanceof ApiError && error.status === 400 && error.code === 'invalid_order'; }

test('another site or untagged paid Checkout is acknowledged without retrieval or database work', async () => {
  for (const metadata of unrelatedMetadata) {
    for (const type of ['checkout.session.completed', 'checkout.session.async_payment_succeeded'] as const) {
      const { effects, calls } = harness();
      assert.equal(await processVerifiedStripeEvent(event(type, session({ metadata })), false, effects), 'ignored');
      assert.deepEqual(calls, { sessions: [], payments: [], paid: [], refunds: [] });
    }
  }
});

test('refunds explicitly assigned to another site do not retrieve or persist anything', async () => {
  const { effects, calls } = harness();
  assert.equal(await processVerifiedStripeEvent(event('charge.refunded', charge({ metadata: { source_system: 'soltaworks' } })), false, effects), 'ignored');
  assert.deepEqual(calls, { sessions: [], payments: [], paid: [], refunds: [] });
});

test('untagged refunds resolve PaymentIntent attribution and ignore unrelated payments without writes', async () => {
  for (const metadata of unrelatedMetadata) {
    const { effects, calls } = harness({ payment: payment({ metadata }) });
    assert.equal(await processVerifiedStripeEvent(event('charge.refunded', charge({ metadata: {} })), false, effects), 'ignored');
    assert.deepEqual(calls, { sessions: [], payments: ['pi_fixture123'], paid: [], refunds: [] });
  }
  const { effects, calls } = harness();
  assert.equal(await processVerifiedStripeEvent(event('charge.refunded', charge({ metadata: {}, payment_intent: null })), false, effects), 'ignored');
  assert.deepEqual(calls, { sessions: [], payments: [], paid: [], refunds: [] });
});

test('Solta Site paid events use canonical verification before writing the verified order', async () => {
  for (const type of ['checkout.session.completed', 'checkout.session.async_payment_succeeded'] as const) {
    const verified = session({ customer_details: { email: 'verified@example.test' } as Stripe.Checkout.Session.CustomerDetails });
    const { effects, calls } = harness({ session: verified });
    assert.equal(await processVerifiedStripeEvent(event(type, session()), false, effects), 'processed');
    assert.deepEqual(calls.sessions, [verified.id]);
    assert.deepEqual(calls.paid, [{
      p_event_id: 'evt_fixture123', p_session_id: verified.id, p_request_id: requestId,
      p_payment_intent_id: 'pi_fixture123', p_amount: 49900, p_currency: 'usd',
      p_livemode: false, p_customer_email: 'verified@example.test',
    }]);
    assert.deepEqual(calls.payments, []);
    assert.deepEqual(calls.refunds, []);
  }
});

test('unpaid completed checkouts are acknowledged; a succeeded event claiming unpaid is rejected', async () => {
  const { effects, calls } = harness();
  const unpaid = session({ payment_status: 'unpaid' });
  assert.equal(await processVerifiedStripeEvent(event('checkout.session.completed', unpaid), false, effects), 'ignored');
  await assert.rejects(processVerifiedStripeEvent(event('checkout.session.async_payment_succeeded', unpaid), false, effects), invalidOrder);
  assert.deepEqual(calls, { sessions: [], payments: [], paid: [], refunds: [] });
});

test('malformed Solta Site Checkout events and conflicting canonical sessions are not acknowledged', async () => {
  for (const candidate of [
    session({ metadata: { source_system: 'soltasite' } }),
    session({ client_reference_id: 'different-request' }),
    session({ id: 'invalid-session' }),
    session({ payment_status: 'no_payment_required' }),
  ]) {
    const { effects, calls } = harness();
    await assert.rejects(processVerifiedStripeEvent(event('checkout.session.completed', candidate), false, effects), invalidOrder);
    assert.deepEqual(calls, { sessions: [], payments: [], paid: [], refunds: [] });
  }
  for (const verified of [session({ payment_intent: null }), session({ metadata: { ...source, request_id: 'different-request' } })]) {
    const { effects, calls } = harness({ session: verified });
    await assert.rejects(processVerifiedStripeEvent(event('checkout.session.completed', session()), false, effects), invalidOrder);
    assert.deepEqual(calls.paid, []);
  }
});

test('attributed refunds use canonical PaymentIntent metadata even with missing charge metadata or an early refund', async () => {
  for (const refunded of [charge(), charge({ metadata: {} }), charge({ amount_refunded: 100, payment_intent: payment() })]) {
    const { effects, calls } = harness();
    assert.equal(await processVerifiedStripeEvent(event('charge.refunded', refunded), false, effects), 'processed');
    assert.deepEqual(calls, { sessions: [], payments: ['pi_fixture123'], paid: [],
      refunds: [{ p_event_id: 'evt_fixture123', p_payment_intent_id: 'pi_fixture123' }] });
  }
});

test('malformed or contradictory Solta Site refunds cannot create refund records', async () => {
  const cases = [
    { charge: charge({ payment_intent: null }) },
    { charge: charge({ amount_refunded: 0 }) },
    { charge: charge({ amount_refunded: 50000 }) },
    { charge: charge({ metadata: { source_system: 'soltasite' } }) },
    { charge: charge({ metadata: { ...source, request_id: 'different-request' } }) },
    { charge: charge(), payment: payment({ metadata: { source_system: 'soltaworks' } }) },
    { charge: charge({ metadata: {} }), payment: payment({ metadata: { source_system: 'soltasite' } }) },
    { charge: charge(), payment: payment({ amount: 25000 }) },
    { charge: charge(), payment: payment({ livemode: true }) },
  ];
  for (const value of cases) {
    const { effects, calls } = harness({ payment: value.payment });
    await assert.rejects(processVerifiedStripeEvent(event('charge.refunded', value.charge), false, effects), invalidOrder);
    assert.deepEqual(calls.paid, []);
    assert.deepEqual(calls.refunds, []);
  }
});

test('mode mismatch is rejected before attribution or provider work', async () => {
  const { effects, calls } = harness();
  await assert.rejects(processVerifiedStripeEvent(event('checkout.session.completed', session({ metadata: {} }), true), false, effects),
    (error: unknown) => error instanceof ApiError && error.code === 'invalid_mode');
  assert.deepEqual(calls, { sessions: [], payments: [], paid: [], refunds: [] });
});

test('canonical verification, Stripe lookup and database failures propagate so Stripe can retry', async () => {
  const failure = new Error('synthetic provider failure');
  for (const effect of ['verifyPaidSession', 'retrievePaymentIntent', 'recordPaidOrder', 'revokeRefundedOrder'] as const) {
    const { effects } = harness();
    effects[effect] = async () => { throw failure; };
    const input = effect === 'verifyPaidSession' || effect === 'recordPaidOrder'
      ? event('checkout.session.completed', session()) : event('charge.refunded', charge());
    await assert.rejects(processVerifiedStripeEvent(input, false, effects), error => error === failure);
  }
});
