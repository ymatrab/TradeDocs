import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateDocument, removeItem, updateShipment } from '@/app/(app)/shipment-actions';
import { removePackage } from '@/app/(app)/master-data-actions';

/**
 * A filter that matches no row is not an error to PostgREST, so an action that only
 * checked `error` reported success for a row the caller could not see. These tests hold
 * the actions to the row count instead.
 */
const state = vi.hoisted(() => ({
  rows: [] as unknown[],
  calls: [] as unknown[][],
  rpc: vi.fn(),
}));

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('next/navigation', () => ({ redirect: vi.fn() }));
vi.mock('@/lib/supabase/server', () => {
  const query = (): Record<string, unknown> => {
    const chain: Record<string, unknown> = {};
    for (const method of ['update', 'delete', 'insert', 'select', 'eq', 'order', 'limit']) {
      chain[method] = (...args: unknown[]) => {
        state.calls.push([method, ...args]);
        return chain;
      };
    }
    chain.maybeSingle = async () => ({ data: state.rows[0] ?? null, error: null });
    chain.then = (resolve: (value: unknown) => unknown) =>
      resolve({ data: state.rows, error: null });
    return chain;
  };
  return {
    createClient: async () => ({
      from: (table: string) => {
        state.calls.push(['from', table]);
        return query();
      },
      rpc: state.rpc,
    }),
  };
});


const ORG = '11111111-1111-4111-8111-111111111111';
const SHIPMENT = '22222222-2222-4222-8222-222222222222';
const ROW = '33333333-3333-4333-8333-333333333333';

function form(values: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

beforeEach(() => {
  state.rows = [];
  state.calls = [];
  state.rpc.mockReset();
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
