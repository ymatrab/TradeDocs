import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "cfr vs cif" 90, KD 11; "cif vs cfr" 50.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave D (v2 #28: the only difference is the
 * seller's insurance duty).
 */
const article: ContentArticle = {
  slug: 'cfr-vs-cif',
  title: 'CFR vs CIF: the one difference is who insures the cargo',
  metaTitle: 'CFR vs CIF: the insurance difference explained',
  description:
    'CFR and CIF split freight and risk the same way. Only CIF makes the seller insure the voyage. What that means for the buyer, the price, customs value and the documents.',
  lede: 'CFR and CIF are the closest pair in the Incoterms® rules. The seller pays the sea freight under both, and the buyer carries the risk at sea under both. One letter separates them, and it stands for insurance.',
  answer:
    'CFR (Cost and Freight) and CIF (Cost, Insurance and Freight) differ only in insurance. Under both, the seller pays sea freight to the named destination port and risk passes to the buyer once the goods are on board at the port of shipment. Under CIF the seller must also buy insurance for the buyer; under CFR nobody has to.',
  keyFacts: [
    'CFR and CIF are Incoterms® 2020 rules published by the International Chamber of Commerce (ICC) for sea and inland waterway transport.',
    'Under both CFR and CIF, HMRC’s guidance says risk passes to the buyer when the goods are on board the vessel.',
    'Under both rules the seller contracts for and pays the freight to the named port of destination.',
    'Under CIF the seller contracts for insurance against the buyer’s risk in transit; the ICC keeps Institute Cargo Clauses (C) as the default cover.',
    'HMRC includes the cost of transit insurance up to the place where goods enter the UK in the customs value.',
  ],
  definitions: [
    {
      term: 'CFR (Cost and Freight)',
      meaning:
        'The seller delivers on board the vessel at the port of shipment and pays the freight to the named port of destination, with no duty to insure.',
    },
    {
      term: 'CIF (Cost, Insurance and Freight)',
      meaning:
        'The same as CFR, plus the seller’s duty to buy insurance that protects the buyer against loss or damage at sea.',
    },
    {
      term: 'Institute Cargo Clauses (C)',
      meaning:
        'A standard set of marine cargo insurance terms giving a minimum level of cover, the default under CIF in the Incoterms® 2020 rules.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is the difference between CFR and CIF?',
      paragraphs: [
        'The only difference is the seller’s insurance obligation. Everything else in the two Incoterms® 2020 rules from the ICC lines up: the same mode (sea and inland waterway), the same delivery point (on board at the port of shipment), the same freight paid by the seller to the destination port, and the same split of export and import clearance.',
        'Under CIF the seller adds a contract of insurance to the freight contract. Under CFR the seller buys freight only, so the buyer, who already carries the risk at sea, decides whether and how to insure. CFR is sometimes written C&F or CNF on older documents; the Incoterms® 2020 rule name is CFR.',
      ],
    },
    {
      heading: 'How do CFR and CIF compare?',
      paragraphs: ['Seven of the eight lines are identical. The insurance line is the rule.'],
      table: {
        caption: 'CFR and CIF compared under Incoterms® 2020',
        head: ['', 'CFR (Cost and Freight)', 'CIF (Cost, Insurance and Freight)'],
        rows: [
          ['Transport modes', 'Sea and inland waterway', 'Sea and inland waterway'],
          ['Named place', 'Port of destination', 'Port of destination'],
          [
            'Delivery and risk transfer',
            'On board at the port of shipment',
            'On board at the port of shipment',
          ],
          ['Freight to the destination port', 'Seller pays', 'Seller pays'],
          ['Cargo insurance', 'Not required of either party', 'Seller must buy minimum cover'],
          ['Export clearance', 'Seller', 'Seller'],
          ['Import clearance, duties and taxes', 'Buyer', 'Buyer'],
          [
            'Unloading at the destination port',
            'Buyer, unless in the freight contract',
            'Buyer, unless in the freight contract',
          ],
        ],
      },
    },
    {
      heading: 'Who insures the goods under CFR?',
      paragraphs: [
        'Under CFR the buyer normally insures, because the buyer carries the risk from the moment the goods are loaded at origin. The rule does not oblige it to, but an uninsured buyer whose container is lost at sea still owes the seller the price.',
        'The timing matters. The buyer’s cover has to start when the goods go on board at the port of shipment, often before the buyer has seen a shipping document. A buyer on CFR terms usually has an open marine policy or arranges cover as soon as it receives the booking details. The seller should send the vessel name, sailing date and container numbers promptly so the buyer can do that.',
      ],
    },
    {
      heading: 'How much cover does CIF require?',
      paragraphs: [
        'CIF requires the seller to buy insurance at a minimum level unless the contract asks for more. The ICC explains that under Incoterms® 2020, Institute Cargo Clauses (C) remains the default level of cover for CIF, while the parties can agree a higher level. HMRC’s summary of CIF puts it the same way: minimum cover, with the buyer free to agree more or to arrange its own.',
        'Because (C) is the minimum, a buyer of goods that are easily damaged may want more. It can write a higher level of cover into the CIF contract, or buy on CFR terms and insure on its own policy. That is the practical choice between CIF and CFR: who chooses the policy and its terms. The cargo insurance for exporters article explains the levels of cover.',
      ],
    },
    {
      heading: 'How does the same sale look on a CFR and a CIF invoice?',
      paragraphs: [
        'The CIF invoice is the CFR invoice plus one line. The table shows one shipment both ways.',
      ],
      table: {
        caption:
          'Worked example with invented parties and figures: Example Textiles Ltd ships 40 bales of fabric to a buyer in Durban',
        head: ['Invoice line', 'CFR Durban', 'CIF Durban'],
        rows: [
          ['Goods', '18,500', '18,500'],
          ['Export packing, inland transport and export clearance', '720', '720'],
          ['Sea freight to Durban', '1,950', '1,950'],
          ['Marine insurance, Institute Cargo Clauses (C)', 'Not included', '75'],
          ['Invoice total', '21,170', '21,245'],
          ['Who arranges insurance', 'Buyer, at its own choice', 'Seller, for the buyer’s benefit'],
        ],
      },
    },
    {
      heading: 'Does the choice change the customs value?',
      paragraphs: [
        'It can change what the importer has to add, not what the goods are worth. HMRC states that the Incoterm used does not restrict the valuation method, and that the cost of insurance for the goods in transit up to the place where they enter the UK belongs in the customs value. On a CIF invoice that premium is already shown. On a CFR invoice it is not, so a UK importer adds the premium it paid itself, apportioned if it covers several shipments.',
        'In the US the position runs the other way. 19 U.S.C. § 1401a excludes the cost of international freight and insurance from the price actually paid or payable, and 19 CFR 141.86 asks the invoice to itemise charges such as freight and insurance by name and amount. Showing freight and insurance as separate lines, as in the example above, serves both systems.',
      ],
    },
    {
      heading: 'How do you change a CFR quote into a CIF quote?',
      paragraphs: ['If a buyer asks you to switch, five steps keep the paperwork consistent:'],
      steps: [
        'Agree the level of cover in writing: Institute Cargo Clauses (C) by default, or the wider clauses the buyer asks for.',
        'Get an insurance quotation for the voyage and add the premium as its own line in the price.',
        'Change the terms of sale on the quotation, proforma and commercial invoice, for example from “CFR Durban, Incoterms® 2020” to “CIF Durban, Incoterms® 2020” (an invented example).',
        'Make sure the buyer can claim under the policy, and send the buyer the insurance document together with the transport document.',
        'Check that the freight booking, the bill of lading and the insurance document all name the same port of destination.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is CIF more expensive than CFR?',
      a: 'The CIF invoice is higher by the insurance premium and any handling cost the seller adds for arranging it. The total cost to the buyer can be similar, because a CFR buyer usually pays for its own insurance.',
    },
    {
      q: 'Does risk pass at the destination port under CIF?',
      a: 'No. Under CIF and CFR risk passes when the goods are on board at the port of shipment. The destination port named after the rule is where the seller’s freight ends, not where risk passes.',
    },
    {
      q: 'Can CFR or CIF be used for air freight?',
      a: 'No. The International Trade Administration lists CFR and CIF among the rules for sea and inland waterway transport. For other modes, CPT and CIP are the equivalent rules.',
    },
    {
      q: 'Is C&F the same as CFR?',
      a: 'You may see C&F or CNF on older or informal documents for cost and freight. The Incoterms® 2020 rule is CFR; write it with the named port and the version, such as “CFR Durban, Incoterms® 2020”.',
    },
  ],
  sources: [
    'c3-icc-incoterms-2020',
    'c3-hmrc-incoterms',
    'c3-ita-know-your-incoterms',
    'c3-hmrc-delivery-costs',
    'c3-usc-19-1401a',
    'c3-cornell-19-cfr-141-86',
  ],
  primaryTool: '/tools/export-price-calculator',
  tools: ['/tools/export-price-calculator', '/tools/incoterms', '/tools/invoice-generator'],
  callout: {
    afterSection: 4,
    tool: '/tools/export-price-calculator',
    title: 'Price CFR and CIF from your own costs',
    text: 'Enter your ex-works price, freight and insurance quotes to see the CFR and CIF prices side by side, with no rates of our own.',
  },
  related: [
    '/blog/cif-vs-fob',
    '/blog/cif-vs-cip',
    '/blog/cargo-insurance-for-exporters',
    '/blog/cif-vs-dap',
    '/blog/incoterms-for-importing-from-china',
  ],
  cover: {
    id: 'JaTUwq2N718',
    src: 'https://images.unsplash.com/photo-1784911545463-c8125e0953ba',
    width: 6040,
    height: 4027,
    alt: 'Green container ship beside port cranes, where risk passes to the buyer under both CFR and CIF',
    caption: 'A green container ship and port cranes under a blue sky',
    photographer: { name: 'Julia Taubitz', profile: 'https://unsplash.com/@justmejuliee' },
    page: 'https://unsplash.com/photos/green-container-ship-and-port-cranes-under-a-blue-sky-JaTUwq2N718',
  },
};

export default article;
