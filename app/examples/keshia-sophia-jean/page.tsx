import type { Metadata } from 'next';
import { caveat, leagueGothic, libreFranklin } from '@/lib/fonts';
import { createPageMetadata } from '@/lib/seo';
import { KeshiaExampleClient } from './keshia-example-client';
import styles from './keshia.module.css';

export const metadata: Metadata = createPageMetadata({
  path: '/examples/keshia-sophia-jean',
  title: 'Keshia Sophia Jean · Actor · Los Angeles and Las Vegas',
  description: 'Keshia Sophia Jean is an actor in Los Angeles and Las Vegas drawn to intimate stories and complicated people. Demo reel, headshots, resume and contact for representation and casting.',
});

export default function KeshiaSophiaJeanExamplePage() {
  return (
    <KeshiaExampleClient
      className={`${styles.page} ${caveat.variable} ${leagueGothic.variable} ${libreFranklin.variable}`}
    />
  );
}