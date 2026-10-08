import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'temporary-import-bond',
  term: 'Temporary importation under bond (TIB)',
  abbreviation: 'TIB',
  aliases: ['temporary import bond', 'TIB entry', 'temporary importation bond', 'CBP Form 3173'],
  demand: {
    keyword: 'temporary import bond',
    market: 'US',
    volume: 170,
    kd: 17,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'Temporary import bond (TIB): how it works',
  description:
    'How a U.S. temporary importation under bond works: which goods qualify, what the entry and invoice must say, the time limit and extensions, and what happens if the goods are not exported.',
  shortDefinition:
    'A temporary importation under bond (TIB) lets goods that will leave the United States again enter without paying duty, on condition that they are exported or destroyed in time. A customs bond guarantees that promise, and breaking it brings liquidated damages.',
  definition: [
    'TIB rests on Chapter 98, Subchapter XIII of the Harmonized Tariff Schedule. Only goods in its fourteen subheadings, 9813.00.05 to 9813.00.75, qualify, and none of them may be imported for sale or sale on approval. The regulations in 19 CFR 10.31 to 10.40 name cases such as samples used solely for taking orders, motion-picture advertising films, and professional equipment and tools of trade.',
    'The importer files an entry on CBP Form 3461 or 7533 with an entry summary on Form 7501, or the 7501 alone. Beyond the usual data, the entry summary states the subheading claimed, how the goods will be used, and a declaration that they will not be put to any other use or sold. A bond on CBP Form 301 secures the export promise; an ATA carnet can replace both the entry and the bond.',
    'The goods must be exported or destroyed within the bond period. Under 19 CFR 10.37 the importer can ask for up to two further periods of one year each on CBP Form 3173, provided the goods are still in the country and no liquidated damages have been assessed, so the stay cannot exceed three years from importation.',
  ],
  onYourDocuments: [
    'Under 19 CFR 10.31(e) the entry or invoice must describe each article in detail, give its value, and show any marks, numbers or other distinguishing features. Serial numbers on the commercial invoice are what let CBP match the goods that leave with the goods that came in.',
    'Because TIB goods are not sold, the invoice is usually a pro forma or a no-charge commercial invoice that states a value for customs and the reason the goods are travelling, such as demonstration, testing or a trade show.',
  ],
  example: {
    caption: 'Worked example with invented parties',
    paragraphs: [
      'Lumio Studio (invented), a Danish lighting company, sends three demonstration fixtures to a trade fair in Las Vegas. Its U.S. broker files a TIB entry under the subheading for samples used for taking orders, with a continuous bond on file and an invoice listing each fixture with its serial number and value.',
      'After the fair the fixtures go back to Copenhagen. The broker proves export against the serial numbers, the bond obligation closes, and no duty is paid. Had the fixtures stayed for a second show, Lumio would have filed Form 3173 before the period ran out.',
    ],
  },
  confusedWith: [
    {
      term: 'ATA carnet',
      difference:
        'A carnet is an international document accepted in many countries, guaranteed by a national guaranteeing association. A TIB is a U.S. entry backed by a U.S. customs bond. CBP accepts a carnet in place of the TIB entry and bond.',
    },
    {
      term: 'Duty drawback',
      difference:
        'Drawback refunds duty already paid on goods later exported. Under a TIB no duty is paid at entry, as long as the goods leave or are destroyed in time.',
    },
  ],
  related: [
    '/guides/ata-carnet',
    '/blog/commercial-invoice-for-samples',
    '/blog/customs-bond',
    '/guides/duty-drawback',
  ],
  tool: '/tools/invoice-generator',
  toolPitch:
    'The commercial invoice generator lets you list each article with its own line, value and serial number, which is the detail a TIB entry asks for.',
  faq: [
    {
      q: 'How long can goods stay in the U.S. under a TIB?',
      a: 'For the bond period, which CBP can extend on Form 3173 by up to two further periods of one year each. The total cannot exceed three years from the date of importation.',
    },
    {
      q: 'What happens if TIB goods are not exported in time?',
      a: 'CBP assesses liquidated damages under the bond. An extension can no longer be granted once liquidated damages have been assessed, so the request has to come before the period ends.',
    },
    {
      q: 'Can goods imported under a TIB be sold in the United States?',
      a: 'No. The entry declares that the goods are not imported for sale or sale on approval and will not be put to any other use.',
    },
  ],
  sources: ['e5-cbp-tib', 'e5-cfr-19-10-31', 'e5-cfr-19-10-37', 'c8-cbp-ata-carnet-faqs'],
  regulated: true,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
