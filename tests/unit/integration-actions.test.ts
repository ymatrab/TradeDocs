import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  connectProvider,
  disconnectProvider,
  importFromProvider,
} from '@/app/(app)/integration-actions';

/**
 * The integration actions: unconfigured providers do nothing, only owners and admins act,
 * connecting and importing are paid and checked before any provider call (fail closed),
 * disconnecting needs no plan, and an import's check is a dry run.
 */
const ORG = '11111111-1111-4111-8111-111111111111';

const state = vi.hoisted(() => ({
  configured: true,
  entitled: false,
  role: 'owner' as string | null,
  user: { id: '22222222-2222-4222-8222-222222222222' } as { id: string } | null,
  begun: 0,
  prepared: 0,
  removed: 0,
  rpc: [] as unknown[][],
}));

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('next/navigation', () => ({
  redirect: (location: string) => {
    throw Object.assign(new Error('NEXT_REDIRECT'), { location });
  },
}));
vi.mock('@/lib/billing/server', () => ({ hasEntitlement: async () => state.entitled }));
vi.mock('@/lib/security/auth-limits', () => ({
  AUTH_LIMITS: {
    integrationConnect: { namespace: 'test', limit: 10, windowSeconds: 60 },
    integrationImport: { namespace: 'test', limit: 10, windowSeconds: 60 },
  },
  actionContext: async () => ({ env: {} }),
  consumeQuotas: async () => ({ ok: true }),
  userSubject: (id: string) => `user:${id}`,
}));
vi.mock('@/lib/integrations/server', () => ({
  currentProviderConfig: () =>
    state.configured ? { state: 'ready', provider: 'xero' } : { state: 'disabled', missing: [] },
  beginAuthorization: async () => {
    state.begun += 1;
    return 'https://login.xero.com/identity/connect/authorize?state=s';
  },
  removeConnection: async () => {
    state.removed += 1;
    return { removed: true, revoked: true };
  },
}));
vi.mock('@/lib/integrations/importer', async (original) => ({
  ...(await original<typeof import('@/lib/integrations/importer')>()),
  prepareImport: async () => {
    state.prepared += 1;
    return {
      rows: [{ external_id: 'x1', line: 1, values: { name: 'Harbour Imports' } }],
      notes: [],
      ignored: 0,
      truncated: false,
      read: 1,
    };
  },
}));
vi.mock('@/lib/supabase/server', () => ({
  getUser: async () => state.user,
  createClient: async () => {
    const chain = {
      select: () => chain,
      eq: () => chain,
      maybeSingle: async () => ({ data: state.role ? { role: state.role } : null, error: null }),
    };
    return {
      from: () => chain,
      rpc: async (...args: unknown[]) => {
        state.rpc.push(args);
        return {
          data: { inserted: 1, updated: 0, unchanged: 0, problems: [], conflicts: [], skipped: [] },
          error: null,
        };
      },
    };
  },
}));

function form(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [name, value] of Object.entries({ org: ORG, provider: 'xero', ...fields })) {
    data.set(name, value);
  }
  return data;
}

beforeEach(() => {
  state.configured = true;
  state.entitled = false;
  state.role = 'owner';
  state.user = { id: '22222222-2222-4222-8222-222222222222' };
  state.begun = 0;
  state.prepared = 0;
  state.removed = 0;
  state.rpc = [];
});

describe('connecting', () => {
  it('does nothing for a provider this site has not configured', async () => {
    state.entitled = true;
    state.configured = false;
    const result = await connectProvider({}, form({}));
    expect(result.error).toMatch(/not available/);
    expect(state.begun).toBe(0);
  });

  it('refuses a plain member', async () => {
    state.entitled = true;
    state.role = 'member';
    const result = await connectProvider({}, form({}));
    expect(result.error).toMatch(/owner or administrator/);
    expect(state.begun).toBe(0);
  });

  it('refuses an organization without a paid plan before starting anything', async () => {
    const result = await connectProvider({}, form({}));
    expect(result.error).toMatch(/Pro and Team/);
    expect(state.begun).toBe(0);
  });

  it('refuses an unknown provider', async () => {
    state.entitled = true;
    const result = await connectProvider({}, form({ provider: 'sage' }));
    expect(result.error).toBeDefined();
    expect(state.begun).toBe(0);
  });

  it('sends an entitled owner to the provider', async () => {
    state.entitled = true;
    await expect(connectProvider({}, form({}))).rejects.toMatchObject({
      location: expect.stringMatching(/^https:\/\/login\.xero\.com\//),
    });
    expect(state.begun).toBe(1);
  });
});

describe('importing', () => {
  it('refuses without a paid plan and never reads the provider', async () => {
    const result = await importFromProvider({}, form({ entity: 'company', intent: 'preview' }));
    expect(result.error).toMatch(/Pro and Team/);
    expect(state.prepared).toBe(0);
    expect(state.rpc).toHaveLength(0);
  });

  it('checks as a dry run', async () => {
    state.entitled = true;
    const result = await importFromProvider({}, form({ entity: 'company', intent: 'preview' }));
    expect(result.previewed).toBe(true);
    expect(state.rpc[0]?.[0]).toBe('import_integration_records');
    expect(state.rpc[0]?.[1]).toMatchObject({ target_org: ORG, source: 'xero', record_kind: 'company', dry_run: true });
  });

  it('applies only when asked', async () => {
    state.entitled = true;
    const result = await importFromProvider({}, form({ entity: 'product', intent: 'apply' }));
    expect(result.applied).toBe(true);
    expect(state.rpc[0]?.[1]).toMatchObject({ record_kind: 'product', dry_run: false });
  });

  it('refuses an unknown entity', async () => {
    state.entitled = true;
    const result = await importFromProvider({}, form({ entity: 'invoices' }));
    expect(result.error).toBeDefined();
    expect(state.prepared).toBe(0);
  });
});

describe('disconnecting', () => {
  it('needs no plan, so a lapsed organization can still revoke access', async () => {
    const result = await disconnectProvider({}, form({}));
    expect(result.notice).toMatch(/revoked/);
    expect(state.removed).toBe(1);
  });

  it('is for owners and administrators only', async () => {
    state.role = 'member';
    const result = await disconnectProvider({}, form({}));
    expect(result.error).toMatch(/owner or administrator/);
    expect(state.removed).toBe(0);
  });
});
