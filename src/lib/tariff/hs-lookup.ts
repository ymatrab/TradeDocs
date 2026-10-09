import { z } from 'zod';

/**
 * HS code lookup against two official tariffs, as pure request builders and parsers.
 *
 * The lookup is a search of what the tariff publishers themselves return: the United States
 * Harmonized Tariff Schedule (USITC) and the UK Trade Tariff (HMRC). It never decides a
 * classification and never carries a duty rate. The parsers pick out the code and the
 * description and drop every other field, so a rate column in the upstream response cannot
 * reach the page even by accident (D-019, D-025).
 *
 * Network calls live in ./server.ts; everything here is deterministic and tested with
 * recorded fixtures.
 */

export const HS_QUERY_MIN = 2;
export const HS_QUERY_MAX = 80;
/** Rows shown per tariff. The official search pages list the rest. */
export const HS_MAX_RESULTS = 25;
const DESCRIPTION_MAX = 400;
const CONTEXT_MAX = 300;

/** Letters in any script, digits, spaces and the punctuation goods descriptions use. */
export const hsQuerySchema = z
  .string()
  .trim()
  .min(HS_QUERY_MIN, 'Enter at least two characters.')
  .max(HS_QUERY_MAX, `Keep the search under ${HS_QUERY_MAX} characters.`)
  .regex(/^[\p{L}\p{N}\s.,'’()\-/&%+]+$/u, 'Use letters, numbers and ordinary punctuation only.');

export type TariffId = 'us' | 'uk';

export type TariffEntry = {
  /** The code as the publisher prints it: 7408.11.30.00 in the HTS, 7408110000 in the UK. */
  code: string;
  description: string;
  /** The headings above this line, so a bare "Other" can be read in place. */
  context: string | null;
  /** The publisher's own page for this code. */
  url: string;
};

export type TariffOutcome =
  | { status: 'ok'; results: TariffEntry[]; searchUrl: string }
  | { status: 'unavailable'; searchUrl: string };

export const TARIFFS = {
  us: {
    name: 'United States — Harmonized Tariff Schedule',
    publisher: 'U.S. International Trade Commission (USITC)',
    home: 'https://hts.usitc.gov/',
  },
  uk: {
    name: 'United Kingdom — UK Trade Tariff',
    publisher: 'HM Revenue & Customs, GOV.UK Trade Tariff',
    home: 'https://www.trade-tariff.service.gov.uk/',
  },
} as const satisfies Record<TariffId, { name: string; publisher: string; home: string }>;

/** The response could not be read as the publisher's documented shape. */
export class TariffResponseError extends Error {
  constructor(readonly tariff: TariffId) {
    super(`Unexpected ${tariff} tariff response.`);
    this.name = 'TariffResponseError';
  }
}

/** Upstream text is data: tags are removed and whitespace collapsed before it is shown. */
export function plainText(value: string, max = DESCRIPTION_MAX): string {
  const text = value
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

// ---------------------------------------------------------------------------------------
// United States: hts.usitc.gov REST search (public, no key)
// ---------------------------------------------------------------------------------------

export const US_HTS_SEARCH_ENDPOINT = 'https://hts.usitc.gov/reststop/search';

export function usSearchRequest(query: string): URL {
  const url = new URL(US_HTS_SEARCH_ENDPOINT);
  url.searchParams.set('keyword', query);
  return url;
}

/** The HTS site's own search for a code or a phrase. */
export function usSearchPage(query: string): string {
  const url = new URL('https://hts.usitc.gov/search');
  url.searchParams.set('query', query);
  return url.toString();
}

const US_CODE = /^\d{4}(\.\d{2}){0,3}$/;

/** Only the fields shown are read; the general, special and other rate columns are not. */
const usRowSchema = z.object({
  htsno: z.string(),
  description: z.string(),
  indent: z.union([z.string(), z.number()]).nullish(),
});

function digits(code: string): string {
  return code.replace(/\D/g, '');
}

export function parseUsSearch(data: unknown): TariffEntry[] {
  if (!Array.isArray(data)) throw new TariffResponseError('us');
  type Row = { code: string; description: string; indent: number };
  const rows: Row[] = [];
  for (const raw of data) {
    const parsed = usRowSchema.safeParse(raw);
    if (!parsed.success) continue;
    const code = parsed.data.htsno.trim();
    if (!US_CODE.test(code)) continue;
    const indent = Number(parsed.data.indent ?? 0);
    rows.push({
      code,
      description: plainText(parsed.data.description),
      indent: Number.isInteger(indent) && indent >= 0 && indent < 20 ? indent : 0,
    });
  }

  const seen = new Set<string>();
  const entries: TariffEntry[] = [];
  rows.forEach((row, index) => {
    if (seen.has(row.code) || !row.description) return;
    seen.add(row.code);
    // The schedule lists parents before children: walk back for the lines this one sits
    // under, accepting only a shallower line whose code is a prefix of this one.
    const ancestors: string[] = [];
    let depth = row.indent;
    const own = digits(row.code);
    for (let back = index - 1; back >= 0 && depth > 0; back -= 1) {
      const candidate = rows[back];
      if (!candidate || candidate.indent >= depth) continue;
      if (!own.startsWith(digits(candidate.code))) break;
      ancestors.unshift(candidate.description.replace(/:$/, ''));
      depth = candidate.indent;
    }
    entries.push({
      code: row.code,
      description: row.description,
      context: ancestors.length > 0 ? plainText(ancestors.join(' › '), CONTEXT_MAX) : null,
      url: usSearchPage(row.code),
    });
  });
  return entries.slice(0, HS_MAX_RESULTS);
}

// ---------------------------------------------------------------------------------------
// United Kingdom: GOV.UK Trade Tariff API v2 (public read endpoints, no key)
// ---------------------------------------------------------------------------------------

export const UK_TARIFF_ORIGIN = 'https://www.trade-tariff.service.gov.uk';
/** The documented Accept header for v2 of the Trade Tariff API. */
export const UK_TARIFF_ACCEPT = 'application/vnd.hmrc.2.0+json';

export function ukSearchRequest(query: string): URL {
  const url = new URL('/uk/api/search', UK_TARIFF_ORIGIN);
  url.searchParams.set('q', query);
  return url;
}

export function ukSearchPage(query: string): string {
  const url = new URL('/search', UK_TARIFF_ORIGIN);
  url.searchParams.set('q', query);
  return url.toString();
}

const UK_ITEM = /^\d{10}$/;
const UK_SUFFIX = /^\d{2}$/;
type UkLevel = 'chapter' | 'heading' | 'commodity';

const nomenclatureSchema = z.object({
  goods_nomenclature_item_id: z.string().regex(UK_ITEM),
  producline_suffix: z.string().regex(UK_SUFFIX).nullish(),
  description: z.string(),
  declarable: z.boolean().nullish(),
  ancestor_descriptions: z.array(z.string()).nullish(),
  chapter: z.object({ description: z.string() }).nullish(),
});
type Nomenclature = z.output<typeof nomenclatureSchema>;

const hitSchema = z.object({
  _score: z.number().nullish(),
  // A fuzzy hit carries the line itself; a reference hit wraps it in `reference`.
  _source: z.object({ reference: z.unknown().optional() }).passthrough(),
});

const bucketsSchema = z
  .object({
    chapters: z.array(z.unknown()).default([]),
    headings: z.array(z.unknown()).default([]),
    commodities: z.array(z.unknown()).default([]),
  })
  .partial();

const ukSearchSchema = z.object({
  data: z.object({
    attributes: z.object({
      type: z.string(),
      goods_nomenclature_match: bucketsSchema.nullish(),
      reference_match: bucketsSchema.nullish(),
      entry: z.object({ endpoint: z.string(), id: z.string() }).nullish(),
    }),
  }),
});

/** The detail endpoints an exact match may point at, and the id each one takes. */
export const UK_EXACT_ENDPOINTS = {
  chapters: /^\d{2}$/,
  headings: /^\d{4}$/,
  subheadings: /^\d{10}-\d{2}$/,
  commodities: /^\d{10}$/,
} as const;
export type UkExactEndpoint = keyof typeof UK_EXACT_ENDPOINTS;

export type UkSearchResult =
  | { kind: 'results'; results: TariffEntry[] }
  | { kind: 'exact'; endpoint: UkExactEndpoint; id: string };

/** The shortest form of a UK code that still names the line: trailing "00" pairs dropped. */
function shortCode(item: string, minimum: number): string {
  let code = item;
  while (code.length > minimum && code.endsWith('00')) code = code.slice(0, -2);
  return code;
}

export function ukPagePath(level: UkLevel, item: string, suffix: string, declarable: boolean) {
  if (level === 'chapter') return `/chapters/${item.slice(0, 2)}`;
  if (level === 'heading') return `/headings/${item.slice(0, 4)}`;
  return declarable ? `/commodities/${item}` : `/subheadings/${item}-${suffix}`;
}

function ukEntry(level: UkLevel, line: Nomenclature): TariffEntry {
  const item = line.goods_nomenclature_item_id;
  const suffix = line.producline_suffix ?? '80';
  const declarable = level === 'commodity' && line.declarable === true;
  const code =
    level === 'chapter'
      ? item.slice(0, 2)
      : level === 'heading'
        ? item.slice(0, 4)
        : declarable
          ? item
          : shortCode(item, 6);
  const ancestors =
    level === 'commodity'
      ? (line.ancestor_descriptions ?? []).slice(1, -1)
      : level === 'heading' && line.chapter
        ? [line.chapter.description]
        : [];
  const context = ancestors.map((text) => plainText(text)).filter(Boolean);
  return {
    code,
    description: plainText(line.description),
    context: context.length > 0 ? plainText(context.join(' › '), CONTEXT_MAX) : null,
    url: new URL(ukPagePath(level, item, suffix, declarable), UK_TARIFF_ORIGIN).toString(),
  };
}

export function parseUkSearch(data: unknown): UkSearchResult {
  const parsed = ukSearchSchema.safeParse(data);
  if (!parsed.success) throw new TariffResponseError('uk');
  const attributes = parsed.data.data.attributes;

  if (attributes.type === 'exact_match') {
    const entry = attributes.entry;
    const pattern =
      entry && entry.endpoint in UK_EXACT_ENDPOINTS
        ? UK_EXACT_ENDPOINTS[entry.endpoint as UkExactEndpoint]
        : undefined;
    if (!entry || !pattern || !pattern.test(entry.id)) return { kind: 'results', results: [] };
    return { kind: 'exact', endpoint: entry.endpoint as UkExactEndpoint, id: entry.id };
  }

  const scored: { score: number; entry: TariffEntry }[] = [];
  const levels: [keyof z.output<typeof bucketsSchema>, UkLevel][] = [
    ['chapters', 'chapter'],
    ['headings', 'heading'],
    ['commodities', 'commodity'],
  ];
  for (const buckets of [attributes.goods_nomenclature_match, attributes.reference_match]) {
    if (!buckets) continue;
    for (const [bucket, level] of levels) {
      for (const raw of buckets[bucket] ?? []) {
        const hit = hitSchema.safeParse(raw);
        if (!hit.success) continue;
        const source = hit.data._source;
        const line = nomenclatureSchema.safeParse(source.reference ?? source);
        if (!line.success) continue;
        const entry = ukEntry(level, line.data);
        if (entry.description) scored.push({ score: hit.data._score ?? 0, entry });
      }
    }
  }

  const seen = new Set<string>();
  const results: TariffEntry[] = [];
  for (const { entry } of scored.sort((a, b) => b.score - a.score)) {
    if (seen.has(entry.url)) continue;
    seen.add(entry.url);
    results.push(entry);
    if (results.length === HS_MAX_RESULTS) break;
  }
  return { kind: 'results', results };
}

export function ukDetailRequest(endpoint: UkExactEndpoint, id: string): URL {
  if (!UK_EXACT_ENDPOINTS[endpoint].test(id)) throw new Error('Invalid tariff reference.');
  return new URL(`/uk/api/${endpoint}/${id}`, UK_TARIFF_ORIGIN);
}

const ukDetailSchema = z.object({
  data: z.object({
    attributes: z.object({
      goods_nomenclature_item_id: z.string().regex(UK_ITEM),
      producline_suffix: z.string().regex(UK_SUFFIX).nullish(),
      description_plain: z.string().nullish(),
      description: z.string().nullish(),
      declarable: z.boolean().nullish(),
    }),
  }),
});

/** An exact code match, read from the line's own detail endpoint; rates are not read. */
export function parseUkDetail(endpoint: UkExactEndpoint, id: string, data: unknown): TariffEntry {
  const parsed = ukDetailSchema.safeParse(data);
  if (!parsed.success) throw new TariffResponseError('uk');
  const attributes = parsed.data.data.attributes;
  const level: UkLevel =
    endpoint === 'chapters' ? 'chapter' : endpoint === 'headings' ? 'heading' : 'commodity';
  const suffix = attributes.producline_suffix ?? id.split('-')[1] ?? '80';
  return ukEntry(level, {
    goods_nomenclature_item_id: attributes.goods_nomenclature_item_id,
    producline_suffix: suffix,
    description: attributes.description_plain ?? attributes.description ?? '',
    declarable: endpoint === 'commodities' ? true : attributes.declarable,
    ancestor_descriptions: null,
    chapter: null,
  });
}

/** The one line of an exact match when its detail could not be read: code and link only. */
export function ukExactFallback(endpoint: UkExactEndpoint, id: string): TariffEntry {
  const code = id.split('-')[0] ?? id;
  return {
    code: endpoint === 'subheadings' ? shortCode(code, 6) : code,
    description: 'Exact code match. Open the official page for its description.',
    context: null,
    url: new URL(`/${endpoint}/${id}`, UK_TARIFF_ORIGIN).toString(),
  };
}
