import 'server-only';
import { cookies } from 'next/headers';
import type Stripe from 'stripe';
import { commerceConfig, type CommerceConfig } from './config';
import { database, stripeClient } from './clients';
import { ApiError, unavailable } from './errors';
import { ACCESS_COOKIE, ACCESS_SECONDS, ORDER_AMOUNT, ORDER_CURRENCY, SOURCE_SYSTEM, signOrderAccess, verifyOrderAccess } from './policies';

export type PaidOrder = { id: string; name: string; email: string; amountCents: number; currency: string; materialsSubmittedAt: string | null };
export async function verifyPaidSession(sessionId: string, config: CommerceConfig): Promise<Stripe.Checkout.Session> {
  if (!/^cs_(test_|live_)?[A-Za-z0-9]{10,255}$/.test(sessionId)) throw new ApiError(400, 'invalid_session', 'This checkout link is not valid.');
  const stripe = stripeClient(config);
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.mode !== 'payment' || session.status !== 'complete' || session.payment_status !== 'paid') {
    throw new ApiError(409, 'payment_pending', 'We are still checking your payment.');
  }
  if (session.livemode !== config.live || session.currency !== ORDER_CURRENCY || session.amount_total !== ORDER_AMOUNT ||
      session.metadata?.source_system !== SOURCE_SYSTEM || !session.metadata.request_id ||
      session.client_reference_id !== session.metadata.request_id) throw new ApiError(403, 'invalid_order', 'This checkout is not for this order.');
  const lines = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 2 });
  if (lines.has_more || lines.data.length !== 1 || lines.data[0].quantity !== 1 ||
      lines.data[0].price?.id !== config.stripePriceId || lines.data[0].amount_total !== ORDER_AMOUNT ||
      lines.data[0].currency !== ORDER_CURRENCY) throw new ApiError(403, 'invalid_order', 'This checkout is not for this order.');
  return session;
}
function present(row: Record<string, unknown>): PaidOrder {
  return { id: String(row.id), name: String(row.name), email: String(row.email), amountCents: Number(row.amount_cents), currency: String(row.currency), materialsSubmittedAt: row.materials_submitted_at as string | null };
}
export async function loadPaidOrder(sessionId: string): Promise<PaidOrder | null> {
  const config = commerceConfig();
  const session = await verifyPaidSession(sessionId, config);
  const { data, error } = await database(config).from('soltasite_orders')
    .select('id,name,email,amount_cents,currency,materials_submitted_at').eq('stripe_session_id', session.id).eq('payment_status', 'paid').eq('livemode', config.live).maybeSingle();
  if (error) unavailable();
  return data ? present(data) : null; // Only the signed webhook can create this row.
}
export function createOrderAccessCookie(orderId: string) {
  const config = commerceConfig();
  return { name: ACCESS_COOKIE, value: signOrderAccess(orderId, config.orderAccessSecret),
    httpOnly: true, secure: true, sameSite: 'lax' as const, path: '/', maxAge: ACCESS_SECONDS };
}
export async function loadAuthorizedPaidOrder(): Promise<PaidOrder | null> {
  const config = commerceConfig();
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  const id = token ? verifyOrderAccess(token, config.orderAccessSecret) : null;
  if (!id) return null;
  const { data, error } = await database(config).from('soltasite_orders')
    .select('id,name,email,amount_cents,currency,materials_submitted_at').eq('id', id).eq('payment_status', 'paid').eq('livemode', config.live).maybeSingle();
  if (error) unavailable();
  return data ? present(data) : null;
}
export async function requirePaidOrder(orderId: string): Promise<PaidOrder> {
  const order = await loadAuthorizedPaidOrder();
  if (!order || order.id !== orderId) throw new ApiError(403, 'order_access_required', 'Open the materials link from your checkout confirmation.');
  return order;
}
