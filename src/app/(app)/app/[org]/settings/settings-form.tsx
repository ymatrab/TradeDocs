'use client';

import { useActionState, useRef } from 'react';
import { Button } from '@/components/primitives/button';
import { Field, Input, Textarea } from '@/components/primitives/form';
import { ActionResult } from '@/components/primitives/action-result';
import { useInvalidFocus } from '@/components/primitives/use-invalid-focus';
import { saveDocumentSettings } from '@/app/(app)/settings-actions';
import type { ActionState } from '@/app/(app)/actions';

export type DocumentSettings = {
  default_currency: string;
  number_prefix: string | null;
  payment_terms: string | null;
  bank_details: string | null;
  signatory_name: string | null;
  signatory_title: string | null;
  document_notes: string | null;
};

export function SettingsForm({
  org,
  settings,
  canManage,
}: {
  org: string;
  settings: DocumentSettings;
  canManage: boolean;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    saveDocumentSettings,
    {},
  );
  const form = useRef<HTMLFormElement>(null);
  useInvalidFocus(form, state.fields);

  return (
    <form ref={form} action={action} style={{ display: 'grid', gap: 16 }} noValidate>
      <input type="hidden" name="org" value={org} />
      <ActionResult state={state} successTitle="Saved" />
      <fieldset disabled={!canManage} style={{ display: 'grid', gap: 16, border: 0, padding: 0 }}>
        <div
          style={{
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          }}
        >
          <Field
            id="default_currency"
            label="Default currency"
            hint="New shipments start in this currency."
            error={state.fields?.default_currency}
          >
            {({ id, describedBy, invalid }) => (
              <Input
                id={id}
                name="default_currency"
                maxLength={3}
                defaultValue={settings.default_currency}
                invalid={invalid}
                aria-describedby={describedBy}
              />
            )}
          </Field>
          <Field
            id="number_prefix"
            label="Number prefix"
            requirement="Optional"
            hint="Placed before every document number, such as ACME-CI-2026-0001."
            error={state.fields?.number_prefix}
          >
            {({ id, describedBy, invalid }) => (
              <Input
                id={id}
                name="number_prefix"
                maxLength={10}
                defaultValue={settings.number_prefix ?? ''}
                invalid={invalid}
                aria-describedby={describedBy}
              />
            )}
          </Field>
        </div>
        <Field
          id="payment_terms"
          label="Payment terms"
          requirement="Optional"
          hint="Printed on commercial and proforma invoices, such as “30 days net from invoice date”."
          error={state.fields?.payment_terms}
        >
          {({ id, describedBy, invalid }) => (
            <Textarea
              id={id}
              name="payment_terms"
              rows={2}
              maxLength={500}
              defaultValue={settings.payment_terms ?? ''}
              invalid={invalid}
              aria-describedby={describedBy}
            />
          )}
        </Field>
        <Field
          id="bank_details"
          label="Bank details"
          requirement="Optional"
          hint="Printed on invoices. Check them carefully: a wrong account number on an invoice is paid to the wrong account."
          error={state.fields?.bank_details}
        >
          {({ id, describedBy, invalid }) => (
            <Textarea
              id={id}
              name="bank_details"
              rows={4}
              maxLength={1000}
              defaultValue={settings.bank_details ?? ''}
              invalid={invalid}
              aria-describedby={describedBy}
            />
          )}
        </Field>
        <div
          style={{
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          }}
        >
          <Field
            id="signatory_name"
            label="Signatory name"
            requirement="Optional"
            hint="Printed under a signature line on every document."
            error={state.fields?.signatory_name}
          >
            {({ id, describedBy, invalid }) => (
              <Input
                id={id}
                name="signatory_name"
                maxLength={120}
                defaultValue={settings.signatory_name ?? ''}
                invalid={invalid}
                aria-describedby={describedBy}
              />
            )}
          </Field>
          <Field
            id="signatory_title"
            label="Signatory title"
            requirement="Optional"
            error={state.fields?.signatory_title}
          >
            {({ id, invalid }) => (
              <Input
                id={id}
                name="signatory_title"
                maxLength={120}
                defaultValue={settings.signatory_title ?? ''}
                invalid={invalid}
              />
            )}
          </Field>
        </div>
        <Field
          id="document_notes"
          label="Document note"
          requirement="Optional"
          hint="A short note printed on every document, such as a returns address."
          error={state.fields?.document_notes}
        >
          {({ id, describedBy, invalid }) => (
            <Textarea
              id={id}
              name="document_notes"
              rows={2}
              maxLength={1000}
              defaultValue={settings.document_notes ?? ''}
              invalid={invalid}
              aria-describedby={describedBy}
            />
          )}
        </Field>
        <div>
          <Button type="submit" pending={pending} pendingLabel="Saving…">
            Save settings
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
