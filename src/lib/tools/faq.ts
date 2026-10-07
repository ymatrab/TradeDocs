import type { FaqEntry } from '@/lib/content/faq';

/**
 * The questions on the tool pages added on 2026-10-07: the container loading
 * calculator, the unit converter, the delivery note generator, the CBM-to-cubic-feet
 * converter and the pallet calculator.
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

/** /tools/cbm-to-cubic-feet */
export const CBM_TO_CUBIC_FEET_FAQ: readonly FaqEntry[] = [
  {
    q: 'How do I convert CBM to cubic feet?',
    a: 'Multiply the cubic metres by 35.3147. A foot is exactly 0.3048 m, so a cubic foot is exactly 0.028 316 846 592 m³ and one CBM is the reciprocal of that, about 35.3147 ft³. 2.5 CBM is 88.2867 ft³.',
  },
  {
    q: 'How do I convert cubic feet to CBM?',
    a: 'Multiply the cubic feet by 0.028 316 846 592, or divide by 35.3147. 100 ft³ is 2.831685 m³.',
  },
  {
    q: 'How many litres are in a cubic metre?',
    a: 'Exactly 1,000. The litre is defined as 0.001 m³, so 1 CBM is 1,000 L and 1,000,000 cm³.',
  },
  {
    q: 'How do I get CBM from carton dimensions?',
    a: 'This page converts a volume you already have. To work out the volume from length, width and height, use the CBM calculator: it multiplies the three, applies the carton count and gives the total in m³ and ft³.',
  },
  {
    q: 'Is the result rounded?',
    a: 'Only for display. The arithmetic uses the exact defined factors in decimal, then rounds each result half-up: six places for m³, four for ft³, three for litres and two for cm³ and in³.',
  },
];

/** /tools/pallet-calculator */
export const PALLET_CALCULATOR_FAQ: readonly FaqEntry[] = [
  {
    q: 'How many boxes fit on a pallet?',
    a: 'Divide the pallet’s length and width by the carton’s, both ways round, and keep the better layer; then divide the height you may load to, less the pallet’s own height, by the carton height for the layers. A 40 × 30 × 30 cm carton on a 1,200 × 800 mm euro pallet gives 8 per layer, and 5 layers to 1.8 m, so 40 cartons.',
  },
  {
    q: 'Does the calculator allow overhang or mixed patterns?',
    a: 'No. Every carton stands upright and faces the same way in a layer, within the pallet’s edges. Interlocked or pinwheel patterns can fit more, and overhang is something your carrier or buyer may refuse, so the result is a plan to check, not a stacking pattern.',
  },
  {
    q: 'What maximum height should I use?',
    a: 'The lowest limit that applies: your carrier’s or forwarder’s pallet height, the container or trailer door, the buyer’s racking. Enter it including the pallet itself. The calculator does not pick one for you.',
  },
  {
    q: 'What is the weight limit for?',
    a: 'The most the goods on the pallet may weigh. EPAL lists a safe working load of 1,500 kg for its EPAL 1 euro pallet and 1,250 kg for the EPAL 2, and the presets fill those in. Your carrier’s limit may be lower; use whichever is lower.',
  },
  {
    q: 'Does it check crushing strength?',
    a: 'No. Whether the bottom cartons can bear the layers above depends on the carton board and the goods, which the calculator cannot know. Ask your packaging supplier for the stacking strength.',
  },
];
