import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-09';

/**
 * Demand (DataForSEO, 2026-10-07): "how to ship a car internationally" 210 (AU 10);
 * "how to export cars" 10. Plan: docs/research/content-plan-v4-2026-10-08.md, group 3, wave E.
 */
const article: ContentArticle = {
  slug: 'exporting-a-vehicle-from-the-us',
  title: 'Exporting a vehicle from the US: title, EEI and the 72-hour rule',
  metaTitle: 'Exporting a vehicle from the US: the rules',
  description:
    'How to export a used car or other vehicle from the United States: the title documents CBP needs, the 72-hour rule, the EEI filing with the VIN, and the ITN.',
  lede: 'Shipping a used car out of the United States is not like shipping a pallet of parts. Two sets of rules apply on top of the usual export paperwork: CBP’s vehicle export regulations in 19 CFR part 192, which centre on the title, and the Foreign Trade Regulations, which require an EEI filing for every used vehicle. This post walks through both, in the order a shipment meets them.',
  answer:
    'To export a used vehicle from the US, you file Electronic Export Information in AES with the VIN, whatever the vehicle’s value, and present the original or certified title with two copies to CBP at least 72 hours before export. Leased or financed vehicles also need a letter from the lienholder allowing export.',
  keyFacts: [
    'Under 19 CFR 192.2, the exporter of a used self-propelled vehicle presents the vehicle and its documents, including the VIN, to CBP at the port of export.',
    'CBP states that the certificate of title is the core requirement in the vehicle export process, regardless of the vehicle’s value or condition.',
    'Under 19 CFR 192.2(c), documents for vehicles leaving by vessel or aircraft go to CBP at least 72 hours before export.',
    'Under 15 CFR 30.2(a)(1)(iv)(H), EEI must be filed for used self-propelled vehicles regardless of value, notwithstanding the usual exemptions.',
    'Under 15 CFR 30.6(b), the EEI for a used vehicle carries the VIN or product ID, the title number and the state that issued the title.',
  ],
  definitions: [
    {
      term: 'Used vehicle',
      meaning:
        'Under 19 CFR 192.1, a self-propelled vehicle whose title has passed from a manufacturer, distributor or dealer to an ultimate purchaser.',
    },
    {
      term: 'Self-propelled vehicle',
      meaning:
        'Under 19 CFR 192.1, a motorised land vehicle not on rails: cars, trucks, buses, motorcycles, motor homes, tractors and self-propelled equipment.',
    },
    {
      term: 'EEI',
      meaning:
        'Electronic Export Information, the export data filed in the Automated Export System under the Foreign Trade Regulations, 15 CFR part 30.',
    },
    {
      term: 'ITN',
      meaning:
        'The Internal Transaction Number AES returns when an EEI filing is accepted, used to link the vehicle documents to the filing.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'Which vehicles do the US export rules cover?',
      paragraphs: [
        'Used self-propelled vehicles. Under 19 CFR 192.1, that means motorised land vehicles that do not run on rails, such as cars, trucks, tractors, buses, motorcycles, motor homes and self-propelled farm or construction equipment. A vehicle is used once its title has passed from a manufacturer, distributor or dealer to an ultimate purchaser, the first buyer who is not buying to resell.',
        'Under 19 CFR 192.2(a), the rules do not apply to vehicles that were entered into the United States in-bond, under a carnet or under a temporary importation bond. Brand-new vehicles bought from a US source that were never titled are covered by their own document rule, using the Manufacturer’s Statement of Origin.',
      ],
    },
    {
      heading: 'What documents does CBP need to export a car?',
      paragraphs: [
        'The title, above all. CBP’s guidance on exporting a motor vehicle calls the certificate of title the core requirement, whatever the vehicle is worth and whether or not it runs. Under 19 CFR 192.2(b), the documents depend on how the vehicle is titled, and each set includes the original or a certified copy plus two complete copies.',
      ],
      table: {
        caption: 'Ownership documents for vehicle export under 19 CFR 192.2(b)',
        head: ['Vehicle', 'What to present', 'Plus'],
        rows: [
          [
            'US-titled, owned outright',
            'Original Certificate of Title, or a certified copy, or a salvage title in force',
            'Two complete copies',
          ],
          [
            'US-titled, leased or financed',
            'The title documents above',
            'A signed letter from the lessor or lienholder on letterhead stating that the vehicle may be exported',
          ],
          [
            'Foreign-titled',
            'The original proof of ownership, with an English translation if needed',
            'Two complete copies',
          ],
          [
            'New, never titled',
            'The original Manufacturer’s Statement of Origin',
            'Two complete copies',
          ],
          [
            'Junk or scrap',
            'The junk or scrap certificate in force, original or certified',
            'Two complete copies',
          ],
          [
            'No title required or in force, no MSO',
            'An original ownership document such as a bill of sale, and proof that no title is required',
            'Two copies and a written statement that the purchase was genuine and the vehicle is not stolen',
          ],
        ],
      },
    },
    {
      heading: 'What is the 72-hour rule?',
      paragraphs: [
        'It is the advance notice CBP needs before a used vehicle leaves. Under 19 CFR 192.2(c), for vehicles exported by vessel or aircraft, the documents and the vehicle are presented to CBP at least 72 hours before export. For vehicles leaving by rail, by road or under their own power, the documents go in at least 72 hours before export and the vehicle is presented at the time of export.',
        'Port directors decide where documents and vehicles are presented for inspection and publish the locations and hours. Under 19 CFR 192.2(e), CBP checks that the documents are authentic, marks them, and normally returns the originals. Ask your forwarder or the port’s vehicle export office how that port works before you book a sailing.',
      ],
    },
    {
      heading: 'Do you need to file EEI for a used car?',
      paragraphs: [
        'Yes, always. Under 15 CFR 30.2(a)(1)(iv)(H), EEI must be filed for used self-propelled vehicles regardless of value, notwithstanding the exemptions in subpart D of the Foreign Trade Regulations. That means the $2,500 per-line exemption in 15 CFR 30.37 and the Canada exemption in 15 CFR 30.36, which cover many other shipments, do not remove the filing for a used vehicle.',
        'The EEI is filed in AES by the US principal party in interest or its authorised agent, under 15 CFR 30.3. On top of the usual data elements, 15 CFR 30.6(b) lists conditional elements for used vehicles: the VIN or product ID, a qualifier saying which it is, the title number issued by the motor vehicle administration, and the two-letter code of the state that issued the title.',
      ],
    },
    {
      heading: 'How do the title documents reach CBP?',
      paragraphs: [
        'Increasingly through the Document Image System. CBP’s instructional guide for used self-propelled vehicles describes a paperless process, open to all modes of transport and all ports of export since 9 January 2023, for sending ownership documents as a PDF by email or by EDI. The submission is keyed to the ITN from the AES filing, under document code CBP09, so the EEI has to be filed first.',
        'Paper has not disappeared. The same guide says CBP can ask for paper copies of the ownership documents at any time, at the port’s discretion, and that for land exports a paper copy may be needed at the border to get CBP’s export stamp. It also sets the timing by mode, so check it against the port’s own instructions.',
      ],
    },
    {
      heading: 'How do you export a vehicle, step by step?',
      paragraphs: [
        'The order matters, because the documents depend on the filing and the filing depends on the title. A typical sequence for a vehicle leaving by sea looks like this.',
      ],
      steps: [
        'Check the destination country’s import rules for vehicles before you buy or ship; they are separate from the US export rules and set by the importing country.',
        'Get the title in order: the original or a certified copy, two complete copies, and, if the vehicle is financed or leased, the lienholder’s letter allowing export.',
        'Prepare a commercial invoice or bill of sale showing the seller, buyer, vehicle description, VIN and price, which supports the value in the EEI.',
        'File the EEI in AES with the VIN, title number and title state, or authorise your forwarder to file it, and keep the ITN it returns.',
        'Submit the title documents to CBP under the ITN, through the Document Image System or as the port directs, at least 72 hours before export.',
        'Deliver the vehicle to the port or terminal for inspection, keep the authenticated documents, and file the records with the shipment.',
      ],
    },
    {
      heading: 'What paperwork does the buyer abroad need?',
      paragraphs: [
        'That depends on the importing country, not on CBP. Ask the buyer which documents their customs authority wants before the vehicle sails; proof of ownership, a commercial invoice or bill of sale with the price, and the bill of lading are the usual starting point. Any rules on the vehicle itself are set and checked by the importing country.',
        'TradeDocs does not file EEI, submit titles to CBP or issue any vehicle document. You can use it to prepare the commercial invoice and packing list that travel with the vehicle, with the VIN in the description so every document identifies the same car.',
      ],
    },
  ],
  faq: [
    {
      q: 'Can I export a car that still has a loan on it?',
      a: 'Under 19 CFR 192.2(b), a financed or leased vehicle needs, in addition to the title documents, a letter from the lienholder or lessor on letterhead, with the VIN and an original signature, stating that the vehicle may be exported.',
    },
    {
      q: 'Is EEI needed for a used car worth less than $2,500?',
      a: 'Yes. Under 15 CFR 30.2(a)(1)(iv)(H), EEI is filed for used self-propelled vehicles regardless of value, so the low-value exemption in 15 CFR 30.37 does not apply.',
    },
    {
      q: 'Do the rules apply to a used motorcycle or tractor?',
      a: 'Yes. The definition of self-propelled vehicle in 19 CFR 192.1 includes motorcycles, trucks, buses, motor homes, tractors and self-propelled farm, construction and special-use equipment.',
    },
    {
      q: 'Who files the EEI for a vehicle export?',
      a: 'The US principal party in interest or its authorised agent, such as a freight forwarder, under 15 CFR 30.3. The filing returns the ITN that the title documents are submitted under.',
    },
    {
      q: 'Does CBP keep the original title?',
      a: 'Under 19 CFR 192.2(e), CBP authenticates and marks the documents and normally returns the originals. If CBP keeps an original and cannot find it before export, the exporter’s authenticated copy is the evidence of compliance.',
    },
  ],
  sources: [
    'e3-ecfr-19-cfr-192-1',
    'e3-ecfr-19-cfr-192-2',
    'e3-cbp-export-motor-vehicle',
    'e3-cbp-dis-vehicles',
    'e3-ecfr-15-cfr-30-2',
    'e3-ecfr-15-cfr-30-6-vehicles',
    'w5-ftr-30-3',
    'w5-ftr-30-36',
    'w5-ftr-30-37',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: [
    '/tools/invoice-generator',
    '/tools/proforma-invoice-generator',
    '/tools/packing-list-generator',
  ],
  callout: {
    afterSection: 3,
    tool: '/tools/invoice-generator',
    title: 'Put the VIN on the invoice',
    text: 'The commercial invoice generator lets you describe the vehicle with its make, model, year and VIN, and state the price and currency the EEI value is taken from.',
  },
  related: [
    '/guides/eei-aes-filing-itn',
    '/guides/how-to-export-from-the-us',
    '/blog/aes-exemptions',
    '/blog/shippers-letter-of-instruction',
    '/blog/export-documents-checklist',
    '/guides/freight-forwarder-vs-customs-broker',
  ],
  cover: {
    id: '27SvyguDTRo',
    src: 'https://images.unsplash.com/photo-1767884162407-62d7850e77d2',
    width: 4512,
    height: 3000,
    alt: 'Rows of cars parked on the open deck of a ship at sea, the way many used vehicles leave a port',
    caption: 'Rows of cars on the deck of a ferry',
    photographer: { name: 'Adem Percem', profile: 'https://unsplash.com/@adempercem' },
    page: 'https://unsplash.com/photos/cars-lined-up-on-a-ferry-crossing-the-ocean-27SvyguDTRo',
  },
};

export default article;
