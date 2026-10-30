import type { Metadata } from 'next';
import { bricolage, instrument } from '@/lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://soltasite.com'),
  title: { default: 'Solta Site · Actor websites, built for you · $499', template: '%s · Solta Site' },
  description: 'Your headshot, reel and resume on your own name. Built for you by a person. $499, once. Live in 5 business days.',
  openGraph: { type: 'website', locale: 'en_US', siteName: 'Solta Site', title: 'Actor websites, built for you', description: 'Your headshot, reel and resume on your own name. $499, once.' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${bricolage.variable} ${instrument.variable}`}><body>{children}</body></html>;
}
