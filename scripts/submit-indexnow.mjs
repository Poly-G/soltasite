const host = 'soltasite.com';
const key = '9f4c2b1a7d6e5f308c1b2a3d4e5f6071';
const sitemapUrl = `https://${host}/sitemap.xml`;
const keyLocation = `https://${host}/${key}.txt`;

const sitemap = await fetch(sitemapUrl, { headers: { 'User-Agent': 'SoltaSite-IndexNow/1.0' } });
if (!sitemap.ok) throw new Error(`Could not fetch sitemap: ${sitemap.status}`);
const xml = await sitemap.text();
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]).filter(url => url.startsWith(`https://${host}/`));
if (!urls.length) throw new Error('No canonical URLs found in sitemap.');

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, keyLocation, urlList: urls }),
});
if (![200, 202].includes(response.status)) throw new Error(`IndexNow returned ${response.status}: ${await response.text()}`);
console.log(`IndexNow accepted ${urls.length} URLs with status ${response.status}.`);
