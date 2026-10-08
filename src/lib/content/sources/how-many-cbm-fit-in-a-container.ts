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
  'b2-fedex-etd': {
    authority: 'FedEx',
    title: 'FedEx Electronic Trade Documents',
    url: 'https://www.fedex.com/en-us/electronic-trade-documents.html',
    jurisdiction: 'Carrier practice (FedEx, United States site)',
    supports:
      'ETD transmitting customs documents electronically, the three invoice choices in FedEx Ship Manager at fedex.com (your own uploaded invoice, or a FedEx-created commercial or pro forma invoice with your letterhead and signature), up to four additional documents, and pre-shipment, at-shipment and post-shipment upload',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b2-dhl-plt-terms': {
    authority: 'DHL Express',
    title: 'MyDHL+ Digital Customs Invoice Terms and Conditions',
    url: 'https://mydhl.express.dhl/us/en/legal/digital-customs-invoice-terms.html',
    jurisdiction: 'Carrier practice (DHL Express, United States site)',
    supports:
      'DHL Paperless Trade (PLT) sending documentation electronically instead of printed copies, DHL checking from the shipment details whether PLT is available, PLT not being used where legal or customs rules require hard copies, some documents still being needed on paper, and electronic documents having to be legible',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b2-dhl-nz-prepare-shipment': {
    authority: 'DHL Express',
    title: 'Prepare your shipment on MyDHL+',
    url: 'https://www.dhl.com/discover/en-nz/starter-hub/prepare-shipment-on-mydhl',
    jurisdiction: 'Carrier practice (DHL Express, New Zealand site)',
    supports:
      'MyDHL+ offering “Create Invoice” or “Use My Own Invoice”, uploading the invoice for the digital customs invoice service, and otherwise printing two hard copies to attach',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
