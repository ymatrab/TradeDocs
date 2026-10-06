'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { fieldErrors, summaryOf } from '@/lib/form-errors';
import { parseCatalog, readDecimal, type ImportRow } from '@/lib/csv';
import { MAX_IMPORT_ROWS } from '@/lib/limits';
import { countryField, decimalField, grossBelowNet, hsCodeField } from '@/lib/trade/inputs';
import type { ActionState } from './actions';

const uuid = z.uuid();

function read(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === 'string' ? value : '';
}

/** Empty means "not stated", which is a null column rather than an empty string. */
const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => value || null);

const countryCode = countryField;
const hsCode = hsCodeField;

/** Whether a database error carries this routine message. */
function says(error: { message?: string } | null | undefined, text: string): boolean {
  return Boolean(error?.message?.includes(text));
}

// ---------------------------------------------------------------------------
// Companies
// ---------------------------------------------------------------------------

const companyShape = z.object({
  org: uuid,
  company: z.union([uuid, z.literal('')]),
  kind: z.enum(['own', 'customer', 'supplier']),
  name: z.string().trim().min(1, 'Enter a name.').max(300),
  legal_name: optional(300),
  contact_name: optional(200),
  tax_number: optional(100),
  registration_number: optional(100),
  email: z
    .string()
    .trim()
    .max(254)
    .refine((value) => value === '' || z.email().safeParse(value).success, 'Enter a valid email.')
    .transform((value) => value || null),
  phone: optional(60),
  address_line1: optional(200),
  address_line2: optional(200),
  city: optional(120),
  region: optional(120),
  postal_code: optional(40),
  country_code: countryCode,
  notes: optional(2000),
});

function companyFrom(formData: FormData) {
  return companyShape.safeParse({
    org: read(formData, 'org'),
    company: read(formData, 'company'),
    kind: read(formData, 'kind') || 'customer',
    name: read(formData, 'name'),
    legal_name: read(formData, 'legal_name'),
    contact_name: read(formData, 'contact_name'),
    tax_number: read(formData, 'tax_number'),
    registration_number: read(formData, 'registration_number'),
    email: read(formData, 'email'),
    phone: read(formData, 'phone'),
    address_line1: read(formData, 'address_line1'),
    address_line2: read(formData, 'address_line2'),
    city: read(formData, 'city'),
    region: read(formData, 'region'),
    postal_code: read(formData, 'postal_code'),
    country_code: read(formData, 'country_code'),
    notes: read(formData, 'notes'),
  });
}

export async function saveCompany(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = companyFrom(formData);
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    return { error: summaryOf(fields, 'Check the details.'), fields };
  }

  const { org, company, ...values } = parsed.data;
  const client = await createClient();

  if (company) {
    // Read back: an update the row policy filters out is not an error to PostgREST.
    const { data: saved, error } = await client
      .from('companies')
      .update(values)
      .eq('id', company)
      .eq('org_id', org)
      .select('id');
    if (error) return { error: 'Those details could not be saved. Try again.' };
    if (!saved?.length) return { error: 'That company could not be found in this organization.' };
    revalidatePath(`/app/${org}/companies/${company}`);
    revalidatePath(`/app/${org}/companies`);
    return { notice: 'Saved.' };
  }

  const { data, error } = await client
    .from('companies')
    .insert({ ...values, org_id: org })
    .select('id')
    .single();
  if (error || !data) {
    if (error?.code === '42501') return { error: 'You are not a member of this organization.' };
    return { error: 'That company could not be added. Try again.' };
  }
  revalidatePath(`/app/${org}/companies`);
  redirect(`/app/${org}/companies/${data.id}`);
}

export async function setCompanyArchived(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({ org: uuid, company: uuid, archived: z.enum(['true', 'false']) })
    .safeParse({
      org: read(formData, 'org'),
      company: read(formData, 'company'),
      archived: read(formData, 'archived'),
    });
  if (!parsed.success) return { error: 'That company could not be found.' };

  const archiving = parsed.data.archived === 'true';
  const client = await createClient();
  const { data: changed, error } = await client
    .from('companies')
    .update({ archived_at: archiving ? new Date().toISOString() : null })
    .eq('id', parsed.data.company)
    .eq('org_id', parsed.data.org)
    .select('id');
  if (error) return { error: 'That change could not be saved. Try again.' };
  if (!changed?.length) return { error: 'That company could not be found in this organization.' };

  revalidatePath(`/app/${parsed.data.org}/companies`);
  revalidatePath(`/app/${parsed.data.org}/companies/${parsed.data.company}`);
  return {
    notice: archiving
      ? 'Archived. Documents that already reference it are unchanged.'
      : 'Restored to the active list.',
  };
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

const productShape = z.object({
  org: uuid,
  product: z.union([uuid, z.literal('')]),
  sku: optional(60),
  description: z.string().trim().min(1, 'Describe the goods.').max(500),
  hs_code: hsCode,
  country_of_origin: countryCode,
  unit: z.string().trim().min(1).max(12),
  unit_price: decimalField({ label: 'unit price', places: 4 }),
  currency: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^([A-Z]{3})?$/, 'Use a three-letter currency code.')
    .transform((value) => value || null),
  net_weight_kg: decimalField({ label: 'net weight', places: 3 }),
  gross_weight_kg: decimalField({ label: 'gross weight', places: 3 }),
  package_kind: optional(40),
  notes: optional(2000),
});

export async function saveProduct(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = productShape.safeParse({
    org: read(formData, 'org'),
    product: read(formData, 'product'),
    sku: read(formData, 'sku'),
    description: read(formData, 'description'),
    hs_code: read(formData, 'hs_code'),
    country_of_origin: read(formData, 'country_of_origin'),
    unit: read(formData, 'unit') || 'pcs',
    unit_price: read(formData, 'unit_price'),
    currency: read(formData, 'currency'),
    net_weight_kg: read(formData, 'net_weight_kg'),
    gross_weight_kg: read(formData, 'gross_weight_kg'),
    package_kind: read(formData, 'package_kind'),
    notes: read(formData, 'notes'),
  });
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    return { error: summaryOf(fields, 'Check the details.'), fields };
  }

  const { org, product, unit_price, net_weight_kg, gross_weight_kg, ...rest } = parsed.data;
  if (grossBelowNet(net_weight_kg, gross_weight_kg)) {
    const message = 'Gross weight cannot be less than net weight.';
    return { error: message, fields: { gross_weight_kg: message } };
  }

  const values = {
    ...rest,
    unit_price: unit_price === null ? 0 : Number(unit_price),
    net_weight_kg: net_weight_kg === null ? null : Number(net_weight_kg),
    gross_weight_kg: gross_weight_kg === null ? null : Number(gross_weight_kg),
  };
  const client = await createClient();

  if (product) {
    const { data: saved, error } = await client
      .from('products')
      .update(values)
      .eq('id', product)
      .eq('org_id', org)
      .select('id');
    if (error) {
      if (error.code === '23505') {
        const message = 'Another active product already uses that code.';
        return { error: message, fields: { sku: message } };
      }
      return { error: 'Those details could not be saved. Try again.' };
    }
    if (!saved?.length) return { error: 'That product could not be found in this organization.' };
    revalidatePath(`/app/${org}/products/${product}`);
    revalidatePath(`/app/${org}/products`);
    return { notice: 'Saved. Lines already added to a shipment keep their own values.' };
  }

  const { data, error } = await client
    .from('products')
    .insert({ ...values, org_id: org })
    .select('id')
    .single();
  if (error || !data) {
    if (error?.code === '23505') {
      const message = 'Another active product already uses that code.';
      return { error: message, fields: { sku: message } };
    }
    return { error: 'That product could not be added.' };
  }
  revalidatePath(`/app/${org}/products`);
  redirect(`/app/${org}/products/${data.id}`);
}

export async function setProductArchived(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({ org: uuid, product: uuid, archived: z.enum(['true', 'false']) })
    .safeParse({
      org: read(formData, 'org'),
      product: read(formData, 'product'),
      archived: read(formData, 'archived'),
    });
  if (!parsed.success) return { error: 'That product could not be found.' };

  const archiving = parsed.data.archived === 'true';
  const client = await createClient();
  const { data: changed, error } = await client
    .from('products')
    .update({ archived_at: archiving ? new Date().toISOString() : null })
    .eq('id', parsed.data.product)
    .eq('org_id', parsed.data.org)
    .select('id');
  if (error) {
    if (error.code === '23505') {
      return {
        error: 'Another active product already uses this code. Change one of them, then restore.',
      };
    }
    return { error: 'That change could not be saved. Try again.' };
  }
  if (!changed?.length) return { error: 'That product could not be found in this organization.' };

  revalidatePath(`/app/${parsed.data.org}/products`);
  revalidatePath(`/app/${parsed.data.org}/products/${parsed.data.product}`);
  return {
    notice: archiving
      ? 'Archived. It stays out of the picker; past documents are unchanged.'
      : 'Restored to the catalog.',
  };
}

/** The problems the import routine reports, keyed to the line in the user's own file. */
export type ImportProblem = { row: number; problem: string };

export type ImportState = ActionState & {
  problems?: ImportProblem[];
  ignored?: string[];
  imported?: { inserted: number; updated: number };
  /** Set by "Check the file": what an import would do. Nothing was written. */
  previewed?: { inserted: number; updated: number };
  /**
   * The text that was checked, returned so it is still in the form for the import that
   * follows: a form action resets its fields, and a chosen file cannot be restored.
   */
  checked?: string;
};

export async function importCatalog(
  _previous: ImportState,
  formData: FormData,
): Promise<ImportState> {
  const org = uuid.safeParse(read(formData, 'org'));
  if (!org.success) return { error: 'That organization could not be found.' };
  // "Check the file" validates and counts without writing anything.
  const preview = read(formData, 'intent') === 'preview';

  const upload = formData.get('file');
  const pasted = read(formData, 'text');
  if (upload instanceof File && upload.size > 2_000_000) {
    return { error: 'That file is larger than 2 MB. Split it and import in parts.' };
  }
  const source =
    upload instanceof File && upload.size > 0 ? await upload.text() : pasted.trim() ? pasted : '';

  if (!source) {
    const message = 'Choose a CSV file or paste its rows.';
    return { error: message, fields: { text: message } };
  }
  if (source.length > 2_000_000) {
    return { error: 'That file is larger than 2 MB. Split it and import in parts.' };
  }

  const { rows, ignored, missingDescription } = parseCatalog(source);
  if (missingDescription) {
    return {
      error:
        'No description column was found. The file needs a heading row with at least a description column.',
      ignored,
    };
  }
  if (rows.length === 0) {
    return { error: 'That file has a heading row but no products under it.', ignored };
  }
  if (rows.length > MAX_IMPORT_ROWS) {
    return {
      error: `That file has ${rows.length} products. Import at most ${MAX_IMPORT_ROWS} at a time.`,
      ignored,
    };
  }

  const client = await createClient();
  const { data, error } = await client.rpc('import_products', {
    target_org: org.data,
    rows: rows.map(normalizeRow),
    dry_run: preview,
  });

  if (error) {
    const problems = readProblems(error.details);
    if (problems) {
      return {
        error: `Nothing was imported. ${problems.length} ${problems.length === 1 ? 'row needs' : 'rows need'} correcting first.`,
        problems,
        ignored,
      };
    }
    if (error.code === '42501') return { error: 'You are not a member of this organization.' };
    return { error: 'That catalog could not be imported. Nothing was changed.', ignored };
  }

  const result = readImportResult(data);
  if (!result) return { error: 'That catalog could not be imported. Nothing was changed.' };

  if (preview) {
    if (result.problems.length > 0) {
      return {
        error: `${result.problems.length} ${result.problems.length === 1 ? 'row needs' : 'rows need'} correcting before this file can be imported.`,
        problems: result.problems,
        ignored,
        checked: source,
      };
    }
    return {
      notice: `The file is ready: ${result.inserted} new ${result.inserted === 1 ? 'product' : 'products'} and ${result.updated} to update. Nothing has been written yet.`,
      previewed: { inserted: result.inserted, updated: result.updated },
      ignored,
      checked: source,
    };
  }

  revalidatePath(`/app/${org.data}/products`);
  return {
    notice: `Imported ${result.inserted} new ${result.inserted === 1 ? 'product' : 'products'} and updated ${result.updated}.`,
    imported: { inserted: result.inserted, updated: result.updated },
    ignored,
  };
}

/**
 * Text is passed on as written. Numbers are re-read so "1.234,56" reaches the database as a
 * decimal it accepts; one that cannot be read is passed on unchanged, so the import reports
 * it against its line instead of treating it as blank.
 */
function normalizeRow(row: ImportRow): Record<string, string | number | null> {
  const figure = (value: string | undefined) => readDecimal(value) ?? value ?? null;
  return {
    line: row.line ?? null,
    sku: row.sku ?? null,
    description: row.description ?? null,
    hs_code: row.hs_code?.replace(/[\s.]/g, '') || null,
    country_of_origin: row.country_of_origin?.toUpperCase() ?? null,
    unit: row.unit ?? null,
    unit_price: figure(row.unit_price),
    net_weight_kg: figure(row.net_weight_kg),
    gross_weight_kg: figure(row.gross_weight_kg),
    package_kind: row.package_kind ?? null,
  };
}

function readImportResult(
  data: unknown,
): { inserted: number; updated: number; problems: ImportProblem[] } | null {
  if (typeof data !== 'object' || data === null) return null;
  const { inserted, updated, problems } = data as Record<string, unknown>;
  if (typeof inserted !== 'number' || typeof updated !== 'number') return null;
  return {
    inserted,
    updated,
    problems: Array.isArray(problems) ? problemsFrom(problems) : [],
  };
}

function problemsFrom(entries: unknown[]): ImportProblem[] {
  return entries.filter(
    (entry): entry is ImportProblem =>
      typeof entry === 'object' &&
      entry !== null &&
      typeof (entry as ImportProblem).row === 'number' &&
      typeof (entry as ImportProblem).problem === 'string',
  );
}

function readProblems(details: string | null | undefined): ImportProblem[] | null {
  if (!details) return null;
  try {
    const parsed: unknown = JSON.parse(details);
    if (!Array.isArray(parsed)) return null;
    return problemsFrom(parsed);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Using master data on a shipment
// ---------------------------------------------------------------------------

type PartyColumn = 'exporter_id' | 'consignee_id' | 'notify_id';

/**
 * One explicit column per role. A computed key widens to an index signature that newer
 * supabase-js typings reject, and spelling each case out keeps the allowed set visible.
 */
function partyUpdate(
  role: PartyColumn,
  company: string | null,
): { exporter_id: string | null } | { consignee_id: string | null } | { notify_id: string | null } {
  switch (role) {
    case 'exporter_id':
      return { exporter_id: company };
    case 'consignee_id':
      return { consignee_id: company };
    case 'notify_id':
      return { notify_id: company };
  }
}

export async function setShipmentParty(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({
      org: uuid,
      shipment: uuid,
      role: z.enum(['exporter_id', 'consignee_id', 'notify_id']),
      company: z.union([uuid, z.literal('')]),
    })
    .safeParse({
      org: read(formData, 'org'),
      shipment: read(formData, 'shipment'),
      role: read(formData, 'role'),
      company: read(formData, 'company'),
    });
  if (!parsed.success) return { error: 'That party could not be set.' };

  const { org, shipment, role } = parsed.data;
  const company = parsed.data.company || null;
  const client = await createClient();

  // The party must belong to the organization the shipment does. The database refuses a
  // cross-tenant reference as well; checking here turns that into a message, not a 500.
  if (company) {
    const { data: owned } = await client
      .from('companies')
      .select('id')
      .eq('id', company)
      .eq('org_id', org)
      .maybeSingle();
    if (!owned) return { error: 'That party is not in this organization.' };
  }

  const { data: changed, error } = await client
    .from('shipments')
    .update(partyUpdate(role, company))
    .eq('id', shipment)
    .eq('org_id', org)
    .select('id');
  if (error || !changed?.length) return { error: 'That party could not be set.' };

  revalidatePath(`/app/${org}/shipments/${shipment}`);
  return { notice: 'Party updated.' };
}

export async function addFromCatalog(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({
      org: uuid,
      shipment: uuid,
      product: z.uuid('Choose a product from the catalog.'),
      quantity: decimalField({ label: 'quantity', places: 3, required: true, positive: true }),
    })
    .safeParse({
      org: read(formData, 'org'),
      shipment: read(formData, 'shipment'),
      product: read(formData, 'product'),
      quantity: read(formData, 'quantity'),
    });
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    return { error: summaryOf(fields, 'Choose a product and a quantity.'), fields };
  }

  const client = await createClient();
  const { error } = await client.rpc('add_product_to_shipment', {
    target_shipment: parsed.data.shipment,
    target_product: parsed.data.product,
    line_quantity: Number(parsed.data.quantity),
  });
  if (error) {
    if (says(error, 'catalog entry is not available')) {
      return { error: 'That product is archived or no longer in the catalog.' };
    }
    if (says(error, 'shipment is not available')) {
      return { error: 'That shipment is not available to you.' };
    }
    if (error.code === '23514') {
      return { error: 'A shipment holds at most 999 lines. Start a second shipment.' };
    }
    return { error: 'That product could not be added to the shipment. Try again.' };
  }

  revalidatePath(`/app/${parsed.data.org}/shipments/${parsed.data.shipment}`);
  return { notice: 'Line added from the catalog.' };
}

// ---------------------------------------------------------------------------
// Packing
// ---------------------------------------------------------------------------

export async function addPackage(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = z
    .object({
      org: uuid,
      shipment: uuid,
      kind: z
        .string()
        .trim()
        .min(1, 'Name the package type.')
        .max(40, 'Use 40 characters or fewer.'),
      package_count: z
        .string()
        .trim()
        .regex(/^\d{1,6}$/, 'Enter how many there are, as a whole number.')
        .transform(Number)
        .refine((value) => value >= 1 && value <= 100_000, 'Enter between 1 and 100,000.'),
      // Dimensions are per package and must be real measurements; zero is not a size.
      length_cm: decimalField({ label: 'length', places: 2, positive: true }),
      width_cm: decimalField({ label: 'width', places: 2, positive: true }),
      height_cm: decimalField({ label: 'height', places: 2, positive: true }),
      // Weights are per package. Documents multiply them by the count.
      net_weight_kg: decimalField({ label: 'net weight', places: 3 }),
      gross_weight_kg: decimalField({ label: 'gross weight', places: 3 }),
      marks: optional(500),
    })
    .safeParse({
      org: read(formData, 'org'),
      shipment: read(formData, 'shipment'),
      kind: read(formData, 'kind') || 'carton',
      package_count: read(formData, 'package_count') || '1',
      length_cm: read(formData, 'length_cm'),
      width_cm: read(formData, 'width_cm'),
      height_cm: read(formData, 'height_cm'),
      net_weight_kg: read(formData, 'net_weight_kg'),
      gross_weight_kg: read(formData, 'gross_weight_kg'),
      marks: read(formData, 'marks'),
    });
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    return { error: summaryOf(fields, 'Check the package.'), fields };
  }

  const { org, shipment, ...values } = parsed.data;
  if (grossBelowNet(values.net_weight_kg, values.gross_weight_kg)) {
    const message = 'Gross weight cannot be less than net weight.';
    return { error: message, fields: { gross_weight_kg: message } };
  }
  const client = await createClient();
  // As with line items: the next ordinal follows the highest in use, so removing a
  // package cannot make the next one reuse a number that is still on screen.
  const { data: last } = await client
    .from('shipment_packages')
    .select('position')
    .eq('shipment_id', shipment)
    .eq('org_id', org)
    .order('position', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await client.from('shipment_packages').insert({
    org_id: org,
    shipment_id: shipment,
    position: (last?.position ?? 0) + 1,
    kind: values.kind,
    package_count: values.package_count,
    length_cm: values.length_cm === null ? null : Number(values.length_cm),
    width_cm: values.width_cm === null ? null : Number(values.width_cm),
    height_cm: values.height_cm === null ? null : Number(values.height_cm),
    net_weight_kg: values.net_weight_kg === null ? null : Number(values.net_weight_kg),
    gross_weight_kg: values.gross_weight_kg === null ? null : Number(values.gross_weight_kg),
    marks: values.marks,
  });
  if (error) {
    if (error.code === '23514') {
      return { error: 'A shipment holds at most 999 packages, and each needs valid figures.' };
    }
    return { error: 'That package could not be added. Reload the shipment and try again.' };
  }

  revalidatePath(`/app/${org}/shipments/${shipment}`);
  return { notice: 'Package added.' };
}

export async function removePackage(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z.object({ org: uuid, shipment: uuid, package: uuid }).safeParse({
    org: read(formData, 'org'),
    shipment: read(formData, 'shipment'),
    package: read(formData, 'package'),
  });
  if (!parsed.success) return { error: 'That package could not be found.' };

  const client = await createClient();
  const { data: removed, error } = await client
    .from('shipment_packages')
    .delete()
    .eq('id', parsed.data.package)
    .eq('shipment_id', parsed.data.shipment)
    .eq('org_id', parsed.data.org)
    .select('id');
  if (error || !removed?.length) return { error: 'That package could not be removed.' };

  revalidatePath(`/app/${parsed.data.org}/shipments/${parsed.data.shipment}`);
  return { notice: 'Package removed.' };
}

export async function allocateToPackage(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({
      org: uuid,
      shipment: uuid,
      package: uuid,
      item: uuid,
      quantity: decimalField({ label: 'quantity', places: 3, required: true, positive: true }),
    })
    .safeParse({
      org: read(formData, 'org'),
      shipment: read(formData, 'shipment'),
      package: read(formData, 'package'),
      item: read(formData, 'item'),
      quantity: read(formData, 'quantity'),
    });
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    return { error: summaryOf(fields, 'Choose a line and a quantity.'), fields };
  }

  const client = await createClient();
  const { error } = await client.from('package_contents').upsert(
    {
      org_id: parsed.data.org,
      package_id: parsed.data.package,
      item_id: parsed.data.item,
      quantity: Number(parsed.data.quantity),
    },
    { onConflict: 'package_id,item_id' },
  );
  if (error) {
    if (says(error, 'packs more than the line holds')) {
      const limits = readAllocationLimits(error.details);
      const message = limits
        ? `That is more than the line holds: ${limits.line} in total, ${limits.elsewhere} already in other packages.`
        : 'That is more than the line holds.';
      return { error: message, fields: { quantity: message } };
    }
    if (says(error, 'its own shipment')) {
      return { error: 'That line belongs to a different shipment.' };
    }
    return { error: 'That allocation could not be saved. Reload the shipment and try again.' };
  }

  revalidatePath(`/app/${parsed.data.org}/shipments/${parsed.data.shipment}`);
  return { notice: 'Contents updated.' };
}

export async function removeAllocation(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z.object({ org: uuid, shipment: uuid, allocation: uuid }).safeParse({
    org: read(formData, 'org'),
    shipment: read(formData, 'shipment'),
    allocation: read(formData, 'allocation'),
  });
  if (!parsed.success) return { error: 'That allocation could not be found.' };

  const client = await createClient();
  const { data: removed, error } = await client
    .from('package_contents')
    .delete()
    .eq('id', parsed.data.allocation)
    .eq('org_id', parsed.data.org)
    .select('id');
  if (error || !removed?.length) {
    return { error: 'That allocation could not be removed. It may already have been removed.' };
  }

  revalidatePath(`/app/${parsed.data.org}/shipments/${parsed.data.shipment}`);
  return { notice: 'Contents updated.' };
}

/** The figures the allocation limit reports, for a message the user can act on. */
function readAllocationLimits(
  details: string | null | undefined,
): { line: string; elsewhere: string } | null {
  if (!details) return null;
  try {
    const parsed: unknown = JSON.parse(details);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const { line_quantity, allocated_elsewhere } = parsed as Record<string, unknown>;
    if (
      (typeof line_quantity !== 'number' && typeof line_quantity !== 'string') ||
      (typeof allocated_elsewhere !== 'number' && typeof allocated_elsewhere !== 'string')
    ) {
      return null;
    }
    return { line: String(Number(line_quantity)), elsewhere: String(Number(allocated_elsewhere)) };
  } catch {
    return null;
  }
}
