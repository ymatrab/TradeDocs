import { LISTED_GLOSSARY } from '@/lib/content/glossary';
import { GUIDES } from '@/lib/content/guides';
import { USE_CASES } from '@/lib/content/use-cases';
import { INCOTERMS, INCOTERMS_HUB_FAQ } from '@/lib/trade/incoterms';

/**
 * Every question the site answers, in one module.
 *
 * The tool pages render their own block from here and hand the same entries to their
 * FAQPage structured data; the help centre and the help panel search all of them. The
 * Incoterms and guide answers stay beside the content they belong to and are read from
 * there, so nothing is copied twice.
 */

export type FaqEntry = { q: string; a: string };

/** /tools/invoice-generator */
export const INVOICE_GENERATOR_FAQ: readonly FaqEntry[] = [
  {
    q: 'How do I create my own commercial invoice?',
    a: 'Fill in the form above: a document number, the seller and buyer, and one line for each kind of goods with its quantity and unit price. Add the currency, the Incoterms® rule and place and the country of origin, then download the PDF. Nothing needs installing and no account is required.',
  },
  {
    q: 'Is there a standard commercial invoice format?',
    a: 'There is no single worldwide form. Most countries accept the seller’s own invoice as long as it carries the information they require, which is why the content matters more than the layout. For goods entering the United States, the required contents are set out in 19 CFR 141.86.',
  },
  {
    q: 'What has to be on a commercial invoice?',
    a: 'The usual core is the seller and buyer with full addresses, an invoice number and date, a description of the goods, quantities, unit prices and the total, the currency and the country of origin, with the agreed Incoterms® rule and its named place beside them. What is actually required depends on the importing country; for the United States it is set out in 19 CFR 141.86. HS codes are not always mandatory, but customs work is faster with them.',
  },
  {
    q: 'Which fields does the generator need?',
    a: 'A document number, the names of both companies and at least one described line of goods with a quantity above zero. Everything marked optional can be left blank and the PDF will still be produced, but the customs authority in the importing country may expect it, so fill in what applies to your shipment.',
  },
  {
    q: 'What is the difference between a commercial invoice and a proforma invoice?',
    a: 'A proforma is issued before the sale is concluded — it is a formal quotation the buyer uses to arrange payment or open a letter of credit. A commercial invoice is the demand for payment for goods actually sold, and it is the document customs values the consignment from.',
  },
  {
    q: 'Is anything I type here saved?',
    a: 'No. The form runs in your browser, the details are sent once to render the PDF, and nothing is written to a database. Close the tab and it is gone — which also means we cannot recover it for you.',
  },
  {
    q: 'Is the PDF watermarked?',
    a: 'No. It is produced by the same engine the product uses, so what you download is the real output. Every document carries a line stating that it was prepared from your own data and is not issued or certified by any authority — that line is on every TradeDocs document and cannot be removed.',
  },
];

/** /tools/proforma-invoice-generator */
export const PROFORMA_GENERATOR_FAQ: readonly FaqEntry[] = [
  {
    q: 'What is a proforma invoice?',
    a: 'A quotation laid out as an invoice. It tells a prospective buyer exactly what it would be buying, at what price and on what terms, before the sale is final. The buyer uses it to arrange payment, open a letter of credit or apply for an import licence.',
  },
  {
    q: 'Is a proforma invoice the same as a commercial invoice?',
    a: 'No. A proforma is issued before the sale and does not request payment for goods delivered. The commercial invoice is issued when the goods are sold and shipped, and it is the document customs values them from. Most fields are shared, which is why this generator can produce both.',
  },
  {
    q: 'Can I add a validity date and payment terms?',
    a: 'Yes. Under the document details, set a valid-until date for the offer, the buyer’s reference or purchase order number, and your payment terms; the PDF prints the first two beside the shipment terms and the payment terms under the total. Leave any of them blank and it is left off. Package dimensions and a shipping date are not on the proforma, and it shows no weights; those print on the packing list.',
  },
  {
    q: 'Is anything I type here saved?',
    a: 'No. The details are sent once to render the PDF and nothing is written to a database. Close the tab and they are gone.',
  },
];

/** /tools/packing-list-generator */
export const PACKING_LIST_GENERATOR_FAQ: readonly FaqEntry[] = [
  {
    q: 'What is a packing list used for?',
    a: 'It itemises what is in each package of a shipment. Freight forwarders use it to work out weights and shipping costs, and customs officials use it to check the contents of packages against the declaration, as the U.S. International Trade Administration describes.',
  },
  {
    q: 'Does a packing list show prices?',
    a: 'Not normally, and this one does not: the PDF prints packages, quantities and weights, not unit prices or values. The values belong on the commercial invoice. The unit price field on the form is used only if you switch the type to an invoice.',
  },
  {
    q: 'Do the packing list and commercial invoice have to match?',
    a: 'They should describe the same goods in the same quantities, with the same parties and terms. A packing list that disagrees with its invoice is a common reason for questions at customs, which is why preparing both from the same figures matters.',
  },
  {
    q: 'Can I download the packing list as Excel?',
    a: 'Not from this page; it produces a PDF, which is what is usually sent with the shipment. With an account, a shipment’s documents download together, and the product catalog imports from the spreadsheet you already keep.',
  },
];

/** /tools/cbm-calculator */
export const CBM_CALCULATOR_FAQ: readonly FaqEntry[] = [
  {
    q: 'How do I convert CBM to cubic feet?',
    a: 'Multiply by 35.3147. One foot is exactly 0.3048 metres, so one cubic foot is 0.0283168 m³ and one cubic metre is about 35.3147 ft³. To go the other way, multiply cubic feet by 0.0283168, or divide by 35.3147.',
  },
  {
    q: 'What is CBM?',
    a: 'CBM is cubic metres — length × width × height, in metres, multiplied by the number of cartons. It is the figure sea freight quotations for LCL cargo are built from, because a shipper pays for the space a consignment occupies as much as for what it weighs.',
  },
  {
    q: 'How do I calculate CBM by hand?',
    a: 'Convert every dimension to metres, multiply the three together for one carton, then multiply by the carton count. A 40 × 30 × 20 cm carton is 0.4 × 0.3 × 0.2 = 0.024 m³, so fifty of them are 1.2 CBM.',
  },
  {
    q: 'Does the carrier charge on CBM or on weight?',
    a: 'On whichever produces the larger figure. Sea LCL commonly bills at one tonne per cubic metre, so 2 CBM weighing 1,500 kg is charged as 2,000 kg. Air freight applies a volumetric divisor instead.',
  },
  {
    q: 'How many CBM fit in a 20ft container?',
    a: 'Typically about 33 m³ of internal volume, against roughly 67 m³ in a 40ft standard and 76 m³ in a 40ft high cube — the figures Maersk, for example, publishes for its dry containers. Individual boxes vary by series and carrier, and loaded cargo rarely reaches those figures, because cartons do not divide neatly into the floor and cannot always be stacked.',
  },
];

/** /tools/chargeable-weight */
export const CHARGEABLE_WEIGHT_FAQ: readonly FaqEntry[] = [
  {
    q: 'What is dimensional weight?',
    a: 'A weight worked out from a package’s size rather than its mass: length × width × height divided by the carrier’s divisor. It is called dimensional or DIM weight by FedEx and UPS, and volumetric weight by DHL and IATA. The idea is the same under both names.',
  },
  {
    q: 'What is chargeable weight?',
    a: 'The greater of a consignment’s actual weight and its volumetric weight. Carriers sell space as well as lift, so a light bulky consignment is billed on the room it takes up rather than what it weighs.',
  },
  {
    q: 'What is the volumetric divisor for air freight?',
    a: 'The general IATA convention is 6,000 cm³ per kilogram, which works out at about 167 kg per cubic metre. DHL Express, FedEx and UPS publish 5,000 cm³ per kilogram for their express services, or 200 kg per cubic metre, which produces a higher charge for the same box.',
  },
  {
    q: 'How is volumetric weight calculated?',
    a: 'Multiply length by width by height to get the volume, then divide by the carrier’s divisor. For a 60 × 40 × 40 cm carton that is 96,000 cm³; at the IATA divisor of 6,000 that is 16 kg, whatever the scales say.',
  },
  {
    q: 'Does sea freight use volumetric weight?',
    a: 'LCL sea freight uses the same idea under a different name — weight or measure, W/M — and bills at whichever is greater, commonly treating one cubic metre as one tonne — a common industry convention, so check your forwarder’s tariff. Full container loads are priced per container instead, so the comparison does not arise.',
  },
];

/** /tools/landed-cost-calculator */
export const LANDED_COST_FAQ: readonly FaqEntry[] = [
  {
    q: 'What is landed cost?',
    a: 'The total cost of getting goods to your door: what you pay the supplier, plus freight, insurance, import duty, import taxes and the other charges along the way, such as broker and port fees. Divided by the number of units, it is the cost you price your products from.',
  },
  {
    q: 'How do I calculate landed cost?',
    a: 'Add the goods value, freight and insurance, then the duty (the duty rate times the customs value), then import taxes (the tax rate times the value they are charged on), then any other costs. The calculator does exactly that with the figures and rates you enter.',
  },
  {
    q: 'Is duty charged on the goods value or on the CIF value?',
    a: 'It depends on the importing country. Customs value starts from the price paid for the goods, and countries that value on a CIF basis add the freight and insurance to the place of importation, as the WTO Customs Valuation Agreement describes. Ask your broker which basis applies, and choose it in the calculator.',
  },
  {
    q: 'Where do I find the duty rate for my product?',
    a: 'In the importing country’s tariff, under the HS code of the product, or from your customs broker. The rate can depend on the origin of the goods and on any trade agreement claimed, which is why this calculator leaves it to you.',
  },
];

/** /tools/export-price-calculator */
export const EXPORT_PRICE_FAQ: readonly FaqEntry[] = [
  {
    q: 'How do I work out a FOB price from an ex-works price?',
    a: 'Start from the EXW price, the goods at your premises with your margin, and add what it costs to deliver them to the main carrier: inland transport to the port or terminal, export clearance and the origin loading and terminal charges. That sum is the FCA or FOB price. The calculator adds the figures you enter; it has no rates of its own.',
  },
  {
    q: 'How do I calculate a CIF price?',
    a: 'Add the main freight to the FOB price to get the CFR price, then add the cargo insurance premium to get CIF. The same arithmetic gives CPT and CIP for any mode of transport. Under Incoterms® 2020, CIF needs at least minimum cover and CIP all-risks cover, so ask your insurer for the premium at the level the rule and your contract require.',
  },
  {
    q: 'How is the DDP price estimated?',
    a: 'From the CIF price, plus the destination charges, the import duty and the import taxes. Duty is the rate you enter applied to the CIF or FOB value, as you choose, and taxes are the rate you enter applied to that value with or without the duty. The importing country decides the real basis and rates, so treat the DDP figure as an estimate to check with a broker there.',
  },
  {
    q: 'Is the result a quotation?',
    a: 'No. It is arithmetic on the costs and rates you typed. A price you quote a buyer should rest on current quotes from your forwarder, insurer and broker, and on the Incoterms® rule and named place written into the contract.',
  },
];

/** /tools/hs-code-lookup */
export const HS_CODE_LOOKUP_FAQ: readonly FaqEntry[] = [
  {
    q: 'How do I find the HS code for my product?',
    a: 'Search the tariff of the country the goods are entering by what the product is made of and what it does, then read down from the heading to the most specific line that describes it. This lookup searches the US Harmonized Tariff Schedule and the UK Trade Tariff at once and links every line to the official page, where the section and chapter notes that decide between lines are printed.',
  },
  {
    q: 'Is the code this tool finds the right classification?',
    a: 'Not necessarily. It shows lines whose wording matches your search; it does not decide which line your goods belong in. Classification follows the tariff’s own interpretation rules and legal notes, and the importer, usually with a customs broker, is responsible for the code declared. For certainty, ask the customs authority for a binding ruling.',
  },
  {
    q: 'Why are the US and UK codes different?',
    a: 'The first six digits are the international Harmonized System and are the same in both. Each country adds its own digits after that: the United States uses ten-digit HTS numbers and the United Kingdom ten-digit commodity codes, and the national lines often split goods differently.',
  },
  {
    q: 'Does the lookup show duty rates?',
    a: 'No. The rate depends on the exact line, the origin of the goods and any trade preference claimed, and the importing authority decides it. Open the official page for a line to see the measures that apply, or ask your customs broker.',
  },
];

/** /tools/denied-party-screening */
export const DENIED_PARTY_FAQ: readonly FaqEntry[] = [
  {
    q: 'What is denied party screening?',
    a: 'Checking the names of the parties to a transaction (buyer, consignee, end user, agents) against the lists of people and organisations a government restricts trade with. The US Consolidated Screening List brings together the export screening lists of the Departments of Commerce, State and the Treasury in one search.',
  },
  {
    q: 'What should I do if a name matches?',
    a: 'Do not treat a match as a final answer either way. Compare the address, country and other details with the listing, open the source list it came from, and check the official publication of that list. If the match may be real, stop and take advice from your compliance team or a trade lawyer before you proceed.',
  },
  {
    q: 'Does no match mean I can ship?',
    a: 'No. A clean search only means the name you typed did not match the consolidated list today. Licensing requirements, end-use rules, embargoes and other countries’ sanctions lists still apply, and names can be spelled many ways. This is a screening aid, not a compliance determination.',
  },
  {
    q: 'Do you keep the names I search?',
    a: 'No. The name is sent to the trade.gov Consolidated Screening List API to run the search and the results are shown to you. TradeDocs does not store or log the names searched.',
  },
];

/**
 * The homepage's questions. The homepage still declares its own copy (it is owned by the
 * design round and was not edited here); it should import this list instead, and until it
 * does the two must be changed together.
 */
export const HOME_FAQ: readonly FaqEntry[] = [
  {
    q: 'Does TradeDocs issue or certify my documents?',
    a: 'No. TradeDocs prepares documents from the data you enter. Issuing, endorsing, certifying and clearing are done by carriers, chambers of commerce and customs authorities. Every document says so on its face, and that labelling cannot be removed.',
  },
  {
    q: 'What happens when a shipment changes after I have generated documents?',
    a: 'A generated document is locked to the shipment revision it came from, so it never changes underneath you. If the shipment moves on, the earlier document is marked stale and you decide whether to re-issue it. Nothing is rewritten silently.',
  },
  {
    q: 'Do I have to enter my company details for every shipment?',
    a: 'No. Companies, customers, addresses and products are stored once and reused. That reuse is the point: retyping is where the invoice and the packing list start to disagree.',
  },
  {
    q: 'Is my shipment data visible to anyone else?',
    a: 'No. Every record belongs to your organization, and access is enforced by the database itself rather than by the interface. A request for another organization’s data returns nothing, whichever route it arrives on.',
  },
  {
    q: 'What does it cost?',
    a: 'Nothing today. TradeDocs is free while it is early, and paid plans will arrive later with clear notice.',
  },
];

/**
 * Account and support questions that have no other page. Each answer describes what the
 * application does today (src/app/(auth), src/app/(app)/app/account, /contact).
 */
export const ACCOUNT_FAQ: readonly FaqEntry[] = [
  {
    q: 'I forgot my password. How do I get back in?',
    a: 'Use “Forgot your password?” on the sign-in page. If the address has an account, a reset link arrives by email and lets you choose a new password. You can also ask for a one-time sign-in link instead.',
  },
  {
    q: 'How do I add a colleague to my organization?',
    a: 'Owners and admins can invite people from the Members page of the workspace. Invitations by email are not sent yet, so you copy the invitation link and pass it on yourself. The colleague opens it while signed in to join.',
  },
  {
    q: 'How do I delete my account?',
    a: 'Open Account in the workspace and choose “Delete my account”, then confirm with your password. Nothing is removed straight away: the request waits 30 days, and you can withdraw it at any point in that time. Organizations you own are not removed with you, so hand ownership over first.',
  },
  {
    q: 'Can I get a copy of the data you hold about me?',
    a: 'Yes. Send a request through the contact form and choose “Privacy or a data request”. The privacy policy lists what is held and why.',
  },
  {
    q: 'How do I reach a person?',
    a: 'Use the contact form. Messages go to the team that runs TradeDocs; there is no live chat today.',
  },
];

export type HelpEntry = FaqEntry & {
  /** Stable within a build; used as the element id and the React key. */
  id: string;
  /** Where the answer lives, so a reader can go to its context. */
  source: { href: string; label: string };
  /** Other phrasings the search matches without showing them. */
  keywords?: string;
};

type Group = { href: string; label: string; entries: readonly FaqEntry[] };

function groups(): Group[] {
  return [
    { href: '/help', label: 'Accounts and support', entries: ACCOUNT_FAQ },
    { href: '/', label: 'TradeDocs', entries: HOME_FAQ },
    ...USE_CASES.map((useCase) => ({
      href: `/for/${useCase.slug}`,
      label: useCase.name,
      entries: useCase.faq,
    })),
    {
      href: '/tools/invoice-generator',
      label: 'Commercial invoice generator',
      entries: INVOICE_GENERATOR_FAQ,
    },
    {
      href: '/tools/proforma-invoice-generator',
      label: 'Proforma invoice generator',
      entries: PROFORMA_GENERATOR_FAQ,
    },
    {
      href: '/tools/packing-list-generator',
      label: 'Packing list generator',
      entries: PACKING_LIST_GENERATOR_FAQ,
    },
    { href: '/tools/cbm-calculator', label: 'CBM calculator', entries: CBM_CALCULATOR_FAQ },
    {
      href: '/tools/chargeable-weight',
      label: 'Dimensional weight calculator',
      entries: CHARGEABLE_WEIGHT_FAQ,
    },
    {
      href: '/tools/landed-cost-calculator',
      label: 'Landed cost calculator',
      entries: LANDED_COST_FAQ,
    },
    {
      href: '/tools/export-price-calculator',
      label: 'Export price calculator',
      entries: EXPORT_PRICE_FAQ,
    },
    { href: '/tools/hs-code-lookup', label: 'HS code lookup', entries: HS_CODE_LOOKUP_FAQ },
    { href: '/tools/incoterms', label: 'Incoterms 2020 guide', entries: INCOTERMS_HUB_FAQ },
    ...INCOTERMS.map((term) => ({
      href: `/tools/incoterms/${term.code.toLowerCase()}`,
      label: `${term.code}: ${term.name}`,
      entries: term.faq,
    })),
    ...GUIDES.map((guide) => ({
      href: `/guides/${guide.slug}`,
      label: guide.title,
      entries: guide.faq,
    })),
    // Each listed glossary term: its definition first, then its own questions.
    ...LISTED_GLOSSARY.map((term) => ({
      href: `/glossary/${term.slug}`,
      label: `Glossary: ${term.term}`,
      entries: [
        {
          q: `What does ${term.abbreviation ?? term.term.toLowerCase()} mean?`,
          a: term.shortDefinition,
        },
        ...term.faq,
      ],
    })),
  ];
}

/** Every answer on the site, each once, with where it comes from. */
export function helpEntries(): HelpEntry[] {
  const seen = new Set<string>();
  const entries: HelpEntry[] = [];
  for (const group of groups()) {
    group.entries.forEach((entry, index) => {
      const key = entry.q.trim().toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      const slug = group.href === '/' ? 'home' : group.href.replace(/^\//, '').replace(/\//g, '-');
      entries.push({
        ...entry,
        id: `${slug}-${index + 1}`,
        source: { href: group.href, label: group.label },
      });
    });
  }
  return entries;
}
