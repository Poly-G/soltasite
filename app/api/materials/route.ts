import { commerceConfig } from '@/lib/server/config';
import { checkDatabaseError, database } from '@/lib/server/clients';
import { requirePaidOrder } from '@/lib/server/orders';
import { verifyTurnstile } from '@/lib/server/antibot';
import { verifyMaterialAssets } from '@/lib/server/storage';
import { errorResponse, json, readJson, requireOrigin } from '@/lib/server/http';
import { fingerprint, materialsInput } from '@/lib/server/policies';
import { unavailable } from '@/lib/server/errors';

export const runtime = 'nodejs';
export const maxDuration = 60;
export async function POST(request: Request) {
  const deadline = new AbortController();
  const timer = setTimeout(() => deadline.abort(), 45_000);
  try {
    const config = commerceConfig();
    requireOrigin(request, config.origin);
    const input = materialsInput.parse(await readJson(request, 96 * 1024));
    await requirePaidOrder(input.orderId);
    await verifyTurnstile(input.turnstileToken, 'materials', config);
    await verifyMaterialAssets(input.orderId, input.assets, config, deadline.signal);
    deadline.signal.throwIfAborted();
    const saved = await database(config, deadline.signal).rpc('soltasite_submit_materials', {
      p_order_id: input.orderId, p_request_id: input.requestId,
      p_fingerprint: fingerprint({ orderId: input.orderId, answers: input.answers, assets: input.assets }),
      p_answers: input.answers, p_assets: input.assets,
    });
    checkDatabaseError(saved.error);
    if (!saved.data?.submission_id) unavailable();
    return json({ ok: true, status: 'received', submissionId: saved.data.submission_id }, 202);
  } catch (error) { return errorResponse(error); }
  finally { clearTimeout(timer); deadline.abort(); }
}
