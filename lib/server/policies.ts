import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import { MATERIALS_RADIO_OPTIONS, MATERIALS_TEXT_LIMITS, materialsForSubmission, type MaterialsAnswers } from '../materials-fields.ts';

export const ORDER_AMOUNT = 49900;
export const ORDER_CURRENCY = 'usd';
export const SOURCE_SYSTEM = 'soltasite';
export const TERMS_VERSION = 'soltasite-launch-v1';
export const ASSET_BUCKETS = { headshot: 'soltasite-headshots', resume: 'soltasite-files', font: 'soltasite-files' } as const;
export const ACCESS_COOKIE = 'soltasite_order';
export const ACCESS_SECONDS = 24 * 60 * 60;
const clean = (max: number) => z.string().trim().max(max).refine(value => !value.includes('\0'));
const uuid = z.uuid();
export const checkoutInput = z.object({
  requestId: uuid, name: clean(120).min(1), email: z.email().max(254).transform(value => value.trim().toLowerCase()),
  termsAccepted: z.literal(true), turnstileToken: clean(4096).min(1), company: z.literal(''),
}).strict();
export const UPLOAD_RULES = {
  headshot: { maxBytes: 25 * 1024 * 1024, mime: ['image/jpeg', 'image/png'], extensions: ['jpg', 'jpeg', 'png'] },
  resume: { maxBytes: 10 * 1024 * 1024, mime: ['application/pdf'], extensions: ['pdf'] },
  font: { maxBytes: 10 * 1024 * 1024, mime: ['font/otf', 'font/ttf', 'font/woff', 'font/woff2', 'application/font-woff', 'application/octet-stream'], extensions: ['otf', 'ttf', 'woff', 'woff2'] },
} as const;
export const uploadInput = z.object({
  orderId: uuid, requestId: uuid, kind: z.enum(['headshot', 'resume', 'font']),
  fileName: clean(180).min(1).refine(value => !/[\u0000-\u001f\u007f\\/]/.test(value)),
  contentType: clean(100).min(1), sizeBytes: z.number().int().positive().max(25 * 1024 * 1024),
}).strict().superRefine((input, ctx) => {
  const rule = UPLOAD_RULES[input.kind];
  const extension = input.fileName.split('.').at(-1)?.toLowerCase() ?? '';
  if (input.sizeBytes > rule.maxBytes || !(rule.mime as readonly string[]).includes(input.contentType) ||
      !(rule.extensions as readonly string[]).includes(extension)) ctx.addIssue({ code: 'custom', path: ['fileName'], message: 'Unsupported file.' });
});
const shape: Record<string, z.ZodType> = { parent: z.boolean() };
for (const [key, max] of Object.entries(MATERIALS_TEXT_LIMITS)) shape[key] = clean(max);
for (const [key, options] of Object.entries(MATERIALS_RADIO_OPTIONS)) {
  shape[key] = z.string().refine(value => value === '' || (options as readonly string[]).includes(value));
}
shape.name = clean(120).min(1);
const urlFields = ['reel','imdb','actors_access','casting_networks','instagram','font_link','like1_url','like2_url','like3_url'];
for (const field of urlFields) shape[field] = clean(2048).refine(value => {
  if (!value) return true;
  try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password; }
  catch { return false; }
});
shape.rep_email = clean(254).refine(value => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
const answersInput = z.object(shape).strict().transform(value => materialsForSubmission(value as MaterialsAnswers));
export const materialsInput = z.object({
  orderId: uuid, requestId: uuid, answers: answersInput,
  assets: z.object({ headshots: z.array(uuid).max(12), resume: uuid.nullable(), font_file: uuid.nullable() }).strict(),
  turnstileToken: clean(4096).min(1), company: z.literal(''),
}).strict().superRefine((value, ctx) => {
  const ids = [...value.assets.headshots, value.assets.resume, value.assets.font_file].filter(Boolean);
  if (new Set(ids).size !== ids.length) ctx.addIssue({ code: 'custom', path: ['assets'], message: 'Duplicate asset.' });
});
export function fingerprint(value: unknown): string {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}
export function signOrderAccess(orderId: string, secret: string, now = Date.now()): string {
  uuid.parse(orderId);
  if (secret.length < 32) throw new Error('Access signing is not configured');
  const payload = Buffer.from(JSON.stringify({ v: 1, orderId, exp: Math.floor(now / 1000) + ACCESS_SECONDS })).toString('base64url');
  return `${payload}.${createHmac('sha256', secret).update(payload).digest('base64url')}`;
}
export function verifyOrderAccess(token: string, secret: string, now = Date.now()): string | null {
  if (secret.length < 32 || token.length > 1024) return null;
  const parts = token.split('.');
  if (parts.length !== 2 || !parts.every(part => /^[A-Za-z0-9_-]+$/.test(part))) return null;
  const expected = createHmac('sha256', secret).update(parts[0]).digest();
  const actual = Buffer.from(parts[1], 'base64url');
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try {
    const value = z.object({ v: z.literal(1), orderId: uuid, exp: z.number().int() }).strict().parse(JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8')));
    const seconds = Math.floor(now / 1000);
    if (value.exp <= seconds || value.exp > seconds + ACCESS_SECONDS) return null;
    return value.orderId;
  } catch { return null; }
}
