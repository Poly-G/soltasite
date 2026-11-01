import { ApiError } from './errors.ts';

export type CommerceConfig = {
  origin: string; supabaseUrl: string; supabaseSecret: string;
  stripeSecret: string; stripeWebhookSecret: string; stripePriceId: string; live: boolean;
  turnstileSecret: string; turnstileHostnames: string[]; orderAccessSecret: string;
};

export function commerceConfig(env: Readonly<Record<string, string | undefined>> = process.env): CommerceConfig {
  const bad = () => { throw new ApiError(503, 'checkout_unavailable', 'Checkout is not available yet. Please try again later.'); };
  if (env.SOLTASITE_COMMERCE_ENABLED !== 'true') return bad();
  const origin = env.SOLTASITE_APP_ORIGIN ?? '';
  const supabaseUrl = env.SUPABASE_URL ?? '';
  try {
    const app = new URL(origin), db = new URL(supabaseUrl);
    if (app.protocol !== 'https:' || app.origin !== origin ||
        db.protocol !== 'https:' || !/^[a-z0-9]+\.supabase\.co$/.test(db.hostname) ||
        db.origin !== supabaseUrl) return bad();
  } catch { return bad(); }
  const stripeMode = env.SOLTASITE_STRIPE_MODE;
  const live = stripeMode === 'live';
  if (stripeMode !== 'test' && stripeMode !== 'live') return bad();
  const stripeSecret = env.STRIPE_SECRET_KEY ?? '';
  const supabaseSecret = env.SUPABASE_SECRET_KEY ?? '';
  const stripeWebhookSecret = env.STRIPE_WEBHOOK_SECRET ?? '';
  const stripePriceId = env.STRIPE_PRICE_ID ?? '';
  const turnstileSecret = env.TURNSTILE_SECRET_KEY ?? '';
  const orderAccessSecret = env.ORDER_ACCESS_SECRET ?? '';
  const turnstileHostnames = (env.TURNSTILE_ALLOWED_HOSTNAMES ?? '').split(',').map(x => x.trim()).filter(Boolean);
  if (!stripeSecret.startsWith(live ? 'sk_live_' : 'sk_test_') ||
      !/^sb_secret_\S+$/.test(supabaseSecret) || !/^whsec_\S+$/.test(stripeWebhookSecret) ||
      !/^price_[A-Za-z0-9]+$/.test(stripePriceId) || turnstileSecret.length < 10 ||
      orderAccessSecret.length < 32 || !turnstileHostnames.length ||
      turnstileHostnames.some(host => !/^[a-z0-9.-]+$/i.test(host))) return bad();
  return { origin, supabaseUrl, supabaseSecret, stripeSecret, stripeWebhookSecret, stripePriceId,
    live, turnstileSecret, turnstileHostnames, orderAccessSecret };
}
