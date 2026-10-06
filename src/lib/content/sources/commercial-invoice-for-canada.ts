import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources first cited by the write-2 posts: fob-price, incoterms-for-importing-from-china,
 * commercial-invoice-ups-fedex-dhl, commercial-invoice-for-canada,
 * commercial-invoice-for-samples and shipping-marks. Each page was opened and the cited
 * claim checked on the retrieval date.
 */
const RETRIEVED = '2026-10-06';
const PENDING = 'pending owner review';

export default {
  'w2-cornell-19-usc-1401a': {
    authority: 'Legal Information Institute, Cornell Law School (U.S. Code)',
    title: '19 U.S. Code § 1401a — Value',
    url: 'https://www.law.cornell.edu/uscode/text/19/1401a',
    jurisdiction: 'United States (imports)',
    supports:
      'the price actually paid or payable for US customs value excluding international freight, insurance and related services from the country of exportation',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w2-cbp-importer-tips': {
    authority: 'U.S. Customs and Border Protection (CBP)',
    title: 'Tips for New Importers and Exporters',
    url: 'https://www.cbp.gov/trade/basic-import-export/importer-exporter-tips',
    jurisdiction: 'United States (imports)',
    supports:
      'the importer of record being ultimately responsible for the entry documentation and all duties, taxes and fees, and many first-time importers using a licensed customs broker',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w2-cbp-samples': {
    authority: 'U.S. Customs and Border Protection (CBP)',
    title:
      'What Every Member of the Trade Community Should Know About: Importation of Commercial Samples (informed compliance publication, PDF)',
    url: 'https://www.cbp.gov/sites/default/files/documents/icp066_3.pdf',
    jurisdiction: 'United States (imports)',
    supports:
      'the HTSUS 9811.00.60 provision for samples valued not over $1 each or marked or mutilated so they are unsuitable for sale, the “SAMPLE” marking, temporary importation and carnets for samples, and the importer’s duty of reasonable care to classify and value',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w2-cbsa-d1-4-1': {
    authority: 'Canada Border Services Agency (CBSA)',
    title: 'Memorandum D1-4-1: CBSA Invoice Requirements',
    url: 'https://www.cbsa-asfc.gc.ca/publications/dm-md/d1/d1-4-1-eng.html',
    jurisdiction: 'Canada (imports)',
    supports:
      'a commercial invoice carrying the Appendix A fields being accepted in place of Form CI1, the CAD 2,500 value-for-duty exception, English or French, the field descriptions, copies and the CBSA withholding release when documentation is missing',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w2-fedex-customs-documents': {
    authority: 'FedEx',
    title: 'Customs documents: Commercial Invoice',
    url: 'https://www.fedex.com/en-us/shipping/international/create-documents.html',
    jurisdiction: 'Carrier practice (FedEx, United States site)',
    supports:
      'the commercial invoice being required for all international commodity shipments, the three ways to complete and submit it including upload through FedEx Electronic Trade Documents, and FedEx’s guidance on specific descriptions',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w2-ups-commercial-invoice': {
    authority: 'UPS',
    title: 'How to Create a Commercial Invoice',
    url: 'https://www.ups.com/us/en/shipping/international-shipping/commercial-invoice',
    jurisdiction: 'Carrier practice (UPS, United States site)',
    supports:
      'UPS Paperless Invoice for account holders, and otherwise three signed copies (one original and two copies) included with the shipment',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w2-dhl-commercial-invoice': {
    authority: 'DHL',
    title: 'How to Prepare a Commercial Invoice for Global Shipments',
    url: 'https://www.dhl.com/discover/en-us/global-logistics-advice/essential-guides/how-to-prepare-a-commercial-invoice',
    jurisdiction: 'Carrier practice (DHL Express, United States site)',
    supports:
      'the details DHL asks for on each line and for the shipment, the reason for export and type of export fields, the air waybill number, and MyDHL+ generating the invoice during booking',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w2-ita-labeling': {
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title: 'A Basic Guide to Exporting: Labeling',
    url: 'https://beta.trade.gov/article?id=Labeling',
    jurisdiction: 'United States (export guidance)',
    supports:
      'the markings export cartons carry: shipper’s mark, country of origin, weight in pounds and kilograms, number of packages and case size, handling and cautionary marks, port of entry and hazardous-materials labels, usually specified by the buyer',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
