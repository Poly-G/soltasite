import { commerceConfig } from '@/lib/server/config';
import { checkDatabaseError, database, stripeClient } from '@/lib/server/clients';
import { verifyTurnstile } from '@/lib/server/antibot';
import { checkoutAttribution } from '@/lib/server/checkout-attribution';
import { ApiError, unavailable } from '@/lib/server/errors';
import { errorResponse, json, readJson, requireOrigin } from '@/lib/server/http';
import { checkoutInput, fingerprint, ORDER_AMOUNT, ORDER_CURRENCY, SOURCE_SYSTEM, TERMS_VERSION } from '@/lib/server/policies';

export const runtime = 'nodejs';
export async function POST(request: Request) {
  try {
    const config = commerceConfig();
    requireOrigin(request, config.origin);
    const input = checkoutInput.parse(await readJson(request, 16 * 1024));
    await verifyTurnstile(input.turnstileToken, 'checkout', config);
    const db = database(config), stripe = stripeClient(config);
    const hash = fingerprint({ name: input.name, email: input.email, terms: TERMS_VERSION });
    const begun = await db.rpc('soltasite_begin_checkout', {
      p_request_id: input.requestId, p_fingerprint: hash, p_name: input.name,
      p_email: input.email, p_terms_version: TERMS_VERSION,
    });
    checkDatabaseError(begun.error);
    const previousSessionId = begun.data?.stripe_session_id as string | null;
    if (previousSessionId) {
      const existing = await stripe.checkout.sessions.retrieve(previousSessionId);
      if (existing.status !== 'open' || !existing.url) throw new ApiError(409, 'checkout_closed', 'This checkout is no longer open. Use its confirmation link if you have already paid.');
      return json({ url: existing.url });
    }
    const attemptCreated = Date.parse(String(begun.data?.created_at ?? ''));
    if (!Number.isFinite(attemptCreated) || Date.now() - attemptCreated >= 23 * 60 * 60 * 1000) {
      throw new ApiError(409, 'checkout_recovery_required', 'We need to check this earlier checkout before opening another one. Please contact us.');
    }
    const price = await stripe.prices.retrieve(config.stripePriceId);
    if (!price.active || price.type !== 'one_time' || price.unit_amount !== ORDER_AMOUNT ||
        price.currency !== ORDER_CURRENCY || price.livemode !== config.live) unavailable();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment', allowed_payment_method_types: ['card'], adaptive_pricing: { enabled: false },
      automatic_tax: { enabled: false }, allow_promotion_codes: false,
      line_items: [{ price: config.stripePriceId, quantity: 1 }],
      customer_email: input.email, client_reference_id: input.requestId,
      ...checkoutAttribution(input.requestId, config.origin),
      success_url: `${config.origin}/api/orders/access?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.origin}/start?checkout=cancelled`,
    }, { idempotencyKey: `${SOURCE_SYSTEM}:checkout:${input.requestId}` });
    if (!session.url || new URL(session.url).origin !== 'https://checkout.stripe.com') unavailable();
    const attached = await db.rpc('soltasite_attach_checkout_session', { p_request_id: input.requestId, p_session_id: session.id });
    checkDatabaseError(attached.error);
    return json({ url: session.url });
  } catch (error) { return errorResponse(error); }
}
