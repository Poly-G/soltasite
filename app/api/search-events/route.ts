import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { ApiError } from '@/lib/server/errors';
import { errorResponse, json, readJson, requireOrigin } from '@/lib/server/http';

export const runtime = 'nodejs';

const source = z.enum(['direct','google','bing','other_search','chatgpt','perplexity','copilot','claude','gemini','social','paid','referral','unknown']);
const optional = (max: number) => z.string().trim().max(max).nullable();
const inputSchema = z.object({
  dedupeKey: z.string().min(8).max(200),
  eventName: z.enum(['page_view','start_click','checkout_submit','checkout_session_created']),
  sessionId: z.uuid(),
  requestId: z.uuid().nullable(),
  path: z.string().min(1).max(500).startsWith('/'),
  landingPath: z.string().min(1).max(500).startsWith('/'),
  referrerHost: optional(255),
  sourceGroup: source,
  utmSource: optional(120),
  utmMedium: optional(120),
  utmCampaign: optional(180),
  utmContent: optional(180),
  utmTerm: optional(180),
}).strict();

export async function POST(request: Request) {
  try {
    const origin = process.env.SOLTASITE_APP_ORIGIN ?? '';
    if (!origin) throw new ApiError(503, 'analytics_unavailable', 'Analytics is unavailable.');
    requireOrigin(request, origin);
    const input = inputSchema.parse(await readJson(request, 8 * 1024));
    const supabaseUrl = process.env.SUPABASE_URL ?? '';
    const supabaseSecret = process.env.SUPABASE_SECRET_KEY ?? '';
    if (!/^https:\/\/[a-z0-9]+\.supabase\.co$/.test(supabaseUrl) || !/^sb_secret_\S+$/.test(supabaseSecret)) {
      throw new ApiError(503, 'analytics_unavailable', 'Analytics is unavailable.');
    }
    const db = createClient(supabaseUrl, supabaseSecret, {
      auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    });
    const saved = await db.from('soltasite_search_events').insert({
      dedupe_key: input.dedupeKey,
      event_name: input.eventName,
      session_id: input.sessionId,
      request_id: input.requestId,
      path: input.path,
      landing_path: input.landingPath,
      referrer_host: input.referrerHost,
      source_group: input.sourceGroup,
      utm_source: input.utmSource,
      utm_medium: input.utmMedium,
      utm_campaign: input.utmCampaign,
      utm_content: input.utmContent,
      utm_term: input.utmTerm,
    });
    if (saved.error && saved.error.code !== '23505') throw new ApiError(503, 'analytics_unavailable', 'Analytics is unavailable.');
    return json({ ok: true }, 202);
  } catch (error) {
    return errorResponse(error);
  }
}
