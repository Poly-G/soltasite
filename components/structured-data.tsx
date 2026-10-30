import { faqs } from '@/lib/faqs';
import { siteConfig } from '@/lib/site-config';

const organizationId = `${siteConfig.origin}/#organization`;

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{
    __html: JSON.stringify(data).replace(/</g, '\\u003c'),
  }} />;
}

export function OrganizationJsonLd() {
  return <JsonLd data={{
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationId,
    name: siteConfig.name,
    url: `${siteConfig.origin}/`,
    email: siteConfig.contactEmail,
    description: 'Actor websites, built for you. Headshot, reel, resume, credits and a way to reach you, on your own name. $499, once.',
    areaServed: 'US',
  }} />;
}

export function HomeJsonLd() {
  // A sandbox checkout is not a publicly available offer. Publish the Offer
  // only when live commerce has explicitly been enabled in Production.
  const liveOffer = process.env.VERCEL_ENV === 'production'
    && process.env.SOLTASITE_COMMERCE_ENABLED === 'true'
    && process.env.SOLTASITE_STRIPE_MODE === 'live';

  return <JsonLd data={{
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${siteConfig.origin}/#service`,
        name: 'Actor website, built for you',
        serviceType: 'Website design for actors',
        provider: { '@id': organizationId },
        areaServed: 'US',
        url: `${siteConfig.origin}/`,
        description: 'A one-page actor website on your own domain: headshots, reel, downloadable resume, credits and training, and your rep or a form for agents. Live in 5 business days. Two rounds of changes. Two updates a year included.',
        ...(liveOffer ? {
          offers: {
            '@type': 'Offer',
            price: String(siteConfig.priceDollars),
            priceCurrency: 'USD',
            url: `${siteConfig.origin}/start`,
            availability: 'https://schema.org/InStock',
          },
        } : {}),
      },
      {
        '@type': 'FAQPage',
        '@id': `${siteConfig.origin}/#faq`,
        mainEntity: faqs.map(([name, text]) => ({
          '@type': 'Question',
          name,
          acceptedAnswer: { '@type': 'Answer', text },
        })),
      },
    ],
  }} />;
}
