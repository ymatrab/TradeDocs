import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-06/07): "eccn" 3,600; "ear99" 3,600; "eccn lookup" 720, KD 5;
 * "export license" 590, KD 7. "commerce control list" (40,500) is an anomaly and is not quoted.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave A (v2 #19).
 */
const article: ContentArticle = {
  slug: 'eccn-ear99-export-licence',
  title: 'ECCN and EAR99: how to check if an export needs a licence',
  metaTitle: 'ECCN and EAR99: when an export licence applies',
  description:
    'What an ECCN and EAR99 mean under the US Export Administration Regulations, how items get classified, and the official steps BIS sets out for checking whether a licence is needed.',
  lede:
    'Before a US export leaves, someone has to know how the item is controlled. That answer is its ECCN, or EAR99 if it has none, and it decides whether the next question about a licence is short or long.',
  answer:
    'An ECCN (Export Control Classification Number) is a five-character code on the Commerce Control List that identifies how an item is controlled under the US Export Administration Regulations. EAR99 is the designation for items subject to the EAR that fit no ECCN. EAR99 items generally need no licence, except for restricted destinations, end users or end uses.',
  keyFacts: [
    'BIS describes ECCNs as five-character alphanumeric designations used on the Commerce Control List.',
    'An ECCN is a digit for the category, a letter (A to E) for the product group and three digits for the entry, according to BIS.',
    'BIS says EAR99 items may need a licence if going to a prohibited or restricted end user, end use or destination.',
    'The Commerce Country Chart shows whether a licence is required from the reason for control and the destination, according to BIS.',
    'Under 15 CFR 758.6, a destination control statement goes on the commercial invoice when Commerce Control List items other than EAR99 are shipped.',
  ],
  definitions: [
    {
      term: 'EAR',
      meaning:
        'The Export Administration Regulations, administered by the Bureau of Industry and Security (BIS) of the US Department of Commerce.',
    },
    {
      term: 'Commerce Control List (CCL)',
      meaning: 'The list in the EAR of items controlled for export, each under an ECCN.',
    },
    {
      term: 'EAR99',
      meaning: 'The designation for an item subject to the EAR that is not listed under any ECCN.',
    },
    {
      term: 'Reason for control',
      meaning:
        'The policy basis attached to an ECCN, such as national security, that the Country Chart matches against destinations.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is an ECCN?',
      paragraphs: [
        'It is the code that says how an item is controlled for export from the United States. BIS calls ECCNs five-character alphanumeric designations used on the Commerce Control List to identify items for export control purposes.',
        'The structure is fixed. The first character is a number from 0 to 9 for the broad category, the second is a letter from A to E for the product group, and the last three digits point to the specific entry on the list. Each entry then names its reasons for control, which is what links the code to destinations.',
        'An ECCN is not a tariff code. BIS treats export control classification as separate from Schedule B and HTS numbers, which serve export statistics and import duty. The guide on HS, HTS and Schedule B covers those.',
      ],
    },
    {
      heading: 'What does EAR99 mean?',
      paragraphs: [
        'EAR99 marks an item that is subject to the EAR but is not described by any ECCN on the Commerce Control List. BIS says such items generally do not require a licence.',
        'Generally is the important word. BIS adds that EAR99 items may require a licence if destined for a prohibited or restricted end user, end use or destination of concern. EAR99 tells you the item is not on the list; it does not clear the buyer, the destination or what the goods will be used for.',
      ],
    },
    {
      heading: 'How is an item classified?',
      paragraphs: [
        'BIS describes three routes, and the choice depends on how well you know the item’s technical make-up. Classification is a judgement about your specific product, so this guide does not suggest codes for any goods.',
      ],
      steps: [
        'Ask the manufacturer or developer for the ECCN, then check it against the current Commerce Control List, since BIS notes that classifications change.',
        'Self-classify using the BIS interactive tools and the Commerce Control List Order of Review, working from the item’s technical specifications.',
        'If you remain unsure, submit a classification request to BIS through SNAP-R under section 748.3 of the EAR, and BIS determines the ECCN.',
        'Record the result and how you reached it, so the same answer appears on every document for that item.',
      ],
    },
    {
      heading: 'How do you check whether an export needs a licence?',
      paragraphs: [
        'BIS frames the check as four questions: what the item is, where it is going, who will receive it, and what they will use it for. Classification answers the first. The rest depend on the transaction, which is why the same item can ship without a licence to one buyer and need one for another.',
        'For listed items, the Commerce Country Chart in Supplement No. 1 to Part 738 of the EAR shows whether a licence is required, based on the item’s reason for control and the country of destination. BIS notes that the chart does not apply to Cuba, Iran, North Korea and Syria, which are covered by parts 742 and 746, and that part 746 adds requirements for Iraq and Russia.',
        'Then come the controls that apply whatever the code: end-use and end-user controls, and screening the parties. The ITA’s Consolidated Screening List combines the export restriction lists of the Departments of Commerce, State and the Treasury. Where a licence is required, BIS lists licence exceptions to review before applying through SNAP-R.',
      ],
      table: {
        caption: 'What each part of the check answers, from the BIS licensing pages',
        head: ['Question', 'Where the answer comes from'],
        rows: [
          ['What is the item?', 'Its ECCN on the Commerce Control List, or EAR99'],
          [
            'Where is it going?',
            'The Commerce Country Chart and the country guidance in parts 742 and 746',
          ],
          ['Who receives it?', 'Screening against the Consolidated Screening List'],
          ['What will it be used for?', 'The EAR’s end-use and end-user controls'],
          ['Is a licence still needed?', 'Licence exceptions, then an application through SNAP-R'],
        ],
      },
    },
    {
      heading: 'Where do the ECCN and licence details go on export documents?',
      paragraphs: [
        'On the export filing and, for listed items, on the commercial invoice. Under 15 CFR 30.6, the Electronic Export Information carries a licence code alongside the commodity classification number, description, quantity, value and parties, so the outcome of your licence check is reported in AES.',
        'Under 15 CFR 758.6, the destination control statement must appear on the commercial invoice whenever items on the Commerce Control List are shipped, other than EAR99 items and some items under licence exceptions BAG and GFT. The same section requires the ECCN itself on the invoice for certain listed items and the “600 series”.',
        'Keep the description, quantity and value on the invoice consistent with the EEI, so customs, the carrier and the buyer read the same facts.',
      ],
    },
    {
      heading: 'Who is responsible for getting it right?',
      paragraphs: [
        'The party exporting the goods owns the answers, even when others help. A forwarder can file the EEI and a supplier can tell you an ECCN, but the BIS licensing pages frame the check around each transaction: if the item, buyer, destination or end use changes, the answers to the four questions change with it.',
        'When the answer is unclear, BIS is the authority to ask, and an export compliance adviser can help with the specifics. TradeDocs prepares the invoice and packing list from the details you enter; it does not classify items or decide licensing.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is EAR99 the same as “no licence required”?',
      a:
        'Not always. BIS says EAR99 items generally need no licence but may need one for a prohibited or restricted destination, end user or end use.',
    },
    {
      q: 'Can I use the ECCN my supplier gave me?',
      a:
        'BIS lists asking the manufacturer as one way to classify, and says to check the answer against the current Commerce Control List because classifications change.',
    },
    {
      q: 'Is an ECCN the same as an HS code or Schedule B number?',
      a:
        'No. BIS treats the ECCN as an export control classification; Schedule B and HTS numbers are commodity codes for statistics and import duty. One shipment usually needs both kinds.',
    },
    {
      q: 'How do I ask BIS to classify an item?',
      a:
        'BIS accepts classification requests through its SNAP-R system, following section 748.3 of the EAR, and then determines the ECCN.',
    },
    {
      q: 'Do I check the buyer even for an EAR99 item?',
      a:
        'BIS treats restricted end users and end uses as reasons an EAR99 item may need a licence, and the Consolidated Screening List is the ITA’s combined list for checking parties.',
    },
  ],
  sources: [
    'w5-bis-classify',
    'a5-bis-license-needed',
    'a5-bis-country-guidance',
    'a5-ear-758-6',
    'w5-ftr-30-6',
    'w5-ita-csl',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: ['/tools/invoice-generator', '/tools/packing-list-generator', '/tools/incoterms'],
  callout: {
    afterSection: 3,
    tool: '/tools/invoice-generator',
    title: 'Put the export details on one invoice',
    text:
      'Once the classification and licence check are done, build the commercial invoice with the same description, quantity and value you will report in the EEI.',
  },
  related: [
    '/guides/how-to-export-from-the-us',
    '/guides/eei-aes-filing-itn',
    '/guides/hs-vs-hts-vs-schedule-b',
    '/blog/export-documents-checklist',
  ],
  cover: {
    id: 'jXd2FSvcRr8',
    src: 'https://images.unsplash.com/photo-1562408590-e32931084e23',
    width: 3895,
    height: 2597,
    alt:
      'Close-up of a printed circuit board, the kind of technical item an exporter checks against export controls',
    caption: 'Printed circuit board in close-up',
    photographer: { name: 'Umberto', profile: 'https://unsplash.com/@umby' },
    page: 'https://unsplash.com/photos/blue-circuit-board-jXd2FSvcRr8',
  },
};

export default article;
