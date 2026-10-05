import 'server-only';

import { getServerEnv } from '@/lib/config/server';
import { isCustomDomainUrl } from '@/lib/http/indexing';

const FALLBACK = 'http://127.0.0.1:3000';

/**
 * The absolute origin public metadata is written against.
 *
 * Sitemaps and canonical URLs have to be absolute, and getting the host wrong points
 * search engines at the wrong deployment — a preview claiming production's canonicals is
 * how a preview ends up indexed. `APP_URL` is the deliberate answer; Vercel's own host is
 * the fallback for a preview that has not set one.
 *
 * Never throws. A misconfigured environment should degrade a sitemap, not return 500 for
 * a crawler on a page that is otherwise fine.
 */
export function getPublicBaseUrl(): string {
  try {
    const env = getServerEnv();
    if (env.APP_URL) return env.APP_URL.replace(/\/+$/, '');
  } catch {
    // Fall through to the host the platform reports.
  }

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercelHost) return `https://${vercelHost.replace(/^https?:\/\//, '').replace(/\/+$/, '')}`;

  return FALLBACK;
}

/** Whether this deployment is the one that should be indexed. */
export function isIndexable(): boolean {
  try {
    const env = getServerEnv();
    // Only the real production service on its own domain. A preview, a staging environment
    // or a foundation build must never compete with production in an index, and per D-007
    // the vercel.app host is never indexed: APP_URL has to name the attached custom domain.
    return (
      env.APP_ENV === 'production' &&
      env.APPLICATION_MODE === 'service' &&
      isCustomDomainUrl(env.APP_URL)
    );
  } catch {
    return false;
  }
}
