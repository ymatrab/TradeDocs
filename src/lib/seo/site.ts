import { GUIDES } from '@/lib/content/guides';
import { INCOTERMS } from '@/lib/trade/incoterms';
import { documentKindLabels, type DocumentKind } from '@/lib/labels';

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
  'account: commercial invoice, proforma invoice and packing list generators, a landed cost ' +
  'calculator, CBM and chargeable weight calculators and an Incoterms 2020 guide.';

export type PublicTool = {
  path: string;
  name: string;
  summary: string;
  /** An interactive tool is software; a reference page is not, and is not marked up as one. */
  kind: 'application' | 'reference';
};

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
    path: '/tools/landed-cost-calculator',
    name: 'Landed cost calculator',
    summary:
      'Goods, freight, insurance, duty and taxes at the rates you enter, as a total and a cost per unit. No tariff lookup, nothing stored.',
    kind: 'application',
  },
  {
    path: '/tools/incoterms',
    name: 'Incoterms 2020 guide',
    summary:
      'All eleven rules in plain language, with a responsibilities chart: where risk passes, who pays what, who clears customs.',
    kind: 'reference',
  },
];

export function findPublicTool(path: string): PublicTool | undefined {
  return PUBLIC_TOOLS.find((tool) => tool.path === path);
}

/** Document types offered publicly. Certificate of origin stays out until D-008 is lifted. */
const ALL_DOCUMENT_KINDS = Object.keys(documentKindLabels) as DocumentKind[];

export const PUBLIC_DOCUMENT_KINDS: readonly DocumentKind[] = ALL_DOCUMENT_KINDS.filter(
  (kind) => kind !== 'certificate_of_origin',
);

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
/** The help centre and contact page were added on this date (D-018). */
const SUPPORT_ROUND = '2026-10-06';

export type SitemapPage = {
  path: string;
  lastModified: string;
  changeFrequency: 'weekly' | 'monthly';
  priority: number;
};

export const SITEMAP_PAGES: readonly SitemapPage[] = [
  { path: '/', lastModified: REDESIGN_ROUND, changeFrequency: 'weekly', priority: 1 },
  { path: '/tools', lastModified: REDESIGN_ROUND, changeFrequency: 'monthly', priority: 0.8 },
  ...PUBLIC_TOOLS.map((tool) => ({
    path: tool.path,
    lastModified: REDESIGN_ROUND,
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
  { path: '/help', lastModified: SUPPORT_ROUND, changeFrequency: 'monthly', priority: 0.5 },
  { path: '/contact', lastModified: SUPPORT_ROUND, changeFrequency: 'monthly', priority: 0.4 },
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
    summary: 'The agreement for using TradeDocs: what it is and is not, accounts, content, liability.',
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
