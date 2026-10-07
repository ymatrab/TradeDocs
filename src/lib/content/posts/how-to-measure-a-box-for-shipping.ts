import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "lxwxh" 8,100; "how to measure a box for shipping"
 * 1,600; "length width height order" 1,300; "box dimensions order" 480.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave A.
 * Divisors: USPS from DMM 223 (a1-usps-dmm-223); FedEx, UPS and DHL Express metric divisors and
 * the IATA air rule from the core registry. The worked example uses an invented carton.
 */
const article: ContentArticle = {
  slug: 'how-to-measure-a-box-for-shipping',
  title: 'How to measure a box for shipping: L × W × H',
  metaTitle: 'How to measure a box for shipping (L × W × H)',
  description:
    'Which side is length, width and height, how to round, why carriers measure the outside, and how the three numbers become cubic metres and dimensional weight.',
  lede: 'Carriers price a parcel on its size as well as its weight, and the forwarder plans a container from the cartons on your packing list. Both start with three numbers written in a fixed order. Measure them the way the carrier does and the quote, the label and the invoice agree.',
  answer:
    'Measure the packed box on the outside and write it as length × width × height. Length is the longest side, width the shorter side of the base, and height the vertical side. Measure to the widest point, including bulges, and round each figure as your carrier does; USPS rounds up to the whole inch.',
  keyFacts: [
    'The USPS Domestic Mail Manual (DMM 101, 3.2.1) defines a parcel’s length as its longest dimension and its girth as the distance around its thickest part.',
    'For Priority Mail dimensional weight, USPS DMM 223 says to measure length, width and height in inches and round each up to the whole inch.',
    'USPS DMM 223 divides the cubic inches of a parcel larger than 1 cubic foot (1,728 cubic inches) by 139 to get its dimensional weight in pounds.',
    'FedEx, UPS and DHL Express publish a divisor of 5,000 for dimensional weight calculated in centimetres.',
    'IATA describes a general air cargo rule of 6,000 cubic centimetres to the kilogram.',
  ],
  definitions: [
    {
      term: 'L × W × H',
      meaning:
        'Length × width × height, the order in which box dimensions are written: longest side first, height last.',
    },
    {
      term: 'Girth',
      meaning:
        'The distance around the thickest part of a parcel; for a rectangular box, twice the width plus twice the height.',
    },
    {
      term: 'Dimensional weight',
      meaning:
        'A weight worked out from a parcel’s size, which the carrier charges when it is higher than the actual weight.',
    },
    {
      term: 'Divisor',
      meaning:
        'The number a carrier divides the box volume by to turn it into dimensional weight, such as 5,000 for centimetres and kilograms.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What order do box dimensions go in?',
      paragraphs: [
        'Length × width × height, written L × W × H. Length is the longest side of the box. Width is the other side of the base, and height is the side that stands up when the box sits on its base. A box described as 40 × 30 × 25 cm is 40 cm long, 30 cm wide and 25 cm high.',
        'The USPS Domestic Mail Manual gives the rule for length directly: in DMM 101, section 3.2.1, the length of a parcel is the distance of its longest dimension. Carriers and box suppliers follow the same order, so writing the longest side first keeps your quote, label, packing list and booking consistent.',
        'For the volume and the dimensional weight the order makes no difference, because multiplication gives the same result either way. It matters for the length limit, for girth, and for whether the box fits through a sorting system or a container door the way you planned.',
      ],
    },
    {
      heading: 'How do you measure a box for shipping?',
      paragraphs: [
        'Measure the outside of the box after it is packed and sealed, because that is the size the carrier handles and measures. A full box can bulge in the middle, and the bulge counts.',
      ],
      steps: [
        'Pack and seal the box, then set it on a flat surface on the side it will travel on.',
        'Measure the longest side along the base from edge to edge. That is the length.',
        'Measure the shorter side of the base. That is the width.',
        'Measure from the surface to the highest point of the top, including any bulge or handle. That is the height.',
        'Round each figure the way your carrier asks. USPS rounds each one up to the whole inch for Priority Mail dimensional weight.',
        'Weigh the packed box and write the dimensions and the weight on your packing list next to the package number.',
      ],
    },
    {
      heading: 'Should you round box dimensions up or down?',
      paragraphs: [
        'Follow your carrier’s published rule, and round up when it does. USPS DMM 223 says to measure length, width and height in inches and round up each measurement to the whole inch before it calculates the dimensional weight of a Priority Mail parcel.',
        'Rounding happens on each dimension, before you multiply, so a box measuring 15.2 × 11.6 × 9.1 inches is treated as 16 × 12 × 10. Courier and freight carriers publish their own measuring and rounding rules, and they change them from time to time, so check the current page for the service you book. Writing the unrounded figure on the label does not change what the carrier measures.',
      ],
    },
    {
      heading: 'Do you use inside or outside dimensions?',
      paragraphs: [
        'Outside dimensions for shipping, inside dimensions for choosing a box. The product has to fit the inside; the carrier charges for the outside. A supplier’s listing may quote either, so check which one you are reading.',
        'USPS shows the difference on its own Priority Mail International Flat Rate Boxes. It lists the Large Flat Rate Box at 12 × 11¾ × 5½ inches inside and 12¼ × 12 × 6 inches outside. Half an inch of height looks small, but it is the outside figure that goes into the carrier’s volume and weight calculation.',
      ],
    },
    {
      heading: 'How do the dimensions become dimensional weight?',
      paragraphs: [
        'Multiply the three rounded dimensions to get the volume, then divide by the carrier’s divisor. FedEx, UPS and DHL Express publish a divisor of 5,000 when the dimensions are in centimetres and the weight in kilograms. USPS DMM 223 divides cubic inches by 139 for a Priority Mail parcel larger than 1 cubic foot. IATA describes 6,000 cubic centimetres to the kilogram as the general rule for air cargo.',
        'The carrier then compares the result with the actual weight and charges the higher one. The table works one invented carton through the common divisors.',
      ],
      table: {
        caption:
          'Worked example with an invented carton: 40.6 × 30.2 × 25.4 cm (16 × 12 × 10 in after rounding up), 6 kg actual',
        head: ['Divisor', 'Calculation', 'Dimensional weight', 'Higher of the two'],
        rows: [
          [
            '5,000 (cm, kg)',
            '41 × 31 × 26 = 33,046 cm³ ÷ 5,000',
            '6.61 kg',
            'Dimensional, 6.61 kg',
          ],
          [
            '6,000 (cm, kg)',
            '33,046 cm³ ÷ 6,000',
            '5.51 kg',
            'Actual, 6 kg',
          ],
          [
            '139 (in, lb, USPS)',
            '16 × 12 × 10 = 1,920 in³ ÷ 139',
            '13.81 lb, rounded up to 14 lb',
            'Dimensional, 14 lb (6 kg is about 13.2 lb)',
          ],
        ],
      },
    },
    {
      heading: 'How do you convert box dimensions between inches and centimetres?',
      paragraphs: [
        'One inch is exactly 2.54 cm, the factor NIST lists in its guide to SI units. Multiply inches by 2.54 for centimetres, and divide centimetres by 2.54 for inches. For volume, multiply the three converted dimensions; NIST lists one cubic foot as 0.028 316 85 cubic metres.',
        'Convert each dimension first, then round the way the carrier asks, then multiply. Converting the finished volume and rounding at the end gives a slightly different result from the carrier’s, which is how small discrepancies appear on an invoice. For a sea or groupage shipment, the cubic metres (CBM) of each carton feed the total on the packing list: 0.41 × 0.31 × 0.26 m is 0.033 m³ for the carton in the example.',
      ],
    },
    {
      heading: 'What is length plus girth, and when does it matter?',
      paragraphs: [
        'Length plus girth is the length of the box added to the distance around its thickest part. For a rectangular box, girth is twice the width plus twice the height, so a 16 × 12 × 10 inch box has a girth of 44 inches and a length plus girth of 60 inches.',
        'Postal services and couriers use it to set size limits. Under DMM 101, a USPS mailpiece may not measure more than 108 inches in length and girth combined, or 130 inches for USPS Ground Advantage – Retail. Other carriers publish their own maximum length, maximum length plus girth and maximum weight per package; a box over them may be refused or charged as oversize, so check before you pack a long or flat item.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is it length × width × height or width × length × height?',
      a: 'Length × width × height. Length is the longest side, so it comes first, and height, the vertical side, comes last.',
    },
    {
      q: 'Which side is the height of a box?',
      a: 'The side that stands vertical when the box rests on the face it will travel on. Measure it from the surface to the highest point, including any bulge.',
    },
    {
      q: 'Do I measure a box before or after packing it?',
      a: 'After. A packed box can bulge, and the carrier measures the box it receives, so measure the sealed parcel and weigh it at the same time.',
    },
    {
      q: 'How many cubic inches are in a cubic foot?',
      a: '1,728, because a foot is 12 inches and 12 × 12 × 12 is 1,728. USPS DMM 223 uses 1,728 cubic inches as the size above which a Priority Mail parcel is priced on dimensional weight.',
    },
    {
      q: 'What dimensions go on the packing list?',
      a: 'The outside length, width and height of each package, in the unit you state, next to its number and its gross weight. The forwarder and carrier plan space from those figures.',
    },
  ],
  sources: [
    'a1-usps-dmm-101',
    'a1-usps-dmm-223',
    'a1-usps-pmi-flat-rate',
    'fedex-dimensional',
    'ups-dimensional',
    'dhl-express-volumetric',
    'iata-volumetric',
    'nist-si-volume',
    'trade-gov-packing-list',
  ],
  primaryTool: '/tools/chargeable-weight',
  tools: ['/tools/chargeable-weight', '/tools/cbm-calculator', '/tools/packing-list-generator'],
  callout: {
    afterSection: 4,
    tool: '/tools/cbm-calculator',
    title: 'Turn box dimensions into cubic metres',
    text: 'Enter the length, width and height of each carton in centimetres or inches and the quantity, and get the total volume and a check against container sizes.',
  },
  related: [
    '/blog/packing-list-for-shipping',
    '/guides/gross-weight-vs-net-weight',
    '/blog/commercial-invoice-ups-fedex-dhl',
    '/blog/how-many-pallets-fit-in-a-container',
    '/guides/shipping-container-sizes',
  ],
  cover: {
    id: '5gSAWojmSpQ',
    src: 'https://images.unsplash.com/photo-1630448927918-1dbcd8ba439b',
    width: 6000,
    height: 4000,
    alt: 'A sealed brown cardboard box on a white surface, ready to be measured for length, width and height',
    caption: 'A brown cardboard box on a white surface',
    photographer: { name: 'Christopher Bill', profile: 'https://unsplash.com/@umbra_media' },
    page: 'https://unsplash.com/photos/brown-cardboard-box-on-white-surface-5gSAWojmSpQ',
  },
};

export default article;
