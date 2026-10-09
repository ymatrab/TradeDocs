import type { ProviderId } from '@/lib/integrations/providers';

/**
 * Provider records to TradeDocs rows, without I/O, so every mapping is tested on fixtures.
 *
 * Only fields TradeDocs has a place for are read. Nothing is invented: an absent value stays
 * absent, a value TradeDocs cannot store as given (an unrecognised country, a malformed email)
 * is left blank with a note that says so, and lengths are left for the database routine to
 * judge so an over-long value is reported against its record rather than cut short.
 *
 * Field names follow the providers' own schemas:
 *   QuickBooks Customer / Item: https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/customer
 *                               https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/item
 *   Xero Contact / Item:        https://github.com/XeroAPI/Xero-OpenAPI (xero_accounting.yaml,
 *                               components.schemas.Contact, Address, Phone, Item, Purchase)
 */

export type ImportEntity = 'company' | 'product';

export type CompanyValues = {
  kind: 'customer' | 'supplier';
  name: string | null;
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
};

export type ProductValues = {
  sku: string | null;
  description: string | null;
  /** Decimal text, such as "2.4". The routine validates it. */
  unit_price: string | null;
  unit: string;
};

export type MappedRecord<V> = {
  external_id: string;
  /** Position in the list read from the provider, 1-based; problems are reported against it. */
  line: number;
  /** What the operator recognises the record by. */
  label: string;
  values: V;
  /** Non-blocking notes, such as a country left blank. */
  notes: string[];
};

export type Mapped<V> = {
  records: MappedRecord<V>[];
  /** Records deliberately not imported (archived, inactive, categories), counted. */
  ignored: number;
};

type Raw = Record<string, unknown>;

function obj(value: unknown): Raw | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Raw)
    : null;
}

function text(value: unknown): string | null {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (typeof value !== 'string') return null;
  const trimmed = value.replace(/\s+/g, ' ').trim();
  return trimmed ? trimmed : null;
}

function joined(...parts: unknown[]): string | null {
  const values = parts.map(text).filter((part): part is string => part !== null);
  return values.length > 0 ? values.join(' ') : null;
}

function list(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

// --- Countries --------------------------------------------------------------------------

/** Short forms accounting files commonly hold that are not ISO alpha-2 or an English name. */
const COUNTRY_ALIASES: Record<string, string> = {
  USA: 'US',
  'U.S.A.': 'US',
  'U.S.': 'US',
  'UNITED STATES OF AMERICA': 'US',
  UK: 'GB',
  'U.K.': 'GB',
  'GREAT BRITAIN': 'GB',
  ENGLAND: 'GB',
  SCOTLAND: 'GB',
  WALES: 'GB',
  'NORTHERN IRELAND': 'GB',
  UAE: 'AE',
  AUS: 'AU',
  NZL: 'NZ',
  CAN: 'CA',
  DEU: 'DE',
  FRA: 'FR',
  IRL: 'IE',
  IND: 'IN',
  CHN: 'CN',
  JPN: 'JP',
  ZAF: 'ZA',
  HOLLAND: 'NL',
  'THE NETHERLANDS': 'NL',
  'SOUTH KOREA': 'KR',
  'HONG KONG SAR': 'HK',
};

let namesToCodes: Map<string, string> | null = null;

/** English region names from the runtime's own ICU data, keyed upper-case. */
function regionNames(): Map<string, string> {
  if (namesToCodes) return namesToCodes;
  const map = new Map<string, string>();
  try {
    const names = new Intl.DisplayNames(['en'], { type: 'region', fallback: 'none' });
    for (let a = 65; a <= 90; a += 1) {
      for (let b = 65; b <= 90; b += 1) {
        const code = String.fromCharCode(a, b);
        const name = names.of(code);
        // First code wins: ICU also names the reserved "UK" "United Kingdom"; GB comes first.
        if (name && name !== code && !map.has(name.toUpperCase())) map.set(name.toUpperCase(), code);
      }
    }
  } catch {
    // Without ICU region data only codes and aliases are recognised.
  }
  namesToCodes = map;
  return map;
}

function isRegionCode(code: string): boolean {
  return [...regionNames().values()].includes(code);
}

/** An ISO 3166-1 alpha-2 code for a country as an accounting file writes it, or null. */
export function countryCode(raw: unknown): string | null {
  const value = text(raw);
  if (!value) return null;
  const upper = value.toUpperCase();
  // Aliases first: "UK" is two letters but not the ISO code (GB).
  const alias = COUNTRY_ALIASES[upper];
  if (alias) return alias;
  if (/^[A-Z]{2}$/.test(upper) && isRegionCode(upper)) return upper;
  return regionNames().get(upper) ?? null;
}

// --- Small validators -------------------------------------------------------------------

function email(raw: unknown, notes: string[]): string | null {
  const value = text(raw);
  if (!value) return null;
  if (value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return value;
  notes.push('The email address was not valid and was left blank.');
  return null;
}

function country(raw: unknown, notes: string[]): string | null {
  const value = text(raw);
  if (!value) return null;
  const code = countryCode(value);
  if (!code) notes.push(`Country “${value}” was not recognised and was left blank.`);
  return code;
}

/** A price as decimal text with at most four places, or the raw text for the routine to refuse. */
function price(raw: unknown): string | null {
  if (typeof raw === 'number') {
    if (!Number.isFinite(raw)) return null;
    return raw
      .toFixed(4)
      .replace(/(\.\d*?)0+$/, '$1')
      .replace(/\.$/, '');
  }
  return text(raw);
}

// --- QuickBooks Online ------------------------------------------------------------------

type QuickBooksAddress = {
  Line1?: unknown;
  Line2?: unknown;
  Line3?: unknown;
  City?: unknown;
  CountrySubDivisionCode?: unknown;
  PostalCode?: unknown;
  Country?: unknown;
};

/** QuickBooks customers to companies. Inactive customers are not imported. */
export function mapQuickBooksCustomers(entries: unknown[]): Mapped<CompanyValues> {
  const records: MappedRecord<CompanyValues>[] = [];
  let ignored = 0;
  for (const entry of entries) {
    const customer = obj(entry);
    if (!customer) continue;
    if (customer.Active === false) {
      ignored += 1;
      continue;
    }
    const notes: string[] = [];
    const address = (obj(customer.BillAddr) ?? obj(customer.ShipAddr) ?? {}) as QuickBooksAddress;
    const companyName = text(customer.CompanyName);
    const displayName = text(customer.DisplayName);
    const name = companyName ?? displayName;
    const values: CompanyValues = {
      kind: 'customer',
      name,
      legal_name: companyName && displayName && companyName !== displayName ? companyName : null,
      contact_name: joined(customer.GivenName, customer.FamilyName),
      // QuickBooks returns the tax identifier masked (PrimaryTaxIdentifier), so it is not read.
      tax_number: null,
      registration_number: null,
      email: email(obj(customer.PrimaryEmailAddr)?.Address, notes),
      phone: text(obj(customer.PrimaryPhone)?.FreeFormNumber) ?? text(obj(customer.Mobile)?.FreeFormNumber),
      address_line1: text(address.Line1),
      address_line2: joined(address.Line2, address.Line3),
      city: text(address.City),
      region: text(address.CountrySubDivisionCode),
      postal_code: text(address.PostalCode),
      country_code: country(address.Country, notes),
    };
    records.push({
      external_id: text(customer.Id) ?? '',
      line: records.length + 1,
      label: name ?? `QuickBooks customer ${text(customer.Id) ?? ''}`.trim(),
      values,
      notes,
    });
  }
  return { records, ignored };
}

/** QuickBooks items to products. Categories and inactive items are not imported. */
export function mapQuickBooksItems(entries: unknown[]): Mapped<ProductValues> {
  const records: MappedRecord<ProductValues>[] = [];
  let ignored = 0;
  for (const entry of entries) {
    const item = obj(entry);
    if (!item) continue;
    if (item.Active === false || item.Type === 'Category') {
      ignored += 1;
      continue;
    }
    const name = text(item.Name);
    const description = text(item.Description) ?? name;
    records.push({
      external_id: text(item.Id) ?? '',
      line: records.length + 1,
      label: name ?? description ?? `QuickBooks item ${text(item.Id) ?? ''}`.trim(),
      values: {
        sku: text(item.Sku),
        description,
        unit_price: price(item.UnitPrice),
        unit: 'pcs',
      },
      notes: [],
    });
  }
  return { records, ignored };
}

// --- Xero -------------------------------------------------------------------------------

function xeroAddress(contact: Raw): Raw {
  const addresses = list(contact.Addresses).map(obj).filter((a): a is Raw => a !== null);
  const filled = (a: Raw) => Boolean(text(a.AddressLine1) || text(a.City) || text(a.Country));
  return (
    addresses.find((a) => a.AddressType === 'STREET' && filled(a)) ??
    addresses.find((a) => a.AddressType === 'POBOX' && filled(a)) ??
    {}
  );
}

function xeroPhone(contact: Raw): string | null {
  const phones = list(contact.Phones).map(obj).filter((p): p is Raw => p !== null);
  const pick =
    phones.find((p) => p.PhoneType === 'DEFAULT' && text(p.PhoneNumber)) ??
    phones.find((p) => p.PhoneType === 'MOBILE' && text(p.PhoneNumber)) ??
    phones.find((p) => text(p.PhoneNumber));
  if (!pick) return null;
  const country = text(pick.PhoneCountryCode);
  return joined(country ? `+${country.replace(/^\+/, '')}` : null, pick.PhoneAreaCode, pick.PhoneNumber);
}

/** Xero contacts to companies. Archived contacts are not imported. */
export function mapXeroContacts(entries: unknown[]): Mapped<CompanyValues> {
  const records: MappedRecord<CompanyValues>[] = [];
  let ignored = 0;
  for (const entry of entries) {
    const contact = obj(entry);
    if (!contact) continue;
    if (contact.ContactStatus === 'ARCHIVED' || contact.ContactStatus === 'GDPRREQUEST') {
      ignored += 1;
      continue;
    }
    const notes: string[] = [];
    const address = xeroAddress(contact);
    const name = text(contact.Name);
    const supplierOnly = contact.IsSupplier === true && contact.IsCustomer !== true;
    records.push({
      external_id: text(contact.ContactID) ?? '',
      line: records.length + 1,
      label: name ?? `Xero contact ${text(contact.ContactID) ?? ''}`.trim(),
      values: {
        kind: supplierOnly ? 'supplier' : 'customer',
        name,
        legal_name: null,
        contact_name: joined(contact.FirstName, contact.LastName),
        tax_number: text(contact.TaxNumber),
        registration_number: text(contact.CompanyNumber),
        email: email(contact.EmailAddress, notes),
        phone: xeroPhone(contact),
        address_line1: text(address.AddressLine1),
        address_line2: joined(address.AddressLine2, address.AddressLine3, address.AddressLine4),
        city: text(address.City),
        region: text(address.Region),
        postal_code: text(address.PostalCode),
        country_code: country(address.Country, notes),
      },
      notes,
    });
  }
  return { records, ignored };
}

/** Xero items to products. The sales price is the catalog price. */
export function mapXeroItems(entries: unknown[]): Mapped<ProductValues> {
  const records: MappedRecord<ProductValues>[] = [];
  for (const entry of entries) {
    const item = obj(entry);
    if (!item) continue;
    const code = text(item.Code);
    const name = text(item.Name);
    const description = text(item.Description) ?? name;
    records.push({
      external_id: text(item.ItemID) ?? '',
      line: records.length + 1,
      label: name ?? code ?? `Xero item ${text(item.ItemID) ?? ''}`.trim(),
      values: {
        sku: code,
        description,
        unit_price: price(obj(item.SalesDetails)?.UnitPrice),
        unit: 'pcs',
      },
      notes: [],
    });
  }
  return { records, ignored: 0 };
}

export function mapRecords(
  provider: ProviderId,
  entity: ImportEntity,
  entries: unknown[],
): Mapped<CompanyValues> | Mapped<ProductValues> {
  if (provider === 'quickbooks') {
    return entity === 'company' ? mapQuickBooksCustomers(entries) : mapQuickBooksItems(entries);
  }
  return entity === 'company' ? mapXeroContacts(entries) : mapXeroItems(entries);
}
