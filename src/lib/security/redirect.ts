const fallbackPath = '/dashboard';

/** Only unambiguous, same-origin paths can enter redirects or post-login callbacks. */
export function safeReturnPath(value: unknown, fallback = fallbackPath): string {
  if (typeof value !== 'string' || value.length > 2048) return fallback;
  let decoded = value;
  try {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    }
  } catch {
    return fallback;
  }
  if (
    !decoded.startsWith('/') ||
    decoded.startsWith('//') ||
    /[\\\u0000-\u0020\u007f]/.test(decoded) ||
    /%[0-9a-f]{2}/i.test(decoded)
  ) {
    return fallback;
  }
  try {
    const base = new URL('https://redirect.invalid');
    const target = new URL(value, base);
    if (target.origin !== base.origin) return fallback;
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return fallback;
  }
}
