/**
 * Platform administrators are named by email in PLATFORM_ADMIN_EMAILS (comma or whitespace
 * separated). Pure, so the decision is unit tested exactly as the server makes it.
 *
 * Fails closed: an unset or malformed list names nobody, an address must match an entry
 * exactly (case-insensitively, never by suffix or domain), and an account whose address is
 * not confirmed is never an administrator, because an unconfirmed address proves nothing
 * about who holds the account.
 */

const ADDRESS = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/;
const MAX_ENTRIES = 50;

export function parseAdminAllowlist(raw: string | undefined): ReadonlySet<string> {
  if (!raw) return new Set();
  const entries = raw
    .split(/[\s,]+/)
    .map((entry) => entry.trim().toLowerCase())
    .filter((entry) => entry.length > 0 && entry.length <= 254 && ADDRESS.test(entry));
  return new Set(entries.slice(0, MAX_ENTRIES));
}

export type AdminCandidate = {
  email?: string | null;
  email_confirmed_at?: string | null;
};

export function isPlatformAdmin(
  user: AdminCandidate | null | undefined,
  raw: string | undefined,
): boolean {
  if (!user?.email || !user.email_confirmed_at) return false;
  const allowlist = parseAdminAllowlist(raw);
  if (allowlist.size === 0) return false;
  return allowlist.has(user.email.trim().toLowerCase());
}
