import type { MetadataRoute } from 'next';
import { canonicalUrl, isProductionDeployment } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isProductionDeployment) return [];

  const pages: MetadataRoute.Sitemap = [
    {
      url: canonicalUrl('/'),
      // Update only when the homepage's content meaningfully changes.
      lastModified: '2026-11-04',
    },
    {
      url: canonicalUrl('/actor-website-examples'),
      lastModified: '2026-11-04',
    },
    {
      url: canonicalUrl('/actor-website-cost'),
      lastModified: '2026-11-04',
    },
    {
      url: canonicalUrl('/what-to-put-on-an-actor-website'),
      lastModified: '2026-11-04',
    },
    {
      url: canonicalUrl('/do-actors-need-a-website'),
      lastModified: '2026-11-04',
    },
    {
      url: canonicalUrl('/actor-website-design'),
      lastModified: '2026-11-04',
    },
    {
      url: canonicalUrl('/actor-website-builder'),
      lastModified: '2026-11-04',
    },
    {
      url: canonicalUrl('/actor-seo'),
      lastModified: '2026-11-04',
    },
    {
      url: canonicalUrl('/actor-website-vs-linktree'),
      lastModified: '2026-11-04',
    },
    {
      url: canonicalUrl('/acting-portfolio-website'),
      lastModified: '2026-11-04',
    },
    {
      url: canonicalUrl('/best-website-builder-for-actors'),
      lastModified: '2026-11-04',
    },
    {
      url: canonicalUrl('/what-casting-directors-need-from-actor-website'),
      lastModified: '2026-11-05',
    },
  ];

  return pages;
}
