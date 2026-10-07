import type { ArticleFaq } from '@/lib/content/article';
import { countWords } from '@/lib/content/article';
import type { TermDemand } from '@/lib/content/glossary-term';
import type { SourceId } from '@/lib/trade/sources';

/**
 * The shape of an "export documents by country" page (docs/research/content-plan-v3-2026-10-07.md,
 * "Template spec: country pages"). One file per country in lib/content/countries, rendered by
 * /export-documents/[country] and listed on /export-documents.
 *
 * Every row carries the source it rests on, and the page renders that source beside it. There
 * are no duty rates, tax rates or thresholds unless an official source dates them, and none in
 * this first round. Country pages are always regulated: noindex and out of the sitemap,
 * llms.txt and navigation until `review` names the person who checked them.
 */

export type DocumentStatus = 'required' | 'conditional' | 'typical';

export type CountryDocument = {
  document: string;
  status: DocumentStatus;
  /** When it applies, or what it is for, in a sentence. */
  condition: string;
  sourceId: SourceId;
  /** A TradeDocs tool that prepares it, a path from PUBLIC_TOOLS. */
  tool?: string;
};

export type SourcedLine = { text: string; sourceId: SourceId };

/** Explanatory prose; every fact in it comes from one of the page's listed sources. */
export type CountrySection = { heading: string; paragraphs: readonly string[] };

export type ImporterIdentifier = { name: string; whoNeedsIt: string; sourceId: SourceId };

export type CountryPage = {
  slug: string;
  name: string;
  iso2: string;
  customsUnion: 'EU' | null;
  demand: readonly TermDemand[];
  /** The <title>; the layout appends " · TradeDocs". */
  metaTitle: string;
  description: string;
  /** Which documents a shipment to the country needs, 40–60 words, answer-first. */
  answer: string;
  lede: string;
  customsAuthority: { name: string; url: string; sourceId: SourceId };
  documents: readonly CountryDocument[];
  /** Country-specific invoice content (language, currency, identifiers), each sourced. */
  invoiceRequirements: readonly SourcedLine[];
  importerIdentifiers: readonly ImporterIdentifier[];
  /** Stated only with a source; null otherwise. */
  valuationBasis: { basis: 'CIF' | 'FOB'; sourceId: SourceId } | null;
  /** Who can act as importer, local registration, brokers; each paragraph sourced. */
  incotermsNotes: readonly SourcedLine[];
  /** Links to official lists only; no classification and no product examples. */
  controlledGoods: { label: string; officialUrl: string; sourceId: SourceId } | null;
  /** Wood packaging rule; null when no national or IPPC source states it for this country. */
  packaging: { ispm15: boolean; sourceId: SourceId } | null;
  /** Only with a dated official source; otherwise null (fast-changing). */
  lowValueThreshold: { text: string; effectiveDate: string; sourceId: SourceId } | null;
  /** Explanatory sections shown after the sourced tables, phrased as questions. */
  sections: readonly CountrySection[];
  faq: readonly ArticleFaq[];
  sources: readonly SourceId[];
  /** Always true for country pages. */
  regulated: true;
  /** A named reviewer's check against the sources; not an approval. Null until it exists. */
  review: { reviewer: string; date: string } | null;
  /** The tool call to action, a path from PUBLIC_TOOLS. */
  tool: string;
  published: string;
  updated: string;
  reviewed: string;
};

export const COUNTRY_DISCLAIMER =
  'This page summarises official and U.S. government guidance so you can ask the right ' +
  'questions. It is not legal, customs or tax advice, it states no duty or tax rates, and the ' +
  'destination’s customs authority, your buyer’s customs broker and your contract take ' +
  'precedence over anything here.';

/**
 * Whether a country page is indexed and listed. Per D-015 the owner publishes sourced fact
 * pages at launch and reviews them afterwards, so every sourced country page is listed; the
 * `review` record, when present, shows who checked it and when.
 */
export function isCountryListed(country: CountryPage): boolean {
  return country.sources.length > 0;
}

/** The sentences a country page shows, for the word count and the distinctness check. */
export function countrySentences(country: CountryPage): string[] {
  const text = [
    country.answer,
    country.lede,
    ...country.documents.flatMap((row) => [row.document, row.condition]),
    ...country.invoiceRequirements.map((line) => line.text),
    ...country.importerIdentifiers.flatMap((row) => [row.name, row.whoNeedsIt]),
    ...country.incotermsNotes.map((line) => line.text),
    ...(country.controlledGoods ? [country.controlledGoods.label] : []),
    ...(country.lowValueThreshold ? [country.lowValueThreshold.text] : []),
    ...country.sections.flatMap((section) => [section.heading, ...section.paragraphs]),
    ...country.faq.flatMap((entry) => [entry.q, entry.a]),
  ];
  return text
    .flatMap((block) => block.split(/(?<=[.?!])\s+/))
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

export function countryWordCount(country: CountryPage): number {
  return countWords(countrySentences(country).join(' '));
}

/** Facts on the page that carry their own source: the distinctness rule needs five or more. */
export function sourcedFactCount(country: CountryPage): number {
  return (
    country.documents.length +
    country.invoiceRequirements.length +
    country.importerIdentifiers.length +
    country.incotermsNotes.length +
    (country.valuationBasis ? 1 : 0) +
    (country.controlledGoods ? 1 : 0) +
    (country.packaging ? 1 : 0) +
    (country.lowValueThreshold ? 1 : 0)
  );
}
