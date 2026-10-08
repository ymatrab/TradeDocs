import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources for the wave B posts (writer b2): how-many-cbm-fit-in-a-container,
 * paperless-commercial-invoice, uk-import-duty, how-to-make-a-proforma-invoice,
 * proforma-to-commercial-invoice and delivery-note-from-packing-list. One file for the six
 * posts, ids prefixed `b2-`.
 */
const RETRIEVED = '2026-10-08';
const PENDING = 'pending owner review';

export default {
  'b2-imo-ctu-code': {
    authority: 'International Maritime Organization (IMO), with the ILO and UNECE',
    title: 'IMO/ILO/UNECE Code of Practice for Packing of Cargo Transport Units (CTU Code)',
    url: 'https://www.imo.org/en/OurWork/Safety/Pages/CTU-Code.aspx',
    jurisdiction: 'International (non-mandatory code of practice)',
    supports:
      'the CTU Code being a non-mandatory 2014 code of practice from the IMO, ILO and UNECE on loading and securing cargo in containers and other cargo transport units',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
