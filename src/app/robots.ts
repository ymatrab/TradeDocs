import type { MetadataRoute } from 'next';
import { getPublicBaseUrl, isIndexable } from '@/lib/http/base-url';

// Reads the deployment environment, so it must be resolved per request rather than
// frozen into the build output.
export const dynamic = 'force-dynamic';

/**
 * Crawling is closed everywhere except the production service.
 *
 * A preview or staging deployment carrying the same marketing copy would compete with
 * production for the same queries and can expose work that is not ready, so the default
 * stays "disallow everything" and only a real production service opens up — and even then
 * never the authenticated workspace, the auth flows or the API.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable()) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  const base = getPublicBaseUrl();
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/app/', '/auth/', '/api/', '/invitations/', '/design-system'],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
