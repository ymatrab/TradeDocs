import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google UK, 2026-10-07): "cmr" 2,900, KD 2; "cmr document" 390.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave A.
 * TradeDocs explains the CMR consignment note; it does not issue one. The carrier and the sender
 * complete and sign it. Convention text cited from the schedule to the UK Carriage of Goods by
 * Road Act 1965.
 */
const article: ContentArticle = {
  slug: 'cmr-note',
  title: 'What is a CMR note? The road consignment note explained',
  metaTitle: 'CMR note: the road consignment note explained',
  description:
    'What a CMR consignment note is, when the CMR Convention applies, the particulars it must show, who signs the three copies, and how it matches your invoice and packing list.',
  lede:
    'Send goods by lorry from one country to another in Europe and the driver will ask for a CMR. It is the road equivalent of the bill of lading’s receipt and contract roles, and most of what goes on it comes from your packing list.',
  answer:
    'A CMR note is the consignment note for international road carriage under the CMR Convention. It confirms the contract of carriage between sender and carrier and records the goods, packages, gross weight and the parties. It is made out in three originals signed by the sender and the carrier, and one travels with the goods.',
  keyFacts: [
    'The CMR Convention applies to contracts for carrying goods by road in vehicles for reward between two countries, at least one of them a contracting country.',
    'Under Article 4 of the CMR Convention, a missing or irregular consignment note does not affect the validity of the contract of carriage.',
    'Under Article 5, the CMR consignment note is made out in three original copies signed by the sender and the carrier.',
    'Under Article 9, the consignment note is prima facie evidence of the contract, its conditions and the carrier’s receipt of the goods.',
    'Article 23 limits the carrier’s compensation to 8.33 units of account per kilogram of gross weight short, unless a higher value is declared.',
  ],
  definitions: [
    {
      term: 'CMR',
      meaning:
        'The Convention on the Contract for the International Carriage of Goods by Road, and the consignment note named after it.',
    },
    {
      term: 'Sender',
      meaning:
        'The party that contracts with the carrier and hands over the goods; often the exporter.',
    },
    {
      term: 'Consignee',
      meaning: 'The party at the place of delivery to whom the carrier hands the goods.',
    },
    {
      term: 'e-CMR',
      meaning:
        'An electronic consignment note made under the Additional Protocol to the CMR Convention.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is a CMR note?',
      paragraphs: [
        'It is the consignment note the CMR Convention requires for international road carriage. Article 4 says the contract of carriage is confirmed by the making out of a consignment note, and adds that its absence, irregularity or loss does not affect the existence or validity of the contract. The note records the deal; the deal exists without it, but you lose the evidence.',
        'You, as sender, supply most of the details the note needs, and you sign it with the carrier when the goods are taken over. Getting those details right is the part of the CMR that is in your hands.',
      ],
    },
    {
      heading: 'When does the CMR Convention apply?',
      paragraphs: [
        'Under Article 1, the Convention applies to every contract for the carriage of goods by road in vehicles for reward, when the place where the goods are taken over and the place designated for delivery are in two different countries, at least one of which is a contracting country. The residence and nationality of the parties do not matter.',
        'Article 1 excludes carriage under international postal conventions, funeral consignments and furniture removal. The UK’s Protocol of Signature also keeps traffic between the United Kingdom and the Republic of Ireland outside it. For a domestic road journey, or a route outside the contracting countries, other rules apply; check them with your carrier.',
      ],
    },
    {
      heading: 'What must a CMR consignment note contain?',
      paragraphs: [
        'Article 6(1) lists the particulars every CMR note must show. Most of them are the same facts your commercial invoice and packing list already carry, which is why the three documents should be prepared together.',
      ],
      table: {
        caption: 'CMR Article 6(1) particulars and the document each usually comes from',
        head: ['Particular (Article 6(1))', 'Where you find it'],
        rows: [
          ['Date and place the note is made out', 'The day and place of loading'],
          ['Name and address of the sender', 'Your invoice header'],
          ['Name and address of the carrier', 'The haulier’s booking'],
          [
            'Place and date of taking over, and the place designated for delivery',
            'The booking and the Incoterms® named place',
          ],
          ['Name and address of the consignee', 'The invoice or packing list'],
          ['Description in common use of the goods and the method of packing', 'The packing list'],
          ['Number of packages and their special marks and numbers', 'The packing list'],
          ['Gross weight or other quantity', 'The packing list total gross weight'],
          ['Charges relating to the carriage', 'The freight agreement'],
          ['Instructions for customs and other formalities', 'Your broker or forwarder'],
          [
            'A statement that the carriage is subject to the Convention',
            'Usually pre-printed on the form',
          ],
        ],
      },
    },
    {
      heading: 'Who fills in and signs the CMR?',
      paragraphs: [
        'Both sides sign. Article 5 says the note is made out in three original copies signed by the sender and the carrier: the first goes to the sender, the second travels with the goods, and the third stays with the carrier. Where the law of the country allows, the signatures may be printed or replaced by stamps.',
        'The sender carries the risk of its own errors. Under Article 7, the sender is responsible for the expenses, loss and damage the carrier suffers because the particulars the sender supplied were inaccurate or inadequate. A gross weight copied wrongly from the packing list is your problem, not the driver’s.',
      ],
    },
    {
      heading: 'What does a CMR note prove if something goes wrong?',
      paragraphs: [
        'Article 9 makes the note prima facie evidence of the contract, its conditions and the carrier’s receipt of the goods. If the carrier enters no specific reservations on the note, Article 9 presumes, unless the contrary is proved, that the goods and their packaging appeared to be in good condition when the carrier took them over. A driver who spots damage at loading should write it on the note.',
        'Compensation for loss is capped. Article 23 limits it to 8.33 units of account per kilogram of gross weight short, and Article 24 lets the sender declare a higher value against an agreed surcharge. Under Article 32, the period for bringing a claim is normally one year. That makes the gross weight on the note the figure any claim is measured from.',
      ],
    },
    {
      heading: 'Is there an electronic CMR?',
      paragraphs: [
        'Yes. An Additional Protocol to the CMR Convention provides for an electronic consignment note, known as e-CMR; the UK government laid it before Parliament in July 2019. An e-CMR can only replace the paper note on a journey where the countries involved accept it, so confirm with your carrier before relying on one.',
      ],
    },
    {
      heading: 'How do you prepare for a CMR shipment?',
      paragraphs: [
        'Prepare the trade documents first, then give the carrier the facts it needs for the note.',
      ],
      steps: [
        'Agree the Incoterms® rule and named place, so the place of taking over and delivery are clear.',
        'Finish the commercial invoice and packing list, with package count, marks and gross weight.',
        'Send the carrier the sender, consignee, places, goods description and gross weight from those documents.',
        'Give the carrier any customs instructions from your broker, and list the documents travelling with the goods.',
        'Check every particular on the note against the packing list before you sign it at loading.',
        'Keep your signed first copy with the invoice and packing list for the shipment file.',
      ],
    },
  ],
  faq: [
    {
      q: 'Who keeps each copy of the CMR note?',
      a:
        'Under Article 5 the first original goes to the sender, the second travels with the goods to the consignee, and the third is kept by the carrier.',
    },
    {
      q: 'Who is responsible for the details on a CMR note?',
      a:
        'Each party for what it supplies. Under Article 7 the sender bears the cost of particulars it gave that prove inaccurate or inadequate, such as the description, packages or gross weight.',
    },
    {
      q: 'Does the CMR apply to UK to EU road freight?',
      a:
        'Yes, where the carriage is by road for reward between two countries and at least one is a contracting country. The UK’s Protocol of Signature keeps UK to Republic of Ireland traffic outside it.',
    },
    {
      q: 'What weight goes on the CMR note?',
      a:
        'The gross weight of the goods, packaging included, or their quantity otherwise expressed. Take it from the total on your packing list so the two documents agree.',
    },
    {
      q: 'How long do I have to make a claim under the CMR?',
      a:
        'Article 32 sets one year, or three years for wilful misconduct. Notice of damage is due sooner: under Article 30, apparent damage at delivery, other damage within seven days, and delay within 21 days.',
    },
  ],
  sources: ['a4-cmr-convention', 'a4-gov-uk-e-cmr-protocol', 'trade-gov-packing-list'],
  primaryTool: '/tools/packing-list-generator',
  callout: {
    afterSection: 2,
    tool: '/tools/packing-list-generator',
    title: 'Get the packages, marks and gross weight right first',
    text:
      'The packing list generator totals packages and net and gross weights per line, so the figures you give the carrier for the CMR note match your other documents.',
  },
  tools: ['/tools/packing-list-generator', '/tools/invoice-generator', '/tools/incoterms'],
  related: [
    '/guides/what-is-a-bill-of-lading',
    '/blog/packing-list-for-shipping',
    '/guides/gross-weight-vs-net-weight',
    '/blog/shipping-marks',
    '/blog/export-documents-checklist',
  ],
  cover: {
    id: 'ilqwYUMr2fk',
    src: 'https://images.unsplash.com/photo-1586828909860-faf5ed195143',
    width: 5472,
    height: 3648,
    alt: 'White lorry driving on a road past bare winter trees, carrying freight by road',
    caption: 'White lorry on a road lined with bare trees',
    photographer: { name: 'Yassine Khalfalli', profile: 'https://unsplash.com/@yassine_khalfalli' },
    page: 'https://unsplash.com/photos/white-truck-on-road-near-bare-trees-during-daytime-ilqwYUMr2fk',
  },
};

export default article;
