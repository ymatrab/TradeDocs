import { afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import cslSearch from '../fixtures/screening/csl-search.json';
import { POST } from '@/app/api/tools/denied-party/route';
import { cslApiKey } from '@/lib/screening/config';
import {
  ScreeningResponseError,
  cslHeaders,
  cslSearchRequest,
  officialLink,
  parseCslSearch,
  screeningRequestSchema,
} from '@/lib/screening/csl';
import { screenName } from '@/lib/screening/server';
import { SCREENING_TOOL, listedTools, screeningSitemapPages } from '@/lib/seo/site';

/**
 * The fixture follows the CSL record shape (the trade.gov downloadable list and search API,
 * retrieved 2026-10-09) with synthetic names. No test reaches the network.
 */

const KEY = 'synthetic0csl0subscription0key00';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('CSL requests', () => {
  it('builds the documented search with the key in the subscription-key header', () => {
    const url = cslSearchRequest({ name: 'Fixture Trading', fuzzy: true });
    expect(url.origin + url.pathname).toBe(
      'https://data.trade.gov/consolidated_screening_list/v1/search',
    );
    expect(url.searchParams.get('name')).toBe('Fixture Trading');
    expect(url.searchParams.get('fuzzy_name')).toBe('true');
    expect(url.toString()).not.toContain(KEY);
    expect(cslHeaders(KEY)).toEqual({ 'subscription-key': KEY, Accept: 'application/json' });
  });

  it('bounds the name and refuses unknown fields', () => {
    expect(screeningRequestSchema.parse({ name: '  Acme  ' })).toEqual({
      name: 'Acme',
      fuzzy: true,
    });
    expect(screeningRequestSchema.safeParse({ name: 'A' }).success).toBe(false);
    expect(screeningRequestSchema.safeParse({ name: 'x'.repeat(101) }).success).toBe(false);
    expect(screeningRequestSchema.safeParse({ name: '<b>x</b>' }).success).toBe(false);
    expect(screeningRequestSchema.safeParse({ name: 'Acme', email: 'a@b.c' }).success).toBe(false);
  });

  it('accepts only a plausible key, read from the environment', () => {
    expect(cslApiKey('')).toBeNull();
    expect(cslApiKey('short')).toBeNull();
    expect(cslApiKey('has spaces in the middle of it')).toBeNull();
    expect(cslApiKey(` ${KEY} `)).toBe(KEY);
  });
});

describe('CSL response parsing', () => {
  const answer = parseCslSearch(cslSearch);

  it('keeps the list, name and an official source link, and drops the rest', () => {
    expect(answer.total).toBe(3);
    expect(answer.results).toHaveLength(2);
    expect(answer.results[0]).toEqual({
      name: 'Synthetic Fixture Trading Company',
      source: 'Nonproliferation Sanctions (ACN) - State Department',
      country: 'TH',
      altNames: ['Fixture Trade', 'Synthetic Co'],
      programs: ['Chemical and Biological Weapons Act'],
      sourceUrl:
        'https://www.state.gov/bureau-of-arms-control-and-nonproliferation/nonproliferation-sanctions',
      score: 98.5,
    });
    expect(JSON.stringify(answer)).not.toContain('Example Road');
  });

  it('never links anywhere but an https .gov page', () => {
    expect(answer.results[1]?.sourceUrl).toBeNull();
    expect(officialLink('https://www.treasury.gov/ofac')).toBe('https://www.treasury.gov/ofac');
    expect(officialLink('https://gov.evil.example/')).toBeNull();
    expect(officialLink('javascript:alert(1)')).toBeNull();
  });

  it('rejects a response without the results list', () => {
    expect(() => parseCslSearch({ statusCode: 401 })).toThrow(ScreeningResponseError);
  });
});

describe('screening outcomes (stubbed fetch)', () => {
  it('names a refused key as an operator problem without logging the name', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const fetcher = vi.fn(
      async () => new Response('{}', { status: 401 }),
    ) as unknown as typeof fetch;
    const outcome = await screenName({ name: 'Fixture Trading', fuzzy: true }, KEY, fetcher);
    expect(outcome).toEqual({ status: 'unavailable', reason: 'rejected_key' });
    expect(JSON.stringify(errors.mock.calls)).not.toContain('Fixture');
    expect(JSON.stringify(errors.mock.calls)).not.toContain(KEY);
  });

  it('sends the key as a header and returns the parsed matches', async () => {
    const fetcher = vi.fn(async () => new Response(JSON.stringify(cslSearch)));
    const outcome = await screenName(
      { name: 'Fixture Trading', fuzzy: true },
      KEY,
      fetcher as unknown as typeof fetch,
    );
    expect(outcome.status).toBe('ok');
    const init = fetcher.mock.calls[0] as unknown as [URL, RequestInit];
    expect((init[1].headers as Record<string, string>)['subscription-key']).toBe(KEY);
    expect(init[1].cache).toBe('no-store');
  });
});

describe('POST /api/tools/denied-party', () => {
  function post(body: unknown) {
    return POST(
      new NextRequest('http://127.0.0.1:3000/api/tools/denied-party', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
    );
  }

  it('says it is not configured without a key, and calls nobody', async () => {
    vi.stubEnv('APP_ENV', 'test');
    vi.stubEnv('CSL_API_KEY', '');
    const fetcher = vi.fn();
    vi.stubGlobal('fetch', fetcher);
    const response = await post({ name: 'Fixture Trading' });
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ code: 'not_configured' });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('screens a name when configured and is never cached', async () => {
    vi.stubEnv('APP_ENV', 'test');
    vi.stubEnv('CSL_API_KEY', KEY);
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify(cslSearch))),
    );
    const response = await post({ name: 'Fixture Trading', fuzzy: false });
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('private, no-store');
    const body = (await response.json()) as { results: unknown[] };
    expect(body.results).toHaveLength(2);
    expect(JSON.stringify(body)).not.toContain(KEY);
  });

  it('refuses a malformed search', async () => {
    vi.stubEnv('APP_ENV', 'test');
    vi.stubEnv('CSL_API_KEY', KEY);
    vi.stubGlobal('fetch', vi.fn());
    expect((await post({ name: 'x' })).status).toBe(400);
  });
});

describe('listing follows availability', () => {
  it('lists screening on the hub and in the sitemap only with a key', () => {
    expect(listedTools(false).map((tool) => tool.path)).not.toContain(SCREENING_TOOL.path);
    expect(listedTools(true).map((tool) => tool.path)).toContain(SCREENING_TOOL.path);
    expect(screeningSitemapPages(false)).toEqual([]);
    expect(screeningSitemapPages(true).map((page) => page.path)).toEqual([SCREENING_TOOL.path]);
  });
});
