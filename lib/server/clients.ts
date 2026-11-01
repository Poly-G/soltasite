import 'server-only';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import type { CommerceConfig } from './config';
import { ApiError, unavailable } from './errors';

export function database(config: CommerceConfig, signal?: AbortSignal) {
  return createClient(config.supabaseUrl, config.supabaseSecret, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    global: { fetch: (input, init) => fetch(input, {
      ...init, signal: AbortSignal.any([AbortSignal.timeout(10_000), ...(signal ? [signal] : []), ...(init?.signal ? [init.signal] : [])]), redirect: 'error', cache: 'no-store',
    }) },
  });
}
export function stripeClient(config: CommerceConfig) {
  return new Stripe(config.stripeSecret, { timeout: 10_000, maxNetworkRetries: 1 });
}
export function checkDatabaseError(error: { message?: string; code?: string } | null): void {
  if (!error) return;
  if (error.message === 'idempotency_conflict') {
    throw new ApiError(409, 'idempotency_conflict', 'This request was already used for different information. Please start a new submission.');
  }
  if (error.message === 'rate_limited') throw new ApiError(429, 'rate_limited', 'Please wait before trying again.');
  if (error.message === 'upload_limit') throw new ApiError(409, 'upload_limit', 'The upload limit for this order has been reached.');
  unavailable();
}
