import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "import customs clearance completed" 1,600, KD n/a.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave A (v2 #60).
 */
const article: ContentArticle = {
  slug: 'customs-status-messages-explained',
  title: 'Import customs clearance completed: what customs tracking statuses mean',
  metaTitle: 'Import customs clearance completed: meaning',
  description:
    'What “import customs clearance completed”, “held in customs” and other tracking statuses mean, which customs step each reports, and which document fault a delay usually points to.',
  lede: 'Tracking pages report customs in a few short phrases, and the same step can be worded differently by each carrier. This post groups the common wordings by the customs step behind them, explains what “import customs clearance completed” does and does not mean, and shows which document to check when a shipment stops moving.',
  answer:
    '“Import customs clearance completed” means customs in the destination country has released the shipment, so the carrier can move it on for delivery. It does not always mean every duty is final: in the US, CBP can release goods before the entry summary is filed and before duties are finally assessed.',
  keyFacts: [
    'Under 19 CFR 141.0a, an entry is the documentation filed to secure the release of imported goods from CBP custody.',
    'Under 19 CFR 141.0a, goods released conditionally are released from CBP custody before liquidation, the final assessment of duty.',
    'Under 19 CFR 142.12, the US entry summary may be filed with estimated duties up to 10 working days after the time of entry.',
    'CBP states that it may examine any shipment imported into the United States and that the importer bears the cost of cargo exams.',
    'DHL Express says its “Customs status updated” checkpoint shows clearance processing at destination, and its details can show early that customs needs more information.',
  ],
  definitions: [
    {
      term: 'Customs clearance',
      meaning:
        'The process by which the customs authority of a country accepts the declaration for a shipment and releases the goods.',
    },
    {
      term: 'Release',
      meaning:
        'Customs’ permission for goods to leave its control; in the US, release from CBP custody is what the entry secures.',
    },
    {
      term: 'Hold',
      meaning:
        'A stop on a shipment by customs or another government agency until information, documents, payment or an inspection is complete.',
    },
    {
      term: 'Liquidation',
      meaning:
        'In the US, CBP’s final computation of the duty on an entry, which can come after the goods have been released.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What does “import customs clearance completed” mean?',
      paragraphs: [
        'It means the customs authority in the destination country has released the shipment. The carrier or broker presented the declaration, customs accepted it, and the goods are free to move on to the recipient. In US terms, release is what the entry achieves: under 19 CFR 141.0a, the entry is the documentation filed to secure the release of imported goods from CBP custody.',
        'It does not mean the goods are delivered, and it does not always mean the customs file is closed. Under 19 CFR 142.12, a US entry summary can be filed with estimated duties up to 10 working days after entry, and 19 CFR 141.0a describes goods released before liquidation, the final duty computation, as released conditionally. A later bill or query about the same shipment is therefore possible.',
      ],
    },
    {
      heading: 'Why do carriers word customs statuses differently?',
      paragraphs: [
        'Because each carrier writes its own tracking events. Customs authorities release or hold goods; the carrier translates that into checkpoint text in its own system. So one carrier may show a single line where another shows three, and the same phrase can carry a slightly different meaning from one network to another.',
        'Read the carrier’s own detail for your shipment before acting on a status. DHL Express, for example, explains that its “Customs status updated” checkpoint indicates clearance processing at the destination, and that opening its further details can show early whether customs needs more information.',
      ],
    },
    {
      heading: 'Which customs step does each common status report?',
      paragraphs: [
        'The table groups common wordings by the step they usually report. Your carrier’s definition takes precedence for your shipment.',
      ],
      table: {
        caption: 'Common customs tracking wordings grouped by the step behind them',
        head: ['Wording you may see', 'Step it usually reports', 'Who usually acts'],
        rows: [
          [
            'Arrived at destination, awaiting clearance',
            'Goods are in the destination country; the declaration is being prepared or filed',
            'The carrier or broker; nothing yet for the shipper',
          ],
          [
            'Customs status updated, clearance in progress',
            'Customs is processing the declaration',
            'No one, unless the detail asks for something',
          ],
          [
            'Clearance delay, held in customs, information required',
            'Customs or the carrier needs a document, a fact or a payment before release',
            'Whoever the request names: often the recipient, sometimes the shipper',
          ],
          [
            'Inspection, examination',
            'Customs has selected the shipment for a physical or document check',
            'The importer, who in the US bears the exam cost',
          ],
          [
            'Duties or taxes due',
            'Release or delivery waits for payment of assessed charges',
            'The party paying duties under the agreed terms',
          ],
          [
            'Released, import customs clearance completed',
            'Customs has released the goods',
            'No one; the shipment moves on to delivery',
          ],
        ],
      },
    },
    {
      heading: 'What does a customs hold usually point to?',
      paragraphs: [
        'Start with the documents. Under 19 CFR 142.3, a US entry needs the entry form, evidence of the right to make entry, a commercial invoice, a packing list where appropriate, and any other document CBP or another agency requires for the goods. If one is missing or does not match the goods, release waits.',
        'The invoice is the usual place to look first. Under 19 CFR 141.86, a US import invoice must carry, among other things, a detailed description of each item, quantities, the purchase price in the currency of sale, itemised charges and the country of origin. CBP’s entry summary instructions even list codes for a missing commercial invoice, a corrected invoice and a missing packing list.',
      ],
      list: [
        'Vague description, such as a part number or “parts”: the goods cannot be classified from it.',
        'Missing or unclear value or currency: customs cannot appraise the goods.',
        'No country of origin, or origin given as the country of shipment: origin drives rates and admissibility.',
        'Package count or weights that differ between invoice, packing list and label: the check against the goods fails.',
        'Goods regulated by another agency without its paperwork: the other agency’s release is still pending.',
      ],
    },
    {
      heading: 'What should you do when a shipment is held?',
      paragraphs: [
        'Find out exactly what is being asked for, by whom, and answer that request with corrected documents rather than explanations. The steps below work for most holds.',
      ],
      steps: [
        'Open the carrier’s tracking detail and note the exact status, any reason code and the contact it names.',
        'Ask the recipient or their broker what customs or the carrier has requested, and from whom.',
        'Compare the invoice, the packing list and the labels for the same descriptions, quantities, weights and origin.',
        'Correct the record, reissue every affected document with the same reference, and send the full set to whoever asked.',
        'If an inspection is requested, let the importer or broker arrange it; do not ship replacement goods until the hold is resolved.',
        'Note the cause, so the next invoice for the same goods is complete from the start.',
      ],
    },
    {
      heading: 'Can a shipment be released and then stopped again?',
      paragraphs: [
        'Customs release ends the customs hold, but other controls can follow. In the US, CBP’s guidance states that it has the right to examine any shipment imported into the country, and other agencies may require their own documents under 19 CFR 142.3. A carrier can also pause delivery for an address problem or unpaid charges after customs has released the goods.',
        'If the status goes backwards after “clearance completed”, read the new event and its detail. It is usually a delivery issue rather than a customs one, and the carrier’s contact is the place to start.',
      ],
    },
    {
      heading: 'How can a shipper avoid customs delays next time?',
      paragraphs: [
        'Send a complete, consistent document set with every shipment. The International Trade Administration notes that customs uses the commercial invoice to assess duties and taxes, and the packing list to check the contents of specific packages, so both need to describe the same goods in the same words.',
        'Keep one record per shipment and produce the invoice, packing list and labels from it. When a buyer’s broker asks for a change, change the record and reissue all three documents together.',
      ],
    },
  ],
  faq: [
    {
      q: 'How long does it take to get from “clearance completed” to delivery?',
      a: 'That depends on the carrier’s network and the delivery address, not on customs. Once customs has released the goods, the carrier’s own delivery estimate in the tracking detail is the best guide.',
    },
    {
      q: 'Does “held in customs” mean something is wrong with my goods?',
      a: 'Not necessarily. It means release is waiting for something: information, a document, a payment or an inspection. The tracking detail or the recipient’s broker can tell you which.',
    },
    {
      q: 'Who pays if customs inspects a shipment?',
      a: 'In the US, CBP states that the importer bears the cost of cargo exams. Who ultimately carries that cost between buyer and seller depends on their contract and the Incoterms® 2020 rule agreed.',
    },
    {
      q: 'Can the shipper talk to customs directly about a held import?',
      a: 'Usually the importer or their broker deals with customs in the destination country, because the declaration is theirs. The shipper’s job is to supply corrected documents quickly to whoever asks.',
    },
    {
      q: 'Is “released” the same as “cleared”?',
      a: 'On most tracking pages they report the same event: customs has let the goods go. Check your carrier’s own definition, since wording and the point at which it is shown vary by network.',
    },
  ],
  sources: [
    'a3-ecfr-19-cfr-141-0a',
    'a3-ecfr-19-cfr-142-3',
    'a3-ecfr-19-cfr-142-12',
    'us-cbp-invoice-contents',
    'a3-cbp-form-7501',
    'w4-cbp-importer-tips',
    'a3-dhl-tracking-faq',
    'trade-gov-commercial-invoice',
    'trade-gov-packing-list',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: [
    '/tools/invoice-generator',
    '/tools/packing-list-generator',
    '/tools/delivery-note-generator',
  ],
  callout: {
    afterSection: 3,
    tool: '/tools/invoice-generator',
    title: 'Reissue a complete invoice',
    text: 'If a hold points to the invoice, the commercial invoice generator has fields for full descriptions, quantities, unit prices, currency, charges and origin, so the corrected copy is complete.',
  },
  related: [
    '/blog/how-long-does-customs-clearance-take',
    '/blog/brokerage-fees-and-duties-on-courier-shipments',
    '/blog/commercial-invoice-ups-fedex-dhl',
    '/blog/commercial-invoice-requirements',
    '/blog/packing-list-for-shipping',
  ],
  cover: {
    id: 'k63Or81F8-M',
    src: 'https://images.unsplash.com/photo-1770013413878-2530e2c3d82b',
    width: 6000,
    height: 4000,
    alt: 'Small business owner checking a parcel’s status on a phone beside a laptop and stacked boxes',
    caption: 'Checking a package on a phone next to a laptop and boxes',
    photographer: { name: 'Rifki Kurniawan', profile: 'https://unsplash.com/@kurniawann' },
    page: 'https://unsplash.com/photos/woman-checking-package-with-phone-near-laptop-and-boxes-k63Or81F8-M',
  },
};

export default article;
