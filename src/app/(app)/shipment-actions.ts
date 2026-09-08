'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import type { ActionState } from './actions';
import { fieldErrors, summaryOf } from '@/lib/form-errors';

const uuid = z.uuid();
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => value || null)
    .nullable()
    .optional();

function read(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === 'string' ? value : '';
}

export async function createShipment(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({
      org: uuid,
      reference: z.string().trim().min(1, 'Enter a shipment reference.').max(60),
      currency: z
        .string()
        .trim()
        .toUpperCase()
        .regex(/^[A-Z]{3}$/, 'Use a three-letter currency code, such as EUR.'),
    })
    .safeParse({
      org: read(formData, 'org'),
      reference: read(formData, 'reference'),
      currency: read(formData, 'currency') || 'EUR',
    });
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    return { error: summaryOf(fields, 'Check the details.'), fields };
  }

  const client = await createClient();
  const { data, error } = await client
    .from('shipments')
    .insert({
      org_id: parsed.data.org,
      reference: parsed.data.reference,
      currency: parsed.data.currency,
    })
    .select('id')
    .single();

  if (error || !data) {
    if (error?.code === '23505') {
      const message = 'A shipment with that reference already exists.';
      return { error: message, fields: { reference: message } };
    }
    return { error: 'That shipment could not be created.' };
  }
  revalidatePath(`/app/${parsed.data.org}/shipments`);
  redirect(`/app/${parsed.data.org}/shipments/${data.id}`);
}

export async function updateShipment(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({
      org: uuid,
      shipment: uuid,
      incoterm: optionalText(4),
      incoterm_place: optionalText(160),
      port_of_loading: optionalText(160),
      port_of_discharge: optionalText(160),
      country_of_origin: optionalText(2),
      country_of_destination: optionalText(2),
      marks_and_numbers: optionalText(2000),
    })
    .safeParse({
      org: read(formData, 'org'),
      shipment: read(formData, 'shipment'),
      incoterm: read(formData, 'incoterm'),
      incoterm_place: read(formData, 'incoterm_place'),
      port_of_loading: read(formData, 'port_of_loading'),
      port_of_discharge: read(formData, 'port_of_discharge'),
      country_of_origin: read(formData, 'country_of_origin').toUpperCase(),
      country_of_destination: read(formData, 'country_of_destination').toUpperCase(),
      marks_and_numbers: read(formData, 'marks_and_numbers'),
    });
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    return { error: summaryOf(fields, 'Check the details.'), fields };
  }

  const { org, shipment, ...fields } = parsed.data;
  const client = await createClient();
  const { error } = await client.from('shipments').update(fields).eq('id', shipment);
  if (error) return { error: 'Those shipment details could not be saved.' };
  revalidatePath(`/app/${org}/shipments/${shipment}`);
  return { notice: 'Shipment saved. Documents generated before now are marked stale.' };
}

export async function addItem(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = z
    .object({
      org: uuid,
      shipment: uuid,
      description: z.string().trim().min(1, 'Describe the goods.').max(500),
      hs_code: z
        .string()
        .trim()
        .regex(/^([0-9]{6,10})?$/, 'An HS code is 6 to 10 digits.')
        .transform((value) => value || null),
      country_of_origin: z
        .string()
        .trim()
        .toUpperCase()
        .regex(/^([A-Z]{2})?$/, 'Use a two-letter country code.')
        .transform((value) => value || null),
      quantity: z.coerce.number().positive('Enter a quantity greater than zero.'),
      unit: z.string().trim().min(1).max(12),
      unit_price: z.coerce.number().min(0, 'A unit price cannot be negative.'),
      net_weight_kg: z.coerce.number().min(0).optional(),
      gross_weight_kg: z.coerce.number().min(0).optional(),
      package_count: z.coerce.number().int().min(0).optional(),
    })
    .safeParse({
      org: read(formData, 'org'),
      shipment: read(formData, 'shipment'),
      description: read(formData, 'description'),
      hs_code: read(formData, 'hs_code'),
      country_of_origin: read(formData, 'country_of_origin'),
      quantity: read(formData, 'quantity'),
      unit: read(formData, 'unit') || 'pcs',
      unit_price: read(formData, 'unit_price') || '0',
      net_weight_kg: read(formData, 'net_weight_kg') || undefined,
      gross_weight_kg: read(formData, 'gross_weight_kg') || undefined,
      package_count: read(formData, 'package_count') || undefined,
    });
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    return { error: summaryOf(fields, 'Check the line.'), fields };
  }

  const { org, shipment, ...item } = parsed.data;
  const client = await createClient();
  // The next ordinal comes from the highest one in use, not from how many lines there
  // are. Counting gives the same answer only until a line is removed: delete the second
  // of three and the count says the next line is number three, which one already is.
  const { data: last } = await client
    .from('shipment_items')
    .select('position')
    .eq('shipment_id', shipment)
    .order('position', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await client
    .from('shipment_items')
    .insert({ ...item, org_id: org, shipment_id: shipment, position: (last?.position ?? 0) + 1 });
  if (error) return { error: 'That line could not be added.' };
  revalidatePath(`/app/${org}/shipments/${shipment}`);
  return { notice: 'Line added.' };
}

export async function removeItem(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = z.object({ org: uuid, shipment: uuid, item: uuid }).safeParse({
    org: read(formData, 'org'),
    shipment: read(formData, 'shipment'),
    item: read(formData, 'item'),
  });
  if (!parsed.success) return { error: 'Check the line.' };

  const client = await createClient();
  const { error } = await client.from('shipment_items').delete().eq('id', parsed.data.item);
  if (error) return { error: 'That line could not be removed.' };
  revalidatePath(`/app/${parsed.data.org}/shipments/${parsed.data.shipment}`);
  return { notice: 'Line removed.' };
}

export async function generateDocument(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({
      org: uuid,
      shipment: uuid,
      kind: z.enum([
        'commercial_invoice',
        'proforma_invoice',
        'packing_list',
        'delivery_note',
        'certificate_of_origin',
      ]),
    })
    .safeParse({
      org: read(formData, 'org'),
      shipment: read(formData, 'shipment'),
      kind: read(formData, 'kind'),
    });
  if (!parsed.success) return { error: 'Choose a document type.' };

  const client = await createClient();
  const { error } = await client.rpc('generate_document', {
    target_shipment: parsed.data.shipment,
    document_kind: parsed.data.kind,
  });
  if (error) {
    return {
      error: error.message.includes('at least one line item')
        ? 'Add at least one line before generating a document.'
        : 'That document could not be generated.',
    };
  }
  revalidatePath(`/app/${parsed.data.org}/shipments/${parsed.data.shipment}`);
  return { notice: 'Document generated.' };
}
