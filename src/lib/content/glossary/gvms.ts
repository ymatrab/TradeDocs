import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'gvms',
  term: 'GVMS (Goods Vehicle Movement Service)',
  abbreviation: 'GVMS',
  aliases: ['Goods Vehicle Movement Service', 'goods movement reference', 'GMR'],
  demand: {
    keyword: 'gvms',
    market: 'UK',
    volume: 880,
    kd: null,
    dataFile: '06-labs-keyword-overview-uk-candidates.json',
  },
  metaTitle: 'GVMS meaning: the goods movement reference',
  description:
    'What the Goods Vehicle Movement Service is, what a goods movement reference (GMR) links together, who creates it, and which references from your export paperwork it needs.',
  shortDefinition:
    'GVMS, the Goods Vehicle Movement Service, is the HMRC online service used to create a goods movement reference (GMR) for goods moving through ports that use it. The GMR ties the vehicle or trailer to the customs declarations for everything it carries.',
  definition: [
    'At most ports the customs declaration and the physical movement meet at the quayside. At locations that use GVMS, HMRC moves that link online: before the lorry sets off, someone registered for the service creates a goods movement reference that bundles the vehicle and the paperwork into one number.',
    'GOV.UK lists what goes into a GMR. On the transport side it is the vehicle registration number, or the trailer or container number for unaccompanied loads. On the customs side it is a reference for every consignment in that vehicle, trailer or container: depending on the route, a Movement Reference Number (MRN) from a declaration or a transit movement, a Declaration Unique Consignment Reference (DUCR), an EORI number or a carnet reference.',
    'The driver presents the GMR at the departure port, and the carrier uses it to decide whether the vehicle can board. A load with one consignment missing from the GMR is a load that cannot travel, so the reference is only as good as the declarations behind it. GOV.UK notes that personal goods, and commercial goods carried in baggage, do not need one.',
  ],
  onYourDocuments: [
    'The GMR is not printed on an invoice or packing list; it lives in GVMS and is usually created by the haulier or the customs agent. What your documents supply are the references it needs: the export declaration’s MRN or the DUCR you or your agent assigned. Writing that reference on the commercial invoice as well lets every party match the paperwork to the load.',
    'When several exporters share a trailer, each must hand over its declaration reference in time, because the GMR needs one for every consignment on board.',
  ],
  example: {
    caption: 'Worked example with invented parties',
    paragraphs: [
      'Pennine Valve Works (invented) of Leeds sends a part load of valves to a buyer in Rotterdam on a groupage trailer through a GVMS port. Its customs agent lodges the export declaration and passes the MRN to the haulier, along with the commercial invoice showing the same reference.',
      'The haulier collects MRNs from the other two exporters on the trailer, enters them with the trailer number in GVMS and receives one GMR, which the driver shows at check-in.',
    ],
  },
  confusedWith: [
    {
      term: 'Movement Reference Number (MRN)',
      difference:
        'An MRN identifies one customs declaration or transit movement. A GMR is a wrapper for a whole vehicle or trailer and contains one or more MRNs or other references.',
    },
  ],
  related: [
    '/blog/uk-export-declaration',
    '/guides/transit-declarations-t1-ncts',
    '/guides/how-to-export-from-the-uk',
    '/guides/eori-number',
  ],
  tool: '/tools/invoice-generator',
  toolPitch:
    'The commercial invoice generator has a reference field for the declaration number, so the MRN or DUCR the haulier needs for the GMR travels with your invoice.',
  faq: [
    {
      q: 'Who creates the goods movement reference?',
      a: 'Whoever is registered for GVMS and moving the goods, in practice usually the haulier or a customs agent acting for it. Each exporter supplies the declaration reference for its own consignment.',
    },
    {
      q: 'What happens if a consignment is missing from the GMR?',
      a: 'GOV.UK requires a reference for all goods in the vehicle, trailer or container, and the carrier checks the GMR before boarding, so the load can be refused until the GMR is complete.',
    },
  ],
  sources: ['d5-gov-uk-gmr', 'w5-gov-uk-eori'],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
