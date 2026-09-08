/**
 * Incoterms® 2020 reference data.
 *
 * A plain-language summary of the eleven rules, for choosing between them and for
 * labelling a document. It is deliberately a summary: the rules themselves are published
 * by the International Chamber of Commerce, obligations run to far more than a sentence
 * each, and what a particular contract says overrides any generalisation here. Every
 * surface that renders this also renders that caveat.
 *
 * "Incoterms" is a trademark of the International Chamber of Commerce.
 */

export type TransportMode = 'any' | 'sea';

export type Incoterm = {
  code: string;
  name: string;
  mode: TransportMode;
  /** Where risk passes from seller to buyer, in one sentence. */
  riskPasses: string;
  /** What the seller pays for beyond the point risk passes, if anything. */
  sellerCosts: string;
  exportClearance: 'seller' | 'buyer';
  importClearance: 'seller' | 'buyer';
  insurance: string;
  /** When this rule is a sensible choice, and when it is the wrong tool. */
  suits: string;
  watchOut: string;
};

export const INCOTERMS: readonly Incoterm[] = [
  {
    code: 'EXW',
    name: 'Ex Works',
    mode: 'any',
    riskPasses: 'At the seller’s premises, once the goods are placed at the buyer’s disposal.',
    sellerCosts: 'Nothing beyond making the goods available, packed and identified.',
    exportClearance: 'buyer',
    importClearance: 'buyer',
    insurance: 'Neither party is obliged to insure.',
    suits: 'Domestic sales, and buyers who run their own freight and customs.',
    watchOut:
      'The buyer must clear the goods for export from a country they may have no presence in, and often cannot legally do so. FCA usually expresses what both sides actually intend.',
  },
  {
    code: 'FCA',
    name: 'Free Carrier',
    mode: 'any',
    riskPasses:
      'When the goods are handed to the carrier the buyer nominated, at the named place.',
    sellerCosts: 'Delivery to that named place, and export clearance.',
    exportClearance: 'seller',
    importClearance: 'buyer',
    insurance: 'Neither party is obliged to insure.',
    suits:
      'Almost any containerised sale where the buyer arranges the main carriage. The default alternative to EXW and to FOB.',
    watchOut:
      'Name the place precisely — "FCA seller’s warehouse" and "FCA the port" divide loading costs differently. Where a letter of credit needs an on-board bill of lading, agree the 2020 option that obliges the carrier to issue one.',
  },
  {
    code: 'CPT',
    name: 'Carriage Paid To',
    mode: 'any',
    riskPasses: 'When the goods are handed to the first carrier — not at the destination.',
    sellerCosts: 'Carriage all the way to the named destination.',
    exportClearance: 'seller',
    importClearance: 'buyer',
    insurance: 'Neither party is obliged to insure.',
    suits: 'Sellers who can buy carriage more cheaply than the buyer can.',
    watchOut:
      'Risk and cost split at different points. The seller pays freight to the destination but stops carrying the risk at the origin, so goods lost in transit are the buyer’s loss on carriage the seller paid for.',
  },
  {
    code: 'CIP',
    name: 'Carriage and Insurance Paid To',
    mode: 'any',
    riskPasses: 'When the goods are handed to the first carrier.',
    sellerCosts: 'Carriage to the named destination, plus insurance.',
    exportClearance: 'seller',
    importClearance: 'buyer',
    insurance:
      'The seller must insure at all-risks level — Institute Cargo Clauses (A) or equivalent — for 110% of the contract value. Raised in the 2020 revision.',
    suits: 'Buyers who want the seller to arrange cover to a high standard.',
    watchOut:
      'The cover level is the main thing that changed in 2020. A contract written to the 2010 rules assumed minimum cover here; a contract under 2020 does not.',
  },
  {
    code: 'DAP',
    name: 'Delivered at Place',
    mode: 'any',
    riskPasses:
      'At the named destination, with the goods ready for unloading from the arriving vehicle.',
    sellerCosts: 'Everything to that destination, unloading excepted.',
    exportClearance: 'seller',
    importClearance: 'buyer',
    insurance: 'Neither party is obliged to insure, though the seller carries the risk.',
    suits: 'Sellers who can deliver to the door and buyers who can clear their own imports.',
    watchOut:
      'The buyer clears the goods for import. If they are slow, the goods wait — and demurrage lands on the seller, who still holds the risk.',
  },
  {
    code: 'DPU',
    name: 'Delivered at Place Unloaded',
    mode: 'any',
    riskPasses: 'At the named destination, once the goods have been unloaded.',
    sellerCosts: 'Everything to that destination, including unloading.',
    exportClearance: 'seller',
    importClearance: 'buyer',
    insurance: 'Neither party is obliged to insure, though the seller carries the risk.',
    suits: 'Deliveries to a terminal or a site where the seller can arrange unloading.',
    watchOut:
      'The only rule that obliges the seller to unload. Do not agree it for a destination where the seller cannot actually get equipment. It replaced DAT in the 2020 revision.',
  },
  {
    code: 'DDP',
    name: 'Delivered Duty Paid',
    mode: 'any',
    riskPasses: 'At the named destination, ready for unloading, cleared for import.',
    sellerCosts: 'Everything, including import duty and taxes.',
    exportClearance: 'seller',
    importClearance: 'seller',
    insurance: 'Neither party is obliged to insure, though the seller carries the risk.',
    suits: 'Sample shipments and buyers who want one landed price with no surprises.',
    watchOut:
      'The seller takes on import clearance and duty in a country where they may not be registered, and often cannot reclaim the VAT they pay. The maximum obligation of the eleven rules.',
  },
  {
    code: 'FAS',
    name: 'Free Alongside Ship',
    mode: 'sea',
    riskPasses: 'When the goods are placed alongside the vessel at the named port of shipment.',
    sellerCosts: 'Delivery alongside the ship, and export clearance.',
    exportClearance: 'seller',
    importClearance: 'buyer',
    insurance: 'Neither party is obliged to insure.',
    suits: 'Bulk and break-bulk cargo loaded directly from a quay.',
    watchOut: 'Wrong for containers, which are handed to a terminal long before any vessel.',
  },
  {
    code: 'FOB',
    name: 'Free on Board',
    mode: 'sea',
    riskPasses: 'When the goods are on board the vessel at the named port of shipment.',
    sellerCosts: 'Delivery on board, and export clearance.',
    exportClearance: 'seller',
    importClearance: 'buyer',
    insurance: 'Neither party is obliged to insure.',
    suits: 'Bulk and break-bulk cargo the seller can see loaded.',
    watchOut:
      'The most misused rule in the set. Containers are surrendered at a terminal days before loading, leaving the seller holding risk over goods they no longer control. FCA is the rule that matches what happens.',
  },
  {
    code: 'CFR',
    name: 'Cost and Freight',
    mode: 'sea',
    riskPasses: 'When the goods are on board at the port of shipment.',
    sellerCosts: 'Sea freight to the named destination port.',
    exportClearance: 'seller',
    importClearance: 'buyer',
    insurance: 'Neither party is obliged to insure.',
    suits: 'Bulk cargo where the seller books the vessel.',
    watchOut:
      'Risk passes at origin while the seller pays freight to destination — the same split as CPT, and the same surprise when cargo is lost mid-voyage.',
  },
  {
    code: 'CIF',
    name: 'Cost, Insurance and Freight',
    mode: 'sea',
    riskPasses: 'When the goods are on board at the port of shipment.',
    sellerCosts: 'Sea freight to the named destination port, plus insurance.',
    exportClearance: 'seller',
    importClearance: 'buyer',
    insurance:
      'The seller must insure for 110% of the contract value at minimum cover — Institute Cargo Clauses (C) or equivalent. Unlike CIP, this was not raised in 2020.',
    suits: 'Bulk cargo, and letters of credit that call for an insurance certificate.',
    watchOut:
      'Minimum cover is narrower than most buyers assume: it names specific perils rather than covering all risks. Agree a higher level explicitly if that is what you want.',
  },
];

export function findIncoterm(code: string): Incoterm | undefined {
  return INCOTERMS.find((term) => term.code === code.toUpperCase());
}

/** The statement that has to accompany any summary of the rules. */
export const INCOTERMS_DISCLAIMER =
  'Incoterms® is a trademark of the International Chamber of Commerce. This is a plain-language ' +
  'summary to help you choose, not legal advice and not a substitute for the published rules. ' +
  'What your contract says takes precedence over anything on this page.';
