const sensitiveKey = /password|passwd|secret|token|authorization|cookie|api.?key|service.?role|email|phone|address|iban|swift|bank|passport|national.?id|tax.?id|ip.?address|user.?agent|document.?content|payload|request.?body/i;
const bearer = /\bBearer\s+[^\s,;]+/gi;
const jwt = /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g;
const email = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const providerKey = /\b(?:sk|pk|sb_secret|sb_publishable|re)_[A-Za-z0-9_-]{12,}\b/g;

function sanitizeText(value: string): string {
  return value
    .replace(bearer, '[REDACTED]')
    .replace(jwt, '[REDACTED]')
    .replace(providerKey, '[REDACTED]')
    .replace(email, '[REDACTED]')
    .replace(/https?:\/\/[^\s"'<>]+/gi, (raw) => {
      try {
        const url = new URL(raw);
        // URLs can contain tokens and private record identifiers anywhere in the path.
        return `${url.protocol}//${url.host}/[REDACTED]`;
      } catch {
        return '[REDACTED]';
      }
    });
}

/** Defense in depth: callers must log allowlisted event metadata, never raw input. */
export function redact(value: unknown): unknown {
  const seen = new WeakSet<object>();
  const visit = (entry: unknown, depth: number): unknown => {
    if (depth > 6) return '[TRUNCATED]';
    if (typeof entry === 'string') return sanitizeText(entry.slice(0, 2048));
    if (entry === null || typeof entry === 'number' || typeof entry === 'boolean') return entry;
    if (typeof entry !== 'object') return '[REDACTED]';
    if (seen.has(entry)) return '[CIRCULAR]';
    seen.add(entry);
    if (entry instanceof Error) return { name: sanitizeText(entry.name), message: '[REDACTED]' };
    if (Array.isArray(entry)) return entry.slice(0, 50).map((item) => visit(item, depth + 1));
    return Object.fromEntries(
      Object.entries(entry).slice(0, 50).map(([key, item]) => [
        key,
        sensitiveKey.test(key) ? '[REDACTED]' : visit(item, depth + 1),
      ]),
    );
  };
  return visit(value, 0);
}
