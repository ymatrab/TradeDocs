import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google UK, 2026-10-06): "windsor framework" 1,600, KD 17; "shipping to
 * northern ireland" 210.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave D, review gate: this guide describes
 * official procedures TradeDocs does not carry out (UKIMS, declarations, SPS certification), and
 * stays noindex until a review record exists (rules/seo-content.md). Every rule is from GOV.UK
 * Windsor Framework pages opened 2026-10-08. Example parties are invented.
 */
const article: ContentArticle = {
  slug: 'shipping-to-northern-ireland',
  title: 'Shipping to Northern Ireland under the Windsor Framework',
  metaTitle: 'Windsor Framework: shipping to Northern Ireland',
  description:
    'How goods move from Great Britain to Northern Ireland under the Windsor Framework: UKIMS, “not at risk” goods, simplified declarations, food and plant rules, and NI to GB.',
  lede: 'Goods sent from Great Britain to Northern Ireland stay inside the UK, yet they cross a customs and regulatory boundary. The Windsor Framework sets how that works: authorised traders moving goods for use in Northern Ireland get simplified processes, and everything else follows full customs rules. TradeDocs does not file declarations, hold UKIMS authorisation or issue certificates for you; this guide explains the official process.',
  answer:
    'Under the Windsor Framework, businesses moving goods from Great Britain to Northern Ireland can use simplified processes if they hold UK Internal Market Scheme (UKIMS) authorisation and the goods are “not at risk” of moving into the EU. Other movements follow the full customs process. Qualifying Northern Ireland goods moving to Great Britain need no import declaration.',
  keyFacts: [
    'GOV.UK says the UK government and the EU agreed the Windsor Framework in February 2023.',
    'HMRC says UKIMS authorisation is required before goods move from Great Britain to Northern Ireland using the simplified processes.',
    'HMRC says movements that do not meet the simplified criteria follow the standard full customs process, even for UKIMS-authorised traders.',
    'HMRC says goods declared “at risk” of moving into the EU are charged the applicable EU rate of duty.',
    'GOV.UK says qualifying Northern Ireland goods moved directly to Great Britain need no import declaration.',
  ],
  definitions: [
    {
      term: 'UK Internal Market Scheme (UKIMS)',
      meaning:
        'HMRC’s authorisation that lets a business declare goods “not at risk” when they are for sale to, or final use by, end consumers in the UK.',
    },
    {
      term: '“Not at risk” goods',
      meaning:
        'Goods moved into Northern Ireland that meet HMRC’s conditions showing they will stay in the UK rather than move on into the EU.',
    },
    {
      term: 'Trader Support Service (TSS)',
      meaning:
        'A free government service that helps businesses make the declarations for moving goods into Northern Ireland.',
    },
    {
      term: 'XI EORI number',
      meaning:
        'An EORI number starting with XI, which businesses may need to move goods between Northern Ireland and non-EU countries, including Great Britain.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is the Windsor Framework?',
      paragraphs: [
        'The UK–EU arrangement for goods moving into and out of Northern Ireland. GOV.UK says the two sides agreed it in February 2023, and that references to the Northern Ireland Protocol were replaced with the Windsor Framework in January 2024.',
        'Its practical effect for a small business is that Northern Ireland follows some EU rules for goods. GOV.UK says EU VAT rules continue to apply in Northern Ireland in respect of goods, EU export control rules still apply to dual-use items there, and businesses may need an XI EORI number. HMRC said in May 2025 that the new Windsor Framework arrangements had been implemented.',
      ],
    },
    {
      heading: 'Do goods from Great Britain to Northern Ireland need a customs declaration?',
      paragraphs: [
        'Business movements generally need declaration data, but the amount depends on your authorisation and the goods. HMRC says UKIMS-authorised traders can submit Internal Market Movement Information, a simplified dataset with less information than a full declaration, either before the movement or afterwards through entry in their records.',
        'A Trader Goods Profile pre-fills some details, so HMRC says traders give a product reference or plain description and standard commercial information instead of a commodity code on each movement. The free Trader Support Service can make the declarations for you, or you can appoint a customs agent or use a courier that completes the dataset.',
      ],
      table: {
        caption: 'Common movement types and the route GOV.UK describes (retrieved 8 October 2026)',
        head: ['Movement', 'Route'],
        rows: [
          [
            'GB to NI, UKIMS-authorised, goods “not at risk”',
            'Simplified Internal Market Movement Information',
          ],
          [
            'GB to NI, not authorised or goods do not qualify',
            'Full customs process; EU duty applies to “at risk” goods',
          ],
          ['GB to NI, parcel to a consumer', 'No customs declaration, according to HMRC'],
          [
            'GB to NI, business-to-business parcel',
            'Simplified only if the sender or receiver is UKIMS-authorised',
          ],
          [
            'Qualifying NI goods to GB',
            'No import declaration; export declaration only in limited cases',
          ],
          ['NI directly to the EU', 'No declarations; Intrastat may apply'],
        ],
      },
    },
    {
      heading: 'What makes goods “not at risk”?',
      paragraphs: [
        'A set of conditions about the trader, the goods and the journey. HMRC lists them on its internal market movements page; all have to be met.',
      ],
      list: [
        'The business moving the goods is UKIMS-authorised.',
        'The goods are in free circulation in Great Britain and are moving into free circulation in Northern Ireland.',
        'They are Standard or Category 2 goods; Category 1 goods are not eligible.',
        'Standard goods travel by direct transport, are for UK end consumers and carry no import or licensing requirements.',
        'Category 2 goods, such as excise products or goods under special health, licensing or environmental controls, meet extra requirements, including document controls.',
      ],
    },
    {
      heading: 'How do you send goods to Northern Ireland?',
      paragraphs: [
        'Settle your status before the first movement, then repeat the same routine. The steps summarise GOV.UK guidance; TradeDocs does not carry out any of them for you.',
      ],
      steps: [
        'Get an EORI number; HMRC says one is needed to move goods from Great Britain to Northern Ireland, and you may need one starting with XI.',
        'Decide whether to apply for UKIMS authorisation, and whether your goods are Standard, Category 1 or Category 2.',
        'Sign up for the Trader Support Service, or appoint a customs agent, or confirm your courier completes the dataset.',
        'Prepare the commercial invoice and packing list with plain descriptions, quantities, values and the consignee.',
        'Submit the movement information or declaration through your chosen route before the goods travel, unless you are authorised to declare afterwards.',
        'For food, plants or animal products, add the official certificates and pre-notifications the SPS rules require.',
      ],
    },
    {
      heading: 'What about food, plants and animal products?',
      paragraphs: [
        'They have their own official checks. GOV.UK lists the steps for live animals and animal-origin products as a vet inspection and export health certificate, pre-notification with a Common Health Entry Document through DAERA’s TRACES NT system, and a customs declaration. APHA’s guidance confirms that an EHC is needed from Great Britain to Northern Ireland.',
        'HMRC says agri-food goods moved under the Northern Ireland Retail Movement Scheme (NIRMS) can be declared as Standard goods. For plants, GOV.UK says goods staying in Northern Ireland need a Northern Ireland plant health label and goods not staying need a phytosanitary certificate. These certificates come from official bodies; TradeDocs does not issue them.',
      ],
    },
    {
      heading: 'What about goods going from Northern Ireland to Great Britain?',
      paragraphs: [
        'Simpler. GOV.UK says qualifying Northern Ireland goods moved directly to Great Britain need no import declaration, and export declarations are needed only in limited exceptions; goods moved through Ireland are treated the same, apart from limited cases, and you may be asked for commercial evidence.',
        'Invented example: Glenarm Joinery (an invented company in County Antrim) sells fitted kitchens to customers in Manchester. Its goods qualify, so it ships them with a commercial invoice it keeps as evidence of the movement, without an import declaration.',
      ],
    },
  ],
  faq: [
    {
      q: 'Does TradeDocs make Northern Ireland declarations or hold UKIMS for me?',
      a: 'No. TradeDocs prepares commercial documents such as invoices and packing lists. Declarations, UKIMS authorisation and SPS certificates go through HMRC, the Trader Support Service, your agent or the official certifying bodies.',
    },
    {
      q: 'Is VAT charged on goods sent from Great Britain to Northern Ireland?',
      a: 'GOV.UK says EU VAT rules continue to apply to goods in Northern Ireland, and VAT-registered businesses trading with the EU add an XI prefix to their VAT number. Check HMRC’s VAT guidance for your own movement.',
    },
    {
      q: 'Is the Trader Support Service free?',
      a: 'Yes. GOV.UK describes the Trader Support Service as free for businesses moving goods between Great Britain and Northern Ireland or bringing goods into Northern Ireland from outside the UK.',
    },
    {
      q: 'What happens to goods declared “at risk”?',
      a: 'HMRC says they are charged the applicable EU rate of duty. Waivers, reimbursement or remission may be available for duty paid, under conditions HMRC sets out.',
    },
  ],
  sources: [
    'd4-gov-uk-trading-ni',
    'd4-gov-uk-internal-market-movements',
    'd4-gov-uk-dual-use-controls',
    'd4-gov-uk-get-ehc',
    'd4-gov-uk-export-plants',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: ['/tools/invoice-generator', '/tools/packing-list-generator'],
  callout: {
    afterSection: 2,
    tool: '/tools/invoice-generator',
    title: 'Have the commercial information ready',
    text: 'Simplified movement data still asks for plain descriptions and standard commercial information. Build the invoice once in our invoice generator and give the same details to your declarant.',
  },
  related: [
    '/guides/how-to-export-from-the-uk',
    '/guides/eori-number',
    '/blog/uk-export-declaration',
    '/blog/zero-rating-exports-vat-uk',
    '/blog/shipping-to-the-uk-and-eu-documents',
    '/guides/transit-declarations-t1-ncts',
  ],
  cover: {
    id: 'OdQuwJulLLU',
    src: 'https://images.unsplash.com/photo-1628583731839-5f47d7cadcf6',
    width: 4503,
    height: 2814,
    alt: 'Belfast’s waterfront with the Harland and Wolff shipyard crane and Titanic Belfast seen across the water',
    caption: 'Belfast’s Titanic Quarter and shipyard crane from the water',
    photographer: { name: 'K. Mitch Hodge', profile: 'https://unsplash.com/@kmitchhodge' },
    page: 'https://unsplash.com/photos/red-and-white-boat-on-water-near-green-and-white-building-during-daytime-OdQuwJulLLU',
  },
};

export default article;
