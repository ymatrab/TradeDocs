import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, 2026-10-06): "phytosanitary certificate" US 2,400, KD 7; UK 1,600.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave D, review gate: this guide describes
 * an official certificate TradeDocs does not issue, and stays noindex until a review record
 * exists (rules/seo-content.md). Every rule is from IPPC, GOV.UK (Defra/APHA) or USDA APHIS
 * pages opened 2026-10-08. No fee amounts are given; example parties are invented.
 */
const article: ContentArticle = {
  slug: 'phytosanitary-certificate',
  title: 'Phytosanitary certificate: who issues it and when you need one',
  metaTitle: 'Phytosanitary certificate: who issues it',
  description:
    'What a phytosanitary certificate is, which plant goods need one, who issues it in the UK and US, and how to apply. TradeDocs does not issue phytosanitary certificates.',
  lede: 'Plants, fresh produce, seeds, grain and some wood products often cannot enter another country without a phytosanitary certificate from the exporting country’s plant health authority. It is an official government certificate. TradeDocs does not issue it; it comes from a government plant health authority, and this guide explains who does and how the process works.',
  answer:
    'A phytosanitary certificate is an official document from the exporting country’s plant protection organization confirming that plants or plant products were inspected and meet the importing country’s plant health rules. In England and Wales APHA issues it; in the US, USDA APHIS. TradeDocs does not issue phytosanitary certificates.',
  keyFacts: [
    'USDA APHIS says a phytosanitary certificate shows a product was inspected, is considered free from certain pests and conforms to the importing country’s rules.',
    'GOV.UK says APHA certifies plant exports from England and Wales, SASA from Scotland and DAERA from Northern Ireland, with the Forestry Commission for wood.',
    'GOV.UK says goods must be inspected before a phytosanitary certificate is issued.',
    'The IPPC describes the ePhyto as the electronic equivalent of the paper certificate, produced under ISPM 12 and exchanged through the ePhyto Hub.',
    'APHIS lists importing-country requirements for US exports in its Phytosanitary Export Database (PExD).',
  ],
  definitions: [
    {
      term: 'National plant protection organization (NPPO)',
      meaning:
        'The official body in each country responsible for plant health, which issues phytosanitary certificates for exports; the IPPC’s ePhyto system connects them.',
    },
    {
      term: 'Phytosanitary certificate for re-export',
      meaning:
        'A certificate for foreign-origin plant goods passing through a country to a third destination, issued on the basis of the original certificate, an inspection or both.',
    },
    {
      term: 'ePhyto',
      meaning:
        'An electronic phytosanitary certificate carrying the same information as the paper one, sent directly between plant protection organizations.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is a phytosanitary certificate?',
      paragraphs: [
        'A government certificate about plant health. USDA APHIS describes it as attesting that a plant or plant product has been inspected according to appropriate procedures, is considered free from certain pests and conforms to the importing country’s current phytosanitary regulations.',
        'Only the exporting country’s plant protection organization can issue one. TradeDocs does not issue, file or apply for phytosanitary certificates, and nothing our tools produce can stand in for one. Our role ends at the commercial documents that travel with the same shipment, such as the invoice and packing list.',
      ],
    },
    {
      heading: 'Which goods need a phytosanitary certificate?',
      paragraphs: [
        'Whatever the importing country says. GOV.UK lists the goods that commonly need one when leaving Great Britain: plants, including fruit, vegetables and cut flowers, plant products, seeds, grain, bulbs, potatoes, used agricultural or forestry machinery, and wood and wood products. Some processed products are exempt.',
        'Requirements differ by destination and commodity, so check them first. GOV.UK points exporters to the importing country’s official contact on the IPPC website or to the UK plant health authority. For US exports, APHIS publishes importing-country requirements in its Phytosanitary Export Database (PExD).',
        'Wood packaging such as pallets and crates has its own international standard, ISPM 15, which requires treatment and a mark. Our ISPM 15 guide explains it.',
      ],
    },
    {
      heading: 'Who issues phytosanitary certificates in the UK and US?',
      paragraphs: [
        'The plant health authority for the place the goods leave from. The table lists the bodies named by GOV.UK and APHIS.',
      ],
      table: {
        caption: 'Issuing authorities named on official pages (retrieved 8 October 2026)',
        head: ['Exporting from', 'Issuing authority', 'How you apply'],
        rows: [
          [
            'England and Wales',
            'Animal and Plant Health Agency (APHA)',
            'GOV.UK “Apply for plant export certificates and inspections” service',
          ],
          ['Scotland', 'SASA', 'Contact SASA; a different process applies'],
          [
            'Northern Ireland',
            'DAERA Plant Health Inspection Branch',
            'Contact DAERA; a different process applies',
          ],
          [
            'Great Britain, wood and wood products',
            'Forestry Commission',
            'Timber and wood export certificates service',
          ],
          [
            'United States',
            'USDA APHIS',
            'PCIT, through an authorized certification official',
          ],
        ],
      },
    },
    {
      heading: 'How do you apply for a phytosanitary certificate?',
      paragraphs: [
        'Through the official service, before the goods ship, with time left for inspection. The steps summarise GOV.UK and APHIS guidance; follow your authority’s own instructions.',
      ],
      steps: [
        'Confirm the importing country’s requirements for your exact commodity, through PExD for US exports or the importing country’s IPPC contact.',
        'Register where required: GOV.UK says UK exporters need professional operator registration.',
        'Apply through the official service (APHA’s online service in England and Wales, PCIT in the US) with the consignment details.',
        'Have the goods ready for inspection, sampling or testing as the authority asks.',
        'Receive the certificate on paper or as an ePhyto sent directly to the importing country, and keep its number with your shipping records.',
      ],
    },
    {
      heading: 'What is a phytosanitary certificate for re-export?',
      paragraphs: [
        'A certificate for plant goods that were imported and are being sent on to another country. APHIS says it applies to foreign-origin plants or plant products that entered the US with a valid phytosanitary certificate, and confirms they still meet the destination’s rules and were not exposed to infestation while stored.',
        'GOV.UK says UK inspectors issue one only when they are confident the goods meet the destination’s requirements, a further inspection may be needed, and the original import certificate or certified copies must travel with the goods.',
      ],
    },
    {
      heading: 'How do phytosanitary certificates connect to your other export documents?',
      paragraphs: [
        'They describe the same consignment, so the details should agree. The certificate application asks for the goods, quantities, consignee and destination that also appear on your commercial invoice and packing list. Invented example: Larchmere Bulbs (an invented grower) ships tulip bulbs from Kent to a buyer abroad. It builds the invoice and packing list first, then uses the same quantities and consignee in its APHA application, so the certificate and the shipping documents describe one consignment.',
        'APHA charges fees for certificates and inspections, which GOV.UK publishes on its fees page; check them there before you quote the buyer.',
      ],
    },
  ],
  faq: [
    {
      q: 'Can TradeDocs issue a phytosanitary certificate?',
      a: 'No. Only the exporting country’s plant protection organization, such as APHA or USDA APHIS, can issue one. TradeDocs prepares commercial documents such as invoices and packing lists, not official certificates.',
    },
    {
      q: 'Do I need a phytosanitary certificate for processed food?',
      a: 'Often not. GOV.UK says some processed products are exempt, but requirements depend on the importing country and commodity. Check the destination’s rules before you ship.',
    },
    {
      q: 'What is an ePhyto?',
      a: 'The electronic version of a phytosanitary certificate. The IPPC says it carries the same information as the paper certificate and is exchanged between plant protection organizations through the ePhyto Hub.',
    },
    {
      q: 'Do I need a phytosanitary certificate to send plants from Great Britain to Northern Ireland?',
      a: 'GOV.UK says goods staying in Northern Ireland can move with a Northern Ireland plant health label, while goods not staying there need a phytosanitary certificate. Check the current GOV.UK guidance for your goods.',
    },
  ],
  sources: [
    'd4-aphis-export-certification',
    'd4-gov-uk-export-plants',
    'd4-gov-uk-apply-plant-export-certificates',
    'd4-ippc-ephyto',
    'b6-ippc-ispm-15',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: ['/tools/invoice-generator', '/tools/packing-list-generator'],
  callout: {
    afterSection: 3,
    tool: '/tools/packing-list-generator',
    title: 'Prepare the documents that travel with the certificate',
    text: 'The certificate comes from the plant health authority. The invoice and packing list come from you: build them in our generators and keep the quantities identical to your application.',
  },
  related: [
    '/guides/ispm-15-wood-packaging',
    '/guides/how-to-export-from-the-uk',
    '/guides/how-to-export-from-the-us',
    '/blog/export-documents-checklist',
    '/blog/shipping-to-the-uk-and-eu-documents',
  ],
  cover: {
    id: 'mG3abK1CBOY',
    src: 'https://images.unsplash.com/photo-1629730598431-56b24d711977',
    width: 5184,
    height: 3456,
    alt: 'Rows of yellow and purple flowering plants in a greenhouse, the kind of plant goods that need plant health checks',
    caption: 'Flowering plants growing in a greenhouse',
    photographer: { name: 'Rebecca Niver', profile: 'https://unsplash.com/@raeniver' },
    page: 'https://unsplash.com/photos/yellow-and-purple-flowers-in-greenhouse-mG3abK1CBOY',
  },
};

export default article;
