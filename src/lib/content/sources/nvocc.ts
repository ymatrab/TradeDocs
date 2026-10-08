import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources first cited by the wave B glossary terms (nvocc, transshipment, freight-all-kinds,
 * exporting, importing, shipping-manifest, proof-of-delivery) and the wave B country pages
 * (brazil, china, australia, united-states). One file for the batch so writers in parallel
 * never edit the same lines. Each URL was opened on the retrieval date and checked against the
 * claim in `supports`.
 *
 * The two GACC records (english.customs.gov.cn) were read over plain HTTP on the retrieval date
 * because the HTTPS endpoint timed out from here; the URLs are recorded in their HTTPS form.
 *
 * The three ITA country guide records keep the `trade-gov-ccg-<iso2>` pattern the country test
 * looks for (as Mexico and India do); every other id in this file starts with `b7-`.
 */
const RETRIEVED = '2026-10-08';
const PENDING = 'pending owner review';

export default {
  // Glossary: ocean intermediaries and manifests (United States).
  'b7-usc-46-40102': {
    authority: 'U.S. Code, Title 46, § 40102 (Shipping Act definitions), via Cornell LII',
    title: '46 U.S. Code § 40102 — Definitions',
    url: 'https://www.law.cornell.edu/uscode/text/46/40102',
    jurisdiction: 'United States (ocean shipping)',
    supports:
      'a non-vessel-operating common carrier being a common carrier that does not operate the vessels by which the ocean transportation is provided and is a shipper in its relationship with an ocean common carrier; an ocean transportation intermediary being an ocean freight forwarder or an NVOCC; and an ocean freight forwarder being a person in the United States that dispatches shipments via a common carrier, books or arranges space on behalf of shippers and processes the documentation',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b7-cfr-46-515-2': {
    authority: 'Federal Maritime Commission, 46 CFR 515.2, via Cornell LII',
    title: '46 CFR § 515.2 — Definitions',
    url: 'https://www.law.cornell.edu/cfr/text/46/515.2',
    jurisdiction: 'United States (ocean shipping)',
    supports:
      'NVOCC services including purchasing transportation from a common carrier and reselling it, entering into affreightment agreements with underlying shippers, issuing bills of lading or other shipping documents, arranging inland transport, leasing containers and paying common carriers as a shipper on the NVOCC’s own behalf; and freight forwarding services including booking cargo space, preparing export documents and processing common carrier bills of lading',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b7-fmc-oti': {
    authority: 'Federal Maritime Commission (FMC)',
    title: 'Ocean Transportation Intermediaries',
    url: 'https://www.fmc.gov/resources-services/ocean-transportation-intermediaries/',
    jurisdiction: 'United States (ocean shipping)',
    supports:
      'U.S.-based ocean freight forwarders and NVOCCs needing an FMC licence; NVOCCs submitting proof of financial responsibility for claims; every NVOCC in the U.S. trades publishing a tariff open to public inspection with its rates, charges, classifications, rules and practices; non-U.S. NVOCCs naming an agent for service of process in the United States in their tariff',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b7-cfr-19-4-7': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 4.7, via Cornell LII',
    title: '19 CFR § 4.7 — Inward foreign manifest; production on demand; contents and form',
    url: 'https://www.law.cornell.edu/cfr/text/19/4.7',
    jurisdiction: 'United States (vessel arrivals)',
    supports:
      'the vessel manifest including the Cargo Declaration (CBP Form 1302); CBP having to receive the electronic cargo declaration 24 hours before the cargo is laden aboard the vessel at the foreign port, through the Automated Manifest System or another approved system, with exemptions for bulk and some break-bulk cargo; and an NVOCC licensed by or registered with the FMC and holding an international carrier bond being able to transmit its cargo declaration directly, or otherwise disclosing it to the vessel carrier',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b7-cfr-46-520-2': {
    authority: 'Federal Maritime Commission, 46 CFR 520.2, via Cornell LII',
    title: '46 CFR § 520.2 — Definitions (carrier automated tariffs)',
    url: 'https://www.law.cornell.edu/cfr/text/46/520.2',
    jurisdiction: 'United States (ocean shipping)',
    supports:
      'a tariff being a publication of the actual rates, charges, classifications, rules, regulations and practices of a common carrier, and a commodity rate being a rate for shipping a commodity specifically named or described in the tariff between specific locations',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b7-nmfta-fak': {
    authority: 'National Motor Freight Traffic Association (NMFTA), publisher of the NMFC',
    title: 'What Is an FAK—and How Is It Different from the NMFC? (22 May 2025)',
    url: 'https://nmfta.org/what-is-an-fak-and-how-is-it-different-from-the-nmfc',
    jurisdiction: 'United States (LTL freight classification)',
    supports:
      'freight all kinds being a pricing method in which a carrier charges one rate for several commodities; FAKs not being part of the NMFC and not being maintained or regulated by NMFTA but private arrangements between the parties; carriers being able to reclass misdescribed freight on its true NMFC characteristics and apply additional charges; and the shipper remaining responsible for describing and classifying goods accurately on the bill of lading',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  // Glossary: transshipment.
  'b7-wco-rkc-transhipment': {
    authority: 'World Customs Organization (WCO), Revised Kyoto Convention, Specific Annex E',
    title: 'Movement of goods under customs control intended for import (Specific Annex E, Chapters 1 and 2)',
    url: 'https://www.wcoomd.org/en/topics/wco-implementing-the-wto-atf/atf/movement-of-goods-under-customs-control-intended-for-import.aspx',
    jurisdiction: 'International (customs convention, applied by contracting parties)',
    supports:
      'transhipment being the customs procedure under which goods are transferred under customs control from the importing means of transport to the exporting means of transport within the area of one customs office that is the office of both importation and exportation; goods admitted to transhipment not being subject to duties and taxes when customs conditions are met; a single goods declaration being enough, with a commercial or transport document accepted as its descriptive part; and customs being able to act to identify the goods and detect tampering',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b7-cfr-19-134-1': {
    authority: 'U.S. Customs and Border Protection, 19 CFR 134.1, via Cornell LII',
    title: '19 CFR § 134.1 — Definitions (country of origin marking)',
    url: 'https://www.law.cornell.edu/cfr/text/19/134.1',
    jurisdiction: 'United States (imports)',
    supports:
      'the country of origin being the country of manufacture, production or growth of an article, and further work or material added in another country having to effect a substantial transformation to make that other country the country of origin',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  // Glossary: exporting and importing.
  'b7-ear-734-13': {
    authority: 'Bureau of Industry and Security, Export Administration Regulations, 15 CFR 734.13, via Cornell LII',
    title: '15 CFR § 734.13 — Export',
    url: 'https://www.law.cornell.edu/cfr/text/15/734.13',
    jurisdiction: 'United States (export controls, EAR)',
    supports:
      'an export including an actual shipment or transmission of an item out of the United States, in any manner, and the release of technology or source code to a foreign person in the United States being a deemed export to that person’s most recent country of citizenship or permanent residency',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b7-ftr-30-1-export': {
    authority: 'U.S. Census Bureau, Foreign Trade Regulations (15 CFR 30.1), via Cornell LII',
    title: '15 CFR § 30.1 — Purpose and definitions',
    url: 'https://www.law.cornell.edu/cfr/text/15/30.1',
    jurisdiction: 'United States (export reporting)',
    supports:
      'export meaning to send or transport goods out of a country, and the USPPI being the person in the United States that receives the primary benefit, monetary or otherwise, from the export transaction',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  // Glossary: proof of delivery.
  'b7-ups-delivery-history': {
    authority: 'United Parcel Service (UPS)',
    title: 'UPS Intelligent Delivery History',
    url: 'https://learningcenter-ihub.ups.com/Solutions/Shipping/IntelligentDeliveryHistory',
    jurisdiction: 'International (carrier service)',
    supports:
      'UPS proof of delivery showing the time of delivery, the full delivery address and the name and signature of the shipment recipient, retrievable by tracking number, reference number, date range or destination country',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b7-cmr-delivery': {
    authority:
      'Convention on the Contract for the International Carriage of Goods by Road (CMR), Schedule to the Carriage of Goods by Road Act 1965 (legislation.gov.uk)',
    title: 'Carriage of Goods by Road Act 1965, Schedule: Articles 13 and 30',
    url: 'https://www.legislation.gov.uk/ukpga/1965/37/schedule',
    jurisdiction: 'International road carriage between contracting countries',
    supports:
      'the consignee being entitled, once the goods reach the place of delivery, to require delivery of the second copy of the consignment note and the goods against a receipt (Article 13); taking delivery without duly checking the goods with the carrier being prima facie evidence that they arrived in the condition described in the consignment note; reservations for apparent damage being due no later than delivery and, for damage that is not apparent, within seven days of delivery, Sundays and public holidays excepted (Article 30)',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },

  // Country: Brazil.
  'trade-gov-ccg-br': {
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title:
      'Brazil Country Commercial Guide: Import Requirements and Documentation (last published 21 August 2025)',
    url: 'https://www.trade.gov/country-commercial-guides/brazil-import-requirements-and-documentation',
    jurisdiction: 'Brazil (U.S. government export guidance)',
    supports:
      'Brazilian importers registering with the Foreign Trade Secretariat (SECEX) of the Ministry of Development, Industry, Trade and Services through Siscomex; goods requiring an import licence needing approval from one or more of sixteen authorities, usually before shipment and in some cases after shipment but before customs clearance; products that may affect the human body, such as pharmaceuticals, cosmetics and medical devices, being registered with ANVISA and imported only through a local manufacturing unit or office or an authorised Brazilian distributor; and authorities requiring further documents depending on the product',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b7-rfb-documentos-instrutivos': {
    authority: 'Receita Federal do Brasil (RFB), Ministério da Fazenda',
    title:
      'Despacho de importação — Documentos instrutivos do despacho: Considerações gerais (atualizado em 9 de abril de 2026)',
    url: 'https://www.gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior/manuais/despacho-de-importacao/topicos-1/despacho-de-importacao/documentos-instrutivos-do-despacho/consideracoes-gerais',
    jurisdiction: 'Brazil',
    supports:
      'the import declaration being supported by the original bill of lading or equivalent transport document, the original commercial invoice signed by the exporter, proof of payment of taxes where due, the packing list where applicable, proof of origin where applicable, the cargo manifest only where an international agreement or specific law requires it, and documents proving the commercial transaction for declarations selected for the grey channel; and those documents being made available to the RFB digitally through the “Anexação de Documentos Digitalizados” function of the Portal Único de Comércio Exterior, authenticated with a digital certificate',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b7-rfb-fatura-comercial': {
    authority: 'Receita Federal do Brasil (RFB), Ministério da Fazenda',
    title:
      'Despacho de importação — Fatura comercial (atualizado em 18 de maio de 2026), citing Regulamento Aduaneiro arts. 553, 557, 559, 562 and 570',
    url: 'https://www.gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior/manuais/despacho-de-importacao/topicos-1/despacho-de-importacao/documentos-instrutivos-do-despacho/fatura-comercial',
    jurisdiction: 'Brazil',
    supports:
      'the declaration having to be supported by the original commercial invoice signed by the exporter, by digital certificate for an electronic invoice or by hand on paper; the invoice stating the full names and addresses of exporter and importer, the specification of the goods in Portuguese or an official language of the GATT (English, French or Spanish), with a Portuguese translation at the customs authority’s discretion otherwise, the marks, numbers and quantity and kind of packages, gross and net weight, the countries of origin, acquisition and provenance, unit and total prices, freight and other expenses, the conditions and currency of payment and the Incoterms rule; and the RFB being able to set the number of copies, the first being the original',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b7-rfb-romaneio': {
    authority: 'Receita Federal do Brasil (RFB), Ministério da Fazenda',
    title:
      'Despacho de importação — Romaneio de carga (packing list) (atualizado em 29 de setembro de 2020)',
    url: 'https://www.gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior/manuais/despacho-de-importacao/topicos-1/despacho-de-importacao/documentos-instrutivos-do-despacho/romaneio-de-carga-packing-list',
    jurisdiction: 'Brazil',
    supports:
      'the packing list being required where issuing one is current practice and not for bulk cargo or goods identified by themselves, such as vehicles by chassis number; there being no standard model; and the document normally showing the total number of packages, their marks and identification numbers and, for each kind of packaging, net and gross weight, unit dimensions and total volume',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b7-rfb-habilitacao': {
    authority: 'Receita Federal do Brasil (RFB), Ministério da Fazenda',
    title: 'Despacho de importação — Habilitação (atualizado em 21 de abril de 2020)',
    url: 'https://www.gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior/manuais/despacho-de-importacao/topicos-1/Habilitacao%20e%20Credenciamento/habilitacao',
    jurisdiction: 'Brazil',
    supports:
      'customs clearance being processed in the Sistema Integrado de Comércio Exterior (Siscomex), the importer having to obtain its habilitação to use the system, and some persons being exempt according to the type of operation',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b7-rfb-portal-habilita': {
    authority: 'Receita Federal do Brasil (RFB), Ministério da Fazenda',
    title: 'Habilitação via Sistema Habilita (Portal Único Siscomex)',
    url: 'https://www.gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior/manuais/habilitacao/habilitacao-via-portal-habilita',
    jurisdiction: 'Brazil',
    supports:
      'the habilitação being requested, as a rule, in the Sistema Habilita on the Portal Único Siscomex; the company’s CNPJ registration having to be in “ativa” status; and the applicant selecting the company among the CNPJs in which the user appears in the partners and administrators register (QSA)',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b7-mapa-embalagens': {
    authority: 'Ministério da Agricultura e Pecuária (MAPA), Brazil',
    title:
      'Cuidados com embalagens e transporte dos produtos para o Brasil (atualizado em 28 de setembro de 2020)',
    url: 'https://www.gov.br/agricultura/pt-br/internacional/portugues/importacao/introducao/cuidados-com-embalagens-e-transporte-dos-produtos-para-o-brasil',
    jurisdiction: 'Brazil',
    supports:
      'wood packaging and supports from abroad having to be treated in accordance with ISPM 15 (NIMF 15), or, from countries that have not adopted it, accompanied by a phytosanitary or treatment certificate endorsed by the exporting country’s plant protection organisation; the importer stating whether wood packaging was used and its treatment or IPPC mark; and untreated or infested wood packaging being returned to the country of origin',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },

  // Country: China.
  'trade-gov-ccg-cn': {
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title:
      'China Country Commercial Guide: Import Requirements and Documentation (last published 25 September 2025)',
    url: 'https://www.trade.gov/country-commercial-guides/china-import-requirements-and-documentation',
    jurisdiction: 'China (U.S. government export guidance)',
    supports:
      'the Chinese importer (agent, distributor, joint-venture partner or foreign-invested enterprise) normally gathering the documents for Chinese customs; standard documents including the bill of lading, invoice, packing list, customs declaration, insurance policy and sales contract, varying by product; specialised documents including an import quota certificate, import licence, inspection certificate or other safety or quality licences where applicable; and GACC requiring foreign facilities that export food and agricultural products to China to register before shipping',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b7-gacc-customs-law': {
    authority: 'General Administration of Customs of the People’s Republic of China (GACC)',
    title: 'Customs Law of the People’s Republic of China (GACC English text)',
    url: 'https://english.customs.gov.cn/Statics/644dcaee-ca91-483a-86f4-bdc23695e3c3.html',
    jurisdiction: 'China',
    supports:
      'declarations and duty payment being completed by importers themselves or by a customs clearing agent they entrust (Article 9); importers, exporters and customs clearing agents having to be registered with the Customs to declare, and unregistered enterprises not being allowed to declare (Article 11); the importer making an accurate declaration and submitting licensing documents and relevant papers, restricted goods not being released without them, and declaring imports within 14 days of the declaration of the arrival of the means of transport (Article 24); declarations being made in paper form and by electronic means (Article 25); and the customs value of imports being based on the transaction value and including transport, related charges and insurance before unloading at the point of entry into China (Article 55)',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b7-gacc-consignee-registration': {
    authority: 'General Administration of Customs of the People’s Republic of China (GACC)',
    title:
      'Registration of a Consignee or Consignor of Imported or Exported Goods (General Import & Export Enterprises), dated 19 August 2005',
    url: 'https://english.customs.gov.cn/Statics/2923dcd6-3aea-4932-a4c9-fbdc8b3c9ad2.html',
    jurisdiction: 'China',
    supports:
      'consignees and consignors of imported or exported goods going through registration formalities with their local Customs, supported by business licence, foreign trade dealer record-filing, tax and bank documents',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b7-trade-gov-cn-standards': {
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title: 'China Country Commercial Guide: Standards for Trade (last published 25 September 2025)',
    url: 'https://www.trade.gov/country-commercial-guides/china-standards-trade',
    jurisdiction: 'China (U.S. government export guidance)',
    supports:
      'the China Compulsory Certification (CCC) mark being China’s national safety and quality mark, administered under the State Administration for Market Regulation (SAMR), which still uses the CNCA name publicly; and a product on the CCC list not being able to enter China until CCC registration has been obtained and the mark is physically applied',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b7-trade-gov-cn-labeling': {
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title: 'China Country Commercial Guide: Labeling/Marking Requirements (last published 25 September 2025)',
    url: 'https://www.trade.gov/knowledge-product/china-labelingmarking-requirements',
    jurisdiction: 'China (U.S. government export guidance)',
    supports:
      'all products sold in the PRC having to be marked in the Chinese language; GACC Decree 248 requiring registered food producers to mark the Chinese registration number on food packaging; and import inspection authorities naming labelling as one of the major reasons for noncompliance',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },

  // Country: Australia.
  'trade-gov-ccg-au': {
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title:
      'Australia Country Commercial Guide: Import Requirements and Documentation (last published 26 May 2026)',
    url: 'https://www.trade.gov/country-commercial-guides/australia-import-requirements-and-documentation',
    jurisdiction: 'Australia (U.S. government export guidance)',
    supports:
      'the Australian Border Force having sole jurisdiction to clear imports and local importers being responsible for formal clearance; the minimum documents being a customs entry or informal clearance document, an air waybill or bill of lading and the invoices and other documents relating to the import; no special invoice form being required, with documents showing the invoice terms (e.g. FOB, CIF), the seller’s name and address, the invoice currency and the country of origin; transaction value being the most common valuation method; and customs not requiring import licences while importers may need permits',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b7-abf-import-declarations': {
    authority: 'Australian Border Force (ABF), Department of Home Affairs',
    title: 'Import declarations (last updated 23 September 2026)',
    url: 'https://www.abf.gov.au/imports/Pages/How-to-import/Import-declarations.aspx',
    jurisdiction: 'Australia',
    supports:
      'importers, or licensed customs brokers acting for them, clearing goods into home consumption by an Import Declaration (N10) or a Self-Assessed Clearance declaration; the ABF encouraging first-time or infrequent importers to use a licensed customs broker; the Import Declaration being a statement about the goods, the importer, how the goods are transported, and the tariff classification and customs value, lodged in the Integrated Cargo System (ICS) or at an ABF counter; the importer’s details, such as its ABN, being part of a declaration; importers of prohibited or restricted goods needing permission from the relevant government agency and proof of it; and the importer keeping all relevant documents for five years',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b7-abf-customs-value': {
    authority: 'Australian Border Force (ABF), Department of Home Affairs',
    title: 'ICS calculation routines: customs duty calculation, Customs Value (last updated 1 October 2026)',
    url: 'https://www.abf.gov.au/help-and-support/ics/integrated-cargo-system-(ics)/software-developers/reference-materials/calculation-routines/customs-duty-calculation',
    jurisdiction: 'Australia',
    supports:
      'the customs value generally being the free on board (FOB) value of the goods, excluding overseas transport and insurance, with other charges included or excluded depending on the invoice terms under Part VIII, Division 2 of the Customs Act 1901, and much of the information coming from the invoice',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },

  // Country: United States.
  'b7-cbp-basic-import-export': {
    authority: 'U.S. Customs and Border Protection (CBP)',
    title: 'Basic Import and Export',
    url: 'https://www.cbp.gov/trade/basic-import-export',
    jurisdiction: 'United States',
    supports:
      'CBP as the U.S. agency for import and export trade, with CBP and the importing and exporting community sharing responsibility for compliance, and specific requirements possibly applying to a particular commodity',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b7-cfr-7-319-40-3': {
    authority: 'U.S. Department of Agriculture, APHIS, 7 CFR 319.40-3, via Cornell LII',
    title: '7 CFR § 319.40-3 — General permits; articles that may be imported without a specific permit',
    url: 'https://www.law.cornell.edu/cfr/text/7/319.40-3',
    jurisdiction: 'United States (plant health)',
    supports:
      'regulated wood packaging material entering the United States having to be treated under an approved method and marked in a visible location on each article with the IPPC-approved mark, including the country code, producer number and treatment abbreviation, and an inspector being able to order the immediate re-export of unmarked wood packaging material',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
