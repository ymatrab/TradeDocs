import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources first cited by the wave D articles first-sale-rule, invoice-legalization,
 * commercial-invoice-for-returns-and-repairs, de-minimis and power-of-attorney-for-customs.
 * Each URL was opened on 2026-10-08 and the cited sentence checked. Thresholds and dates are
 * cited only where the official page states them.
 */
export default {
  // first-sale-rule
  'd1-cornell-19-cfr-152-103': {
    authority: 'Legal Information Institute, Cornell Law School (US Code of Federal Regulations)',
    title: '19 CFR § 152.103: Transaction value',
    url: 'https://www.law.cornell.edu/cfr/text/19/152.103',
    jurisdiction: 'United States (import valuation)',
    supports:
      'the price actually paid or payable being considered without regard to its method of derivation, a related-party transaction value being acceptable where the relationship did not influence the price or it closely approximates a test value, and a transaction value not being disregarded solely because buyer and seller are related',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'd1-cbp-icp-bona-fide-sales': {
    authority: 'U.S. Customs and Border Protection (CBP)',
    title:
      'What Every Member of the Trade Community Should Know About: Bona Fide Sales & Sales for Exportation to the United States (Informed Compliance Publication, August 2005)',
    url: 'https://cbp.gov/sites/default/files/assets/documents/2020-Feb/ICP-Bona-Fide-Sales-2005-Final.pdf',
    jurisdiction: 'United States (import valuation)',
    supports:
      'the presumption that transaction value is based on the price paid by the importer and the importer’s burden to rebut it, the Nissho Iwai standard (arm’s length, free of non-market influences, clearly destined for the United States), title and risk of loss as signs of a bona fide sale, the definition of a middleman in a multi-tiered transaction, related parties and test values, evidence that goods were clearly destined (US buyer specifications, labels, stock numbers, direct shipment), the complete paper trail, and information on statutory additions such as assists',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'd1-cbp-ruling-h347879': {
    authority: 'U.S. Customs and Border Protection (CBP), CROSS rulings',
    title: 'HQ H347879 (12 September 2025): Toys; transaction value; first sale',
    url: 'https://rulings.cbp.gov/ruling/H347879',
    jurisdiction: 'United States (import valuation)',
    supports:
      'CBP restating the Nissho Iwai standard in 2025, presuming that transaction value is based on the price paid by the importer, listing purchase orders, invoices, proof of payment, contracts and correspondence as the evidence it reviews, and finding no bona fide first sale where delivery terms alone did not show the middleman held title or bore risk of loss',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },

  // invoice-legalization
  'd1-hcch-apostille-convention': {
    authority: 'Hague Conference on Private International Law (HCCH)',
    title: 'Convention of 5 October 1961 Abolishing the Requirement of Legalisation for Foreign Public Documents (full text)',
    url: 'https://www.hcch.net/en/instruments/conventions/full-text/?cid=41',
    jurisdiction: 'International (legalisation of documents)',
    supports:
      'legalisation meaning the formality by which diplomatic or consular agents of the country where a document is produced certify the authenticity of the signature, the signer’s capacity and any seal, and the Convention not applying to administrative documents dealing directly with commercial or customs operations',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'd1-trade-gov-special-documents': {
    authority: 'International Trade Administration (ITA), trade.gov',
    title: 'Special Documents',
    url: 'https://www.trade.gov/special-documents',
    jurisdiction: 'United States (export)',
    supports:
      'a consular invoice being required in some countries, describing the shipment and showing information such as consignor, consignee and value, copies being available from the destination country’s embassy or consulate in the United States, and the cost being potentially significant and worth discussing with the buyer',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'd1-trade-gov-ccg-eg-import': {
    authority: 'International Trade Administration (ITA), trade.gov',
    title: 'Egypt: Import Requirements and Documentation (Country Commercial Guide, published 2025-11-21)',
    url: 'https://www.trade.gov/country-commercial-guides/egypt-import-requirements-documentation',
    jurisdiction: 'Egypt (import)',
    supports:
      'legalization of commercial invoices by the Egyptian consulate in the country of origin being required in most cases',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'd1-trade-gov-ccg-ae-import': {
    authority: 'International Trade Administration (ITA), trade.gov',
    title:
      'United Arab Emirates: Import Requirements and Documentation (Country Commercial Guide, published 2025-08-25)',
    url: 'https://www.trade.gov/country-commercial-guides/united-arab-emirates-import-requirements-and-documentation',
    jurisdiction: 'United Arab Emirates (import)',
    supports:
      'attestation of commercial invoices and shipping documents being handled through the UAE Ministry of Foreign Affairs',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'd1-uae-mofa-attestation': {
    authority: 'UAE Ministry of Foreign Affairs',
    title: 'Attestation services',
    url: 'https://www.mofa.gov.ae/en/services/attestation',
    jurisdiction: 'United Arab Emirates (document attestation)',
    supports:
      'commercial invoices being attested through the Ministry’s electronic documents attestation system (eDAS 2.0) rather than its general attestation service, and fees depending on factors including whether a document is commercial',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'd1-trade-gov-ccg-sa-import': {
    authority: 'International Trade Administration (ITA), trade.gov',
    title:
      'Saudi Arabia: Import Requirements and Documentation (Country Commercial Guide, published 2026-05-11)',
    url: 'https://www.trade.gov/country-commercial-guides/saudi-arabia-import-requirements-and-documentation',
    jurisdiction: 'Saudi Arabia (import)',
    supports:
      'the Saudi government requiring that US chambers of commerce perform the authentication of shipping documents, and pointing to the National US-Arab Chamber of Commerce for more information',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },

  // commercial-invoice-for-returns-and-repairs
  'd1-cbp-9801-requirements': {
    authority: 'U.S. Customs and Border Protection (CBP)',
    title:
      'Requirements for Importers and Brokers Regarding HTS Subheading 9801.00.10: U.S. and Foreign Goods Returned (last modified 5 June 2023)',
    url: 'https://www.cbp.gov/trade/programs-administration/entry-summary/hts-subheading-9801',
    jurisdiction: 'United States (import)',
    supports:
      'subheading 9801.00.10 covering US products returned after export and other products returned within 3 years, without being advanced in value or improved in condition abroad, no time limit for US-origin products, and CBP possibly requesting a foreign shipper declaration and an importer or owner declaration for shipments valued over $2,500',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'd1-cornell-19-cfr-10-1': {
    authority: 'Legal Information Institute, Cornell Law School (US Code of Federal Regulations)',
    title: '19 CFR § 10.1: Domestic products; requirements on entry',
    url: 'https://www.law.cornell.edu/cfr/text/19/10.1',
    jurisdiction: 'United States (import)',
    supports:
      'the declarations for shipments valued over $2,500 claimed under 9801.00.10 or 9802.00.20: the foreign shipper’s declaration (port and approximate date of export, marks, numbers, quantity, description, value, no advance in value or improvement in condition) and the owner or importer’s declaration (truth of the shipper’s statement, manufacturer, export without drawback)',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'd1-cornell-19-cfr-10-8': {
    authority: 'Legal Information Institute, Cornell Law School (US Code of Federal Regulations)',
    title: '19 CFR § 10.8: Articles exported for repairs or alterations',
    url: 'https://www.law.cornell.edu/cfr/text/19/10.8',
    jurisdiction: 'United States (import)',
    supports:
      'the two declarations for goods returned after repair or alteration under 9802.00.40 or 9802.00.50 (by the person who performed the work and by the owner or importer), the fields they carry (marks and numbers, description of articles and of repairs, full cost or value of repairs, total value after repairs), duty limited to the cost or value of the work done abroad, and the possible waiver',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'd1-gov-uk-returned-goods-relief': {
    authority: 'HM Revenue & Customs (GOV.UK)',
    title: 'Pay less import duty and VAT when re-importing goods to the UK (updated 26 November 2024)',
    url: 'https://www.gov.uk/guidance/pay-less-import-duty-and-vat-when-re-importing-goods-to-the-uk-and-eu',
    jurisdiction: 'United Kingdom (import)',
    supports:
      'Returned Goods Relief for goods previously exported from the UK, the 3-year limit, re-import in an unaltered state apart from maintenance, relief where an intended repair was not carried out, the original export declaration or alternatives such as the export invoice or bill of lading as evidence, the exporter and importer being the same person for VAT relief, procedure codes for freight, and keeping records for at least 4 years',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'd1-gov-uk-outward-processing': {
    authority: 'HM Revenue & Customs (GOV.UK)',
    title: 'Using outward processing to process or repair your goods (updated 8 May 2026)',
    url: 'https://www.gov.uk/guidance/using-outward-processing-to-process-or-repair-your-goods',
    jurisdiction: 'United Kingdom (export and re-import)',
    supports:
      'outward processing for goods sent abroad for repair, duty at re-import on charges made for repair or replacement plus inward shipping and insurance, the authorisation number on the export and import declarations, proof the goods were exported under outward processing, and authorisation by declaration for repair and return',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'd1-gov-uk-op-free-of-charge-repairs': {
    authority: 'HM Revenue & Customs (GOV.UK)',
    title:
      'Special procedure: outward processing. Duties calculation on goods for repair or replaced free of charge (updated 25 February 2026)',
    url: 'https://www.gov.uk/guidance/special-procedure-outward-processing/duties-calculation-on-goods-for-repair-or-replaced-free-of-charge',
    jurisdiction: 'United Kingdom (re-import)',
    supports:
      'no duty being due on authorised outward processing goods repaired or replaced free of charge under a guarantee, proof of the free-of-charge repair being produced with the import declaration, and VAT being due on the full customs value of free replacement goods',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },

  // de-minimis
  'd1-cbp-ecommerce-faqs': {
    authority: 'U.S. Customs and Border Protection (CBP)',
    title: 'E-Commerce Frequently Asked Questions (last modified 2 September 2026)',
    url: 'https://www.cbp.gov/trade/basic-import-export/e-commerce/faqs',
    jurisdiction: 'United States (import)',
    supports:
      'the indefinite suspension of the de minimis exemption for merchandise valued at $800 or less arriving by all modes including the international postal network, formal or informal entry being required, informal entry generally allowed for shipments valued at $2,500 or less, the mail informal entry process taking effect on 24 July 2026, and the bona fide gift and traveller exemptions remaining unchanged',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'd1-whitehouse-eo-14324': {
    authority: 'The White House',
    title: 'Executive Order 14324: Suspending Duty-Free De Minimis Treatment for All Countries (30 July 2025)',
    url: 'https://www.whitehouse.gov/presidential-actions/2025/07/suspending-duty-free-de-minimis-treatment-for-all-countries/',
    jurisdiction: 'United States (import)',
    supports:
      'the duty-free de minimis exemption under 19 U.S.C. 1321(a)(2)(C) no longer applying to any shipment, on a global basis, from 12:01 a.m. eastern daylight time on 29 August 2025',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'd1-cbp-low-value-rules-2026': {
    authority: 'U.S. Customs and Border Protection (CBP)',
    title: 'CBP modernizes low-value shipment processing (news release, 24 June 2026)',
    url: 'https://www.cbp.gov/newsroom/national-media-release/cbp-modernizes-low-value-shipment-processing',
    jurisdiction: 'United States (import)',
    supports:
      'CBP issuing rules in June 2026 that indefinitely suspend duty-free de minimis treatment for imports valued at $800 or less, require more detailed information on international mail shipments, and test an electronic entry process for mail',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'd1-gov-uk-goods-sent-from-abroad': {
    authority: 'GOV.UK',
    title: 'Tax and customs for goods sent from abroad: tax and duty',
    url: 'https://www.gov.uk/goods-sent-from-abroad/tax-and-duty',
    jurisdiction: 'United Kingdom (import)',
    supports:
      'VAT being charged on all goods sent to Great Britain from abroad except gifts worth £39 or less, no customs duty on non-excise goods worth £135 or less, customs duty on excise goods of any value, and sellers including VAT in the price of goods worth £135 or less',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'd1-ec-eur3-low-value-parcels': {
    authority: 'European Commission',
    title: 'Ensuring fairness and safety: €3 customs duty on low-value parcels (news, 29 June 2026)',
    url: 'https://commission.europa.eu/news-and-media/news/ensuring-fairness-and-safety-eur3-customs-duty-low-value-parcels-2026-06-29_en',
    jurisdiction: 'European Union (import)',
    supports:
      'a temporary €3 customs duty from 1 July 2026 on low-value parcels worth up to €150 imported from outside the EU, applied per item by tariff classification rather than quantity, replacing the customs duty exemption',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'd1-ec-low-value-consignments': {
    authority: 'European Commission, Taxation and Customs Union',
    title: 'Customs formalities for low value consignments',
    url: 'https://taxation-customs.ec.europa.eu/customs/customs-procedures-import-and-export/customs-operations/customs-formalities-low-value-consignments_en',
    jurisdiction: 'European Union (import)',
    supports:
      'an import declaration being required for all goods entering the EU regardless of value from 1 July 2021, and the abolition from that date of the VAT exemption for imported goods below €22',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },

  // power-of-attorney-for-customs
  'd1-cornell-19-cfr-141-32': {
    authority: 'Legal Information Institute, Cornell Law School (US Code of Federal Regulations)',
    title: '19 CFR § 141.32: Form for power of attorney',
    url: 'https://www.law.cornell.edu/cfr/text/19/141.32',
    jurisdiction: 'United States (import)',
    supports:
      'Customs Form 5291 being usable to give power of attorney to transact customs business, another document being acceptable if it is a general power of attorney with unlimited authority or a limited one executed in the same manner, and the sample general power of attorney wording',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'd1-cornell-19-cfr-141-34': {
    authority: 'Legal Information Institute, Cornell Law School (US Code of Federal Regulations)',
    title: '19 CFR § 141.34: Duration of powers of attorney',
    url: 'https://www.law.cornell.edu/cfr/text/19/141.34',
    jurisdiction: 'United States (import)',
    supports:
      'powers of attorney issued by a partnership being limited to 2 years from execution, and all others being grantable for an unlimited period',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'd1-cornell-19-cfr-141-35': {
    authority: 'Legal Information Institute, Cornell Law School (US Code of Federal Regulations)',
    title: '19 CFR § 141.35: Revocation',
    url: 'https://www.law.cornell.edu/cfr/text/19/141.35',
    jurisdiction: 'United States (import)',
    supports:
      'any power of attorney being revocable at any time by written notice given to and received by CBP, at the port of entry or electronically',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'd1-cornell-19-cfr-141-37': {
    authority: 'Legal Information Institute, Cornell Law School (US Code of Federal Regulations)',
    title: '19 CFR § 141.37: Corporations',
    url: 'https://www.law.cornell.edu/cfr/text/19/141.37',
    jurisdiction: 'United States (import)',
    supports:
      'a nonresident corporation not qualified to do business in the state where the agent acts supporting its power of attorney with documentation of the grantor’s authority',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'd1-cornell-19-cfr-141-46': {
    authority: 'Legal Information Institute, Cornell Law School (US Code of Federal Regulations)',
    title: '19 CFR § 141.46: Powers of attorney retained by customhouse brokers',
    url: 'https://www.law.cornell.edu/cfr/text/19/141.46',
    jurisdiction: 'United States (import)',
    supports:
      'customs brokers retaining powers of attorney with their books and papers and not being required to file them with CBP',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'd1-cornell-19-cfr-111-36': {
    authority: 'Legal Information Institute, Cornell Law School (US Code of Federal Regulations)',
    title: '19 CFR § 111.36: Relations with unlicensed persons',
    url: 'https://www.law.cornell.edu/cfr/text/19/111.36',
    jurisdiction: 'United States (customs brokers)',
    supports:
      'a broker working with a freight forwarder executing the customs power of attorney directly with the importer of record, not through the forwarder or another third party',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'd1-cbp-broker-faqs': {
    authority: 'U.S. Customs and Border Protection (CBP)',
    title: 'Customs Broker Frequently Asked Questions',
    url: 'https://www.cbp.gov/trade/programs-administration/customs-brokers/frequently-asked-questions',
    jurisdiction: 'United States (customs brokers)',
    supports:
      'a broker executing a power of attorney directly with the importer of record or drawback claimant, who must sign it themselves, a freight forwarder not being able to assign a power of attorney to a broker, and CBP not having changed the standard power of attorney language in 19 CFR 141.32',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'd1-cbp-validating-poa': {
    authority: 'U.S. Customs and Border Protection (CBP)',
    title: 'Validating the Power of Attorney and Electronic Signatures (last modified 6 March 2024)',
    url: 'https://www.cbp.gov/trade/programs-administration/customs-brokers/validating-power-attorney',
    jurisdiction: 'United States (customs brokers)',
    supports:
      'brokers examining the power of attorney carefully, completing it in person where possible, and checking that the importer’s name, importer number and Employer Identification Number match what is in ACE',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'd1-cornell-15-cfr-30-3': {
    authority: 'Legal Information Institute, Cornell Law School (US Code of Federal Regulations)',
    title: '15 CFR § 30.3: Electronic Export Information filer requirements, parties to export transactions, and responsibilities of parties to export transactions',
    url: 'https://www.law.cornell.edu/cfr/text/15/30.3',
    jurisdiction: 'United States (export)',
    supports:
      'the USPPI giving an authorized agent a power of attorney or written authorization to file the EEI, the agent obtaining one from a principal party in interest, the authorization specifying responsibilities with particularity, and the FPPI giving written authorization in routed export transactions',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'd1-gov-uk-appoint-customs-agent': {
    authority: 'HM Revenue & Customs (GOV.UK)',
    title: 'Appoint someone to deal with customs on your behalf (updated 6 February 2025)',
    url: 'https://www.gov.uk/guidance/appoint-someone-to-deal-with-customs-on-your-behalf',
    jurisdiction: 'United Kingdom (customs representation)',
    supports:
      'a representative not being able to act without written instructions, those instructions showing whether they act directly or indirectly, confirming the terms of representation in writing, HMRC asking for evidence of the authorisation only if needed, and the trader keeping due diligence responsibility',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
} satisfies Record<string, SourceFields>;
