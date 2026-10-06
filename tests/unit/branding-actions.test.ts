import { createHash } from 'node:crypto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { removeBrandingImage, uploadBrandingImage } from '@/app/(app)/branding-actions';
import { MAX_BRANDING_BYTES } from '@/lib/limits';
import { redBluePng } from '../fixtures/images';

/**
 * The branding actions: the paid gate is checked before anything is stored (fail closed),
 * only owners and admins act, the bytes are validated server-side whatever the browser
 * claimed, and objects get their content-addressed name.
 */
const state = vi.hoisted(() => ({
  entitled: false,
  role: 'owner' as string | null,
  /** Results for successive table queries. */
  queue: [] as { data: unknown; error: unknown }[],
  calls: [] as unknown[][],
  uploads: [] as unknown[][],
  removals: [] as unknown[][],
  inUse: false,
  userId: '44444444-4444-4444-8444-444444444444',
}));

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('@/lib/billing/server', () => ({ hasEntitlement: async () => state.entitled }));
vi.mock('@/lib/security/auth-limits', () => ({
  AUTH_LIMITS: { brandingUpload: { namespace: 'test', limit: 30, windowSeconds: 3600 } },
  actionContext: async () => ({ env: {} }),
  consumeQuotas: async () => ({ ok: true }),
  userSubject: (id: string) => `user:${id}`,
}));
vi.mock('@/lib/supabase/server', () => {
  const query = (table: string): Record<string, unknown> => {
    const chain: Record<string, unknown> = {};
    for (const method of ['select', 'eq', 'upsert', 'delete']) {
      chain[method] = (...args: unknown[]) => {
        state.calls.push([table, method, ...args]);
        return chain;
      };
    }
    const next = () =>
      table === 'memberships'
        ? { data: state.role ? { role: state.role } : null, error: null }
        : (state.queue.shift() ?? { data: null, error: null });
    chain.maybeSingle = async () => next();
    chain.then = (resolve: (value: unknown) => unknown) => resolve(next());
    return chain;
  };
  return {
    createClient: async () => ({
      from: (table: string) => query(table),
      rpc: async () => ({ data: state.inUse, error: null }),
      auth: { getUser: async () => ({ data: { user: { id: state.userId } } }) },
      storage: {
        from: () => ({
          upload: async (...args: unknown[]) => {
            state.uploads.push(args);
            return { error: null };
          },
          remove: async (...args: unknown[]) => {
            state.removals.push(args);
            return { error: null };
          },
        }),
      },
    }),
  };
});

const ORG = '11111111-1111-4111-8111-111111111111';

function form(values: Record<string, string>, image?: Uint8Array, type = 'image/png'): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  if (image) data.set('image', new File([image], 'logo.png', { type }));
  return data;
}

beforeEach(() => {
  state.entitled = false;
  state.role = 'owner';
  state.queue = [];
  state.calls = [];
  state.uploads = [];
  state.removals = [];
  state.inUse = false;
});

describe('uploading a branding image', () => {
  it('refuses an organization without Pro or Team before storing anything', async () => {
    const result = await uploadBrandingImage({}, form({ org: ORG, slot: 'logo' }, redBluePng()));
    expect(result.error).toMatch(/Branding is part of Pro/);
    expect(state.uploads).toEqual([]);
    expect(state.calls.some(([table]) => table === 'branding_assets')).toBe(false);
  });

  it('refuses a plain member', async () => {
    state.entitled = true;
    state.role = 'member';
    const result = await uploadBrandingImage({}, form({ org: ORG, slot: 'logo' }, redBluePng()));
    expect(result.error).toMatch(/owner or administrator/);
    expect(state.uploads).toEqual([]);
  });

  it('refuses bytes that are not a PNG or JPEG, whatever type the browser sent', async () => {
    state.entitled = true;
    const svg = new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"/>');
    const result = await uploadBrandingImage({}, form({ org: ORG, slot: 'logo' }, svg));
    expect(result.fields?.image).toBe('Use a PNG or JPEG image.');
    expect(state.uploads).toEqual([]);
  });

  it('refuses a file over the size limit', async () => {
    state.entitled = true;
    const big = new Uint8Array(MAX_BRANDING_BYTES + 1);
    const result = await uploadBrandingImage({}, form({ org: ORG, slot: 'logo' }, big));
    expect(result.error).toMatch(/1 MB/);
    expect(state.uploads).toEqual([]);
  });

  it('refuses an unknown slot', async () => {
    state.entitled = true;
    const result = await uploadBrandingImage({}, form({ org: ORG, slot: 'favicon' }, redBluePng()));
    expect(result.error).toBeTruthy();
    expect(state.uploads).toEqual([]);
  });

  it('stores a valid image under its content-addressed name and records it', async () => {
    state.entitled = true;
    const bytes = redBluePng();
    const sha = createHash('sha256').update(bytes).digest('hex');
    state.queue = [
      { data: null, error: null }, // no previous logo
      { data: [{ org_id: ORG }], error: null }, // the upsert
    ];
    const result = await uploadBrandingImage({}, form({ org: ORG, slot: 'logo' }, bytes));
    expect(result.error).toBeUndefined();
    expect(result.notice).toMatch(/Logo saved/);
    expect(state.uploads).toHaveLength(1);
    const [path, , options] = state.uploads[0] ?? [];
    expect(path).toBe(`org/${ORG}/assets/${sha}.png`);
    expect(options).toMatchObject({ contentType: 'image/png', upsert: false });
    const upsert = state.calls.find(([, method]) => method === 'upsert');
    expect(upsert?.[0]).toBe('branding_assets');
    expect(upsert?.[2]).toMatchObject({ org_id: ORG, slot: 'logo', sha256: sha, width: 2 });
  });

  it('deletes the replaced image only when nothing refers to it any more', async () => {
    state.entitled = true;
    const hash = 'b'.repeat(64);
    const previous = { sha256: hash, object_path: `org/${ORG}/assets/${hash}.png` };
    state.queue = [
      { data: previous, error: null },
      { data: [{ org_id: ORG }], error: null },
    ];
    await uploadBrandingImage({}, form({ org: ORG, slot: 'logo' }, redBluePng()));
    expect(state.removals).toEqual([[[previous.object_path]]]);

    state.removals = [];
    state.inUse = true;
    state.queue = [
      { data: previous, error: null },
      { data: [{ org_id: ORG }], error: null },
    ];
    await uploadBrandingImage({}, form({ org: ORG, slot: 'logo' }, redBluePng()));
    expect(state.removals).toEqual([]);
  });
});

describe('removing a branding image', () => {
  it('works without a paid plan, so a lapsed organization can take its images down', async () => {
    const hash = 'c'.repeat(64);
    const row = { sha256: hash, object_path: `org/${ORG}/assets/${hash}.png` };
    state.queue = [{ data: [row], error: null }];
    const result = await removeBrandingImage({}, form({ org: ORG, slot: 'signature' }));
    expect(result.notice).toMatch(/Signature or stamp removed/);
    expect(state.removals).toEqual([[[row.object_path]]]);
  });

  it('refuses a plain member', async () => {
    state.role = 'member';
    const result = await removeBrandingImage({}, form({ org: ORG, slot: 'logo' }));
    expect(result.error).toMatch(/owner or administrator/);
    expect(state.calls.some(([table]) => table === 'branding_assets')).toBe(false);
  });
});
