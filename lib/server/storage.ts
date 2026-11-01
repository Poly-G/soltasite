import 'server-only';
import type { CommerceConfig } from './config';
import { checkDatabaseError, database } from './clients';
import { ApiError, unavailable } from './errors';
import { ASSET_BUCKETS, UPLOAD_RULES } from './policies';

export type MaterialAsset = { id: string; order_id: string; kind: 'headshot' | 'resume' | 'font'; path: string; content_type: string; size_bytes: number };
function hasSignature(bytes: Uint8Array, asset: MaterialAsset): boolean {
  const prefix = Buffer.from(bytes);
  if (asset.content_type === 'image/jpeg') return prefix.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));
  if (asset.content_type === 'image/png') return prefix.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (asset.content_type === 'application/pdf') return prefix.subarray(0, 5).toString('ascii') === '%PDF-';
  if (asset.kind === 'font') return ['OTTO', 'wOFF', 'wOF2', 'true'].includes(prefix.subarray(0, 4).toString('ascii')) || prefix.subarray(0, 4).equals(Buffer.from([0, 1, 0, 0]));
  return false;
}
async function storedFile(asset: MaterialAsset, config: CommerceConfig, signal?: AbortSignal) {
  const listing = await database(config, signal).storage.from(ASSET_BUCKETS[asset.kind]).list(asset.order_id, { search: asset.path.split('/')[1], limit: 100 });
  checkDatabaseError(listing.error);
  return listing.data?.find(candidate => candidate.name === asset.path.split('/')[1]);
}
async function verifyStoredAsset(asset: MaterialAsset, config: CommerceConfig, signal?: AbortSignal) {
  signal?.throwIfAborted();
  const db = database(config, signal);
  if (!asset.path.startsWith(`${asset.order_id}/`) || asset.path.split('/').length !== 2) unavailable();
  const file = await storedFile(asset, config, signal);
  const size = Number(file?.metadata?.size);
  const mime = String(file?.metadata?.mimetype ?? '').split(';')[0].trim().toLowerCase();
  if (!file || size !== Number(asset.size_bytes) || size > UPLOAD_RULES[asset.kind].maxBytes || mime !== asset.content_type) {
    if (file) {
      const removed = await db.storage.from(ASSET_BUCKETS[asset.kind]).remove([asset.path]);
      checkDatabaseError(removed.error);
    }
    throw new ApiError(422, 'upload_incomplete', 'One of the files has not finished uploading or has an unsupported format. Please upload it again.');
  }
  const signed = await db.storage.from(ASSET_BUCKETS[asset.kind]).createSignedUrl(asset.path, 30);
  checkDatabaseError(signed.error);
  if (!signed.data?.signedUrl) unavailable();
  const response = await fetch(signed.data.signedUrl, {
    headers: { Range: 'bytes=0-63' }, signal: AbortSignal.any([AbortSignal.timeout(5_000), ...(signal ? [signal] : [])]), redirect: 'error', cache: 'no-store',
  });
  if (!response.ok || !response.body) unavailable();
  const reader = response.body.getReader();
  let prefix = new Uint8Array();
  try {
    while (prefix.byteLength < 64) {
      const chunk = await reader.read();
      if (chunk.done) break;
      const needed = chunk.value.subarray(0, 64 - prefix.byteLength);
      const combined = new Uint8Array(prefix.byteLength + needed.byteLength);
      combined.set(prefix); combined.set(needed, prefix.byteLength); prefix = combined;
    }
  } finally { await reader.cancel().catch(() => {}); reader.releaseLock(); }
  if (!hasSignature(prefix, asset)) {
    const removed = await db.storage.from(ASSET_BUCKETS[asset.kind]).remove([asset.path]);
    checkDatabaseError(removed.error);
    throw new ApiError(422, 'file_format_mismatch', 'A file does not match its selected format. Please choose the original file and try again.');
  }
  const verified = await db.from('soltasite_assets').update({ verified_at: new Date().toISOString() }).eq('id', asset.id).eq('order_id', asset.order_id);
  checkDatabaseError(verified.error);
}
export async function recoverUploadedAsset(asset: MaterialAsset, config: CommerceConfig): Promise<boolean> {
  if (!await storedFile(asset, config)) return false;
  await verifyStoredAsset(asset, config);
  return true;
}
export async function verifyMaterialAssets(orderId: string, assets: { headshots: string[]; resume: string | null; font_file: string | null }, config: CommerceConfig, signal?: AbortSignal) {
  const ids = [...assets.headshots, assets.resume, assets.font_file].filter((id): id is string => id !== null);
  if (!ids.length) return;
  const { data, error } = await database(config, signal).from('soltasite_assets')
    .select('id,order_id,kind,path,content_type,size_bytes').eq('order_id', orderId).in('id', ids);
  checkDatabaseError(error);
  if (!data || data.length !== ids.length) throw new ApiError(403, 'invalid_asset', 'One of the files is not available for this order.');
  const verified = async (asset: MaterialAsset) => {
    const expected = assets.headshots.includes(asset.id) ? 'headshot' : asset.id === assets.resume ? 'resume' : 'font';
    if (asset.kind !== expected) throw new ApiError(422, 'invalid_asset_kind', 'A file was selected in the wrong section.');
    await verifyStoredAsset(asset, config, signal);
  };
  // Bounded concurrency keeps large headshot sets within the request budget.
  for (let offset = 0; offset < data.length; offset += 3) {
    signal?.throwIfAborted();
    await Promise.all((data as MaterialAsset[]).slice(offset, offset + 3).map(verified));
  }
}
