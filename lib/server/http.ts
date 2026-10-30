import { ZodError } from 'zod';
import { ApiError } from './errors.ts';

export const PRIVATE_HEADERS = { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer', 'X-Content-Type-Options': 'nosniff' };
export function json(body: unknown, status = 200) { return Response.json(body, { status, headers: PRIVATE_HEADERS }); }
export function errorResponse(error: unknown) {
  if (error instanceof ApiError) return json({ ok: false, error: { code: error.code, message: error.message } }, error.status);
  if (error instanceof ZodError) {
    const fields: Record<string, string> = {};
    for (const issue of error.issues) fields[issue.path.join('.') || 'form'] = 'Check this field.';
    return json({ ok: false, error: { code: 'validation_failed', message: 'Check the highlighted fields.', fields } }, 422);
  }
  // Provider errors can contain payment or personal data. Never return or log them.
  return json({ ok: false, error: { code: 'service_unavailable', message: 'This step is temporarily unavailable. Please try again shortly.' } }, 503);
}
export function requireOrigin(request: Request, origin: string) {
  if (request.headers.get('origin') !== origin) throw new ApiError(403, 'origin_not_allowed', 'This request is not allowed.');
}
export async function boundedBody(request: Request, limit: number, timeoutMs = 10_000): Promise<Uint8Array> {
  const reader = request.body?.getReader();
  if (!reader) throw new ApiError(400, 'invalid_request', 'A request body is required.');
  const chunks: Uint8Array[] = [];
  let total = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const reading = (async () => {
    try {
      for (;;) {
        const chunk = await reader.read();
        if (chunk.done) break;
        total += chunk.value.byteLength;
        if (total > limit) throw new ApiError(413, 'body_too_large', 'The request is too large.');
        chunks.push(chunk.value);
      }
      const bytes = new Uint8Array(total);
      let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
      return bytes;
    } finally { reader.releaseLock(); }
  })();
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      void reader.cancel().catch(() => {});
      reject(new ApiError(408, 'request_timeout', 'The request took too long. Please try again.'));
    }, timeoutMs);
  });
  try { return await Promise.race([reading, timeout]); }
  catch (error) { void reader.cancel().catch(() => {}); throw error; }
  finally { if (timer) clearTimeout(timer); }
}
export async function readJson(request: Request, limit = 64 * 1024): Promise<unknown> {
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    throw new ApiError(415, 'json_required', 'Send a JSON request.');
  }
  const body = await boundedBody(request, limit);
  try { return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(body)); }
  catch { throw new ApiError(400, 'invalid_json', 'The request could not be read.'); }
}
