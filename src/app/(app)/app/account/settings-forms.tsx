'use client';

import { useActionState, useEffect, useRef } from 'react';
import { Button } from '@/components/primitives/button';
import { Callout } from '@/components/primitives/feedback';
import { Field, Input } from '@/components/primitives/form';
import { PasswordInput } from '@/components/primitives/password-input';
import { useInvalidFocus } from '@/components/primitives/use-invalid-focus';
import { showsSummary } from '@/lib/form-errors';
import { changeEmail, changePassword, updateDisplayName, type SettingsState } from './actions';

type Action = (state: SettingsState, formData: FormData) => Promise<SettingsState>;

const formStyle = { display: 'grid', gap: 16, maxWidth: 480 } as const;

function useSettingsForm(action: Action, resetOnSave: boolean) {
  const [state, formAction, pending] = useActionState<SettingsState, FormData>(action, {});
  const form = useRef<HTMLFormElement>(null);
  useInvalidFocus(form, state.fields);
  useEffect(() => {
    // Passwords never stay in the fields after they have been used.
    if (resetOnSave && state.saved) form.current?.reset();
  }, [resetOnSave, state.saved]);
  return { state, formAction, pending, form };
}

function Outcome({ state }: { state: SettingsState }) {
  return (
    <>
      {showsSummary(state) ? (
        <Callout tone="danger" title="That did not work" live>
          {state.error}
        </Callout>
      ) : null}
      {state.notice ? (
        <Callout tone="success" title="Saved" live>
          {state.notice}
        </Callout>
      ) : null}
    </>
  );
}

export function NameForm({ current }: { current: string | null }) {
  const { state, formAction, pending, form } = useSettingsForm(updateDisplayName, false);
  return (
    <form ref={form} action={formAction} style={formStyle} noValidate>
      <Outcome state={state} />
      <Field
        id="display-name"
        label="Your name"
        hint="Shown to colleagues in your organizations."
        error={state.fields?.display_name}
      >
        {({ id, describedBy, invalid }) => (
          <Input
            id={id}
            name="display_name"
            autoComplete="name"
            maxLength={160}
            defaultValue={current ?? ''}
            invalid={invalid}
            aria-describedby={describedBy}
          />
        )}
      </Field>
      <div>
        <Button type="submit" tone="secondary" pending={pending} pendingLabel="Saving…">
          Save name
        </Button>
      </div>
    </form>
  );
}

export function EmailForm({ pending: pendingAddress }: { pending: string | null }) {
  const { state, formAction, pending, form } = useSettingsForm(changeEmail, true);
  return (
    <form ref={form} action={formAction} style={formStyle} noValidate>
      {pendingAddress && !state.notice ? (
        <Callout tone="warning" title="A change is waiting for confirmation">
          The address changes to {pendingAddress} once the confirmation link is opened.
        </Callout>
      ) : null}
      <Outcome state={state} />
      <Field id="new-email" label="New email address" error={state.fields?.email}>
        {({ id, describedBy, invalid }) => (
          <Input
            id={id}
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            invalid={invalid}
            aria-describedby={describedBy}
          />
        )}
      </Field>
      <Field
        id="email-current-password"
        label="Current password"
        hint="Needed to change how you sign in."
        error={state.fields?.current_password}
      >
        {({ id, describedBy, invalid }) => (
          <PasswordInput
            id={id}
            name="current_password"
            autoComplete="current-password"
            required
            invalid={invalid}
            aria-describedby={describedBy}
          />
        )}
      </Field>
      <div>
        <Button type="submit" tone="secondary" pending={pending} pendingLabel="Sending…">
          Change email address
        </Button>
      </div>
    </form>
  );
}

export function PasswordForm() {
  const { state, formAction, pending, form } = useSettingsForm(changePassword, true);
  return (
    <form ref={form} action={formAction} style={formStyle} noValidate>
      <Outcome state={state} />
      <Field id="password-current" label="Current password" error={state.fields?.current_password}>
        {({ id, describedBy, invalid }) => (
          <PasswordInput
            id={id}
            name="current_password"
            autoComplete="current-password"
            required
            invalid={invalid}
            aria-describedby={describedBy}
          />
        )}
      </Field>
      <Field
        id="password-new"
        label="New password"
        hint="At least 12 characters. Passwords found in known breaches are refused."
        error={state.fields?.new_password}
      >
        {({ id, describedBy, invalid }) => (
          <PasswordInput
            id={id}
            name="new_password"
            autoComplete="new-password"
            required
            minLength={12}
            maxLength={72}
            invalid={invalid}
            aria-describedby={describedBy}
          />
        )}
      </Field>
      <div>
        <Button type="submit" tone="secondary" pending={pending} pendingLabel="Saving…">
          Change password
        </Button>
      </div>
    </form>
  );
}
