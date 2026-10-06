import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "commercial invoice for samples" 390, KD 22.
 * Plan: docs/research/content-plan-v2-2026-10-06.md, batch 1.
 */
const article: ContentArticle = {
  slug: 'commercial-invoice-for-samples',
  title: 'Commercial invoice for samples: what to write when nothing is paid',
  metaTitle: 'Commercial invoice for samples: value, wording',
  description:
    'Free samples still need a commercial invoice with a fair customs value. What “no commercial value” really means, how to value and describe samples, and how they are marked.',
  lede: 'You are sending a few pieces to a prospective buyer and nobody is paying for them. The carrier still asks for a commercial invoice, and the value field is the one that causes trouble. A sample that costs the buyer nothing still has a value for customs.',
  answer:
    'Samples sent free of charge still need a commercial invoice. State that no payment is due, describe each sample specifically, mark the reason for export as “sample”, and give each item a fair customs value: what the goods would sell for in the ordinary course of trade. Never enter zero or a token figure.',
  keyFacts: [
    'FedEx and UPS require a commercial invoice for international shipments of goods; only documents with no commercial value are excluded.',
    'Under 19 CFR 141.86, goods not shipped under a purchase must still show a value for each item on a US import invoice.',
    'The WTO Customs Valuation Agreement makes transaction value the main basis of customs value, with other methods where there is no sale.',
    'CBP’s informed compliance publication on commercial samples describes duty-free treatment for samples valued not over $1 each or marked or mutilated so they cannot be sold.',
    'FedEx lists “Samples” on its own as a vague description and gives “200cm x 400cm nylon carpet samples” as a good one.',
  ],
  definitions: [
    {
      term: 'No commercial value (NCV)',
      meaning:
        'Wording used when the buyer pays nothing; it describes the payment, not the customs value of the goods.',
    },
    {
      term: 'Customs value',
      meaning: 'The value on which duty and import taxes are worked out, declared by the importer.',
    },
    {
      term: 'Mutilated sample',
      meaning:
        'A sample marked, cut, torn or perforated so that it cannot be sold or used other than as a sample.',
    },
    {
      term: 'ATA Carnet',
      meaning:
        'An international customs document that lets goods such as samples enter temporarily without paying duty.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'Do free samples need a commercial invoice?',
      paragraphs: [
        'Yes. Carriers draw the line at documents, not at payment. FedEx requires a commercial invoice for any international shipment with commercial value, and UPS for all cross-border shipments except documents with no commercial value. A sample of your product has a value even when you give it away.',
        'Customs in the importing country uses the invoice to see what the goods are, where they were made and what they are worth. A sample shipment answers the same questions as a sale, with one difference: there is no price paid, so you have to state a value another way.',
      ],
    },
    {
      heading: 'What value should you put on a sample invoice?',
      paragraphs: [
        'A fair value for the goods themselves, not the price the recipient pays. For goods entering the United States, 19 CFR 141.86 says that when merchandise is shipped other than under a purchase, the invoice gives the value of each item in the currency usually used, or, without such a value, the price the manufacturer, seller, shipper or owner would have received for the goods if sold in the ordinary course of trade, in the usual wholesale quantities, in the country of exportation.',
        'In practice that is usually your normal wholesale price for the item, or your cost if you have no price list yet. Other countries apply the WTO Customs Valuation Agreement, which uses the transaction value where there is a sale and other methods where there is not. Either way, the figure has to be defensible.',
        'Never enter zero, one dollar or another token value to keep the duty down. An understated value is an inaccurate declaration, the importer carries the responsibility for it, and it can hold the shipment while customs asks questions.',
      ],
    },
    {
      heading: 'What does “no commercial value” mean on an invoice?',
      paragraphs: [
        'It means the recipient is not paying. It does not mean the goods are worthless. Write it so that both facts are clear: the samples are free of charge, and the value shown is for customs purposes.',
        'A line such as “Samples supplied free of charge. No payment due. Values stated for customs purposes only.” does that. Put it near the totals, keep the unit values and the invoice total in place, and choose “sample” as the reason for export on the carrier’s booking screen. DHL’s guide lists sample as a reason for export, described as products for evaluation or demonstration.',
      ],
    },
    {
      heading: 'How should you describe and mark samples?',
      paragraphs: [
        'Describe each sample as specifically as you would describe goods for sale. FedEx lists “Samples” as a bad description and “200cm x 400cm nylon carpet samples” as a good one; DHL gives “Samples of curtains, made of 100% cotton”. Say what the item is, what it is made of, how many there are and what they are for.',
        'Marking can change the treatment at a US entry. CBP’s informed compliance publication on commercial samples describes a duty-free provision for samples valued not over $1 each, or marked, torn, perforated or otherwise treated so that they are unsuitable for sale or for use other than as a sample. Under it, goods are marked “SAMPLE” in indelible ink or paint, or cut or torn as prescribed, and sample footwear is marked “SAMPLE – NOT FOR RESALE”.',
        'Whether a shipment qualifies is a classification decision for the importer and its customs broker, not something the invoice can claim on its own. CBP’s publication dates from 2003; check the current text with your broker. Marking a sample does not remove the need to state its value.',
      ],
    },
    {
      heading: 'What does a sample invoice look like?',
      paragraphs: [
        'The lines below show how samples sit on an invoice. The sender, the goods and every figure are invented; use your own wholesale prices.',
      ],
      table: {
        caption: 'Worked example of sample invoice lines, invented parties and figures (USD)',
        head: ['Description', 'Qty', 'Unit value', 'Line value', 'Origin'],
        rows: [
          [
            'Ceramic coffee mug, 350 ml, glazed stoneware, marked “SAMPLE” on the base',
            '6',
            '4.50',
            '27.00',
            'Portugal',
          ],
          ['Linen tea towel, 50 × 70 cm, 100% linen, cut corner', '4', '3.20', '12.80', 'Portugal'],
          ['Printed product catalogue, 24 pages', '2', '1.00', '2.00', 'Portugal'],
          ['Invoice total (free of charge; values for customs purposes only)', '', '', '41.80', ''],
        ],
      },
    },
    {
      heading: 'What if the samples will come back?',
      paragraphs: [
        'Then the shipment is a temporary export, and you have more options. CBP’s publication describes temporary importation under bond (TIB) and ATA Carnets as ways for samples imported to take orders to enter the US without duty, provided they are exported again. CBP defines a sample for those provisions as an article imported for the bona fide purpose of taking orders for similar merchandise.',
        'On the carrier side, DHL’s invoice has a type of export field with permanent, temporary, and repair and return. If you send trade-show samples or a demonstration unit that will return, say so on the invoice and agree the route with your forwarder or broker before it ships.',
      ],
    },
    {
      heading: 'How do you prepare a commercial invoice for samples?',
      paragraphs: ['A short checklist for a sample shipment:'],
      steps: [
        'Give the sender, the recipient and their full contact details, as for a sale.',
        'Describe each sample specifically, with material, size and quantity.',
        'Enter a fair unit value for each line, such as your wholesale price, in the invoice currency.',
        'Add the country of origin for each line and the net and gross weights.',
        'Add “Samples supplied free of charge. No payment due. Values stated for customs purposes only.” near the totals.',
        'Choose “sample” as the reason for export, and “temporary” as the type of export if the goods will return.',
        'Mark or mutilate samples only if you and the recipient’s broker have agreed that treatment, and keep the values unchanged.',
      ],
    },
  ],
  faq: [
    {
      q: 'Can I write “$0” on a commercial invoice for samples?',
      a: 'No. Samples need a fair customs value even when free. Show the value per item and state separately that no payment is due.',
    },
    {
      q: 'Will the recipient pay duty on free samples?',
      a: 'They may. Duty and import taxes depend on the importing country’s rules and thresholds, and on the declared value, not on whether you charged for the goods.',
    },
    {
      q: 'Is a proforma invoice enough for samples?',
      a: 'UPS’s page refers to the commercial invoice “or pro forma invoice”. Whichever title the carrier accepts, the content is the same: description, value, origin and the free-of-charge note.',
    },
    {
      q: 'Does marking goods “SAMPLE” make them duty-free?',
      a: 'Not by itself. In the US, CBP describes a duty-free provision for samples worth not over $1 each or marked so they cannot be sold; whether a shipment qualifies is decided at entry.',
    },
    {
      q: 'Should the invoice say why I am sending samples?',
      a: 'Yes. State “sample” as the reason for export and, if useful, a short line such as “for product evaluation by the consignee”.',
    },
  ],
  sources: [
    'us-cbp-invoice-contents',
    'wto-customs-valuation',
    'w2-cbp-samples',
    'w2-fedex-customs-documents',
    'w2-ups-commercial-invoice',
    'w2-dhl-commercial-invoice',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: [
    '/tools/invoice-generator',
    '/tools/proforma-invoice-generator',
    '/tools/packing-list-generator',
  ],
  callout: {
    afterSection: 2,
    tool: '/tools/invoice-generator',
    title: 'Make a sample invoice with real values',
    text: 'Enter each sample with its description, unit value and origin, and add the free-of-charge note in the notes field.',
  },
  related: [
    '/blog/commercial-invoice-requirements',
    '/blog/commercial-invoice-ups-fedex-dhl',
    '/guides/proforma-vs-commercial-invoice',
    '/blog/proforma-invoice-example',
  ],
  cover: {
    id: '2LKrTBSKKXc',
    src: 'https://images.unsplash.com/photo-1659767151200-f2543af40c44',
    width: 6240,
    height: 4160,
    alt: 'Rows of coloured fabric samples on display, the kind of goods often sent to buyers free of charge',
    caption: 'Fabric samples on display at the VitraHaus, Germany',
    photographer: { name: 'Bernd Dittrich', profile: 'https://unsplash.com/@hdbernd' },
    page: 'https://unsplash.com/photos/a-close-up-of-a-bunch-of-colored-pencils-2LKrTBSKKXc',
  },
};

export default article;
