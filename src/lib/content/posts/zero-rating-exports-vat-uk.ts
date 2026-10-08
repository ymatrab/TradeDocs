import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google UK, 2026-10-07): "vat on exports" 140, KD 8; "proof of export" 40.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave C.
 * Every rule is from HMRC's VAT Notice 703 (page last updated 4 March 2026), opened 2026-10-08.
 * Describes HMRC's conditions in general terms; never tells a reader what their own VAT
 * position is. Example parties and figures are invented.
 */
const article: ContentArticle = {
  slug: 'zero-rating-exports-vat-uk',
  title: 'VAT on exports from the UK: zero rating and proof of export',
  metaTitle: 'VAT on exports UK: zero rating and proof',
  description:
    'When a UK exporter can zero rate goods sent abroad, the time limits in HMRC’s VAT Notice 703, and the evidence of export HMRC accepts and expects you to keep.',
  lede: 'Goods sold to a customer outside the UK can usually be invoiced with VAT at 0%, but only if the conditions in HMRC’s VAT Notice 703 are met. The conditions are mostly about paperwork: getting the goods out in time and holding evidence that they left. This post walks through them in the order an exporter meets them.',
  answer:
    'UK exports are normally zero rated: the sale is taxable, but VAT is charged at 0%. HMRC’s VAT Notice 703 allows this when the goods leave the UK within the time limit, usually 3 months, and you obtain and keep evidence of the supply and of the export, such as a cleared export declaration or a bill of lading.',
  keyFacts: [
    'HMRC’s VAT Notice 703 defines a zero-rated supply as one that is subject to VAT, but where the VAT is at 0%.',
    'Under VAT Notice 703, direct and indirect exports must leave the UK, and evidence must be obtained, within 3 months of the time of supply.',
    'HMRC accepts an export declaration on the Customs Declaration Service with a departure confirmation, identified by its MRN or DUCR, as official evidence of export.',
    'VAT Notice 703 also accepts commercial transport evidence, such as authenticated air waybills, bills of lading, sea waybills and CMR notes.',
    'HMRC says proof of export must be kept for 6 years and shown to a VAT officer on request.',
  ],
  definitions: [
    {
      term: 'Zero rating',
      meaning:
        'Charging VAT at 0% on a sale that is still taxable, so it stays in your VAT records.',
    },
    {
      term: 'Direct export',
      meaning:
        'An export where you, the supplier, send the goods outside the UK and arrange the transport yourself or through your own freight agent.',
    },
    {
      term: 'Indirect export',
      meaning:
        'An export where an overseas customer, or their agent, collects the goods from you in the UK and arranges the export.',
    },
    {
      term: 'Overseas person',
      meaning:
        'In VAT Notice 703, a person not resident in the UK, a business with no UK establishment making taxable supplies, or an overseas authority.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'Do you charge VAT on exports from the UK?',
      paragraphs: [
        'Usually not, in the sense that the rate is 0%. HMRC’s VAT Notice 703 explains that exported goods are consumed outside the UK, so their sale can be zero rated when the notice’s conditions are met. A zero-rated sale is still a taxable supply, so you still record it in your VAT accounts.',
        'The notice covers goods leaving Great Britain for anywhere outside the UK, and goods leaving Northern Ireland for destinations outside both the UK and the EU. Goods moving from Northern Ireland to an EU country follow separate HMRC guidance on movements between Northern Ireland and the EU, so check that guidance instead if it applies to you.',
      ],
    },
    {
      heading: 'What conditions must an export meet to be zero rated?',
      paragraphs: [
        'VAT Notice 703 says you must meet all the relevant conditions, and three carry most of the weight: the goods must actually leave the UK, they must leave within the time limit, and you must obtain and keep evidence both of the supply and of the export. The notice also says the goods must not be used between leaving your premises and leaving the UK.',
        'The time limits in the notice run from the time of supply, and they differ by type of export.',
      ],
      table: {
        caption: 'Time limits for exporting and obtaining evidence, from HMRC VAT Notice 703, section 3.5',
        head: ['Type of supply', 'Export the goods within', 'Obtain evidence within'],
        rows: [
          ['Direct export', '3 months', '3 months'],
          ['Indirect export (overseas customer collects)', '3 months', '3 months'],
          ['Goods supplied for processing or incorporation before export', '6 months', '6 months'],
        ],
      },
    },
    {
      heading: 'What is the difference between a direct and an indirect export?',
      paragraphs: [
        'The difference is who arranges the transport out of the UK. In a direct export, you send the goods abroad and book the carrier yourself or through a forwarder you appoint. In an indirect export, an overseas customer or their agent collects the goods from you and arranges the export, which is common on an EXW sale under the Incoterms® 2020 rules.',
        'HMRC treats the indirect case with more caution, because the goods leave your control before they leave the UK. VAT Notice 703 says the customer must be an overseas person and the goods must go to a destination outside the UK. Zero rating is not allowed for sales to a UK-resident private individual, to a customer with a UK place of business making taxable supplies, or to an overseas visitor taking goods home for personal use in their baggage.',
        'For indirect exports, the notice says the standard of evidence is high and that copies of transport documents alone will not be enough. HMRC suggests making the buyer’s duty to provide export evidence part of the sales contract, and considering a deposit equal to the VAT that would be due if the evidence never arrives.',
      ],
    },
    {
      heading: 'What counts as proof of export for VAT?',
      paragraphs: [
        'HMRC accepts two kinds of evidence of export, and you also need evidence of the supply itself, such as the order, the sales invoice and proof of payment. Official evidence is a cleared export declaration on the Customs Declaration Service with a departure confirmation. Commercial evidence is the transport paperwork that shows the goods physically moving.',
        'VAT Notice 703 says the evidence must together give a clear audit trail from sale to export: it identifies the supplier, any separate consignor and the customer, describes the goods, quantities and value consistently, and shows the destination, mode of transport and route.',
      ],
      steps: [
        'Keep the customer’s order and your sales invoice, with the invoice number, customer name, description of the goods and value.',
        'Keep the MRN or DUCR of the export declaration and confirmation that the goods departed, if you or your agent made one.',
        'Keep the transport document: for sea freight a bill of lading or sea waybill, for air an authenticated air waybill with the flight details, for road a CMR note.',
        'Check that the goods description, quantities and value match across the invoice, packing list and transport document.',
        'File the set by shipment so you can produce it for a VAT officer for 6 years.',
      ],
    },
    {
      heading: 'Which documents does HMRC expect by mode of transport?',
      paragraphs: [
        'VAT Notice 703 adds detail for each mode. For air freight, it asks for an authenticated master or house air waybill endorsed with the flight prefix and number and the date and place of departure. For sea freight, it asks for a copy of the bill of lading or sea waybill with a note of the export declaration MRN or DUCR, or a shipping company certificate of shipment where the line does not issue those references.',
        'For road, the notice says the international consignment note identifies the contracting parties, but where an overseas customer collects ex-works, the consignment note alone is not conclusive that the goods left the UK, and the stricter indirect-export evidence applies.',
        'For post, a certificate of posting stamped by the Post Office and presented with the goods is acceptable, with a customs declaration for each parcel. For couriers, the notice says most operators do not issue certificates of shipment, so their invoices showing air waybill numbers and their tracking records are generally used as commercial evidence.',
      ],
    },
    {
      heading: 'What happens if the goods leave late or the evidence never arrives?',
      paragraphs: [
        'You lose the zero rate for that period. VAT Notice 703 says that if the goods are not exported, or the evidence is not obtained, within the time limit, you must account for VAT at the UK rate on the amount you charged, in box 1 of the VAT Return for the period in which the time limit runs out. The notice notes that, at a 20% rate, the VAT element of a VAT-inclusive amount is one-sixth.',
        'The loss can be reversed. If you later obtain acceptable evidence, or the goods are exported late, the notice says you may then zero rate the supply and adjust your VAT account for the period in which the evidence arrives.',
      ],
      table: {
        caption: 'Worked example with an invented exporter, buyer and figures',
        head: ['Step', 'What happens'],
        rows: [
          ['Sale', 'Brightwell Ceramics Ltd (invented) invoices an overseas buyer £6,000 on EXW terms'],
          ['Collection', 'The buyer’s haulier collects the goods from the Brightwell warehouse'],
          ['Evidence', 'Brightwell asks the buyer for the MRN and departure confirmation'],
          ['Time limit passes', 'No evidence after 3 months, so Brightwell accounts for VAT on the £6,000'],
          ['Evidence arrives', 'The buyer sends it later; Brightwell adjusts in that period'],
        ],
      },
    },
    {
      heading: 'Can more than one seller zero rate the same goods?',
      paragraphs: [
        'No. VAT Notice 703 says only one transaction in a chain may be zero rated: the sale to the overseas customer. If you buy goods from a UK supplier and sell them on to a buyer abroad, your supplier charges you VAT at the standard rate, and only your sale to the overseas buyer can be zero rated, provided you hold the evidence.',
      ],
    },
    {
      heading: 'How does the commercial invoice support zero rating?',
      paragraphs: [
        'The invoice is the anchor of the audit trail. It is part of the evidence of supply, and its description, quantities and value are what the transport document and export declaration should match. GOV.UK’s export guidance says to use the price the goods are sold for and list any freight or export insurance included in that price separately, and that the completed invoice travels with the goods.',
        'Prepare the invoice and packing list from the same line items, and give your forwarder the same figures for the declaration, so the goods description, quantities and value agree across every document HMRC may ask to see.',
      ],
    },
  ],
  faq: [
    {
      q: 'Does a zero-rated export still go in my VAT records?',
      a: 'Yes. HMRC’s VAT Notice 703 describes a zero-rated supply as subject to VAT at 0%, so it remains a taxable sale and belongs in your VAT accounts.',
    },
    {
      q: 'Is a courier tracking record enough proof of export?',
      a: 'VAT Notice 703 says courier invoices showing air waybill numbers and tracking records are generally used as commercial evidence, alongside your own evidence of the sale.',
    },
    {
      q: 'How long do I have to export the goods to zero rate them?',
      a: 'For direct and indirect exports, VAT Notice 703 sets 3 months from the time of supply for both the export and the evidence; 6 months where goods are processed before export.',
    },
    {
      q: 'Do I need an export declaration to zero rate an export?',
      a: 'A cleared declaration with a departure confirmation is HMRC’s official evidence. Without one, the notice says commercial transport evidence can also support zero rating, subject to its conditions.',
    },
    {
      q: 'Can I zero rate goods a UK customer says they will export?',
      a: 'Not on that basis. VAT Notice 703 limits indirect-export zero rating to overseas persons, and excludes customers with a UK place of business making taxable supplies.',
    },
  ],
  sources: ['c4-hmrc-vat-notice-703', 'b6-gov-uk-export-goods', 'icc-incoterms-2020'],
  primaryTool: '/tools/invoice-generator',
  callout: {
    afterSection: 3,
    tool: '/tools/invoice-generator',
    title: 'Start the audit trail with a clean invoice',
    text: 'The commercial invoice generator lays out the parties, goods, quantities, values and Incoterms® rule, so your declaration and transport documents have one set of figures to match.',
  },
  tools: ['/tools/invoice-generator', '/tools/packing-list-generator', '/tools/incoterms'],
  related: [
    '/guides/how-to-export-from-the-uk',
    '/blog/export-documents-checklist',
    '/blog/commercial-invoice-and-packing-list-must-match',
    '/blog/postponed-vat-accounting',
    '/guides/eori-number',
  ],
  cover: {
    id: 'kmxNKw2Q_-w',
    src: 'https://images.unsplash.com/photo-1734213025320-1aa0c14d01b4',
    width: 6720,
    height: 4480,
    alt: 'Rows of packed cardboard boxes in a large warehouse, waiting to be dispatched',
    caption: 'Packed goods in a warehouse before dispatch',
    photographer: { name: 'Salah Ait Mokhtar', profile: 'https://unsplash.com/@motosha' },
    page: 'https://unsplash.com/photos/a-large-warehouse-filled-with-lots-of-boxes-kmxNKw2Q_-w',
  },
};

export default article;
