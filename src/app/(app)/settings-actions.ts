'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { fieldErrors, summaryOf } from '@/lib/form-errors';
import { currencyField } from '@/lib/trade/inputs';
import type { ActionState } from './actions';

const text = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Use ${max} characters or fewer.`)
    .transform((value) => value || null);

function read(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === 'string' ? value : '';
}

/**
 * What every document an organization generates says about its issuer: payment terms and
 * bank details on invoices, a signatory and a note on every type, the prefix on every
 * number and the currency a new shipment starts in.
 *
 * Owners and administrators only. The row policy decides; this action reports its refusal.
 * A change applies to documents generated from now on. Documents already generated keep
 * what they said, and the workspace marks them stale so they can be re-issued.
 */
export async function saveDocumentSettings(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({
      org: z.uuid(),
      default_currency: currencyField,
      number_prefix: z
        .string()
        .trim()
        .toUpperCase()
        .regex(/^([A-Z0-9]{1,10})?$/, 'Use up to 10 capital letters or digits, such as ACME.')
        .transform((value) => value || null),
      payment_terms: text(500),
      bank_details: text(1000),
      signatory_name: text(120),
      signatory_title: text(120),
      document_notes: text(1000),
    })
    .safeParse({
      org: read(formData, 'org'),
      default_currency: read(formData, 'default_currency') || 'EUR',
      number_prefix: read(formData, 'number_prefix'),
      payment_terms: read(formData, 'payment_terms'),
      bank_details: read(formData, 'bank_details'),
      signatory_name: read(formData, 'signatory_name'),
      signatory_title: read(formData, 'signatory_title'),
      document_notes: read(formData, 'document_notes'),
    });
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    return { error: summaryOf(fields, 'Check the settings.'), fields };
  }

  const { org, ...values } = parsed.data;
  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return { error: 'Sign in again, then retry.' };

  const { data: saved, error } = await client
    .from('organization_settings')
    .upsert({ org_id: org, ...values, updated_by: user.id }, { onConflict: 'org_id' })
    .select('org_id');
  if (error?.code === '42501' || (!error && !saved?.length)) {
    return { error: 'Only an owner or administrator can change document settings.' };
  }
  if (error) return { error: 'Those settings could not be saved. Try again.' };

  revalidatePath(`/app/${org}/settings`);
  return {
    notice:
      'Settings saved. Documents generated from now on use them; earlier documents keep what they said.',
  };
}
