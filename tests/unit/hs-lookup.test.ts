import { describe, expect, it, vi } from 'vitest';
import usSearch from '../fixtures/tariff/usitc-search-7408.json';
import ukSearch from '../fixtures/tariff/uk-search-copper-wire.json';
import ukExact from '../fixtures/tariff/uk-search-exact-7408.json';
import ukHeading from '../fixtures/tariff/uk-heading-7408.json';
import {
  HS_MAX_RESULTS,
  TariffResponseError,
  hsQuerySchema,
  parseUkDetail,
  parseUkSearch,
  parseUsSearch,
  plainText,
  ukDetailRequest,
  ukExactFallback,
  ukSearchRequest,
  usSearchRequest,
} from '@/lib/tariff/hs-lookup';
import { lookupTariffs, lookupUk } from '@/lib/tariff/server';

/**
 * Fixtures are recorded official responses (USITC HTS REST search, GOV.UK Trade Tariff API
 * v2), trimmed, retrieved 2026-10-09. No test reaches the network.
 */

describe('HS code lookup requests', () => {
  it('builds the documented public endpoints with the query encoded', () => {
    expect(usSearchRequest('copper wire').toString()).toBe(
      'https://hts.usitc.gov/reststop/search?keyword=copper+wire',
    );
    expect(ukSearchRequest('copper & tin').toString()).toBe(
      'https://www.trade-tariff.service.gov.uk/uk/api/search?q=copper+%26+tin',
    );
    expect(ukDetailRequest('headings', '7408').toString()).toBe(
      'https://www.trade-tariff.service.gov.uk/uk/api/headings/7408',
    );
    expect(() => ukDetailRequest('headings', '../x')).toThrow();
  });

  it('bounds and screens the query', () => {
    expect(hsQuerySchema.safeParse(' copper wire ').data).toBe('copper wire');
    expect(hsQuerySchema.safeParse('Kupferdraht für Kabel').success).toBe(true);
    expect(hsQuerySchema.safeParse('7408.11').success).toBe(true);
    expect(hsQuerySchema.safeParse('a').success).toBe(false);
    expect(hsQuerySchema.safeParse('x'.repeat(81)).success).toBe(false);
    expect(hsQuerySchema.safeParse('<script>').success).toBe(false);
  });

  it('removes markup from upstream text', () => {
    expect(plainText('dimension of <il>3 mm</il>  or less')).toBe('dimension of 3 mm or less');
  });
});

describe('USITC HTS search parsing', () => {
  const entries = parseUsSearch(usSearch);

  it('reads codes and descriptions and never a duty column', () => {
    expect(entries.map((entry) => entry.code)).toContain('7408.11.30.00');
    for (const entry of entries) {
      expect(Object.keys(entry).sort()).toEqual(['code', 'context', 'description', 'url']);
      expect(JSON.stringify(entry)).not.toMatch(/\d%/);
    }
  });

  it('places a line under the headings it sits beneath', () => {
    const other = entries.find((entry) => entry.code === '7408.19.00.60');
    expect(other?.description).toBe('Other');
    expect(other?.context).toBe('Copper wire › Other');
    const top = entries.find((entry) => entry.code === '7408');
    expect(top?.context).toBeNull();
    // A line whose parents were not returned gets no invented context.
    expect(entries.find((entry) => entry.code === '7312.10.10.50')?.context).toBeNull();
  });

  it('links each line to the official schedule and strips markup', () => {
    const line = entries.find((entry) => entry.code === '7408.19.00.30');
    expect(line?.description).toBe('With a maximum cross-sectional dimension of 3 mm or less');
    expect(line?.url).toBe('https://hts.usitc.gov/search?query=7408.19.00.30');
  });

  it('rejects a response that is not the documented list', () => {
    expect(() => parseUsSearch({ error: 'x' })).toThrow(TariffResponseError);
    expect(parseUsSearch([{ htsno: 'bad', description: 'x' }, null])).toEqual([]);
  });

  it('caps the rows shown', () => {
    const many = Array.from({ length: 60 }, (_, index) => ({
      htsno: `9999.${String(index).padStart(2, '0')}`,
      description: `Line ${index}`,
      indent: '1',
    }));
    expect(parseUsSearch(many)).toHaveLength(HS_MAX_RESULTS);
  });
});

describe('UK Trade Tariff search parsing', () => {
  it('reads headings and commodities by relevance, without duplicates', () => {
    const found = parseUkSearch(ukSearch);
    expect(found.kind).toBe('results');
    if (found.kind !== 'results') return;
    const codes = found.results.map((entry) => entry.code);
    expect(codes).toEqual(['740821', '740811', '740819', '7408290000', '7408']);
    expect(found.results[3]).toEqual({
      code: '7408290000',
      description: 'Other',
      context: 'Copper wire › Of copper alloys',
      url: 'https://www.trade-tariff.service.gov.uk/commodities/7408290000',
    });
    expect(found.results[0]?.url).toBe(
      'https://www.trade-tariff.service.gov.uk/subheadings/7408210000-10',
    );
    expect(found.results[4]?.url).toBe('https://www.trade-tariff.service.gov.uk/headings/7408');
  });

  it('turns an exact code match into a detail read', () => {
    expect(parseUkSearch(ukExact)).toEqual({ kind: 'exact', endpoint: 'headings', id: '7408' });
    const entry = parseUkDetail('headings', '7408', ukHeading);
    expect(entry).toEqual({
      code: '7408',
      description: 'Copper wire',
      context: null,
      url: 'https://www.trade-tariff.service.gov.uk/headings/7408',
    });
    expect(ukExactFallback('subheadings', '7408110000-10').url).toBe(
      'https://www.trade-tariff.service.gov.uk/subheadings/7408110000-10',
    );
  });

  it('ignores an exact match pointing anywhere unexpected', () => {
    const odd = { data: { attributes: { type: 'exact_match', entry: { endpoint: 'x', id: '1' } } } };
    expect(parseUkSearch(odd)).toEqual({ kind: 'results', results: [] });
    expect(() => parseUkSearch([])).toThrow(TariffResponseError);
  });
});

describe('live lookup outcomes (stubbed fetch)', () => {
  function respond(body: unknown, status = 200) {
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  it('reports each tariff on its own when one publisher fails', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const fetcher = vi.fn(async (input: URL | RequestInfo) => {
      const url = String(input);
      if (url.startsWith('https://hts.usitc.gov/')) return respond({}, 503);
      return respond(ukSearch);
    }) as unknown as typeof fetch;
    const outcome = await lookupTariffs('copper wire', fetcher);
    expect(outcome.us).toEqual({
      status: 'unavailable',
      searchUrl: 'https://hts.usitc.gov/search?query=copper+wire',
    });
    expect(outcome.uk.status).toBe('ok');
    // The query never reaches the log.
    expect(JSON.stringify(vi.mocked(console.warn).mock.calls)).not.toContain('copper');
  });

  it('follows an exact UK match to its detail, and falls back to the link alone', async () => {
    const ok = vi.fn(async (input: URL | RequestInfo) =>
      String(input).includes('/search') ? respond(ukExact) : respond(ukHeading),
    ) as unknown as typeof fetch;
    const found = await lookupUk('7408', ok);
    expect(found.status === 'ok' && found.results[0]?.description).toBe('Copper wire');

    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const detailDown = vi.fn(async (input: URL | RequestInfo) =>
      String(input).includes('/search') ? respond(ukExact) : respond({}, 500),
    ) as unknown as typeof fetch;
    const fallback = await lookupUk('7408', detailDown);
    expect(fallback.status === 'ok' && fallback.results[0]?.code).toBe('7408');
  });

  it('treats a timeout as unavailable', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const fetcher = vi.fn(async () => {
      throw new DOMException('timed out', 'TimeoutError');
    }) as unknown as typeof fetch;
    const outcome = await lookupTariffs('copper wire', fetcher);
    expect(outcome.us.status).toBe('unavailable');
    expect(outcome.uk.status).toBe('unavailable');
  });
});
