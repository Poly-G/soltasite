import type { Metadata } from 'next';
import { OrganizationJsonLd } from '@/components/structured-data';
import { bricolage, instrument } from '@/lib/fonts';
import { rootMetadata } from '@/lib/seo';
import './globals.css';

export const metadata: Metadata = rootMetadata;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${bricolage.variable} ${instrument.variable}`}><body><OrganizationJsonLd />{children}</body></html>;
}
