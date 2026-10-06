type ContentSecurityPolicyOptions = {
  nonce: string;
  development?: boolean;
  supabaseUrl?: string;
};

/** Per-request nonces must also be forwarded in the request CSP so Next can apply them. */
export function buildContentSecurityPolicy({
  nonce,
  development = false,
  supabaseUrl,
}: ContentSecurityPolicyOptions): string {
  if (!/^[A-Za-z0-9+/_=-]{16,128}$/.test(nonce)) throw new Error('Invalid CSP nonce.');
  const connectOrigins = ["'self'", 'https://challenges.cloudflare.com'];
  const imageSources = ["'self'", 'data:', 'blob:', 'https://images.unsplash.com'];
  if (supabaseUrl) {
    const service = new URL(supabaseUrl);
    // Branding previews on the settings page: short-lived signed URLs into the private
    // org-branding bucket, and nothing else of the storage service.
    imageSources.push(`${service.origin}/storage/v1/object/sign/org-branding/`);
    connectOrigins.push(
      service.origin,
      `${service.protocol === 'https:' ? 'wss:' : 'ws:'}//${service.host}`,
    );
  }
  if (development) connectOrigins.push('ws://localhost:*', 'ws://127.0.0.1:*');
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${development ? " 'unsafe-eval'" : ''} https://challenges.cloudflare.com`,
    // Next, Tailwind and accessible overlays can apply inline style attributes.
    "style-src 'self' 'unsafe-inline'",
    // Guide covers are hotlinked from Unsplash, as its API guidelines require (D-016).
    `img-src ${imageSources.join(' ')}`,
    "font-src 'self'",
    `connect-src ${connectOrigins.join(' ')}`,
    'frame-src https://challenges.cloudflare.com',
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'none'",
    "object-src 'none'",
    "worker-src 'self' blob:",
    ...(development ? [] : ['upgrade-insecure-requests']),
  ];
  return directives.join('; ');
}

export function securityHeaders(production: boolean): { key: string; value: string }[] {
  return [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    {
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=(), payment=(), browsing-topics=()',
    },
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
    { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
    { key: 'X-DNS-Prefetch-Control', value: 'off' },
    ...(production
      ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }]
      : []),
  ];
}
