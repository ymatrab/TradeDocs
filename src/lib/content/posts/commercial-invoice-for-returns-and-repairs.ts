import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "american goods returned" 90, KD 1;
 * UK "returned goods relief" 260.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave D (new in v3; conversion: invoice).
 */
const article: ContentArticle = {
  slug: 'commercial-invoice-for-returns-and-repairs',
  title: 'Commercial invoice for returns and repairs: getting duty relief',
  metaTitle: 'Commercial invoice for returns and repairs',
  description:
    'How to invoice goods returned to the US or UK, or sent abroad for repair: American goods returned, 9802 repairs, UK Returned Goods Relief and outward processing.',
  lede: 'A customer sends back a faulty unit, or you ship a machine abroad to be repaired and brought home. The goods cross the border twice, and on the way back customs will ask for duty unless you show they are your own goods returning. The commercial invoice for that return trip, and the declarations behind it, are what make the relief work.',
  answer:
    'Goods returning unchanged, or after repair abroad, still need a commercial invoice with a fair value and a clear statement of why they are coming back. In the US, CBP subheadings 9801.00.10 and 9802 can relieve duty; in the UK, Returned Goods Relief and outward processing do. Each needs proof of the original export.',
  keyFacts: [
    'CBP subheading 9801.00.10 covers US products returned after export, and other products returned within 3 years, if not advanced in value or improved in condition abroad.',
    'Under 19 CFR 10.1, shipments valued over $2,500 claimed under 9801.00.10 need a foreign shipper’s declaration and an importer’s declaration.',
    'Under 19 CFR 10.8, goods repaired abroad under 9802.00.40 or 9802.00.50 pay duty only on the cost or value of the repair.',
    'GOV.UK says Returned Goods Relief requires goods to be re-imported in an unaltered state within 3 years of export.',
    'HMRC says no duty is due on authorised outward processing goods repaired free of charge under a guarantee, if proof goes with the import declaration.',
  ],
  definitions: [
    {
      term: 'American goods returned',
      meaning:
        'The common name for US tariff subheading 9801.00.10, which lets goods re-enter free of duty when they come back without being improved abroad.',
    },
    {
      term: 'Returned Goods Relief (RGR)',
      meaning:
        'A UK relief from import duty, and in some cases import VAT, for goods exported from the UK and brought back unaltered.',
    },
    {
      term: 'Outward processing',
      meaning:
        'A UK customs procedure for goods sent abroad for repair or processing, with duty on re-import charged on the work rather than the whole value.',
    },
    {
      term: 'Foreign shipper’s declaration',
      meaning:
        'A statement by the party sending the goods back to the US that they were exported from the US and returned without improvement.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'Do returned goods need a commercial invoice?',
      paragraphs: [
        'Yes. Customs treats a returning shipment as an import like any other until you show otherwise. The invoice tells the customs office what the goods are, what they are worth and why they are crossing the border, and it is the document the relief claim is built on.',
        'The value cannot be zero because nothing is being sold. Show a fair value for the goods, and state plainly that they are being returned, or returned after repair, with no sale involved. If a repair was paid for, the cost of the repair is a separate figure that matters for duty, so show it separately as well.',
      ],
    },
    {
      heading: 'What is American goods returned under 9801.00.10?',
      paragraphs: [
        'It is the US provision that lets goods come back free of duty. CBP quotes the subheading as covering products of the United States when returned after having been exported, or any other products when returned within 3 years after having been exported, without having been advanced in value or improved in condition by any process of manufacture or other means while abroad.',
        'CBP adds that there is no time limit on a claim for US-origin products, while foreign-origin products have the 3-year limit. A customer return of a unit you shipped, unused or simply rejected, is the typical case. A unit that was repaired, upgraded or reworked abroad does not fit here; that is the repair provision below.',
      ],
    },
    {
      heading: 'What declarations does CBP ask for on returned goods?',
      paragraphs: [
        'For shipments valued over $2,500, two declarations. 19 CFR 10.1 sets out a declaration by the foreign shipper, stating that the goods were exported from the United States and are returned without having been advanced in value or improved in condition. It gives the port and approximate date of export, the marks, numbers, quantity, description and value, and is signed with the shipper’s address and capacity.',
        'The second is by the owner, importer, consignee or agent, confirming that the shipper’s declaration is true and correct to the best of their knowledge, naming the manufacturer and confirming the goods were exported without benefit of drawback. CBP’s page says it may request these documents and, for some US-made goods not clearly marked with the manufacturer’s name and address, a manufacturer’s statement too.',
        'Keep the original export records ready: the export invoice, the transport document and the export filing. They let the shipper fill in the export port and date accurately.',
      ],
    },
    {
      heading: 'How is duty worked out on goods repaired abroad?',
      paragraphs: [
        'On the repair, not on the whole article. 19 CFR 10.8 covers articles exported for repairs or alterations and returned under subheading 9802.00.40 or 9802.00.50. It says the dutiable value is limited to the cost or value of the repairs or alterations actually performed abroad, excluding expenses incurred in the United States.',
        'Two declarations go with the entry. The person who did the work states that the goods were received for the sole purpose of repair or alteration, that only the described work was done, that the full cost or, where no charge was made, the value of that work is correctly stated, and that nothing was substituted. The owner or importer confirms that declaration and that the goods were exported without benefit of drawback.',
        'So the invoice for a repaired article should carry the description of the article and of the repair, the full cost or value of the repair, and the total value of the article after repair, which are the fields 19 CFR 10.8 lists.',
      ],
    },
    {
      heading: 'How does UK Returned Goods Relief work?',
      paragraphs: [
        'It relieves import duty, and sometimes import VAT, on goods that left the UK and come back unaltered. GOV.UK says the goods must be returned no later than 3 years after export and re-imported in an unaltered state; work to maintain them in working order is allowed, upgrades that increase their value are not. If goods were sent abroad for repair but the repair was not carried out, relief may still be available.',
        'You may need the original export declaration showing you as the exporter. Where you cannot produce it, GOV.UK says HMRC may accept alternatives such as a copy of the export invoice or the export air waybill or bill of lading. For the VAT part of the relief, the exporter and importer must be the same person. Freight consignments claim the relief through customs procedure codes, and GOV.UK says to keep the records for at least 4 years.',
      ],
    },
    {
      heading: 'What about goods sent from the UK for repair?',
      paragraphs: [
        'They use outward processing instead. GOV.UK says that on re-import you pay duty on the charges made for repair or replacement, plus inward shipping and insurance. You include your outward processing authorisation number on both the export and the import declaration, and you must be able to prove the goods were exported under outward processing. For repair and return, GOV.UK says you can use authorisation by declaration.',
        'Warranty repairs are treated differently. HMRC’s guidance says no duty is due on authorised outward processing goods repaired or replaced free of charge under a guarantee, and that proof of the free repair must be produced with the import declaration. It also says VAT is due on the full customs value of replacement goods, even when supplied free of charge.',
      ],
    },
    {
      heading: 'What should the invoice for a return or repair show?',
      paragraphs: [
        'Everything an ordinary commercial invoice shows, plus the facts the relief depends on. The lines below show a repair return. The companies, goods and figures are invented; use your own records.',
      ],
      table: {
        caption: 'Worked example of a repair return invoice, invented parties and figures (USD)',
        head: ['Field', 'Entry'],
        rows: [
          ['Shipper', 'Rheinfeld Servicetechnik GmbH (repairer, invented)'],
          ['Consignee', 'Brightwater Instruments LLC, the original US exporter (invented)'],
          ['Reason for shipment', 'Return of US goods after repair; no sale'],
          ['Description', '1 benchtop flow meter, serial FM-2207, repaired: replaced pump seal'],
          ['Original export', 'Exported from the US on the date and port in the export records'],
          ['Value of article before repair', '4,200.00'],
          ['Full cost of repair', '380.00'],
          ['Total value after repair', '4,580.00'],
        ],
      },
      steps: [
        'Find the original export invoice, transport document and export filing for the goods.',
        'Describe the goods exactly as on the export documents, with serial numbers where they exist.',
        'State the reason for the shipment: returned unchanged, or returned after repair.',
        'Give a fair value for the goods and, for a repair, the cost or value of the work as a separate figure.',
        'Arrange the declarations the importing country asks for, signed by the right party.',
        'Send the invoice, declarations and export evidence to your broker or carrier before the goods arrive.',
      ],
    },
  ],
  faq: [
    {
      q: 'Can I put a zero value on a returned item?',
      a: 'No. Show a fair value for the goods even when no money changes hands. The relief removes the duty; it does not remove the need to declare a value.',
    },
    {
      q: 'Is a customer return the same as a warranty repair?',
      a: 'No. Goods returned unchanged use the returned goods provisions; goods repaired abroad use the repair provisions, where duty may be charged on the repair cost.',
    },
    {
      q: 'Does American goods returned apply to goods made outside the US?',
      a: 'It can. CBP says other products returned within 3 years of export are covered, if they were not advanced in value or improved in condition abroad.',
    },
    {
      q: 'What if I can’t find the UK export declaration?',
      a: 'GOV.UK says HMRC may accept alternatives such as a copy of the export invoice, air waybill or bill of lading. Ask your customs agent before the goods ship back.',
    },
  ],
  sources: [
    'd1-cbp-9801-requirements',
    'd1-cornell-19-cfr-10-1',
    'd1-cornell-19-cfr-10-8',
    'd1-gov-uk-returned-goods-relief',
    'd1-gov-uk-outward-processing',
    'd1-gov-uk-op-free-of-charge-repairs',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: [
    '/tools/invoice-generator',
    '/tools/packing-list-generator',
    '/tools/landed-cost-calculator',
  ],
  callout: {
    afterSection: 2,
    tool: '/tools/invoice-generator',
    title: 'Reuse the export invoice for the return',
    text: 'Start the return invoice from the same parties, descriptions and serial numbers as the original export, so customs can match the two at a glance.',
  },
  related: [
    '/blog/commercial-invoice-for-samples',
    '/guides/ata-carnet',
    '/blog/declared-value-for-customs',
    '/guides/duty-drawback',
    '/blog/uk-import-duty',
  ],
  cover: {
    id: 'J_tkqH61vHA',
    src: 'https://images.unsplash.com/photo-1735875530804-d661ca2001da',
    width: 4896,
    height: 3264,
    alt: 'A technician repairing an electronic circuit board under a magnifying lamp on a blue work mat',
    caption: 'A circuit board under repair at a technician’s bench',
    photographer: { name: 'Yoga Sukma', profile: 'https://unsplash.com/@yogasukma' },
    page: 'https://unsplash.com/photos/a-person-using-a-mouse-on-a-mouse-pad-J_tkqH61vHA',
  },
};

export default article;
