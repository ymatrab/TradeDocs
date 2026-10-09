import { z } from 'zod';

/**
 * Denied-party screening against the trade.gov Consolidated Screening List (CSL) API, as
 * pure request builders and a parser.
 *
 * The CSL consolidates the export screening lists of the US Departments of Commerce, State
 * and the Treasury. A search here is a screening aid, never a compliance determination:
 * a match needs the due diligence the CSL page describes, and no match clears nothing.
 * Names searched are sent to the API and shown back; they are never stored or logged.
 */

export const CSL_SEARCH_ENDPOINT = 'https://data.trade.gov/consolidated_screening_list/v1/search';
/** The official, free CSL search engine, offered whenever this tool cannot run. */
export const CSL_OFFICIAL_SEARCH = 'https://www.trade.gov/data-visualization/csl-search';
export const CSL_SUBSCRIPTION_HEADER = 'subscription-key';

export const SCREENING_NAME_MIN = 2;
export const SCREENING_NAME_MAX = 100;
/** Matches shown per search; the official search engine pages through the rest. */
export const SCREENING_MAX_RESULTS = 25;

export const screeningRequestSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(SCREENING_NAME_MIN, 'Enter at least two characters of the name.')
      .max(SCREENING_NAME_MAX, `Keep the name under ${SCREENING_NAME_MAX} characters.`)
      .regex(/^[^\p{Cc}<>]+$/u, 'Use letters, numbers and ordinary punctuation only.'),
    fuzzy: z.boolean().default(true),
  })
  .strict();
export type ScreeningRequest = z.output<typeof screeningRequestSchema>;

export function cslSearchRequest(request: ScreeningRequest): URL {
  const url = new URL(CSL_SEARCH_ENDPOINT);
  url.searchParams.set('name', request.name);
  url.searchParams.set('fuzzy_name', request.fuzzy ? 'true' : 'false');
  url.searchParams.set('size', String(SCREENING_MAX_RESULTS));
  return url;
}

export function cslHeaders(key: string): Record<string, string> {
  return { [CSL_SUBSCRIPTION_HEADER]: key, Accept: 'application/json' };
}

export type ScreeningHit = {
  name: string;
  /** The list the entry is on, as the CSL names it. */
  source: string;
  country: string | null;
  altNames: string[];
  programs: string[];
  /** The list owner's page for this list, https on a .gov host only. */
  sourceUrl: string | null;
  /** The fuzzy-name score, when the API returns one. */
  score: number | null;
};

export type ScreeningAnswer = { total: number; results: ScreeningHit[] };

export class ScreeningResponseError extends Error {
  constructor() {
    super('Unexpected Consolidated Screening List response.');
    this.name = 'ScreeningResponseError';
  }
}

const TEXT_MAX = 300;
function clean(value: string, max = TEXT_MAX): string {
  const text = value
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

/** A link from the response is shown only if it points at an official .gov page. */
export function officialLink(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    return /(^|\.)[a-z0-9-]+\.gov$/i.test(url.hostname) ? url.toString() : null;
  } catch {
    return null;
  }
}

const texts = z
  .array(z.unknown())
  .nullish()
  .transform((values) =>
    (values ?? [])
      .filter((value): value is string => typeof value === 'string')
      .map((value) => clean(value))
      .filter(Boolean)
      .slice(0, 10),
  );

/** Only the fields shown are read; addresses, IDs and remarks are not passed on. */
const hitSchema = z.object({
  name: z.string(),
  source: z.string(),
  country: z.string().nullish(),
  alt_names: texts,
  programs: texts,
  source_information_url: z.string().nullish(),
  source_list_url: z.string().nullish(),
  score: z.number().nullish(),
});

const answerSchema = z.object({
  total: z.number().int().min(0).nullish(),
  results: z.array(z.unknown()),
});

export function parseCslSearch(data: unknown): ScreeningAnswer {
  const parsed = answerSchema.safeParse(data);
  if (!parsed.success) throw new ScreeningResponseError();
  const results: ScreeningHit[] = [];
  for (const raw of parsed.data.results) {
    const hit = hitSchema.safeParse(raw);
    if (!hit.success) continue;
    const name = clean(hit.data.name);
    if (!name) continue;
    const country = hit.data.country?.trim();
    results.push({
      name,
      source: clean(hit.data.source),
      country: country && /^[A-Z]{2}$/.test(country) ? country : null,
      altNames: hit.data.alt_names,
      programs: hit.data.programs,
      sourceUrl:
        officialLink(hit.data.source_information_url) ?? officialLink(hit.data.source_list_url),
      score: hit.data.score ?? null,
    });
    if (results.length === SCREENING_MAX_RESULTS) break;
  }
  return { total: Math.max(parsed.data.total ?? results.length, results.length), results };
}
