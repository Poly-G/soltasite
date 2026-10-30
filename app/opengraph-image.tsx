import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { siteConfig } from '@/lib/site-config';

export const alt = 'Solta Site — Actor websites, built for you. $499, once.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const headingFont = readFile(join(process.cwd(), 'assets/fonts/BricolageGrotesque-Bold.ttf'));

export default async function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#f5f0e8', color: '#111318', padding: '52px 60px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', fontFamily: 'Bricolage', fontSize: 38, fontWeight: 700, borderBottom: '7px solid #f2c14e', paddingBottom: 3 }}>{siteConfig.name}</div>
        <div style={{ display: 'flex', fontSize: 19, letterSpacing: 3, color: '#4a4f5c' }}>FOR ACTORS</div>
      </div>
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-between', gap: 36 }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: 735 }}>
          <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Bricolage', fontWeight: 700, fontSize: 78, lineHeight: 1.02, letterSpacing: -3 }}>
            <span>Actor websites,</span>
            <span>built for you.</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 27, fontSize: 26, lineHeight: 1.35, color: '#4a4f5c' }}>
            <span>Your headshot, reel and resume.</span>
            <span>On your own name.</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 258, height: 258, flexShrink: 0, borderRadius: 36, background: '#111318', color: '#f5f0e8' }}>
          <div style={{ display: 'flex', borderRadius: 99, background: '#f2c14e', color: '#111318', padding: '7px 17px', fontSize: 18 }}>One-time</div>
          <div style={{ display: 'flex', fontFamily: 'Bricolage', fontWeight: 700, fontSize: 88, lineHeight: 1, marginTop: 17, letterSpacing: -4 }}>${siteConfig.priceDollars}</div>
          <div style={{ display: 'flex', fontSize: 21, marginTop: 15 }}>No monthly fee.</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 21, borderTop: '1px solid #d7d3cb', fontSize: 20, color: '#4a4f5c' }}>
        <span>Headshot · Reel · Resume · Contact</span>
        <span style={{ color: '#111318' }}>soltasite.com</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: 'Bricolage', data: await headingFont, weight: 700, style: 'normal' }],
    },
  );
}
