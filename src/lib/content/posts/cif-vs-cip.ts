import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "cip vs cif" 140.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave C (v2 #26: insurance cover differs,
 * Institute Cargo Clauses (C) under CIF, (A) under CIP in 2020).
 */
const article: ContentArticle = {
  slug: 'cif-vs-cip',
  title: 'CIF vs CIP: the same idea, different insurance and transport',
  metaTitle: 'CIF vs CIP: the difference in Incoterms 2020',
  description:
    'CIF and CIP both make the seller pay freight and insurance. They differ in transport mode, where risk passes and how much cover the seller must buy under Incoterms 2020.',
  lede: 'CIF and CIP both make the seller pay for the main freight and for insurance that protects the buyer. They read almost the same on a quotation. Since 2020 the cover each one requires is different, and so are the shipments each one fits.',
  answer:
    'Under CIF the seller loads the goods on the ship, pays sea freight to the named port of destination and buys minimum insurance, Institute Cargo Clauses (C). Under CIP the seller hands the goods to the first carrier, pays carriage to the named destination by any mode and must buy wider cover, Institute Cargo Clauses (A) or similar.',
  keyFacts: [
    'CIF and CIP are Incoterms® 2020 rules, published by the International Chamber of Commerce (ICC), in which the seller pays the main carriage and contracts for insurance.',
    'The ICC reserves CIF for maritime trade; CIP can be used for any mode of transport.',
    'Under Incoterms® 2020, CIP requires cover compliant with Institute Cargo Clauses (A) or similar clauses.',
    'Under CIF, Institute Cargo Clauses (C) remains the default level of cover.',
    'Under both rules, risk passes to the buyer at the start of the main carriage, even though the seller pays for the freight.',
  ],
  definitions: [
    {
      term: 'CIF (Cost, Insurance and Freight)',
      meaning:
        'The seller delivers on board the vessel at the port of shipment, pays freight to the named destination port and insures the goods.',
    },
    {
      term: 'CIP (Carriage and Insurance Paid To)',
      meaning:
        'The seller hands the goods to its carrier, pays carriage to the named destination by any mode and insures the goods.',
    },
    {
      term: 'Institute Cargo Clauses',
      meaning:
        'Standard cargo insurance terms used in the Incoterms® rules; (C) is the minimum level of cover and (A) the wider one.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What do CIF and CIP mean?',
      paragraphs: [
        'Both are rules in the ICC’s Incoterms® 2020 set in which the seller pays for the main carriage and for insurance, but the risk moves to the buyer early, when the goods start their journey. The named place after the rule is the destination the freight is paid to, not the point where risk passes.',
        'CIF, Cost, Insurance and Freight, is for sea and inland waterway transport. The seller clears the goods for export, loads them on board the vessel at the port of shipment, pays freight to the named port of destination and contracts for insurance. HMRC’s summary of the rules notes that risk passes when the goods are on the ship.',
        'CIP, Carriage and Insurance Paid To, works for any mode. The seller clears the goods for export, delivers them to the carrier it has contracted with, pays carriage to the named destination and contracts for insurance. Risk passes at that handover to the first carrier.',
      ],
    },
    {
      heading: 'What is the difference between CIF and CIP?',
      paragraphs: [
        'The table sets the two side by side. The cost split looks alike; the delivery point, transport mode and insurance level do not.',
      ],
      table: {
        caption: 'CIF and CIP compared under Incoterms® 2020',
        head: ['', 'CIF', 'CIP'],
        rows: [
          ['Transport modes', 'Sea and inland waterway only', 'Any, including multimodal'],
          [
            'Delivery and risk transfer',
            'On board the vessel at the port of shipment',
            'Handover to the first carrier',
          ],
          ['Named place', 'Port of destination', 'Place of destination'],
          [
            'Main carriage',
            'Seller pays to the destination port',
            'Seller pays to the destination place',
          ],
          [
            'Insurance required',
            'Minimum cover: Institute Cargo Clauses (C)',
            'Wider cover: Institute Cargo Clauses (A) or similar',
          ],
          ['Export clearance', 'Seller', 'Seller'],
          ['Import clearance, duties and taxes', 'Buyer', 'Buyer'],
          ['Typical cargo', 'Bulk and break-bulk by sea', 'Containers, air, road, rail'],
        ],
      },
    },
    {
      heading: 'Why does CIP need more insurance than CIF?',
      paragraphs: [
        'The 2020 revision changed it. The ICC’s Incoterms® 2020 page states that CIP now requires a higher level of cover, compliant with Institute Cargo Clauses (A) or similar, while Institute Cargo Clauses (C) remains the default under CIF.',
        'The ICC describes CIF as reserved for maritime trade and often used in commodity trading, and notes that CIF parties have the option to agree a higher level of cover. CIP, the any-mode rule, fits containers, air freight and road, and its default cover is now the wider one.',
        'Treat both levels as the starting point of the contract, not a ceiling. If the buyer or a letter of credit asks for specific cover, write the clauses and the insured value into the sales contract, price the premium, and make the insurance document match.',
      ],
    },
    {
      heading: 'Who carries the risk if the cargo is lost?',
      paragraphs: [
        'The buyer carries the risk from the start of the main carriage under both rules, even though the seller paid for the freight and the policy. That is why the insurance exists: it protects the buyer during a journey in which the buyer bears the loss.',
        'Send the buyer the insurance certificate or policy together with the transport document, so it can claim if something goes wrong. Under CIF the transport document is usually the bill of lading. Under CIP it may be an air waybill, a road consignment note or a multimodal bill of lading.',
      ],
    },
    {
      heading: 'Which rule fits container shipments?',
      paragraphs: [
        'CIP usually does. A container is typically handed over at an inland depot or terminal days before loading, and under CIF the seller still carries the risk until the goods are on board. Under CIP the risk passes at the handover to the carrier, which matches what happens on the ground.',
        'Keep CIF for cargo that is loaded at the ship’s side under your supervision, such as bulk. For air freight, CIF is not available at all, because the International Trade Administration lists it among the sea and inland waterway rules.',
      ],
    },
    {
      heading: 'How do CIF and CIP prices show on the invoice?',
      paragraphs: [
        'A CIF or CIP price includes the goods, export clearance, the main freight and the insurance premium. Customs in the importing country may need those amounts separated.',
        'In the US, 19 U.S.C. § 1401a excludes international freight and insurance from the price actually paid or payable, and 19 CFR 141.86 asks the invoice to itemise charges such as freight and insurance by name and amount. In the UK, HMRC includes transport and insurance up to the border in the customs value. Showing freight and insurance as separate lines lets the importer’s broker declare the right figure in either case.',
      ],
      steps: [
        'Write the rule, named place and version: for example “CIP Chicago, buyer’s warehouse, Incoterms® 2020” or “CIF Santos, Incoterms® 2020” (invented examples).',
        'List the goods at their unit and total prices.',
        'Add the freight to the named place and the insurance premium as separate lines.',
        'State the insured value and the clauses on the insurance document, matching the contract.',
        'Use the same terms of sale on the proforma, commercial invoice and packing list.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is CIF the same as CIP?',
      a: 'No. CIF is for sea and inland waterway transport and requires minimum insurance cover. CIP works for any mode and requires wider, all-risks style cover under Incoterms® 2020. Risk also passes at a different point: on board the ship under CIF, at handover to the first carrier under CIP.',
    },
    {
      q: 'Can CIF be used for air freight?',
      a: 'No. CIF is one of the four Incoterms® rules for sea and inland waterway transport only. For air freight with seller-paid insurance, the matching rule is CIP.',
    },
    {
      q: 'Who pays the insurance under CIP?',
      a: 'The seller buys and pays for the policy, but it covers the buyer’s risk, because risk passes when the goods are handed to the first carrier.',
    },
    {
      q: 'Can we agree a different insurance level?',
      a: 'The ICC notes that CIF parties can agree a higher level of cover than the minimum. Whatever level you agree under either rule, write the clauses in the sales contract so the invoice and the insurance document match it.',
    },
    {
      q: 'Does CIF include import duty?',
      a: 'No. Under both CIF and CIP the buyer clears the goods for import and pays the duties and taxes.',
    },
  ],
  sources: [
    'c3-icc-incoterms-2020',
    'c3-hmrc-incoterms',
    'c3-ita-know-your-incoterms',
    'c3-usc-19-1401a',
    'c3-cornell-19-cfr-141-86',
    'c3-hmrc-delivery-costs',
  ],
  primaryTool: '/tools/incoterms',
  tools: ['/tools/incoterms', '/tools/invoice-generator', '/tools/landed-cost-calculator'],
  callout: {
    afterSection: 2,
    tool: '/tools/incoterms',
    title: 'Compare CIF and CIP with the other nine rules',
    text: 'The Incoterms® 2020 guide shows where risk passes and who pays for freight and insurance under every rule.',
  },
  related: [
    '/blog/cargo-insurance-for-exporters',
    '/blog/cif-vs-fob',
    '/blog/fca-vs-fob',
    '/guides/dap-vs-ddp',
    '/blog/commercial-invoice-requirements',
  ],
  cover: {
    id: 'wA02BJjOEw8',
    src: 'https://images.unsplash.com/photo-1784910627957-c140366cd78a',
    width: 6021,
    height: 4014,
    alt: 'Large cargo ship docked under port cranes, where risk passes to the buyer under CIF',
    caption: 'A cargo ship docked at an industrial port with cranes',
    photographer: { name: 'Julia Taubitz', profile: 'https://unsplash.com/@justmejuliee' },
    page: 'https://unsplash.com/photos/large-cargo-ship-docked-at-an-industrial-port-with-cranes-wA02BJjOEw8',
  },
};

export default article;
