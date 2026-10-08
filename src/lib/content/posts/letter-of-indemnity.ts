import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "letter of indemnity" 2,400 (mixed meanings; the
 * live SERP on 2026-10-08 mixes general, banking and shipping senses, so this post owns the
 * shipping sense only).
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave C.
 */
const article: ContentArticle = {
  slug: 'letter-of-indemnity',
  title: 'Letter of indemnity in shipping: what it is and when it is used',
  metaTitle: 'Letter of indemnity in shipping: when it is used',
  description:
    'Why carriers ask for a letter of indemnity to release cargo without the original bill of lading or change the discharge port, what it covers, and where it stops protecting anyone.',
  lede: 'A letter of indemnity, or LOI, is the document that appears when a shipment cannot follow the normal rules: the original bills of lading are still in a courier bag, the buyer wants the cargo at a different port, or someone wants a clean bill for goods that are not clean. This post explains each case and the limits of the promise.',
  answer:
    'In shipping, a letter of indemnity is a written promise to compensate the carrier for any loss if it departs from normal practice at the requester’s request, most often delivering cargo without the original bill of lading or at a different port. It shifts risk to the party signing it but does not make the departure lawful.',
  keyFacts: [
    'The UK P&I Club names delivery without production of the bill of lading as the most common reason for a letter of indemnity.',
    'The UK P&I Club states that liabilities from mis-delivery are not covered by P&I insurance and that an LOI does not restore that cover.',
    'Under UCC § 7-403, a person claiming goods under a negotiable document of title must surrender it to the carrier.',
    'The P&I Clubs recommend standard forms of letter of indemnity, and the UK P&I Club suggests a bank countersignature.',
    'An indemnity given for a clean bill of lading that misstated the goods’ condition was held unenforceable in Brown Jenkinson v Percy Dalton (1957).',
  ],
  definitions: [
    {
      term: 'Letter of indemnity (LOI)',
      meaning:
        'A written promise by one party to compensate another for loss caused by doing something at its request.',
    },
    {
      term: 'Original bill of lading',
      meaning:
        'The signed bill the carrier issues, which for a negotiable bill must be surrendered to collect the goods.',
    },
    {
      term: 'Clean bill of lading',
      meaning:
        'A bill with no notation that the goods or packaging were in a defective condition when loaded.',
    },
    {
      term: 'P&I Club',
      meaning:
        'A mutual insurer that covers shipowners’ liabilities to third parties, including cargo claims.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is a letter of indemnity in shipping?',
      paragraphs: [
        'It is a promise to cover the carrier’s loss if the carrier does what you ask instead of what the bill of lading says. The party asking, usually the receiver, the charterer or the shipper, signs it, and the carrier relies on it if a third party later brings a claim.',
        'The UK P&I Club, one of the mutual insurers in the International Group of P&I Clubs, describes three requests that lead to an LOI: delivery of cargo without production of a bill of lading, delivery at a port other than the one shown on the bill, and the issue of clean bills when the carrier knows they ought to be claused. The first is the most common by far.',
        'The term also has general meanings in banking and insurance. This post covers the shipping sense only.',
      ],
      table: {
        caption: 'The three shipping situations that lead to a letter of indemnity',
        head: ['Request', 'What the carrier is asked to do', 'Where the risk lies'],
        rows: [
          [
            'Delivery without the original bill',
            'Release the cargo to a named receiver before the bills arrive',
            'A holder of the original bill may claim the goods later',
          ],
          [
            'Change of discharge port',
            'Deliver at a port other than the one on the bill',
            'The bill holder expects the goods at the named port',
          ],
          [
            'Clean bill for claused goods',
            'Leave defects off the bill of lading',
            'Buyers and banks are misled; the indemnity may be unenforceable',
          ],
        ],
      },
    },
    {
      heading: 'Why can’t the carrier just release the cargo?',
      paragraphs: [
        'Because a negotiable bill of lading is a document of title, and the carrier’s duty is to deliver to whoever holds it. The Uniform Commercial Code defines a bill of lading as a document of title, and § 7-403 requires a person claiming goods under a negotiable document to surrender it. A carrier that hands the goods to someone else can be liable to the person who turns up with the bill.',
        'The UK P&I Club adds that the carrier may face liability in tort for conversion of the goods, and that such claims can exceed the value of the cargo. That is why a carrier asks for an LOI rather than simply taking the receiver’s word.',
        'The request arises when the ship arrives before the original bills have travelled from the shipper through the banks to the buyer. The Digital Container Shipping Association notes that original bills are still couriered to the importer to present when collecting the goods.',
      ],
    },
    {
      heading: 'What does a letter of indemnity usually contain?',
      paragraphs: [
        'It identifies the shipment, states the request and sets out the promise. In practice that means the ship and voyage, the bill of lading numbers and date, the cargo description and quantity as on the bill, the party to receive delivery or the new port, and the undertaking to indemnify the carrier against claims and costs that follow.',
        'The P&I Clubs recommend standard wordings for each situation, and carriers commonly ask for one of them rather than a home-made letter. Because a promise is only as good as the person making it, the UK P&I Club suggests that the indemnity be countersigned by a bank.',
        'Copy the cargo description exactly from the bill of lading. Packages, marks and weights on the LOI, the bill, the commercial invoice and the packing list should all agree, because a mismatch is the first thing anyone checks when a claim arrives.',
      ],
    },
    {
      heading: 'Is a letter of indemnity for a clean bill of lading legal?',
      paragraphs: [
        'It is the risky one, and in the leading English case it was unenforceable. Under the Hague-Visby Rules, as enacted in the UK, the carrier must on the shipper’s demand issue a bill showing the apparent order and condition of the goods. Buyers and banks rely on that statement: under the ICC’s UCP 600, banks examine documents only, not goods.',
        'If a shipper asks for a clean bill for damaged or short cargo and offers an LOI in return, both sides are misrepresenting the goods to whoever buys the bill. In Brown Jenkinson v Percy Dalton (1957), as the UK P&I Club summarises it, the court found the owner was deliberately misrepresenting the goods’ condition and held the indemnity unenforceable because it was given for an illegal act.',
        'If a carrier wants to clause the bill, resolve the problem with the goods or the packing instead.',
      ],
    },
    {
      heading: 'Does a letter of indemnity fully protect the carrier?',
      paragraphs: [
        'No. It moves the loss to the signer, but the carrier still faces the claim first. The UK P&I Club states that liabilities from mis-delivery are not covered by P&I insurance and that obtaining an LOI does not restore that cover. If the party who signed has no money or no longer exists, the carrier carries the loss alone.',
        'For the party signing, the promise can be open-ended. The claim it covers may be for the full value of the cargo or more, and it may arrive long after the delivery. Read the wording before you sign, and take advice on it.',
      ],
    },
    {
      heading: 'How can a shipper avoid needing one?',
      paragraphs: [
        'Plan the transport document around how the goods will be paid for. Most LOI requests start with documents that cannot reach the buyer in time.',
      ],
      steps: [
        'If the buyer pays in advance or on open account and nothing needs to be sold in transit, ask for a sea waybill. DCSA describes it as non-negotiable and not a document of title, and no original is needed to release the cargo.',
        'If an original bill is needed, ask the carrier or forwarder about a telex release, which DCSA lists as a current alternative to couriering originals.',
        'Where a letter of credit requires original bills, allow for courier and bank checking time in the shipment date and the credit’s expiry.',
        'Prepare the commercial invoice and packing list from the same lines, so the bill of lading description matches them.',
        'If the buyer later asks the carrier for delivery against an LOI, make sure your own payment is secured before the cargo is released.',
      ],
    },
  ],
  faq: [
    {
      q: 'Who gives a letter of indemnity?',
      a: 'The party asking the carrier to depart from the bill of lading: usually the receiver or charterer for delivery without the original bill or at another port. Carriers often ask for a bank to countersign so that the promise has a solvent party behind it.',
    },
    {
      q: 'Is a letter of indemnity the same as a letter of credit?',
      a: 'No. A letter of credit is a bank’s undertaking to pay the seller against compliant documents. A letter of indemnity is a promise to cover a carrier’s loss if it acts outside the normal rules. A bank may countersign an LOI, but that does not make it a credit.',
    },
    {
      q: 'Does a sea waybill remove the need for a letter of indemnity?',
      a: 'For delivery, usually yes. DCSA notes that a sea waybill is not a document of title and needs no original document for cargo release, so the carrier delivers to the named consignee without waiting for paper.',
    },
    {
      q: 'Can a letter of indemnity be used to change the discharge port?',
      a: 'Yes, the UK P&I Club lists delivery at a port other than the one shown on the bill as one of the standard situations. The holder of the bill still expects delivery at the named port, which is the risk the indemnity covers.',
    },
  ],
  sources: [
    'c1-ukpandi-letters-of-indemnity',
    'c1-ucc-7-403',
    'w4-cornell-ucc-1-201',
    'b5-dcsa-ebl',
    'dcsa-sea-waybill',
    'b5-hague-visby-art-3',
    'a4-icc-documentary-credits',
    'a2-trade-gov-letter-of-credit',
    'trade-gov-packing-list',
  ],
  primaryTool: '/tools/packing-list-generator',
  tools: ['/tools/packing-list-generator', '/tools/invoice-generator', '/tools/incoterms'],
  callout: {
    afterSection: 2,
    tool: '/tools/packing-list-generator',
    title: 'Keep the cargo description identical everywhere',
    text: 'Build the packing list from your invoice lines so packages, marks and weights match the bill of lading and anything that quotes it, including an LOI.',
  },
  related: [
    '/guides/what-is-a-bill-of-lading',
    '/guides/types-of-bill-of-lading',
    '/guides/export-payment-terms',
    '/guides/shipper-consignee-notify-party',
    '/blog/packing-list-for-shipping',
  ],
  cover: {
    id: 'JP5xc20IotY',
    src: 'https://images.unsplash.com/photo-1673844939454-25b56d5c9288',
    width: 5777,
    height: 3851,
    alt: 'A container ship berthed beneath container cranes at the discharge port, waiting for its cargo to be released',
    caption: 'A container ship at berth under the cranes',
    photographer: { name: 'Ernie Journeys', profile: 'https://unsplash.com/@erniejourneys' },
    page: 'https://unsplash.com/photos/a-large-cargo-ship-docked-at-a-dock-JP5xc20IotY',
  },
};

export default article;
