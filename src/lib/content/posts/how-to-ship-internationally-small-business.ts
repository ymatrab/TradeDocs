import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "how to ship internationally" 880, KD 24;
 * "international shipping for small business" 50.
 * Plan: docs/research/content-plan-v2-2026-10-06.md, batch 1.
 */
const article: ContentArticle = {
  slug: 'how-to-ship-internationally-small-business',
  title: 'How to ship internationally as a small business',
  metaTitle: 'How to ship internationally as a small business',
  description:
    'Parcel or freight, the documents every export needs, choosing an Incoterms rule, and a first-shipment checklist for a small business shipping abroad.',
  lede: 'Your first international order raises four questions at once: how the goods travel, what paperwork goes with them, who pays for what, and what can stop them at the border. This post takes them in that order and ends with a checklist you can work through for the first shipment.',
  answer:
    'To ship internationally, choose the mode first (a courier for parcels, a freight forwarder for pallets or containers), agree an Incoterms® rule and a named place with the buyer, then prepare a commercial invoice and packing list that match. Classify the goods, check export filing and licence rules, and book the carrier.',
  keyFacts: [
    'The International Trade Administration advises asking the foreign buyer or a freight forwarder which documents a shipment needs.',
    'Customs uses the commercial invoice as one of the main documents for determining duties, according to the International Trade Administration.',
    'Couriers such as UPS bill parcels on the greater of actual and dimensional weight, dividing centimetre dimensions by 5,000.',
    'In the US, Electronic Export Information is filed in AES when a Schedule B line is worth over $2,500 or another filing requirement applies.',
    'The ICC’s Incoterms® 2020 rules contain eleven rules that set where risk and costs pass from seller to buyer.',
  ],
  definitions: [
    {
      term: 'Freight forwarder',
      meaning:
        'A company that books international transport for you and often prepares the shipping documents.',
    },
    {
      term: 'Incoterms® rule',
      meaning:
        'A three-letter ICC trade term, such as FCA or DAP, that sets who pays for and bears the risk of each leg.',
    },
    {
      term: 'Dimensional weight',
      meaning:
        'A weight a carrier calculates from a parcel’s size, charged when it exceeds the actual weight.',
    },
    {
      term: 'EEI (Electronic Export Information)',
      meaning: 'The US export data filed through the Automated Export System (AES).',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'Should you ship by courier or by freight?',
      paragraphs: [
        'Ship by courier when the order is a few cartons; book freight through a forwarder when it fills pallets or a container. A courier collects and delivers door to door and can often arrange import clearance; check what its service includes. Forwarders arrange air or sea freight, where you pay for space and handling at each end, and the buyer usually clears the goods through their own broker.',
        'Courier prices are built on chargeable weight. UPS, for example, divides a parcel’s length × width × height in centimetres by 5,000 to get its dimensional weight and charges on whichever is greater, that or the actual weight. A large, light carton can cost as much as a heavy one, so measure before you quote the buyer.',
        'Sea freight is sold two ways. Maersk describes LCL as paying for the container space you use, measured in cubic metres, and FCL as booking the whole container. For a first export of a few pallets, LCL or air freight is the usual comparison; the guide LCL vs FCL explains the break-even.',
      ],
      table: {
        caption: 'Courier parcel, air freight and sea freight compared',
        head: ['', 'Courier parcel', 'Air freight', 'Sea freight (LCL or FCL)'],
        rows: [
          ['Typical load', 'A few cartons', 'Cartons or pallets', 'Pallets or a full container'],
          [
            'Priced on',
            'Chargeable weight per parcel',
            'Chargeable weight per shipment',
            'Cubic metres (LCL) or per container (FCL)',
          ],
          [
            'Who books it',
            'You, on the carrier’s site',
            'A forwarder or airline agent',
            'A forwarder or the ocean carrier',
          ],
          [
            'Transport document',
            'The courier’s waybill',
            'Air waybill',
            'Bill of lading or sea waybill',
          ],
          [
            'Import clearance',
            'Usually by the courier',
            'The buyer’s broker',
            'The buyer’s broker',
          ],
        ],
      },
    },
    {
      heading: 'Which documents does an international shipment need?',
      paragraphs: [
        'Almost every shipment needs a commercial invoice, a packing list and a transport document. The International Trade Administration calls the commercial invoice a bill for the goods from seller to buyer and one of the main documents customs uses to determine duties. Its packing list guidance says forwarders use the list to work out weights and freight costs, and customs uses it to check what is in each package.',
        'The transport document comes from the carrier: a courier waybill, an air waybill or a bill of lading. Some shipments need more, such as an export licence or proof of origin for a trade agreement, depending on the goods and the destination.',
        'The ITA’s advice on the full set is practical: ask your foreign buyer or a freight forwarder what the importing country requires, well before the goods leave. It also warns that discrepancies or omissions can delay the shipment, stop payment or even lead to seizure, and that you are responsible for the accuracy of documents a forwarder prepares for you.',
      ],
    },
    {
      heading: 'Which Incoterms® rule should you agree with the buyer?',
      paragraphs: [
        'Agree the rule and the named place before you quote, because it decides which costs belong in your price. The ICC’s Incoterms® 2020 rules contain eleven rules; for a small exporter the common choices are a handful.',
        'FCA (Free Carrier) at your premises or your forwarder’s warehouse suits most first exports: you clear the goods for export and hand them to the buyer’s carrier. DAP (Delivered at Place) suits courier parcels where you pay the freight and the buyer pays import duties and taxes on arrival. DDP (Delivered Duty Paid) means you also pay the import duties and taxes and handle import clearance in the buyer’s country, which is hard to do without a presence there.',
        'Write the rule on the proforma, the sales contract and the commercial invoice in the form “FCA, 12 Example Street, Sometown, Incoterms® 2020” (an invented address), with the place as exact as you can make it. The guides DAP vs DDP and the post FCA vs FOB go further into the choice.',
      ],
    },
    {
      heading: 'What has to happen before the goods leave the US?',
      paragraphs: [
        'Classify the goods, check whether an export filing or licence applies, and make the documents agree with each other. The rules below are the US ones; other countries run their own export systems.',
        'Under the Foreign Trade Regulations, as the ITA summarises them, Electronic Export Information is filed in the Automated Export System when the value of goods under a single Schedule B number is over $2,500, or when a mandatory filing requirement such as an export licence applies. Under 15 CFR 30.6 the filing reports the 10-digit Schedule B or HTSUSA number and a description detailed enough to verify it. The post How to find the HS code for your product shows where those codes come from.',
        'Many couriers and forwarders file EEI as your agent. Ask who is filing before the pickup, and keep the confirmation with your records.',
      ],
    },
    {
      heading: 'What does a first-shipment checklist look like?',
      paragraphs: [
        'Work through the list in order; each step uses the output of the one before it.',
      ],
      steps: [
        'Confirm the order with a proforma invoice that states the goods, quantities, prices, currency, Incoterms® rule, named place and payment terms.',
        'Ask the buyer which documents and labelling their country requires, and who their customs broker is if one is involved.',
        'Find the commodity code for each line in the official tariff, and the Schedule B number for a US export filing.',
        'Pack the goods, then weigh and measure each carton or pallet. Record net and gross weights and dimensions.',
        'Work out the chargeable weight or cubic metres and get courier or forwarder quotes on those figures.',
        'Prepare the commercial invoice and packing list from the same line items, so descriptions, quantities and weights match.',
        'Agree who files EEI, if a filing applies, and whether a licence is needed for the goods and destination.',
        'Book the carrier, attach the documents, and send copies to the buyer before the goods arrive.',
      ],
    },
    {
      heading: 'What mistakes hold up a first international shipment?',
      paragraphs: [
        'Most holds come from the paperwork disagreeing with itself or with the goods. A carton count on the packing list that differs from the waybill, a vague description such as “parts” or “samples”, a missing commodity code, or an invoice with no Incoterms® rule all draw questions.',
        'Value is the other one. Declare the real transaction value, including for samples and replacements; customs uses the invoice to determine duties, and an understated value is a compliance problem, not a saving. If the buyer asks you to show a lower value, decline.',
        'Finally, give yourself time. Ask the buyer about their requirements when you quote, not when the courier is at the door.',
      ],
    },
  ],
  faq: [
    {
      q: 'Do I need an export licence to ship abroad?',
      a: 'It depends on the goods, the destination and the end user. In the US, CBP points exporters to the Department of Commerce’s Bureau of Industry and Security for which commodities may need a licence. Check before you quote, because a licence requirement also triggers an EEI filing.',
    },
    {
      q: 'Who pays import duties on an international order?',
      a: 'It depends on the Incoterms® rule. Under DAP and most other rules the buyer pays duties and taxes on import; under DDP the seller does. Agree it before you quote, and write the rule and named place on the invoice.',
    },
    {
      q: 'Can a freight forwarder prepare my export documents?',
      a: 'Yes, forwarders and customs brokers routinely prepare documentation. The International Trade Administration notes that you, as the exporter, remain responsible for the accuracy of the documents either way.',
    },
    {
      q: 'Is a packing list required if I already have a commercial invoice?',
      a: 'Usually yes. The ITA notes that a packing list is not a substitute for a commercial invoice, and forwarders and customs use it to check weights and package contents. The two should show the same goods and quantities.',
    },
  ],
  sources: [
    'trade-gov-export-documents',
    'trade-gov-commercial-invoice',
    'trade-gov-packing-list',
    'w4-trade-gov-export-transaction',
    'w4-ecfr-15-cfr-30-6',
    'icc-incoterms-2020',
    'ups-dimensional',
    'maersk-fcl-lcl',
    'w4-cbp-importer-tips',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: [
    '/tools/invoice-generator',
    '/tools/packing-list-generator',
    '/tools/chargeable-weight',
    '/tools/incoterms',
  ],
  callout: {
    afterSection: 1,
    tool: '/tools/packing-list-generator',
    title: 'Build the invoice and packing list from one set of lines',
    text: 'Enter the goods once and the packing list generator lays out cartons, net and gross weights and dimensions that match your commercial invoice.',
  },
  related: [
    '/blog/export-documents-checklist',
    '/blog/how-to-find-hs-code',
    '/blog/commercial-invoice-requirements',
    '/guides/dap-vs-ddp',
    '/blog/fca-vs-fob',
    '/guides/lcl-vs-fcl',
  ],
  cover: {
    id: 'q8kR_ie6WnI',
    src: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59',
    width: 7952,
    height: 5304,
    alt: 'Cardboard shipping boxes stacked in the back of a delivery van, ready for an international courier pickup',
    caption: 'Shipping boxes loaded in a delivery van',
    photographer: { name: 'Claudio Schwarz', profile: 'https://unsplash.com/@purzlbaum' },
    page: 'https://unsplash.com/photos/cardboard-shipping-boxes-in-delivery-van-q8kR_ie6WnI',
  },
};

export default article;
