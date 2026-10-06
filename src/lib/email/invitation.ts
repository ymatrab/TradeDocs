import 'server-only';

import type { ServerEnv } from '@/lib/config/schema';
import { roleLabel } from '@/lib/labels';

export type InvitationDelivery =
  | { status: 'sent'; to: 'invitee' | 'sandbox' }
  | { status: 'not_sent'; reason: 'not_configured' | 'no_sandbox_recipient' }
  | { status: 'failed'; reason: string };

/**
 * Who receives an invitation email. Production sends to the invitee; every other environment
 * sends only to EMAIL_SANDBOX_RECIPIENT, so a preview never emails a real customer (AGENTS.md).
 * Without Resend, a sender identity and the canonical origin nothing is sent, and the inviter
 * is told to pass the link on themselves.
 */
export function invitationRecipient(
  env: ServerEnv,
  invitee: string,
):
  | { to: string; kind: 'invitee' | 'sandbox' }
  | { skip: 'not_configured' | 'no_sandbox_recipient' } {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM || !env.APP_URL) return { skip: 'not_configured' };
  if (env.APP_ENV !== 'production') {
    return env.EMAIL_SANDBOX_RECIPIENT
      ? { to: env.EMAIL_SANDBOX_RECIPIENT, kind: 'sandbox' }
      : { skip: 'no_sandbox_recipient' };
  }
  return { to: invitee, kind: 'invitee' };
}

/** The absolute acceptance link. The token is the credential; it carries no personal data. */
export function invitationLink(appUrl: string | undefined, token: string): string {
  const path = `/invitations/accept?token=${encodeURIComponent(token)}`;
  return appUrl ? new URL(path, appUrl).toString() : path;
}

export type InvitationMessage = {
  invitationId: string;
  /** Distinguishes a reissue from the first send, so Resend does not deduplicate it away. */
  attempt: string;
  invitee: string;
  organization: string;
  role: string;
  link: string;
  expiresAt: string;
};

/**
 * Sends an invitation through Resend's HTTP API (D-017). The link is the point of the
 * email, so it is in the body and nowhere else: never logged, never stored readable.
 */
export async function sendInvitationEmail(
  env: ServerEnv,
  message: InvitationMessage,
  fetcher: typeof fetch = fetch,
): Promise<InvitationDelivery> {
  const recipient = invitationRecipient(env, message.invitee);
  if ('skip' in recipient) return { status: 'not_sent', reason: recipient.skip };

  const expires = new Date(message.expiresAt).toISOString().slice(0, 10);
  const text = [
    `You have been invited to join ${message.organization} on TradeDocs as ${roleLabel(message.role).toLowerCase()}.`,
    '',
    'Accept the invitation:',
    message.link,
    '',
    `The link works once, only for ${message.invitee}, and expires on ${expires}.`,
    'If you were not expecting this, ignore the email; nothing happens unless the link is used.',
    '',
    '— TradeDocs. TradeDocs prepares trade documents; it does not issue or endorse them.',
  ].join('\n');

  try {
    const response = await fetcher('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `invitation-${message.invitationId}-${message.attempt}`,
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM,
        to: [recipient.to],
        subject: `Join ${message.organization} on TradeDocs`,
        text,
      }),
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(5_000),
    });
    void response.body?.cancel().catch(() => undefined);
    if (!response.ok) return { status: 'failed', reason: `resend_http_${response.status}` };
    return { status: 'sent', to: recipient.kind };
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'TimeoutError';
    return { status: 'failed', reason: timedOut ? 'resend_timeout' : 'resend_unreachable' };
  }
}
