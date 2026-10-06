'use client';

import { useActionState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/primitives/button';
import { Callout } from '@/components/primitives/feedback';
import { Field, Input, Select, Textarea } from '@/components/primitives/form';
import { useInvalidFocus } from '@/components/primitives/use-invalid-focus';
import { TurnstileWidget } from '@/components/security/turnstile-widget';
import { CONTACT_LIMITS, CONTACT_TOPICS, HONEYPOT_FIELD } from '@/lib/contact/fields';
import { sendContactMessage, type ContactState } from './actions';

export function ContactForm({
  available,
  siteKey = null,
}: {
  available: boolean;
  /** Turnstile's public key when the challenge is active (D-017). */
  siteKey?: string | null;
}) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContactMessage, {});
  const form = useRef<HTMLFormElement>(null);
  useInvalidFocus(form, state.fields);

  if (state.sent) {
    return (
      <div style={{ display: 'grid', gap: 16 }}>
        <Callout tone="success" title="Message received" live>
          Thank you. Your message is with the team that runs TradeDocs, and the reply goes to the
          address you gave.
        </Callout>
        <p className="muted" style={{ margin: 0 }}>
          Meanwhile, the{' '}
          <Link className="text-link" href="/help">
            help centre
          </Link>{' '}
          may already have the answer.
        </p>
      </div>
    );
  }

  const values = state.values ?? {};
  return (
    <form ref={form} action={action} style={{ display: 'grid', gap: 20 }} noValidate>
      {!available ? (
        <Callout tone="warning" title="The form is not connected here">
          This deployment has no database, so messages cannot be received through the form. Use the
          email address on this page instead.
        </Callout>
      ) : null}
      {state.error ? (
        <Callout tone="danger" title="That did not send" live>
          {state.error}
        </Callout>
      ) : null}

      <Field id="contact-name" label="Your name" error={state.fields?.name}>
        {({ id, describedBy, invalid }) => (
          <Input
            id={id}
            name="name"
            autoComplete="name"
            required
            maxLength={CONTACT_LIMITS.name.max}
            defaultValue={values.name}
            invalid={invalid}
            aria-describedby={describedBy}
            disabled={!available}
          />
        )}
      </Field>

      <Field
        id="contact-email"
        label="Email address"
        hint="We reply here. It is not added to any list."
        error={state.fields?.email}
      >
        {({ id, describedBy, invalid }) => (
          <Input
            id={id}
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={CONTACT_LIMITS.email.max}
            defaultValue={values.email}
            invalid={invalid}
            aria-describedby={describedBy}
            disabled={!available}
          />
        )}
      </Field>

      <Field id="contact-topic" label="What is it about?" error={state.fields?.topic}>
        {({ id, describedBy, invalid }) => (
          <Select
            id={id}
            name="topic"
            required
            defaultValue={values.topic ?? ''}
            invalid={invalid}
            aria-describedby={describedBy}
            disabled={!available}
          >
            <option value="" disabled>
              Choose one
            </option>
            {CONTACT_TOPICS.map((topic) => (
              <option key={topic.value} value={topic.value}>
                {topic.label}
              </option>
            ))}
          </Select>
        )}
      </Field>

      <Field
        id="contact-message"
        label="Message"
        hint={`Between ${CONTACT_LIMITS.message.min} and ${CONTACT_LIMITS.message.max} characters. Leave out passwords and payment details.`}
        error={state.fields?.message}
      >
        {({ id, describedBy, invalid }) => (
          <Textarea
            id={id}
            name="message"
            rows={7}
            required
            minLength={CONTACT_LIMITS.message.min}
            maxLength={CONTACT_LIMITS.message.max}
            defaultValue={values.message}
            invalid={invalid}
            aria-describedby={describedBy}
            disabled={!available}
          />
        )}
      </Field>

      {/* The honeypot. Hidden from people and assistive technology; bots fill it. */}
      <div className="contact-trap" aria-hidden="true">
        <label htmlFor="contact-website">Leave this empty</label>
        <input
          id="contact-website"
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <p className="muted" style={{ margin: 0, fontSize: 14 }}>
        We use what you send only to answer you. See the{' '}
        <Link className="text-link" href="/privacy">
          privacy policy
        </Link>
        .
      </p>

      {available ? <TurnstileWidget siteKey={siteKey} action="contact" resetKey={state} /> : null}

      <div>
        <Button type="submit" pending={pending} pendingLabel="Sending…" disabled={!available}>
          Send the message
        </Button>
      </div>
    </form>
  );
}
