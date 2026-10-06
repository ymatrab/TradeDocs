import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-06';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "fob destination vs fob shipping point" 1,000, KD 6;
 * "fob destination" 3,600; "fob shipping point" 2,900; "fob origin" 1,600.
 * Plan: docs/research/content-plan-v2-2026-10-06.md, batch 1.
 */
const article: ContentArticle = {
  slug: 'fob-shipping-point-vs-fob-destination',
  title: 'FOB shipping point vs FOB destination, and the export FOB',
  metaTitle: 'FOB shipping point vs FOB destination',
  description:
    'FOB shipping point and FOB destination are US Uniform Commercial Code delivery terms. Incoterms® FOB is a different rule. Who carries risk under each, and which belongs on an export invoice.',
  lede: 'Two different things share the letters FOB. One is a US domestic delivery term from the Uniform Commercial Code, split into “shipping point” and “destination”. The other is an Incoterms® rule for goods loaded on a ship. Mixing them up on an export invoice leaves the risk with whoever the other side assumed.',
  answer:
    'Under FOB shipping point, a US Uniform Commercial Code term, risk and title pass to the buyer when the seller hands the goods to the carrier. Under FOB destination they pass when the goods are tendered at the buyer’s location. Neither is the Incoterms® FOB rule, which delivers on board a vessel at a named port of shipment.',
  keyFacts: [
    'FOB shipping point and FOB destination come from UCC § 2-319, part of the Uniform Commercial Code adopted by US states.',
    'Under UCC § 2-319, FOB the place of shipment makes the seller bear the expense and risk of putting the goods into the carrier’s possession.',
    'Under UCC § 2-319, FOB the place of destination makes the seller transport the goods to that place at its own expense and risk.',
    'UCC § 2-401 passes title, unless otherwise agreed, when the seller completes physical delivery of the goods.',
    'FOB in the ICC’s Incoterms® 2020 rules is a sea and inland waterway rule, delivered on board the vessel at the named port of shipment.',
  ],
  definitions: [
    {
      term: 'FOB shipping point (FOB origin)',
      meaning:
        'A UCC shipment term: the seller’s duty ends when the goods are handed to the carrier at the shipping point.',
    },
    {
      term: 'FOB destination',
      meaning:
        'A UCC destination term: the seller carries the goods at its expense and risk until they are tendered at the named destination.',
    },
    {
      term: 'Uniform Commercial Code (UCC)',
      meaning:
        'The model law on sales of goods that US states have adopted, with local variations.',
    },
    {
      term: 'Tender of delivery',
      meaning:
        'Putting the goods at the buyer’s disposal so the buyer can take them, with any notice the contract requires.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is the difference between FOB shipping point and FOB destination?',
      paragraphs: [
        'The difference is where the seller’s delivery ends. UCC § 2-319 says that when the term is FOB the place of shipment, the seller must ship the goods and bear the expense and risk of putting them into the carrier’s possession. When the term is FOB the place of destination, the seller must transport the goods to that place at its own expense and risk and tender delivery there.',
        'So a pallet that is damaged on the highway between your warehouse and the customer is the buyer’s loss under FOB shipping point and your loss under FOB destination. The same goods, the same truck and the same accident end up on different balance sheets because of two words on the purchase order.',
        'The UCC also treats FOB as a delivery term even when it appears only next to the price. A quotation that reads “$4,800 FOB Dayton” is therefore a statement about delivery and risk, not just a note about how the price was worked out.',
      ],
    },
    {
      heading: 'When do risk and title pass under each term?',
      paragraphs: [
        'Risk and title usually move together under these terms, at the point the seller completes delivery. UCC § 2-509 places the risk of loss on the buyer when the goods are duly delivered to the carrier, if the contract does not require delivery at a particular destination. If it does, risk passes when the goods are duly tendered at that destination so the buyer can take delivery.',
        'Title follows a similar path. Under UCC § 2-401, unless the parties explicitly agree otherwise, title passes when the seller completes its performance with reference to physical delivery: at the time and place of shipment under a shipment contract, and on tender at the destination under a destination contract. The parties can agree a different moment for title, and many sales contracts do.',
      ],
      table: {
        caption: 'FOB shipping point and FOB destination under the Uniform Commercial Code',
        head: ['', 'FOB shipping point', 'FOB destination'],
        rows: [
          ['Source', 'UCC § 2-319(1)(a)', 'UCC § 2-319(1)(b)'],
          [
            'Seller’s delivery ends',
            'When the goods are in the carrier’s possession',
            'When the goods are tendered at the named destination',
          ],
          ['Risk in transit', 'Buyer', 'Seller'],
          ['Title in transit (unless agreed otherwise)', 'Buyer', 'Seller'],
          ['Transport to the destination at the seller’s expense', 'No', 'Yes'],
          ['Loss in transit falls on', 'The buyer', 'The seller'],
        ],
      },
    },
    {
      heading: 'Why do accountants care about FOB shipping point?',
      paragraphs: [
        'Accountants care because the term decides whose goods are on the truck at the end of a period. Goods shipped FOB shipping point on 30 June have, under the default UCC rule, already passed to the buyer, even though they arrive in July. Under FOB destination they are still the seller’s goods until they are tendered at the buyer’s site.',
        'That is why the search results for this question are full of inventory and revenue examples. The legal mechanics underneath those examples are the UCC rules above. How a business records the sale is a question for its accountant and the accounting standards it reports under, which this article does not cover.',
      ],
    },
    {
      heading: 'Is FOB shipping point the same as Incoterms® FOB?',
      paragraphs: [
        'No. The FOB in the ICC’s Incoterms® 2020 rules is a separate, international rule with its own wording. Under Incoterms® FOB the seller delivers the goods on board the vessel nominated by the buyer at the named port of shipment, and the risk of loss passes when the goods are on board. HMRC’s customs valuation guidance describes it the same way and adds that the buyer bears all costs from that moment.',
        'Three things set it apart from the UCC term. It applies only to sea and inland waterway transport; the International Trade Administration lists FOB among the four rules for that mode. The named place is always a port of shipment, never a factory or a customer’s dock. And it splits export and import duties between the parties: the seller clears the goods for export, the buyer clears them for import.',
        'The UCC also knows an FOB vessel variant. Under § 2-319, where the term is FOB vessel, the seller must load the goods on board at its own expense and risk. That is close in spirit to Incoterms® FOB, but it is still a domestic statute and not the ICC rule your foreign buyer is reading.',
      ],
    },
    {
      heading: 'Which FOB should go on an export invoice?',
      paragraphs: [
        'On an export invoice, write an Incoterms® rule with its named place and version, such as “FOB Savannah, Incoterms® 2020”. A foreign buyer, its bank and its customs authority will read the term against the ICC rules, not against a US state statute, and “FOB shipping point” has no meaning in the Incoterms® set.',
        'If the goods leave in a container from your premises or a depot, consider whether FOB is the right rule at all. FCA, Free Carrier, delivers at the handover to the buyer’s carrier and works for any mode of transport; our article on FCA vs FOB explains why it often fits container cargo better.',
        'For a sale between two US businesses with no export, the UCC terms remain in everyday use. Even there, write the named place (“FOB destination, Buyer’s warehouse, Columbus, Ohio”) so nobody has to guess which destination was meant.',
      ],
    },
    {
      heading: 'How do you write the term on a quote or invoice?',
      paragraphs: [
        'Write the term in the same words on every document for the shipment, and check it before the first one is sent.',
      ],
      steps: [
        'Decide whether the sale is domestic or an export. A shipment leaving the country takes an Incoterms® rule.',
        'For a domestic sale, choose FOB shipping point or FOB destination and name the place, for example “FOB shipping point, Seller’s plant, Dayton, Ohio”.',
        'For an export, choose the Incoterms® 2020 rule that matches the handover, name the place and add the version, for example “FCA Dayton, seller’s premises, Incoterms® 2020”.',
        'Put the same wording in the terms-of-sale field of the quotation, the proforma invoice and the commercial invoice.',
        'If title is meant to pass at a different moment from delivery, say so in the contract rather than relying on the trade term.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is FOB origin the same as FOB shipping point?',
      a: 'Yes, the two names are used for the same shipment term: the seller’s delivery, and with it the risk, ends when the goods are handed to the carrier at the shipping point.',
    },
    {
      q: 'Who pays freight under FOB destination?',
      a: 'Under UCC § 2-319, FOB destination requires the seller to transport the goods to the destination at its own expense, so freight is the seller’s cost unless the contract allocates it differently.',
    },
    {
      q: 'Who owns goods in transit under FOB shipping point?',
      a: 'Under the default rule in UCC § 2-401, the buyer: title passes when the seller completes physical delivery, which under a shipment contract is at the time and place of shipment. The parties can agree otherwise.',
    },
    {
      q: 'Can I write “FOB destination” on an export invoice?',
      a: 'It is not an Incoterms® rule, so a foreign buyer or customs authority may not read it the way you intend. Use an Incoterms® 2020 rule such as DAP or DDP if you deliver to the buyer’s country, with the named place.',
    },
    {
      q: 'Does FOB shipping point apply outside the United States?',
      a: 'It comes from the Uniform Commercial Code, which US states adopt. Other countries have their own sales law, and international sales usually rely on the Incoterms® rules instead.',
    },
  ],
  sources: [
    'w1-cornell-ucc-2-319',
    'w1-cornell-ucc-2-401',
    'w1-cornell-ucc-2-509',
    'icc-incoterms-2020',
    'w1-hmrc-incoterms',
    'w1-ita-know-your-incoterms',
  ],
  primaryTool: '/tools/incoterms',
  tools: ['/tools/incoterms', '/tools/invoice-generator', '/tools/proforma-invoice-generator'],
  callout: {
    afterSection: 3,
    tool: '/tools/incoterms',
    title: 'See where risk passes under each Incoterms® rule',
    text: 'The Incoterms® 2020 guide compares all eleven rules, including FOB and FCA, on one chart, so you can pick the export term that matches the handover.',
  },
  related: ['/blog/fca-vs-fob', '/blog/exw-vs-fob', '/blog/commercial-invoice-requirements'],
  cover: {
    id: 'xkAIwD0hsbg',
    src: 'https://images.unsplash.com/photo-1778015862504-b877b548266e',
    width: 5729,
    height: 3819,
    alt: 'Truck and trailers outside a warehouse, the shipping point where FOB origin delivery would end',
    caption: 'Truck and trailers parked in front of a warehouse',
    photographer: { name: 'Troy Mortier', profile: 'https://unsplash.com/@troyscanon' },
    page: 'https://unsplash.com/photos/truck-and-trailers-parked-in-front-of-a-warehouse-xkAIwD0hsbg',
  },
};

export default article;
