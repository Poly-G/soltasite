import { commerceConfig } from '@/lib/server/config';
import { checkDatabaseError, database } from '@/lib/server/clients';
import { requirePaidOrder } from '@/lib/server/orders';
import { errorResponse, json, readJson, requireOrigin } from '@/lib/server/http';
import { ASSET_BUCKETS, fingerprint, uploadInput } from '@/lib/server/policies';
import { unavailable } from '@/lib/server/errors';
import { recoverUploadedAsset } from '@/lib/server/storage';

export const runtime = 'nodejs';
export async function POST(request: Request) {
  try {
    const config = commerceConfig();
    requireOrigin(request, config.origin);
    const input = uploadInput.parse(await readJson(request, 8 * 1024));
    await requirePaidOrder(input.orderId);
    const db = database(config);
    const saved = await db.rpc('soltasite_reserve_asset', {
      p_order_id: input.orderId, p_request_id: input.requestId,
      p_fingerprint: fingerprint({ orderId: input.orderId, kind: input.kind, fileName: input.fileName, contentType: input.contentType, sizeBytes: input.sizeBytes }),
      p_kind: input.kind, p_file_name: input.fileName, p_content_type: input.contentType, p_size_bytes: input.sizeBytes,
    });
    checkDatabaseError(saved.error);
    if (!saved.data?.id || !saved.data?.path) unavailable();
    if (await recoverUploadedAsset({ id: saved.data.id, order_id: input.orderId, path: saved.data.path,
      kind: input.kind, content_type: input.contentType, size_bytes: input.sizeBytes }, config)) {
      return json({ assetId: saved.data.id, alreadyUploaded: true });
    }
    const signed = await db.storage.from(ASSET_BUCKETS[input.kind]).createSignedUploadUrl(saved.data.path, { upsert: false });
    checkDatabaseError(signed.error);
    if (!signed.data?.signedUrl) unavailable();
    return json({ assetId: saved.data.id, uploadUrl: signed.data.signedUrl, headers: { 'Content-Type': input.contentType } });
  } catch (error) { return errorResponse(error); }
}
