import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Conversion role (no measured volume): the accepted proforma becomes the commercial invoice
 * without retyping. Product-led: the free generator's type switch keeps parties and lines while
 * the page is open, drops "Valid until" off the proforma type and suggests INV-2026-001
 * (src/app/(marketing)/tools/invoice-generator/generator.tsx); in the workspace both invoices
 * come from one shipment, numbered in their own PI and CI series, a shipment edit bumps its
 * revision and marks earlier documents stale, a new document of the same type supersedes the
 * old one, and the set ZIP holds only current documents
 * (src/app/(app)/app/[org]/shipments/[shipment]/documents-panel.tsx, supabase/migrations).
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave B.
 */
const article: ContentArticle = {
  slug: 'proforma-to-commercial-invoice',
  title: 'From proforma to commercial invoice without retyping',
  metaTitle: 'Proforma to commercial invoice, no retyping',
  description:
    'How an accepted proforma invoice becomes the commercial invoice: what carries over, what changes, and how TradeDocs makes the second from the first in the free generator or the workspace.',
  lede: 'The buyer has accepted your proforma, the order is confirmed and the goods are being packed. Now you need the commercial invoice, and almost everything on it is already on the proforma. Retyping it is where a quantity slips or a description changes. Here is what carries over, what changes, and how to make one from the other.',
  answer:
    'To turn a proforma into a commercial invoice, keep the parties, descriptions, quantities, prices, currency and Incoterms® rule exactly as accepted, give it a commercial invoice number and the issue date, drop the validity date, and add what only the shipment confirms, such as final weights and packages. Any agreed change should appear on both.',
  keyFacts: [
    'The ITA describes a pro forma invoice as a quote in an invoice format, and the commercial invoice as the document the buyer’s customs uses to assess import duties and taxes.',
    'The ITA says a commercial invoice may add the HS code to the information on the pro forma invoice.',
    'The ITA says changes to a pro forma should not be made without the buyer’s consent.',
    'Under 19 CFR 141.85, a US importer without the seller’s invoice files a pro forma invoice and must file any other invoice it receives.',
    'In a TradeDocs shipment, the proforma and the commercial invoice are numbered in separate series and generated from the same record.',
  ],
  definitions: [
    {
      term: 'Proforma invoice',
      meaning: 'The seller’s quotation in invoice form, sent before the sale is confirmed.',
    },
    {
      term: 'Commercial invoice',
      meaning:
        'The seller’s invoice for goods actually sold and shipped, used by customs to value them.',
    },
    {
      term: 'Shipment revision',
      meaning:
        'In TradeDocs, the version number of a shipment, which goes up every time the shipment changes.',
    },
    {
      term: 'Stale document',
      meaning:
        'In TradeDocs, a document generated from an earlier revision than the shipment’s current one.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What changes between the proforma and the commercial invoice?',
      paragraphs: [
        'Very little, if the deal did not change. The ITA describes the proforma as a quote in an invoice format, and says the commercial invoice may add the HS code to the information already on the proforma. The table shows what normally carries over and what is new or different.',
      ],
      table: {
        caption: 'Proforma fields on the commercial invoice',
        head: ['Field', 'On the commercial invoice'],
        rows: [
          ['Title', 'Changes from “Proforma Invoice” to “Commercial Invoice”'],
          ['Number and date', 'New: its own invoice number and the date it is issued'],
          ['Seller, buyer and buyer reference', 'Kept word for word'],
          [
            'Descriptions, quantities and unit prices',
            'Kept as accepted, unless the buyer agreed a change',
          ],
          ['Currency, Incoterms® rule and named place', 'Kept'],
          ['Payment terms', 'Kept, as agreed in the order'],
          ['Validity date', 'Dropped: it only applies to the offer'],
          ['HS codes and origin', 'Added or confirmed for every line'],
          ['Weights and packages', 'Confirmed from the packed shipment'],
        ],
      },
    },
    {
      heading: 'Can the commercial invoice differ from the proforma?',
      paragraphs: [
        'Yes, when the sale itself changed, and then the change should be one both sides agreed. The ITA warns that changes to a proforma should not be made without the buyer’s consent, because the buyer and the import authorities rely on it for the coming shipment. If the buyer opened a letter of credit or obtained an import licence on the strength of the proforma, a commercial invoice that departs from it can cause problems with the bank or the licence.',
        'The usual legitimate differences are partial shipments, a quantity the buyer agreed to reduce, or a price agreed again after the proforma expired. In each case, record the agreement and make sure the commercial invoice states the real transaction. The commercial invoice is what customs values the goods from, so it must show what was actually sold and shipped.',
      ],
    },
    {
      heading: 'How do you convert a proforma in the free generator?',
      paragraphs: [
        'The free TradeDocs generator is one form with a type switch, and the values you have entered stay in the form while the page is open. Nothing is stored, so make the commercial invoice before you close the tab, or keep the proforma PDF to copy from.',
      ],
      steps: [
        'Open the proforma invoice generator and fill in the proforma, or keep the page you made it on open.',
        'When the buyer accepts, change the type from “Proforma invoice” to “Commercial invoice”. The parties, terms and lines stay as they are.',
        'Replace the number with a commercial invoice number; the field suggests the INV-2026-001 pattern.',
        'Set the document date to the date you issue the invoice. The “Valid until” field disappears, because it belongs to proformas only.',
        'Add or check the HS code and origin on every line, and the net weight, gross weight and packages.',
        'Download the commercial invoice PDF and compare it with the accepted proforma line by line.',
      ],
    },
    {
      heading: 'How does the workspace keep both invoices in step?',
      paragraphs: [
        'In a free TradeDocs account, the proforma and the commercial invoice are two documents from one shipment record, so the second needs no retyping at all.',
      ],
      steps: [
        'Generate the proforma from the shipment. The workspace gives it a number in its PI series and locks it to the shipment revision it came from.',
        'When the order is confirmed, update the shipment with anything final, such as packages or a shipping date. Each change raises the shipment’s revision.',
        'The proforma is then shown as stale, with a note saying which revision it was rendered from. It stays downloadable as the offer the buyer accepted.',
        'Generate the commercial invoice from the same shipment. It gets a number in its own CI series, with the same parties, lines and terms.',
        'Generate the packing list from the same revision, and download the set: a ZIP of the current documents with a checksum manifest.',
      ],
    },
    {
      heading: 'What if the commercial invoice needs correcting?',
      paragraphs: [
        'Correct the shipment, not the PDF. Once you edit the shipment, the existing commercial invoice is marked stale and the workspace offers to regenerate it. A new commercial invoice for the shipment marks the earlier one superseded, so it stays in the history but is no longer part of the set. Owners and administrators can also void a document with a reason, which is kept beside it.',
        'That history matters when someone asks which version was sent. The proforma shows what was offered, the superseded invoice shows what was first issued, and the current one shows what the shipment says now.',
      ],
    },
    {
      heading: 'What is a pro forma invoice at US customs?',
      paragraphs: [
        'It is a different document with the same name. Under 19 CFR 141.85, a US importer who does not have the seller’s commercial invoice at entry can file a pro forma invoice, prepared and signed by the importer, and undertakes to file any other invoice it receives. That is a stand-in for the commercial invoice at the border, not the seller’s quotation, and it does not replace the commercial invoice you send with the goods.',
      ],
    },
  ],
  faq: [
    {
      q: 'Can I use the same number for the proforma and the commercial invoice?',
      a: 'It is clearer not to. Separate numbers let everyone tell the offer from the invoice; reference the proforma or the buyer’s order number on the commercial invoice instead.',
    },
    {
      q: 'Does the proforma become invalid once the commercial invoice is issued?',
      a: 'It stops being the live document, but keep it. It records what the buyer accepted and may be what their bank or licensing authority holds.',
    },
    {
      q: 'Can customs accept a proforma instead of a commercial invoice?',
      a: 'In the US, an importer without the commercial invoice can file its own pro forma invoice under 19 CFR 141.85. Other countries have their own rules, so send a commercial invoice with the goods.',
    },
    {
      q: 'What if only part of the order ships?',
      a: 'Issue the commercial invoice for the quantities actually shipped. In TradeDocs, adjust the shipment’s quantities before you generate it, and make a new shipment for the balance.',
    },
    {
      q: 'Does the free generator remember my proforma?',
      a: 'Only while the page stays open. Switch the type before you close it, or create a free account so the shipment and its documents are saved.',
    },
  ],
  sources: [
    'trade-gov-proforma-invoice',
    'a2-trade-gov-commercial-invoice',
    'us-cbp-proforma-invoice',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: [
    '/tools/invoice-generator',
    '/tools/proforma-invoice-generator',
    '/tools/packing-list-generator',
  ],
  callout: {
    afterSection: 1,
    tool: '/tools/proforma-invoice-generator',
    title: 'Start from the proforma',
    text: 'Fill in the proforma once, then switch the same form to a commercial invoice when the buyer accepts. Nothing to retype, no account needed.',
  },
  related: [
    '/guides/proforma-vs-commercial-invoice',
    '/blog/proforma-invoice-example',
    '/guides/what-is-a-proforma-invoice',
    '/blog/how-to-fill-out-a-commercial-invoice',
    '/blog/commercial-invoice-and-packing-list-must-match',
    '/guides/export-payment-terms',
  ],
  cover: {
    id: 'VnK5iT01HYQ',
    src: 'https://images.unsplash.com/photo-1632152133952-98b268dc4b86',
    width: 3515,
    height: 2344,
    alt: 'Printed papers and a pen on a wooden table, as an accepted quotation is turned into the final invoice',
    caption: 'Papers and a pen on a wooden table',
    photographer: { name: '2H Media', profile: 'https://unsplash.com/@2hmedia' },
    page: 'https://unsplash.com/photos/a-wooden-table-topped-with-papers-and-a-pen-VnK5iT01HYQ',
  },
};

export default article;
