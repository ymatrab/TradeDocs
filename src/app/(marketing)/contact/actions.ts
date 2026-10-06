'use server';

import { headers } from 'next/headers';
import type { ServerEnv } from '@/lib/config/schema';
import { getServerEnv } from '@/lib/config/server';
import { parseContact, type ContactInput } from '@/lib/contact/schema';
import { sendContactNotification } from '@/lib/email/contact-notification';
import { HttpError } from '@/lib/http/request';
import { getLegalIdentity } from '@/lib/legal/server';
import { limitPublicRequest, type RateLimitPolicy } from '@/lib/security/rate-limit';
import { createServiceClient, hasServiceRole } from '@/lib/supabase/admin';

export type ContactState = {
  sent?: boolean;
  error?: string;
  fields?: Record<string, string>;
  /** What the visitor typed, so a refused submission does not lose a long message. */
  values?: Partial<Record<'name' | 'email' | 'topic' | 'message', string>>;
};

/** Five messages an hour from one address is generous for a person and dull for a script. */
const POLICY: RateLimitPolicy = { namespace: 'contact:message', limit: 5, windowSeconds: 3600 };

function read(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === 'string' ? value : '';
}

/**
 * Stores a contact message and, when email is configured, tells the owner.
 *
 * Order matters: validate, then quota, then store, then notify. A message is stored before
 * any email is attempted, so a mail outage never loses it, and the outcome of the email is
 * recorded on the row by reason code, where the admin inbox shows it. Nothing the visitor
 * typed is logged, and the result is returned in the form state rather than a URL.
 */
export async function sendContactMessage(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = Object.fromEntries(
    ['name', 'email', 'topic', 'message', 'website'].map((field) => [field, read(formData, field)]),
  );
  const values = {
    name: read(formData, 'name').slice(0, 200),
    email: read(formData, 'email').slice(0, 300),
    topic: read(formData, 'topic').slice(0, 20),
    message: read(formData, 'message').slice(0, 6000),
  };

  const parsed = parseContact(raw);
  // A filled honeypot gets the same answer a person would, so a bot learns nothing.
  if (parsed.kind === 'trap') return { sent: true };
  if (parsed.kind === 'invalid') {
    return { error: 'Check the highlighted fields.', fields: parsed.fields, values };
  }

  if (!hasServiceRole()) {
    return {
      error:
        'The contact form is not connected on this deployment yet. Email the address shown on this page instead.',
      values,
    };
  }

  let env: ServerEnv;
  try {
    env = getServerEnv();
    await limitPublicRequest({ headers: new Headers(await headers()) }, POLICY, env);
  } catch (error) {
    if (error instanceof HttpError && error.status === 429) {
      return { error: 'You have sent several messages already. Try again in an hour.', values };
    }
    console.error('contact: quota check unavailable', {
      code: error instanceof HttpError ? error.code : 'unknown',
    });
    return { error: 'The form is temporarily unavailable. Try again in a minute.', values };
  }

  const message: ContactInput = parsed.data;
  const client = createServiceClient();
  const { data: row, error: insertError } = await client
    .from('contact_messages')
    .insert({
      name: message.name,
      email: message.email,
      topic: message.topic,
      message: message.message,
    })
    .select('id')
    .single();
  if (insertError || !row) {
    // The provider's code and message describe the failure, not the submission.
    console.error('contact: insert failed', {
      code: insertError?.code ?? 'no_row',
      message: insertError?.message,
    });
    return { error: 'Your message could not be saved. Try again in a minute.', values };
  }

  const outcome = await sendContactNotification(env, getLegalIdentity().contactEmail, {
    ...message,
    id: row.id,
  });
  const detail = outcome.status === 'sent' ? null : outcome.reason.slice(0, 100);
  const { error: updateError } = await client
    .from('contact_messages')
    .update({ notification_status: outcome.status, notification_detail: detail })
    .eq('id', row.id);
  if (outcome.status === 'failed' || updateError) {
    console.error('contact: notification', {
      id: row.id,
      status: outcome.status,
      detail,
      update: updateError?.code,
    });
  }

  return { sent: true };
}
