import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET as listShipments, POST as createShipment } from '@/app/api/v1/shipments/route';
import { GET as getShipment } from '@/app/api/v1/shipments/[id]/route';
import {
  GET as listDocuments,
  POST as generateDocument,
} from '@/app/api/v1/shipments/[id]/documents/route';
import { GET as documentPdf } from '@/app/api/v1/documents/[id]/pdf/route';
import { generateApiKey, hashApiKey } from '@/lib/api/keys';

/**
 * The /api/v1 route handlers against a stubbed database. Authorization itself is the
 * database's (supabase/tests/public_api.test.sql proves revoked keys, other organizations'
 * rows and the plan gate there); this file proves the HTTP side: every failure maps to the
 * documented status and error code, the raw key never leaves the process, and a happy path
 * returns the documented shapes.
 */

// Synthetic values only; nothing here is a real key or a real project.
const PEPPER = 'synthetic-api-pepper-for-integration-0001';
const ORG = '0a000000-0000-4000-8000-00000000000a';
const KEY_ID = '0b000000-0000-4000-8000-00000000000b';
const SHIPMENT = '0c000000-0000-4000-8000-00000000000c';
const OTHER_SHIPMENT = '0d000000-0000-4000-8000-00000000000d';
const BASE = 'http://127.0.0.1/api/v1';
const { key: KEY } = generateApiKey(PEPPER);

type Rpc = (args: Record<string, unknown>) => Response;

function configure() {
  vi.stubEnv('APP_ENV', 'test');
  vi.stubEnv('APPLICATION_MODE', 'service');
  vi.stubEnv('SUPABASE_URL', 'http://127.0.0.1:54321');
  vi.stubEnv('SUPABASE_ANON_KEY', 'synthetic-public-test-key');
  vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'synthetic-service-test-key');
  vi.stubEnv('SUPABASE_PROJECT_REF', 'syntheticproject');
  vi.stubEnv('SUPABASE_ENVIRONMENT', 'test');
  vi.stubEnv('API_KEY_PEPPER', PEPPER);
  // No RATE_LIMIT_KEY_SECRET: quotas run degraded here, as /api/ready would report.
  vi.stubEnv('RATE_LIMIT_KEY_SECRET', '');
}

function entitlement(plan: string) {
  return [
    {
      org_id: ORG,
      plan,
      status: 'active',
      paid_through: new Date(Date.now() + 86_400_000).toISOString(),
      cancel_at_period_end: false,
      revoked_at: null,
      revoke_reason: null,
      updated_at: new Date().toISOString(),
    },
  ];
}

/** A database that answers each routine with the given handler, and records every call. */
function database(routines: Record<string, Rpc>, options: { auth?: unknown; plan?: string } = {}) {
  const calls: { url: string; body: string }[] = [];
  const fetcher = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const body = typeof init?.body === 'string' ? init.body : '';
    calls.push({ url, body });
    if (url.endsWith('/rest/v1/rpc/api_authenticate')) {
      return Response.json(options.auth ?? { status: 'ok', key_id: KEY_ID, org_id: ORG });
    }
    if (url.includes('/rest/v1/entitlements'))
      return Response.json(entitlement(options.plan ?? 'team'));
    const name = /\/rest\/v1\/rpc\/([a-z_]+)$/.exec(url)?.[1];
    const handler = name ? routines[name] : undefined;
    if (!handler) throw new Error(`Unexpected request to ${url}`);
    return handler(JSON.parse(body) as Record<string, unknown>);
  });
  vi.stubGlobal('fetch', fetcher);
  return { fetcher, calls };
}

function request(path: string, init: RequestInit & { key?: string | null } = {}) {
  const headers = new Headers(init.headers);
  const key = init.key === undefined ? KEY : init.key;
  if (key !== null) headers.set('authorization', `Bearer ${key}`);
  return new Request(`${BASE}${path}`, { ...init, headers });
}

function json(path: string, body: unknown, headers: Record<string, string> = {}) {
  return request(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

const params = (id: string) => ({ params: Promise.resolve({ id }) });

beforeEach(configure);
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('authentication failures', () => {
  it('answers 401 MISSING_API_KEY without a key, before touching the database', async () => {
    const { fetcher } = database({});
    const response = await listShipments(request('/shipments', { key: null }));
    expect(response.status).toBe(401);
    expect(response.headers.get('www-authenticate')).toContain('Bearer');
    expect(await response.json()).toEqual({
      error: {
        code: 'MISSING_API_KEY',
        message: 'Send your API key as "Authorization: Bearer <key>".',
      },
    });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('answers 401 INVALID_API_KEY for a key not in the documented format', async () => {
    const { fetcher } = database({});
    const response = await listShipments(request('/shipments', { key: 'sk_live_whatever' }));
    expect(response.status).toBe(401);
    expect((await response.json()).error.code).toBe('INVALID_API_KEY');
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('answers 401 INVALID_API_KEY for an unknown or revoked key', async () => {
    database({}, { auth: { status: 'invalid' } });
    const response = await listShipments(request('/shipments'));
    expect(response.status).toBe(401);
    expect((await response.json()).error.code).toBe('INVALID_API_KEY');
  });

  it('answers 401 when a key is revoked between authentication and the operation', async () => {
    database({
      api_list_shipments: () =>
        Response.json({ code: '28000', message: 'invalid_api_key' }, { status: 403 }),
    });
    const response = await listShipments(request('/shipments'));
    expect(response.status).toBe(401);
    expect((await response.json()).error.code).toBe('INVALID_API_KEY');
  });

  it('answers 403 PLAN_REQUIRED when the database refuses the plan', async () => {
    database({}, { auth: { status: 'not_entitled' } });
    const response = await listShipments(request('/shipments'));
    expect(response.status).toBe(403);
    expect((await response.json()).error.code).toBe('PLAN_REQUIRED');
  });

  it('answers 403 PLAN_REQUIRED when hasEntitlement disagrees (Pro is not enough)', async () => {
    const { calls } = database({ api_list_shipments: () => Response.json([]) }, { plan: 'pro' });
    const response = await listShipments(request('/shipments'));
    expect(response.status).toBe(403);
    expect((await response.json()).error.code).toBe('PLAN_REQUIRED');
    expect(calls.some((call) => call.url.endsWith('/api_list_shipments'))).toBe(false);
  });

  it('answers 404 for another organization’s shipment and document (wrong org)', async () => {
    database({
      api_get_shipment: () => Response.json(null),
      api_list_documents: () => Response.json(null),
      api_get_document: () => Response.json(null),
      api_generate_document: () => Response.json(null),
    });
    expect(
      (await getShipment(request(`/shipments/${OTHER_SHIPMENT}`), params(OTHER_SHIPMENT))).status,
    ).toBe(404);
    expect(
      (
        await listDocuments(
          request(`/shipments/${OTHER_SHIPMENT}/documents`),
          params(OTHER_SHIPMENT),
        )
      ).status,
    ).toBe(404);
    expect(
      (await documentPdf(request(`/documents/${OTHER_SHIPMENT}/pdf`), params(OTHER_SHIPMENT)))
        .status,
    ).toBe(404);
    const generated = await generateDocument(
      json(`/shipments/${OTHER_SHIPMENT}/documents`, { kind: 'commercial_invoice' }),
      params(OTHER_SHIPMENT),
    );
    expect(generated.status).toBe(404);
    expect((await generated.json()).error.code).toBe('NOT_FOUND');
  });

  it('answers 503 API_UNAVAILABLE without a pepper, and the deployment stays up', async () => {
    vi.stubEnv('API_KEY_PEPPER', '');
    const { fetcher } = database({});
    const response = await listShipments(request('/shipments'));
    expect(response.status).toBe(503);
    expect((await response.json()).error.code).toBe('API_UNAVAILABLE');
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('sends the database the key’s hash and never the key itself', async () => {
    const { calls } = database({ api_list_shipments: () => Response.json([]) });
    await listShipments(request('/shipments'));
    expect(calls.length).toBeGreaterThan(0);
    for (const call of calls) {
      expect(call.body).not.toContain(KEY);
      expect(call.url).not.toContain(KEY);
    }
    const auth = calls.find((call) => call.url.endsWith('/api_authenticate'));
    expect(JSON.parse(auth?.body ?? '{}')).toEqual({ p_key_hash: hashApiKey(KEY, PEPPER) });
  });
});

describe('happy paths', () => {
  const shipment = (n: number) => ({
    id: `0e000000-0000-4000-8000-00000000000${n}`,
    reference: `PO-${n}`,
    created_at: `2026-10-09T10:00:0${n}.000001+00:00`,
  });

  it('lists shipments a page at a time', async () => {
    const { calls } = database({
      api_list_shipments: () => Response.json([shipment(3), shipment(2), shipment(1)]),
    });
    const response = await listShipments(request('/shipments?limit=2'));
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
    const body = await response.json();
    expect(body.data.map((row: { reference: string }) => row.reference)).toEqual(['PO-3', 'PO-2']);
    expect(typeof body.next_cursor).toBe('string');
    const list = calls.find((call) => call.url.endsWith('/api_list_shipments'));
    expect(JSON.parse(list?.body ?? '{}')).toMatchObject({ p_limit: 2, p_after_created: null });

    const next = await listShipments(request(`/shipments?limit=2&cursor=${body.next_cursor}`));
    expect(next.status).toBe(200);
    const second = calls.filter((call) => call.url.endsWith('/api_list_shipments')).at(-1);
    expect(JSON.parse(second?.body ?? '{}')).toMatchObject({
      p_after_created: shipment(2).created_at,
      p_after_id: shipment(2).id,
    });
  });

  it('refuses a malformed page query with 400', async () => {
    database({});
    const response = await listShipments(request('/shipments?limit=500'));
    expect(response.status).toBe(400);
    expect((await response.json()).error.code).toBe('INVALID_QUERY');
  });

  it('creates a shipment, replays it for the same Idempotency-Key and refuses a different body', async () => {
    const stored = { id: SHIPMENT, reference: 'PO-10042', items: [] };
    let seen = 0;
    database({
      api_create_shipment: (args) => {
        seen += 1;
        if (args.p_idempotency_key === 'retry-1' && seen === 2) {
          return Response.json({ status: 200, body: stored, replayed: true });
        }
        if (args.p_idempotency_key === 'retry-1' && seen === 3) {
          return Response.json({ conflict: true });
        }
        return Response.json({ status: 201, body: stored });
      },
    });
    const body = { reference: 'PO-10042', items: [{ description: 'Valves', quantity: '120' }] };

    const first = await createShipment(json('/shipments', body, { 'idempotency-key': 'retry-1' }));
    expect(first.status).toBe(201);
    expect(first.headers.get('location')).toBe(`/api/v1/shipments/${SHIPMENT}`);
    expect((await first.json()).data.id).toBe(SHIPMENT);

    const replay = await createShipment(json('/shipments', body, { 'idempotency-key': 'retry-1' }));
    expect(replay.status).toBe(200);
    expect(replay.headers.get('idempotent-replayed')).toBe('true');

    const conflict = await createShipment(
      json('/shipments', { reference: 'PO-other' }, { 'idempotency-key': 'retry-1' }),
    );
    expect(conflict.status).toBe(409);
    expect((await conflict.json()).error.code).toBe('IDEMPOTENCY_CONFLICT');
  });

  it('passes the validated shipment to the database without any organization id', async () => {
    const { calls } = database({
      api_create_shipment: () => Response.json({ status: 201, body: { id: SHIPMENT } }),
    });
    await createShipment(json('/shipments', { reference: 'PO-7', currency: 'usd' }));
    const call = calls.find((entry) => entry.url.endsWith('/api_create_shipment'));
    const args = JSON.parse(call?.body ?? '{}');
    expect(args.p_shipment).toMatchObject({ reference: 'PO-7', currency: 'USD' });
    expect(JSON.stringify(args)).not.toContain(ORG);
    expect(args.p_items).toEqual([]);
  });

  it('answers 422 with field details for an invalid shipment, and 409 for a taken reference', async () => {
    database({
      api_create_shipment: () =>
        Response.json({ code: '23505', message: 'duplicate key' }, { status: 409 }),
    });
    const invalid = await createShipment(json('/shipments', { reference: '', currency: 'euro' }));
    expect(invalid.status).toBe(422);
    const details = (await invalid.json()).error.details as { field: string }[];
    expect(details.map((detail) => detail.field)).toEqual(
      expect.arrayContaining(['reference', 'currency']),
    );

    const taken = await createShipment(json('/shipments', { reference: 'PO-1' }));
    expect(taken.status).toBe(409);
    expect((await taken.json()).error.code).toBe('CONFLICT');
  });

  it('refuses a body that is not JSON with 415', async () => {
    database({});
    const response = await createShipment(
      request('/shipments', {
        method: 'POST',
        headers: { 'content-type': 'text/plain' },
        body: 'x',
      }),
    );
    expect(response.status).toBe(415);
  });

  it('refuses a malformed Idempotency-Key with 400', async () => {
    database({});
    const response = await createShipment(
      json('/shipments', { reference: 'PO-8' }, { 'idempotency-key': 'has spaces' }),
    );
    expect(response.status).toBe(400);
    expect((await response.json()).error.code).toBe('INVALID_IDEMPOTENCY_KEY');
  });

  it('gets a shipment and lists its documents', async () => {
    database({
      api_get_shipment: () => Response.json({ id: SHIPMENT, reference: 'PO-1', items: [] }),
      api_list_documents: () =>
        Response.json([{ id: KEY_ID, kind: 'packing_list', created_at: shipment(1).created_at }]),
    });
    const one = await getShipment(request(`/shipments/${SHIPMENT}`), params(SHIPMENT));
    expect(one.status).toBe(200);
    expect((await one.json()).data.reference).toBe('PO-1');
    const documents = await listDocuments(
      request(`/shipments/${SHIPMENT}/documents`),
      params(SHIPMENT),
    );
    expect(documents.status).toBe(200);
    expect(await documents.json()).toEqual({
      data: [{ id: KEY_ID, kind: 'packing_list', created_at: shipment(1).created_at }],
      next_cursor: null,
    });
  });

  it('generates a document and points at its PDF', async () => {
    database({
      api_generate_document: (args) => {
        expect(args.p_kind).toBe('commercial_invoice');
        return Response.json({ status: 201, body: { id: KEY_ID, number: 'CI-0001' } });
      },
    });
    const response = await generateDocument(
      json(`/shipments/${SHIPMENT}/documents`, { kind: 'commercial_invoice' }),
      params(SHIPMENT),
    );
    expect(response.status).toBe(201);
    expect(response.headers.get('location')).toBe(`/api/v1/documents/${KEY_ID}/pdf`);
  });

  it('maps "no lines" to 422 NO_LINES and an unknown kind to 422', async () => {
    database({
      api_generate_document: () =>
        Response.json(
          { code: '23514', message: 'Add at least one line item before generating a document.' },
          { status: 400 },
        ),
    });
    const empty = await generateDocument(
      json(`/shipments/${SHIPMENT}/documents`, { kind: 'packing_list' }),
      params(SHIPMENT),
    );
    expect(empty.status).toBe(422);
    expect((await empty.json()).error.code).toBe('NO_LINES');
    const unknown = await generateDocument(
      json(`/shipments/${SHIPMENT}/documents`, { kind: 'bill_of_exchange' }),
      params(SHIPMENT),
    );
    expect(unknown.status).toBe(422);
  });

  it('refuses a regulated kind while ENABLE_REGULATED_DOCUMENTS is off', async () => {
    const { calls } = database({});
    const response = await generateDocument(
      json(`/shipments/${SHIPMENT}/documents`, { kind: 'certificate_of_origin' }),
      params(SHIPMENT),
    );
    expect(response.status).toBe(403);
    expect((await response.json()).error.code).toBe('FEATURE_UNAVAILABLE');
    expect(calls.some((call) => call.url.endsWith('/api_generate_document'))).toBe(false);
  });
});
