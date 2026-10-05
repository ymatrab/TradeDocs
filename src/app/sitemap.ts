import type { MetadataRoute } from 'next';
import { getPublicBaseUrl } from '@/lib/http/base-url';
import { SITEMAP_PAGES } from '@/lib/seo/site';

// Reads the deployment environment, so it must be resolved per request rather than
// frozen into the build output.
export const dynamic = 'force-dynamic';

/**
 * Only public, indexable routes.
 *
 * Everything under /app is tenant data and everything under /auth is a credential flow;
 * neither belongs in a sitemap, and listing them would advertise the shape of the private
 * surface for nothing. The list is built from the same data the pages render, so a rule
 * added to the Incoterms reference cannot be left out, and each entry carries the date its
 * content last changed rather than the time of the request.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getPublicBaseUrl();
  return SITEMAP_PAGES.map((page) => ({
    url: `${base}${page.path}`,
    lastModified: page.lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
