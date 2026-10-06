'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/primitives/button';
import { Field, Input } from '@/components/primitives/form';
import { PasswordInput } from '@/components/primitives/password-input';
import { Callout } from '@/components/primitives/feedback';
import { useInvalidFocus } from '@/components/primitives/use-invalid-focus';
import { TurnstileWidget } from '@/components/security/turnstile-widget';
import { showsSummary } from '@/lib/form-errors';
import { resendConfirmation, type FormState } from './actions';

type Action = (state: FormState, formData: FormData) => Promise<FormState>;

/**
 * One form for every credential screen. Each screen differs only in which fields it asks
 * for and what the submit button promises, so they share the error, notice, challenge and
 * pending behaviour rather than reimplementing it five times.
 *
 * `challenge` decides when Cloudflare Turnstile appears: `always` (sign-up) or `on-request`
 * (sign-in, once the server has counted enough failures). Nothing renders without a site
 * key, and the server verifies whenever the control is active, whatever this form shows.
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
  next,
  challenge,
  siteKey = null,
  turnstileAction,
}: {
  action: Action;
  submitLabel: string;
  pendingLabel: string;
  includePassword?: boolean;
  passwordLabel?: string;
  passwordHint?: string;
  autoCompletePassword?: 'current-password' | 'new-password';
  includeEmail?: boolean;
  /** A signed-in destination, already checked by the page; checked again by the action. */
  next?: string;
  challenge?: 'always' | 'on-request';
  siteKey?: string | null;
  turnstileAction?: 'sign_up' | 'sign_in';
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, {});
  const form = useRef<HTMLFormElement>(null);
  useInvalidFocus(form, state.fields);

  if (state.sentTo) return <CheckInbox email={state.sentTo} next={next} />;

  const showChallenge =
    Boolean(siteKey && turnstileAction) &&
    (challenge === 'always' || (challenge === 'on-request' && state.challenge));

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <form ref={form} action={formAction} style={{ display: 'grid', gap: 20 }} noValidate>
        {next ? <input type="hidden" name="next" value={next} /> : null}
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
                maxLength={254}
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
              <PasswordInput
                id={id}
                name="password"
                autoComplete={autoCompletePassword}
                required
                minLength={autoCompletePassword === 'new-password' ? 12 : undefined}
                maxLength={autoCompletePassword === 'new-password' ? 72 : undefined}
                invalid={invalid}
                aria-describedby={describedBy}
              />
            )}
          </Field>
        ) : null}

        {showChallenge && turnstileAction ? (
          <TurnstileWidget siteKey={siteKey} action={turnstileAction} resetKey={state.attempt} />
        ) : null}

        <Button type="submit" block pending={pending} pendingLabel={pendingLabel}>
          {submitLabel}
        </Button>
      </form>
      {state.unconfirmed ? (
        <ResendConfirmation email={state.unconfirmed} next={next} initialWait={0} />
      ) : null}
    </div>
  );
}

/**
 * After sign-up: the address we wrote to, what to do next, and a way to get another link.
 * The address is the one the person typed a moment ago; it is held in memory, never a URL.
 */
function CheckInbox({ email, next }: { email: string; next?: string }) {
  const heading = useRef<HTMLHeadingElement>(null);
  // Focus moves to the heading, which announces the change; the container is not a live
  // region, or the resend countdown inside it would be read out every second.
  useEffect(() => heading.current?.focus(), []);
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h2 ref={heading} tabIndex={-1} style={{ fontSize: 22, margin: 0 }}>
        Check your inbox
      </h2>
      <p style={{ margin: 0 }}>
        We sent a confirmation link to <strong className="data">{email}</strong>. Open it to
        finish creating your account. The link works once and expires, so use it soon.
      </p>
      <p className="muted" style={{ margin: 0 }}>
        Nothing there after a few minutes? Check spam or promotions, or send it again. If this
        address already has an account, sign in or reset the password instead.
      </p>
      <ResendConfirmation email={email} next={next} initialWait={60} />
    </div>
  );
}

/** Resend with a visible cooldown. The server enforces the same one-minute gap. */
function ResendConfirmation({
  email,
  next,
  initialWait,
}: {
  email: string;
  next?: string;
  /** Seconds before the first resend; a link was usually just sent. */
  initialWait: number;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(resendConfirmation, {});
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {state.error ? (
        <p className="error-text" role="alert" style={{ margin: 0 }}>
          {state.error}
        </p>
      ) : null}
      {state.notice ? (
        <p className="muted" role="status" style={{ margin: 0 }}>
          {state.notice}
        </p>
      ) : null}
      {/* Its own form, so a resend never resubmits the sign-in or sign-up fields. */}
      <form action={action}>
        <input type="hidden" name="email" value={email} />
        {next ? <input type="hidden" name="next" value={next} /> : null}
        <CooldownButton
          key={state.attempt ?? 0}
          pending={pending}
          wait={state.attempt ? 60 : initialWait}
        />
      </form>
    </div>
  );
}

function CooldownButton({ pending, wait }: { pending: boolean; wait: number }) {
  const [left, setLeft] = useState(wait);
  useEffect(() => {
    if (left <= 0) return;
    const timer = setTimeout(() => setLeft((value) => value - 1), 1_000);
    return () => clearTimeout(timer);
  }, [left]);
  return (
    <Button
      type="submit"
      tone="secondary"
      pending={pending}
      pendingLabel="Sending…"
      disabled={pending || left > 0}
    >
      {left > 0 ? `Resend the link (available in ${left}s)` : 'Resend the confirmation link'}
    </Button>
  );
}
