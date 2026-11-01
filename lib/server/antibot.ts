import type { CommerceConfig } from './config';
import { ApiError, unavailable } from './errors';

export async function verifyTurnstile(token: string, action: 'checkout' | 'materials', config: CommerceConfig) {
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST', body: new URLSearchParams({ secret: config.turnstileSecret, response: token }),
    signal: AbortSignal.timeout(5_000), redirect: 'error', cache: 'no-store',
  });
  if (!response.ok) unavailable();
  const result = await response.json() as { success?: boolean; hostname?: string; action?: string };
  if (result.success !== true || result.action !== action || !result.hostname || !config.turnstileHostnames.includes(result.hostname)) {
    throw new ApiError(422, 'verification_failed', 'Please complete the verification again.');
  }
}
