import type Stripe from 'stripe';
import { ApiError } from './errors.ts';
import { ORDER_AMOUNT, ORDER_CURRENCY, SOURCE_SYSTEM } from './policies.ts';

type PaidOrderWrite = {
  p_event_id: string; p_session_id: string; p_request_id: string; p_payment_intent_id: string;
  p_amount: number; p_currency: string; p_livemode: boolean; p_customer_email: string | null;
};
type RefundWrite = { p_event_id: string; p_payment_intent_id: string };
export type StripeEventEffects = {
  verifyPaidSession: (id: string) => Promise<Stripe.Checkout.Session>;
  retrievePaymentIntent: (id: string) => Promise<Stripe.PaymentIntent>;
  recordPaidOrder: (input: PaidOrderWrite) => Promise<void>;
  revokeRefundedOrder: (input: RefundWrite) => Promise<void>;
};

const requestIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const paymentIdPattern = /^pi_[A-Za-z0-9]+$/;
function invalidOrder(): never { throw new ApiError(400, 'invalid_order', 'Order verification failed.'); }
function objectId(value: string | { id: string } | null | undefined): string | undefined {
  return typeof value === 'string' ? value : value?.id;
}

/** Call only after verifying Stripe's signature over the original request bytes. */
export async function processVerifiedStripeEvent(event: Stripe.Event, live: boolean, effects: StripeEventEffects): Promise<'processed' | 'ignored'> {
  if (event.livemode !== live) throw new ApiError(400, 'invalid_mode', 'Webhook verification failed.');

  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const candidate = event.data.object as Stripe.Checkout.Session;
    // Other products/sites share this Stripe account. Do not retrieve or persist their orders.
    if (candidate.metadata?.source_system !== SOURCE_SYSTEM) return 'ignored';
    const requestId = candidate.metadata.request_id;
    if (candidate.object !== 'checkout.session' || candidate.mode !== 'payment' || candidate.livemode !== live ||
        !/^cs_(test_|live_)?[A-Za-z0-9]{10,255}$/.test(candidate.id) ||
        !requestId || !requestIdPattern.test(requestId) || candidate.client_reference_id !== requestId) invalidOrder();
    if (candidate.payment_status === 'unpaid' && event.type === 'checkout.session.completed') return 'ignored';
    if (candidate.payment_status !== 'paid') invalidOrder();

    // Re-fetch and verify the canonical session, price, amount and request binding as before.
    const session = await effects.verifyPaidSession(candidate.id);
    const paymentId = objectId(session.payment_intent);
    if (!paymentId || !paymentIdPattern.test(paymentId) || session.id !== candidate.id ||
        session.metadata?.request_id !== requestId) invalidOrder();
    await effects.recordPaidOrder({
      p_event_id: event.id, p_session_id: session.id, p_request_id: requestId,
      p_payment_intent_id: paymentId, p_amount: ORDER_AMOUNT, p_currency: ORDER_CURRENCY,
      p_livemode: session.livemode, p_customer_email: session.customer_details?.email ?? session.customer_email,
    });
    return 'processed';
  }

  if (event.type === 'charge.refunded') {
    const charge = event.data.object as Stripe.Charge;
    const chargeSource = charge.metadata?.source_system;
    // Signed metadata explicitly assigned to another source needs no provider or database work.
    if (chargeSource && chargeSource !== SOURCE_SYSTEM) return 'ignored';
    const paymentId = objectId(charge.payment_intent);
    if (!paymentId || !paymentIdPattern.test(paymentId)) {
      if (chargeSource === SOURCE_SYSTEM) invalidOrder();
      return 'ignored'; // Legacy/unrelated charges need not have a PaymentIntent.
    }

    // Charge metadata can be absent. The canonical PaymentIntent carries our server-set source
    // and request ID, even when the refund arrives before the paid webhook creates an order.
    const payment = await effects.retrievePaymentIntent(paymentId);
    if (payment.metadata?.source_system !== SOURCE_SYSTEM) {
      if (chargeSource === SOURCE_SYSTEM) invalidOrder(); // Contradictory attribution must not be acknowledged.
      return 'ignored';
    }
    const requestId = payment.metadata.request_id;
    if (payment.id !== paymentId || payment.object !== 'payment_intent' || payment.livemode !== live ||
        payment.amount !== ORDER_AMOUNT || payment.currency !== ORDER_CURRENCY || payment.status !== 'succeeded' ||
        !requestId || !requestIdPattern.test(requestId) ||
        charge.object !== 'charge' || !/^ch_[A-Za-z0-9]+$/.test(charge.id) || charge.livemode !== live ||
        charge.amount !== ORDER_AMOUNT || charge.currency !== ORDER_CURRENCY || charge.paid !== true ||
        !Number.isInteger(charge.amount_refunded) || charge.amount_refunded <= 0 || charge.amount_refunded > charge.amount ||
        (chargeSource === SOURCE_SYSTEM && charge.metadata.request_id !== requestId) ||
        (charge.metadata?.request_id && charge.metadata.request_id !== requestId)) invalidOrder();

    await effects.revokeRefundedOrder({ p_event_id: event.id, p_payment_intent_id: paymentId });
    return 'processed';
  }
  return 'ignored';
}
