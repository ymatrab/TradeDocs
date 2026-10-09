import { failFor, parseJson, ProviderError, request, type Fetcher } from '@/lib/integrations/http';
import type { ImportEntity } from '@/lib/integrations/mapping';
import {
  QUICKBOOKS_API,
  QUICKBOOKS_MINOR_VERSION,
  XERO_API,
  type QuickBooksEnvironment,
} from '@/lib/integrations/providers';

/**
 * Bounded reads of customers and items. Pages are 100 records (both providers' default);
 * reading stops at `max` records, and one more is read to tell the caller there were more.
 * At most ceil((max + 1) / 100) requests are made, well inside both providers' rate limits.
 */

export const PAGE_SIZE = 100;

export type Fetched = { entries: unknown[]; truncated: boolean };

export type Connection = {
  accessToken: string;
  /** QuickBooks realmId or Xero tenantId. */
  tenantId: string;
};

const QUICKBOOKS_ENTITY: Record<ImportEntity, 'Customer' | 'Item'> = {
  company: 'Customer',
  product: 'Item',
};

function quickbooksUrl(environment: QuickBooksEnvironment, realm: string, path: string): URL {
  if (!/^[0-9]{1,30}$/.test(realm)) throw new ProviderError('unreadable', 'Unexpected company id.');
  const url = new URL(`/v3/company/${realm}/${path}`, QUICKBOOKS_API[environment]);
  url.searchParams.set('minorversion', QUICKBOOKS_MINOR_VERSION);
  return url;
}

export async function fetchQuickBooks(
  entity: ImportEntity,
  connection: Connection,
  environment: QuickBooksEnvironment,
  max: number,
  fetcher: Fetcher,
): Promise<Fetched> {
  const name = QUICKBOOKS_ENTITY[entity];
  const entries: unknown[] = [];
  for (let start = 1; entries.length <= max; start += PAGE_SIZE) {
    const url = quickbooksUrl(environment, connection.tenantId, 'query');
    url.searchParams.set(
      'query',
      `select * from ${name} STARTPOSITION ${start} MAXRESULTS ${PAGE_SIZE}`,
    );
    const { status, body } = await request(fetcher, url.toString(), {
      method: 'GET',
      headers: { Authorization: `Bearer ${connection.accessToken}`, Accept: 'application/json' },
    });
    if (status !== 200) throw failFor(status, body);
    const parsed = parseJson(body) as { QueryResponse?: Record<string, unknown> };
    const page = parsed.QueryResponse?.[name];
    const records = Array.isArray(page) ? page : [];
    entries.push(...records);
    if (records.length < PAGE_SIZE) break;
  }
  return { entries: entries.slice(0, max), truncated: entries.length > max };
}

/** The QuickBooks company's name, for the settings page. Null when it cannot be read. */
export async function quickbooksCompanyName(
  connection: Connection,
  environment: QuickBooksEnvironment,
  fetcher: Fetcher,
): Promise<string | null> {
  try {
    const url = quickbooksUrl(
      environment,
      connection.tenantId,
      `companyinfo/${connection.tenantId}`,
    );
    const { status, body } = await request(fetcher, url.toString(), {
      method: 'GET',
      headers: { Authorization: `Bearer ${connection.accessToken}`, Accept: 'application/json' },
    });
    if (status !== 200) return null;
    const parsed = parseJson(body) as { CompanyInfo?: { CompanyName?: unknown } };
    const name = parsed.CompanyInfo?.CompanyName;
    return typeof name === 'string' && name.trim() ? name.trim().slice(0, 300) : null;
  } catch {
    return null;
  }
}

export async function fetchXero(
  entity: ImportEntity,
  connection: Connection,
  max: number,
  fetcher: Fetcher,
): Promise<Fetched> {
  const headers = {
    Authorization: `Bearer ${connection.accessToken}`,
    'xero-tenant-id': connection.tenantId,
    Accept: 'application/json',
  };
  if (entity === 'product') {
    // GET /Items is not paged; the body is read under MAX_RESPONSE_BYTES.
    const { status, body } = await request(fetcher, `${XERO_API}/Items`, {
      method: 'GET',
      headers,
    });
    if (status !== 200) throw failFor(status, body);
    const parsed = parseJson(body) as { Items?: unknown };
    const items = Array.isArray(parsed.Items) ? parsed.Items : [];
    return { entries: items.slice(0, max), truncated: items.length > max };
  }
  const entries: unknown[] = [];
  for (let page = 1; entries.length <= max; page += 1) {
    const url = new URL(`${XERO_API}/Contacts`);
    url.searchParams.set('page', String(page));
    url.searchParams.set('pageSize', String(PAGE_SIZE));
    const { status, body } = await request(fetcher, url.toString(), { method: 'GET', headers });
    if (status !== 200) throw failFor(status, body);
    const parsed = parseJson(body) as { Contacts?: unknown };
    const records = Array.isArray(parsed.Contacts) ? parsed.Contacts : [];
    entries.push(...records);
    if (records.length < PAGE_SIZE) break;
  }
  return { entries: entries.slice(0, max), truncated: entries.length > max };
}
