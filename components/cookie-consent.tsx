'use client';

import { useEffect, useState } from 'react';

export const CONSENT_KEY = 'soltasite_consent_v1';
export const ANALYTICS_STORAGE_KEY = 'soltasite_search_attribution_v1';

type Consent = 'accepted' | 'declined' | null;

function readConsent(): Consent {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === 'accepted' || value === 'declined' ? value : null;
}

export function hasAnalyticsConsent(): boolean {
  return readConsent() === 'accepted';
}

export function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConsent(readConsent());
    setReady(true);
  }, []);

  function choose(next: Exclude<Consent, null>) {
    window.localStorage.setItem(CONSENT_KEY, next);
    if (next === 'declined') {
      window.sessionStorage.removeItem(ANALYTICS_STORAGE_KEY);
      window.dispatchEvent(new Event('soltasite:analytics-declined'));
    } else {
      window.dispatchEvent(new Event('soltasite:analytics-accepted'));
    }
    setConsent(next);
  }

  if (!ready || consent) return null;

  return (
    <aside className="cookie-consent" role="dialog" aria-live="polite" aria-label="Cookie and analytics choices">
      <div className="cookie-consent__copy">
        <strong>Cookies & analytics</strong>
        <p>
          We use first-party analytics to understand how people find Solta Site and which pages they use.
          Declining keeps non-essential analytics storage and tracking off.
        </p>
        <a href="/privacy">Privacy details</a>
      </div>
      <div className="cookie-consent__actions">
        <button type="button" className="cookie-consent__decline" onClick={() => choose('declined')}>Decline</button>
        <button type="button" className="cookie-consent__accept" onClick={() => choose('accepted')}>Accept</button>
      </div>
    </aside>
  );
}
