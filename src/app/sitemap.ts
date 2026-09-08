import type { MetadataRoute } from 'next';
import { INCOTERMS } from '@/lib/trade/incoterms';
import { getPublicBaseUrl } from '@/lib/http/base-url';

// Reads the deployment environment, so it must be resolved per request rather than
// frozen into the build output.
export const dynamic = 'force-dynamic';

/**
 * Only public, indexable routes.
 *
 * Everything under /app is tenant data and everything under /auth is a credential flow;
 * neither belongs in a sitemap, and listing them would advertise the shape of the private
 * surface for nothing. The list here is built from the same data the pages render, so a
 * rule added to the reference cannot be left out of the sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getPublicBaseUrl();
  const now = new Date();

  const fixed: { path: string; priority: number; frequency: 'weekly' | 'monthly' }[] = [
    { path: '/', priority: 1, frequency: 'weekly' },
    { path: '/tools', priority: 0.8, frequency: 'monthly' },
    { path: '/tools/invoice-generator', priority: 0.8, frequency: 'monthly' },
    { path: '/tools/cbm-calculator', priority: 0.7, frequency: 'monthly' },
    { path: '/tools/chargeable-weight', priority: 0.7, frequency: 'monthly' },
    { path: '/tools/incoterms', priority: 0.7, frequency: 'monthly' },
  ];

  return [
    ...fixed.map((entry) => ({
      url: `${base}${entry.path}`,
      lastModified: now,
      changeFrequency: entry.frequency,
      priority: entry.priority,
    })),
    ...INCOTERMS.map((term) => ({
      url: `${base}/tools/incoterms/${term.code.toLowerCase()}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
