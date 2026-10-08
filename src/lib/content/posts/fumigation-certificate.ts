import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-09';

/**
 * Demand (DataForSEO, Google US, 2026-10-07 file 04): "fumigation certificate" 110.
 * Plan: docs/research/content-plan-v4-2026-10-08.md, group 3, wave E.
 */
const article: ContentArticle = {
  slug: 'fumigation-certificate',
  title: 'Fumigation certificate: who issues it and how it differs from ISPM 15',
  metaTitle: 'Fumigation certificate: who issues it',
  description:
    'What a fumigation certificate records, who issues it, and how it differs from the ISPM 15 mark on wood packaging and the treatment section of a phytosanitary certificate.',
  lede: 'A buyer or forwarder asks for a fumigation certificate, and three different things can be meant: a treatment record from a fumigation company, the treatment section of a phytosanitary certificate, or the ISPM 15 mark on a pallet. They come from different people and prove different things. This post separates them, shows what each one records and points to who issues it.',
  answer:
    'A fumigation certificate is the record a fumigation provider issues after treating a consignment with a gas such as methyl bromide or phosphine, showing the fumigant, dose, temperature, exposure time and date. Under ISPM 43, the provider is authorized by the national plant protection organization. It is separate from the ISPM 15 mark and the phytosanitary certificate.',
  keyFacts: [
    'ISPM 43, adopted by the IPPC in 2019, sets requirements for fumigation as a phytosanitary measure, meaning treatment with chemicals that reach the commodity as a gas.',
    'Under ISPM 43, the national plant protection organization of the country where fumigation takes place authorizes treatment providers and keeps a list of them.',
    'ISPM 43 expects treatment providers to keep records of each fumigation, including fumigant, dosage, concentration readings and lowest temperature, for at least one year.',
    'ISPM 12 gives the phytosanitary certificate a treatment section for the date, treatment, chemical, duration and temperature, and concentration.',
    'UK guidance on ISPM 15 says the mark on treated wood packaging replaces the need for a separate certificate for that packaging.',
  ],
  definitions: [
    {
      term: 'Fumigation',
      meaning:
        'Under ISPM 43, a phytosanitary treatment using chemicals that reach the commodity in a gaseous state, inside an enclosure such as a container or chamber.',
    },
    {
      term: 'NPPO',
      meaning:
        'The national plant protection organization, the government body that runs plant health certification in each country, such as USDA APHIS in the United States.',
    },
    {
      term: 'Treatment provider',
      meaning:
        'The company or official service that carries out the fumigation, authorized by the NPPO of the country where the treatment is done.',
    },
    {
      term: 'Concentration–time product',
      meaning:
        'The measure ISPM 43 uses to judge whether a fumigation achieved its target: gas concentration multiplied by exposure time.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is a fumigation certificate?',
      paragraphs: [
        'It is the document a treatment provider gives you after it has fumigated your goods, stating what was done to which consignment. There is no single international form with that name. ISPM 43, the IPPC standard on fumigation, describes the records a provider should keep for each treatment, and a fumigation certificate is in practice the provider’s statement of those records for one lot.',
        'TradeDocs does not issue fumigation certificates or treatment records. They come from the provider that did the work, under the oversight of the plant health authority in the country of treatment. What you prepare is the commercial paperwork around them: the invoice, the packing list and the marks that tie the treated lot to the shipment.',
      ],
    },
    {
      heading: 'Who issues a fumigation certificate?',
      paragraphs: [
        'The treatment provider. Under ISPM 43, the NPPO of the country where the fumigation is conducted or started is responsible for authorizing treatment providers, which normally covers both the facilities and the people. The NPPO sets requirements for training, procedures, equipment and storage, and should keep a list of authorized providers.',
        'So before you book a fumigation, ask the importer which providers the destination accepts, and check that your provider is on the list kept by your own country’s NPPO. In the United States that is USDA APHIS, which also issues phytosanitary certificates and publishes importing countries’ requirements in its Phytosanitary Export Database.',
      ],
    },
    {
      heading: 'What does a fumigation certificate show?',
      paragraphs: [
        'It shows enough for an inspector to trace the treatment back to a lot. ISPM 43 lists the information a provider’s record for each fumigation may include. A certificate that leaves these out is harder to accept at the border.',
      ],
      list: [
        'The fumigant used and the dosage, with concentration readings and the time of each reading.',
        'The date and duration of the fumigation and the name of the person who did it.',
        'The lowest air and commodity temperature reached during treatment.',
        'The enclosure and treatment provider, and records of leakage testing and equipment calibration.',
        'The commodity, its packaging, the target pest and the fumigation lot number or other identifying marks.',
        'The lot size and volume, including the number of packages, and any deviation from the treatment schedule.',
      ],
    },
    {
      heading: 'How is it different from ISPM 15 and a phytosanitary certificate?',
      paragraphs: [
        'They cover different things and come from different issuers. The ISPM 15 mark is stamped on wood packaging, such as pallets and crates, to show that the packaging was heat treated or fumigated; UK guidance on ISPM 15 says the mark replaces any need for a separate certificate for that packaging. A phytosanitary certificate is issued by the exporting country’s NPPO for regulated plant products and, under ISPM 12, can record a treatment in its section III.',
      ],
      table: {
        caption: 'Three treatment documents compared (ISPM 12, ISPM 15 and ISPM 43)',
        head: ['', 'Fumigation certificate', 'ISPM 15 mark', 'Phytosanitary certificate'],
        rows: [
          [
            'What it covers',
            'A treated consignment or lot',
            'Wood packaging only',
            'Plants and plant products in the consignment',
          ],
          [
            'Who issues it',
            'The authorized treatment provider',
            'A registered producer or treatment provider',
            'The exporting country’s NPPO, such as APHIS',
          ],
          [
            'Form',
            'A provider’s document or certificate',
            'A mark on each piece of packaging',
            'The ISPM 12 model certificate, paper or ePhyto',
          ],
          [
            'Treatment details',
            'Fumigant, dose, readings, temperature, time',
            'The mark only; no dose or readings',
            'Section III: date, treatment, chemical, duration, concentration',
          ],
        ],
      },
    },
    {
      heading: 'When does the treatment go on the phytosanitary certificate?',
      paragraphs: [
        'When the importing country requires the treatment and the NPPO certifies it. ISPM 12 says section III should show only treatments that are acceptable to the importing country and that are performed or initiated in the exporting country under the supervision or authority of the exporting NPPO. Treatments are entered there, not in the additional declaration.',
        'This is why some importers ask for both documents. The provider’s fumigation certificate is the evidence the NPPO and the importer can audit; the phytosanitary certificate is the official statement the importing authority relies on. Which one is needed is set by the importing country, so read its requirements before shipping.',
      ],
    },
    {
      heading: 'How do you get a consignment fumigated for export?',
      paragraphs: [
        'Plan the treatment around the shipping date, because the goods have to stay protected after fumigation. ISPM 43 makes the consignment owner responsible for preventing reinfestation and contamination after treatment.',
      ],
      steps: [
        'Read the importing country’s requirements, or ask the importer, for whether fumigation is required, which fumigant and schedule, and whether it must appear on a phytosanitary certificate.',
        'Book an authorized treatment provider from your NPPO’s list, and give it the commodity, packaging, quantities and container or enclosure details.',
        'Number and mark the packages before treatment, so the lot number on the certificate matches the marks on the packing list.',
        'After treatment, keep the goods in pest-free conditions or pest-proof packaging and dispatch them as soon as practical.',
        'Check the certificate against your invoice and packing list: description, quantity, package count, marks and container number.',
        'If a phytosanitary certificate is needed, apply to your NPPO with the treatment details so section III can be completed.',
      ],
    },
    {
      heading: 'What should match between the certificate and your shipping documents?',
      paragraphs: [
        'The identity of the goods. An inspector compares the fumigation certificate with the invoice, the packing list and the bill of lading. ISPM 43 allows treated lots to be labelled with lot numbers, packing and treatment locations and dates, so that a non-compliant consignment can be traced. Those marks only work if every document carries them the same way.',
        'Use one description of the goods across all documents, give the same number of packages and the same gross weight, and show the container and seal numbers where the treatment was in a container. If you change the packing after treatment, ask the provider whether the treatment still holds before you ship.',
      ],
    },
  ],
  faq: [
    {
      q: 'Does TradeDocs issue fumigation certificates?',
      a: 'No. Fumigation certificates come from the authorized treatment provider that did the work, and phytosanitary certificates come from the exporting country’s plant health authority. TradeDocs prepares the invoice and packing list that sit alongside them.',
    },
    {
      q: 'Is a fumigation certificate needed for heat-treated pallets?',
      a: 'Not for the pallets themselves. Under ISPM 15, the mark on treated wood packaging is the evidence, and UK guidance says it replaces a separate certificate. The goods on the pallet may still need their own treatment.',
    },
    {
      q: 'Which fumigants are used for export fumigation?',
      a: 'ISPM 43 covers chemicals that reach the commodity as a gas and lists common fumigants such as methyl bromide, phosphine and sulphuryl fluoride. The fumigant and schedule are set by the importing country’s requirements.',
    },
    {
      q: 'How long does a treatment provider keep fumigation records?',
      a: 'ISPM 43 says treatment providers should keep appropriate records for each fumigation for at least one year, so treated lots can be traced back and audited by the NPPO.',
    },
    {
      q: 'Can goods be fumigated during the voyage?',
      a: 'ISPM 43 allows for fumigation during transport. In that case the exporting NPPO usually authorizes the provider, and the importing NPPO checks that the schedule was met.',
    },
  ],
  sources: [
    'e3-ippc-ispm-43',
    'e3-ippc-ispm-12',
    'b6-ippc-ispm-15',
    'b6-gov-uk-wpm',
    'd4-aphis-export-certification',
    'd4-ippc-ephyto',
  ],
  primaryTool: '/tools/packing-list-generator',
  tools: ['/tools/packing-list-generator', '/tools/invoice-generator', '/tools/cbm-calculator'],
  callout: {
    afterSection: 3,
    tool: '/tools/packing-list-generator',
    title: 'Number the packages before treatment',
    text: 'The packing list generator numbers each package with its marks, weights and dimensions, so the lot on the fumigation certificate matches what is in the container.',
  },
  related: [
    '/guides/ispm-15-wood-packaging',
    '/guides/phytosanitary-certificate',
    '/blog/export-packing',
    '/blog/shipping-marks',
    '/blog/packing-list-for-shipping',
    '/blog/export-documents-checklist',
  ],
  cover: {
    id: 'd_BHc47AzLQ',
    src: 'https://images.unsplash.com/photo-1774946103680-3d34a461a581',
    width: 3266,
    height: 1837,
    alt: 'Stacked sacks and containers in a dim warehouse, the kind of bagged cargo often fumigated before export',
    caption: 'Stacks of sacks and containers in a warehouse',
    photographer: { name: 'UZ Creative Services', profile: 'https://unsplash.com/@p8lm_k5vq2rx' },
    page: 'https://unsplash.com/photos/stacks-of-sacks-and-containers-in-a-warehouse-d_BHc47AzLQ',
  },
};

export default article;
