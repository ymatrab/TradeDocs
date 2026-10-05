/**
 * Incoterms® 2020 reference data.
 *
 * A plain-language summary of the eleven rules, for choosing between them and for
 * labelling a document. It is deliberately a summary: the rules themselves are published
 * by the International Chamber of Commerce, obligations run to far more than a sentence
 * each, and what a particular contract says overrides any generalisation here. Every
 * surface that renders this also renders that caveat and the source record in
 * lib/trade/sources ('icc-incoterms-2020').
 *
 * Each rule page is built entirely from its entry here, so the eleven pages cannot drift
 * apart in structure. The FAQ entries are exported as data so structured data can be
 * generated from the same text the page shows.
 *
 * "Incoterms" is a trademark of the International Chamber of Commerce.
 */

export type TransportMode = 'any' | 'sea';
export type Party = 'seller' | 'buyer';

export type IncotermFaq = { q: string; a: string };

export type Incoterm = {
  code: string;
  name: string;
  mode: TransportMode;
  /** Where risk passes from seller to buyer, in one sentence. */
  riskPasses: string;
  /** What the seller pays for beyond the point risk passes, if anything. */
  sellerCosts: string;
  /** Who contracts and pays for the main carriage. */
  mainCarriage: Party;
  /** The main-carriage arrangement in a sentence, including any agreed variation. */
  carriageNote: string;
  exportClearance: Party;
  importClearance: Party;
  insurance: string;
  /** When this rule is a sensible choice, and when it is the wrong tool. */
  suits: string;
  watchOut: string;
  /** A short, fictional worked example showing where cost and risk move. */
  example: string;
  /** Mistakes seen in practice, one sentence or two each. */
  mistakes: readonly string[];
  /** Three or four questions, answered plainly. Rendered on the page and reused for JSON-LD. */
  faq: readonly IncotermFaq[];
  /**
   * The page's title, heading and opening sentence in the words people search with, where
   * the keyword data shows a phrasing other than "<code> Incoterms 2020" (content plan
   * 2026-10-05). Rules without one use the default pattern.
   */
  search?: { title: string; heading: string; lead: string };
};

export const INCOTERMS: readonly Incoterm[] = [
  {
    code: 'EXW',
    name: 'Ex Works',
    search: {
      title: 'EXW Incoterm — Ex Works in Incoterms 2020, explained',
      heading: 'EXW Incoterm: Ex Works (Incoterms® 2020)',
      lead:
        'EXW, Ex Works, is the Incoterms® rule with the least for the seller to do: it makes the goods available at its own premises and the buyer does everything from there.',
    },
    mode: 'any',
    riskPasses: 'At the seller’s premises, once the goods are placed at the buyer’s disposal.',
    sellerCosts: 'Nothing beyond making the goods available, packed and identified.',
    mainCarriage: 'buyer',
    carriageNote:
      'The buyer arranges and pays for all carriage from the named place, including loading, which the seller is not obliged to do.',
    exportClearance: 'buyer',
    importClearance: 'buyer',
    insurance: 'Neither party is obliged to insure.',
    suits: 'Domestic sales, and buyers who run their own freight and customs.',
    watchOut:
      'The buyer must clear the goods for export from a country they may have no presence in, and often cannot legally do so. FCA usually expresses what both sides actually intend.',
    example:
      'A furniture maker in Porto sells twelve pallets EXW Porto, seller’s factory. The buyer’s forwarder collects them, lodges the export declaration and pays every cost from the loading bay on. If a pallet is dropped while the buyer’s truck is being loaded, the loss is the buyer’s.',
    mistakes: [
      'Assuming the seller will load the truck. It is not obliged to, and if its staff do load, they do so at the buyer’s risk unless the contract says otherwise.',
      'Choosing EXW for an export when the buyer has no way to act as exporter in the seller’s country.',
      'Leaving the seller with no evidence that the goods actually left the country, which it may need for its own records.',
    ],
    faq: [
      {
        q: 'Does the seller load the goods under EXW?',
        a: 'Not as an obligation. The seller places the goods at the buyer’s disposal at the named place, not loaded on any collecting vehicle. If the seller does load, it does so at the buyer’s risk and cost. Where the seller is going to load anyway, FCA at the seller’s premises says so.',
      },
      {
        q: 'Who handles export clearance under EXW?',
        a: 'The buyer, where clearance applies. The seller only has to assist, at the buyer’s request and cost, with information and documents. A buyer abroad often cannot act as the exporter, which is why FCA is usually the better fit.',
      },
      {
        q: 'Is EXW the cheapest term for the seller?',
        a: 'It is the smallest obligation for the seller, which is not the same as the lowest total cost. The buyer prices every risk and cost from the seller’s door into what it is prepared to pay.',
      },
    ],
  },
  {
    code: 'FCA',
    name: 'Free Carrier',
    search: {
      title: 'FCA Incoterm — Free Carrier in Incoterms 2020, explained',
      heading: 'FCA Incoterm: Free Carrier (Incoterms® 2020)',
      lead:
        'FCA, Free Carrier, is the Incoterms® rule under which the seller clears the goods for export and hands them to the buyer’s carrier at a named place.',
    },
    mode: 'any',
    riskPasses: 'When the goods are handed to the carrier the buyer nominated, at the named place.',
    sellerCosts: 'Delivery to that named place, and export clearance.',
    mainCarriage: 'buyer',
    carriageNote:
      'The buyer contracts the main carriage. The parties may instead agree that the seller arranges it, at the buyer’s risk and cost.',
    exportClearance: 'seller',
    importClearance: 'buyer',
    insurance: 'Neither party is obliged to insure.',
    suits:
      'Almost any containerised sale where the buyer arranges the main carriage. The default alternative to EXW and to FOB.',
    watchOut:
      'Name the place precisely — "FCA seller’s warehouse" and "FCA the port" divide loading costs differently. Where a letter of credit needs an on-board bill of lading, the parties can agree that the buyer will instruct its carrier to issue one to the seller. The rules bind the buyer and seller, not the carrier.',
    example:
      'A Leeds manufacturer sells 400 cartons FCA Leeds, seller’s warehouse. The seller clears them for export and loads them onto the truck the buyer’s forwarder sends. From that moment the buyer pays for, and carries the risk of, the road leg, the sea voyage and everything after.',
    mistakes: [
      'Naming a city rather than a precise point. Delivery at the seller’s premises means the seller loads; delivery anywhere else means the seller only presents the goods ready for unloading.',
      'Expecting the bill of lading option to bind the carrier. If agreed, it obliges the buyer to instruct its carrier; the carrier is not a party to the sale.',
      'Using FOB out of habit for container shipments, when FCA describes what actually happens at the terminal.',
    ],
    faq: [
      {
        q: 'Where does delivery happen under FCA?',
        a: 'At the named place. If that place is the seller’s premises, delivery happens once the goods are loaded on the buyer’s collecting vehicle. Anywhere else, it happens when the goods, still on the seller’s vehicle and ready for unloading, are put at the disposal of the buyer’s carrier.',
      },
      {
        q: 'Can I get an on-board bill of lading under FCA?',
        a: 'If the parties agree it, Incoterms® 2020 provides for the buyer to instruct its carrier to issue a bill of lading with an on-board notation to the seller. The carrier is not party to the sale contract, so the rules cannot oblige it to issue one; the buyer’s instruction is what makes it happen.',
      },
      {
        q: 'Is FCA better than FOB for containers?',
        a: 'Usually. A container is handed to the carrier at a terminal or depot, often days before it is loaded on board. FCA moves risk at that handover; FOB leaves it with the seller until the goods are on board a ship it no longer has any access to.',
      },
    ],
  },
  {
    code: 'CPT',
    name: 'Carriage Paid To',
    mode: 'any',
    riskPasses: 'When the goods are handed to the first carrier — not at the destination.',
    sellerCosts: 'Carriage all the way to the named destination.',
    mainCarriage: 'seller',
    carriageNote: 'The seller contracts and pays for carriage to the named destination.',
    exportClearance: 'seller',
    importClearance: 'buyer',
    insurance: 'Neither party is obliged to insure.',
    suits: 'Sellers who can buy carriage more cheaply than the buyer can.',
    watchOut:
      'Risk and cost split at different points. The seller pays freight to the destination but stops carrying the risk at the origin, so goods lost in transit are the buyer’s loss on carriage the seller paid for.',
    example:
      'A Milan textile supplier sells CPT Warsaw by road. The seller books and pays the haulier to Warsaw, but risk passes to the buyer when the goods are handed to that haulier in Milan. Damage on the way is the buyer’s loss, to be recovered from its own insurance if it has any.',
    mistakes: [
      'Assuming the seller carries the risk until arrival because it pays the freight.',
      'Leaving the place of delivery unnamed when several carriers are involved; risk then passes on handover to the first one.',
      'Leaving the journey uninsured: the buyer bears its risk but did not book it, and may not think to cover it.',
    ],
    faq: [
      {
        q: 'Who pays freight under CPT?',
        a: 'The seller, up to the named destination. Costs after arrival, including unloading unless the seller’s contract of carriage covers it, and import duties fall on the buyer.',
      },
      {
        q: 'When does risk pass under CPT?',
        a: 'When the seller hands the goods to the carrier it contracted, at the place of delivery — not when they reach the destination. If several carriers are used and no delivery point is agreed, risk passes on handover to the first.',
      },
      {
        q: 'What is the difference between CPT and CIP?',
        a: 'Insurance. Under CIP the seller must also insure the goods for the journey, at the all-risks level of Institute Cargo Clauses (A); under CPT neither party is obliged to insure.',
      },
    ],
  },
  {
    code: 'CIP',
    name: 'Carriage and Insurance Paid To',
    mode: 'any',
    riskPasses: 'When the goods are handed to the first carrier.',
    sellerCosts: 'Carriage to the named destination, plus insurance.',
    mainCarriage: 'seller',
    carriageNote:
      'The seller contracts and pays for carriage to the named destination, and insures the goods for that journey.',
    exportClearance: 'seller',
    importClearance: 'buyer',
    insurance:
      'The seller must insure at all-risks level — Institute Cargo Clauses (A) or equivalent — for 110% of the contract value. Raised in the 2020 revision.',
    suits: 'Buyers who want the seller to arrange cover to a high standard.',
    watchOut:
      'The cover level is the main thing that changed in 2020. A contract written to the 2010 rules assumed minimum cover here; a contract under 2020 does not.',
    example:
      'A Lyon instrument maker sells CIP Singapore airport. The seller pays the air freight and buys all-risks cover for 110% of the invoice value. Risk passes when the goods are handed to the airline in France; if they arrive damaged, the buyer claims on the policy the seller bought.',
    mistakes: [
      'Quoting CIP on the old assumption of minimum cover. Under Incoterms® 2020 the default is all-risks cover.',
      'Insuring only part of the journey. Cover has to run from the point of delivery to at least the named destination.',
      'Forgetting that the buyer, not the seller, carries the risk in transit, and so is the party who claims.',
    ],
    faq: [
      {
        q: 'How much insurance does CIP require?',
        a: 'At least 110% of the contract price, in the contract currency, on terms meeting Institute Cargo Clauses (A) or similar — all-risks cover, subject to the usual exclusions. The parties can agree a lower level, but they have to say so.',
      },
      {
        q: 'Who carries the risk under CIP?',
        a: 'The buyer, from the moment the goods are handed to the first carrier. The seller’s insurance exists for the buyer’s benefit during a journey the buyer bears the risk of.',
      },
      {
        q: 'Can CIP be used for sea freight?',
        a: 'Yes. CIP works for any mode, including sea and multimodal container moves, which is why it usually suits containers better than CIF.',
      },
    ],
  },
  {
    code: 'DAP',
    name: 'Delivered at Place',
    search: {
      title: 'DAP meaning — Delivered at Place in Incoterms 2020',
      heading: 'DAP meaning: Delivered at Place (Incoterms® 2020)',
      lead:
        'DAP means Delivered at Place: the seller delivers the goods to the named destination, and the buyer clears them for import and pays the duty and taxes.',
    },
    mode: 'any',
    riskPasses:
      'At the named destination, with the goods ready for unloading from the arriving vehicle.',
    sellerCosts: 'Everything to that destination, unloading excepted.',
    mainCarriage: 'seller',
    carriageNote: 'The seller contracts and pays for carriage to the named destination.',
    exportClearance: 'seller',
    importClearance: 'buyer',
    insurance:
      'Neither party is obliged to insure, though the seller carries the risk until delivery.',
    suits: 'Sellers who can deliver to the door and buyers who can clear their own imports.',
    watchOut:
      'The buyer clears the goods for import. If it fails to, and the goods are held at a port or terminal while they wait, the risk of loss and the extra costs of the hold-up — demurrage and storage included — fall on the buyer, not the seller.',
    example:
      'A Gdańsk engineering firm sells DAP Oslo, buyer’s site. The seller trucks the goods to the site, cleared for export, and the buyer handles Norwegian import clearance. Risk passes when the truck arrives at the site ready to be unloaded, and the buyer unloads.',
    mistakes: [
      'Assuming the seller pays the demurrage when the buyer’s import clearance is late. The rules put the costs of that failure on the buyer.',
      'Naming a destination the goods cannot reach until they are cleared, without agreeing how the wait will be handled.',
      'Expecting the seller to unload. Under DAP it does not; DPU is the rule for that.',
    ],
    faq: [
      {
        q: 'Who pays import duty under DAP?',
        a: 'The buyer. The seller delivers to the named place, but import clearance, duties and import taxes are the buyer’s, as is unloading.',
      },
      {
        q: 'Who pays demurrage if import clearance is delayed under DAP?',
        a: 'The buyer, where the delay comes from its import clearance. If the buyer fails to clear the goods, the extra risk and costs while they are held, demurrage and storage included, are the buyer’s.',
      },
      {
        q: 'What is the difference between DAP and DDP?',
        a: 'Import clearance. Under DDP the seller also clears the goods for import and pays the duty and taxes; under DAP the buyer does.',
      },
      {
        q: 'Does the seller have to insure under DAP?',
        a: 'No. The seller carries the risk until delivery, so insuring is in its own interest, but the rule does not require it.',
      },
    ],
  },
  {
    code: 'DPU',
    name: 'Delivered at Place Unloaded',
    mode: 'any',
    riskPasses: 'At the named destination, once the goods have been unloaded.',
    sellerCosts: 'Everything to that destination, including unloading.',
    mainCarriage: 'seller',
    carriageNote:
      'The seller contracts and pays for carriage to the named destination, and for unloading there.',
    exportClearance: 'seller',
    importClearance: 'buyer',
    insurance:
      'Neither party is obliged to insure, though the seller carries the risk until delivery.',
    suits: 'Deliveries to a terminal or a site where the seller can arrange unloading.',
    watchOut:
      'The only rule that obliges the seller to unload. Do not agree it for a destination where the seller cannot actually get equipment. It replaced DAT in the 2020 revision.',
    example:
      'A Rotterdam machinery dealer sells a press DPU Leeds, buyer’s factory. The seller trucks it there and arranges the crane to unload it; risk passes once the press is on the ground. The buyer clears it for import into the UK and pays the duty.',
    mistakes: [
      'Agreeing DPU for a place where the seller cannot get unloading equipment or access.',
      'Still writing DAT, which no longer exists in Incoterms® 2020.',
      'Assuming unloaded means installed or positioned. Delivery ends once the goods are unloaded at the named place.',
    ],
    faq: [
      {
        q: 'What replaced DAT in Incoterms® 2020?',
        a: 'DPU. The rule was renamed to make clear that the destination can be any place, not only a terminal, provided the seller can unload there.',
      },
      {
        q: 'Who unloads under DPU?',
        a: 'The seller. It is the only Incoterms® rule that requires the seller to unload at the destination.',
      },
      {
        q: 'Who clears the goods for import under DPU?',
        a: 'The buyer, who also pays the import duties and taxes.',
      },
    ],
  },
  {
    code: 'DDP',
    name: 'Delivered Duty Paid',
    search: {
      title: 'DDP shipping — Delivered Duty Paid in Incoterms 2020, explained',
      heading: 'DDP shipping: Delivered Duty Paid (Incoterms® 2020)',
      lead:
        'DDP shipping means the seller delivers the goods to the buyer’s named place cleared for import, with the import duty and taxes paid.',
    },
    mode: 'any',
    riskPasses: 'At the named destination, ready for unloading, cleared for import.',
    sellerCosts: 'Everything, including import duty and taxes.',
    mainCarriage: 'seller',
    carriageNote: 'The seller contracts and pays for carriage to the named destination.',
    exportClearance: 'seller',
    importClearance: 'seller',
    insurance:
      'Neither party is obliged to insure, though the seller carries the risk until delivery.',
    suits: 'Sample shipments and buyers who want one landed price with no surprises.',
    watchOut:
      'The seller takes on import clearance and duty in a country where they may not be registered, and often cannot reclaim the VAT they pay. The maximum obligation of the eleven rules.',
    example:
      'A Shenzhen electronics supplier sends sample units DDP Hamburg, buyer’s office. The seller pays the carriage, clears the units for import and pays the duty and import taxes, so the buyer pays the agreed price and nothing else. Whether the seller can act as importer in Germany is a question to settle before quoting.',
    mistakes: [
      'Quoting DDP without checking that the seller can act as importer at the destination, directly or through an agent.',
      'Forgetting that import VAT the seller pays may not be recoverable by it.',
      'Assuming the seller unloads. Under DDP the buyer unloads at the named place.',
    ],
    faq: [
      {
        q: 'Who pays import VAT under DDP?',
        a: 'The seller pays the duties and taxes due on import, which normally include import VAT, unless the contract excludes them. Whether the seller can recover that VAT depends on the destination country’s rules.',
      },
      {
        q: 'Is DDP a good choice for exporters?',
        a: 'Only when the seller can handle import clearance at the destination, through its own registration or an agent. Otherwise DAP, with the buyer clearing the goods, is usually safer.',
      },
      {
        q: 'Who unloads under DDP?',
        a: 'The buyer. The seller delivers the goods cleared for import and ready for unloading at the named place.',
      },
    ],
  },
  {
    code: 'FAS',
    name: 'Free Alongside Ship',
    mode: 'sea',
    riskPasses: 'When the goods are placed alongside the vessel at the named port of shipment.',
    sellerCosts: 'Delivery alongside the ship, and export clearance.',
    mainCarriage: 'buyer',
    carriageNote: 'The buyer contracts the sea carriage and nominates the vessel.',
    exportClearance: 'seller',
    importClearance: 'buyer',
    insurance: 'Neither party is obliged to insure.',
    suits: 'Bulk and break-bulk cargo loaded directly from a quay.',
    watchOut: 'Wrong for containers, which are handed to a terminal long before any vessel.',
    example:
      'A Santos timber exporter sells FAS Santos. The seller clears the logs for export and places them on the quay alongside the vessel the buyer chartered; risk passes there. Loading them on board is the buyer’s cost and risk.',
    mistakes: [
      'Using FAS for containerised cargo, which is handed to a terminal rather than placed alongside a ship.',
      'Not agreeing a precise loading point within the port, which decides where the seller’s costs stop.',
      'Not getting the buyer’s notice of the vessel and loading time, which the seller needs in order to deliver.',
    ],
    faq: [
      {
        q: 'Who loads the goods under FAS?',
        a: 'The buyer. The seller’s obligation ends when the goods are alongside the ship, on the quay or on a barge, at the named port.',
      },
      {
        q: 'Can FAS be used for containers?',
        a: 'It is not designed for them. Containers are delivered to a terminal well before loading, so FCA fits better.',
      },
      {
        q: 'Who clears the goods for export under FAS?',
        a: 'The seller. Import clearance, duties and import taxes are the buyer’s.',
      },
    ],
  },
  {
    code: 'FOB',
    name: 'Free on Board',
    search: {
      title: 'FOB shipping meaning — Free on Board in Incoterms 2020',
      heading: 'FOB in shipping: Free on Board (Incoterms® 2020)',
      lead:
        'In shipping, FOB means Free on Board: an Incoterms® rule under which the seller loads the goods on board the vessel the buyer nominates, at the named port of shipment.',
    },
    mode: 'sea',
    riskPasses: 'When the goods are on board the vessel at the named port of shipment.',
    sellerCosts: 'Delivery on board, and export clearance.',
    mainCarriage: 'buyer',
    carriageNote: 'The buyer contracts the sea carriage and nominates the vessel.',
    exportClearance: 'seller',
    importClearance: 'buyer',
    insurance: 'Neither party is obliged to insure.',
    suits: 'Bulk and break-bulk cargo the seller can see loaded.',
    watchOut:
      'The most misused rule in the set. Containers are surrendered at a terminal days before loading, leaving the seller holding risk over goods they no longer control. FCA is the rule that matches what happens.',
    example:
      'A Durban sugar producer sells 20,000 tonnes FOB Durban on a vessel the buyer has chartered. The seller clears the cargo for export and loads it; risk passes once it is on board. Sea freight, insurance and import clearance are the buyer’s.',
    mistakes: [
      'Using FOB for containers, which leaves the seller carrying risk at the terminal after it has lost control of the goods.',
      'Writing FOB with an inland place, such as "FOB factory". FOB needs a port of shipment.',
      'Mixing it up with domestic uses of "FOB" as a freight term. Write "FOB [port] Incoterms® 2020" in the contract.',
    ],
    faq: [
      {
        q: 'When does risk pass under FOB?',
        a: 'When the goods are on board the vessel at the named port of shipment. Before that, including the time a container waits at the terminal, the seller carries the risk.',
      },
      {
        q: 'Who pays freight under FOB?',
        a: 'The buyer, who contracts the sea carriage. The seller pays the costs up to loading on board, and export clearance.',
      },
      {
        q: 'What should I use instead of FOB for containers?',
        a: 'FCA, naming the terminal or the seller’s premises. It moves risk when the container is handed over, which is what actually happens.',
      },
    ],
  },
  {
    code: 'CFR',
    name: 'Cost and Freight',
    mode: 'sea',
    riskPasses: 'When the goods are on board at the port of shipment.',
    sellerCosts: 'Sea freight to the named destination port.',
    mainCarriage: 'seller',
    carriageNote: 'The seller contracts and pays for sea carriage to the named destination port.',
    exportClearance: 'seller',
    importClearance: 'buyer',
    insurance: 'Neither party is obliged to insure.',
    suits: 'Bulk cargo where the seller books the vessel.',
    watchOut:
      'Risk passes at origin while the seller pays freight to destination — the same split as CPT, and the same surprise when cargo is lost mid-voyage.',
    example:
      'A Rouen grain merchant sells 30,000 tonnes of wheat CFR Alexandria. The seller charters the vessel and pays the freight to Alexandria; risk passes when the wheat is on board in Rouen. Cover for the voyage is the buyer’s to arrange, if it wants any.',
    mistakes: [
      'Assuming the seller insures because it pays the freight.',
      'Using CFR for containers, which are out of the seller’s hands well before risk passes on board.',
      'Naming only the destination port. The port of shipment is where risk transfers, so agree it too.',
    ],
    faq: [
      {
        q: 'Who insures under CFR?',
        a: 'Neither party is obliged to. The buyer carries the risk from loading, so cover is in the buyer’s interest.',
      },
      {
        q: 'What is the difference between CFR and CIF?',
        a: 'Insurance. Under CIF the seller must also insure the voyage, at the minimum Institute Cargo Clauses (C) level, for 110% of the contract value.',
      },
      {
        q: 'Who pays unloading at the destination port under CFR?',
        a: 'The buyer, unless the unloading charges were for the seller’s account under the contract of carriage the seller made.',
      },
    ],
  },
  {
    code: 'CIF',
    name: 'Cost, Insurance and Freight',
    mode: 'sea',
    riskPasses: 'When the goods are on board at the port of shipment.',
    sellerCosts: 'Sea freight to the named destination port, plus insurance.',
    mainCarriage: 'seller',
    carriageNote:
      'The seller contracts and pays for sea carriage to the named destination port, and insures the voyage.',
    exportClearance: 'seller',
    importClearance: 'buyer',
    insurance:
      'The seller must insure for 110% of the contract value at minimum cover — Institute Cargo Clauses (C) or equivalent. Unlike CIP, this was not raised in 2020.',
    suits: 'Bulk cargo, and letters of credit that call for an insurance certificate.',
    watchOut:
      'Minimum cover is narrower than most buyers assume: it names specific perils rather than covering all risks. Agree a higher level explicitly if that is what you want.',
    example:
      'An Australian coal exporter sells 60,000 tonnes CIF Rotterdam. The seller pays the freight and buys minimum cover for 110% of the invoice value. Risk passes at loading in Australia; if the cargo is damaged by a peril the policy names, the buyer claims under it.',
    mistakes: [
      'Assuming CIF cover is all-risks. The default is Institute Cargo Clauses (C), which lists specific perils.',
      'Using CIF for containers, where CIP is the matching any-mode rule.',
      'Treating CIF as a delivered term. Risk passes at the port of shipment, not on arrival.',
    ],
    faq: [
      {
        q: 'What insurance does CIF require?',
        a: 'Minimum cover under Institute Cargo Clauses (C) or similar, for at least 110% of the contract price. The buyer can ask for more cover, at its own cost.',
      },
      {
        q: 'When does risk pass under CIF?',
        a: 'When the goods are on board the vessel at the port of shipment, even though the seller pays freight and insurance to the destination port.',
      },
      {
        q: 'Should I use CIF or CIP for containers?',
        a: 'CIP. CIF is designed for goods loaded directly on board a ship; containers are handed over at a terminal first, which CIP accounts for.',
      },
    ],
  },
];

/** One cell of the responsibilities chart. */
export type ChartRow = { label: string; cell: (term: Incoterm) => string };

const who = (party: Party): string => (party === 'seller' ? 'Seller' : 'Buyer');

/**
 * The responsibilities chart: obligations down the side, the eleven rules across. Built
 * from the entries above, so it cannot disagree with the rule pages. The facts not stored
 * per rule follow the ICC text directly: CIF and CIP are the only rules that oblige the
 * seller to insure, DPU is the only one that obliges the seller to unload at destination,
 * and risk passes at origin under the E, F and C rules and at destination under the D rules.
 */
export const INCOTERMS_CHART: readonly ChartRow[] = [
  { label: 'Export clearance', cell: (term) => who(term.exportClearance) },
  { label: 'Main carriage contracted and paid by', cell: (term) => who(term.mainCarriage) },
  {
    label: 'Insurance required of',
    cell: (term) => (term.code === 'CIF' || term.code === 'CIP' ? 'Seller' : 'Neither'),
  },
  {
    label: 'Risk passes',
    cell: (term) => (term.code.startsWith('D') ? 'Destination' : 'Origin'),
  },
  {
    label: 'Unloading at destination',
    cell: (term) => (term.code === 'DPU' ? 'Seller' : 'Buyer'),
  },
  { label: 'Import clearance, duty and taxes', cell: (term) => who(term.importClearance) },
];

export function findIncoterm(code: string): Incoterm | undefined {
  return INCOTERMS.find((term) => term.code === code.toUpperCase());
}

/** The questions a rule page shows, for structured data built from the same text. */
export function incotermFaq(code: string): readonly IncotermFaq[] {
  return findIncoterm(code)?.faq ?? [];
}

/** The hub page's questions, exported for the same reason. */
export const INCOTERMS_HUB_FAQ: readonly IncotermFaq[] = [
  {
    q: 'What changed between Incoterms® 2010 and 2020?',
    a: 'DAT became DPU, widening it from a terminal to any place where the seller unloads. CIP insurance rose to all-risks cover, while CIF stayed at minimum cover. FCA gained an option under which the parties can agree that the buyer instructs its carrier to issue an on-board bill of lading to the seller, which letters of credit often demand.',
  },
  {
    q: 'Which Incoterm should I use for containers?',
    a: 'FCA, CPT or CIP, depending on how far you want to carry the cost. The four maritime rules — FAS, FOB, CFR and CIF — assume the seller controls the goods until they are alongside or on board, which is not what happens when a container is surrendered to a terminal days ahead of loading.',
  },
  {
    q: 'What is the difference between CIF and CIP?',
    a: 'CIF is sea only and requires minimum insurance cover; CIP works for any transport mode and, since the 2020 revision, requires all-risks cover. Risk passes at origin under both, even though the seller pays carriage to the destination.',
  },
  {
    q: 'Do Incoterms say who owns the goods?',
    a: 'No. They allocate cost, risk and the obligations around delivery, export and import. Title, payment terms and the law that governs the contract are all separate matters your sales contract has to settle on its own.',
  },
];

/** The statement that has to accompany any summary of the rules. */
export const INCOTERMS_DISCLAIMER =
  'Incoterms® is a trademark of the International Chamber of Commerce. This is a plain-language ' +
  'summary to help you choose, not legal advice and not a substitute for the published rules. ' +
  'What your contract says takes precedence over anything on this page.';
