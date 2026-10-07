import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  addItem,
  duplicateShipment,
  generateDocument,
  removeItem,
  updateShipment,
  voidDocument,
} from '@/app/(app)/shipment-actions';
import {
  allocateToPackage,
  importCatalog,
  removeAllocation,
  removePackage,
  saveCompany,
} from '@/app/(app)/master-data-actions';
import { saveDocumentSettings } from '@/app/(app)/settings-actions';

/**
 * A filter that matches no row is not an error to PostgREST, so an action that only
 * checked `error` reported success for a row the caller could not see. These tests hold
 * the actions to the row count instead, and to the human message each refusal maps to.
 */
const state = vi.hoisted(() => ({
  rows: [] as unknown[],
  /** Results for successive queries, used before `rows` when present. */
  queue: [] as { data: unknown; error: unknown }[],
  calls: [] as unknown[][],
  rpc: vi.fn(),
  redirect: vi.fn(),
  userId: '44444444-4444-4444-8444-444444444444',
}));

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('next/navigation', () => ({ redirect: state.redirect }));
vi.mock('@/lib/supabase/server', () => {
  const next = (single: boolean) => {
    const queued = state.queue.shift();
    if (queued) return queued;
    return { data: single ? (state.rows[0] ?? null) : state.rows, error: null };
  };
  const query = (): Record<string, unknown> => {
    const chain: Record<string, unknown> = {};
    for (const method of [
      'update',
      'upsert',
      'delete',
      'insert',
      'select',
      'eq',
      'is',
      'order',
      'limit',
    ]) {
      chain[method] = (...args: unknown[]) => {
        state.calls.push([method, ...args]);
        return chain;
      };
    }
    chain.maybeSingle = async () => next(true);
    chain.single = async () => next(true);
    chain.then = (resolve: (value: unknown) => unknown) => resolve(next(false));
    return chain;
  };
  return {
    createClient: async () => ({
      from: (table: string) => {
        state.calls.push(['from', table]);
        return query();
      },
      rpc: state.rpc,
      auth: { getUser: async () => ({ data: { user: { id: state.userId } } }) },
    }),
  };
});

const ORG = '11111111-1111-4111-8111-111111111111';
const SHIPMENT = '22222222-2222-4222-8222-222222222222';
const ROW = '33333333-3333-4333-8333-333333333333';
const USER = state.userId;

function form(values: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

beforeEach(() => {
  state.rows = [];
  state.queue = [];
  state.calls = [];
  state.rpc.mockReset();
  state.redirect.mockReset();
  state.rpc.mockResolvedValue({ data: ROW, error: null });
});

describe('row-count reporting', () => {
  it('reports a shipment update that matched nothing as a failure', async () => {
    const result = await updateShipment({}, form({ org: ORG, shipment: SHIPMENT }));
    expect(result.error).toBeTruthy();
    expect(result.notice).toBeUndefined();
    expect(state.calls).toContainEqual(['eq', 'org_id', ORG]);
  });

  it('reports a shipment update that changed a row as saved', async () => {
    state.rows = [{ id: SHIPMENT }];
    const result = await updateShipment({}, form({ org: ORG, shipment: SHIPMENT }));
    expect(result.error).toBeUndefined();
    expect(result.notice).toMatch(/saved/i);
  });

  it('reports removing a line that is not there as a failure', async () => {
    const result = await removeItem({}, form({ org: ORG, shipment: SHIPMENT, item: ROW }));
    expect(result.error).toBeTruthy();
    expect(state.calls).toContainEqual(['eq', 'shipment_id', SHIPMENT]);
  });

  it('reports removing a line that was there as done', async () => {
    state.rows = [{ id: ROW }];
    const result = await removeItem({}, form({ org: ORG, shipment: SHIPMENT, item: ROW }));
    expect(result.notice).toMatch(/removed/i);
  });

  it('reports removing a package that is not there as a failure', async () => {
    const result = await removePackage({}, form({ org: ORG, shipment: SHIPMENT, package: ROW }));
    expect(result.error).toBeTruthy();
    expect(state.calls).toContainEqual(['eq', 'org_id', ORG]);
  });

  it('reports removing an allocation that is not there as a failure', async () => {
    const result = await removeAllocation(
      {},
      form({ org: ORG, shipment: SHIPMENT, allocation: ROW }),
    );
    expect(result.error).toMatch(/could not be removed/);
    expect(state.calls).toContainEqual(['eq', 'org_id', ORG]);
  });

  it('reports editing a company outside the organization as not found, not saved', async () => {
    const result = await saveCompany(
      {},
      form({ org: ORG, company: ROW, kind: 'customer', name: 'Haugland AS' }),
    );
    expect(result.error).toBe('That company could not be found in this organization.');
    expect(state.calls).toContainEqual(['eq', 'org_id', ORG]);
  });
});

describe('shipment terms', () => {
  it('asks for the named place an Incoterms rule needs', async () => {
    const result = await updateShipment(
      {},
      form({ org: ORG, shipment: SHIPMENT, incoterm: 'FOB', incoterm_place: '' }),
    );
    expect(result.fields?.incoterm_place).toMatch(/Name the place that goes with FOB/);
    expect(state.calls).toEqual([]);
  });

  it('refuses an Incoterm that is not an Incoterms 2020 rule', async () => {
    const result = await updateShipment(
      {},
      form({ org: ORG, shipment: SHIPMENT, incoterm: 'XYZ', incoterm_place: 'Hamburg' }),
    );
    expect(result.fields?.incoterm).toBeTruthy();
  });

  it('saves only against the revision the form was rendered from', async () => {
    state.rows = [{ id: SHIPMENT }];
    await updateShipment({}, form({ org: ORG, shipment: SHIPMENT, revision: '7' }));
    expect(state.calls).toContainEqual(['eq', 'revision', 7]);
  });

  it('says someone else changed the shipment when the revision moved on', async () => {
    state.queue = [
      { data: [], error: null },
      { data: { id: SHIPMENT }, error: null },
    ];
    const result = await updateShipment({}, form({ org: ORG, shipment: SHIPMENT, revision: '7' }));
    expect(result.error).toMatch(/Someone changed this shipment after you opened it/);
  });

  it('accepts a shipping date only as a real calendar day', async () => {
    const result = await updateShipment(
      {},
      form({ org: ORG, shipment: SHIPMENT, shipped_on: '2026-02-30' }),
    );
    expect(result.fields?.shipped_on).toBeTruthy();
  });

  it('saves a buyer reference and proforma validity date when the form carries them', async () => {
    state.rows = [{ id: SHIPMENT }];
    await updateShipment(
      {},
      form({
        org: ORG,
        shipment: SHIPMENT,
        buyer_reference: '  PO-4471 ',
        proforma_valid_until: '2026-11-30',
      }),
    );
    const update = state.calls.find((call) => call[0] === 'update');
    expect(update?.[1]).toMatchObject({
      buyer_reference: 'PO-4471',
      proforma_valid_until: '2026-11-30',
    });
  });

  it('never clears the commercial terms from a form without those fields', async () => {
    state.rows = [{ id: SHIPMENT }];
    await updateShipment({}, form({ org: ORG, shipment: SHIPMENT }));
    const update = state.calls.find((call) => call[0] === 'update');
    expect(update?.[1]).not.toHaveProperty('buyer_reference');
    expect(update?.[1]).not.toHaveProperty('proforma_valid_until');
  });

  it('refuses a buyer reference over 60 characters and an impossible validity date', async () => {
    const result = await updateShipment(
      {},
      form({
        org: ORG,
        shipment: SHIPMENT,
        buyer_reference: 'P'.repeat(61),
        proforma_valid_until: '2026-02-30',
      }),
    );
    expect(result.fields?.buyer_reference).toBeTruthy();
    expect(result.fields?.proforma_valid_until).toBeTruthy();
    expect(state.calls).toEqual([]);
  });
});

describe('lines', () => {
  it('reads a European decimal comma in a quantity', async () => {
    const result = await addItem(
      {},
      form({ org: ORG, shipment: SHIPMENT, description: 'Hinge', quantity: '1,5' }),
    );
    expect(result.notice).toBe('Line added.');
    const insert = state.calls.find(([method]) => method === 'insert');
    expect(insert?.[1]).toMatchObject({ quantity: 1.5, unit_price: 0, position: 1 });
  });

  it('refuses a gross weight below the net weight before writing', async () => {
    const result = await addItem(
      {},
      form({
        org: ORG,
        shipment: SHIPMENT,
        description: 'Hinge',
        quantity: '10',
        net_weight_kg: '5',
        gross_weight_kg: '4',
      }),
    );
    expect(result.fields?.gross_weight_kg).toBe('Gross weight cannot be less than net weight.');
    expect(state.calls.some(([method]) => method === 'insert')).toBe(false);
  });

  it('says how many decimal places a price may have', async () => {
    const result = await addItem(
      {},
      form({
        org: ORG,
        shipment: SHIPMENT,
        description: 'Hinge',
        quantity: '1',
        unit_price: '0.12345',
      }),
    );
    expect(result.fields?.unit_price).toBe('Use at most 4 decimal places for the unit price.');
  });
});

describe('regulated document gate', () => {
  it('refuses a certificate of origin while regulated documents are disabled', async () => {
    const result = await generateDocument(
      {},
      form({ org: ORG, shipment: SHIPMENT, kind: 'certificate_of_origin' }),
    );
    expect(result.error).toMatch(/pending legal and regulatory review/);
    expect(state.rpc).not.toHaveBeenCalled();
  });

  it('still generates an unregulated document', async () => {
    const result = await generateDocument(
      {},
      form({ org: ORG, shipment: SHIPMENT, kind: 'commercial_invoice' }),
    );
    expect(result.notice).toMatch(/generated/i);
    expect(state.rpc).toHaveBeenCalledOnce();
  });
});

describe('document lifecycle', () => {
  it('names the new number and says the earlier revision was superseded', async () => {
    state.rows = [{ number: 'CI-2026-0002', supersedes_id: ROW }];
    const result = await generateDocument(
      {},
      form({ org: ORG, shipment: SHIPMENT, kind: 'commercial_invoice' }),
    );
    expect(result.notice).toBe(
      'Document CI-2026-0002 generated. The earlier revision of this type is now marked superseded.',
    );
  });

  it('asks for a reason before voiding', async () => {
    const result = await voidDocument(
      {},
      form({ org: ORG, shipment: SHIPMENT, document: ROW, reason: ' ' }),
    );
    expect(result.fields?.reason).toBeTruthy();
    expect(state.rpc).not.toHaveBeenCalled();
  });

  it('shows the role refusal from the void routine in words', async () => {
    state.rpc.mockResolvedValue({
      data: null,
      error: { code: '42501', message: 'Only an owner or administrator can void a document.' },
    });
    const result = await voidDocument(
      {},
      form({ org: ORG, shipment: SHIPMENT, document: ROW, reason: 'Issued in error' }),
    );
    expect(result.error).toBe('Only an owner or administrator can void a document.');
    expect(state.rpc).toHaveBeenCalledWith('void_document', {
      target_document: ROW,
      reason: 'Issued in error',
    });
  });
});

describe('reusing a shipment', () => {
  it('opens the new draft once it is copied', async () => {
    await duplicateShipment({}, form({ org: ORG, shipment: SHIPMENT, reference: 'KES-2' }));
    expect(state.rpc).toHaveBeenCalledWith('duplicate_shipment', {
      source_shipment: SHIPMENT,
      new_reference: 'KES-2',
    });
    expect(state.redirect).toHaveBeenCalledWith(`/app/${ORG}/shipments/${ROW}`);
  });

  it('puts a duplicate reference on the reference field', async () => {
    state.rpc.mockResolvedValue({ data: null, error: { code: '23505', message: 'exists' } });
    const result = await duplicateShipment(
      {},
      form({ org: ORG, shipment: SHIPMENT, reference: 'KES-1' }),
    );
    expect(result.fields?.reference).toBe('A shipment with that reference already exists.');
    expect(state.redirect).not.toHaveBeenCalled();
  });
});

describe('packing', () => {
  it('says how much of the line is already packed when an allocation is too large', async () => {
    state.queue = [
      {
        data: null,
        error: {
          code: '23514',
          message: 'That allocation packs more than the line holds.',
          details: '{"line_quantity" : 100.000, "allocated_elsewhere" : 80.000}',
        },
      },
    ];
    const result = await allocateToPackage(
      {},
      form({ org: ORG, shipment: SHIPMENT, package: ROW, item: ROW, quantity: '30' }),
    );
    expect(result.fields?.quantity).toBe(
      'That is more than the line holds: 100 in total, 80 already in other packages.',
    );
  });
});

describe('catalog import', () => {
  it('checks a file without writing it, keyed to the lines of the file', async () => {
    state.rpc.mockResolvedValue({
      data: { inserted: 1, updated: 0, problems: [], dry_run: true },
      error: null,
    });
    const result = await importCatalog(
      {},
      form({
        org: ORG,
        intent: 'preview',
        text: 'description,net weight\nHinge,abc\n\nBracket,"1,5"',
      }),
    );
    expect(result.previewed).toEqual({ inserted: 1, updated: 0 });
    expect(result.notice).toMatch(/Nothing has been written yet/);
    expect(result.checked).toContain('Bracket');
    const [name, args] = state.rpc.mock.calls[0] ?? [];
    expect(name).toBe('import_products');
    expect(args).toMatchObject({ target_org: ORG, dry_run: true });
    // The unreadable weight reaches the routine as written, so it is reported, not blanked.
    expect((args as { rows: unknown[] }).rows).toEqual([
      expect.objectContaining({ line: 2, description: 'Hinge', net_weight_kg: 'abc' }),
      expect.objectContaining({ line: 4, description: 'Bracket', net_weight_kg: '1.5' }),
    ]);
  });

  it('lists the rows to fix when a check finds problems', async () => {
    state.rpc.mockResolvedValue({
      data: {
        inserted: 0,
        updated: 0,
        problems: [{ row: 2, problem: 'Net weight "abc" is not a number of zero or more.' }],
        dry_run: true,
      },
      error: null,
    });
    const result = await importCatalog(
      {},
      form({ org: ORG, intent: 'preview', text: 'description,net weight\nHinge,abc' }),
    );
    expect(result.error).toBe('1 row needs correcting before this file can be imported.');
    expect(result.problems).toHaveLength(1);
  });

  it('refuses a file over the row limit before calling the database', async () => {
    const rows = Array.from({ length: 2001 }, (_, index) => `Item ${index}`).join('\n');
    const result = await importCatalog({}, form({ org: ORG, text: `description\n${rows}` }));
    expect(result.error).toMatch(/Import at most 2000 at a time/);
    expect(state.rpc).not.toHaveBeenCalled();
  });
});

describe('document settings', () => {
  it('reports the row policy refusing a member', async () => {
    state.queue = [{ data: null, error: { code: '42501', message: 'row-level security' } }];
    const result = await saveDocumentSettings(
      {},
      form({ org: ORG, default_currency: 'EUR', number_prefix: 'acme' }),
    );
    expect(result.error).toBe('Only an owner or administrator can change document settings.');
    const upsert = state.calls.find(([method]) => method === 'upsert');
    expect(upsert?.[1]).toMatchObject({ org_id: ORG, number_prefix: 'ACME', updated_by: USER });
  });

  it('refuses a prefix that would not be safe in a document number', async () => {
    const result = await saveDocumentSettings({}, form({ org: ORG, number_prefix: 'AC-ME' }));
    expect(result.fields?.number_prefix).toBeTruthy();
  });
});
