'use client';

import Link from 'next/link';
import { useRef, useState, type FormEvent } from 'react';
import { Turnstile } from '@/components/turnstile';
import { trackSearchEvent } from '@/components/search-attribution';

export function CheckoutForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [challenge, setChallenge] = useState(0);
  const attempt = useRef<{ key: string; fingerprint: string } | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError('');
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();
    const fingerprint = JSON.stringify({ name, email });
    if (!attempt.current || attempt.current.fingerprint !== fingerprint) attempt.current = { key: crypto.randomUUID(), fingerprint };
    if (!siteKey || !token) { setError('Checkout is not available yet. Please email us and we’ll help you get started.'); return; }
    trackSearchEvent('checkout_submit', attempt.current.key);
    setBusy(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(20000),
        body: JSON.stringify({ requestId: attempt.current.key, name, email, termsAccepted: form.get('terms') === 'on', turnstileToken: token, company: String(form.get('company') ?? '') }),
      });
      const result: { url?: string; error?: { message?: string } | string } = await response.json();
      if (!response.ok || !result.url) throw new Error(typeof result.error === 'object' && result.error.message ? result.error.message : 'Checkout is temporarily unavailable. Please try again or email us.');
      const destination = new URL(result.url);
      if (destination.protocol !== 'https:' || destination.hostname !== 'checkout.stripe.com') throw new Error('The checkout link could not be verified.');
      trackSearchEvent('checkout_session_created', attempt.current.key);
      window.location.assign(destination.href);
    } catch (failure) {
      setError(failure instanceof Error && failure.name !== 'TimeoutError' ? failure.message : 'The connection timed out. Your details are still here. Please try again.');
      setToken(''); setChallenge((value) => value + 1); setBusy(false);
    }
  }

  return <form className="card paycard b" onSubmit={submit} aria-busy={busy}>
    <h3>Pay</h3>
    <div className="f"><label className="l" htmlFor="p-name">Your name, as it should appear on the site</label><input className="fld" id="p-name" name="name" placeholder="Maya Ortiz" required maxLength={120} autoComplete="name" /></div>
    <div className="f"><label className="l" htmlFor="p-email">Email</label><input className="fld" id="p-email" name="email" type="email" placeholder="you@example.com" required maxLength={254} autoComplete="email" /></div>
    <div className="rounded-[10px] bg-ink px-5 py-5 text-white"><p className="font-semibold">Secure payment with Stripe</p><p className="mt-2 text-sm leading-relaxed text-white/80">You’ll enter your payment details on Stripe’s secure checkout page.</p></div>
    <label className="flex items-start gap-3 text-sm leading-relaxed"><input className="mt-1 size-4 shrink-0 accent-human-blue" name="terms" type="checkbox" required /><span>I agree to the <Link href="/terms" className="underline">terms</Link> and have read the <Link href="/privacy" className="underline">privacy notice</Link>.</span></label>
    <div className="honey" aria-hidden="true"><label htmlFor="checkout-company">Company</label><input id="checkout-company" name="company" tabIndex={-1} autoComplete="off" /></div>
    <Turnstile key={challenge} siteKey={siteKey} onToken={setToken} action="checkout" />
    {!siteKey ? <p className="form-notice" role="status">Online checkout is being set up. You can email us with any questions.</p> : null}
    {error ? <p className="form-error" role="alert">{error}</p> : null}
    <button className="btn full !px-7 !py-[19px] !text-lg" type="submit" disabled={busy} aria-describedby="checkout-help">{busy ? 'Opening secure checkout…' : 'Continue to payment · $499'} <span className="ar" aria-hidden="true">→</span></button>
    <div className="cap" id="checkout-help">Secure payment by Stripe. Your payment details stay with Stripe.</div>
    <div className="cap border-t border-ink/10 pt-4">If it’s still not right after two rounds of changes, we refund you.</div>
    <div className="cap">Questions first? Email <a href="mailto:contact@soltaworks.com" className="underline">contact@soltaworks.com</a>.</div>
  </form>;
}
