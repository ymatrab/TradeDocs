import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Product-led (conversion role: the second shipment from saved records). No search volume
 * claimed. Describes the workspace as built: duplicate_shipment
 * (supabase/migrations/20261006000400_shipment_reuse_and_import.sql, with the buyer reference
 * and proforma validity left out per 20261007000200_document_commercial_terms.sql), the
 * "Reuse for a new shipment" form, the catalog picker, product CSV import (MAX_IMPORT_ROWS)
 * and document staleness. No prices; no claim that sign-up is open (ArticleView offers an
 * account only where accounts are open).
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave C.
 */
const article: ContentArticle = {
  slug: 'reuse-shipment-data-for-repeat-orders',
  title: 'How to reuse shipment data for a repeat order',
  metaTitle: 'Reuse shipment data for repeat export orders',
  description:
    'Prepare the documents for a repeat export order from the last shipment: what to copy, what must change every time, and how the TradeDocs workspace does it.',
  lede: 'The second order from a buyer usually looks like the first: the same consignee, the same Incoterms® rule, mostly the same products, often the same cartons. Retyping all of it is slow and invites small differences between shipments that should match. Starting from the last shipment is faster, as long as you know which details must never be carried over unchecked.',
  answer:
    'To reuse shipment data for a repeat order, start the new shipment from the previous one so the parties, terms, product lines and packing carry over, then change what is new: the reference, the buyer’s order number, quantities, prices, dates and weights. Generate fresh documents with new numbers; never re-send the old invoice with edits.',
  keyFacts: [
    'In TradeDocs, “Reuse for a new shipment” creates a new draft with the same parties, terms, lines and packing, and leaves the original shipment and its documents unchanged.',
    'The copy does not carry the buyer’s reference or the proforma validity date, because a new order has its own purchase order and its own offer.',
    'Line values are copied as they were, so prices and quantities need checking before any document is generated.',
    'Each shipment reference must be unique within the organization, up to 60 characters.',
    'The product catalog can be imported from a CSV spreadsheet of up to 2,000 rows per file.',
  ],
  definitions: [
    {
      term: 'Repeat order',
      meaning: 'A new order from an existing buyer for goods you have shipped to them before.',
    },
    {
      term: 'Shipment record',
      meaning:
        'The saved parties, terms, lines and packing of one shipment, from which every document is generated.',
    },
    {
      term: 'Product catalog',
      meaning:
        'Your saved list of products with their descriptions, codes, units, prices and weights, reused on every shipment.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'Why reuse the last shipment instead of starting again?',
      paragraphs: [
        'Because most of a repeat shipment is already right. The exporter and consignee, their addresses, the Incoterms® rule and named place, the ports, the currency and the product descriptions were checked on the last shipment and accepted by the buyer, the forwarder and customs. Copying them keeps the new documents consistent with the old ones.',
        'Retyping invites drift. A product described one way in March and another way in June, or a consignee address spelt two ways, makes two shipments that should look alike look different to the people who compare them. Reusing the record removes that source of error, so your attention goes to the details that really changed.',
      ],
    },
    {
      heading: 'What carries over and what must change?',
      paragraphs: [
        'Treat the copy as a draft. The stable details carry over; the details of this order must be entered fresh. Weights matter as much as prices: the ITA notes that forwarders use the packing list to work out weights and freight costs, so a carton that changed size or contents needs measuring again.',
      ],
      table: {
        caption: 'What a repeat shipment copies and what you set again',
        head: ['Detail', 'In the copy', 'What to do'],
        rows: [
          ['Exporter, consignee, notify party', 'Copied', 'Check addresses and contacts are still current'],
          ['Incoterms® rule and place, ports, countries, currency', 'Copied', 'Confirm they match the new order'],
          ['Marks and numbers', 'Copied', 'Update any order number or carton range in the marks'],
          ['Product lines: description, code, origin, unit', 'Copied', 'Check each line is still accurate'],
          ['Quantities and unit prices', 'Copied as they were', 'Change them to this order’s figures'],
          ['Packing: packages, sizes, weights, contents', 'Copied', 'Re-measure and re-weigh if anything changed'],
          ['Shipment reference', 'New, entered by you', 'Must be unique in your organization'],
          ['Buyer’s reference (PO number)', 'Not copied', 'Enter the new order’s number'],
          ['Proforma validity date, shipping date', 'Not copied', 'Set them for this order'],
        ],
      },
    },
    {
      heading: 'How do you start a repeat shipment in TradeDocs?',
      paragraphs: [
        'From the previous shipment’s page. The workspace has a “Reuse for a new shipment” panel that copies the shipment into a new draft. These are the steps:',
      ],
      steps: [
        'Open the shipment you are repeating.',
        'In “Reuse for a new shipment”, enter a new shipment reference, unique within your organization, and choose “Create the new shipment”.',
        'On the new draft, add the buyer’s new order number and any dates for this order.',
        'Change quantities and unit prices to the new order’s figures, remove lines that are not in this order, and add new ones from the catalog picker.',
        'Review the packing panel: adjust packages, sizes and weights, and allocate any line it lists as not fully packed.',
        'Generate the commercial invoice, packing list and any other documents the shipment needs. They get new numbers of their own.',
      ],
    },
    {
      heading: 'What happens to the original shipment and its documents?',
      paragraphs: [
        'Nothing. The copy is a separate shipment with its own history, starting at revision 1, and the workspace records which shipment it was copied from. The original shipment and every document generated from it stay exactly as they were, so the documents you already sent still match what you have on file.',
        'Two details are handled with care. A company that has been archived in your directory is left blank on the copy rather than revived, so you choose the current party. And if a line on the original was packed in a greater quantity than it now shows, that line is left unallocated in the copy, so the packing panel lists it as a line to pack instead of carrying a mismatch forward.',
      ],
    },
    {
      heading: 'How does the product catalog speed up new lines?',
      paragraphs: [
        'By keeping each product’s details in one place. A saved product can hold its SKU, description, commodity code you have confirmed, unit, unit price, country of origin, weights and package details. On a shipment, the catalog picker adds a line from a saved product and the quantity you state, and the values are copied from the catalog inside the database, so a line cannot mix two versions of a product edited at the same moment.',
        'If your product list already lives in a spreadsheet, the catalog imports from a CSV file of up to 2,000 rows per file. Keep the catalog current: a price or description changed there applies to the lines you add from then on, not to shipments already prepared.',
      ],
    },
    {
      heading: 'Why generate new documents rather than edit the old ones?',
      paragraphs: [
        'Because every invoice should describe one shipment and carry its own number. Editing last month’s PDF to change the quantities leaves the old number, the old date or an old PO reference in place more often than anyone intends, and two different shipments then share one invoice number. For a US import, 19 CFR 141.86 asks each invoice to state when, where and between whom the sale was made, which is exactly what an edited old invoice tends to get wrong.',
        'In TradeDocs, documents are generated from one shipment revision and locked to it. When the shipment changes after a document was generated, that document is marked as out of date, so a copy that no longer matches is not sent by mistake. A shipment’s current documents can also be downloaded together as one ZIP with a checksum manifest.',
        'The workspace needs a TradeDocs account. If sign-up is not open when you read this, the free generators work without one: fill in the commercial invoice generator, download it, and switch the type to packing list for a matching document. Nothing is stored there, so keep your own copy of the figures for the next order.',
      ],
    },
  ],
  faq: [
    {
      q: 'Can I reuse a shipment for a different buyer?',
      a: 'Yes. The copy brings the original parties with it, so change the consignee and any notify party in the parties panel, and check the terms, currency and marks that belonged to the first buyer.',
    },
    {
      q: 'Does the copy keep the old document numbers?',
      a: 'No. The copy has no documents of its own until you generate them, and each document generated for it gets its own number.',
    },
    {
      q: 'Will the copy update if I edit the original later?',
      a: 'No. Once created, the two shipments are independent. A later change to one does not affect the other.',
    },
    {
      q: 'What if prices changed since the last order?',
      a: 'Change the unit prices on the new shipment’s lines before you generate anything. The copy keeps the old prices exactly as they were, which is why the reuse panel asks you to check prices and quantities.',
    },
    {
      q: 'Can I reuse data with the free generators?',
      a: 'Not between visits. The free generators store nothing, so each document starts from a blank form. Reusing saved shipments, companies and products is what the workspace is for.',
    },
  ],
  sources: ['c5-cornell-19-cfr-141-86', 'a2-trade-gov-packing-list'],
  primaryTool: '/tools/invoice-generator',
  tools: [
    '/tools/invoice-generator',
    '/tools/packing-list-generator',
    '/tools/proforma-invoice-generator',
  ],
  callout: {
    afterSection: 1,
    tool: '/tools/invoice-generator',
    title: 'One form, two matching documents',
    text: 'In the free commercial invoice generator, fill in the order once, download the invoice, then switch the type to packing list so both documents share the same parties and lines.',
  },
  related: [
    '/blog/commercial-invoice-and-packing-list-must-match',
    '/blog/how-to-make-a-packing-list-from-your-invoice',
    '/blog/proforma-to-commercial-invoice',
    '/blog/how-to-fill-out-a-commercial-invoice',
    '/blog/export-documents-checklist',
  ],
  cover: {
    id: 'V5XaBkW6PO8',
    src: 'https://images.unsplash.com/photo-1648747067192-790595bc6d5e',
    width: 5030,
    height: 4024,
    alt: 'A woman beside a sealed cardboard box on a table, preparing another order for dispatch',
    caption: 'Preparing a boxed order on a table',
    photographer: { name: 'M. Cooper', profile: 'https://unsplash.com/@mcoopercreative' },
    page: 'https://unsplash.com/photos/a-woman-standing-next-to-a-cardboard-box-on-top-of-a-table-V5XaBkW6PO8',
  },
};

export default article;
