import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "section 321" 260, KD n/a; "de minimis value" 210,
 * KD 41; "de minimis" 49,500 (head term mixed: legal maxim, tariff news).
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave D (v2 #28: low-value thresholds;
 * fast-changing, so every threshold is dated to the official page that states it).
 */
const article: ContentArticle = {
  slug: 'de-minimis',
  title: 'De minimis: low-value import thresholds in the US, UK and EU',
  metaTitle: 'De minimis and Section 321: thresholds in 2026',
  description:
    'What de minimis means for low-value imports, the suspension of Section 321 in the US, the UK’s £135 rule and the EU’s €3 parcel duty, each dated to the official page.',
  lede: 'For years, small parcels into the United States under $800 crossed the border without duty under Section 321. That has changed, and the UK and EU have their own low-value rules that changed too. This guide sets out what each official page said when we checked it on 8 October 2026, and what stays the same for your invoice.',
  answer:
    'De minimis is the value below which an importing country waives duty, tax or formal entry on low-value goods. In the US, the $800 Section 321 exemption has been suspended for all countries since 29 August 2025. The UK charges no duty on most goods worth £135 or less, while VAT still applies.',
  keyFacts: [
    'Executive Order 14324 suspended duty-free de minimis treatment under 19 U.S.C. 1321(a)(2)(C) for all countries from 29 August 2025.',
    'CBP’s e-commerce FAQs, last modified 2 September 2026, say goods valued at $800 or less must use formal or informal entry procedures.',
    'CBP says the bona fide gift and traveller exemptions under 19 U.S.C. 1321(a)(2)(A) and (B) remain unchanged.',
    'GOV.UK says no customs duty is charged on non-excise goods worth £135 or less sent to Great Britain, but VAT applies.',
    'The European Commission introduced a temporary €3 customs duty per item on parcels worth up to €150 from 1 July 2026.',
  ],
  definitions: [
    {
      term: 'De minimis',
      meaning:
        'A value threshold below which an importing country waives duty, import tax or formal customs entry for low-value shipments.',
    },
    {
      term: 'Section 321',
      meaning:
        'The US provision, 19 U.S.C. 1321, whose paragraph (a)(2)(C) allowed duty-free entry for shipments valued at $800 or less until its suspension.',
    },
    {
      term: 'Informal entry',
      meaning:
        'A simplified US entry process that CBP says is generally allowed for shipments valued at $2,500 or less, subject to eligibility.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What does de minimis mean in customs?',
      paragraphs: [
        'It is a low-value threshold. Below it, an importing country may collect no duty, no import tax, or only a simplified declaration. Each country sets its own figure, and duty and tax thresholds can differ in the same country.',
        'Thresholds change, sometimes quickly. Treat any figure, including those below, as true only on the date the official page states it, and check the importing country’s customs authority before you price a shipment.',
      ],
    },
    {
      heading: 'Is the US $800 de minimis still available?',
      paragraphs: [
        'No, for duty-free treatment. Executive Order 14324, signed on 30 July 2025, says the duty-free de minimis exemption under 19 U.S.C. 1321(a)(2)(C) no longer applies to any shipment, on a global basis, from 12:01 a.m. eastern daylight time on 29 August 2025.',
        'CBP then made the change part of its rules. Its news release of 24 June 2026 says the new rules indefinitely suspend duty-free de minimis treatment for imports valued at $800 or less and require more detailed information on international mail shipments. CBP’s e-commerce FAQs, last modified 2 September 2026, say the suspension covers all modes including the international postal network, and that the new mail informal entry process takes effect on 24 July 2026.',
      ],
    },
    {
      heading: 'How do low-value shipments enter the US now?',
      paragraphs: [
        'Through formal or informal entry, with duty paid. CBP’s FAQs say formal or informal entry procedures must be used, and that informal entry is generally allowed for shipments valued at $2,500 or less, subject to eligibility.',
        'Two exemptions in the same section stay in place. CBP says the exemptions for bona fide gifts under 19 U.S.C. 1321(a)(2)(A) and for personal or household articles accompanying travellers under (a)(2)(B) remain unchanged. Neither covers goods you sell to a customer.',
      ],
    },
    {
      heading: 'What are the low-value rules in the UK and EU?',
      paragraphs: [
        'Both still tax small parcels, but in different ways. The table records what each official page stated when we checked it.',
      ],
      table: {
        caption: 'Low-value import rules on official pages, checked 8 October 2026',
        head: ['Market', 'Rule', 'Official source'],
        rows: [
          [
            'United States',
            'Duty-free de minimis for $800 or less suspended for all countries since 29 August 2025; formal or informal entry required',
            'Executive Order 14324; CBP e-commerce FAQs (2 September 2026)',
          ],
          [
            'Great Britain',
            'No customs duty on non-excise goods worth £135 or less; VAT on all goods except gifts worth £39 or less; duty on excise goods of any value',
            'GOV.UK, tax and customs for goods sent from abroad',
          ],
          [
            'European Union',
            'Import declaration for all goods and no VAT exemption below €22 since 1 July 2021; temporary €3 duty per item on parcels up to €150 from 1 July 2026',
            'European Commission (Taxation and Customs Union; news of 29 June 2026)',
          ],
        ],
      },
    },
    {
      heading: 'How is the EU €3 parcel duty counted?',
      paragraphs: [
        'Per item, by tariff classification. The European Commission’s announcement of 29 June 2026 says the duty applies per item based on tariff classification, not quantity. Its own example: five T-shirts attract one €3 duty, while three T-shirts and a watch attract €6.',
        'The Commission describes the duty as temporary and aimed at low-value parcels imported from outside the EU, mainly through e-commerce. The EU’s VAT rules for these parcels are separate; see the IOSS guide for how VAT is collected at the point of sale.',
      ],
    },
    {
      heading: 'What should the invoice show for a low-value shipment?',
      paragraphs: [
        'The same as any other shipment. A low threshold changes what is collected, not what you declare. The invoice or customs declaration still needs an accurate description, quantity, unit value, total value, currency and origin for each line.',
        'Never lower a value, split one order into several parcels or describe goods vaguely to stay under a threshold. That is an inaccurate declaration, and the importer carries the responsibility for it.',
      ],
      steps: [
        'Check the importing country’s current threshold on its customs authority’s own page and note the date.',
        'Describe each item specifically, with material and use.',
        'Enter the real transaction value per item and the invoice currency.',
        'Add the origin of each item and the terms of sale.',
        'Agree with the buyer who pays duty and tax on delivery, and estimate it before you ship.',
      ],
    },
  ],
  faq: [
    {
      q: 'Does the US de minimis suspension apply to postal shipments?',
      a: 'Yes. CBP’s e-commerce FAQs say the suspension covers merchandise valued at $800 or less arriving by all modes, including the international postal network.',
    },
    {
      q: 'Are gifts still duty-free in the US?',
      a: 'CBP says the bona fide gift exemption under 19 U.S.C. 1321(a)(2)(A) remains unchanged. A sale to a customer is not a gift, whatever the parcel label says.',
    },
    {
      q: 'Who pays VAT on a £100 parcel sent to Great Britain?',
      a: 'GOV.UK says that for goods worth £135 or less that are not excise goods, the seller includes VAT in the price the buyer pays. Gifts above £39 are a separate case.',
    },
    {
      q: 'Will these thresholds change again?',
      a: 'They may. The EU calls its €3 duty temporary, and the US suspension came by executive order and CBP rules. Check the official page on the day you ship.',
    },
  ],
  sources: [
    'd1-whitehouse-eo-14324',
    'd1-cbp-low-value-rules-2026',
    'd1-cbp-ecommerce-faqs',
    'd1-gov-uk-goods-sent-from-abroad',
    'd1-ec-low-value-consignments',
    'd1-ec-eur3-low-value-parcels',
  ],
  primaryTool: '/tools/landed-cost-calculator',
  tools: [
    '/tools/landed-cost-calculator',
    '/tools/invoice-generator',
    '/tools/proforma-invoice-generator',
  ],
  callout: {
    afterSection: 2,
    tool: '/tools/landed-cost-calculator',
    title: 'Price the duty into a small order',
    text: 'With the US exemption suspended, even a small parcel can carry duty. Estimate it in the landed cost calculator with your own rate before you quote the buyer.',
  },
  related: [
    '/blog/brokerage-fees-and-duties-on-courier-shipments',
    '/guides/ioss',
    '/blog/cn22-vs-cn23',
    '/blog/uk-import-duty',
    '/blog/declared-value-for-customs',
  ],
  cover: {
    id: 'FO987farCMI',
    src: 'https://images.unsplash.com/photo-1783309239698-140c85456317',
    width: 6000,
    height: 4000,
    alt: 'A hand cart stacked with many small parcels on a city street, the kind of low-value shipments de minimis rules cover',
    caption: 'A cart loaded with parcels on a city street',
    photographer: {
      name: 'Thilina Alagiyawanna',
      profile: 'https://unsplash.com/@thilinaalagiyawanna',
    },
    page: 'https://unsplash.com/photos/a-cart-loaded-with-many-packages-on-a-city-street-FO987farCMI',
  },
};

export default article;
