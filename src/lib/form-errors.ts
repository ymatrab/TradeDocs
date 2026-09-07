import type { ZodError } from 'zod';

/**
 * The first message per field, keyed by the form field name.
 *
 * A single message at the top of a form tells someone that something is wrong;
 * it does not tell them where. Keying by field name lets the control that was
 * rejected carry its own message and take focus.
 */
export function fieldErrors(error: ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && !(key in fields)) fields[key] = issue.message;
  }
  return fields;
}

/** The message to show above the form when one field is at fault. */
export function summaryOf(fields: Record<string, string>, fallback: string): string {
  const messages = Object.values(fields);
  return messages.length === 1 ? (messages[0] ?? fallback) : fallback;
}

/**
 * Whether a form-level message still says something the fields do not.
 *
 * When exactly one field was rejected, the summary repeats that field's own
 * message word for word: two copies of one sentence, and the reader has to work
 * out that they are the same problem. The field keeps it; the summary steps back.
 */
export function showsSummary(state: { error?: string; fields?: Record<string, string> }): boolean {
  if (!state.error) return false;
  return !state.fields || Object.keys(state.fields).length > 1;
}
