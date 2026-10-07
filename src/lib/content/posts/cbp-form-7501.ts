import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "us customs form 7501" 1,600, KD 17.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave A (v2 #45).
 */
const article: ContentArticle = {
  slug: 'cbp-form-7501',
  title: 'CBP Form 7501: where your invoice data lands on the US entry summary',
  metaTitle: 'CBP Form 7501: the US entry summary explained',
  description:
    'What CBP Form 7501 is, who files it and when, and which blocks are filled from the commercial invoice: origin, description, HTS number, quantity, value and charges.',
  lede: 'When goods are imported into the United States, the duty, the classification and the statistics all end up on one record: the entry summary, CBP Form 7501. CBP notes that many first-time importers hire a licensed customs broker to file it. This post shows what the form is for and which of its blocks come straight from the commercial invoice you send.',
  answer:
    'CBP Form 7501 is the US entry summary: the filing CBP uses to assess duty, classify and appraise imported goods, and collect trade statistics. The importer of record or its customs broker files it, on paper or electronically, within 10 working days of entry. Its origin, description, quantity and value come from the commercial invoice.',
  keyFacts: [
    'Under 19 CFR 142.11, the entry summary for formally entered goods must be on CBP Form 7501 or its electronic equivalent.',
    'Under 19 CFR 142.12, entry summary documentation is filed with estimated duties within 10 working days after the time of entry, where it was not filed at entry.',
    'CBP states that it relies on Form 7501 to determine appraisement, classification and origin of the imported goods.',
    'CBP’s Form 7501 instructions require the full 10-digit HTS number for each line and the entered value in US dollars as defined in 19 U.S.C. 1401a.',
    'CBP advises that the importer of record remains responsible for the correctness of the entry and for duties, taxes and fees, even when using a broker.',
  ],
  definitions: [
    {
      term: 'Entry',
      meaning:
        'Under 19 CFR 141.0a, the documents or data filed to secure the release of imported goods from CBP custody.',
    },
    {
      term: 'Entry summary',
      meaning:
        'Under 19 CFR 141.0a, the documents or data that let CBP assess duties and collect statistics; for formal entries, Form 7501 or its electronic equivalent.',
    },
    {
      term: 'Importer of record',
      meaning:
        'The owner or purchaser of the goods, or a licensed customs broker designated by them, liable for duties and for meeting import requirements.',
    },
    {
      term: 'ABI',
      meaning:
        'The Automated Broker Interface, the electronic link CBP’s instructions describe for transmitting entry summary data.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is CBP Form 7501?',
      paragraphs: [
        'CBP Form 7501 is the entry summary for goods imported into the United States. Under 19 CFR 142.11, the entry summary for formally entered merchandise must be on Form 7501 or its electronic equivalent. CBP says it relies on the form to determine appraisement, classification and origin, and the privacy statement on the current edition explains the rest: it identifies goods entering US commerce, documents the duty and tax paid, and supplies data to the Census Bureau for statistics.',
        'The current paper edition is dated 02/26 and carries CBP’s block-by-block instructions. The regulation allows an electronic equivalent, and the instructions cover filings made through the Automated Broker Interface, where certification takes the place of a signature. Either way, the numbered blocks are the clearest map of what is reported.',
      ],
    },
    {
      heading: 'How is the entry summary different from the entry?',
      paragraphs: [
        'They are two steps. Under 19 CFR 141.0a, the entry is what is filed to get the goods released from CBP custody, and the entry summary is what CBP needs to assess duties and collect statistics. Under 19 CFR 142.3, the entry documents include CBP Form 3461 or its electronic equivalent, evidence of the right to make entry, a commercial invoice and a packing list where appropriate.',
        'Goods can be released first and summarised later. Under 19 CFR 142.12, where the summary was not filed at the time of entry, it must be filed with estimated duties attached within 10 working days after the time of entry. CBP’s instructions call a summary filed at the time of entry, with estimated duties, a live entry.',
      ],
    },
    {
      heading: 'Who files Form 7501?',
      paragraphs: [
        'The importer of record, or a licensed customs broker acting for it. CBP’s instructions define the importer of record as the owner or purchaser of the goods, or a licensed customs broker when designated by the owner, purchaser or consignee, and as the party liable for paying duties and meeting the requirements of importation. Block 30 names that party, and the instructions say the importer of record on the invoice should be the same party as on the form unless the form shows a broker.',
        'Using a broker does not shift responsibility. CBP’s guidance for importers states that the importer of record remains ultimately responsible for the correctness of the documentation presented and for all duties, taxes and fees. As an exporter you are not the filer, but your invoice is the main source of what is declared.',
      ],
    },
    {
      heading: 'Which blocks come from your commercial invoice?',
      paragraphs: [
        'Most of the line-level data. Under 19 CFR 141.86, a US import invoice must show the parties, a detailed description, quantities, the purchase price in the currency of sale, itemised charges and the country of origin. The broker transfers those facts into the blocks below, following CBP’s instructions for each.',
      ],
      table: {
        caption:
          'Form 7501 blocks filled from the invoice and shipping documents (CBP Form 7501, 02/26)',
        head: ['Block or column', 'What CBP’s instructions ask for', 'Where the broker gets it'],
        rows: [
          [
            '10 Country of origin',
            'Country of manufacture, production or growth, or of last substantial transformation; not the country of invoice or export',
            'The origin you state on the invoice',
          ],
          [
            '13 Manufacturer ID',
            'A code constructed from the invoicing party’s name and address',
            'The seller block of the invoice',
          ],
          [
            '32 Description of merchandise',
            'Detail sufficient to classify the goods under the correct HTS statistical number',
            'The line descriptions on the invoice',
          ],
          [
            '33A HTSUS number',
            'The full 10-digit HTS number for the line, with any binding ruling number',
            'The importer’s classification of your description',
          ],
          [
            '34A Gross weight',
            'Gross shipping weight in kilograms for each line',
            'The packing list',
          ],
          [
            '35 Net quantity in HTS units',
            'Net quantity in the unit of measure the HTS line specifies',
            'Quantities on the invoice and packing list',
          ],
          [
            '36A Entered value',
            'US dollar value as defined in 19 U.S.C. 1401a, rounded to whole dollars',
            'Prices and currency on the invoice',
          ],
          [
            '36B Charges',
            'Freight, insurance and other costs from the port of export to the first US port',
            'Charges itemised on the invoice or freight bill',
          ],
          [
            '36C Relationship',
            'Whether buyer and seller are related under 19 CFR 152.102(g)',
            'The importer’s knowledge of the parties',
          ],
        ],
      },
    },
    {
      heading: 'What do the duty and fee blocks show?',
      paragraphs: [
        'Column 37 records the rate for each line as designated in the HTS, whether free, ad valorem, specific or compound, together with any antidumping or countervailing duty rate. Column 38 records the estimated duty, tax and fees calculated by applying the rate to the dutiable value or quantity. Blocks 41 to 44 total the duty, tax, other fees and the overall amount.',
        'The other fees include charges such as the merchandise processing fee and the harbor maintenance fee, which the instructions say are reported with their collection codes. The instructions also note that goods originating under a free trade agreement may be exempt from the merchandise processing fee when the right special program indicator is shown. Rates and fee amounts change, so read them from the current HTS and CBP notices, never from an old entry.',
        'Block 40 is the importer’s declaration that the prices in the invoices are true and that the documents fully disclose prices, values, quantities, rebates, commissions and royalties. That sentence is why invoice accuracy matters to your buyer: they are declaring your figures to be true.',
      ],
    },
    {
      heading: 'What happens if a document is missing at filing?',
      paragraphs: [
        'Block 18 records documents that are not available when the summary is filed, using CBP’s codes; the instructions list the commercial invoice, a corrected commercial invoice and the packing list among them. A missing invoice therefore does not stop the filing, but it is flagged and has to follow.',
        'The simpler path is to send a complete commercial invoice and packing list with the goods and by email to the buyer’s broker before arrival. Under 19 CFR 141.86(e), the invoice must also show in adequate detail what is in each package, which a packing list numbered to match makes easy to check.',
      ],
    },
    {
      heading: 'How can an exporter make the importer’s 7501 easier?',
      paragraphs: [
        'Give the broker everything the blocks above need, in the same words on every document. Concretely, it helps to send the following with each shipment.',
      ],
      steps: [
        'A full description for each line: what the goods are, what they are made of and what they are used for, not a part number alone.',
        'The country of origin for each line, especially where lines come from different countries.',
        'Quantities in the units the buyer asks for, with net and gross weights on the packing list.',
        'Unit prices and totals in the currency of sale, with freight, insurance and other charges itemised separately.',
        'The Incoterms® 2020 rule and named place, so the broker can see which costs are in the price.',
        'Your full legal name and address as seller, matching every other document, because the manufacturer ID is built from it.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is CBP Form 7501 the same as CBP Form 3461?',
      a: 'No. Under 19 CFR 142.3, Form 3461 or its electronic equivalent is part of the entry, which secures release of the goods. Form 7501 is the entry summary, which CBP uses to assess duty and collect statistics.',
    },
    {
      q: 'How long after entry is Form 7501 due?',
      a: 'Under 19 CFR 142.12, entry summary documentation not filed at the time of entry must be filed, with estimated duties attached, within 10 working days after the time of entry.',
    },
    {
      q: 'Does the exporter sign Form 7501?',
      a: 'No. The declaration in block 40 is made by the importer of record or its authorised agent, and block 45 carries the declarant’s name and signature. The exporter supplies the invoice the declaration relies on.',
    },
    {
      q: 'Where does the HTS number on Form 7501 come from?',
      a: 'From the importer’s classification of the goods under the HTS, based on the description you provide. CBP’s instructions require the full 10-digit number for each line, and a binding ruling number where one covers the goods.',
    },
    {
      q: 'Can I get a copy of the 7501 for my shipment?',
      a: 'Ask the importer or their broker. The entry summary is their filing, so access depends on them; as the seller you see it only if they share it.',
    },
  ],
  sources: [
    'a3-cbp-form-7501',
    'a3-cbp-form-7501-page',
    'a3-ecfr-19-cfr-141-0a',
    'a3-ecfr-19-cfr-142-3',
    'a3-ecfr-19-cfr-142-11',
    'a3-ecfr-19-cfr-142-12',
    'us-cbp-invoice-contents',
    'w4-cbp-importer-tips',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: [
    '/tools/invoice-generator',
    '/tools/packing-list-generator',
    '/tools/landed-cost-calculator',
  ],
  callout: {
    afterSection: 3,
    tool: '/tools/invoice-generator',
    title: 'Fill the blocks before the broker asks',
    text: 'The commercial invoice generator has fields for origin, full descriptions, quantities, unit prices, currency and itemised charges, the facts the broker copies into Form 7501.',
  },
  related: [
    '/blog/commercial-invoice-requirements',
    '/blog/how-to-calculate-import-duty',
    '/blog/how-long-does-customs-clearance-take',
    '/blog/brokerage-fees-and-duties-on-courier-shipments',
    '/guides/landed-cost',
  ],
  cover: {
    id: '8DEDp6S93Po',
    src: 'https://images.unsplash.com/photo-1554224155-cfa08c2a758f',
    width: 4965,
    height: 3490,
    alt: 'Printed government forms and a pen on a dark desk, ready to be filled in line by line',
    caption: 'Paper forms, a pen and a coffee mug on a dark desk',
    photographer: { name: 'Kelly Sikkema', profile: 'https://unsplash.com/@kellysikkema' },
    page: 'https://unsplash.com/photos/tax-forms-and-coffee-on-desk-8DEDp6S93Po',
  },
};

export default article;
