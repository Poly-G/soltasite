import type Stripe from 'stripe';
import { SOURCE_SYSTEM, TERMS_VERSION } from './policies.ts';

// Keep the brand stable while recording the actual configured deployment origin.
// This is constructed on the server; checkout input cannot supply these fields.
export function checkoutAttribution(requestId: string, origin: string) {
  const source = {
    source_system: SOURCE_SYSTEM,
    source_site: 'soltasite.com',
    source_origin: origin,
    request_id: requestId,
  };
  return {
    metadata: { ...source, terms_version: TERMS_VERSION },
    payment_intent_data: {
      description: 'Solta Site — Actor Website',
      metadata: { ...source },
    },
  } satisfies Pick<Stripe.Checkout.SessionCreateParams, 'metadata' | 'payment_intent_data'>;
}
