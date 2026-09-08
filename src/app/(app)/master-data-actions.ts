'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { fieldErrors, summaryOf } from '@/lib/form-errors';
import { parseCatalog, readDecimal, type ImportRow } from '@/lib/csv';
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

const countryCode = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^([A-Z]{2})?$/, 'Use a two-letter country code, such as DE.')
  .transform((value) => value || null);

const hsCode = z
  .string()
  .trim()
  .regex(/^([0-9]{6,10})?$/, 'An HS code is 6 to 10 digits.')
  .transform((value) => value || null);

const decimal = (message: string) =>
  z
    .string()
    .trim()
    .transform((value) => (value === '' ? null : readDecimal(value)))
    .refine((value) => value === null || Number(value) >= 0, message);

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
    const { error } = await client.from('companies').update(values).eq('id', company);
    if (error) return { error: 'Those details could not be saved.' };
    revalidatePath(`/app/${org}/companies/${company}`);
    revalidatePath(`/app/${org}/companies`);
    return { notice: 'Saved.' };
  }

  const { data, error } = await client
    .from('companies')
    .insert({ ...values, org_id: org })
    .select('id')
    .single();
  if (error || !data) return { error: 'That company could not be added.' };
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
  const { error } = await client
    .from('companies')
    .update({ archived_at: archiving ? new Date().toISOString() : null })
    .eq('id', parsed.data.company);
  if (error) return { error: 'That change could not be saved.' };

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
  unit_price: decimal('Enter a price of zero or more.'),
  currency: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^([A-Z]{3})?$/, 'Use a three-letter currency code.')
    .transform((value) => value || null),
  net_weight_kg: decimal('A net weight cannot be negative.'),
  gross_weight_kg: decimal('A gross weight cannot be negative.'),
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
  if (
    net_weight_kg !== null &&
    gross_weight_kg !== null &&
    Number(gross_weight_kg) < Number(net_weight_kg)
  ) {
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
    const { error } = await client.from('products').update(values).eq('id', product);
    if (error) {
      if (error.code === '23505') {
        const message = 'Another active product already uses that code.';
        return { error: message, fields: { sku: message } };
      }
      return { error: 'Those details could not be saved.' };
    }
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
  const { error } = await client
    .from('products')
    .update({ archived_at: archiving ? new Date().toISOString() : null })
    .eq('id', parsed.data.product);
  if (error) return { error: 'That change could not be saved.' };

  revalidatePath(`/app/${parsed.data.org}/products`);
  revalidatePath(`/app/${parsed.data.org}/products/${parsed.data.product}`);
  return {
    notice: archiving
      ? 'Archived. It stays out of the picker; past documents are unchanged.'
      : 'Restored to the catalog.',
  };
}

/** The problems the import routine reports, keyed to the row in the user's own file. */
export type ImportProblem = { row: number; problem: string };

export type ImportState = ActionState & {
  problems?: ImportProblem[];
  ignored?: string[];
  imported?: { inserted: number; updated: number };
};

export async function importCatalog(
  _previous: ImportState,
  formData: FormData,
): Promise<ImportState> {
  const org = uuid.safeParse(read(formData, 'org'));
  if (!org.success) return { error: 'That organization could not be found.' };

  const upload = formData.get('file');
  const pasted = read(formData, 'text');
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

  const client = await createClient();
  const { data, error } = await client.rpc('import_products', {
    target_org: org.data,
    rows: rows.map(normalizeRow),
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
    return { error: 'That catalog could not be imported.', ignored };
  }

  const result = data as { inserted: number; updated: number };
  revalidatePath(`/app/${org.data}/products`);
  return {
    notice: `Imported ${result.inserted} new ${result.inserted === 1 ? 'product' : 'products'} and updated ${result.updated}.`,
    imported: result,
    ignored,
  };
}

/** Numbers are re-read here so "1.234,56" reaches the database as a decimal it accepts. */
function normalizeRow(row: ImportRow): Record<string, string | null> {
  return {
    sku: row.sku ?? null,
    description: row.description ?? null,
    hs_code: row.hs_code?.replace(/\D/g, '') || null,
    country_of_origin: row.country_of_origin?.toUpperCase() ?? null,
    unit: row.unit ?? null,
    unit_price: readDecimal(row.unit_price),
    net_weight_kg: readDecimal(row.net_weight_kg),
    gross_weight_kg: readDecimal(row.gross_weight_kg),
    package_kind: row.package_kind ?? null,
  };
}

function readProblems(details: string | null | undefined): ImportProblem[] | null {
  if (!details) return null;
  try {
    const parsed: unknown = JSON.parse(details);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(
      (entry): entry is ImportProblem =>
        typeof entry === 'object' &&
        entry !== null &&
        typeof (entry as ImportProblem).row === 'number' &&
        typeof (entry as ImportProblem).problem === 'string',
    );
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Using master data on a shipment
// ---------------------------------------------------------------------------

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

  const client = await createClient();
  const { error } = await client
    .from('shipments')
    .update({ [parsed.data.role]: parsed.data.company || null })
    .eq('id', parsed.data.shipment);
  if (error) return { error: 'That party could not be set.' };

  revalidatePath(`/app/${parsed.data.org}/shipments/${parsed.data.shipment}`);
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
      product: uuid,
      quantity: z.coerce.number().positive('Enter a quantity greater than zero.'),
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
    line_quantity: parsed.data.quantity,
  });
  if (error) return { error: 'That product could not be added to the shipment.' };

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
      kind: z.string().trim().min(1, 'Name the package type.').max(40),
      package_count: z.coerce.number().int().positive('Enter how many there are.'),
      length_cm: decimal('A length cannot be negative.'),
      width_cm: decimal('A width cannot be negative.'),
      height_cm: decimal('A height cannot be negative.'),
      net_weight_kg: decimal('A net weight cannot be negative.'),
      gross_weight_kg: decimal('A gross weight cannot be negative.'),
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
  const client = await createClient();
  // As with line items: the next ordinal follows the highest in use, so removing a
  // package cannot make the next one reuse a number that is still on screen.
  const { data: last } = await client
    .from('shipment_packages')
    .select('position')
    .eq('shipment_id', shipment)
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
  if (error) return { error: 'That package could not be added.' };

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
  const { error } = await client.from('shipment_packages').delete().eq('id', parsed.data.package);
  if (error) return { error: 'That package could not be removed.' };

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
      quantity: z.coerce.number().positive('Enter a quantity greater than zero.'),
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
      quantity: parsed.data.quantity,
    },
    { onConflict: 'package_id,item_id' },
  );
  if (error) return { error: 'That allocation could not be saved.' };

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
  const { error } = await client.from('package_contents').delete().eq('id', parsed.data.allocation);
  if (error) return { error: 'That allocation could not be removed.' };

  revalidatePath(`/app/${parsed.data.org}/shipments/${parsed.data.shipment}`);
  return { notice: 'Contents updated.' };
}
