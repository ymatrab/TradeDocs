import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-06/07): "straight bill of lading" 720, KD n/a;
 * "telex release" 320; "surrender bill of lading" 70; "negotiable bill of lading" 50.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave B (v2 guide #16).
 * Companion to /guides/what-is-a-bill-of-lading, which covers the document's three jobs.
 * TradeDocs does not issue bills of lading.
 */
const article: ContentArticle = {
  slug: 'types-of-bill-of-lading',
  title: 'Types of bill of lading: straight, order, waybill and more',
  metaTitle: 'Types of bill of lading: straight, order, more',
  description:
    'Straight, order and bearer bills, shipped and received bills, the sea waybill, telex release, and house versus master bills: what each one means for who can collect the goods.',
  lede: 'The carrier’s booking screen asks which kind of transport document you want, and the buyer’s letter of credit may already have decided for you. The types differ on one practical question: who can collect the goods at destination, and what they must hand over to do it.',
  answer:
    'A straight bill of lading consigns the goods to a named consignee and is not negotiable. An order bill consigns them to the order of a party and can be transferred. A sea waybill is never a document of title. Telex release, shipped or received bills, and house or master bills describe how a bill is issued and released.',
  keyFacts: [
    'Under 49 U.S.C. § 80103, a bill stating that goods are to be delivered to the order of a consignee is negotiable, and a straight bill must be marked nonnegotiable.',
    'UCC § 7-104 treats a document of title as negotiable when the goods are to be delivered to bearer or to the order of a named person.',
    'DCSA describes the sea waybill as non-negotiable and not a document of title, with no original needed for cargo release.',
    'Under Article III of the Hague-Visby Rules, once goods are loaded the shipper may demand a “shipped” bill of lading.',
    'The Federal Maritime Commission describes an NVOCC as a carrier that issues its own house bill of lading without operating the vessels.',
  ],
  definitions: [
    {
      term: 'Straight bill of lading',
      meaning:
        'A nonnegotiable bill that consigns the goods to a named consignee, who alone can take delivery.',
    },
    {
      term: 'Order bill of lading',
      meaning:
        'A negotiable bill consigning the goods “to order” or “to the order of” a party, transferable by indorsement and delivery.',
    },
    {
      term: 'Telex release',
      meaning:
        'An electronic message from the carrier that lets the destination office release cargo without the original bill being presented there.',
    },
    {
      term: 'House bill of lading',
      meaning:
        'The bill an NVOCC or consolidator issues to its own customer, while the shipping line issues the master bill to the NVOCC.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is a straight bill of lading?',
      paragraphs: [
        'It is a bill that names the consignee and cannot be transferred. For bills issued by US common carriers, 49 U.S.C. § 80103 calls a bill nonnegotiable when it states that the goods are to be delivered to a consignee, and requires the carrier to mark it “nonnegotiable” or “not negotiable”. Indorsing a straight bill to someone else does not make it negotiable.',
        'DCSA, the container shipping lines’ standards body, adds the practical effect: a straight bill does not transfer title, and the named consignee cannot be changed. Choose it when the buyer has already paid or you are shipping to your own company abroad, and check the carrier’s terms for whether the consignee must still present an original to collect.',
      ],
    },
    {
      heading: 'What is an order bill of lading?',
      paragraphs: [
        'It is a negotiable bill: the goods are consigned to the order of a party, and whoever holds the properly indorsed original can claim them. Under 49 U.S.C. § 80103, a bill is negotiable when it states that the goods are to be delivered to the order of a consignee and carries no agreement on its face that it is not negotiable. Naming a notify party does not limit that.',
        'The International Trade Administration notes that a negotiable, or shipper’s order, bill can be used to buy, sell or trade the goods while they are in transit. DCSA notes that a bill of lading suits trades where a documentary collection or a letter of credit is in place, because the original can be held until the buyer pays.',
      ],
    },
    {
      heading: 'Is there a bearer bill of lading?',
      paragraphs: [
        'In law, yes. UCC § 7-104 says a document of title is negotiable if, by its terms, the goods are to be delivered to bearer or to the order of a named person. A bearer bill names no consignee, so anyone who holds it can claim the goods, so a lost or stolen original puts the cargo at risk. If a buyer requests one, ask why.',
      ],
    },
    {
      heading: 'How do the main types compare?',
      paragraphs: [
        'The table sums up who can take delivery under each document and whether an original has to be produced.',
      ],
      table: {
        caption: 'Types of ocean transport document compared',
        head: ['', 'Straight bill', 'Order bill', 'Sea waybill'],
        rows: [
          ['Consigned to', 'A named consignee', 'The order of a party', 'A named consignee'],
          ['Negotiable', 'No', 'Yes, by indorsement and delivery', 'No'],
          ['Document of title', 'Does not transfer title', 'Yes', 'No'],
          ['Original needed at destination', 'Depends on the carrier’s terms', 'Yes, in most cases', 'No'],
          ['Typical use', 'Prepaid sales, shipments to your own branch', 'Letters of credit, sale in transit', 'Trusted, repeat trade'],
        ],
      },
    },
    {
      heading: 'What is the difference between a shipped and a received bill?',
      paragraphs: [
        'The date the carrier vouches for. Article III of the Hague-Visby Rules, scheduled to the UK’s Carriage of Goods by Sea Act 1971, says that after receiving the goods into its charge, the carrier must issue on demand a bill showing the leading marks, the number of packages or weight, and the apparent order and condition of the goods. Once the goods are loaded, the shipper may demand a “shipped” bill instead, and a received bill can be noted with the ship’s name and shipment date to serve the same purpose.',
        'If you are paid under a letter of credit, read which of the two the credit asks for before the carrier issues the bill. A bill that records the goods’ apparent condition without remarks is what traders call a clean bill.',
      ],
    },
    {
      heading: 'What is a telex release, and is it the same as a sea waybill?',
      paragraphs: [
        'They solve the same problem in different ways. DCSA explains that with original bills of lading, the documents must be couriered to the importer to present when collecting the goods, and names the electronic telex release for original bills and the paperless sea waybill as the alternatives in use today.',
        'With a telex release, the shipment moves under an original bill, but the carrier releases the goods at destination on an electronic message instead of the couriered original; carriers also call this a surrendered bill. A sea waybill is never a document of title in the first place, so there is nothing to surrender. Each carrier sets its own procedure and charges, so ask yours before you choose either.',
      ],
    },
    {
      heading: 'What are house and master bills of lading?',
      paragraphs: [
        'They are two bills for one movement. When you ship through an NVOCC or a consolidator, the FMC describes the NVOCC as a common carrier that issues its own house bill of lading and, in its relationship with the shipping line, is itself the shipper. The shipping line issues its bill, often called the master bill, to the NVOCC; your buyer receives the house bill.',
        'Customs data follows the lowest level. For US imports by sea, 19 CFR 149.3 asks for Importer Security Filing data at the house bill of lading level where there is one. Make sure the house bill your buyer receives matches your commercial invoice and packing list.',
      ],
    },
  ],
  faq: [
    {
      q: 'Can a straight bill of lading be endorsed to another buyer?',
      a: 'No. Under 49 U.S.C. § 80103, indorsing a nonnegotiable bill does not make it negotiable, and DCSA notes that the named consignee on a straight bill cannot be changed.',
    },
    {
      q: 'What does “to order of shipper” mean?',
      a: 'The goods are consigned to the order of the shipper, which makes the bill negotiable. The shipper indorses it, often to a bank or the buyer, to pass the right to take delivery.',
    },
    {
      q: 'Which type of bill does a letter of credit need?',
      a: 'Whatever the credit itself states. Read its transport document clause before you book, and ask the carrier for exactly that type.',
    },
    {
      q: 'Does TradeDocs issue bills of lading?',
      a: 'No. The carrier or NVOCC issues the bill of lading. TradeDocs prepares the commercial invoice and packing list whose figures the bill should match.',
    },
  ],
  sources: [
    'w4-cornell-49-usc-80103',
    'b5-ucc-7-104',
    'dcsa-sea-waybill',
    'b5-dcsa-ebl',
    'b5-hague-visby-art-3',
    'b5-fmc-oti',
    'b5-usc-46-40102',
    'b5-cfr-19-149-3',
    'trade-gov-export-documents',
  ],
  primaryTool: '/tools/packing-list-generator',
  callout: {
    afterSection: 3,
    tool: '/tools/packing-list-generator',
    title: 'Give the carrier figures that match',
    text: 'The bill of lading is built from your package count, weights and marks. Make the packing list from your invoice lines and send the carrier the same numbers.',
  },
  tools: ['/tools/packing-list-generator', '/tools/invoice-generator', '/tools/incoterms'],
  related: [
    '/guides/what-is-a-bill-of-lading',
    '/guides/export-payment-terms',
    '/guides/shipper-consignee-notify-party',
    '/guides/air-waybill',
    '/blog/shipping-marks',
  ],
  cover: {
    id: 'sFq7vyCSFbM',
    src: 'https://images.unsplash.com/photo-1598194501777-edbff942e501',
    width: 6016,
    height: 4016,
    alt: 'A container ship at the quay of the sea trade port in Matosinhos, Porto, the kind of vessel a bill of lading covers',
    caption: 'A container ship at the port of Matosinhos, Porto',
    photographer: { name: 'Maksym Kaharlytskyi', profile: 'https://unsplash.com/@qwitka' },
    page: 'https://unsplash.com/photos/black-ship-on-sea-under-white-sky-during-daytime-sFq7vyCSFbM',
  },
};

export default article;
