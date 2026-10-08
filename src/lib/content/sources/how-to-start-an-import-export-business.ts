import type { SourceFields } from '@/lib/trade/sources';

const RETRIEVED = '2026-10-08';
const PENDING = 'pending owner review';

/**
 * Sources first cited by the wave C posts how-to-start-an-import-export-business,
 * letter-of-indemnity, pre-shipment-inspection, partial-shipments and
 * export-compliance-checklist. Each URL was opened on 2026-10-08 and the cited sentence checked.
 */
export default {
  'c1-sba-business-structure': {
    authority: 'U.S. Small Business Administration (SBA)',
    title: 'Choose a business structure',
    url: 'https://www.sba.gov/business-guide/launch-your-business/choose-business-structure',
    jurisdiction: 'United States',
    supports:
      'a sole proprietor being personally liable for the business’s debts, LLCs protecting owners from personal liability in most instances, and corporations offering the strongest protection and paying income tax on their profits',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c1-sba-tax-id': {
    authority: 'U.S. Small Business Administration (SBA)',
    title: 'Get federal and state tax ID numbers',
    url: 'https://www.sba.gov/business-guide/launch-your-business/get-federal-state-tax-id-numbers',
    jurisdiction: 'United States',
    supports:
      'the EIN being the business’s federal tax ID number, needed to pay federal taxes, hire employees, open a bank account and apply for licences and permits, and being free to apply for from the IRS',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c1-sba-licenses-permits': {
    authority: 'U.S. Small Business Administration (SBA)',
    title: 'Apply for licenses and permits',
    url: 'https://www.sba.gov/business-guide/launch-your-business/apply-licenses-permits',
    jurisdiction: 'United States',
    supports:
      'federal licences or permits for importing or exporting certain goods (USDA for animals, animal products and plants; Fish and Wildlife Service for wildlife; TTB for alcohol; ATF for firearms, ammunition and explosives) and states regulating a broader range of activities than the federal government',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c1-sba-export-products': {
    authority: 'U.S. Small Business Administration (SBA)',
    title: 'Export products',
    url: 'https://www.sba.gov/business-guide/grow-your-business/export-products',
    jurisdiction: 'United States',
    supports:
      'U.S. Export Assistance Centers helping businesses explore exporting, Small Business Development Centers offering free consulting and low-cost training, and SBA export finance programs giving lenders up to a 90% guaranty on export loans',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c1-ita-export-solutions': {
    authority: 'International Trade Administration (ITA), U.S. Department of Commerce',
    title: 'Export Solutions',
    url: 'https://www.trade.gov/export-solutions',
    jurisdiction: 'United States',
    supports:
      'the U.S. Commercial Service offering services for companies new to exporting, market research by country and industry, and a three-phase Export Solutions Roadmap',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c1-ita-common-export-documents': {
    authority: 'International Trade Administration (ITA), U.S. Department of Commerce',
    title: 'Common Export Documents',
    url: 'https://www.trade.gov/common-export-documents',
    jurisdiction: 'United States (exports)',
    supports:
      'certain products needing certificates showing cleanliness, compliance with standards, safety and health, and other products needing pre-shipment inspections before leaving the country of export',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c1-ukpandi-letters-of-indemnity': {
    authority: 'UK P&I Club (a member of the International Group of P&I Clubs)',
    title: 'Letters of indemnity',
    url: 'https://www.ukpandi.com/knowledge-publications/article/letters-of-indemnity-1161/',
    jurisdiction: 'International (ocean carriage)',
    supports:
      'letters of indemnity being requested for delivery without production of the bill of lading, delivery at a port other than the one on the bill and clean bills where the goods should be claused; mis-delivery liabilities not being covered by P&I insurance and an LOI not restoring that cover; the Clubs’ recommended standard forms and bank countersignature; and an indemnity for a knowingly false clean bill being held unenforceable in Brown Jenkinson v Percy Dalton (1957)',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c1-ucc-7-403': {
    authority: 'Uniform Commercial Code § 7-403, via Cornell LII',
    title: 'UCC § 7-403 — Obligation of bailee to deliver; excuse',
    url: 'https://www.law.cornell.edu/ucc/7/7-403',
    jurisdiction: 'United States (state commercial law)',
    supports:
      'a bailee delivering goods to a person entitled under the document of title, that person surrendering any outstanding negotiable document, and the bailee that fails to cancel or mark it being liable to a person to whom the document is duly negotiated',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c1-wto-preshipment-inspection': {
    authority: 'World Trade Organization (WTO)',
    title: 'Preshipment Inspection',
    url: 'https://www.wto.org/english/tratop_e/preship_e/preship_e.htm',
    jurisdiction: 'International (WTO members)',
    supports:
      'preshipment inspection as the use of private companies to check the price, quantity and quality of goods ordered overseas, to safeguard national financial interests, and the independent review procedure administered with the IFIA and the ICC',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c1-wto-psi-agreement': {
    authority: 'World Trade Organization (WTO)',
    title: 'Agreement on Preshipment Inspection',
    url: 'https://www.wto.org/english/docs_e/legal_e/21-psi_e.htm',
    jurisdiction: 'International (WTO members)',
    supports:
      'inspections taking place in the customs territory of export, quantity and quality inspections following the standards in the purchase agreement, a Clean Report of Findings or written reasons within five working days of the final documents and inspection, price verification to prevent over- and under-invoicing, appeals procedures, and independent review two working days after a grievance with a decision within eight working days',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c1-ucc-2-307': {
    authority: 'Uniform Commercial Code § 2-307, via Cornell LII',
    title: 'UCC § 2-307 — Delivery in single lot or several lots',
    url: 'https://www.law.cornell.edu/ucc/2/2-307',
    jurisdiction: 'United States (state commercial law)',
    supports:
      'all goods called for by a contract for sale having to be tendered in a single delivery unless otherwise agreed, with payment due only on that tender, and the price being demandable for each lot where delivery in lots is allowed',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c1-icc-ucp-31-partial-shipments': {
    authority: 'International Chamber of Commerce (ICC), DC Insight',
    title: 'Queries and responses (UCP 600 sub-article 31(a))',
    url: 'https://library.iccwbo.org/content/tfb/dcinsight/DCI_Vol15n1_QueriesAndResponses.htm',
    jurisdiction: 'International (documentary credits, UCP 600)',
    supports:
      'UCP 600 sub-article 31(a) allowing partial drawings or shipments, so a credit that is silent on the point allows them',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c1-cfr-19-141-57': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 141.57, via Cornell LII',
    title: '19 CFR § 141.57 — Single entry for split shipments',
    url: 'https://www.law.cornell.edu/cfr/text/19/141.57',
    jurisdiction: 'United States (imports)',
    supports:
      'a split shipment being delivered to a carrier under one bill of lading or waybill and divided by the carrier, a single entry at the importer’s election when the remaining portions arrive within 10 calendar days of the first, and the port director being able to deny incremental release',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c1-ftr-30-28': {
    authority: 'Foreign Trade Regulations, 15 CFR 30.28, via Cornell LII',
    title: '15 CFR § 30.28 — Split shipments',
    url: 'https://www.law.cornell.edu/cfr/text/15/30.28',
    jurisdiction: 'United States (exports)',
    supports:
      'a split shipment being one EEI record booked on one conveyance and divided by the exporting carrier, no new EEI record being needed when the parts leave within 24 hours by vessel or 7 days by air, truck or rail, and each manifest carrying a “SPLIT SHIPMENT” notation',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c1-bis-export-compliance-programs': {
    authority: 'Bureau of Industry and Security (BIS), U.S. Department of Commerce',
    title: 'Export Compliance Programs (ECPs)',
    url: 'https://www.bis.gov/learn-support/export-compliance-programs',
    jurisdiction: 'United States (export controls, EAR)',
    supports:
      'an ECP as procedures and tools that help compliance with export controls, and the eight elements: management commitment, risk assessment, export authorization, recordkeeping, training, audits, export violations and corrective actions, and building and maintaining the ECP',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c1-ear-762-6': {
    authority:
      'Bureau of Industry and Security, Export Administration Regulations (15 CFR 762.6), via Cornell LII',
    title: '15 CFR § 762.6 — Period of retention',
    url: 'https://www.law.cornell.edu/cfr/text/15/762.6',
    jurisdiction: 'United States (export controls, EAR)',
    supports:
      'records required by the EAR being kept for five years from the latest of the export, any known reexport or transfer, or other termination of the transaction',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
