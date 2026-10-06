'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import type { ActionState } from './actions';
import { fieldErrors, summaryOf } from '@/lib/form-errors';
import { regulatedDocumentsEnabled } from '@/lib/config/server';
import { isRegulatedDocumentKind, REGULATED_DOCUMENT_LIMITATION } from '@/lib/trade/regulated';
import {
  calendarDateField,
  countryField,
  currencyField,
  decimalField,
  grossBelowNet,
  hsCodeField,
  INCOTERMS,
} from '@/lib/trade/inputs';

const uuid = z.uuid();
const optionalText = (max: number, message?: string) =>
  z
    .string()
    .trim()
    .max(max, message ?? `Use ${max} characters or fewer.`)
    .transform((value) => value || null);

/** The most lines one shipment holds; shipment_items.position is checked to 999. */
const MAX_LINES = 999;

const DOCUMENT_KINDS = [
  'commercial_invoice',
  'proforma_invoice',
  'packing_list',
  'delivery_note',
  'certificate_of_origin',
] as const;

function read(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === 'string' ? value : '';
}

/** Whether a database error carries this routine message, so it can be shown as written. */
function says(error: { message?: string } | null | undefined, text: string): boolean {
  return Boolean(error?.message?.includes(text));
}

export async function createShipment(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({
      org: uuid,
      reference: z
        .string()
        .trim()
        .min(1, 'Enter a shipment reference.')
        .max(60, 'Use 60 characters or fewer.'),
      currency: z.union([currencyField, z.literal('')]),
    })
    .safeParse({
      org: read(formData, 'org'),
      reference: read(formData, 'reference'),
      currency: read(formData, 'currency').trim(),
    });
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    return { error: summaryOf(fields, 'Check the details.'), fields };
  }

  const client = await createClient();
  let currency = parsed.data.currency;
  if (!currency) {
    // Not stated: the organization's own default, which is EUR until someone sets one.
    const { data: settings } = await client
      .from('organization_settings')
      .select('default_currency')
      .eq('org_id', parsed.data.org)
      .maybeSingle();
    currency = settings?.default_currency ?? 'EUR';
  }

  const { data, error } = await client
    .from('shipments')
    .insert({ org_id: parsed.data.org, reference: parsed.data.reference, currency })
    .select('id')
    .single();

  if (error || !data) {
    if (error?.code === '23505') {
      const message = 'A shipment with that reference already exists.';
      return { error: message, fields: { reference: message } };
    }
    if (error?.code === '42501') {
      return { error: 'You are not a member of this organization.' };
    }
    return { error: 'That shipment could not be created. Try again.' };
  }
  revalidatePath(`/app/${parsed.data.org}/shipments`);
  redirect(`/app/${parsed.data.org}/shipments/${data.id}`);
}

/**
 * Saves the shipment's terms. When the form carries the revision it was rendered from, the
 * save only applies to that revision: if someone else changed the shipment meanwhile, this
 * save is refused instead of silently overwriting their change.
 */
export async function updateShipment(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({
      org: uuid,
      shipment: uuid,
      revision: z.union([z.literal(''), z.coerce.number().int().positive()]),
      incoterm: z.union([z.enum(INCOTERMS), z.literal('')]).transform((value) => value || null),
      incoterm_place: optionalText(160),
      port_of_loading: optionalText(160),
      port_of_discharge: optionalText(160),
      country_of_origin: countryField,
      country_of_destination: countryField,
      shipped_on: calendarDateField,
      marks_and_numbers: optionalText(2000),
    })
    .superRefine((value, context) => {
      // An Incoterms rule without its named place does not say where risk passes.
      if (value.incoterm && !value.incoterm_place) {
        context.addIssue({
          code: 'custom',
          path: ['incoterm_place'],
          message: `Name the place that goes with ${value.incoterm}, such as a port or town.`,
        });
      }
    })
    .safeParse({
      org: read(formData, 'org'),
      shipment: read(formData, 'shipment'),
      revision: read(formData, 'revision'),
      incoterm: read(formData, 'incoterm').toUpperCase(),
      incoterm_place: read(formData, 'incoterm_place'),
      port_of_loading: read(formData, 'port_of_loading'),
      port_of_discharge: read(formData, 'port_of_discharge'),
      country_of_origin: read(formData, 'country_of_origin'),
      country_of_destination: read(formData, 'country_of_destination'),
      shipped_on: read(formData, 'shipped_on'),
      marks_and_numbers: read(formData, 'marks_and_numbers'),
    });
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    return { error: summaryOf(fields, 'Check the details.'), fields };
  }

  const { org, shipment, revision, shipped_on, ...rest } = parsed.data;
  // Only sent when the form has the field, so a form without it never clears the date.
  const fields = formData.has('shipped_on') ? { ...rest, shipped_on } : rest;
  const client = await createClient();
  // Scoped to the organization in the form and read back, because a filter that matches
  // nothing is not an error to PostgREST: without the row count a shipment the caller
  // cannot see would be reported as saved.
  let query = client.from('shipments').update(fields).eq('id', shipment).eq('org_id', org);
  if (revision !== '') query = query.eq('revision', revision);
  const { data: saved, error } = await query.select('id');
  if (error) return { error: 'Those shipment details could not be saved. Try again.' };

  if (!saved?.length) {
    if (revision !== '') {
      const { data: current } = await client
        .from('shipments')
        .select('id')
        .eq('id', shipment)
        .eq('org_id', org)
        .maybeSingle();
      if (current) {
        return {
          error:
            'Someone changed this shipment after you opened it. Reload the page to see their changes, then save again.',
        };
      }
    }
    return { error: 'That shipment could not be found in this organization.' };
  }
  revalidatePath(`/app/${org}/shipments/${shipment}`);
  return { notice: 'Shipment saved. Documents generated before a change are marked stale.' };
}

export async function addItem(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = z
    .object({
      org: uuid,
      shipment: uuid,
      description: z
        .string()
        .trim()
        .min(1, 'Describe the goods.')
        .max(500, 'Use 500 characters or fewer.'),
      hs_code: hsCodeField,
      country_of_origin: countryField,
      quantity: decimalField({ label: 'quantity', places: 3, required: true, positive: true }),
      unit: z.string().trim().min(1, 'Enter a unit.').max(12, 'Use 12 characters or fewer.'),
      unit_price: decimalField({ label: 'unit price', places: 4 }),
      net_weight_kg: decimalField({ label: 'net weight', places: 3 }),
      gross_weight_kg: decimalField({ label: 'gross weight', places: 3 }),
      package_count: z
        .string()
        .trim()
        .regex(/^(\d{1,6})?$/, 'Enter a whole number of packages.')
        .transform((value) => (value === '' ? null : Number(value))),
    })
    .safeParse({
      org: read(formData, 'org'),
      shipment: read(formData, 'shipment'),
      description: read(formData, 'description'),
      hs_code: read(formData, 'hs_code'),
      country_of_origin: read(formData, 'country_of_origin'),
      quantity: read(formData, 'quantity'),
      unit: read(formData, 'unit') || 'pcs',
      unit_price: read(formData, 'unit_price'),
      net_weight_kg: read(formData, 'net_weight_kg'),
      gross_weight_kg: read(formData, 'gross_weight_kg'),
      package_count: read(formData, 'package_count'),
    });
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    return { error: summaryOf(fields, 'Check the line.'), fields };
  }

  const { org, shipment, quantity, unit_price, net_weight_kg, gross_weight_kg, ...item } =
    parsed.data;
  if (grossBelowNet(net_weight_kg, gross_weight_kg)) {
    const message = 'Gross weight cannot be less than net weight.';
    return { error: message, fields: { gross_weight_kg: message } };
  }

  const client = await createClient();
  // The next ordinal comes from the highest one in use, not from how many lines there
  // are. Counting gives the same answer only until a line is removed: delete the second
  // of three and the count says the next line is number three, which one already is.
  const { data: last } = await client
    .from('shipment_items')
    .select('position')
    .eq('shipment_id', shipment)
    .eq('org_id', org)
    .order('position', { ascending: false })
    .limit(1)
    .maybeSingle();
  const position = (last?.position ?? 0) + 1;
  if (position > MAX_LINES) {
    return { error: `A shipment holds at most ${MAX_LINES} lines. Start a second shipment.` };
  }

  const { error } = await client.from('shipment_items').insert({
    ...item,
    // Exact decimal strings from the form; JSON numbers of at most four places round-trip.
    quantity: Number(quantity),
    unit_price: unit_price === null ? 0 : Number(unit_price),
    net_weight_kg: net_weight_kg === null ? null : Number(net_weight_kg),
    gross_weight_kg: gross_weight_kg === null ? null : Number(gross_weight_kg),
    org_id: org,
    shipment_id: shipment,
    position,
  });
  if (error) {
    if (error.code === '23505') {
      return { error: 'Someone added a line at the same moment. Add yours again.' };
    }
    return { error: 'That line could not be added. Reload the shipment and try again.' };
  }
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
  const { data: removed, error } = await client
    .from('shipment_items')
    .delete()
    .eq('id', parsed.data.item)
    .eq('shipment_id', parsed.data.shipment)
    .eq('org_id', parsed.data.org)
    .select('id');
  if (error || !removed?.length) {
    return { error: 'That line could not be removed. It may already have been removed.' };
  }
  revalidatePath(`/app/${parsed.data.org}/shipments/${parsed.data.shipment}`);
  return { notice: 'Line removed.' };
}

export async function generateDocument(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z.object({ org: uuid, shipment: uuid, kind: z.enum(DOCUMENT_KINDS) }).safeParse({
    org: read(formData, 'org'),
    shipment: read(formData, 'shipment'),
    kind: read(formData, 'kind'),
  });
  if (!parsed.success) return { error: 'Choose a document type.' };
  if (isRegulatedDocumentKind(parsed.data.kind) && !regulatedDocumentsEnabled()) {
    return { error: REGULATED_DOCUMENT_LIMITATION };
  }

  const client = await createClient();
  const { data: created, error } = await client.rpc('generate_document', {
    target_shipment: parsed.data.shipment,
    document_kind: parsed.data.kind,
  });
  if (error) {
    if (says(error, 'at least one line item')) {
      return { error: 'Add at least one line before generating a document.' };
    }
    if (error.code === '42501') return { error: 'That shipment is not available to you.' };
    return { error: 'That document could not be generated. Try again.' };
  }

  // The number is what the user will quote, and whether an earlier revision was replaced
  // is what they need to know before sending it.
  const { data: document } = await client
    .from('documents')
    .select('number, supersedes_id')
    .eq('id', created)
    .maybeSingle();
  revalidatePath(`/app/${parsed.data.org}/shipments/${parsed.data.shipment}`);
  revalidatePath(`/app/${parsed.data.org}/documents`);
  if (!document) return { notice: 'Document generated.' };
  return {
    notice: document.supersedes_id
      ? `Document ${document.number} generated. The earlier revision of this type is now marked superseded.`
      : `Document ${document.number} generated.`,
  };
}

/**
 * Voids a final document, with the reason the database keeps beside it. Owners and
 * administrators only; the routine enforces that, and its refusal is shown as written.
 */
export async function voidDocument(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({
      org: uuid,
      shipment: uuid,
      document: uuid,
      reason: z
        .string()
        .trim()
        .min(3, 'Say why this document is void, such as "Issued in error".')
        .max(500, 'Use 500 characters or fewer.'),
    })
    .safeParse({
      org: read(formData, 'org'),
      shipment: read(formData, 'shipment'),
      document: read(formData, 'document'),
      reason: read(formData, 'reason'),
    });
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    return { error: summaryOf(fields, 'Check the details.'), fields };
  }

  const client = await createClient();
  const { error } = await client.rpc('void_document', {
    target_document: parsed.data.document,
    reason: parsed.data.reason,
  });
  if (error) {
    if (says(error, 'owner or administrator')) {
      return { error: 'Only an owner or administrator can void a document.' };
    }
    if (says(error, 'Only a final document')) {
      return { error: 'That document is already superseded or voided.' };
    }
    return { error: 'That document could not be voided. Try again.' };
  }
  revalidatePath(`/app/${parsed.data.org}/shipments/${parsed.data.shipment}`);
  revalidatePath(`/app/${parsed.data.org}/documents`);
  return { notice: 'Document voided. It stays in the history with your reason.' };
}

/**
 * Starts a new draft shipment from an earlier one: parties, terms, lines and packing are
 * copied, documents are not. The earlier shipment and its documents are only read.
 */
export async function duplicateShipment(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({
      org: uuid,
      shipment: uuid,
      reference: z
        .string()
        .trim()
        .min(1, 'Enter a reference for the new shipment.')
        .max(60, 'Use 60 characters or fewer.'),
    })
    .safeParse({
      org: read(formData, 'org'),
      shipment: read(formData, 'shipment'),
      reference: read(formData, 'reference'),
    });
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    return { error: summaryOf(fields, 'Check the details.'), fields };
  }

  const client = await createClient();
  const { data: created, error } = await client.rpc('duplicate_shipment', {
    source_shipment: parsed.data.shipment,
    new_reference: parsed.data.reference,
  });
  if (error || !created) {
    if (error?.code === '23505') {
      const message = 'A shipment with that reference already exists.';
      return { error: message, fields: { reference: message } };
    }
    if (error?.code === '42501') return { error: 'That shipment is not available to you.' };
    return { error: 'That shipment could not be copied. Try again.' };
  }
  revalidatePath(`/app/${parsed.data.org}/shipments`);
  redirect(`/app/${parsed.data.org}/shipments/${created}`);
}
