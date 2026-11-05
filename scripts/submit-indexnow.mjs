import { readFile } from 'node:fs/promises';

if (process.env.VERCEL_ENV !== 'production') {
  console.log('IndexNow skipped outside production.');
  process.exit(0);
}

const host = 'soltasite.com';
const key = '9f4c2b1a7d6e5f308c1b2a3d4e5f6071';
const keyLocation = `https://${host}/${key}.txt`;

const sitemapSource = await readFile(new URL('../app/sitemap.ts', import.meta.url), 'utf8');
const paths = [...sitemapSource.matchAll(/canonicalUrl\('([^']+)'\)/g)].map((match) => match[1]);
const urls = [...new Set(paths.map((path) => new URL(path, `https://${host}`).toString()))];

if (!urls.length) throw new Error('No canonical URLs found in app/sitemap.ts.');

const keyCheck = await fetch(keyLocation, { headers: { 'User-Agent': 'SoltaSite-IndexNow/1.0' } });
if (!keyCheck.ok) throw new Error(`IndexNow key file could not be verified: ${keyCheck.status}`);
const keyBody = (await keyCheck.text()).trim();
if (keyBody !== key) throw new Error('IndexNow key file did not match the configured key.');

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, keyLocation, urlList: urls }),
});

if (![200, 202].includes(response.status)) {
  throw new Error(`IndexNow returned ${response.status}: ${await response.text()}`);
}

console.log(`IndexNow accepted ${urls.length} URLs with status ${response.status}.`);
