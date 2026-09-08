'use client';

import { useActionState, useRef } from 'react';
import { Button } from '@/components/primitives/button';
import { Combobox, Field, Input, Textarea } from '@/components/primitives/form';
import { Callout } from '@/components/primitives/feedback';
import { useInvalidFocus } from '@/components/primitives/use-invalid-focus';
import { showsSummary } from '@/lib/form-errors';
import { saveProduct } from '../../../master-data-actions';
import type { ActionState } from '../../../actions';

export type ProductValues = {
  id?: string;
  sku: string | null;
  description: string;
  hs_code: string | null;
  country_of_origin: string | null;
  unit: string;
  unit_price: number;
  currency: string | null;
  net_weight_kg: number | null;
  gross_weight_kg: number | null;
  package_kind: string | null;
  notes: string | null;
};

/** The units a trade line is actually measured in, offered but not enforced. */
const UNITS = ['pcs', 'kg', 'g', 'l', 'ml', 'm', 'm2', 'm3', 'box', 'ctn', 'pal', 'set', 'pr'];
const PACKAGE_KINDS = ['carton', 'pallet', 'crate', 'drum', 'bag', 'roll', 'bundle', 'case'];

const columns = {
  display: 'grid',
  gap: 16,
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
} as const;

/** A number reaches the input as text, and an absent number as an empty field. */
function text(value: number | null | undefined): string | undefined {
  return value === null || value === undefined ? undefined : String(value);
}

export function ProductForm({ org, product }: { org: string; product?: ProductValues }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveProduct, {});
  const form = useRef<HTMLFormElement>(null);
  useInvalidFocus(form, state.fields);

  return (
    <form ref={form} action={action} style={{ display: 'grid', gap: 20 }} noValidate>
      <input type="hidden" name="org" value={org} />
      <input type="hidden" name="product" value={product?.id ?? ''} />

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
        <Field
          id="sku"
          label="Product code"
          requirement="Optional"
          hint="Your own article number, if you use one."
          error={state.fields?.sku}
        >
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="sku"
              maxLength={60}
              defaultValue={product?.sku ?? undefined}
              invalid={invalid}
              aria-describedby={describedBy}
              className="input data"
            />
          )}
        </Field>
        <Field
          id="hs_code"
          label="HS code"
          requirement="Optional"
          hint="6 to 10 digits. Your declaration, not a classification we verify."
          error={state.fields?.hs_code}
        >
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="hs_code"
              inputMode="numeric"
              maxLength={10}
              defaultValue={product?.hs_code ?? undefined}
              invalid={invalid}
              aria-describedby={describedBy}
              className="input data"
            />
          )}
        </Field>
        <Field
          id="country_of_origin"
          label="Country of origin"
          requirement="Optional"
          hint="Two-letter code."
          error={state.fields?.country_of_origin}
        >
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="country_of_origin"
              maxLength={2}
              defaultValue={product?.country_of_origin ?? undefined}
              invalid={invalid}
              aria-describedby={describedBy}
              className="input data"
              style={{ textTransform: 'uppercase' }}
            />
          )}
        </Field>
      </div>

      <Field
        id="description"
        label="Description"
        hint="The wording that will appear on the document line."
        error={state.fields?.description}
      >
        {({ id, describedBy, invalid }) => (
          <Textarea
            id={id}
            name="description"
            required
            rows={2}
            maxLength={500}
            defaultValue={product?.description}
            invalid={invalid}
            aria-describedby={describedBy}
          />
        )}
      </Field>

      <div style={columns}>
        <Field id="unit" label="Unit" error={state.fields?.unit}>
          {({ id, describedBy, invalid }) => (
            <Combobox
              id={id}
              name="unit"
              options={UNITS}
              maxLength={12}
              defaultValue={product?.unit ?? 'pcs'}
              invalid={invalid}
              aria-describedby={describedBy}
            />
          )}
        </Field>
        <Field id="unit_price" label="Unit price" error={state.fields?.unit_price}>
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="unit_price"
              inputMode="decimal"
              defaultValue={text(product?.unit_price)}
              invalid={invalid}
              aria-describedby={describedBy}
              className="input data numeric"
            />
          )}
        </Field>
        <Field
          id="currency"
          label="Price currency"
          requirement="Optional"
          hint="Leave blank to use each shipment's currency."
          error={state.fields?.currency}
        >
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="currency"
              maxLength={3}
              defaultValue={product?.currency ?? undefined}
              invalid={invalid}
              aria-describedby={describedBy}
              className="input data"
              style={{ textTransform: 'uppercase' }}
            />
          )}
        </Field>
      </div>

      <div style={columns}>
        <Field
          id="net_weight_kg"
          label="Net weight"
          requirement="Optional"
          hint="Kilograms per unit."
          error={state.fields?.net_weight_kg}
        >
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="net_weight_kg"
              inputMode="decimal"
              defaultValue={text(product?.net_weight_kg)}
              invalid={invalid}
              aria-describedby={describedBy}
              className="input data numeric"
            />
          )}
        </Field>
        <Field
          id="gross_weight_kg"
          label="Gross weight"
          requirement="Optional"
          hint="Kilograms per unit, packed."
          error={state.fields?.gross_weight_kg}
        >
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="gross_weight_kg"
              inputMode="decimal"
              defaultValue={text(product?.gross_weight_kg)}
              invalid={invalid}
              aria-describedby={describedBy}
              className="input data numeric"
            />
          )}
        </Field>
        <Field
          id="package_kind"
          label="Usually packed as"
          requirement="Optional"
          error={state.fields?.package_kind}
        >
          {({ id, describedBy, invalid }) => (
            <Combobox
              id={id}
              name="package_kind"
              options={PACKAGE_KINDS}
              maxLength={40}
              defaultValue={product?.package_kind ?? undefined}
              invalid={invalid}
              aria-describedby={describedBy}
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
            defaultValue={product?.notes ?? undefined}
            invalid={invalid}
            aria-describedby={describedBy}
          />
        )}
      </Field>

      <div>
        <Button type="submit" pending={pending} pendingLabel="Saving…">
          {product ? 'Save changes' : 'Add product'}
        </Button>
      </div>
    </form>
  );
}
