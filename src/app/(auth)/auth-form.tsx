'use client';

import { useActionState, useRef } from 'react';
import { Button } from '@/components/primitives/button';
import { Field, Input } from '@/components/primitives/form';
import { Callout } from '@/components/primitives/feedback';
import { useInvalidFocus } from '@/components/primitives/use-invalid-focus';
import { showsSummary } from '@/lib/form-errors';
import type { FormState } from './actions';

type Action = (state: FormState, formData: FormData) => Promise<FormState>;

/**
 * One form for every credential screen. Each screen differs only in which fields it asks
 * for and what the submit button promises, so they share the error, notice and pending
 * behaviour rather than reimplementing it four times.
 */
export function AuthForm({
  action,
  submitLabel,
  pendingLabel,
  includePassword = true,
  passwordLabel = 'Password',
  passwordHint,
  autoCompletePassword = 'current-password',
  includeEmail = true,
}: {
  action: Action;
  submitLabel: string;
  pendingLabel: string;
  includePassword?: boolean;
  passwordLabel?: string;
  passwordHint?: string;
  autoCompletePassword?: 'current-password' | 'new-password';
  includeEmail?: boolean;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, {});
  const form = useRef<HTMLFormElement>(null);
  useInvalidFocus(form, state.fields);

  return (
    <form ref={form} action={formAction} style={{ display: 'grid', gap: 20 }} noValidate>
      {showsSummary(state) ? (
        <Callout tone="danger" title="That did not work" live>
          {state.error}
        </Callout>
      ) : null}
      {state.notice ? (
        <Callout tone="success" title="Check your inbox" live>
          {state.notice}
        </Callout>
      ) : null}

      {includeEmail ? (
        <Field id="email" label="Email address" error={state.fields?.email}>
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="email"
              type="email"
              autoComplete="email"
              required
              invalid={invalid}
              aria-describedby={describedBy}
            />
          )}
        </Field>
      ) : null}

      {includePassword ? (
        <Field
          id="password"
          label={passwordLabel}
          hint={passwordHint}
          error={state.fields?.password}
        >
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="password"
              type="password"
              autoComplete={autoCompletePassword}
              required
              minLength={12}
              invalid={invalid}
              aria-describedby={describedBy}
            />
          )}
        </Field>
      ) : null}

      <Button type="submit" block pending={pending} pendingLabel={pendingLabel}>
        {submitLabel}
      </Button>
    </form>
  );
}
