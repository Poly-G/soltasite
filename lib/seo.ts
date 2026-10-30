import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

export const isProductionDeployment = process.env.VERCEL_ENV === 'production';
export const isLiveCheckoutEnabled = isProductionDeployment
  && process.env.SOLTASITE_COMMERCE_ENABLED === 'true'
  && process.env.SOLTASITE_STRIPE_MODE === 'live';

export function canonicalUrl(path: string): string {
  return new URL(path, siteConfig.origin).toString();
}

const homeTitle = 'Actor Websites, Built for You · $499 Once | Solta Site';
const homeDescription = 'Your headshot, reel and resume on your own name. Built for you by a person, live in 5 business days. $499, once.';

// A page's openGraph object replaces its parent's object. Keep the root
// file-convention image when giving each page its own title and canonical URL.
const sharedOpenGraph = {
  type: 'website' as const,
  locale: 'en_US',
  siteName: siteConfig.name,
  images: [{
    url: canonicalUrl('/opengraph-image'),
    width: 1200,
    height: 630,
    alt: 'Solta Site — Actor websites, built for you. $499, once.',
    type: 'image/png',
  }],
};

type PageMetadataOptions = {
  path: string;
  title: string;
  description: string;
  index?: boolean;
  follow?: boolean;
};

export function createPageMetadata({
  path,
  title,
  description,
  index = false,
  follow = true,
}: PageMetadataOptions): Metadata {
  const url = canonicalUrl(path);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: {
      index: isProductionDeployment && index,
      follow: isProductionDeployment && follow,
    },
    openGraph: { ...sharedOpenGraph, title, description, url },
    // Next fills Twitter's image from the resolved Open Graph image.
    twitter: { card: 'summary_large_image', title, description },
  };
}

export const homeMetadata: Metadata = createPageMetadata({
  path: '/',
  title: homeTitle,
  description: homeDescription,
  index: true,
});

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteConfig.origin),
  title: { default: homeTitle, template: `%s | ${siteConfig.name}` },
  description: homeDescription,
  robots: { index: isProductionDeployment, follow: isProductionDeployment },
  openGraph: homeMetadata.openGraph,
  twitter: homeMetadata.twitter,
};
