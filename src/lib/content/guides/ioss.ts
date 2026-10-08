import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, 2026-10-06): "ioss" Google UK 1,000, KD 26; Google US 590, KD 18;
 * "ioss number" UK 1,000.
 * Plan: docs/research/content-plan-v3-2026-10-07.md (v2 #27), wave C. Angle: EU VAT on
 * low-value parcels for non-EU sellers.
 * Every rule is from a European Commission page opened 2026-10-08. No VAT or duty rate is
 * stated for any country or product; the €3 duty is quoted as the Commission announced it.
 */
const article: ContentArticle = {
  slug: 'ioss',
  title: 'IOSS: EU VAT on low-value parcels for non-EU sellers',
  metaTitle: 'IOSS: EU VAT on parcels up to EUR 150',
  description:
    'What the EU Import One-Stop Shop is, which sales it covers, why sellers outside the EU need an intermediary, how the IOSS number and monthly return work, and the 2026 duty change.',
  lede: 'Since July 2021, every commercial parcel entering the EU is subject to VAT, however small. The Import One-Stop Shop lets the seller collect that VAT at checkout instead of at import. This guide explains what the European Commission says about who can use it and what it involves.',
  answer:
    'IOSS, the EU Import One-Stop Shop, is a VAT scheme for distance sales of goods imported into the EU in consignments worth up to EUR 150. The seller charges EU VAT at the point of sale, declares it on one monthly return in a single EU country, and the seller’s IOSS number is given in the parcel’s customs declaration.',
  keyFacts: [
    'The European Commission says the VAT exemption for imported goods below EUR 22 ended on 1 July 2021.',
    'IOSS covers distance sales of goods imported from outside the EU in consignments worth up to EUR 150, and does not apply to goods subject to excise duties.',
    'The Commission says a seller established outside the EU must appoint an EU-established intermediary to use the import scheme.',
    'IOSS returns cover one calendar month and are due, with payment, by the end of the following month.',
    'The Commission announced a temporary €3 customs duty from 1 July 2026 on low-value parcels worth up to €150, charged per item by tariff classification.',
  ],
  definitions: [
    {
      term: 'Distance sale of imported goods',
      meaning:
        'A sale of goods sent from outside the EU to a buyer in the EU who is not a business.',
    },
    {
      term: 'IOSS number',
      meaning:
        'The VAT identification number a seller or its intermediary receives for the import scheme, given in the customs declaration.',
    },
    {
      term: 'Intermediary',
      meaning:
        'An EU-established person appointed to meet the scheme’s VAT obligations for a seller, and liable for them.',
    },
    {
      term: 'Special arrangements',
      meaning:
        'The alternative way to collect VAT on consignments up to EUR 150 when IOSS is not used.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is IOSS?',
      paragraphs: [
        'It is the import scheme of the EU’s VAT One Stop Shop. The European Commission describes it as a way for sellers and electronic interfaces to declare and pay VAT on distance sales of goods imported from outside the EU in consignments worth up to EUR 150, sold to buyers who are not businesses. It was introduced with the EU’s VAT e-commerce rules, which applied from 1 July 2021.',
        'Those rules also ended the old VAT exemption for imported goods below EUR 22 and, according to the Commission, made an import declaration necessary for all goods entering the EU, whatever their value. IOSS is the route that moves VAT collection from the border to the checkout.',
      ],
    },
    {
      heading: 'Which sales does IOSS cover?',
      paragraphs: [
        'Business-to-consumer sales of goods shipped from outside the EU, in consignments worth up to EUR 150. The Commission says the import scheme does not apply to goods subject to excise duties, which cannot be declared under it. Consignments above EUR 150, and sales to EU businesses, go through the standard import procedure, where the importer declares the goods and pays import VAT and any duty.',
        'IOSS is optional. For consignments up to EUR 150 where it is not used, the Commission names the special arrangements as the other way VAT is collected. Check with your carrier how they handle VAT on parcels that arrive without an IOSS number.',
      ],
    },
    {
      heading: 'Who can register for IOSS?',
      paragraphs: [
        'Sellers inside and outside the EU, but on different terms. The Commission says a taxable person established in the EU can use the import scheme directly, and may appoint an intermediary if it wants to. A taxable person established outside the EU is required to appoint an intermediary, who must be established in the EU and is liable for the scheme’s VAT obligations on the seller’s behalf. Member States may add national rules, such as a guarantee.',
        'A seller can register in only one Member State to use a special scheme. An intermediary registers first in its own Member State of identification, then receives a separate IOSS number for each seller it represents.',
      ],
    },
    {
      heading: 'How does IOSS work for one parcel?',
      paragraphs: [
        'The VAT is charged once, at the sale, and the IOSS number carries that fact through customs. The Commission’s guidance on low-value consignments says the IOSS number provided in the customs declaration is checked electronically.',
      ],
      steps: [
        'Register for IOSS in one EU country, through an EU intermediary if your business is outside the EU.',
        'At checkout, charge EU VAT to the buyer on consignments worth up to EUR 150.',
        'Give your IOSS number to the carrier or customs representative who declares the parcel, so it appears in the import declaration.',
        'Ship the parcel with a commercial invoice or customs declaration that describes the goods and shows the value.',
        'Declare the month’s IOSS sales on one return, in euro unless your Member State of identification requires its own currency, and pay by the end of the following month.',
        'Keep the records of each sale.',
      ],
    },
    {
      heading: 'What are the IOSS return and record rules?',
      paragraphs: [
        'Returns are monthly. The Commission says the import scheme’s tax period is one calendar month, and the return and its payment are due by the end of the month following that period; the deadline does not move for weekends or holidays, and a return cannot be filed before the period ends. If you made no sales in a month, a nil return is still required.',
        'For records, the Commission’s OSS record-keeping page says scheme records must be kept for 10 years from the end of the year in which the transaction was made. It also says that under the import scheme there is generally no obligation to issue an invoice; if you do issue one, the rules of your Member State of identification apply.',
      ],
    },
    {
      heading: 'What changed for low-value parcels in July 2026?',
      paragraphs: [
        'A customs duty now applies alongside VAT. In a news item of 29 June 2026, the European Commission announced a temporary €3 customs duty from 1 July 2026 on low-value parcels worth up to €150 imported from outside the EU. It is charged per item by tariff classification, so several items under one classification count once, and the seller or importer declares and pays it as part of the customs process.',
        'The duty does not replace IOSS, which still handles the VAT. It does mean a parcel’s landed cost now includes a duty element even below €150, so price it in when you quote EU consumers. Check the Commission’s current guidance before relying on any figure, as these rules are new.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is IOSS mandatory for sellers outside the EU?',
      a: 'No. The Commission presents IOSS as one option for consignments up to EUR 150; without it, VAT is collected at import through the special arrangements or the standard procedure.',
    },
    {
      q: 'Can a UK or US business use IOSS without an EU company?',
      a: 'It needs an intermediary established in the EU. The Commission says sellers established outside the EU are required to appoint one to use the import scheme.',
    },
    {
      q: 'Does IOSS apply to sales to EU businesses?',
      a: 'No. The scheme covers distance sales to buyers who are not taxable persons. Business buyers import under the standard procedure.',
    },
    {
      q: 'Does IOSS cover alcohol or tobacco?',
      a: 'No. The Commission says the import scheme does not apply to goods subject to excise duties.',
    },
    {
      q: 'Is the €3 duty paid through the IOSS return?',
      a: 'The Commission says the seller or importer declares and pays it as part of the customs process. Ask your carrier or customs representative how they collect it.',
    },
  ],
  sources: [
    'c4-ec-oss-schemes',
    'c4-ec-low-value-consignments',
    'c4-ec-lvc-guidance',
    'c4-ec-oss-declare-and-pay',
    'c4-ec-oss-records',
    'c4-ec-eur3-duty-low-value-parcels',
  ],
  primaryTool: '/tools/landed-cost-calculator',
  callout: {
    afterSection: 3,
    tool: '/tools/landed-cost-calculator',
    title: 'Price EU parcels with VAT and duty included',
    text: 'The landed cost calculator adds freight, insurance, duty and VAT rates you enter to the goods value, so your EU checkout price covers what IOSS and the new duty add.',
  },
  tools: ['/tools/landed-cost-calculator', '/tools/invoice-generator', '/tools/incoterms'],
  related: [
    '/blog/shipping-to-the-uk-and-eu-documents',
    '/guides/landed-cost',
    '/blog/taric-and-cn-codes',
    '/blog/brokerage-fees-and-duties-on-courier-shipments',
    '/blog/ddp-vs-ddu',
    '/guides/eori-number',
  ],
  cover: {
    id: 'qVpGF1mlaM8',
    src: 'https://images.unsplash.com/photo-1684695747561-9372850cf165',
    width: 7149,
    height: 4768,
    alt: 'A long parcel conveyor belt running through a large distribution warehouse',
    caption: 'Parcels move along a conveyor in a distribution warehouse',
    photographer: { name: 'Alberto Rodríguez', profile: 'https://unsplash.com/@albertorodriguez' },
    page: 'https://unsplash.com/photos/a-conveyor-belt-in-a-large-warehouse-qVpGF1mlaM8',
  },
};

export default article;
