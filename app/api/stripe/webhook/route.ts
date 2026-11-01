import type Stripe from 'stripe';
import { commerceConfig } from '@/lib/server/config';
import { checkDatabaseError, database, stripeClient } from '@/lib/server/clients';
import { verifyPaidSession } from '@/lib/server/orders';
import { ApiError } from '@/lib/server/errors';
import { boundedBody, errorResponse, json } from '@/lib/server/http';
import { processVerifiedStripeEvent } from '@/lib/server/stripe-events';
import { recordPurchaseAttribution } from '@/lib/server/search-attribution';

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
    await processVerifiedStripeEvent(event, config.live, {
      verifyPaidSession: id => verifyPaidSession(id, config),
      retrievePaymentIntent: id => stripe.paymentIntents.retrieve(id),
      recordPaidOrder: async input => {
        const db = database(config);
        const saved = await db.rpc('soltasite_record_paid_order', input);
        checkDatabaseError(saved.error);
        try { await recordPurchaseAttribution(db, input.p_request_id); } catch {}
      },
      revokeRefundedOrder: async input => {
        const saved = await database(config).rpc('soltasite_revoke_refunded_order', input);
        checkDatabaseError(saved.error);
      },
    });
    return json({ received: true });
  } catch (error) { return errorResponse(error); }
}
