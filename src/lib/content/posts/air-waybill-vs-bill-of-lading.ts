import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-09';

/**
 * Demand (DataForSEO, Google US, 2026-10-08, file 12): "air waybill vs bill of lading" 20, KD 9;
 * "air waybill of lading" 20; "airway bill bill of lading" 20; "bill of lading and airway bill" 20.
 * Plan: docs/research/content-plan-v4-2026-10-08.md, wave E, group 1.
 * Air side from IATA, the Montreal Convention and 19 CFR 122.48a; sea side from the UCC,
 * 49 U.S.C. 80103, the Hague-Visby Rules, ITA and DCSA. No liability amounts are quoted.
 */
const article: ContentArticle = {
  slug: 'air-waybill-vs-bill-of-lading',
  title: 'Air waybill vs bill of lading: what is the difference?',
  metaTitle: 'Air waybill vs bill of lading: the difference',
  description:
    'An air waybill is a non-negotiable receipt and contract for air cargo; an ocean bill of lading can also be a document of title. How they differ, side by side, and what that means for payment.',
  lede: 'Both documents come from the carrier, both list the shipper, consignee and goods, and both carry a number your buyer will ask for. The difference that matters is what happens at the destination: whether the buyer needs a piece of paper to collect the goods.',
  answer:
    'An air waybill is the contract of carriage and receipt for air cargo; it is not a document of title, so the airline delivers to the named consignee. An ocean bill of lading is also a receipt and contract, and a negotiable one is a document of title that must be presented to collect the goods.',
  keyFacts: [
    'IATA describes the air waybill as the contract of carriage between the shipper and the airline, and its Multilateral e-AWB Agreement (Resolution 672) allows it to be electronic.',
    'Under the Montreal Convention (Article 11), the air waybill is prima facie evidence of the contract, of the acceptance of the cargo and of the conditions of carriage.',
    'Under the Uniform Commercial Code (section 1-201), a bill of lading evidences receipt of goods for shipment, and bills of lading are documents of title.',
    'Under 49 U.S.C. 80103, an order bill of lading is negotiable, and a straight bill is nonnegotiable and must say so.',
    'Under the Hague-Visby Rules (Article III), the sea carrier must on the shipper’s demand issue a bill showing the marks, the number of packages or weight and the apparent condition of the goods.',
  ],
  definitions: [
    {
      term: 'Document of title',
      meaning:
        'A document that stands for the goods, so that whoever holds it, properly endorsed, can claim them from the carrier.',
    },
    {
      term: 'Negotiable bill of lading',
      meaning:
        'An order or bearer bill that can be transferred by endorsement and delivery, passing the right to the goods with it.',
    },
    {
      term: 'Straight bill of lading',
      meaning:
        'A nonnegotiable bill that names one consignee, who collects the goods without the bill being transferred.',
    },
    {
      term: 'Sea waybill',
      meaning:
        'An ocean transport document that, like an air waybill, is a non-negotiable receipt and contract rather than a document of title.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is the difference between an air waybill and a bill of lading?',
      paragraphs: [
        'The mode, and whether the document stands for the goods. An air waybill covers carriage by air and works as a receipt and a contract of carriage. A bill of lading covers carriage by sea and works as a receipt and a contract; when it is issued in negotiable form, it is also a document of title.',
        'That last point decides how the goods are released. The airline delivers to the consignee named on the air waybill once the goods arrive and are cleared. With a negotiable bill of lading, the carrier releases the goods against the original bill, so whoever holds the bill controls the cargo.',
      ],
      table: {
        caption: 'Air waybill and ocean bill of lading compared',
        head: ['', 'Air waybill', 'Bill of lading'],
        rows: [
          ['Mode', 'Air', 'Sea'],
          ['Receipt for the goods', 'Yes', 'Yes'],
          ['Evidence of the contract of carriage', 'Yes', 'Yes'],
          ['Document of title', 'No', 'Yes, when negotiable (order or bearer)'],
          ['Can be transferred by endorsement', 'No', 'Yes, when negotiable'],
          [
            'Who collects the goods',
            'The named consignee',
            'The holder of the original negotiable bill, or the named consignee on a straight bill',
          ],
          [
            'Main rules',
            'Montreal Convention',
            'Hague-Visby Rules or national law, such as 49 U.S.C. 80103 in the US',
          ],
          [
            'Number',
            'IATA standard 11 digits',
            'Set by the issuer; in US trade up to 16 characters starting with a SCAC',
          ],
        ],
      },
    },
    {
      heading: 'What does an air waybill do?',
      paragraphs: [
        'It records the deal with the airline and proves the airline took the cargo. Under the Montreal Convention, the carrier issues an air waybill for cargo, or uses another record of the carriage, and Article 5 says it must show the places of departure and destination and the weight of the consignment. Article 11 makes it prima facie evidence of the contract, of the cargo’s acceptance and of the conditions of carriage.',
        'The Convention describes three original parts: one for the carrier, signed by the consignor; one for the consignee, signed by the consignor and the carrier; and one handed to the consignor once the cargo is accepted. Under IATA’s e-AWB agreement, the paper is replaced by an electronic record.',
      ],
    },
    {
      heading: 'What does a bill of lading do?',
      paragraphs: [
        'Three things: it is the carrier’s receipt, the evidence of the contract, and, in negotiable form, a document of title. The ITA describes it as the contract between the owner of the goods and the carrier. Under the UCC, a bill of lading evidences the receipt of goods for shipment, and the UCC lists bills of lading as documents of title.',
        'Under 49 U.S.C. 80103, an order bill is negotiable and a straight bill is nonnegotiable and must say so on its face. The Hague-Visby Rules let the shipper demand a bill showing the marks, the number of packages or weight and the apparent order and condition of the goods, and a “shipped” bill once they are loaded.',
      ],
    },
    {
      heading: 'Why does document of title matter for payment?',
      paragraphs: [
        'Because it decides whether the seller can hold the goods until it is paid. With a negotiable bill of lading, a seller can send the originals through a bank, and the buyer only gets them, and so the goods, by paying or accepting a bill of exchange. Letters of credit and documentary collections are built on this.',
        'An air waybill cannot do that job, because the airline delivers to the consignee without any original being presented. If you need that control on an air shipment, ask your bank how it handles air consignments, or agree payment terms that do not depend on holding the transport document. Settle this in the sales contract before booking.',
      ],
    },
    {
      heading: 'Is a sea waybill the ocean version of an air waybill?',
      paragraphs: [
        'In function, yes. DCSA describes the sea waybill as a non-negotiable transport document used instead of a bill of lading: it confirms receipt, is not a document of title and needs no original for the cargo to be released. That puts it much closer to an air waybill than to a negotiable bill of lading.',
        'That suits sales paid in advance or on open account, where the seller does not need to hold the goods back: as with air cargo, nothing has to be couriered to the buyer before the goods can be collected.',
      ],
    },
    {
      heading: 'How do you choose which document you need?',
      paragraphs: [
        'You choose the mode, and the mode largely chooses the document. What you can still decide is how the goods are consigned and, by sea, whether you ask for a negotiable bill, a straight bill or a sea waybill. Work it through in this order.',
      ],
      steps: [
        'Pick the mode from cost, weight and time. For air, compare actual and volumetric weight, since IATA’s general rule charges by volume at 6,000 cm³ per kilogram when that is higher.',
        'Read the payment terms. A letter of credit or a documentary collection by sea usually needs a negotiable bill of lading.',
        'Decide who the consignee is. On an air waybill or sea waybill, the named consignee can collect the goods, so name the party who should receive them.',
        'Send the carrier or forwarder shipping instructions taken from your commercial invoice and packing list.',
        'Check the draft document against those documents before you approve it, especially the parties, package count and weights.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is an air waybill a bill of lading?',
      a: 'No. It plays a similar role as a receipt and contract for air cargo, but it is not a document of title and cannot be transferred by endorsement.',
    },
    {
      q: 'Can an air waybill be negotiable?',
      a: 'No. The airline delivers to the consignee named on it, so it cannot transfer the right to the goods the way a negotiable bill of lading does.',
    },
    {
      q: 'Do I need original documents to collect air cargo?',
      a: 'Not as a title document. The consignee arranges collection with the airline or its agent once the goods are cleared, quoting the air waybill number.',
    },
    {
      q: 'Which number does my buyer need for each mode?',
      a: 'For air, the 11-digit air waybill number, plus the house number if a forwarder consolidated the cargo. For sea, the bill of lading number, and the container number for a full load.',
    },
    {
      q: 'Is an express courier waybill the same as an air waybill?',
      a: 'It does the same job for the courier’s own network, but its terms are the courier’s. Read them, since they govern liability and delivery.',
    },
  ],
  sources: [
    'a4-iata-e-awb',
    'a4-montreal-convention',
    'e1-cfr-19-122-48a-awb-number',
    'e1-cfr-19-4-7a',
    'trade-gov-export-documents',
    'w4-cornell-ucc-1-201',
    'w4-cornell-49-usc-80103',
    'b5-hague-visby-art-3',
    'dcsa-sea-waybill',
    'iata-volumetric',
  ],
  primaryTool: '/tools/chargeable-weight',
  tools: ['/tools/chargeable-weight', '/tools/cbm-calculator', '/tools/packing-list-generator'],
  callout: {
    afterSection: 2,
    tool: '/tools/chargeable-weight',
    title: 'Check what the air waybill will charge',
    text: 'Enter each carton’s dimensions and weight to compare actual and volumetric weight before you choose between air and sea.',
  },
  related: [
    '/guides/air-waybill',
    '/guides/what-is-a-bill-of-lading',
    '/blog/air-freight-vs-sea-freight',
    '/blog/how-to-read-an-awb-number',
    '/blog/bill-of-lading-number',
    '/guides/types-of-bill-of-lading',
  ],
  cover: {
    id: 'ImL3sO-DFac',
    src: 'https://images.unsplash.com/photo-1766224241694-ddf3b2a2ed38',
    width: 6843,
    height: 4625,
    alt: 'An aircraft being serviced on the tarmac before departure, where an air waybill’s cargo is loaded',
    caption: 'An aircraft being serviced on the tarmac',
    photographer: { name: 'Annie Spratt', profile: 'https://unsplash.com/@anniespratt' },
    page: 'https://unsplash.com/photos/airplane-being-serviced-on-the-tarmac-ImL3sO-DFac',
  },
};

export default article;
