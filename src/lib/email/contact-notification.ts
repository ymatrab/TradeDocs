import 'server-only';

import type { ServerEnv } from '@/lib/config/schema';
import { topicLabel, type ContactInput } from '@/lib/contact/schema';

export type NotificationOutcome =
  | { status: 'sent' }
  | { status: 'not_sent'; reason: 'not_configured' | 'no_sandbox_recipient' }
  | { status: 'failed'; reason: string };

/**
 * Where a contact notification goes. Production sends to the published contact address;
 * every other environment sends only to EMAIL_SANDBOX_RECIPIENT, so a preview can never mail
 * a real inbox it was not pointed at (AGENTS.md).
 */
export function notificationRecipient(
  env: ServerEnv,
  contactEmail: string | null,
): { to: string } | { skip: 'not_configured' | 'no_sandbox_recipient' } {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM || !contactEmail) return { skip: 'not_configured' };
  if (env.APP_ENV !== 'production') {
    return env.EMAIL_SANDBOX_RECIPIENT
      ? { to: env.EMAIL_SANDBOX_RECIPIENT }
      : { skip: 'no_sandbox_recipient' };
  }
  return { to: contactEmail };
}

/**
 * Tells the owner a contact message arrived, through Resend's HTTP API (D-017).
 *
 * The message itself is the point of the email, so it is in the body; it is never logged.
 * The visitor's address goes in Reply-To, never From: the sender is the verified identity.
 * Failure is reported to the caller and recorded on the row; the message stays stored and
 * visible in the admin inbox either way.
 */
export async function sendContactNotification(
  env: ServerEnv,
  contactEmail: string | null,
  message: ContactInput & { id: string },
  fetcher: typeof fetch = fetch,
): Promise<NotificationOutcome> {
  const recipient = notificationRecipient(env, contactEmail);
  if ('skip' in recipient) return { status: 'not_sent', reason: recipient.skip };

  const body = [
    `Topic: ${topicLabel(message.topic)}`,
    `From: ${message.name} <${message.email}>`,
    `Reference: ${message.id}`,
    '',
    message.message,
    '',
    '— Sent by the TradeDocs contact form. Reply to answer the sender directly.',
  ].join('\n');

  try {
    const response = await fetcher('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `contact-${message.id}`,
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM,
        to: [recipient.to],
        reply_to: message.email,
        subject: `TradeDocs contact: ${topicLabel(message.topic)}`,
        text: body,
      }),
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(5_000),
    });
    void response.body?.cancel().catch(() => undefined);
    if (!response.ok) return { status: 'failed', reason: `resend_http_${response.status}` };
    return { status: 'sent' };
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'TimeoutError';
    return { status: 'failed', reason: timedOut ? 'resend_timeout' : 'resend_unreachable' };
  }
}
