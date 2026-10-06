import 'server-only';

import { createHash } from 'node:crypto';
import { z } from 'zod';

/**
 * Password rules, one place for every screen that sets a password.
 *
 * Length is the control that matters; composition rules push people towards weaker, more
 * predictable passwords (NIST SP 800-63B). The upper bound is Supabase Auth's: it hashes
 * with bcrypt, which reads at most 72 bytes, and refuses anything longer.
 */
export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_BYTES = 72;

export const PASSWORD_HINT =
  'At least 12 characters. A long phrase is easier to remember and harder to guess.';

export const newPasswordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, 'Use at least 12 characters.')
  .refine(
    (value) => Buffer.byteLength(value, 'utf8') <= PASSWORD_MAX_BYTES,
    'Use 72 characters or fewer.',
  );

/** Signing in checks only that something was typed: the rules are not disclosed there. */
export const currentPasswordSchema = z.string().min(1, 'Enter your password.').max(1024);

export const BREACHED_PASSWORD_MESSAGE =
  'This password has appeared in a known data breach. Choose a different one.';

/**
 * Whether a password appears in the Have I Been Pwned corpus, via its k-anonymity range API.
 *
 * Only the first five hex characters of the SHA-1 digest leave the server; the password and
 * its full digest never do. Responses are padded (Add-Padding) so their size does not hint at
 * the prefix. Returns null when the service cannot be reached in time: the check fails open,
 * because refusing every sign-up during a third-party outage would be worse than skipping a
 * secondary control for its duration. Length (above) is the primary control and never skips.
 */
export async function isBreachedPassword(
  password: string,
  fetcher: typeof fetch = fetch,
): Promise<boolean | null> {
  const digest = createHash('sha1').update(password, 'utf8').digest('hex').toUpperCase();
  const prefix = digest.slice(0, 5);
  const suffix = digest.slice(5);
  try {
    const response = await fetcher(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { 'Add-Padding': 'true', 'User-Agent': 'TradeDocs-password-check' },
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(1_500),
    });
    if (!response.ok) {
      void response.body?.cancel().catch(() => undefined);
      return null;
    }
    const body = await response.text();
    for (const line of body.split('\n')) {
      const [candidate, count] = line.trim().split(':');
      // Padding entries carry a count of zero and never match a real digest.
      if (candidate === suffix && Number(count) > 0) return true;
    }
    return false;
  } catch {
    return null;
  }
}
