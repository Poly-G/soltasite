import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';

export function Logo({ dark = false }: { dark?: boolean }) {
  return <Link className={`logo${dark ? ' d' : ''}`} href="/" aria-label={`${siteConfig.name} home`}><span>{siteConfig.name}</span></Link>;
}

export function SiteHeader({ mode = 'landing' }: { mode?: 'landing' | 'checkout' | 'materials' | 'simple' }) {
  return <header className="nav wrap">
    <div className="l"><Logo /><span className="cap">For actors</span></div>
    {mode === 'landing' ? <Link className="btn sm" href="/start">Start your site · $499 <span className="ar" aria-hidden="true">→</span></Link> : null}
    {mode === 'checkout' ? <span className="cap">Secure checkout by Stripe</span> : null}
    {mode === 'materials' ? <span className="cap max-[600px]:max-w-44 max-[600px]:text-right">Step 2 of 2 · Your materials</span> : null}
  </header>;
}

export function SiteFooter({ compact = false }: { compact?: boolean }) {
  const mail = <a href={`mailto:${siteConfig.contactEmail}`} className="underline">{siteConfig.contactEmail}</a>;
  if (compact) return <footer className="ink"><div className="wrap footbar"><span>soltasite.com · {mail}</span><span><Link href="/privacy">Privacy</Link> · <Link href="/accessibility">Accessibility</Link> · <Link href="/terms">Terms</Link> · © 2026 {siteConfig.name}</span></div></footer>;
  return <footer className="ink"><div className="wrap foot"><Logo dark /><div className="tag">soltasite.com · Actor websites, built for you.</div><a className="mail" href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a><nav className="links" aria-label="Legal"><Link href="/privacy">Privacy</Link><Link href="/accessibility">Accessibility</Link><Link href="/terms">Terms</Link></nav><div className="copy">© 2026 {siteConfig.name}</div></div></footer>;
}

export function StickyStart() {
  return <div className="sticky"><Link className="btn full" href="/start">Start your site · $499 <span className="ar" aria-hidden="true">→</span></Link></div>;
}
