import 'server-only';

import { safeNextPath } from '@/lib/security/redirect';
import { publicSiteKey } from '@/lib/security/turnstile';

export type AuthSearchParams = Promise<Record<string, string | string[] | undefined>>;

/** The Turnstile site key when the challenge is active; null otherwise or on a config fault. */
export function challengeSiteKey(): string | null {
  return publicSiteKey();
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** The safe-listed destination after sign-in, or undefined for the default (/app). */
export async function nextFrom(searchParams: AuthSearchParams): Promise<string | undefined> {
  const next = safeNextPath(first((await searchParams).next));
  return next === '/app' ? undefined : next;
}

export async function paramFrom(
  searchParams: AuthSearchParams,
  name: string,
): Promise<string | undefined> {
  return first((await searchParams)[name]);
}

/** Carries `next` onto a link between auth screens. */
export function withNext(path: string, next: string | undefined): string {
  return next ? `${path}?next=${encodeURIComponent(next)}` : path;
}
