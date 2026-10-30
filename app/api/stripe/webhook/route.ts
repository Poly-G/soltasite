import type Stripe from 'stripe';
import { commerceConfig } from '@/lib/server/config';
import { checkDatabaseError, database, stripeClient } from '@/lib/server/clients';
import { verifyPaidSession } from '@/lib/server/orders';
import { ApiError } from '@/lib/server/errors';
import { boundedBody, errorResponse, json } from '@/lib/server/http';
import { ORDER_AMOUNT, ORDER_CURRENCY } from '@/lib/server/policies';

export const runtime = 'nodejs';
export async function POST(request: Request) {
  try {
    const config = commerceConfig(), stripe = stripeClient(config);
    const signature = request.headers.get('stripe-signature');
    if (!signature) throw new ApiError(400, 'invalid_signature', 'Webhook verification failed.');
    const raw = await boundedBody(request, 256 * 1024);
    let event: Stripe.Event;
    try { event = stripe.webhooks.constructEvent(Buffer.from(raw), signature, config.stripeWebhookSecret); }
    catch { throw new ApiError(400, 'invalid_signature', 'Webhook verification failed.'); }
    if (event.livemode !== config.live) throw new ApiError(400, 'invalid_mode', 'Webhook verification failed.');
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const candidate = event.data.object as Stripe.Checkout.Session;
      if (candidate.payment_status !== 'paid') return json({ received: true });
      const session = await verifyPaidSession(candidate.id, config);
      const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;
      if (!paymentIntentId) throw new ApiError(400, 'invalid_order', 'Order verification failed.');
      const saved = await database(config).rpc('soltasite_record_paid_order', {
        p_event_id: event.id, p_session_id: session.id, p_request_id: session.metadata!.request_id,
        p_payment_intent_id: paymentIntentId, p_amount: ORDER_AMOUNT, p_currency: ORDER_CURRENCY,
        p_livemode: session.livemode, p_customer_email: session.customer_details?.email ?? session.customer_email,
      });
      checkDatabaseError(saved.error);
    } else if (event.type === 'charge.refunded') {
      const charge = event.data.object as Stripe.Charge;
      const paymentId = typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id;
      if (paymentId) {
        const saved = await database(config).rpc('soltasite_revoke_refunded_order', { p_event_id: event.id, p_payment_intent_id: paymentId });
        checkDatabaseError(saved.error);
      }
    }
    return json({ received: true });
  } catch (error) { return errorResponse(error); }
}
