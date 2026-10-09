import 'server-only';

/**
 * The trade.gov Consolidated Screening List subscription key (D-025; the owner registers
 * it at developer.trade.gov).
 *
 * Read per feature, outside the strict schema: a missing or malformed key disables
 * denied-party screening, which then says so and links the official search, and never the
 * deployment. Server-only; the key never reaches a browser, a log or a response.
 */
export function cslApiKey(raw: string | undefined = process.env.CSL_API_KEY): string | null {
  const value = raw?.trim();
  return value && /^[A-Za-z0-9_-]{16,128}$/.test(value) ? value : null;
}
