import type { FaqEntry } from '@/lib/content/faq';

/**
 * The questions on the three tool pages added on 2026-10-07: the container loading
 * calculator, the unit converter and the delivery note generator.
 *
 * Kept here rather than in lib/content/faq, which the content writers own, so the pages and
 * their FAQPage structured data read one array. A plain module, so a server page and its
 * client calculator can both import it. When the content round folds these into the help
 * centre, move the arrays to lib/content/faq and re-export them from here.
 */

/** /tools/container-loading-calculator */
export const CONTAINER_LOADING_FAQ: readonly FaqEntry[] = [
  {
    q: 'How many cartons fit in a 20ft container?',
    a: 'Divide the container’s internal volume by the volume of one carton, and its maximum payload by the weight of one carton; the smaller figure is the most that can go in. A 20ft standard box is typically about 33 m³ and 28,200 kg, so 0.06 m³ cartons give at most 550 by volume. Real loads come in lower, because cartons rarely divide exactly into the floor and the height.',
  },
  {
    q: 'How many pallets fit in a 40ft container?',
    a: 'It depends mostly on the pallet footprint and whether the pallets can be double-stacked, which a volume calculation cannot see. Enter the pallet’s outside dimensions and loaded weight here for the volume and weight ceiling, then check the floor layout with your forwarder: a single tier of pallets often fills the floor long before it fills the volume.',
  },
  {
    q: 'Is this a load plan?',
    a: 'No. It is an estimate of the upper bound from volume and weight. It does not know the container’s internal length, width and door height, how your units divide into the floor, or whether they stack. A forwarder’s stow plan or a load-planning tool is the answer that binds.',
  },
  {
    q: 'What does “usable volume” mean?',
    a: 'The share of the internal volume you expect to fill. At 100% the calculator gives the pure volume bound. Lower it to allow for the gaps real loading leaves; the right figure depends on your cartons and how they are loaded, so this tool does not pick one for you.',
  },
  {
    q: 'Why is the weight limit lower than I expected?',
    a: 'The payload figures are the maximum the container itself can carry. Road weight limits at origin or destination are often lower, so a heavy cargo can be limited by the truck rather than the box. Check the limit on your route before relying on a weight-limited figure.',
  },
];

/** /tools/unit-converter */
export const UNIT_CONVERTER_FAQ: readonly FaqEntry[] = [
  {
    q: 'How many cubic feet are in a cubic metre?',
    a: 'One cubic metre is 35.3147 cubic feet. A foot is exactly 0.3048 metres, so a cubic foot is exactly 0.028 316 846 592 m³, and one cubic metre is that figure’s reciprocal.',
  },
  {
    q: 'How do I convert kilograms to pounds?',
    a: 'Divide by 0.453 592 37, the exact number of kilograms in one pound (avoirdupois), or multiply by about 2.2046. A 25 kg carton is 55.1156 lb.',
  },
  {
    q: 'Which unit should I use on shipping documents?',
    a: 'Use the unit your buyer, carrier or the destination’s customs expects, and keep it the same across the commercial invoice and packing list. Most international documents use kilograms and cubic metres; U.S. domestic paperwork often uses pounds and cubic feet.',
  },
  {
    q: 'Is the conversion rounded?',
    a: 'Only the result you see. The arithmetic uses the exact factors in decimal, then rounds the answer half-up to four decimal places (six for cubic feet to cubic metres), so converting back gives the figure you started from to that precision.',
  },
];

/** /tools/delivery-note-generator */
export const DELIVERY_NOTE_FAQ: readonly FaqEntry[] = [
  {
    q: 'What is a delivery note?',
    a: 'A document that travels with the goods and lists what is being delivered: the parties and the description and quantity of each line. The receiver checks the goods against it on arrival. It carries no prices.',
  },
  {
    q: 'Is a delivery note the same as a packing list?',
    a: 'They overlap. A packing list itemises the packages with their weights and dimensions, for the forwarder and customs; a delivery note confirms what is handed over to the receiver. Many shippers send both, prepared from the same figures.',
  },
  {
    q: 'Does a delivery note show prices?',
    a: 'No, and this one does not: the PDF prints the goods, HS codes and quantities. The unit price field on the form is used only if you switch the type to an invoice.',
  },
  {
    q: 'Is a delivery note a customs document?',
    a: 'Not usually. Customs work from the commercial invoice and the export declaration; a delivery note is a commercial record between you, the carrier and the receiver.',
  },
  {
    q: 'Is anything I type here saved?',
    a: 'No. The details are sent once to render the PDF and nothing is written to a database. Close the tab and they are gone.',
  },
];
