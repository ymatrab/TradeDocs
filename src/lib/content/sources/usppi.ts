import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources first cited by wave C batch 6: the glossary terms usppi, container-seal-number,
 * advance-shipping-notice, master-carton, bill-of-exchange, customs-declaration,
 * tariff-rate-quota, countervailing-duty and anti-dumping-duty, and the country pages germany
 * and south-korea. Each URL was opened on the retrieval date and checked against the claim in
 * `supports`. None of them is cited for a duty rate.
 */
const RETRIEVED = '2026-10-08';
const PENDING = 'pending owner review';

export default {
  'c6-ftr-30-1-parties': {
    authority: 'U.S. Census Bureau, Foreign Trade Regulations (15 CFR 30.1), via Cornell LII',
    title: '15 CFR § 30.1 — Purpose and definitions',
    url: 'https://www.law.cornell.edu/cfr/text/15/30.1',
    jurisdiction: 'United States (export reporting)',
    supports:
      'the USPPI as the person in the United States that receives the primary benefit, monetary or otherwise, from the export transaction; the FPPI as the person abroad who purchases the goods or receives final delivery; the authorized agent acting under a power of attorney or written authorization; and the filer as the USPPI or authorized agent who submits the EEI in AES',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c6-ftr-30-6-usppi': {
    authority: 'U.S. Census Bureau, Foreign Trade Regulations (15 CFR 30.6), via Cornell LII',
    title: '15 CFR § 30.6 — Electronic Export Information data elements',
    url: 'https://www.law.cornell.edu/cfr/text/15/30.6',
    jurisdiction: 'United States (export reporting)',
    supports:
      'the USPPI data element: the name of the USPPI in the transaction, the address of origin where the goods begin their journey to the port of export, the USPPI’s Employer Identification Number, a foreign entity in the United States when the goods are bought being the USPPI, and the contact person with most knowledge of the shipment',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c6-cbp-seal-requirements': {
    authority: 'U.S. Customs and Border Protection (FAST and CTPAT)',
    title: 'Seal Requirements for Manufacturers',
    url: 'https://www.cbp.gov/travel/trusted-traveler-programs/fast/seal-requirements-manufacturers',
    jurisdiction: 'United States (CTPAT and FAST participants)',
    supports:
      'seals affixed at the manufacturer’s point of loading, seals of the high-security type under ISO/PAS 17712, a system to verify seal numbers against weights and quantities, a log of seal numbers issued and used, and manifests, bills of lading and electronic transmissions carrying the seal information',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c6-gs1-desadv': {
    authority: 'GS1, EANCOM 2002 S4 message guidelines',
    title: 'DESADV — Despatch advice message, Introduction',
    url: 'https://www.gs1.org/sites/default/files/docs/eancom/ean02s4/part2/desadv/intro.htm',
    jurisdiction: 'International (supply-chain messaging standard)',
    supports:
      'the despatch advice as a message specifying details for goods despatched or ready for despatch, sent before the goods are physically delivered, letting the recipient know when goods were despatched, have the consignment details, start customs clearance steps and check goods against the following invoice, with each pallet or carton uniquely identified, recommended by the GS1 SSCC',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c6-x12-856': {
    authority: 'X12 (ANSI-accredited EDI standards body)',
    title: '856 Ship Notice/Manifest transaction set',
    url: 'https://x12.org/node/4398',
    jurisdiction: 'International (EDI standard, mainly North America)',
    supports:
      'the 856 Ship Notice/Manifest listing the contents of a shipment with order information, product description, physical characteristics, type of packaging, marking, carrier information and the configuration of goods in the transport equipment, sent by the party responsible for communicating the contents',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c6-gs1-us-logistics-label': {
    authority: 'GS1 US',
    title: 'Logistics Label Guidance for Food Industry',
    url: 'https://www.gs1us.org/industries-and-insights/by-industry/retail-grocery/implementation-resources-for-standards/logistics-label-guidance',
    jurisdiction: 'United States (supply-chain standard)',
    supports:
      'guidance on applying a Serial Shipping Container Code (SSCC) on a GS1 logistics label in conjunction with an Advance Ship Notice',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c6-cfr-19-134-22': {
    authority: 'U.S. Customs and Border Protection (19 CFR 134.22), via Cornell LII',
    title: '19 CFR § 134.22 — General rules for marking of containers or holders',
    url: 'https://www.law.cornell.edu/cfr/text/19/134.22',
    jurisdiction: 'United States (imports)',
    supports:
      'the outermost container in which an article ordinarily reaches the ultimate purchaser being marked with the country of origin of its contents where the article is excepted from marking, and containers bearing a U.S. name and address showing the contents’ origin near it',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c6-uk-bills-of-exchange-act-s3': {
    authority: 'UK Parliament, via legislation.gov.uk',
    title: 'Bills of Exchange Act 1882, section 3: Bill of exchange defined',
    url: 'https://www.legislation.gov.uk/ukpga/Vict/45-46/61/section/3',
    jurisdiction: 'United Kingdom',
    supports:
      'the statutory definition of a bill of exchange as an unconditional order in writing, addressed by one person to another, signed by the person giving it, requiring the addressee to pay on demand or at a fixed or determinable future time a sum certain in money to or to the order of a specified person, or to bearer',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c6-icc-collections': {
    authority: 'International Chamber of Commerce (ICC Academy)',
    title: 'Key trade finance products: definitions and use cases',
    url: 'https://academy.iccwbo.org/trade-finance/article/key-trade-finance-products-definitions-and-use-cases/',
    jurisdiction: 'International (trade finance practice)',
    supports:
      'documentary collections settling on a sight or usance basis, usually involving a bill of exchange (draft) that is a legal demand on the importer to pay on presentation or to accept and pay later, collections commonly following ICC URC 522, and banks acting as agents without liability beyond the collection instruction',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c6-wco-rkc-ch3': {
    authority: 'World Customs Organization (WCO), Revised Kyoto Convention',
    title: 'Revised Kyoto Convention, General Annex, Chapter 3: Clearance and other Customs formalities',
    url: 'https://www.wcoomd.org/en/topics/facilitation/instrument-and-tools/conventions/pf_revised_kyoto_conv/kyoto_new/gach3.aspx',
    jurisdiction: 'International (customs procedures)',
    supports:
      'any person with the right to dispose of the goods being entitled to act as declarant, the contents of the goods declaration being prescribed by customs and limited to necessary particulars, electronic lodging of the declaration and its supporting documents, provisional or incomplete declarations completed later, and lodging before the goods arrive',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c6-wto-agriculture-tariff-quotas': {
    authority: 'World Trade Organization (WTO), Understanding the WTO',
    title: 'Agriculture: fairer markets for farmers',
    url: 'https://www.wto.org/english/thewto_e/whatis_e/tif_e/agrm3_e.htm',
    jurisdiction: 'International (WTO members)',
    supports:
      'tariff quotas as lower tariff rates for specified quantities and higher rates for quantities that exceed the quota, introduced when agricultural quotas were converted to tariffs in the Uruguay Round, with the commitments listed in members’ schedules',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c6-cbp-quota-faq': {
    authority: 'U.S. Customs and Border Protection',
    title: 'Quota FAQs',
    url: 'https://www.cbp.gov/trade/priority-issues/quotas/quota-faq',
    jurisdiction: 'United States (imports)',
    supports:
      'absolute quotas, tariff-rate quotas and tariff preference levels; a tariff-rate quota letting a specified quantity enter at a reduced duty rate in a period, with excess quantities entering at higher rates; quota priority by date and time of presentation; and an entry summary returned for correction losing its place',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c6-wto-trade-remedies': {
    authority: 'World Trade Organization (WTO), Understanding the WTO',
    title: 'Anti-dumping, subsidies, safeguards: contingencies, etc',
    url: 'https://www.wto.org/english/thewto_e/whatis_e/tif_e/agrm8_e.htm',
    jurisdiction: 'International (WTO members)',
    supports:
      'dumping as exporting below the price normally charged at home; anti-dumping action allowed where dumping causes material injury, shown by investigation, typically as extra import duty on the product from the exporting country, expiring after five years unless a review finds otherwise; countervailing duty on subsidized imports hurting domestic producers, after a similar investigation, with specific, prohibited and actionable subsidies; and price undertakings as an alternative',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c6-cbp-adcvd': {
    authority: 'U.S. Customs and Border Protection',
    title: 'Antidumping and Countervailing Duties (AD/CVD)',
    url: 'https://www.cbp.gov/trade/priority-issues/adcvd',
    jurisdiction: 'United States (imports)',
    supports:
      'CBP collecting antidumping and countervailing duties when the Department of Commerce finds merchandise sold in the U.S. at an unfairly low or subsidized price, and the AD/CVD case information and USITC list of orders in effect it links to',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c6-trade-gov-adcvd-faq': {
    authority: 'International Trade Administration, Enforcement and Compliance',
    title: 'FAQs for the Initiation of an Antidumping Duty and/or Countervailing Duty Investigation',
    url: 'https://www.trade.gov/faq/faqs-initiation-antidumping-duty-andor-countervailing-duty-investigation',
    jurisdiction: 'United States (imports)',
    supports:
      'petitions filed by U.S. producers or workers, Commerce initiating AD or CVD investigations and sending questionnaires to foreign producers, the U.S. International Trade Commission deciding whether there is a reasonable indication of material injury, and CBP collecting cash deposits after affirmative preliminary determinations',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c6-zoll-release-free-circulation': {
    authority: 'Generalzolldirektion (German Customs, Zoll)',
    title: 'Release for free circulation',
    url: 'https://www.zoll.de/EN/Businesses/Movement-of-goods/Import/Procedures/Release-for-free-circulation/release-for-free-circulation_node.html',
    jurisdiction: 'Germany (European Union customs territory)',
    supports:
      'goods from a third country being placed under release for free circulation before they can be freely disposed of; the declarant being established in the EU customs territory or represented by a person established there, with an exception for occasional declarations accepted by the clearing office; and the procedure normally assuming import charges such as customs duty and import VAT are paid',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c6-zoll-eori': {
    authority: 'Generalzolldirektion (German Customs, Zoll)',
    title: 'EORI number',
    url: 'https://www.zoll.de/EN/Businesses/Movement-of-goods/Import/Duties-and-taxes/EORI-number/eori-number_node.html',
    jurisdiction: 'Germany (European Union customs territory)',
    supports:
      'the EORI number as an EU-wide operator identification number that replaced the German customs number and is a prerequisite for customs clearance, requested free of charge from the Central Customs Authority through the Customs Portal (mandatory from 1 October 2026), and quoted when lodging customs declarations and entry and exit summary declarations',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c6-zoll-entry-summary': {
    authority: 'Generalzolldirektion (German Customs, Zoll)',
    title: 'Entry summary declaration',
    url: 'https://www.zoll.de/EN/Businesses/Movement-of-goods/Import/Duties-and-taxes/Entry-summary-declaration/entry-summary-declaration_node.html',
    jurisdiction: 'Germany (European Union customs territory)',
    supports:
      'an entry summary declaration (Summarische Eingangsanmeldung, ESumA) lodged before goods are moved into the Union’s customs territory for security and safety risk analysis, lodged electronically through ATLAS-EAS at the first customs office of entry, and distinct from the summary declaration for temporary storage',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c6-zoll-normal-clearance': {
    authority: 'Generalzolldirektion (German Customs, Zoll)',
    title: 'Normal customs clearance',
    url: 'https://www.zoll.de/EN/Businesses/Movement-of-goods/Import/Duties-and-taxes/Normal-customs-clearance/normal-customs-clearance_node.html',
    jurisdiction: 'Germany (European Union customs territory)',
    supports:
      'duty being payable in principle on goods imported from a third country, its level depending on the product’s TARIC code, the Common Customs Tariff nomenclature, and the customs value as the basis for ad valorem duties',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'trade-gov-ccg-de': {
    authority: 'International Trade Administration, Country Commercial Guide',
    title: 'Germany — Import Requirements and Documentation',
    url: 'https://www.trade.gov/country-commercial-guides/germany-import-requirements-and-documentation',
    jurisdiction: 'Germany',
    supports:
      'Germany’s import requirements being those set out in the European Union Country Commercial Guide chapter (page last published 2025-08-01)',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'trade-gov-ccg-eu': {
    authority: 'International Trade Administration, Country Commercial Guide',
    title: 'European Union — Import Requirements and Documentation',
    url: 'https://www.trade.gov/country-commercial-guides/eu-import-requirements-and-documentation',
    jurisdiction: 'European Union',
    supports:
      'the Single Administrative Document as the EU importer’s declaration covering customs duties and VAT and filed by the importer or its agent; U.S. companies using an EORI number, requested from the customs authority of the first Member State they export to; and the Union Customs Code as the legal framework, applying since May 2016 (page last published 2026-05-06)',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'trade-gov-ccg-kr': {
    authority: 'International Trade Administration, Country Commercial Guide',
    title: 'South Korea — Import Requirements and Documentation',
    url: 'https://www.trade.gov/country-commercial-guides/south-korea-import-requirements-and-documentation',
    jurisdiction: 'Republic of Korea',
    supports:
      'an original commercial invoice and two copies showing total and unit value, quantity, marks, description and shipping details; two copies of the packing list; a clean bill of lading or air waybill; a marine insurance certificate where the exporter insures; the import declaration usually prepared by the importer in Korean; origin records kept for five years; and MFDS registration with licensed importers for medical devices and pharmaceuticals (page last published 2026-06-29)',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c6-kcs-import-declaration': {
    authority: 'Korea Customs Service (KCS)',
    title: 'Import Declaration Guideline',
    url: 'https://www.customs.go.kr/english/cm/cntnts/cntntsView.do?cntntsId=2731&mi=8055',
    jurisdiction: 'Republic of Korea',
    supports:
      'import clearance handled in the KCS electronic clearance system UNI-PASS, declarations made by a customs broker or the owner of the goods, filing allowed before the goods arrive, the import declaration supported by an invoice, packing list, bill of lading, certificate of origin and quarantine inspection certificate, risk-based selection for inspection, and tax payment after acceptance',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c6-trade-gov-kr-labeling': {
    authority: 'International Trade Administration, Country Commercial Guide',
    title: 'South Korea — Labeling/Marking Requirements',
    url: 'https://www.trade.gov/country-commercial-guides/south-korea-labelingmarking-requirements',
    jurisdiction: 'Republic of Korea',
    supports:
      'country of origin labelling being required for commercial shipments entering Korea, KCS publishing origin-labelling requirements by HS code in Korean, English labelling having to match the Korean labels, and Korean labels attachable in bonded areas while origin marks are visible at clearance (page last published 2026-06-29)',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c6-trade-gov-kr-standards': {
    authority: 'International Trade Administration, Country Commercial Guide',
    title: 'South Korea — Standards for Trade',
    url: 'https://www.trade.gov/country-commercial-guides/south-korea-standards-trade',
    jurisdiction: 'Republic of Korea',
    supports:
      'the KC Mark, issued by the Korean Agency for Technology and Standards since 1 July 2009 for items under its jurisdiction, to reduce repetitive testing across ministries (page last published 2023-12-05)',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
