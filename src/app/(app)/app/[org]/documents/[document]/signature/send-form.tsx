'use client';

import { useActionState, useRef, useState } from 'react';
import { Button } from '@/components/primitives/button';
import { Field, Input, Textarea } from '@/components/primitives/form';
import { ActionResult } from '@/components/primitives/action-result';
import { useInvalidFocus } from '@/components/primitives/use-invalid-focus';
import { sendForSignature } from '@/app/(app)/esign-actions';
import type { ActionState } from '@/app/(app)/actions';

/**
 * Signers and a message for one finalized document. The server validates everything again;
 * this only shapes the screen. Rows can be added up to the server's limit.
 */
export function SendForSignatureForm({
  org,
  document,
  maxSigners,
  maxMessage,
  testMode,
}: {
  org: string;
  document: string;
  maxSigners: number;
  maxMessage: number;
  testMode: boolean;
}) {
  const [state, send, sending] = useActionState<ActionState, FormData>(sendForSignature, {});
  const [rows, setRows] = useState(1);
  const form = useRef<HTMLFormElement>(null);
  useInvalidFocus(form, state.fields);

  return (
    <form ref={form} action={send} style={{ display: 'grid', gap: 16 }} noValidate>
      <ActionResult state={state} successTitle="Sent for signature" />
      <input type="hidden" name="org" value={org} />
      <input type="hidden" name="document" value={document} />
      {Array.from({ length: rows }, (_, index) => (
        <fieldset
          key={index}
          style={{ display: 'grid', gap: 12, border: 0, padding: 0, margin: 0 }}
        >
          <legend className="caption">Signer {index + 1}</legend>
          <Field
            id={`signer-name-${index}`}
            label="Name"
            error={state.fields?.[`signer_name_${index}`]}
          >
            {({ id, describedBy, invalid }) => (
              <Input
                id={id}
                name={`signer_name_${index}`}
                autoComplete="off"
                maxLength={120}
                invalid={invalid}
                aria-describedby={describedBy}
              />
            )}
          </Field>
          <Field
            id={`signer-email-${index}`}
            label="Email address"
            hint={index === 0 ? 'Dropbox Sign emails each signer a link to sign.' : undefined}
            error={state.fields?.[`signer_email_${index}`]}
          >
            {({ id, describedBy, invalid }) => (
              <Input
                id={id}
                name={`signer_email_${index}`}
                type="email"
                autoComplete="off"
                maxLength={254}
                invalid={invalid}
                aria-describedby={describedBy}
              />
            )}
          </Field>
        </fieldset>
      ))}
      {rows < maxSigners ? (
        <div>
          <Button type="button" tone="secondary" onClick={() => setRows((count) => count + 1)}>
            Add another signer
          </Button>
        </div>
      ) : null}
      <Field
        id="esign-message"
        label="Message to signers"
        requirement="Optional"
        hint={`Shown in the Dropbox Sign email. Up to ${maxMessage} characters.`}
        error={state.fields?.message}
      >
        {({ id, describedBy, invalid }) => (
          <Textarea
            id={id}
            name="message"
            rows={4}
            maxLength={maxMessage}
            invalid={invalid}
            aria-describedby={describedBy}
          />
        )}
      </Field>
      <div>
        <Button type="submit" pending={sending} pendingLabel="Sending…">
          {testMode ? 'Send test request' : 'Send for signature'}
        </Button>
      </div>
    </form>
  );
}
