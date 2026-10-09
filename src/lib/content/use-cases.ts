import type { FeatureKey } from '@/lib/billing/plans';
import type { FaqEntry } from '@/lib/content/faq';

/**
 * The use-case pages, /for/<slug> (content plan v3, "Use-case pages: 3").
 *
 * Each page describes only what the product does today. The workspace features a page
 * names are listed by key and rendered from FEATURES in src/lib/billing/plans.ts, so the
 * capability claims and their limits come from the one module the pricing page reads. The
 * prose here may describe how a role uses those features; it never adds one. No customer,
 * result or competitor is named, and no price appears.
 *
 * Plain data with type-only imports, so the sitemap and llms.txt can read it without a
 * runtime cycle through plans.ts (which itself reads lib/seo/site).
 */

export type UseCaseLink = { href: string; label: string };

export type UseCase = {
  slug: 'exporters' | 'freight-forwarders' | 'trade-consultants';
  /** The breadcrumb and link name, such as "For exporters". */
  name: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  lede: string;
  /** How this role uses what exists, one card each. */
  jobs: { title: string; detail: string }[];
  /** Workspace features to list, rendered from FEATURES with their limits. */
  features: readonly FeatureKey[];
  /** What it does not do for this role, stated plainly. */
  boundaries: string[];
  tools: UseCaseLink[];
  reading: UseCaseLink[];
  faq: readonly FaqEntry[];
  /** YYYY-MM-DD the page's content last changed. */
  updated: string;
};

const ADDED = '2026-10-08';

export const USE_CASES: readonly UseCase[] = [
  {
    slug: 'exporters',
    name: 'For exporters',
    title: 'Export documentation software for exporters and manufacturers',
    description:
      'Prepare the commercial invoice, proforma invoice, packing list and delivery note for each shipment from one record, with your companies and products saved once. Free while early.',
    eyebrow: 'For exporters and manufacturers',
    h1: 'Your export paperwork, from one shipment record.',
    lede: 'Enter the parties, goods, packing and terms of a shipment once. TradeDocs prepares the commercial invoice, proforma invoice, packing list and delivery note from that record, so the quantities and values agree across the set.',
    jobs: [
      {
        title: 'Quote with a proforma',
        detail:
          'Prepare the proforma invoice your buyer needs for payment, a letter of credit or an import licence, then ship against the same figures.',
      },
      {
        title: 'Ship with a matching set',
        detail:
          'The commercial invoice, packing list and delivery note come from the same shipment revision, so a bank or customs officer comparing them finds the same numbers.',
      },
      {
        title: 'Reuse what you typed last time',
        detail:
          'Your company, customers and products, with HS codes, origins and units, are saved once in the directory and catalog and picked for the next shipment.',
      },
      {
        title: 'Change a shipment safely',
        detail:
          'A generated document stays locked to the revision it came from. When the shipment changes, the earlier document is marked stale and you decide whether to prepare it again.',
      },
    ],
    features: [
      'workspace.shipments',
      'workspace.documents',
      'workspace.revisions',
      'workspace.catalog',
      'workspace.import',
      'workspace.zip',
      'team.members',
    ],
    boundaries: [
      'It prepares documents; it does not issue, certify or file them. Export declarations, transport documents and certified certificates of origin come from your broker, carrier or chamber.',
      'It does not look up tariffs, duty rates or export controls. HS codes and origins are your own declaration.',
    ],
    tools: [
      { href: '/tools/proforma-invoice-generator', label: 'Proforma invoice generator' },
      { href: '/tools/invoice-generator', label: 'Commercial invoice generator' },
      { href: '/tools/packing-list-generator', label: 'Packing list generator' },
      { href: '/tools/export-price-calculator', label: 'Export price calculator' },
    ],
    reading: [
      { href: '/blog/export-documents-checklist', label: 'Export documents checklist' },
      {
        href: '/blog/commercial-invoice-and-packing-list-must-match',
        label: 'Why the invoice and packing list must match',
      },
      { href: '/guides/proforma-vs-commercial-invoice', label: 'Proforma vs commercial invoice' },
    ],
    faq: [
      {
        q: 'Which export documents does TradeDocs prepare?',
        a: 'The commercial invoice, proforma invoice, packing list and delivery note, as PDFs from one shipment. A certificate of origin is offered only once its legal review is recorded, and then as your own preparation for the issuing chamber or authority to certify where required. Transport documents and customs declarations are outside what TradeDocs does.',
      },
      {
        q: 'Can I try it without an account?',
        a: 'Yes. The commercial invoice, proforma invoice, packing list and delivery note generators and the calculators work without an account; nothing you type in them is stored.',
      },
      {
        q: 'Does TradeDocs file my export declaration?',
        a: 'No. It prepares the commercial documents. Filing the export declaration is done by you or your customs broker in the customs system of the exporting country.',
      },
    ],
    updated: '2026-10-09',
  },
  {
    slug: 'freight-forwarders',
    name: 'For freight forwarders',
    title: 'Document preparation for freight forwarders and their shippers',
    description:
      'TradeDocs prepares commercial invoices, proforma invoices, packing lists and delivery notes for your shippers. It is document preparation only, not a forwarding, booking or tracking system.',
    eyebrow: 'For freight forwarders and agents',
    h1: 'Client document preparation, not a forwarding system.',
    lede: 'TradeDocs prepares the commercial paperwork that travels with a shipment: commercial invoice, proforma invoice, packing list and delivery note. It does not book freight, rate shipments, track cargo or issue transport documents. If you prepare those commercial documents for shippers, or want them to send you a packing list that adds up, that is what it is for.',
    jobs: [
      {
        title: 'Prepare documents for a shipper',
        detail:
          'Keep each shipper in its own organization, with its companies and products, and prepare its invoice and packing list from one shipment record.',
      },
      {
        title: 'Check the cargo before you quote',
        detail:
          'Measure a consignment in cubic metres, chargeable weight and container fit with the free calculators, from the shipper’s carton sizes and weights.',
      },
      {
        title: 'Point shippers to a packing list they can fill in',
        detail:
          'The free packing list generator needs no account and downloads a PDF with packages and net and gross weights per line.',
      },
      {
        title: 'Hand over a consistent set',
        detail:
          'A shipment’s current documents download as one ZIP with a checksum manifest, every page marked as prepared, not issued.',
      },
    ],
    features: [
      'workspace.shipments',
      'workspace.documents',
      'workspace.zip',
      'workspace.catalog',
      'team.members',
    ],
    boundaries: [
      'It is not a forwarding TMS: no bookings, rates, quotes, carrier connections, tracking, milestones or invoicing for freight.',
      'It does not issue bills of lading, air waybills or house documents, and it does not file customs declarations, ISF or export filings.',
      'There is no shipper portal: a shipper works in TradeDocs as a member of an organization, or uses the free generators on their own.',
    ],
    tools: [
      { href: '/tools/cbm-calculator', label: 'CBM calculator' },
      { href: '/tools/chargeable-weight', label: 'Dimensional weight calculator' },
      { href: '/tools/container-loading-calculator', label: 'Container loading calculator' },
      { href: '/tools/packing-list-generator', label: 'Packing list generator' },
    ],
    reading: [
      {
        href: '/guides/freight-forwarder-vs-customs-broker',
        label: 'Freight forwarder vs customs broker',
      },
      { href: '/blog/shippers-letter-of-instruction', label: 'Shipper’s letter of instruction' },
      { href: '/guides/lcl-vs-fcl', label: 'LCL or FCL?' },
    ],
    faq: [
      {
        q: 'Is TradeDocs freight forwarding software?',
        a: 'No. It prepares commercial documents for a shipment: the commercial invoice, proforma invoice, packing list and delivery note. It has no bookings, rates, tracking or transport documents, so it sits beside a forwarding system rather than replacing one.',
      },
      {
        q: 'Can I prepare documents for several shippers?',
        a: 'Yes. One person can belong to several organizations, so each shipper can have its own, with its own companies, products, shipments and members. Records in one organization are not visible from another.',
      },
      {
        q: 'Can my shippers use it without an account?',
        a: 'The free generators and calculators need no account. To keep shipments, companies and products, a shipper needs to be a member of an organization.',
      },
    ],
    updated: ADDED,
  },
  {
    slug: 'trade-consultants',
    name: 'For trade consultants',
    title: 'Export document preparation for trade consultants',
    description:
      'Prepare draft export documents for each client in its own organization, with its companies, products and teammates kept apart. You prepare the documents; the advice stays yours.',
    eyebrow: 'For trade consultants and back offices',
    h1: 'Prepare each client’s documents in its own workspace.',
    lede: 'Keep every client in a separate organization with its own companies, products, shipments and members. Prepare the commercial invoice, proforma invoice, packing list and delivery note from each shipment, and hand the client a set whose figures agree.',
    jobs: [
      {
        title: 'One organization per client',
        detail:
          'You can belong to several organizations and switch between them. A client’s records stay in its organization, and access is enforced by the database, not only by the interface.',
      },
      {
        title: 'Work with the client’s own team',
        detail:
          'Invite the client’s staff to their organization by link, as an admin or a member, so they can review its shipments and download its documents.',
      },
      {
        title: 'Load a client’s catalog in one go',
        detail:
          'Import products from a CSV spreadsheet, with HS codes, origins and units, instead of typing them into each shipment.',
      },
      {
        title: 'Keep drafts and corrections traceable',
        detail:
          'Preview a document before you generate it. A generated document is locked to its shipment revision, and a change marks it stale instead of rewriting it.',
      },
    ],
    features: [
      'workspace.shipments',
      'workspace.documents',
      'workspace.revisions',
      'workspace.catalog',
      'workspace.import',
      'team.members',
    ],
    boundaries: [
      'TradeDocs prepares documents from the data entered. Classification, origin, valuation and compliance advice remain your work and your client’s declaration.',
      'It does not issue, certify or file anything, and it never presents a document as approved by an authority.',
    ],
    tools: [
      { href: '/tools/proforma-invoice-generator', label: 'Proforma invoice generator' },
      { href: '/tools/landed-cost-calculator', label: 'Landed cost calculator' },
      { href: '/tools/export-price-calculator', label: 'Export price calculator' },
      { href: '/tools/incoterms', label: 'Incoterms® 2020 guide' },
    ],
    reading: [
      { href: '/guides', label: 'All trade guides' },
      { href: '/guides/customs-value', label: 'Customs value' },
      { href: '/blog/how-to-find-hs-code', label: 'How to find an HS code' },
    ],
    faq: [
      {
        q: 'Can I keep each client separate?',
        a: 'Yes. Create an organization for each client. Its companies, products, shipments, documents and members belong to it, and a request for another organization’s data returns nothing.',
      },
      {
        q: 'Can my client see the documents I prepare?',
        a: 'Yes, if you invite them to their organization. Members can open its shipments and download the documents prepared there.',
      },
      {
        q: 'Does TradeDocs check classification or compliance?',
        a: 'No. It prepares documents from the data entered and does not classify goods, look up duty rates or screen export controls. That judgement stays with you and your client.',
      },
    ],
    updated: ADDED,
  },
];

export function findUseCase(slug: string): UseCase | undefined {
  return USE_CASES.find((useCase) => useCase.slug === slug);
}
