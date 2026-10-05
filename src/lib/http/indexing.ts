/**
 * Pure indexing and host decisions.
 *
 * Nothing here reads the environment, so the proxy, the metadata routes and the unit tests
 * all ask the same questions of the same functions. Owner decision D-007: indexing stays
 * closed until a custom domain is attached and APP_URL points at it.
 */

/** Paths that are never indexed, whatever the deployment permits. */
export const PRIVATE_PATH_PREFIXES = [
  '/app',
  '/auth',
  '/sign-in',
  '/sign-up',
  '/magic-link',
  '/reset-password',
  '/invitations',
  '/design-system',
  '/api',
] as const;

export function isPrivatePath(pathname: string): boolean {
  return PRIVATE_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function hostOf(url: string | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).host.toLowerCase();
  } catch {
    return null;
  }
}

function isVercelHost(host: string): boolean {
  return host === 'vercel.app' || host.endsWith('.vercel.app');
}

/** True when APP_URL names a real domain rather than a platform-assigned vercel.app host. */
export function isCustomDomainUrl(appUrl: string | undefined): boolean {
  const host = hostOf(appUrl);
  return host !== null && !isVercelHost(host) && host !== 'localhost' && host !== '127.0.0.1';
}

/** The X-Robots-Tag a response should carry, or null when it should carry none. */
export function robotsHeaderFor(input: { indexable: boolean; pathname: string }): string | null {
  if (!input.indexable || isPrivatePath(input.pathname)) return 'noindex, nofollow';
  return null;
}

export type CanonicalHostInput = {
  /** The Host the request arrived on. */
  requestHost: string | null;
  /** The configured canonical origin. */
  appUrl: string | undefined;
  /** Vercel's VERCEL_ENV for this deployment. Only `production` is ever redirected. */
  vercelEnv: string | undefined;
  /** Vercel's VERCEL_PROJECT_PRODUCTION_URL, a bare host. */
  productionAlias: string | undefined;
  pathname: string;
  search: string;
};

/**
 * Where a request on a non-canonical production host should be sent, or null to serve it.
 *
 * Redirects only a production deployment, only once APP_URL is a custom domain, and only
 * when the request arrived on a vercel.app host or the project's production alias. A
 * preview deployment is never redirected: its own host is the only way to reach it.
 */
export function canonicalHostRedirect(input: CanonicalHostInput): string | null {
  if (input.vercelEnv !== 'production') return null;
  if (!isCustomDomainUrl(input.appUrl)) return null;

  const requestHost = input.requestHost?.toLowerCase().trim();
  const appHost = hostOf(input.appUrl);
  if (!requestHost || !appHost || requestHost === appHost) return null;

  const alias = input.productionAlias
    ?.replace(/^https?:\/\//, '')
    .replace(/\/+$/, '')
    .toLowerCase();
  if (!isVercelHost(requestHost) && requestHost !== alias) return null;

  const origin = (input.appUrl as string).replace(/\/+$/, '');
  return `${new URL(origin).origin}${input.pathname}${input.search}`;
}
