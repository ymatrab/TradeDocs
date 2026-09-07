'use client';

import { useEffect, useRef, type RefObject } from 'react';

/**
 * Moves focus to the first control the server rejected.
 *
 * Server-side validation lands after the round trip, by which time focus is on a
 * submit button that may now be disabled. Without this the message exists but
 * nothing points at it, which is the same as not having it.
 */
export function useInvalidFocus(
  form: RefObject<HTMLFormElement | null>,
  fields: Record<string, string> | undefined,
) {
  const previous = useRef<Record<string, string> | undefined>(undefined);

  useEffect(() => {
    if (!fields || fields === previous.current) return;
    previous.current = fields;
    const invalid = form.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    invalid?.focus();
  }, [form, fields]);
}
