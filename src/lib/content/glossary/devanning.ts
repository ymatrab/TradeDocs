import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-09';

const term: GlossaryTerm = {
  slug: 'devanning',
  term: 'Devanning (container unloading)',
  aliases: ['devan', 'destuffing', 'unstuffing', 'container unloading', 'unpacking a container'],
  demand: {
    keyword: 'devanning',
    market: 'US',
    volume: 260,
    kd: null,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'Devanning meaning: unloading a container',
  description:
    'What devanning means, who does it and where, why the cargo is checked against the packing list as it comes out, and how devanning differs from stripping at a CFS and transloading.',
  shortDefinition:
    'Devanning is unloading cargo from a shipping container, also called destuffing or unstuffing. It happens at the consignee’s premises, a container freight station or a warehouse, and the goods are checked against the packing list as they come out.',
  definition: [
    'Devanning is the reverse of stuffing, or vanning, a container. The doors are opened, the cargo is taken out carton by carton or pallet by pallet, and the empty box goes back to the carrier. Full container loads are usually devanned at the consignee’s own warehouse; less-than-container loads are devanned at a container freight station, where the consolidator separates each consignee’s goods.',
    'The IMO/ILO/UNECE Code of Practice for Packing of Cargo Transport Units, the CTU Code, gives guidance not only to those who pack containers but also to those who receive and unpack them. Cargo can shift in transit, so the people opening the doors need to expect a load leaning against them, and fumigated or dangerous goods need checks before anyone goes inside.',
    'Devanning is also where problems surface. Shortages, damage and mismatched marks are found here, and they should be recorded while the carrier and surveyor can still see the evidence. In the United States, a container selected for an intensive CBP examination may be moved to a centralized examination station, a privately operated facility where goods are made available to CBP officers for physical examination, and devanned there.',
  ],
  onYourDocuments: [
    'Devanning does not appear as a field on the commercial invoice, but the packing list is the document it is checked against. A good packing list gives package numbers, marks, contents, quantities and weights per package, so the team unloading can tick each one off and spot what is missing.',
    'Any shortage or damage found is noted on the delivery receipt or proof of delivery, ideally with photographs and the container and seal numbers, before the empty container is returned.',
  ],
  example: {
    caption: 'Worked example with an invented importer and shipment',
    paragraphs: [
      'Brightwater Home (invented) receives a 40ft container of furniture at its warehouse in Leeds. The packing list shows 312 cartons numbered 1 to 312 with marks BWH/0815. The team checks the seal number against the bill of lading, opens the doors carefully and counts cartons as they come off.',
      'Carton 207 is crushed and cartons 299 to 301 are missing. Brightwater notes both on the haulier’s delivery receipt, photographs the damage and tells its forwarder the same day, before returning the empty container to avoid detention charges.',
    ],
  },
  confusedWith: [
    {
      term: 'Transloading',
      difference:
        'Transloading moves cargo from one container or vehicle into another for the next leg, often near the port. Devanning is unloading at the point where the goods are received.',
    },
    {
      term: 'Stripping at a CFS',
      difference:
        'Stripping is the word often used when a container freight station devans a consolidated container to split it among consignees. It is the same physical work in a specific place.',
    },
  ],
  related: [
    'container-freight-station',
    'proof-of-delivery',
    '/blog/container-load-plan',
    '/blog/cbp-customs-exam',
    '/guides/demurrage-and-detention',
  ],
  tool: '/tools/packing-list-generator',
  toolPitch:
    'The packing list generator numbers each package with its marks and weights, which is exactly what the team devanning the container checks off.',
  faq: [
    {
      q: 'What does devanning mean in shipping?',
      a: 'Unloading the cargo from a shipping container, usually at the consignee’s warehouse or a container freight station, and checking it against the packing list. The opposite is vanning, or stuffing.',
    },
    {
      q: 'What should you check when devanning a container?',
      a: 'That the seal number matches the transport document, that the package count and marks match the packing list, and that nothing is damaged. Record any problem on the delivery receipt before the container goes back.',
    },
  ],
  sources: ['e4-imo-ctu-code', 'e4-cfr-19-118-1-ces'],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
