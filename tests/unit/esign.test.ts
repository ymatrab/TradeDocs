import { createHmac } from 'node:crypto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  basicAuthorization,
  buildSendForm,
  callbackEventSchema,
  createDropboxSignClient,
  DROPBOX_SIGN_API,
  isPdf,
  mapRequestStatus,
  mapSignerStatus,
  metadataRequestId,
  signatureRequestSchema,
  signerStates,
  verifyEventHash,
  type DropboxSignClient,
  type SignerState,
} from '@/lib/esign/dropbox-sign';
import {
  eventKey,
  handleVerifiedEvent,
  parseStoredSigners,
  RetryableCallbackError,
  type CallbackDeps,
  type StoredRequest,
} from '@/lib/esign/callback';
import { esignConfig } from '@/lib/esign/config';
import { initialSigners, parseSendForm, requestTexts } from '@/lib/esign/request';
import {
  FEATURES,
  featurePlans,
  offeredFeatures,
  paidAdditions,
  paidOnlySummary,
  PROVIDER_FEATURES,
} from '@/lib/billing/plans';
import { hasEntitlement } from '@/lib/billing/server';
import { MAX_ESIGN_MESSAGE, MAX_ESIGN_SIGNERS } from '@/lib/limits';
import {
  callbackEvent,
  liveRequest,
  ORG_ID,
  PROVIDER_ID,
  ROW_ID,
  SIGNED_PDF,
  TEST_API_KEY,
} from '../fixtures/dropbox-sign';

const entitlement = vi.hoisted(() => ({
  result: { data: null as unknown, error: null as unknown },
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => {
    const chain = {
      select: () => chain,
      eq: () => chain,
      maybeSingle: async () => entitlement.result,
    };
    return { from: () => chain };
  },
}));

function hashOf(eventTime: string, eventType: string, key = TEST_API_KEY): string {
  return createHmac('sha256', key).update(`${eventTime}${eventType}`).digest('hex');
}

// --- Event hash ---------------------------------------------------------------------------

describe('event hash verification', () => {
  const time = '1760000000';
  const type = 'signature_request_all_signed';

  it('accepts the documented HMAC-SHA256 of event_time + event_type, keyed with the API key', () => {
    expect(verifyEventHash({ event_time: time, event_type: type, event_hash: hashOf(time, type) }, TEST_API_KEY)).toBe(true);
  });

  it('accepts the same hash in upper case', () => {
    const upper = hashOf(time, type).toUpperCase();
    expect(verifyEventHash({ event_time: time, event_type: type, event_hash: upper }, TEST_API_KEY)).toBe(true);
  });

  it('refuses a hash made with another key', () => {
    const other = hashOf(time, type, 'anotheraccountsdropboxsignkeyxxxxx');
    expect(verifyEventHash({ event_time: time, event_type: type, event_hash: other }, TEST_API_KEY)).toBe(false);
  });

  it('refuses an event whose type or time was changed after signing', () => {
    const hash = hashOf(time, 'signature_request_viewed');
    expect(verifyEventHash({ event_time: time, event_type: type, event_hash: hash }, TEST_API_KEY)).toBe(false);
    expect(
      verifyEventHash({ event_time: '1760000001', event_type: type, event_hash: hashOf(time, type) }, TEST_API_KEY),
    ).toBe(false);
  });

  it('refuses malformed hashes and times without comparing', () => {
    expect(verifyEventHash({ event_time: time, event_type: type, event_hash: '' }, TEST_API_KEY)).toBe(false);
    expect(verifyEventHash({ event_time: time, event_type: type, event_hash: 'zz'.repeat(32) }, TEST_API_KEY)).toBe(false);
    expect(
      verifyEventHash({ event_time: 'yesterday', event_type: type, event_hash: hashOf('yesterday', type) }, TEST_API_KEY),
    ).toBe(false);
  });

  it('refuses to run without a key', () => {
    expect(() => verifyEventHash({ event_time: time, event_type: type, event_hash: hashOf(time, type) }, '')).toThrow();
  });

  it('parses the documented callback shape, numeric event_time included', () => {
    const parsed = callbackEventSchema.parse({
      event: { event_time: 1760000000, event_type: type, event_hash: hashOf(time, type) },
      signature_request: { signature_request_id: PROVIDER_ID },
    });
    expect(parsed.event.event_time).toBe(time);
    expect(verifyEventHash(parsed.event, TEST_API_KEY)).toBe(true);
  });
});

// --- Request building ---------------------------------------------------------------------

describe('request building', () => {
  const base = {
    pdf: SIGNED_PDF,
    fileName: 'CI-2026-0001.pdf',
    title: 'Commercial invoice CI-2026-0001',
    subject: 'Please sign commercial invoice CI-2026-0001',
    message: 'Please sign by Friday.',
    signers: [
      { name: 'Buyer', email: 'buyer@example.test' },
      { name: 'Agent', email: 'agent@example.test' },
    ],
    testMode: true,
    clientId: null,
    requestId: ROW_ID,
  };

  it('uses Basic auth with the key as the user name and an empty password', () => {
    expect(basicAuthorization(TEST_API_KEY)).toBe(
      `Basic ${Buffer.from(`${TEST_API_KEY}:`).toString('base64')}`,
    );
  });

  it('builds the documented multipart fields', () => {
    const form = buildSendForm(base);
    const file = form.get('files[0]');
    expect(file).toBeInstanceOf(Blob);
    expect((file as File).type).toBe('application/pdf');
    expect((file as File).name).toBe('CI-2026-0001.pdf');
    expect(form.get('title')).toBe(base.title);
    expect(form.get('subject')).toBe(base.subject);
    expect(form.get('message')).toBe(base.message);
    expect(form.get('signers[0][email_address]')).toBe('buyer@example.test');
    expect(form.get('signers[0][name]')).toBe('Buyer');
    expect(form.get('signers[1][email_address]')).toBe('agent@example.test');
    expect(form.get('metadata[tradedocs_request_id]')).toBe(ROW_ID);
    expect(form.get('test_mode')).toBe('1');
    expect(form.has('client_id')).toBe(false);
  });

  it('sends a live request only when told, and the API app when configured', () => {
    const form = buildSendForm({ ...base, testMode: false, clientId: 'abcdef0123456789abcdef0123456789', message: null });
    expect(form.get('test_mode')).toBe('0');
    expect(form.get('client_id')).toBe('abcdef0123456789abcdef0123456789');
    expect(form.has('message')).toBe(false);
  });

  it('clips texts to the provider limits', () => {
    const form = buildSendForm({ ...base, title: 'T'.repeat(400), subject: 'S'.repeat(400) });
    expect((form.get('title') as string).length).toBe(255);
    expect((form.get('subject') as string).length).toBe(255);
  });

  it('names the request after the document', () => {
    expect(requestTexts('CI-2026-0001', 'Commercial invoice')).toEqual({
      title: 'Commercial invoice CI-2026-0001',
      subject: 'Please sign commercial invoice CI-2026-0001',
    });
  });
});

describe('the send form', () => {
  function form(fields: Record<string, string>): FormData {
    const data = new FormData();
    data.set('org', ORG_ID);
    data.set('document', ROW_ID);
    for (const [key, value] of Object.entries(fields)) data.set(key, value);
    return data;
  }

  it('accepts signers, lower-cases emails and skips blank rows', () => {
    const parsed = parseSendForm(
      form({ signer_name_0: ' Buyer ', signer_email_0: 'Buyer@Example.TEST', signer_name_2: 'Agent', signer_email_2: 'agent@example.test', message: ' Hi ' }),
    );
    expect(parsed).toEqual({
      ok: true,
      value: {
        org: ORG_ID,
        document: ROW_ID,
        signers: [
          { name: 'Buyer', email: 'buyer@example.test' },
          { name: 'Agent', email: 'agent@example.test' },
        ],
        message: 'Hi',
      },
    });
  });

  it('requires at least one signer', () => {
    const parsed = parseSendForm(form({}));
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) expect(parsed.fields?.signer_email_0).toBe('Add at least one signer.');
  });

  it('refuses an invalid email, a missing name and a repeated address', () => {
    const parsed = parseSendForm(
      form({
        signer_name_0: 'Buyer',
        signer_email_0: 'not-an-email',
        signer_email_1: 'agent@example.test',
        signer_name_2: 'Again',
        signer_email_2: 'agent@example.test',
        signer_name_3: 'Again',
        signer_email_3: 'AGENT@example.test',
      }),
    );
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.fields?.signer_email_0).toBeDefined();
      expect(parsed.fields?.signer_name_1).toBeDefined();
      expect(parsed.fields?.signer_email_3).toBe('Each signer needs a different email address.');
    }
  });

  it(`reads at most ${MAX_ESIGN_SIGNERS} signers`, () => {
    const fields: Record<string, string> = {};
    for (let index = 0; index < MAX_ESIGN_SIGNERS + 2; index += 1) {
      fields[`signer_name_${index}`] = `Signer ${index}`;
      fields[`signer_email_${index}`] = `signer${index}@example.test`;
    }
    const parsed = parseSendForm(form(fields));
    expect(parsed.ok && parsed.value.signers.length).toBe(MAX_ESIGN_SIGNERS);
  });

  it('bounds the message and refuses a foreign target', () => {
    const long = parseSendForm(
      form({ signer_name_0: 'B', signer_email_0: 'b@example.test', message: 'x'.repeat(MAX_ESIGN_MESSAGE + 1) }),
    );
    expect(long.ok).toBe(false);
    const data = form({ signer_name_0: 'B', signer_email_0: 'b@example.test' });
    data.set('document', '../../etc');
    expect(parseSendForm(data).ok).toBe(false);
  });

  it('stores new signers as awaiting signature', () => {
    expect(initialSigners([{ name: 'B', email: 'b@example.test' }])).toEqual([
      { name: 'B', email: 'b@example.test', status: 'awaiting_signature', signed_at: null },
    ]);
  });
});

// --- Status mapping -----------------------------------------------------------------------

describe('status mapping', () => {
  const now = 1760000500;
  const parse = (overrides: Record<string, unknown> = {}) =>
    signatureRequestSchema.parse(liveRequest(overrides));

  it('maps the overall request', () => {
    expect(mapRequestStatus(parse(), now)).toBe('sent');
    expect(mapRequestStatus(parse({ is_complete: true }), now)).toBe('signed');
    expect(mapRequestStatus(parse({ is_declined: true }), now)).toBe('declined');
    expect(mapRequestStatus(parse({ has_error: true }), now)).toBe('error');
    expect(mapRequestStatus(parse({ expires_at: now - 1 }), now)).toBe('expired');
    expect(mapRequestStatus(parse({ expires_at: now + 3600 }), now)).toBe('sent');
    // Completion outranks an expiry date that passed afterwards.
    expect(mapRequestStatus(parse({ is_complete: true, expires_at: now - 1 }), now)).toBe('signed');
  });

  it('maps signer status codes, unknown codes included', () => {
    expect(mapSignerStatus('awaiting_signature')).toBe('awaiting_signature');
    expect(mapSignerStatus('on_hold')).toBe('awaiting_signature');
    expect(mapSignerStatus('signed')).toBe('signed');
    expect(mapSignerStatus('declined')).toBe('declined');
    expect(mapSignerStatus('error_file')).toBe('error');
    expect(mapSignerStatus('something_new')).toBe('unknown');
    expect(mapSignerStatus(null)).toBe('unknown');
  });

  it('matches live signers to the recorded ones by email, keeping recorded names', () => {
    const recorded: SignerState[] = [
      { name: 'Buyer Ltd', email: 'buyer@example.test', status: 'awaiting_signature', signed_at: null },
      { name: 'Agent', email: 'agent@example.test', status: 'awaiting_signature', signed_at: null },
    ];
    expect(signerStates(recorded, parse())).toEqual([
      { name: 'Buyer Ltd', email: 'buyer@example.test', status: 'awaiting_signature', signed_at: null },
      { name: 'Agent', email: 'agent@example.test', status: 'signed', signed_at: new Date(1760000000 * 1000).toISOString() },
    ]);
  });

  it('reads our own id back from the metadata, and nothing else', () => {
    expect(metadataRequestId(parse())).toBe(ROW_ID);
    expect(metadataRequestId(parse({ metadata: { tradedocs_request_id: 'x' } }))).toBeNull();
    expect(metadataRequestId(parse({ metadata: null }))).toBeNull();
  });

  it('reads the stored signers defensively', () => {
    expect(parseStoredSigners([{ name: 'A', email: 'a@example.test', status: 'signed', signed_at: null }])).toHaveLength(1);
    expect(parseStoredSigners('nonsense')).toEqual([]);
  });
});

// --- Configuration ------------------------------------------------------------------------

describe('configuration', () => {
  const service = {
    APP_ENV: 'preview' as const,
    APPLICATION_MODE: 'service' as const,
    SUPABASE_URL: 'https://example.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: 'service-role-key-for-tests',
  };

  it('is disabled without an API key, so nothing claims it', () => {
    expect(esignConfig(service, {})).toEqual({ state: 'disabled' });
    expect(esignConfig(service, { DROPBOX_SIGN_API_KEY: '  ' })).toEqual({ state: 'disabled' });
  });

  it('always sends test requests outside production, whatever the flag says', () => {
    const config = esignConfig(service, { DROPBOX_SIGN_API_KEY: TEST_API_KEY, DROPBOX_SIGN_TEST_MODE: 'false' });
    expect(config).toMatchObject({ state: 'ready', testMode: true });
  });

  it('sends live requests in production unless the test flag is set', () => {
    const production = { ...service, APP_ENV: 'production' as const };
    expect(esignConfig(production, { DROPBOX_SIGN_API_KEY: TEST_API_KEY })).toMatchObject({ testMode: false });
    expect(
      esignConfig(production, { DROPBOX_SIGN_API_KEY: TEST_API_KEY, DROPBOX_SIGN_TEST_MODE: 'true' }),
    ).toMatchObject({ testMode: true });
  });

  it('fails this feature alone when a piece is missing or malformed', () => {
    expect(esignConfig(service, { DROPBOX_SIGN_API_KEY: 'short' })).toMatchObject({ state: 'misconfigured' });
    expect(
      esignConfig(service, { DROPBOX_SIGN_API_KEY: TEST_API_KEY, DROPBOX_SIGN_CLIENT_ID: 'bad id!' }),
    ).toMatchObject({ state: 'misconfigured' });
    expect(
      esignConfig({ ...service, APPLICATION_MODE: 'foundation' }, { DROPBOX_SIGN_API_KEY: TEST_API_KEY }),
    ).toMatchObject({ state: 'misconfigured' });
    expect(
      esignConfig({ ...service, SUPABASE_SERVICE_ROLE_KEY: undefined }, { DROPBOX_SIGN_API_KEY: TEST_API_KEY }),
    ).toMatchObject({ state: 'misconfigured' });
  });
});

// --- Plan gating --------------------------------------------------------------------------

describe('plan gating', () => {
  beforeEach(() => {
    entitlement.result = { data: null, error: null };
  });

  const current = {
    org_id: ORG_ID,
    plan: 'pro',
    status: 'active',
    paid_through: new Date(Date.now() + 86_400_000).toISOString(),
    cancel_at_period_end: false,
    revoked_at: null,
    revoke_reason: null,
    updated_at: new Date().toISOString(),
  };

  it('is a Pro and Team feature', () => {
    expect(featurePlans('esign')).toEqual(['pro', 'team']);
  });

  it('is not claimed on any public page until the provider is connected', () => {
    expect(FEATURES.some((feature) => (feature.key as string) === 'esign')).toBe(false);
    expect(PROVIDER_FEATURES.map((feature) => feature.key)).toEqual(['esign']);
    // Independent of the other paid features: whatever else is configured, the public copy
    // built from plans.ts never names e-signature or its provider.
    const everything = { quickbooks_import: true, xero_import: true } as const;
    for (const capabilities of [{}, everything]) {
      const copy = [
        paidOnlySummary(capabilities),
        paidAdditions(capabilities),
        ...offeredFeatures(capabilities).map((feature) => `${feature.label} ${feature.limit ?? ''}`),
      ].join(' ');
      expect(copy).not.toMatch(/e-?signature|dropbox sign/i);
      expect(offeredFeatures(capabilities).some((feature) => feature.key === 'esign')).toBe(false);
    }
  });

  it('grants a current Pro or Team plan', async () => {
    entitlement.result = { data: current, error: null };
    await expect(hasEntitlement(ORG_ID, 'esign')).resolves.toBe(true);
    entitlement.result = { data: { ...current, plan: 'team' }, error: null };
    await expect(hasEntitlement(ORG_ID, 'esign')).resolves.toBe(true);
  });

  it('fails closed: no plan, a failed lookup or a lapsed plan refuse', async () => {
    await expect(hasEntitlement(ORG_ID, 'esign')).resolves.toBe(false);
    entitlement.result = { data: null, error: { message: 'unavailable' } };
    await expect(hasEntitlement(ORG_ID, 'esign')).resolves.toBe(false);
    entitlement.result = { data: { ...current, paid_through: '2020-01-01T00:00:00Z' }, error: null };
    await expect(hasEntitlement(ORG_ID, 'esign')).resolves.toBe(false);
  });
});

// --- The HTTP client ----------------------------------------------------------------------

describe('the Dropbox Sign client', () => {
  function fakeFetch(response: Response) {
    const calls: { url: string; init: RequestInit }[] = [];
    const fetcher = (async (url: string | URL, init?: RequestInit) => {
      calls.push({ url: String(url), init: init ?? {} });
      return response;
    }) as typeof fetch;
    return { fetcher, calls };
  }

  it('sends to the documented endpoint with Basic auth and a multipart body', async () => {
    const { fetcher, calls } = fakeFetch(Response.json({ signature_request: liveRequest() }));
    const client = createDropboxSignClient(TEST_API_KEY, fetcher);
    const result = await client.send({
      pdf: SIGNED_PDF,
      fileName: 'CI.pdf',
      title: 't',
      subject: 's',
      message: null,
      signers: [{ name: 'B', email: 'b@example.test' }],
      testMode: true,
      clientId: null,
      requestId: ROW_ID,
    });
    expect(result).toMatchObject({ ok: true, request: { signature_request_id: PROVIDER_ID } });
    expect(calls[0]?.url).toBe(`${DROPBOX_SIGN_API}/signature_request/send`);
    expect(calls[0]?.init.method).toBe('POST');
    expect(new Headers(calls[0]?.init.headers).get('authorization')).toBe(basicAuthorization(TEST_API_KEY));
    expect(calls[0]?.init.body).toBeInstanceOf(FormData);
  });

  it('classifies refusals and outages', async () => {
    const refused = createDropboxSignClient(TEST_API_KEY, fakeFetch(new Response('{}', { status: 400 })).fetcher);
    await expect(refused.get(PROVIDER_ID)).resolves.toEqual({ ok: false, kind: 'rejected', status: 400 });
    const down = createDropboxSignClient(TEST_API_KEY, fakeFetch(new Response('', { status: 503 })).fetcher);
    await expect(down.get(PROVIDER_ID)).resolves.toEqual({ ok: false, kind: 'unavailable', status: 503 });
    const gone = createDropboxSignClient(TEST_API_KEY, fakeFetch(new Response('', { status: 410 })).fetcher);
    await expect(gone.get(PROVIDER_ID)).resolves.toEqual({ ok: false, kind: 'gone' });
  });

  it('downloads the signed PDF, waits on 409 and refuses anything that is not a bounded PDF', async () => {
    const pdf = createDropboxSignClient(TEST_API_KEY, fakeFetch(new Response(SIGNED_PDF as BodyInit)).fetcher);
    const result = await pdf.signedPdf(PROVIDER_ID, 1024);
    expect(result.ok && isPdf(result.bytes)).toBe(true);
    const pending = createDropboxSignClient(TEST_API_KEY, fakeFetch(new Response('', { status: 409 })).fetcher);
    await expect(pending.signedPdf(PROVIDER_ID, 1024)).resolves.toEqual({ ok: false, kind: 'not_ready' });
    const html = createDropboxSignClient(TEST_API_KEY, fakeFetch(new Response('<html>')).fetcher);
    await expect(html.signedPdf(PROVIDER_ID, 1024)).resolves.toEqual({ ok: false, kind: 'invalid' });
    const big = createDropboxSignClient(TEST_API_KEY, fakeFetch(new Response(SIGNED_PDF as BodyInit)).fetcher);
    await expect(big.signedPdf(PROVIDER_ID, 10)).resolves.toEqual({ ok: false, kind: 'too_large' });
  });

  it('never puts an unchecked id into a URL', async () => {
    const { fetcher, calls } = fakeFetch(new Response('{}'));
    const client = createDropboxSignClient(TEST_API_KEY, fetcher);
    await expect(client.get('../account')).resolves.toMatchObject({ ok: false, kind: 'rejected' });
    expect(calls).toHaveLength(0);
  });
});

// --- The callback -------------------------------------------------------------------------

describe('a verified callback', () => {
  const time = '1760000100';
  function event(type: string) {
    return callbackEventSchema.parse(callbackEvent(type, time, hashOf(time, type)));
  }

  const stored = (overrides: Partial<StoredRequest> = {}): StoredRequest => ({
    id: ROW_ID,
    org_id: ORG_ID,
    status: 'sent',
    provider_request_id: PROVIDER_ID,
    test_mode: true,
    signers: [
      { name: 'Buyer', email: 'buyer@example.test', status: 'awaiting_signature', signed_at: null },
    ],
    signed_object_path: null,
    ...overrides,
  });

  function harness(options: {
    row?: StoredRequest | null;
    unconfirmed?: StoredRequest | null;
    recorded?: boolean;
    live?: Awaited<ReturnType<DropboxSignClient['get']>>;
    file?: Awaited<ReturnType<DropboxSignClient['signedPdf']>>;
    applied?: 'applied' | 'duplicate' | 'ignored' | 'unmatched';
  }) {
    const applies: Parameters<CallbackDeps['apply']>[0][] = [];
    const stores: Uint8Array[] = [];
    const deps: CallbackDeps = {
      provider: {
        send: vi.fn(),
        get: vi.fn(async () => options.live ?? { ok: true as const, request: signatureRequestSchema.parse(liveRequest()) }),
        signedPdf: vi.fn(async () => options.file ?? { ok: true as const, bytes: SIGNED_PDF }),
      },
      recorded: vi.fn(async () => options.recorded ?? false),
      findByProviderId: vi.fn(async () => (options.row === undefined ? stored() : options.row)),
      findUnconfirmed: vi.fn(async () => options.unconfirmed ?? null),
      apply: vi.fn(async (input: Parameters<CallbackDeps['apply']>[0]) => {
        applies.push(input);
        return options.applied ?? ('applied' as const);
      }),
      storeSigned: vi.fn(async ({ bytes }: Parameters<CallbackDeps['storeSigned']>[0]) => {
        stores.push(bytes);
        return 'stored' as const;
      }),
      nowSeconds: () => 1760000200,
    };
    return { deps, applies, stores };
  }

  const complete = { ok: true as const, request: signatureRequestSchema.parse(liveRequest({ is_complete: true })) };

  it('acknowledges an event about no signature request (callback_test)', async () => {
    const { deps } = harness({});
    const test = callbackEventSchema.parse({
      event: { event_time: time, event_type: 'callback_test', event_hash: hashOf(time, 'callback_test') },
    });
    await expect(handleVerifiedEvent(test, deps)).resolves.toBe('acknowledged');
    expect(deps.provider.get).not.toHaveBeenCalled();
  });

  it('applies the live state, never the payload', async () => {
    const { deps, applies } = harness({});
    await expect(handleVerifiedEvent(event('signature_request_viewed'), deps)).resolves.toBe('applied');
    expect(deps.provider.get).toHaveBeenCalledWith(PROVIDER_ID);
    expect(applies[0]).toMatchObject({ status: 'sent', requestId: ROW_ID, eventKey: eventKey(event('signature_request_viewed')) });
  });

  it('treats a redelivered event as a duplicate without calling the provider', async () => {
    const { deps } = harness({ recorded: true });
    await expect(handleVerifiedEvent(event('signature_request_viewed'), deps)).resolves.toBe('duplicate');
    expect(deps.provider.get).not.toHaveBeenCalled();
  });

  it('gives different requests, types and hashes different event keys', () => {
    const a = eventKey(event('signature_request_viewed'));
    expect(eventKey(event('signature_request_signed'))).not.toBe(a);
    expect(a).toMatch(/^[0-9a-f]{64}$/);
  });

  it('leaves alone a request this deployment never sent', async () => {
    const { deps } = harness({ row: null });
    await expect(handleVerifiedEvent(event('signature_request_sent'), deps)).resolves.toBe('unmatched');
    expect(deps.apply).not.toHaveBeenCalled();
  });

  it('matches an unconfirmed send by our own id, then checks the live metadata agrees', async () => {
    const { deps } = harness({ row: null, unconfirmed: stored({ provider_request_id: null, status: 'sending' }) });
    await expect(handleVerifiedEvent(event('signature_request_sent'), deps)).resolves.toBe('applied');
    const other = harness({
      row: null,
      unconfirmed: stored({ provider_request_id: null }),
      live: { ok: true, request: signatureRequestSchema.parse(liveRequest({ metadata: { tradedocs_request_id: ORG_ID } })) },
    });
    await expect(handleVerifiedEvent(event('signature_request_sent'), other.deps)).resolves.toBe('unmatched');
  });

  it('refuses a live request in the other mode', async () => {
    const { deps } = harness({ live: { ok: true, request: signatureRequestSchema.parse(liveRequest({ test_mode: false })) } });
    await expect(handleVerifiedEvent(event('signature_request_all_signed'), deps)).resolves.toBe('mode_mismatch');
    expect(deps.apply).not.toHaveBeenCalled();
  });

  it('stores the signed copy once the request is complete', async () => {
    const { deps, stores, applies } = harness({ live: complete });
    await expect(handleVerifiedEvent(event('signature_request_all_signed'), deps)).resolves.toBe('stored');
    expect(applies[0]?.status).toBe('signed');
    expect(stores).toEqual([SIGNED_PDF]);
  });

  it('waits when the provider is still preparing the file', async () => {
    const { deps, stores } = harness({ live: complete, file: { ok: false, kind: 'not_ready' } });
    await expect(handleVerifiedEvent(event('signature_request_all_signed'), deps)).resolves.toBe('file_pending');
    expect(stores).toHaveLength(0);
  });

  it('fetches a missing signed copy even for an event already recorded', async () => {
    const { deps, stores } = harness({
      row: stored({ status: 'signed' }),
      recorded: true,
      live: complete,
      applied: 'duplicate',
    });
    await expect(handleVerifiedEvent(event('signature_request_downloadable'), deps)).resolves.toBe('stored');
    expect(stores).toHaveLength(1);
  });

  it('does not fetch again once the copy is stored', async () => {
    const { deps } = harness({
      row: stored({ status: 'signed', signed_object_path: `org/${ORG_ID}/esign/${ROW_ID}/${'a'.repeat(64)}.pdf` }),
      live: complete,
      applied: 'ignored',
    });
    await expect(handleVerifiedEvent(event('signature_request_downloadable'), deps)).resolves.toBe('ignored');
    expect(deps.provider.signedPdf).not.toHaveBeenCalled();
  });

  it('acknowledges a signed copy that is not a PDF instead of retrying forever', async () => {
    const { deps } = harness({ live: complete, file: { ok: false, kind: 'invalid' } });
    await expect(handleVerifiedEvent(event('signature_request_all_signed'), deps)).resolves.toBe('copy_refused');
  });

  it('asks for a retry when the provider is unreachable', async () => {
    const { deps } = harness({ live: { ok: false, kind: 'unavailable', status: 503 } });
    await expect(handleVerifiedEvent(event('signature_request_signed'), deps)).rejects.toBeInstanceOf(
      RetryableCallbackError,
    );
    expect(deps.apply).not.toHaveBeenCalled();
  });

  it('records a cancellation the provider no longer serves', async () => {
    const { deps, applies } = harness({ live: { ok: false, kind: 'gone' } });
    await expect(handleVerifiedEvent(event('signature_request_canceled'), deps)).resolves.toBe('applied');
    expect(applies[0]?.status).toBe('cancelled');
    // Gone for any other reason: nothing to apply, and a retry could not help.
    const other = harness({ live: { ok: false, kind: 'gone' } });
    await expect(handleVerifiedEvent(event('signature_request_viewed'), other.deps)).resolves.toBe(
      'unmatched',
    );
    expect(other.deps.apply).not.toHaveBeenCalled();
  });
});
