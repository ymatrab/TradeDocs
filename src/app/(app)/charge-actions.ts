'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import type { ActionState } from './actions';
import { fieldErrors, summaryOf } from '@/lib/form-errors';
import { CHARGE_KINDS, MAX_CHARGES } from '@/lib/trade/charges';
import { decimalField } from '@/lib/trade/inputs';

/**
 * An invoice's charges and discounts (D-029, 19 CFR 141.86(a)(8) and (g)): freight,
 * insurance, packing, commission, other and discount, each named with an amount, and whether
 * it is already included in the line prices. public.shipment_charges holds them; a change
 * advances the shipment's revision, so an invoice issued before it goes stale.
 */

const uuid = z.uuid();

function read(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === 'string' ? value : '';
}

export async function addCharge(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = z
    .object({
      org: uuid,
      shipment: uuid,
      kind: z.enum(CHARGE_KINDS, { message: 'Choose what the charge is for.' }),
      label: z
        .string()
        .trim()
        .max(80, 'Use 80 characters or fewer.')
        .transform((value) => value || null),
      amount: decimalField({ label: 'amount', places: 3, required: true, positive: true }),
      included_in_price: z.boolean(),
    })
    .superRefine((value, context) => {
      if (value.kind === 'other' && !value.label) {
        context.addIssue({
          code: 'custom',
          path: ['label'],
          message: 'Say what the other charge is for.',
        });
      }
      if (value.amount !== null && Number(value.amount) >= 100_000_000_000) {
        context.addIssue({ code: 'custom', path: ['amount'], message: 'Enter a smaller amount.' });
      }
    })
    .safeParse({
      org: read(formData, 'org'),
      shipment: read(formData, 'shipment'),
      kind: read(formData, 'kind'),
      label: read(formData, 'label'),
      amount: read(formData, 'amount'),
      included_in_price: read(formData, 'included_in_price') === 'on',
    });
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    return { error: summaryOf(fields, 'Check the charge.'), fields };
  }

  const { org, shipment, kind, label, amount, included_in_price } = parsed.data;
  const client = await createClient();
  // The next ordinal comes from the highest in use, as for lines (see addItem).
  const { data: last } = await client
    .from('shipment_charges')
    .select('position')
    .eq('shipment_id', shipment)
    .eq('org_id', org)
    .order('position', { ascending: false })
    .limit(1)
    .maybeSingle();
  const position = (last?.position ?? 0) + 1;
  if (position > MAX_CHARGES) {
    return { error: `A shipment holds at most ${MAX_CHARGES} charges and discounts.` };
  }

  const { error } = await client.from('shipment_charges').insert({
    org_id: org,
    shipment_id: shipment,
    position,
    kind,
    // A named kind prints its own name; only "other" carries a label.
    label: kind === 'other' ? label : null,
    amount: Number(amount),
    included_in_price,
  });
  if (error) {
    if (error.code === '23505') {
      return { error: 'Someone added a charge at the same moment. Add yours again.' };
    }
    if (error.code === '42501') return { error: 'You are not a member of this organization.' };
    return { error: 'That charge could not be added. Reload the shipment and try again.' };
  }
  revalidatePath(`/app/${org}/shipments/${shipment}`);
  return { notice: kind === 'discount' ? 'Discount added.' : 'Charge added.' };
}

export async function removeCharge(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z.object({ org: uuid, shipment: uuid, charge: uuid }).safeParse({
    org: read(formData, 'org'),
    shipment: read(formData, 'shipment'),
    charge: read(formData, 'charge'),
  });
  if (!parsed.success) return { error: 'Check the charge.' };

  const client = await createClient();
  const { data: removed, error } = await client
    .from('shipment_charges')
    .delete()
    .eq('id', parsed.data.charge)
    .eq('shipment_id', parsed.data.shipment)
    .eq('org_id', parsed.data.org)
    .select('id');
  if (error || !removed?.length) {
    return { error: 'That charge could not be removed. It may already have been removed.' };
  }
  revalidatePath(`/app/${parsed.data.org}/shipments/${parsed.data.shipment}`);
  return { notice: 'Charge removed.' };
}
