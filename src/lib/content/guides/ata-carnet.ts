import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "ata carnet" 1,900, KD 36; UK "ata carnet" 1,600,
 * "temporary admission" 140.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave C (v2 #30: temporary export for
 * samples and trade shows; when a carnet replaces duty).
 */
const article: ContentArticle = {
  slug: 'ata-carnet',
  title: 'ATA carnet: taking samples and equipment abroad without paying duty',
  metaTitle: 'ATA carnet: temporary export of samples and kit',
  description:
    'What an ATA carnet covers, who issues it in the US and UK, how the vouchers work at each border, and what happens if goods do not come back on time.',
  lede: 'Taking samples to a trade fair or a camera kit to a shoot abroad means crossing customs twice with goods you never intend to sell. An ATA carnet is the document built for that trip: one booklet, accepted at each border, standing in for the duty you would otherwise pay or deposit.',
  answer:
    'An ATA carnet is an international customs document that lets you temporarily import goods such as commercial samples, professional equipment and trade fair exhibits without paying duty or import taxes. The ICC says it is valid for up to one year and accepted in approximately 80 countries and customs territories, provided the goods leave again.',
  keyFacts: [
    'The ICC describes the ATA Carnet as an international customs document permitting duty-free and tax-free temporary import of goods for up to one year.',
    'The ATA guarantee chain is administered by the ICC World Chambers Federation under the ATA Convention and the Istanbul Convention on Temporary Admission.',
    'CBP lists three eligible categories: commercial samples, professional equipment, and goods for exhibitions and fairs.',
    'CBP says the US guaranteeing association is the United States Council for International Business (USCIB), which appoints the issuers.',
    'GOV.UK says UK carnets are applied for through a listed Chamber of Commerce, which sets the fee and the security required.',
  ],
  definitions: [
    {
      term: 'Temporary admission',
      meaning:
        'A customs procedure in which goods enter a country relieved of duty on condition that they are re-exported within a set time, as the WCO describes it.',
    },
    {
      term: 'National guaranteeing association (NGA)',
      meaning:
        'The body in each country, usually a chamber of commerce, that guarantees to its customs authority the duties and taxes due if carnet goods are not re-exported.',
    },
    {
      term: 'Voucher and counterfoil',
      meaning:
        'Each carnet sheet has a voucher that customs tears out and keeps, and a counterfoil that stays in the booklet as the holder’s record of the stamp.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is an ATA carnet?',
      paragraphs: [
        'A customs document that works like a passport for goods. GOV.UK uses that comparison, and the ICC says one carnet can cover several destinations and trips during that year.',
        'It replaces the security a customs office would otherwise ask for at the border. The ICC says the carnet serves as a guarantee for customs duties and taxes, so you do not lodge a separate deposit in each country. Behind it sits a chain of national guaranteeing associations, one per country. If goods are not re-exported, CBP says the guaranteeing association pays the duties and taxes and then recovers the amount from the holder.',
        'The ICC names the legal basis as two conventions: the Customs Convention on ATA Carnets for the temporary admission of goods, and the Convention on Temporary Admission signed in Istanbul on 26 June 1990, whose main tools the WCO names as the ATA carnet for goods and the CPD carnet for vehicles.',
      ],
    },
    {
      heading: 'Which goods can travel on an ATA carnet?',
      paragraphs: [
        'Goods you take out and bring back unchanged. CBP lists three categories: commercial samples, professional equipment, and goods for exhibitions and fairs.',
        'Some goods are excluded. CBP names items for personal use, consumables such as giveaways, agricultural products and disposables. Goods meant for sale, or sale on approval, need a regular customs entry instead. GOV.UK adds that you cannot process or repair carnet goods abroad apart from routine maintenance, and that vehicles need a CPD carnet.',
        'A carnet does not lift other controls. CBP notes that an import or export licence may still be required, and GOV.UK says restricted or prohibited goods stay subject to export rules. CBP also advises checking the destination country’s own rules before you travel.',
      ],
    },
    {
      heading: 'Who issues an ATA carnet in the US and the UK?',
      paragraphs: [
        'A designated business body, never customs itself. In the US, CBP says the United States Council for International Business (USCIB) is the guaranteeing association and has appointed Roanoke Trade and boomerang carnets to issue carnets on its behalf. In the UK, GOV.UK says you apply through one of the Chambers of Commerce it lists.',
        'The issuer sets the price and the security. GOV.UK says the issuing office tells you how much to pay and the guarantee or security you need to give. No official page we checked on 8 October 2026 states either amount, so ask the issuer for a quote.',
      ],
    },
    {
      heading: 'How do you prepare and use a carnet?',
      paragraphs: [
        'Build the goods list first, then present the carnet every time the goods cross a border. The steps follow CBP and GOV.UK guidance; your issuer’s instructions come first.',
      ],
      steps: [
        'List every item with a plain description, quantity and true commercial value, adding serial numbers where equipment has them.',
        'Check that each destination and transit country accepts carnets for your goods and purpose.',
        'Apply to the issuer (USCIB’s providers in the US, a listed Chamber of Commerce in the UK) and provide the security it asks for.',
        'At departure, present the goods and the carnet to customs; for a paper carnet, customs stamps the counterfoil and keeps the yellow export voucher.',
        'At each foreign border, customs keeps a white voucher on entry and another on re-exit, and a blue voucher where the carnet is used for transit.',
        'On return, present the goods again so the re-import voucher is completed, then follow the issuer’s instructions for closing the carnet.',
      ],
    },
    {
      heading: 'What do the coloured sheets in a carnet do?',
      paragraphs: [
        'Each colour records one kind of crossing. Each sheet has a counterfoil that stays in the booklet and a voucher customs removes.',
      ],
      table: {
        caption: 'ATA carnet sheets as described by CBP and GOV.UK',
        head: ['Sheet', 'Used for', 'Note'],
        rows: [
          [
            'Green cover',
            'Holder, guaranteeing association, issue date, countries and the goods list',
            'Stamped by the issuing office before first use',
          ],
          [
            'Yellow',
            'Export from and re-import into the home country',
            'Not used on US-issued carnets, according to CBP',
          ],
          [
            'White',
            'Temporary import into and re-export from a foreign country',
            'Customs keeps the import and re-export vouchers',
          ],
          ['Blue', 'Transit through a country', 'Customs keeps the blue voucher'],
        ],
      },
    },
    {
      heading: 'What happens if the goods do not come back in time?',
      paragraphs: [
        'You pay, through the guarantee chain. CBP says failing to present the goods and carnet at export, import and re-export may lead to charges of 110% of the duty and import tax, which the guaranteeing association pays and recovers from the holder.',
        'Act before the carnet expires. GOV.UK says that if goods will stay abroad, you contact the customs authority in that country as soon as you know. CBP says a replacement carnet can extend the period in some countries if requested before the original expires, at the foreign customs administration’s discretion. Invented example: Northvale Audio (an invented company) agrees at a fair in Lyon to sell its demonstration speaker. It contacts French customs before handing the speaker over, rather than leaving it on the carnet.',
      ],
    },
    {
      heading: 'When is a carnet not the right document?',
      paragraphs: [
        'When the goods are sold, consumed, processed or shipped once without a planned return. CBP says goods for sale need a regular customs entry, which travels with a commercial invoice.',
        'There are other temporary routes. CBP notes that a US temporary importation under bond needs CBP Form 3461 or 7501 and a surety bond, while a carnet needs no other entry forms. Paper is also changing: the WCO reports that the EU, Norway, Switzerland and the UK moved to digital carnets on 1 June 2026, with all customs administrations expected to follow by the end of 2027.',
      ],
    },
  ],
  faq: [
    {
      q: 'How long is an ATA carnet valid?',
      a: 'Up to one year from issue, according to the ICC and CBP. CBP says a replacement carnet may extend the period in some countries if requested before the original expires; ask the issuer early.',
    },
    {
      q: 'Can I sell goods that entered on an ATA carnet?',
      a: 'Not under the carnet. CBP says goods for sale must be entered as a regular customs entry. Abroad, contact that country’s customs authority as soon as you know goods will stay, as GOV.UK advises.',
    },
    {
      q: 'Do I still need a commercial invoice with a carnet?',
      a: 'Not for the carnet crossings themselves; CBP says the carnet needs no other entry forms. Carriers and buyers may still ask for an invoice or packing list, and any goods sold need one.',
    },
    {
      q: 'Is the security the same as the carnet fee?',
      a: 'No. GOV.UK separates the amount you pay the issuing office from the guarantee or security you give. Both are set by the issuer; no official page we checked states the amounts.',
    },
    {
      q: 'Can I use an ATA carnet for a vehicle?',
      a: 'Generally no. GOV.UK points vehicle owners to the CPD carnet, which the WCO names as the Istanbul Convention’s tool for vehicles.',
    },
  ],
  sources: [
    'c8-icc-ata-carnet-solution',
    'c8-icc-wcf-ata-carnet',
    'c8-wco-istanbul-convention',
    'c8-wco-eata-rollout',
    'c8-cbp-ata-carnet-faqs',
    'c8-gov-uk-apply-ata-carnet',
    'c8-gov-uk-use-ata-carnet',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: [
    '/tools/invoice-generator',
    '/tools/packing-list-generator',
    '/tools/proforma-invoice-generator',
  ],
  callout: {
    afterSection: 3,
    tool: '/tools/packing-list-generator',
    title: 'Start the goods list from a packing list',
    text: 'The carnet’s goods list lists your goods item by item. Build descriptions and quantities once in the packing list generator, then copy them into the issuer’s application.',
  },
  related: [
    '/blog/commercial-invoice-for-samples',
    '/guides/how-to-export-from-the-uk',
    '/guides/how-to-export-from-the-us',
    '/guides/transit-declarations-t1-ncts',
    '/blog/uk-export-declaration',
  ],
  cover: {
    id: '5WQJ_ejZ7y8',
    src: 'https://images.unsplash.com/photo-1606964212858-c215029db704',
    width: 4025,
    height: 2684,
    alt: 'Stacked red and blue cargo containers, the kind of freight that crosses borders under customs control',
    caption: 'Red and blue cargo containers stacked in a yard',
    photographer: { name: 'Barrett Ward', profile: 'https://unsplash.com/@barrettward' },
    page: 'https://unsplash.com/photos/red-and-blue-cargo-containers-5WQJ_ejZ7y8',
  },
};

export default article;
