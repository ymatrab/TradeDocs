import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources first cited by the country page /export-documents/india. Each URL was opened on
 * the retrieval date and checked against the claim in `supports`.
 */
const RETRIEVED = '2026-10-07';
const PENDING = 'pending owner review';

export default {
  'cbic-india': {
    authority: 'Central Board of Indirect Taxes and Customs (CBIC), Ministry of Finance, India',
    title: 'CBIC — official website',
    url: 'https://www.cbic.gov.in/',
    jurisdiction: 'India',
    supports: 'the Central Board of Indirect Taxes and Customs as India’s customs administration',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'cbic-chennai-import-procedure': {
    authority: 'Chennai Customs Zone, Central Board of Indirect Taxes and Customs (CBIC)',
    title: 'Import Procedure — Procedure for Clearance of Imported Goods',
    url: 'https://chennaicustoms.gov.in/import-procedure/',
    jurisdiction: 'India',
    supports:
      'importers obtaining an Importer-Exporter Code from the DGFT before filing a bill of entry; goods cleared through the EDI system needing a cargo declaration in place of a formal bill of entry; a signed invoice, packing list, bill of lading or delivery order/airway bill and a GATT valuation declaration generally accompanying the bill of entry, with insurance documents and other certificates where applicable; and separate bills of entry for home consumption, warehousing and ex-bond clearance',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'dgft-iec': {
    authority: 'Directorate General of Foreign Trade (DGFT), Government of India',
    title: 'IEC Profile Management',
    url: 'https://www.dgft.gov.in/CP/?opt=iec-profile-management',
    jurisdiction: 'India',
    supports:
      'no export or import being made by any person without an Importer-Exporter Code unless specifically exempted, the IEC being issued by the DGFT and being the same as the firm’s PAN',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'dgft-itchs-policy': {
    authority: 'Directorate General of Foreign Trade (DGFT), Government of India',
    title: 'Import, Export and SCOMET Policy (ITC(HS) schedules)',
    url: 'https://www.dgft.gov.in/CP/?opt=itchs-import-export',
    jurisdiction: 'India',
    supports:
      'the digitised ITC(HS) import policy (Schedule 1) by HS code, with the lists of restricted, prohibited and state trading enterprise (STE) items under the import policy',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'trade-gov-ccg-in': {
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title:
      'India Country Commercial Guide: Import Requirements and Documentation (last published 20 April 2026)',
    url: 'https://www.trade.gov/country-commercial-guides/india-import-requirements-and-documentation',
    jurisdiction: 'India (U.S. government export guidance)',
    supports:
      'items on the Open General License being freely importable without a licence, with banned items, restricted items that need a licence and canalised items imported only through government agencies, and import documents having to be accompanied by any import licence the goods need',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
