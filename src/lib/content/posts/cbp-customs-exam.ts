import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "cbp exam" 260, KD 6; "customs inspection" 170;
 * "customs exam" 50.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave C.
 */
const article: ContentArticle = {
  slug: 'cbp-customs-exam',
  title: 'CBP exam: what happens when US customs inspects a shipment',
  metaTitle: 'CBP exam: how US customs inspections work',
  description:
    'Why CBP examines imports, where the exam happens, how many packages are opened, the five-day and 30-day detention clocks, who pays, and how good documents shorten it.',
  lede: 'A shipment that should have cleared sits at the port with a status saying it has been selected for exam. For the buyer that means waiting and paying; for you as the seller it means questions about your paperwork. Here is what US rules say about the exam and what you can do before the goods leave.',
  answer:
    'A CBP exam is US Customs and Border Protection’s inspection of imported goods to confirm duty and compliance with the laws it enforces. Under 19 CFR 151.16, CBP decides within five business days of the goods being presented whether to release or detain them. The importer pays the cost of preparing goods for the exam.',
  keyFacts: [
    'CBP states that 19 U.S.C. 1467 gives it the right to examine any shipment imported into the United States.',
    'Under 19 CFR 151.2, CBP examines at least one package in every 10, or for uniform packages at least one package per invoice.',
    'Under 19 CFR 151.16, CBP decides within five business days of presentation whether to release or detain goods, and makes a final admissibility decision within 30 days.',
    'Under 19 CFR 151.6, the importer bears the expense of preparing goods for examination and closing the packages.',
    'CBP says shipments selected for examination are generally moved to a centralized examination station, a privately operated facility that bills for its services.',
  ],
  definitions: [
    {
      term: 'Centralized examination station (CES)',
      meaning:
        'A privately operated facility where goods are made available to CBP officers for physical examination.',
    },
    {
      term: 'Devanning',
      meaning: 'Unloading cargo from its shipping container so it can be examined.',
    },
    {
      term: 'Detention',
      meaning:
        'Under 19 CFR 151.16, the status of goods CBP has not released within five business days of their presentation for examination.',
    },
    {
      term: 'Deemed exclusion',
      meaning:
        'Under 19 CFR 151.16(f), CBP’s failure to decide admissibility within 30 days, treated as a decision to exclude that can be protested.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is a CBP exam?',
      paragraphs: [
        'It is CBP’s inspection of imported goods. CBP’s guidance for importers says that under 19 U.S.C. 1467 it has the right to examine any shipment imported into the United States, and that household effects and personal shipments are not exempt. Under 19 CFR 151.1, the port director examines the packages or quantities that are necessary to determine the duties and to check compliance with the customs laws and the other laws CBP enforces.',
        'CBP is not the only agency that may look. Under 19 CFR 151.4(a), authorised employees of CBP, the Food and Drug Administration, the Animal and Plant Health Inspection Service, the Public Health Service and other agencies may examine or sample goods for official purposes before entry is filed, including goods released under immediate delivery.',
      ],
    },
    {
      heading: 'How do you know a shipment has been selected?',
      paragraphs: [
        'The broker sees it on the entry. CBP Form 3461 has a block for CBP use only with boxes for “CBP examination required” and for other agency action, and the electronic equivalent carries the same result back to the filer. Your buyer or its broker usually hears first, and you hear when they need something from you.',
        'The regulation leaves the selection to the port director, and you should not expect to learn why a shipment was chosen. CBP does warn that some failures raise the odds: its Importer Security Filing page says non-compliance with the 10+2 rule for vessel cargo could result in penalties, more inspections and delay.',
      ],
    },
    {
      heading: 'Where does a CBP exam take place?',
      paragraphs: [
        'At the place of arrival unless the port director requires or authorises another place, under 19 CFR 151.6. Under 19 CFR 151.7, that other place can be the importer’s premises or a centralized examination station. CBP’s importer guidance says a shipment selected for examination is generally moved to a CES, which unloads the container, makes the goods available to CBP officers and reloads them afterwards.',
        'The move happens under bond. Under 19 CFR 151.15, Form 3461 or an attachment can be used to request transfer to a CES, and the carrier, CES operator or importer stays liable under its bond until the goods are received. For containerised sea cargo, Form 3461 asks the broker to name the preferred exam site and list the container numbers covered by the entry.',
      ],
    },
    {
      heading: 'How much of the shipment does CBP open?',
      paragraphs: [
        'At least one package in every 10, under 19 CFR 151.2, unless a special regulation allows fewer. For packages with uniform contents and values, or identical contents in differing quantities, the port director may examine fewer, but not less than one package per invoice. At ports the Commissioner designates, goods of a kind that need not be examined every time may be released without examination.',
        'This is why the packing list matters. CBP picks packages by number and compares what is inside with what the documents say. Under 19 CFR 141.86(e), the invoice or an attached packing list must show in adequate detail what each package contains, so a numbered list that matches the marks on the cartons lets the officer check the sample and move on.',
      ],
    },
    {
      heading: 'How long can a CBP exam hold the goods?',
      paragraphs: [
        'Five business days before goods count as detained, and 30 days before a decision is due. The clocks in 19 CFR 151.16 run from the date the goods are presented for examination, which the regulation defines as being in a condition to be viewed and examined by an officer. Presenting a closed container does not count.',
      ],
      table: {
        caption: 'The detention clock under 19 CFR 151.16 (CBP examinations, not holds for other agencies)',
        head: ['Point', 'What the regulation says happens'],
        rows: [
          [
            'Goods presented for examination',
            'The clock starts when the goods can be viewed and examined, not when the container arrives',
          ],
          [
            'Within 5 business days',
            'CBP decides to release or detain; goods not released are treated as detained',
          ],
          [
            'Within 5 further business days',
            'CBP issues a notice of detention giving the reason, expected length, tests and information that could speed things up',
          ],
          [
            'Within 30 days of presentation',
            'CBP makes a final determination on admissibility, which can be protested',
          ],
          [
            'No decision by day 30',
            'Treated as an exclusion that can be protested, unless a longer period is authorised by law',
          ],
        ],
      },
    },
    {
      heading: 'Who pays for a CBP exam?',
      paragraphs: [
        'The importer, as far as CBP is concerned. Under 19 CFR 151.6, except where CBP requires examination at the public stores, the importer bears any expense of preparing the goods for examination and closing the packages. CBP’s guidance adds that it does not charge for cargo examinations in normal operations, but the CES bills for unloading and reloading, and there are costs for moving the cargo to and from the exam site and for storage. CBP notes that rates vary across the country.',
        'Between buyer and seller, the sales contract decides who finally carries those costs. Under the ICC’s Incoterms® 2020 rules, import clearance falls to the buyer under most rules and to the seller under DDP, so a seller on DDP terms should expect exam costs to land on its side. Check your contract rather than assume.',
      ],
    },
    {
      heading: 'What can an exporter do to shorten an exam?',
      paragraphs: [
        'Make the documents easy to check against the goods. These steps help an officer match a sample to the paperwork quickly.',
      ],
      steps: [
        'Number every package and mark the numbers on the outside where they can be read in a stack.',
        'List each package’s contents, quantities and weights on the packing list, using the same numbers.',
        'Describe goods on the invoice in plain terms: what they are, what they are made of and what they are for.',
        'Keep the invoice, packing list and transport document consistent on parties, package count and weights.',
        'Send the documents to the buyer’s broker before arrival so questions come while the goods are still at sea.',
        'Answer requests from the broker quickly, since the notice of detention lists the information that could speed release.',
      ],
    },
  ],
  faq: [
    {
      q: 'Does a CBP exam mean something is wrong with my shipment?',
      a: 'Not by itself. The port director examines goods as necessary to check duty and compliance. Under 19 CFR 151.16(c), even a notice of detention is not a final determination on admissibility.',
    },
    {
      q: 'Can the importer examine goods before entry is filed?',
      a: 'In limited cases. Under 19 CFR 151.4(b), the port director may allow it to check perishables or to get information for a pro forma invoice when documents are missing. Under 19 CFR 151.5, it happens under CBP supervision and the importer reimburses the cost of the supervising officer.',
    },
    {
      q: 'Can the importer see the results of CBP testing?',
      a: 'Yes, on written request. Under 19 CFR 151.16(d), CBP provides copies of test results and a description of the testing methods, unless the methods are proprietary or were developed by CBP for enforcement.',
    },
    {
      q: 'What happens if detained goods are refused?',
      a: 'Under 19 CFR 151.16(j), where the law provides, detained goods may be seized and forfeited, or CBP may deny entry and allow them to be exported, with the importer paying the expenses of exportation.',
    },
    {
      q: 'Do the five-day and 30-day clocks apply to FDA holds?',
      a: 'No. Under 19 CFR 151.16(a), the section does not apply to detentions CBP makes on behalf of other agencies that decide admissibility themselves; their own rules apply.',
    },
  ],
  sources: [
    'w3-cbp-importer-tips',
    'c2-cfr-19-151-1',
    'c2-cfr-19-151-2',
    'c2-cfr-19-151-4',
    'c2-cfr-19-151-5',
    'c2-cfr-19-151-6',
    'c2-cfr-19-151-7',
    'c2-cfr-19-151-15',
    'c2-cfr-19-151-16',
    'c2-cbp-form-3461',
    'us-cbp-invoice-contents',
    'a1-cbp-isf',
    'icc-incoterms-2020',
    'w1-hmrc-incoterms',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: ['/tools/invoice-generator', '/tools/packing-list-generator', '/tools/incoterms'],
  callout: {
    afterSection: 3,
    tool: '/tools/packing-list-generator',
    title: 'Make the sample easy to check',
    text: 'The packing list generator numbers each package and lists its contents, quantities and weights, so an officer can match the carton in front of them to a line on the list.',
  },
  related: [
    '/blog/how-long-does-customs-clearance-take',
    '/blog/cbp-form-3461',
    '/blog/customs-status-messages-explained',
    '/blog/commercial-invoice-and-packing-list-must-match',
    '/guides/how-to-import-into-the-us',
  ],
  cover: {
    id: 'V89PqZteK-k',
    src: 'https://images.unsplash.com/photo-1759272548449-7b689a81c8fb',
    width: 5974,
    height: 3983,
    alt: 'Two workers in hard hats reviewing papers beside stacked shipping containers at a port',
    caption: 'Two workers in hard hats talk over plans next to shipping containers',
    photographer: { name: 'Haris Illahi', profile: 'https://unsplash.com/@harisillahi' },
    page: 'https://unsplash.com/photos/two-workers-in-hard-hats-discuss-plans-near-shipping-containers-V89PqZteK-k',
  },
};

export default article;
