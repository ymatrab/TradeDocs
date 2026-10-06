import { publicSiteKey } from '@/lib/security/turnstile';

export const dynamic = 'force-dynamic';

/**
 * The public Turnstile site key, or null while the challenge is off. Lets a client-only
 * screen (the free document generator) render the widget without the page that hosts it
 * having to know. The site key is public by design; the secret never leaves the server.
 */
export function GET(): Response {
  return Response.json({ siteKey: publicSiteKey() }, { headers: { 'Cache-Control': 'no-store' } });
}
