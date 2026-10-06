import { z } from 'zod';
import {
  CONTACT_LIMITS,
  CONTACT_TOPICS,
  HONEYPOT_FIELD,
  type ContactTopic,
} from '@/lib/contact/fields';

/**
 * The contact form's contract, shared by the server action and the unit tests. The database
 * carries the same bounds as check constraints, so a caller that skips this still cannot
 * store an oversized row.
 */

export { CONTACT_LIMITS, CONTACT_TOPICS, HONEYPOT_FIELD, topicLabel } from '@/lib/contact/fields';
export type { ContactTopic } from '@/lib/contact/fields';

const topicValues = CONTACT_TOPICS.map((topic) => topic.value) as [ContactTopic, ...ContactTopic[]];

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.name.min, 'Enter your name.')
    .max(CONTACT_LIMITS.name.max, `Use at most ${CONTACT_LIMITS.name.max} characters.`)
    // A name is printed into an email; a line break there is never a name.
    .refine((value) => !/[\r\n\u0000]/.test(value), 'Use a single line.'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(CONTACT_LIMITS.email.max, 'That address is too long.')
    .pipe(z.email('Enter a valid email address.')),
  topic: z.enum(topicValues, 'Choose what this is about.'),
  message: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.message.min, `Write at least ${CONTACT_LIMITS.message.min} characters.`)
    .max(CONTACT_LIMITS.message.max, `Keep it under ${CONTACT_LIMITS.message.max} characters.`)
    .refine((value) => !value.includes('\u0000'), 'Remove the unsupported characters.'),
});

export type ContactInput = z.output<typeof contactSchema>;

export type ContactParse =
  | { kind: 'valid'; data: ContactInput }
  | { kind: 'invalid'; fields: Record<string, string> }
  /** The honeypot was filled: answer as if sent, store and send nothing. */
  | { kind: 'trap' };

export function parseContact(raw: Record<string, unknown>): ContactParse {
  const trap = raw[HONEYPOT_FIELD];
  if (typeof trap === 'string' && trap.trim().length > 0) return { kind: 'trap' };

  const result = contactSchema.safeParse({
    name: typeof raw.name === 'string' ? raw.name : '',
    email: typeof raw.email === 'string' ? raw.email : '',
    topic: typeof raw.topic === 'string' ? raw.topic : '',
    message: typeof raw.message === 'string' ? raw.message : '',
  });
  if (result.success) return { kind: 'valid', data: result.data };

  const fields: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0]?.toString();
    if (key && !fields[key]) fields[key] = issue.message;
  }
  return { kind: 'invalid', fields };
}
