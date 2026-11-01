import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';

type SearchEventRow = {
  session_id: string;
  path: string;
  landing_path: string;
  referrer_host: string | null;
  source_group: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
};

export async function recordPurchaseAttribution(db: SupabaseClient, requestId: string): Promise<void> {
  const prior = await db
    .from('soltasite_search_events')
    .select('session_id,path,landing_path,referrer_host,source_group,utm_source,utm_medium,utm_campaign,utm_content,utm_term')
    .eq('request_id', requestId)
    .in('event_name', ['checkout_submit','checkout_session_created'])
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle<SearchEventRow>();

  const source = prior.data;
  const insert = await db.from('soltasite_search_events').insert({
    dedupe_key: `purchase:${requestId}`,
    event_name: 'purchase',
    session_id: source?.session_id ?? requestId,
    request_id: requestId,
    path: '/start',
    landing_path: source?.landing_path ?? '/start',
    referrer_host: source?.referrer_host ?? null,
    source_group: source?.source_group ?? 'unknown',
    utm_source: source?.utm_source ?? null,
    utm_medium: source?.utm_medium ?? null,
    utm_campaign: source?.utm_campaign ?? null,
    utm_content: source?.utm_content ?? null,
    utm_term: source?.utm_term ?? null,
  });
  if (insert.error && insert.error.code !== '23505') throw new Error('search_attribution_write_failed');
}
