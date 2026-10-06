/**
 * The contact form's fields and bounds, without the validator, so the browser form can use
 * them without shipping zod. src/lib/contact/schema.ts validates against these same values,
 * and the contact_messages table repeats them as check constraints.
 */

export const CONTACT_TOPICS = [
  { value: 'question', label: 'A question about TradeDocs' },
  { value: 'account', label: 'My account or signing in' },
  { value: 'problem', label: 'Something is not working' },
  { value: 'privacy', label: 'Privacy or a data request' },
  { value: 'other', label: 'Something else' },
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number]['value'];

export const CONTACT_LIMITS = {
  name: { min: 1, max: 120 },
  email: { max: 254 },
  message: { min: 10, max: 5000 },
} as const;

/** The honeypot's field name. Real visitors never see or fill it. */
export const HONEYPOT_FIELD = 'website';

export function topicLabel(value: string): string {
  return CONTACT_TOPICS.find((topic) => topic.value === value)?.label ?? 'Something else';
}
