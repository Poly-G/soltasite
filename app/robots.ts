import type { MetadataRoute } from 'next';
import { canonicalUrl, isProductionDeployment } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    // Public noindex pages must remain crawlable for their directives to be read.
    // One wildcard rule also keeps the API restriction consistent for AI crawlers.
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    ...(isProductionDeployment ? { sitemap: canonicalUrl('/sitemap.xml') } : {}),
  };
}
