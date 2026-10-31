import type { MetadataRoute } from 'next';
import { canonicalUrl, isLiveCheckoutEnabled, isProductionDeployment } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isProductionDeployment) return [];

  const pages: MetadataRoute.Sitemap = [
    {
      url: canonicalUrl('/'),
      // Update only when the homepage's content meaningfully changes.
      lastModified: '2026-10-31',
    },
    {
      url: canonicalUrl('/actor-website-examples'),
      lastModified: '2026-10-31',
    },
    {
      url: canonicalUrl('/actor-website-cost'),
      lastModified: '2026-10-31',
    },
    {
      url: canonicalUrl('/what-to-put-on-an-actor-website'),
      lastModified: '2026-10-31',
    },
    {
      url: canonicalUrl('/do-actors-need-a-website'),
      lastModified: '2026-10-31',
    },
    {
      url: canonicalUrl('/actor-website-vs-instagram-linktree-casting-profile'),
      lastModified: '2026-10-31',
    },
    {
      url: canonicalUrl('/actor-website-design'),
      lastModified: '2026-10-31',
    },
    {
      url: canonicalUrl('/actor-website-builder'),
      lastModified: '2026-10-31',
    },
  ];

  if (isLiveCheckoutEnabled) pages.push({ url: canonicalUrl('/start') });

  return pages;
}
