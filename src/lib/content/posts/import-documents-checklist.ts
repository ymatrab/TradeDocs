import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-09';

/**
 * Demand (DataForSEO, Google, 2026-10-08): "import documents" CA 20, AU 10; plan volume 140.
 * Plan: docs/research/content-plan-v4-2026-10-08.md, wave E, group 2 (checklist; the importer’s
 * side of the export documents checklist, no country duty rules).
 */
const article: ContentArticle = {
  slug: 'import-documents-checklist',
  title: 'Import documents checklist: what the buyer needs to clear the goods',
  metaTitle: 'Import documents checklist for importers',
  description:
    'The documents an import shipment needs, who supplies each one, what US and UK customs ask for at entry, and what to check on the seller’s paperwork before the goods arrive.',
  lede: 'The export documents checklist is written for the seller. This one is for the other side of the sale: the importer who has to get the goods through customs. Most of the paperwork still starts with the seller, but the importer is the one customs holds responsible, so it pays to know what should arrive, and when.',
  answer:
    'An import usually needs the seller’s commercial invoice and packing list, the transport document (a bill of lading or air waybill), the carrier’s arrival notice, the import declaration made by the importer or its customs broker, and any licence or permit the goods require. US and UK customs add their own registration and filing steps.',
  keyFacts: [
    'Under 19 CFR 142.3, a US entry is filed with CBP Form 3461 or its electronic equivalent, a commercial invoice and, where appropriate, a packing list.',
    'CBP says an importer who uses a licensed customs broker remains responsible for the accuracy of the entry documents and for paying duties, taxes and fees.',
    'Under 19 CFR 149.2, the Importer Security Filing for US-bound vessel cargo is due 24 hours before the goods are laden at the foreign port.',
    'GOV.UK’s import steps start with an EORI number and end with keeping invoices, customs paperwork and the C79 import VAT certificate.',
    'Some goods need a licence, permit or certificate from an agency other than customs before they can be imported, in both the US and the UK.',
  ],
  definitions: [
    {
      term: 'Import declaration',
      meaning:
        'The importer’s or broker’s filing with customs describing the goods, their value and origin so they can be released.',
    },
    {
      term: 'Arrival notice',
      meaning:
        'The carrier’s or forwarder’s notice that a shipment is arriving or has arrived, with the charges due before release.',
    },
    {
      term: 'Customs broker',
      meaning:
        'A licensed agent who prepares and files import declarations for importers; in the UK usually called a customs agent.',
    },
    {
      term: 'EORI number',
      meaning:
        'The registration number, starting with GB, that a business needs to bring goods into Great Britain.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'Which documents does an import shipment need?',
      paragraphs: [
        'Five kinds of document come together at import: the seller’s commercial papers, the carrier’s papers, the importer’s own filing, any permits for controlled goods, and the importer’s records afterwards. The table lists them with the party that normally supplies each one.',
      ],
      table: {
        caption: 'Import documents, who supplies them and what they are for',
        head: ['Document', 'Supplied by', 'Used for'],
        rows: [
          [
            'Commercial invoice',
            'Seller',
            'Value, description and origin of the goods for the declaration',
          ],
          [
            'Packing list',
            'Seller',
            'Package count, weights and contents for release and inspection',
          ],
          [
            'Bill of lading or air waybill',
            'Carrier or forwarder',
            'Proof of the carriage contract and, for some bills, the right to collect',
          ],
          [
            'Arrival notice',
            'Carrier or forwarder',
            'Arrival date, location and charges due before release',
          ],
          [
            'Import declaration (US entry)',
            'Importer or customs broker',
            'Declaring the goods and paying duties and taxes',
          ],
          [
            'Licences, permits, health certificates',
            'Importer, seller or an agency',
            'Goods that another authority controls',
          ],
          [
            'Proof of origin, if claiming a preference',
            'Seller, as the agreement requires',
            'A reduced rate under a trade agreement',
          ],
          [
            'Import VAT or duty records',
            'Customs or the broker',
            'The importer’s accounts and any reclaim',
          ],
        ],
      },
    },
    {
      heading: 'Which import documents come from the seller?',
      paragraphs: [
        'The commercial invoice and the packing list. They are the source of almost everything customs reads, so the importer’s first job is to make sure the seller sends complete ones before the goods arrive.',
        'The invoice should show who sold the goods to whom, what they are in plain words, how many, the price and currency, the Incoterms® rule and the country of origin. The packing list should agree with it on the package count, weights and marks. If you asked for a proforma invoice to arrange payment or an import licence, the final commercial invoice should match it or explain the difference.',
        'Under the C and D Incoterms® rules the seller books the carriage and passes the transport document on to you. If you are claiming a lower duty rate under a trade agreement, the seller may also need to provide a statement of origin; TradeDocs does not prepare that document, and the agreement itself sets the wording.',
      ],
    },
    {
      heading: 'Which documents does the importer provide or file?',
      paragraphs: [
        'The import declaration is the importer’s filing, even when a broker makes it. In the US, CBP points out that you can hire a licensed customs broker or file the entry yourself, and that either way you remain responsible for the accuracy of the entry documents and for paying the duties, taxes and fees. Your importer number is your IRS business number, or a number CBP assigns.',
        'In the UK, the GOV.UK import steps start with an EORI number beginning with GB for goods entering Great Britain, then finding the commodity code, working out duty and VAT from the customs value, checking for licences and making the customs declaration yourself or through an agent.',
        'Add any permit or certificate the goods need. GOV.UK lists goods such as animal products, plants, certain foods, medicines and chemicals, and CBP notes that other agencies may require permits or certifications. Have them in place before the goods arrive.',
      ],
    },
    {
      heading: 'What does US customs ask for at entry?',
      paragraphs: [
        'Under 19 CFR 142.3, an entry is filed with CBP Form 3461 or its electronic equivalent, evidence of the right to make entry, the commercial invoice (or a pro forma invoice where the rules allow it), a packing list where appropriate, any document another agency requires, and the name, address and identification number of the US buyer or consignee.',
        'Ocean shipments add a step before the goods even sail. Under 19 CFR 149.2 the Importer Security Filing is the importer’s responsibility and is due 24 hours before the cargo is laden on the vessel at the foreign port. Ask your broker for its own cut-off, and ask the seller for the shipping details in time to meet it.',
      ],
    },
    {
      heading: 'In what order do the import documents come together?',
      paragraphs: [
        'They arrive in roughly the order the goods move. Working through them in sequence keeps a shipment from waiting at the port for one missing paper.',
      ],
      steps: [
        'Before you order: check whether the goods need a licence or permit, and confirm your registration (an importer number in the US, an EORI number in the UK).',
        'When you agree the sale: get a proforma invoice with the price, Incoterms® rule and named place, and decide who will act as your customs broker or agent.',
        'Before loading by sea to the US: give your broker the data for the Importer Security Filing.',
        'At shipment: receive the commercial invoice, packing list and transport document from the seller or forwarder, and send copies to your broker.',
        'When the carrier sends the arrival notice: check the charges due and the free time allowed before storage charges start.',
        'At clearance: the broker files the declaration, you pay the duties and taxes, and customs releases the goods or selects them for examination.',
        'After release: file the invoices, declarations and payment records. In the UK, GOV.UK lists the C79 import VAT certificate among the records to keep.',
      ],
    },
    {
      heading: 'What should you check on the seller’s documents before arrival?',
      paragraphs: [
        'Check them as soon as they arrive, while the goods are still at sea or in the air. A mistake found at the port costs storage; a mistake found a week earlier costs an email. Compare the invoice, the packing list and the transport document on these points:',
      ],
      list: [
        'Seller, buyer and consignee names and addresses are the same on every document.',
        'The goods description is specific enough to classify, not a trade name or a code alone.',
        'Quantities, package counts and gross weights agree between the invoice, packing list and bill of lading or air waybill.',
        'The price, currency and Incoterms® rule match what you agreed, with freight and insurance shown as separate lines where they are included.',
        'The country of origin is stated for each line.',
        'Shipping marks on the packing list match the marks on the packages.',
      ],
    },
  ],
  faq: [
    {
      q: 'Can I clear goods through customs without a broker?',
      a: 'In the US, CBP says you can file the entry yourself instead of using a licensed broker. In the UK, GOV.UK says you can make the declaration yourself or appoint an agent. GOV.UK adds that most businesses use a transporter or customs agent.',
    },
    {
      q: 'Is a pro forma invoice enough to clear goods?',
      a: 'Sometimes, but not by default. Under 19 CFR 142.3, US customs accepts a pro forma invoice only in the cases its rules allow. Ask the seller for a final commercial invoice before the goods arrive.',
    },
    {
      q: 'Who pays the import duties?',
      a: 'Usually the importer. Under every Incoterms® 2020 rule except DDP the buyer clears the goods for import and pays the duties and taxes; under DDP the seller does.',
    },
    {
      q: 'What happens if the import documents do not match?',
      a: 'Customs or the broker may hold the goods until the differences are explained or corrected, and storage charges can build up meanwhile. Ask the seller for corrected documents rather than editing them yourself.',
    },
    {
      q: 'How long should an importer keep import documents?',
      a: 'For as long as the importing country’s record-keeping rules require. Check them with customs or your broker, and keep the invoice, declaration and payment records together for each shipment.',
    },
  ],
  sources: [
    'e2-cfr-19-142-3',
    'e2-cbp-importer-tips',
    'e2-cfr-19-149-2',
    'e2-gov-uk-import-goods',
    'e2-trade-gov-proforma-invoice',
    'e2-hmrc-incoterms',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: [
    '/tools/invoice-generator',
    '/tools/landed-cost-calculator',
    '/tools/packing-list-generator',
    '/tools/proforma-invoice-generator',
  ],
  callout: {
    afterSection: 1,
    tool: '/tools/landed-cost-calculator',
    title: 'Know the landed cost before the goods arrive',
    text: 'Add the goods, freight, insurance and the duty and tax rates you have checked in the official tariff, and the landed cost calculator shows the total and the cost per unit.',
  },
  related: [
    '/blog/export-documents-checklist',
    '/guides/how-to-import-into-the-us',
    '/blog/importing-from-china-documents',
    '/blog/what-is-customs-clearance',
    '/guides/importer-of-record',
    '/blog/commercial-invoice-and-packing-list-must-match',
  ],
  cover: {
    id: '_m2ZA9J_Ik8',
    src: 'https://images.unsplash.com/photo-1707848303274-51d4bf4f15de',
    width: 3000,
    height: 2001,
    alt: 'Two workers standing beside a green shipping container, where imported goods are checked against their documents',
    caption: 'Two men next to a green shipping container',
    photographer: { name: 'Phil Hearing', profile: 'https://unsplash.com/@philhearing' },
    page: 'https://unsplash.com/photos/a-couple-of-men-standing-next-to-a-green-container-_m2ZA9J_Ik8',
  },
};

export default article;
