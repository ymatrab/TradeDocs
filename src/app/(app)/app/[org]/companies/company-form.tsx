'use client';

import { useActionState, useRef } from 'react';
import { Button } from '@/components/primitives/button';
import { Field, Input, Select, Textarea } from '@/components/primitives/form';
import { Callout } from '@/components/primitives/feedback';
import { useInvalidFocus } from '@/components/primitives/use-invalid-focus';
import { showsSummary } from '@/lib/form-errors';
import { companyKindLabels } from '@/lib/labels';
import { saveCompany } from '../../../master-data-actions';
import type { ActionState } from '../../../actions';

export type CompanyValues = {
  id?: string;
  kind: string;
  name: string;
  legal_name: string | null;
  contact_name: string | null;
  tax_number: string | null;
  registration_number: string | null;
  email: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  region: string | null;
  postal_code: string | null;
  country_code: string | null;
  notes: string | null;
};

const columns = {
  display: 'grid',
  gap: 16,
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
} as const;

/**
 * One form serves adding and editing. The party a document is addressed to is the
 * same shape either way, and two near-identical forms drift apart in exactly the
 * fields that matter least often — which is where a wrong address comes from.
 */
export function CompanyForm({ org, company }: { org: string; company?: CompanyValues }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveCompany, {});
  const form = useRef<HTMLFormElement>(null);
  useInvalidFocus(form, state.fields);

  const value = (field: keyof CompanyValues) => company?.[field] ?? undefined;

  return (
    <form ref={form} action={action} style={{ display: 'grid', gap: 20 }} noValidate>
      <input type="hidden" name="org" value={org} />
      <input type="hidden" name="company" value={company?.id ?? ''} />

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

      <div style={columns}>
        <Field id="kind" label="Kind" error={state.fields?.kind}>
          {({ id, describedBy, invalid }) => (
            <Select
              id={id}
              name="kind"
              defaultValue={company?.kind ?? 'customer'}
              invalid={invalid}
              aria-describedby={describedBy}
            >
              {Object.entries(companyKindLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field
          id="name"
          label="Trading name"
          hint="How this party is normally referred to."
          error={state.fields?.name}
        >
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="name"
              required
              maxLength={300}
              defaultValue={value('name')}
              invalid={invalid}
              aria-describedby={describedBy}
            />
          )}
        </Field>
        <Field
          id="legal_name"
          label="Registered name"
          requirement="Optional"
          hint="Used on documents where the legal entity must appear."
          error={state.fields?.legal_name}
        >
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="legal_name"
              maxLength={300}
              defaultValue={value('legal_name')}
              invalid={invalid}
              aria-describedby={describedBy}
            />
          )}
        </Field>
      </div>

      <div style={columns}>
        <Field
          id="contact_name"
          label="Contact"
          requirement="Optional"
          error={state.fields?.contact_name}
        >
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="contact_name"
              maxLength={200}
              autoComplete="off"
              defaultValue={value('contact_name')}
              invalid={invalid}
              aria-describedby={describedBy}
            />
          )}
        </Field>
        <Field id="email" label="Email" requirement="Optional" error={state.fields?.email}>
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="email"
              type="email"
              maxLength={254}
              defaultValue={value('email')}
              invalid={invalid}
              aria-describedby={describedBy}
            />
          )}
        </Field>
        <Field id="phone" label="Phone" requirement="Optional" error={state.fields?.phone}>
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="phone"
              type="tel"
              maxLength={60}
              defaultValue={value('phone')}
              invalid={invalid}
              aria-describedby={describedBy}
            />
          )}
        </Field>
      </div>

      <div style={columns}>
        <Field
          id="tax_number"
          label="Tax number"
          requirement="Optional"
          hint="VAT, GST or equivalent."
          error={state.fields?.tax_number}
        >
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="tax_number"
              maxLength={100}
              defaultValue={value('tax_number')}
              invalid={invalid}
              aria-describedby={describedBy}
              className="input data"
            />
          )}
        </Field>
        <Field
          id="registration_number"
          label="Registration number"
          requirement="Optional"
          error={state.fields?.registration_number}
        >
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="registration_number"
              maxLength={100}
              defaultValue={value('registration_number')}
              invalid={invalid}
              aria-describedby={describedBy}
              className="input data"
            />
          )}
        </Field>
      </div>

      <div style={columns}>
        <Field
          id="address_line1"
          label="Address"
          requirement="Optional"
          error={state.fields?.address_line1}
        >
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="address_line1"
              maxLength={200}
              autoComplete="off"
              defaultValue={value('address_line1')}
              invalid={invalid}
              aria-describedby={describedBy}
            />
          )}
        </Field>
        <Field
          id="address_line2"
          label="Address line 2"
          requirement="Optional"
          error={state.fields?.address_line2}
        >
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="address_line2"
              maxLength={200}
              autoComplete="off"
              defaultValue={value('address_line2')}
              invalid={invalid}
              aria-describedby={describedBy}
            />
          )}
        </Field>
      </div>

      <div style={columns}>
        <Field id="city" label="City" requirement="Optional" error={state.fields?.city}>
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="city"
              maxLength={120}
              defaultValue={value('city')}
              invalid={invalid}
              aria-describedby={describedBy}
            />
          )}
        </Field>
        <Field
          id="region"
          label="Region or state"
          requirement="Optional"
          error={state.fields?.region}
        >
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="region"
              maxLength={120}
              defaultValue={value('region')}
              invalid={invalid}
              aria-describedby={describedBy}
            />
          )}
        </Field>
        <Field
          id="postal_code"
          label="Postal code"
          requirement="Optional"
          error={state.fields?.postal_code}
        >
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="postal_code"
              maxLength={40}
              defaultValue={value('postal_code')}
              invalid={invalid}
              aria-describedby={describedBy}
              className="input data"
            />
          )}
        </Field>
        <Field
          id="country_code"
          label="Country"
          requirement="Optional"
          hint="Two-letter code, such as DE."
          error={state.fields?.country_code}
        >
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="country_code"
              maxLength={2}
              defaultValue={value('country_code')}
              invalid={invalid}
              aria-describedby={describedBy}
              className="input data"
              style={{ textTransform: 'uppercase' }}
            />
          )}
        </Field>
      </div>

      <Field
        id="notes"
        label="Internal notes"
        requirement="Optional"
        hint="For your team. Never printed on a document."
        error={state.fields?.notes}
      >
        {({ id, describedBy, invalid }) => (
          <Textarea
            id={id}
            name="notes"
            rows={3}
            maxLength={2000}
            defaultValue={value('notes')}
            invalid={invalid}
            aria-describedby={describedBy}
          />
        )}
      </Field>

      <div>
        <Button type="submit" pending={pending} pendingLabel="Saving…">
          {company ? 'Save changes' : 'Add company'}
        </Button>
      </div>
    </form>
  );
}
