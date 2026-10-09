import { z } from 'zod';
import { MAX_ESIGN_MESSAGE, MAX_ESIGN_SIGNERS } from '@/lib/limits';
import type { SignerInput, SignerState } from './dropbox-sign';

/**
 * The send form, validated at the trust boundary. Pure, so it can be tested. Signers arrive
 * as signer_name_<n> / signer_email_<n> for n below MAX_ESIGN_SIGNERS; blank rows are
 * skipped; at least one signer is required and an email address may appear only once.
 */

export type SendRequest = {
  org: string;
  document: string;
  signers: SignerInput[];
  message: string | null;
};

export type SendParse =
  | { ok: true; value: SendRequest }
  | { ok: false; error: string; fields?: Record<string, string> };

const nameSchema = z.string().trim().min(1).max(120);
const emailSchema = z.email().max(254);

function read(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === 'string' ? value : '';
}

export function parseSendForm(formData: FormData): SendParse {
  const target = z
    .object({ org: z.uuid(), document: z.uuid() })
    .safeParse({
      org: read(formData, 'org').toLowerCase(),
      document: read(formData, 'document').toLowerCase(),
    });
  if (!target.success) return { ok: false, error: 'That request was not understood. Reload and try again.' };

  const fields: Record<string, string> = {};
  const signers: SignerInput[] = [];
  const seen = new Set<string>();
  for (let index = 0; index < MAX_ESIGN_SIGNERS; index += 1) {
    const rawName = read(formData, `signer_name_${index}`).trim();
    const rawEmail = read(formData, `signer_email_${index}`).trim();
    if (!rawName && !rawEmail) continue;
    const name = nameSchema.safeParse(rawName);
    const email = emailSchema.safeParse(rawEmail.toLowerCase());
    if (!name.success) fields[`signer_name_${index}`] = 'Enter the signer’s name (120 characters or fewer).';
    if (!email.success) fields[`signer_email_${index}`] = 'Enter a valid email address.';
    if (!name.success || !email.success) continue;
    if (seen.has(email.data)) {
      fields[`signer_email_${index}`] = 'Each signer needs a different email address.';
      continue;
    }
    seen.add(email.data);
    signers.push({ name: name.data, email: email.data });
  }
  if (Object.keys(fields).length > 0) {
    return { ok: false, error: 'Check the highlighted signers.', fields };
  }
  if (signers.length === 0) {
    const message = 'Add at least one signer.';
    return { ok: false, error: message, fields: { signer_email_0: message } };
  }

  const message = read(formData, 'message').trim();
  if (message.length > MAX_ESIGN_MESSAGE) {
    const error = `Keep the message to ${MAX_ESIGN_MESSAGE} characters or fewer.`;
    return { ok: false, error, fields: { message: error } };
  }

  return {
    ok: true,
    value: {
      org: target.data.org,
      document: target.data.document,
      signers,
      message: message || null,
    },
  };
}

/** The signers as first stored: everyone awaiting signature. */
export function initialSigners(signers: readonly SignerInput[]): SignerState[] {
  return signers.map((signer) => ({
    email: signer.email,
    name: signer.name,
    status: 'awaiting_signature',
    signed_at: null,
  }));
}

/** The email subject and request title the provider shows signers. */
export function requestTexts(documentNumber: string, documentKind: string) {
  return {
    title: `${documentKind} ${documentNumber}`,
    subject: `Please sign ${documentKind.toLowerCase()} ${documentNumber}`,
  };
}
