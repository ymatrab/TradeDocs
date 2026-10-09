import { COUNTRIES_UPDATED, LISTED_COUNTRIES } from '@/lib/content/countries';
import { GLOSSARY_UPDATED, LISTED_GLOSSARY } from '@/lib/content/glossary';
import { GUIDES } from '@/lib/content/guides';
import { BLOG_UPDATED, POSTS } from '@/lib/content/posts';
import { USE_CASES } from '@/lib/content/use-cases';
import { INCOTERMS } from '@/lib/trade/incoterms';
import { documentKindLabels, type DocumentKind } from '@/lib/labels';
import { isRegulatedDocumentKind } from '@/lib/trade/regulated';

/**
 * The public surface, described once.
 *
 * The sitemap, llms.txt, structured data and the related-tools block all read from here, so
 * a tool cannot be linked from one place and missing from another. Pages keep their own
 * copy; this holds the facts search engines and assistants are given about them.
 */

export const SITE_NAME = 'TradeDocs';

export const SITE_DESCRIPTION =
  'TradeDocs is a shipment workspace for exporters and the people who prepare their paperwork. ' +
  'You record a shipment’s parties, goods and terms once, and it prepares the commercial ' +
  'invoice, proforma invoice, packing list and delivery note from that one record, so the ' +
  'figures agree across the set. It is free while early, and its free tools work without an ' +
  'account: commercial invoice, proforma invoice, packing list and delivery note generators, ' +
  'landed cost and export price calculators, CBM, chargeable weight, container loading and pallet ' +
  'calculators, CBM-to-cubic-feet and kg-to-lb converters, an HS code lookup that searches the ' +
  'official US and UK tariffs (a lookup, not a classification), an Incoterms 2020 guide and a ' +
  'glossary of shipping terms.';

export type PublicTool = {
  path: string;
  name: string;
  summary: string;
  /** An interactive tool is software; a reference page is not, and is not marked up as one. */
  kind: 'application' | 'reference';
  /** YYYY-MM-DD the page's content last changed, when later than the redesign round. */
  updated?: string;
};

/**
 * The day the delivery note, container loading and unit converter pages were added, and the
 * CBM-to-cubic-feet converter and pallet calculator after them.
 */
const TOOLS_ROUND = '2026-10-07';

/** The export price calculator and the three use-case pages were added this day. */
const WAVE_C_ROUND = '2026-10-08';

/** The HS code lookup and denied-party screening pages were added this day (D-025). */
const LOOKUPS_ROUND = '2026-10-09';

export const PUBLIC_TOOLS: readonly PublicTool[] = [
  {
    path: '/tools/invoice-generator',
    name: 'Commercial invoice generator',
    summary:
      'A fillable commercial invoice template: enter the parties and goods and download the PDF. No account, no watermark, nothing stored.',
    kind: 'application',
  },
  {
    path: '/tools/proforma-invoice-generator',
    name: 'Proforma invoice generator',
    summary:
      'Fill in a proforma invoice for a quotation, a letter of credit or an import licence and download the PDF. No account, nothing stored.',
    kind: 'application',
  },
  {
    path: '/tools/packing-list-generator',
    name: 'Packing list generator',
    summary:
      'An export packing list with packages, net and gross weights per line, downloaded as a PDF. No account, nothing stored.',
    kind: 'application',
  },
  {
    path: '/tools/delivery-note-generator',
    name: 'Delivery note generator',
    summary:
      'A delivery note with the parties, goods and quantities and no prices, downloaded as a PDF. No account, nothing stored.',
    kind: 'application',
    updated: TOOLS_ROUND,
  },
  {
    path: '/tools/cbm-calculator',
    name: 'CBM calculator',
    summary:
      'Cubic metres and cubic feet from carton dimensions, in any unit, with a check against 20ft, 40ft and high-cube containers.',
    kind: 'application',
  },
  {
    path: '/tools/chargeable-weight',
    name: 'Dimensional (volumetric) weight calculator',
    summary:
      'Dimensional against actual weight for air, express, road groupage and sea LCL, and which one you will be billed on.',
    kind: 'application',
  },
  {
    path: '/tools/container-loading-calculator',
    name: 'Container loading calculator',
    summary:
      'How many cartons or pallets fit a 20ft, 40ft or high-cube container by volume and weight, and how many containers you need. An estimate, not a stow plan.',
    kind: 'application',
    updated: TOOLS_ROUND,
  },
  {
    path: '/tools/unit-converter',
    name: 'CBM to cubic feet and kg to lb converter',
    summary:
      'Cubic metres to cubic feet and kilograms to pounds, both ways, with the exact factors NIST lists.',
    kind: 'application',
    updated: TOOLS_ROUND,
  },
  {
    path: '/tools/cbm-to-cubic-feet',
    name: 'CBM to cubic feet converter',
    summary:
      'A volume in cubic metres, cubic feet, cm³, cubic inches or litres, shown in all five with the exact factors NIST lists.',
    kind: 'application',
    updated: TOOLS_ROUND,
  },
  {
    path: '/tools/pallet-calculator',
    name: 'Pallet calculator',
    summary:
      'Cartons per layer and per pallet, the loaded height and the pallet gross weight, for 48 × 40 in, euro and 1,200 × 1,000 mm pallets.',
    kind: 'application',
    updated: TOOLS_ROUND,
  },
  {
    path: '/tools/landed-cost-calculator',
    name: 'Landed cost calculator',
    summary:
      'Goods, freight, insurance, duty and taxes at the rates you enter, as a total and a cost per unit. No tariff lookup, nothing stored.',
    kind: 'application',
  },
  {
    path: '/tools/export-price-calculator',
    name: 'Export price calculator',
    summary:
      'Your ex-works price plus the inland, clearance, loading, freight and insurance costs you enter, as FCA/FOB, CFR/CPT, CIF/CIP and a DDP estimate. No rates of our own.',
    kind: 'application',
    updated: WAVE_C_ROUND,
  },
  {
    path: '/tools/hs-code-lookup',
    name: 'HS code lookup',
    summary:
      'Search the official US HTS and UK Trade Tariff by description or code, with a link to each line. A lookup, not a classification; no duty rates.',
    kind: 'application',
    updated: LOOKUPS_ROUND,
  },
  {
    path: '/tools/incoterms',
    name: 'Incoterms 2020 guide',
    summary:
      'All eleven rules in plain language, with a responsibilities chart: where risk passes, who pays what, who clears customs.',
    kind: 'reference',
  },
];

/**
 * Denied-party screening runs on the trade.gov Consolidated Screening List API, which needs
 * a subscription key the owner registers (CSL_API_KEY, D-025). Until the key is set the page
 * says so and points at the official search, and the tool is listed nowhere as available:
 * not on the hub, in the sitemap, in llms.txt or in the counts of free tools. Callers decide
 * availability with cslApiKey() from lib/screening/config and pass it to listedTools.
 */
export const SCREENING_TOOL: PublicTool = {
  path: '/tools/denied-party-screening',
  name: 'Denied party screening',
  summary:
    'Search a name against the US Consolidated Screening List (Commerce, State and Treasury lists), with the source list for each match. A screening aid, not a compliance determination.',
  kind: 'application',
  updated: LOOKUPS_ROUND,
};

/** Every tool listed where tools are listed, given whether screening is available. */
export function listedTools(screeningAvailable: boolean): readonly PublicTool[] {
  return screeningAvailable ? [...PUBLIC_TOOLS, SCREENING_TOOL] : PUBLIC_TOOLS;
}

/** The screening page's sitemap entry, only while the tool works. */
export function screeningSitemapPages(screeningAvailable: boolean): SitemapPage[] {
  if (!screeningAvailable) return [];
  return [
    {
      path: SCREENING_TOOL.path,
      lastModified: SCREENING_TOOL.updated ?? LOOKUPS_ROUND,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}

export function findPublicTool(path: string): PublicTool | undefined {
  return [...PUBLIC_TOOLS, SCREENING_TOOL].find((tool) => tool.path === path);
}

const ALL_DOCUMENT_KINDS = Object.keys(documentKindLabels) as DocumentKind[];

/**
 * Document types offered publicly. A regulated type (the certificate of origin) is listed
 * only while its gate is on (D-008, D-025): pages pass regulatedDocumentsEnabled() from
 * src/lib/config/server.ts, so the list follows ENABLE_REGULATED_DOCUMENTS and its review.
 */
export function publicDocumentKinds(regulatedOffered: boolean): readonly DocumentKind[] {
  return ALL_DOCUMENT_KINDS.filter((kind) => regulatedOffered || !isRegulatedDocumentKind(kind));
}

/**
 * The date each public page's content last changed, as YYYY-MM-DD.
 *
 * Written by hand when a page's copy or data changes, never computed from the clock: a
 * sitemap that reports every page as modified on every request teaches crawlers to ignore
 * the field. 2026-10-05 is the Manifest redesign round, which rewrote all of these, and
 * the content round the same day, which added the guides and three tools. A page whose copy
 * changes later gets its own date here rather than moving the others.
 */
const REDESIGN_ROUND = '2026-10-05';
/** The homepage gained its photo, document, audience, checklist and FAQ sections. */
const HOME_ROUND = '2026-10-06';

/** The pricing page and its plan list (src/lib/billing/plans.ts) were added this day. */
const PRICING_ROUND = '2026-10-06';

/** The help centre and contact page were added on this date (D-018). */
const SUPPORT_ROUND = '2026-10-06';

export type SitemapPage = {
  path: string;
  lastModified: string;
  changeFrequency: 'weekly' | 'monthly';
  priority: number;
};

export const SITEMAP_PAGES: readonly SitemapPage[] = [
  { path: '/', lastModified: HOME_ROUND, changeFrequency: 'weekly', priority: 1 },
  { path: '/tools', lastModified: TOOLS_ROUND, changeFrequency: 'monthly', priority: 0.8 },
  { path: '/pricing', lastModified: PRICING_ROUND, changeFrequency: 'monthly', priority: 0.7 },
  ...USE_CASES.map((useCase) => ({
    path: `/for/${useCase.slug}`,
    lastModified: useCase.updated,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  })),
  ...PUBLIC_TOOLS.map((tool) => ({
    path: tool.path,
    lastModified: tool.updated ?? REDESIGN_ROUND,
    changeFrequency: 'monthly' as const,
    priority: tool.path === '/tools/invoice-generator' ? 0.8 : 0.7,
  })),
  ...INCOTERMS.map((term) => ({
    path: `/tools/incoterms/${term.code.toLowerCase()}`,
    lastModified: REDESIGN_ROUND,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  })),
  { path: '/guides', lastModified: REDESIGN_ROUND, changeFrequency: 'monthly', priority: 0.6 },
  ...GUIDES.map((guide) => ({
    path: `/guides/${guide.slug}`,
    lastModified: guide.updated,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  })),
  // The hub changes whenever a post is added, so it carries the newest post's date.
  { path: '/blog', lastModified: BLOG_UPDATED, changeFrequency: 'weekly', priority: 0.6 },
  ...POSTS.map((post) => ({
    path: `/blog/${post.slug}`,
    lastModified: post.updated,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  })),

  // The glossary: the hub and every term not held back by the review gate.
  { path: '/glossary', lastModified: GLOSSARY_UPDATED, changeFrequency: 'monthly', priority: 0.6 },
  ...LISTED_GLOSSARY.map((term) => ({
    path: `/glossary/${term.slug}`,
    lastModified: term.updated,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  })),
  // Country pages are regulated: listed only once reviewed, and the hub with the first of them.
  ...(LISTED_COUNTRIES.length > 0
    ? [
        {
          path: '/export-documents',
          lastModified: COUNTRIES_UPDATED,
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        },
      ]
    : []),
  ...LISTED_COUNTRIES.map((country) => ({
    path: `/export-documents/${country.slug}`,
    lastModified: country.updated,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  })),

  { path: '/help', lastModified: SUPPORT_ROUND, changeFrequency: 'monthly', priority: 0.5 },
  { path: '/contact', lastModified: SUPPORT_ROUND, changeFrequency: 'monthly', priority: 0.4 },
  { path: '/developers', lastModified: '2026-10-09', changeFrequency: 'monthly', priority: 0.4 },
];

/**
 * The legal pages (D-009). They are public routes but enter the sitemap and llms.txt only
 * once the owner has approved them (LEGAL_APPROVED_AT with a complete identity); until then
 * they are drafts, noindex and unlisted. Their date is the approval date, never this list's.
 */
export const LEGAL_PAGES: readonly { path: string; name: string; summary: string }[] = [
  {
    path: '/privacy',
    name: 'Privacy policy',
    summary: 'What personal data TradeDocs handles, why, who processes it and your rights.',
  },
  {
    path: '/terms',
    name: 'Terms of use',
    summary:
      'The agreement for using TradeDocs: what it is and is not, accounts, content, liability.',
  },
  {
    path: '/cookies',
    name: 'Cookie policy',
    summary: 'The only cookies are the sign-in session; no analytics, advertising or tracking.',
  },
];

/** Legal pages as sitemap entries, dated by their approval. Empty while they are drafts. */
export function legalSitemapPages(approvedAt: string | null): SitemapPage[] {
  if (!approvedAt) return [];
  return LEGAL_PAGES.map((page) => ({
    path: page.path,
    lastModified: approvedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.3,
  }));
}
