import { afterEach, describe, expect, it, vi } from 'vitest';
import { GET as readiness } from '@/app/api/ready/route';
import { certificateOfOriginState, regulatedDocumentsEnabled } from '@/lib/config/server';
import { certificateOfOriginGate, gatedPublicPhrases, readCooReview } from '@/lib/trade/regulated';

const NOW = new Date('2026-10-09T12:00:00Z');

/** Synthetic service-mode test configuration; no real project or credential. */
const service = {
  APP_ENV: 'test',
  APPLICATION_MODE: 'service',
  SUPABASE_URL: 'http://127.0.0.1:54321',
  SUPABASE_ANON_KEY: 'synthetic-public-test-key',
  SUPABASE_PROJECT_REF: 'localtestproject',
  SUPABASE_ENVIRONMENT: 'test',
};

const switchedOn = {
  ...service,
  ENABLE_REGULATED_DOCUMENTS: 'true',
  REGULATED_DOCUMENTS_APPROVED: 'true',
};

const review = { LEGAL_COO_REVIEWED_BY: 'A. Reviewer', LEGAL_COO_REVIEWED_AT: '2026-10-08' };

function stub(env: Record<string, string>): void {
  for (const [name, value] of Object.entries(env)) vi.stubEnv(name, value);
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('certificate of origin review record', () => {
  it('needs a named reviewer and a real, past date', () => {
    expect(readCooReview(review, NOW)).toEqual({
      reviewedBy: 'A. Reviewer',
      reviewedAt: '2026-10-08',
    });
    expect(readCooReview({ ...review, LEGAL_COO_REVIEWED_BY: '' }, NOW)).toBeNull();
    expect(readCooReview({ ...review, LEGAL_COO_REVIEWED_BY: 'A\nB' }, NOW)).toBeNull();
    expect(readCooReview({ ...review, LEGAL_COO_REVIEWED_AT: '' }, NOW)).toBeNull();
    expect(readCooReview({ ...review, LEGAL_COO_REVIEWED_AT: '2026-02-30' }, NOW)).toBeNull();
    expect(readCooReview({ ...review, LEGAL_COO_REVIEWED_AT: '08/10/2026' }, NOW)).toBeNull();
    // A review dated in the future has not happened yet.
    expect(readCooReview({ ...review, LEGAL_COO_REVIEWED_AT: '2026-10-10' }, NOW)).toBeNull();
  });
});

describe('certificate of origin gate', () => {
  it('is off by default', () => {
    expect(certificateOfOriginGate({}, NOW)).toEqual({ state: 'off' });
    expect(certificateOfOriginGate(service, NOW)).toEqual({ state: 'off' });
  });

  it('cannot be switched on without a recorded review', () => {
    const gate = certificateOfOriginGate(switchedOn, NOW);
    expect(gate.state).toBe('misconfigured');
    expect(gate.state === 'misconfigured' && gate.reason).toMatch(/LEGAL_COO_REVIEWED_BY/);
    const undated = { ...switchedOn, ...review, LEGAL_COO_REVIEWED_AT: 'soon' };
    expect(certificateOfOriginGate(undated, NOW).state).toBe('misconfigured');
  });

  it('cannot be switched on without its approval or outside service mode', () => {
    const unapproved = { ...switchedOn, ...review, REGULATED_DOCUMENTS_APPROVED: '' };
    expect(certificateOfOriginGate(unapproved, NOW).state).toBe('misconfigured');
    const foundation = { ...switchedOn, ...review, APPLICATION_MODE: 'foundation' };
    expect(certificateOfOriginGate(foundation, NOW).state).toBe('misconfigured');
  });

  it('is on with the flag, its approval, service mode and the review record', () => {
    expect(certificateOfOriginGate({ ...switchedOn, ...review }, NOW)).toEqual({
      state: 'on',
      review: { reviewedBy: 'A. Reviewer', reviewedAt: '2026-10-08' },
    });
  });

  it('fails closed on the server, and a missing record does not fail the deployment', () => {
    stub(service);
    expect(regulatedDocumentsEnabled()).toBe(false);
    stub(switchedOn);
    expect(certificateOfOriginState().state).toBe('misconfigured');
    expect(regulatedDocumentsEnabled()).toBe(false);
    stub(review);
    expect(regulatedDocumentsEnabled()).toBe(true);
  });

  it('is reported by readiness when switched on without its record, without values', async () => {
    stub(switchedOn);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({})));
    const response = await readiness();
    const body = JSON.parse(await response.text()) as Record<string, unknown>;
    expect(body.regulated_documents).toBe('misconfigured');
    expect(String(body.regulated_documents_reason)).toMatch(/LEGAL_COO_REVIEWED_AT/);
    expect(JSON.stringify(body)).not.toContain('synthetic');

    stub(review);
    const ready = JSON.parse(await (await readiness()).text()) as Record<string, unknown>;
    expect(ready).not.toHaveProperty('regulated_documents');
  });
});

describe('gated public phrases', () => {
  it('forbid naming the certificate of origin only while it is not offered', () => {
    const [pattern] = gatedPublicPhrases(false);
    expect(pattern?.test('A Certificate of Origin')).toBe(true);
    expect(gatedPublicPhrases(true)).toEqual([]);
  });
});
