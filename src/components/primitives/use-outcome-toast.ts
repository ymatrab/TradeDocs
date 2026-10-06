'use client';

import { useEffect, useRef, type FormEvent } from 'react';
import { useOptionalToast } from '@/components/primitives/toast';

/**
 * Confirms a successful action in words that name what changed ("“Enamel sign” is on
 * the shipment"), where the server can only say "Line added."
 *
 * The inline result callout stays the announced record of the outcome, beside the form
 * it belongs to. The toast is drawn silently on top of it because a long panel puts that
 * callout out of view once the user has scrolled down to the form they submitted — the
 * toast is what they actually see.
 *
 * Returns an `onSubmit` handler. The message is composed there, at submission, from
 * what was sent and what the screen showed at that moment — after a removal the row it
 * would quote is already gone. It is shown only if the action then succeeds, and the
 * handler never prevents the submission.
 */
export function useOutcomeToast(
  state: { notice?: string },
  compose: (submitted: FormData) => string,
) {
  const notify = useOptionalToast();
  const pending = useRef<string | null>(null);
  const seen = useRef(state);

  useEffect(() => {
    if (state === seen.current) return;
    seen.current = state;
    const message = pending.current;
    pending.current = null;
    if (state.notice && message) notify('success', message, { silent: true });
  }, [state, notify]);

  return (event: FormEvent<HTMLFormElement>) => {
    pending.current = compose(new FormData(event.currentTarget));
  };
}

/** Reads one text field from what was submitted, trimmed, or null. */
export function sent(form: FormData, name: string): string | null {
  const value = form.get(name);
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}
