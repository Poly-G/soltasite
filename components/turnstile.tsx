'use client';

import Script from 'next/script';
import { useCallback, useEffect, useRef, useState } from 'react';

type TurnstileApi = {
  render: (element: HTMLElement, options: { sitekey: string; action: string; callback: (token: string) => void; 'expired-callback': () => void; 'error-callback': () => void }) => string;
  remove: (widgetId: string) => void;
};
declare global { interface Window { turnstile?: TurnstileApi } }

export function Turnstile({ siteKey, onToken, action }: { siteKey?: string; onToken: (token: string) => void; action: string }) {
  const host = useRef<HTMLDivElement>(null);
  const callback = useRef(onToken);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => { callback.current = onToken; }, [onToken]);
  const loaded = useCallback(() => { setReady(true); }, []);
  useEffect(() => {
    if (!siteKey || !host.current || !window.turnstile || !ready) return;
    const api = window.turnstile;
    const id = api.render(host.current, {
      sitekey: siteKey, action,
      callback: (token) => { setFailed(false); callback.current(token); },
      'expired-callback': () => { callback.current(''); },
      'error-callback': () => { callback.current(''); setFailed(true); },
    });
    return () => { api.remove(id); callback.current(''); };
  }, [siteKey, action, ready]);
  if (!siteKey) return null;
  return <><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={loaded} onError={() => setFailed(true)} /><div ref={host} aria-label="Security verification" />{failed ? <p className="form-error" role="status">Verification could not load. Please reload and try again.</p> : null}</>;
}
