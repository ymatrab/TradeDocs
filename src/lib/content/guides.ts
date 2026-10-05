import type { UnsplashPhoto } from '@/lib/content/images';
import type { SourceId } from '@/lib/trade/sources';

/**
 * The guides, as data.
 *
 * One module renders the hub, every guide page, the sitemap entries, llms.txt and the
 * Article structured data, so a guide cannot be listed in one place and missing from
 * another. Each guide answers one question with measured search demand (see
 * docs/research/content-plan-2026-10-05.md) and points at the tool that does the work.
 *
 * Rules every entry follows: facts about customs, carriers or the Incoterms® rules come
 * from a record in lib/trade/sources and are listed in `sources`; there are no invented
 * figures, customers or authors (the byline is the team); and every page carries the
 * not-advice note. `reviewed` is the date the text was last checked against its sources,
 * which is not an approval: the source records still say "pending owner review".
 */

export type GuideTable = {
  caption: string;
  head: readonly string[];
  rows: readonly (readonly string[])[];
};

export type GuideSection = {
  heading: string;
  paragraphs: readonly string[];
  list?: readonly string[];
  table?: GuideTable;
};

export type GuideFaq = { q: string; a: string };

export type Guide = {
  slug: string;
  /** The page's H1. */
  title: string;
  /** The <title>, phrased the way people search for it. */
  metaTitle: string;
  description: string;
  lede: string;
  /** The short answer, shown first so the question is answered before the detail. */
  answer: string;
  published: string;
  updated: string;
  reviewed: string;
  byline: string;
  sections: readonly GuideSection[];
  faq: readonly GuideFaq[];
  sources: readonly SourceId[];
  /** Paths from PUBLIC_TOOLS that do what the guide describes. */
  tools: readonly string[];
  /** A credited Unsplash photo, hotlinked (D-016). */
  cover: UnsplashPhoto;
};

const BYLINE = 'TradeDocs team';
const CONTENT_ROUND = '2026-10-05';

export const GUIDE_DISCLAIMER =
  'This guide explains general practice to help you ask the right questions. It is not legal, ' +
  'customs or tax advice, and the rules of the countries involved, your contract and your ' +
  'carrier’s terms take precedence over anything here.';

export const GUIDES: readonly Guide[] = [
  {
    slug: 'lcl-vs-fcl',
    title: 'LCL vs FCL: share a container or book your own?',
    metaTitle: 'LCL vs FCL shipping — less than container load or full container',
    description:
      'What less than container load (LCL) and full container load (FCL) mean, how each is charged, where the break-even sits and what changes on your packing list.',
    lede: 'Two ways to ship by sea in a container. One sells you space by the cubic metre, the other sells you the box. Which one is cheaper depends on your volume, and which one is safer depends on your cargo.',
    answer:
      'LCL (less than container load) means your cargo shares a container with other shippers’ goods and you pay for the space you use, measured in cubic metres. FCL (full container load) means you book the whole container for your cargo alone, even if it is not full, and pay a price per container.',
    published: CONTENT_ROUND,
    updated: CONTENT_ROUND,
    reviewed: CONTENT_ROUND,
    byline: BYLINE,
    sections: [
      {
        heading: 'How LCL works',
        paragraphs: [
          'You hand your cartons or pallets to a forwarder or carrier, usually at a container freight station near the port. They consolidate your consignment with others going the same way, load the shared container, ship it, and at destination deconsolidate it: the container is unpacked and each shipper’s goods are released separately.',
          'Because you are buying part of a box, the price is built from the space your cargo takes up. Maersk, for example, describes LCL as paying only for the container space you use, measured in CBM. In practice LCL is commonly quoted on weight or measure (W/M): the forwarder compares your cubic metres with your weight in tonnes and charges on whichever is greater, so dense cargo pays on weight and light, bulky cargo pays on volume.',
          'On top of the ocean rate, an LCL quotation usually carries handling charges at both ends for the consolidation and the unpacking. Read the quotation for those lines; they are part of the cost even though they are not freight.',
        ],
      },
      {
        heading: 'How FCL works',
        paragraphs: [
          'You book an entire container. It is delivered to your premises or you deliver to it, it is loaded with your cargo only, sealed, and travels as one unit until it is opened at destination. Maersk describes FCL as a container fully booked and loaded by one shipper, even if it is not 100% full.',
          'The price is per container, not per cubic metre, so the cost of each extra carton inside the box is close to nothing until the container is full or reaches its maximum payload. That is why the unit cost falls sharply as you fill it.',
        ],
        table: {
          caption: 'Typical internal volume of standard dry containers',
          head: ['Container', 'Typical internal volume', 'What it means for planning'],
          rows: [
            ['20ft standard', 'about 33 m³', 'Usable volume is lower once cartons are stowed'],
            ['40ft standard', 'about 67 m³', 'Roughly double a 20ft for a lower price per m³'],
            ['40ft high cube', 'about 76 m³', 'Extra height suits light, stackable cartons'],
          ],
        },
      },
      {
        heading: 'Where the break-even sits',
        paragraphs: [
          'There is no fixed number of cubic metres at which FCL becomes cheaper. It depends on the lane, the season, the forwarder and the handling charges on the LCL side. What is fixed is the shape of the comparison: an LCL quotation rises with every cubic metre, an FCL quotation is flat until the box is full.',
          'The reliable method is to get both quotations for the same cargo. Work out your total CBM first, with the carton dimensions and count you will actually ship, and ask for an LCL price on that volume and an FCL price for the smallest container it fits in. If the two are close, the factors below usually decide it.',
        ],
      },
      {
        heading: 'Speed, handling and risk',
        paragraphs: [
          'An LCL consignment is handled more often. It is received and stowed at the origin station, unpacked at the destination station and released from there, and it may wait at origin until the consolidator has enough cargo for the container to sail. Maersk notes that FCL suits high-volume, high-value or time-sensitive shipments that need fewer handovers and lower risk.',
          'Shared containers have a second consequence: the container is cleared and released as a unit before it is unpacked. A question about someone else’s consignment in the same box can slow the release of yours. With FCL, your container’s timing depends on your own paperwork.',
        ],
        list: [
          'Choose LCL for small or irregular volumes, samples and trial orders, and when paying for an empty half-container would cost more than the extra handling.',
          'Choose FCL when the volume is close to a container, when the goods are fragile or high-value, when the delivery date matters, or when you want the container sealed from your door to the buyer’s.',
        ],
      },
      {
        heading: 'What changes on the documents',
        paragraphs: [
          'In LCL your packages travel alongside other people’s, so the packing list and the marks on each carton are what keeps your consignment together. Every package should be identifiable and its weight and dimensions stated, and the totals on the packing list should agree with the commercial invoice and with what the forwarder measures at the station. Differences found at the station are re-measured and re-billed.',
          'In FCL the container number and seal number become part of the shipment record, and the packing list is still what customs and the receiver check the contents against.',
          'The Incoterms® rule needs a precise place in both cases. For containers, FCA at the seller’s premises or at the container freight station describes what actually happens better than FOB, because the seller hands over the goods before they reach the ship.',
        ],
      },
    ],
    faq: [
      {
        q: 'What does LCL stand for in shipping?',
        a: 'Less than container load: sea freight where your cargo shares a container with other shippers’ goods and you pay for the space it takes up, usually per cubic metre or on weight or measure.',
      },
      {
        q: 'How is LCL freight calculated?',
        a: 'From your cubic metres, compared with your weight. LCL is commonly charged on weight or measure (W/M), treating one cubic metre as one tonne and billing on the greater, plus handling charges at origin and destination.',
      },
      {
        q: 'Is FCL always cheaper per cubic metre?',
        a: 'Only once the container is reasonably full. An FCL price is per container, so a half-empty box can cost more than the same volume shipped LCL. Compare two quotations for your actual volume.',
      },
      {
        q: 'Which Incoterm suits LCL shipments?',
        a: 'Usually FCA, naming the forwarder’s container freight station or the seller’s premises, because that is where the seller actually hands the goods over. FOB assumes the seller controls the goods until they are on board, which is not the case for cargo surrendered at a station.',
      },
    ],
    sources: ['maersk-fcl-lcl', 'maersk-dry-containers', 'icc-incoterms-2020'],
    tools: ['/tools/cbm-calculator', '/tools/chargeable-weight', '/tools/packing-list-generator'],
    cover: {
      id: '2JNNpq4nGls',
      src: 'https://images.unsplash.com/photo-1670121180583-39ab653a071c',
      width: 6000,
      height: 4000,
      alt: 'Container ship loaded with full container loads at a port terminal in Vietnam',
      caption: 'Container ship at Hai Phong International Container Terminal, Vietnam',
      photographer: { name: 'Nathan Cima', profile: 'https://unsplash.com/@nathan_cima' },
      page: 'https://unsplash.com/photos/a-large-ship-in-the-water-2JNNpq4nGls',
    },
  },
  {
    slug: 'dap-vs-ddp',
    title: 'DAP vs DDP: who clears the goods into the destination country?',
    metaTitle: 'DAP vs DDP — the difference in Incoterms 2020, and when each goes wrong',
    description:
      'DAP and DDP both deliver to the buyer’s named place. The difference is import clearance, duties and taxes. What each rule puts on the seller and the buyer, with the traps in each.',
    lede: 'Two delivered rules that look almost the same on a quotation. The seller carries the goods all the way to the buyer under both. The difference is who deals with customs on arrival, and who pays what customs asks for.',
    answer:
      'Under DAP (Delivered at Place) the seller delivers to the named destination and the buyer clears the goods for import and pays the import duties and taxes. Under DDP (Delivered Duty Paid) the seller does that too: it clears the goods for import and pays the duties and taxes, so the buyer pays only the agreed price.',
    published: CONTENT_ROUND,
    updated: CONTENT_ROUND,
    reviewed: CONTENT_ROUND,
    byline: BYLINE,
    sections: [
      {
        heading: 'What the two rules share',
        paragraphs: [
          'Both are delivered rules in the Incoterms® 2020 set, and both work for any mode of transport. The seller contracts and pays for carriage to the named destination and clears the goods for export. Risk stays with the seller for the whole journey and passes at the named place, when the goods are put at the buyer’s disposal on the arriving vehicle, ready for unloading.',
          'In both, the buyer unloads. Neither rule obliges anyone to insure, although the seller carries the risk until delivery, so insuring is usually in its own interest. If the seller is meant to unload, the rule you want is DPU, which is the only Incoterms® rule that puts unloading on the seller.',
        ],
        table: {
          caption: 'DAP and DDP compared',
          head: ['Obligation', 'DAP', 'DDP'],
          rows: [
            ['Carriage to the named place', 'Seller', 'Seller'],
            ['Export clearance', 'Seller', 'Seller'],
            [
              'Risk passes',
              'At the named place, ready for unloading',
              'At the named place, ready for unloading, cleared for import',
            ],
            ['Unloading at destination', 'Buyer', 'Buyer'],
            ['Import clearance', 'Buyer', 'Seller'],
            ['Import duty and taxes', 'Buyer', 'Seller'],
            ['Insurance', 'Not required of either party', 'Not required of either party'],
          ],
        },
      },
      {
        heading: 'The one real difference',
        paragraphs: [
          'Import clearance. Under DAP the buyer lodges the import declaration in its own country and pays whatever duty and import taxes are due. Under DDP the seller takes on both, in a country where it may have no establishment, which makes DDP the maximum obligation a seller can accept under the eleven rules.',
          'That shifts more than a fee. The party clearing the goods has to be able to act as the importer, or appoint someone who can, has to know the classification and value the goods will be declared at, and carries the cost if the duty turns out higher than expected.',
        ],
      },
      {
        heading: 'When DDP goes wrong',
        paragraphs: [
          'The usual failure is a seller quoting DDP before checking that it can import into the destination at all. Some countries let a foreign company act as importer only through a registration or a local representative, and some do not allow it for certain goods. Settle how the import will be lodged, and by whom, before the price is agreed.',
          'The second is tax. The duties and taxes due on import normally include import VAT or its local equivalent. Under DDP the seller pays it, and whether a foreign seller can recover that tax depends on the destination country’s rules. If it cannot, the tax becomes a cost the seller did not price in. Some contracts use DDP with an agreed exclusion, such as VAT unpaid; if you do, write the exclusion into the contract rather than relying on the three letters.',
        ],
      },
      {
        heading: 'When DAP goes wrong',
        paragraphs: [
          'Under DAP the trap is on the buyer’s side. If the buyer does not clear the goods for import, or is late doing it, and the goods are held at a port or terminal as a result, the extra risk and costs of the hold-up fall on the buyer, demurrage and storage included. A buyer agreeing DAP should have its broker lined up before the goods arrive.',
          'The other common problem is naming a destination the goods cannot reach until they are cleared, such as a buyer’s site inland when the goods will stop at the border for clearance. Agree what happens while they wait, or name the place where clearance actually happens.',
        ],
      },
      {
        heading: 'Naming the place precisely',
        paragraphs: [
          'Both rules deliver at a named place, and risk passes there, so the place carries more weight than the three letters. “DAP Germany” tells neither party where the seller’s responsibility ends; “DAP Hamburg, buyer’s warehouse” with its street address does. Name a point the carrier can actually reach, and agree who pays any charges at that point, such as a terminal handling fee, before the goods arrive. The more precise the place, the fewer costs fall into the gap between the two parties.',
        ],
      },
      {
        heading: 'Choosing between them',
        paragraphs: [
          'DAP is the safer default for most exporters: the seller controls the journey it can control, and the buyer, who knows its own customs, clears the goods. DDP makes sense when the seller can genuinely import at the destination, through its own registration or an agent, and when the buyer needs one landed price with nothing more to pay, as with samples or sales to customers who cannot clear goods themselves.',
          'Whichever you choose, quote the rule with its place and its version, such as “DAP Oslo, buyer’s site, Incoterms® 2020”, and put the same wording on the commercial invoice. If you quote DDP, estimate the duty and taxes before you set the price; a landed cost estimate with the rates your broker gives you shows how much of the price customs will take.',
        ],
      },
    ],
    faq: [
      {
        q: 'What is the difference between DAP and DDP?',
        a: 'Import clearance. Under DAP the buyer clears the goods for import and pays the duty and import taxes; under DDP the seller does both. Delivery, risk and unloading are otherwise the same.',
      },
      {
        q: 'Who pays import VAT under DDP?',
        a: 'The seller, as part of the duties and taxes due on import, unless the contract excludes it. Whether the seller can recover that VAT depends on the destination country’s rules.',
      },
      {
        q: 'Who unloads the goods under DAP and DDP?',
        a: 'The buyer, under both. The seller delivers the goods ready for unloading. DPU is the rule that obliges the seller to unload.',
      },
      {
        q: 'Is DDP better for the buyer?',
        a: 'It is simpler for the buyer, who pays one agreed price. It only works if the seller can import into the buyer’s country, and the seller will price the duty, taxes and that effort into the quotation.',
      },
    ],
    sources: ['icc-incoterms-2020', 'trade-gov-commercial-invoice'],
    tools: ['/tools/incoterms', '/tools/landed-cost-calculator', '/tools/invoice-generator'],
    cover: {
      id: 'crHhZlES310',
      src: 'https://images.unsplash.com/photo-1601467995997-ac1ae9a8fff4',
      width: 5900,
      height: 3933,
      alt: 'White delivery truck parked at a building at the end of a delivered shipment',
      caption: 'White delivery truck parked at a building',
      photographer: { name: 'Maxim Tolchinskiy', profile: 'https://unsplash.com/@shaikhulud' },
      page: 'https://unsplash.com/photos/crHhZlES310',
    },
  },
  {
    slug: 'proforma-vs-commercial-invoice',
    title: 'Proforma invoice vs commercial invoice: what each one is for',
    metaTitle: 'Proforma vs commercial invoice — the difference, and when you need each',
    description:
      'A proforma invoice is a quotation in invoice form, issued before the sale. A commercial invoice bills goods sold and is what customs values them from. What goes on each, and how they relate.',
    lede: 'They look alike and carry many of the same fields, which is exactly why they get confused. They are issued at different moments, for different readers, and only one of them is the basis customs works from.',
    answer:
      'A proforma invoice is a quotation in the form of an invoice, sent before the sale is final so the buyer can arrange payment, a letter of credit or an import licence. A commercial invoice is issued for goods actually sold and shipped; it requests payment and is the document customs in the importing country uses to assess duties and taxes.',
    published: CONTENT_ROUND,
    updated: CONTENT_ROUND,
    reviewed: CONTENT_ROUND,
    byline: BYLINE,
    sections: [
      {
        heading: 'What a proforma invoice is for',
        paragraphs: [
          'The U.S. International Trade Administration describes a proforma invoice as a quote in an invoice format. It tells a prospective buyer exactly what it would be buying, at what price and on what terms, laid out the way the final invoice will be.',
          'Buyers ask for one because other parties need to see the deal before it happens. The ITA lists the common reasons: to apply for an import licence, to contract for a pre-shipment inspection, to open a letter of credit, and to arrange the transfer of currency. A bank or a licensing authority wants a document that looks like the invoice it will later see, which a plain price list is not.',
          'A proforma does not request payment for goods delivered, because nothing has been delivered yet. If the terms change before shipment, a revised proforma is issued; the commercial invoice comes later.',
        ],
        list: [
          'Seller and buyer, with names and addresses, and the buyer’s reference number',
          'The goods quoted, with unit and total prices, weights and dimensions',
          'Any discounts, the terms of sale with the Incoterms® rule and its delivery point, and the payment terms',
          'The estimated shipping date and the date the quotation is valid until',
        ],
      },
      {
        heading: 'What a commercial invoice is for',
        paragraphs: [
          'The commercial invoice is issued when the goods are sold and shipped. It is the seller’s bill to the buyer, and it is also a customs document: the ITA calls it a required document for export and import clearance, and the one customs officials in the buyer’s country use to assess import duties and taxes.',
          'It carries the information from the proforma, updated to what was actually shipped, plus what customs needs: the country of origin, a precise description of each line, and usually the HS code of each product, which speeds clearance. Some importing countries specify what must appear. For goods entering the United States, the required contents are set out in 19 CFR 141.86, which include the port of entry, who sold the goods to whom and when, a detailed description with the marks and numbers of the packages, the quantities, the purchase price of each item in the currency of the purchase, the charges on the goods itemised by name and amount, and the country of origin.',
        ],
      },
      {
        heading: 'The differences side by side',
        paragraphs: [
          'Most of the fields overlap. The differences are in when the document is issued, what it commits the parties to and who relies on it.',
        ],
        table: {
          caption: 'Proforma invoice and commercial invoice compared',
          head: ['', 'Proforma invoice', 'Commercial invoice'],
          rows: [
            ['Issued', 'Before the sale is final', 'When the goods are sold and shipped'],
            ['Purpose', 'A formal quotation', 'A request for payment for goods supplied'],
            [
              'Read by',
              'Buyer, its bank, licensing or inspection bodies',
              'Buyer and customs authorities',
            ],
            ['Quantities and prices', 'As quoted', 'As actually shipped'],
            ['Validity date', 'Usually stated', 'Not applicable'],
            ['Used to value goods at import', 'Not normally', 'Yes, it is the basis'],
          ],
        },
      },
      {
        heading: 'When customs accepts a proforma',
        paragraphs: [
          'There is one situation where a proforma invoice does reach customs, and it means something narrower. Under U.S. rules, an importer who does not yet have the seller’s commercial invoice when the goods are entered can file a pro forma invoice instead: a statement of value in the form set out in 19 CFR 141.85, in which the importer declares the prices or values, the basis for them and the country of origin, and undertakes to file the commercial invoice once it arrives.',
          'That is the importer’s stopgap declaration, not the seller’s sales quotation. Other countries have their own provisions for missing invoices. Either way, it is an exception for a document that is late, not a substitute you choose.',
        ],
      },
      {
        heading: 'Keeping the two consistent',
        paragraphs: [
          'Trouble usually starts when the shipment differs from the quotation and only one document is updated. If a letter of credit was opened against a proforma, the commercial invoice presented to the bank has to match the credit’s terms, so a change in quantity or price may need the credit amended first. And the commercial invoice, the packing list and the transport document have to agree with each other, because customs and the receiver compare them.',
          'The simplest protection is to produce all of them from one set of figures: the same parties, the same lines, the same Incoterms® rule and place. Number them so the relationship is visible, for example by citing the proforma number as the reference on the commercial invoice.',
        ],
      },
    ],
    faq: [
      {
        q: 'Is a proforma invoice a legal document?',
        a: 'It is a formal quotation. Once the buyer accepts it, it can form part of the sales contract, and banks and licensing authorities rely on it. It is not a request for payment for goods delivered, and it is not normally the document customs values goods from.',
      },
      {
        q: 'Can I use a proforma invoice for customs clearance?',
        a: 'Normally customs needs the commercial invoice. Some countries accept a substitute when the commercial invoice is missing at entry; in the United States that is the importer’s pro forma invoice under 19 CFR 141.85, with the commercial invoice to follow.',
      },
      {
        q: 'Does a proforma invoice need an invoice number?',
        a: 'It should have its own reference so the buyer, its bank and you can refer to the same version. Many sellers number proformas in a separate series from commercial invoices so the two are never confused.',
      },
      {
        q: 'What happens if the commercial invoice differs from the proforma?',
        a: 'The commercial invoice should state what was actually shipped. If payment depends on the proforma, as with a letter of credit opened against it, agree the change with the buyer and its bank before shipping so the documents still match the credit.',
      },
    ],
    sources: [
      'trade-gov-proforma-invoice',
      'trade-gov-commercial-invoice',
      'us-cbp-invoice-contents',
      'us-cbp-proforma-invoice',
    ],
    tools: [
      '/tools/proforma-invoice-generator',
      '/tools/invoice-generator',
      '/tools/packing-list-generator',
    ],
    cover: {
      id: 'spScdgWY-_c',
      src: 'https://images.unsplash.com/photo-1631651693480-97f1132e333d',
      width: 3576,
      height: 2384,
      alt: 'Paper documents and a pen on a wooden table, ready for an invoice to be filled in',
      caption: 'Papers and a pen on a wooden table',
      photographer: { name: '2H Media', profile: 'https://unsplash.com/@2hmedia' },
      page: 'https://unsplash.com/photos/spScdgWY-_c',
    },
  },
];

/** The /guides hub's cover. */
export const GUIDES_HUB_COVER: UnsplashPhoto = {
  id: 'b4lmjXJi9e4',
  src: 'https://images.unsplash.com/photo-1782398138711-72c37bce4b38',
  width: 7094,
  height: 4532,
  alt: 'Aerial view of a busy port with stacked shipping containers waiting to be loaded',
  caption: 'Aerial view of a busy port with shipping containers',
  photographer: { name: 'Cosmin Andrei Buzamat', profile: 'https://unsplash.com/@cos592' },
  page: 'https://unsplash.com/photos/b4lmjXJi9e4',
};

export function findGuide(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}

/** Visible words in a guide, for the content checks; the FAQ is counted because it is shown. */
export function guideWordCount(guide: Guide): number {
  const text = [
    guide.lede,
    guide.answer,
    ...guide.sections.flatMap((section) => [
      section.heading,
      ...section.paragraphs,
      ...(section.list ?? []),
      ...(section.table ? section.table.rows.flat() : []),
    ]),
    ...guide.faq.flatMap((entry) => [entry.q, entry.a]),
  ].join(' ');
  return text.split(/\s+/).filter(Boolean).length;
}
