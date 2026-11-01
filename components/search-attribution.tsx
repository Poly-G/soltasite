'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

type Attribution = {
  sessionId: string;
  landingPath: string;
  referrerHost: string | null;
  sourceGroup: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
};

const STORAGE_KEY = 'soltasite_search_attribution_v1';
const allowedEvents = new Set(['page_view','start_click','checkout_submit','checkout_session_created']);

function clean(value: string | null, max: number): string | null {
  if (!value) return null;
  const trimmed = value.trim().slice(0, max);
  return trimmed || null;
}

function sourceGroup(referrerHost: string | null, utmSource: string | null, utmMedium: string | null): string {
  const medium = (utmMedium ?? '').toLowerCase();
  const source = (utmSource ?? '').toLowerCase();
  if (/cpc|ppc|paid|display|retarget/.test(medium)) return 'paid';
  if (source.includes('chatgpt') || source.includes('openai')) return 'chatgpt';
  if (source.includes('perplexity')) return 'perplexity';
  if (source.includes('copilot')) return 'copilot';
  if (source.includes('claude') || source.includes('anthropic')) return 'claude';
  if (source.includes('gemini')) return 'gemini';
  if (source.includes('google')) return 'google';
  if (source.includes('bing')) return 'bing';

  const host = (referrerHost ?? '').toLowerCase();
  if (!host) return utmSource ? 'unknown' : 'direct';
  if (host === 'google.com' || host.endsWith('.google.com')) return 'google';
  if (host === 'bing.com' || host.endsWith('.bing.com')) return 'bing';
  if (host === 'chatgpt.com' || host === 'chat.openai.com' || host.endsWith('.openai.com')) return 'chatgpt';
  if (host === 'perplexity.ai' || host.endsWith('.perplexity.ai')) return 'perplexity';
  if (host === 'copilot.microsoft.com' || host.endsWith('.copilot.microsoft.com')) return 'copilot';
  if (host === 'claude.ai' || host.endsWith('.claude.ai') || host.endsWith('.anthropic.com')) return 'claude';
  if (host === 'gemini.google.com') return 'gemini';
  if (/duckduckgo|yahoo|ecosia|brave\.com/.test(host)) return 'other_search';
  if (/instagram|facebook|threads|tiktok|linkedin|x\.com|twitter|youtube/.test(host)) return 'social';
  return 'referral';
}

function getAttribution(): Attribution | null {
  if (typeof window === 'undefined') return null;
  const saved = sessionStorage.getItem(STORAGE_KEY);
  if (saved) {
    try { return JSON.parse(saved) as Attribution; } catch { sessionStorage.removeItem(STORAGE_KEY); }
  }

  const params = new URLSearchParams(window.location.search);
  let referrerHost: string | null = null;
  try { referrerHost = document.referrer ? new URL(document.referrer).hostname.toLowerCase() : null; } catch {}
  const utmSource = clean(params.get('utm_source'), 120);
  const utmMedium = clean(params.get('utm_medium'), 120);
  const value: Attribution = {
    sessionId: crypto.randomUUID(),
    landingPath: window.location.pathname.slice(0, 500) || '/',
    referrerHost: clean(referrerHost, 255),
    sourceGroup: sourceGroup(referrerHost, utmSource, utmMedium),
    utmSource,
    utmMedium,
    utmCampaign: clean(params.get('utm_campaign'), 180),
    utmContent: clean(params.get('utm_content'), 180),
    utmTerm: clean(params.get('utm_term'), 180),
  };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  return value;
}

export function trackSearchEvent(eventName: string, requestId?: string) {
  if (typeof window === 'undefined' || !allowedEvents.has(eventName)) return;
  const attribution = getAttribution();
  if (!attribution) return;
  const path = window.location.pathname.slice(0, 500) || '/';
  const body = {
    dedupeKey: `${eventName}:${attribution.sessionId}:${requestId ?? 'none'}:${crypto.randomUUID()}`,
    eventName,
    sessionId: attribution.sessionId,
    requestId: requestId ?? null,
    path,
    landingPath: attribution.landingPath,
    referrerHost: attribution.referrerHost,
    sourceGroup: attribution.sourceGroup,
    utmSource: attribution.utmSource,
    utmMedium: attribution.utmMedium,
    utmCampaign: attribution.utmCampaign,
    utmContent: attribution.utmContent,
    utmTerm: attribution.utmTerm,
  };
  void fetch('/api/search-events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true,
    credentials: 'same-origin',
  }).catch(() => {});
}

export function SearchAttribution() {
  const pathname = usePathname();

  useEffect(() => {
    getAttribution();
    trackSearchEvent('page_view');
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!(target instanceof HTMLAnchorElement)) return;
      try {
        const url = new URL(target.href, window.location.href);
        if (url.origin === window.location.origin && url.pathname === '/start') trackSearchEvent('start_click');
      } catch {}
    }
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}
