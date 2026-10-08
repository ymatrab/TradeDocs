import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google UK, 2026-10-06): "export licence" 320, KD 5.
 * Plan: docs/research/content-plan-v3-2026-10-07.md (v2 #59), wave D. Angle: when a UK exporter
 * needs a licence, pointing to the official checker; no classification of any product.
 * Every rule is from a GOV.UK ECJU page opened 2026-10-08 and listed in `sources`; ECJU’s
 * percentage targets are left out on purpose. Example parties are invented.
 */
const article: ContentArticle = {
  slug: 'uk-export-licence',
  title: 'UK export licence: when you need one and how to apply',
  metaTitle: 'UK export licence: when you need one',
  description:
    'Which UK exports need a licence from the Export Control Joint Unit, how end-use controls work, OGEL vs SIEL vs OIEL, and how to check and apply through SPIRE and LITE.',
  lede: 'Most goods leave the UK without any export licence. A minority, mainly military items and dual-use goods with civil and military uses, need one from the Export Control Joint Unit before they go, and some unlisted goods are caught by what they will be used for. This post explains how to tell which side of the line you are on, and where to check.',
  answer:
    'A UK export licence is permission from the Export Control Joint Unit (ECJU) to export controlled items: military goods and dual-use items on the UK consolidated list, plus unlisted items with end-use concerns. GOV.UK says exporting controlled items without the correct licence is a criminal offence. Goods off the list, with no end-use concern, need no strategic licence.',
  keyFacts: [
    'GOV.UK says military items and dual-use items on the consolidated list of strategic military and dual-use items need an ECJU export licence.',
    'GOV.UK says it is a criminal offence to export controlled items without the correct licence.',
    'An ECJU licence can be needed for an unlisted item if you have, or have been told of, concerns about its end-use or end-user.',
    'Open general export licences (OGELs) must be registered on SPIRE before use; GOV.UK says the SPIRE reference goes on the shipping documents.',
    'GOV.UK says most standard individual export licence (SIEL) applications go through its online “Apply for a SIEL” service, with some cases still on SPIRE.',
  ],
  definitions: [
    {
      term: 'Export Control Joint Unit (ECJU)',
      meaning:
        'The unit in the Department for Business and Trade that administers the UK’s strategic export controls and issues export licences.',
    },
    {
      term: 'Dual-use item',
      meaning:
        'Goods, software or technology that can be used for both civilian and military purposes, controlled when listed or caught by end-use rules.',
    },
    {
      term: 'SPIRE',
      meaning:
        'ECJU’s online export licensing system, used to register for open licences and for applications not yet on the newer GOV.UK service.',
    },
    {
      term: 'End-user and stockist undertaking (EUSU)',
      meaning:
        'A signed form from the consignee or end-user describing how the items will be used, sent with a SIEL application.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is a UK export licence?',
      paragraphs: [
        'Formal permission from the government to send controlled goods, software or technology out of the UK. For strategic goods it comes from the Export Control Joint Unit (ECJU), part of the Department for Business and Trade, under the Export Control Act 2002 and the Export Control Order 2008, which GOV.UK names as the legal basis.',
        'The controls reach further than physical exports. GOV.UK says they apply to anyone exporting or transferring goods, software or technology, or providing brokering services, so emailing controlled technical data abroad can need a licence as much as shipping a crate.',
      ],
    },
    {
      heading: 'Which goods need an export licence from the UK?',
      paragraphs: [
        'Goods on the consolidated list of strategic military and dual-use items, and a set of other regulated categories handled by different bodies. GOV.UK groups the strategic list into military goods, software and technology specially designed or modified for military use, and dual-use items that can serve civilian or military purposes.',
        'Separate licences or certificates can apply to other goods. GOV.UK’s export step-by-step lists animals and animal products, plants and plant products, drugs and medicines, medical devices, chemicals, radioactive substances, diamonds, works of art and antiques, waste, firearms, and goods that could be used for torture or capital punishment. These are not ECJU strategic licences, and the body that issues each one is named on its GOV.UK page.',
        'Your buyer may need paperwork too. GOV.UK notes that the receiving party may need licences or certificates to receive goods from the UK, so check the importing country’s rules as well as your own.',
      ],
    },
    {
      heading: 'Can goods that are not on a control list need a licence?',
      paragraphs: [
        'Yes, because of end-use controls, often called catch-all controls. GOV.UK says an ECJU licence is needed if you have, or have been told of, concerns about the end-use or end-user, even for an item that is not listed.',
        'GOV.UK describes two main cases: military end-use controls, where an item risks military use in a country under an arms embargo, and controls on weapons of mass destruction, where an item risks diversion to such weapons or their delivery systems. The same page covers technical assistance, such as training or technical data, under the WMD controls.',
        'Sanctions sit alongside this. GOV.UK says a sanctions licence is needed for goods prohibited under sanctions legislation, and some sanctioned-destination applications are processed by the Office of Trade Sanctions Implementation (OTSI) rather than ECJU.',
      ],
    },
    {
      heading: 'Which type of export licence do you need?',
      paragraphs: [
        'It depends on how often you ship, to whom and how sensitive the goods are. ECJU offers three main kinds, each described on its own GOV.UK page.',
      ],
      table: {
        caption: 'Main ECJU export licence types (GOV.UK, retrieved 8 October 2026)',
        head: ['Licence', 'What it covers', 'How you get it', 'Usual validity'],
        rows: [
          [
            'Open general export licence (OGEL)',
            'Pre-published licence for listed items to listed destinations, on its stated conditions',
            'Read the terms, then register on SPIRE',
            'Set by the OGEL’s own terms and conditions',
          ],
          [
            'Standard individual export licence (SIEL)',
            'A stated quantity of specified items to a named consignee or end-user',
            'GOV.UK “Apply for a SIEL” service in most cases; some on SPIRE',
            'Generally two years for permanent exports, one year for temporary',
          ],
          [
            'Open individual export licence (OIEL)',
            'Several consignments of specific items to named destinations for one exporter',
            'Apply on SPIRE, showing business need',
            'Usually three to five years',
          ],
        ],
      },
    },
    {
      heading: 'How do you check whether you need a licence and apply?',
      paragraphs: [
        'Start with the item, then the destination and the end-user. The steps follow GOV.UK’s ECJU guidance; nothing here classifies your goods, and only the control list and ECJU can answer that.',
      ],
      steps: [
        'Write down exactly what you are exporting, with its technical specification, and who will use it and for what.',
        'Search the consolidated list with the OGEL and goods checker tools that ECJU provides on SPIRE.',
        'If you cannot tell whether an item is listed, ask ECJU through the control list classification service on SPIRE.',
        'Check end-use and sanctions: any concern about the end-user, an arms-embargoed destination or a sanctions restriction changes the answer.',
        'If an OGEL covers the item and destination, read its conditions and register on SPIRE before the first export.',
        'Otherwise apply for a SIEL through the GOV.UK service, attaching the technical specification and a signed end-user and stockist undertaking.',
        'Quote the licence reference on the shipping documents and keep the records the licence requires.',
      ],
    },
    {
      heading: 'How long does an export licence take?',
      paragraphs: [
        'Plan in weeks, not days. The SIEL page publishes ECJU targets of 20 and 60 working days for deciding applications; the clock starts on submission, pauses while ECJU waits for information from you, and restarts if you amend the application. GOV.UK says sanctioned or embargoed destinations typically take longer.',
        'An OIEL takes longer: GOV.UK says ECJU aims to decide within three to six months. An OGEL is quickest once it fits, because after registration you can usually start exporting under it straight away. Invented example: Fenmoor Instruments (an invented company) is unsure whether a sensor it sells is listed. It asks the classification service before quoting a delivery date, rather than promising the buyer a ship date it cannot keep.',
      ],
    },
    {
      heading: 'Is Northern Ireland treated differently?',
      paragraphs: [
        'For dual-use items, yes. Under the Windsor Framework, GOV.UK says EU export control rules still apply in Northern Ireland under Regulation (EU) 2021/821. A licence is needed to export controlled dual-use items from Northern Ireland to countries outside the EU, but not to move them from Northern Ireland to the EU or to Great Britain.',
        'UK sanctions apply across the whole UK, and GOV.UK adds that EU sanctions also apply in Northern Ireland. Businesses moving goods to or from Northern Ireland may also need an EORI number starting with XI.',
      ],
    },
    {
      heading: 'What happens if you export without a licence?',
      paragraphs: [
        'You commit an offence. GOV.UK lists the possible outcomes as licence revocation, seizure of the items, a compound penalty fine, or criminal conviction with a fine, a custodial sentence or both, and says licensing irregularities can be voluntarily disclosed to HMRC.',
        'Open licences carry their own duties. GOV.UK says OGEL holders must keep records, submit annual returns through SPIRE and expect compliance visits, and ignoring a compliance warning letter may lead to the licence being revoked.',
      ],
    },
  ],
  faq: [
    {
      q: 'Do I need an export licence to sell ordinary goods abroad from the UK?',
      a: 'Usually not a strategic licence. GOV.UK says ECJU licences are for items on the consolidated list or with end-use concerns. Food, plants, animals, chemicals and some other goods have their own certificates or licences.',
    },
    {
      q: 'What is the difference between SPIRE and LITE?',
      a: 'SPIRE is ECJU’s long-standing licensing system, still used for open licence registrations and some applications. LITE is the newer GOV.UK service ECJU launched for applying for a SIEL.',
    },
    {
      q: 'Does a UK export licence replace the export declaration?',
      a: 'No. The licence permits the export; the export declaration still reports it to HMRC. Where you export under an OGEL, GOV.UK says its SPIRE reference goes on the shipping documents.',
    },
    {
      q: 'Who can tell me whether my product is controlled?',
      a: 'ECJU, through its control list classification service on SPIRE. The OGEL and goods checker tools help you search the list yourself, but neither a forwarder nor this article can classify your product for you.',
    },
    {
      q: 'Do I need a licence to send controlled technology by email?',
      a: 'It can. GOV.UK says the controls apply to transfers of software and technology as well as physical goods. Check the control list and end-use rules before sending technical data abroad.',
    },
  ],
  sources: [
    'd4-gov-uk-strategic-export-controls',
    'd4-gov-uk-dual-use-controls',
    'd4-gov-uk-siel',
    'd4-gov-uk-lite-notice',
    'd4-gov-uk-ogels',
    'd4-gov-uk-oiel',
    'd4-gov-uk-export-goods-licences',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: [
    '/tools/invoice-generator',
    '/tools/proforma-invoice-generator',
    '/tools/packing-list-generator',
  ],
  callout: {
    afterSection: 3,
    tool: '/tools/proforma-invoice-generator',
    title: 'Quote the buyer before the licence comes through',
    text: 'A proforma invoice sets out the goods, quantities and consignee your licence application describes. Build it in the proforma invoice generator and keep the two consistent.',
  },
  related: [
    '/guides/how-to-export-from-the-uk',
    '/blog/uk-export-declaration',
    '/guides/eccn-ear99-export-licence',
    '/blog/export-compliance-checklist',
    '/guides/eori-number',
    '/guides/uk-commodity-codes',
  ],
  cover: {
    id: 'ZETiGp0f7hk',
    src: 'https://images.unsplash.com/photo-1705164686320-cf877bf7f338',
    width: 6000,
    height: 4000,
    alt: 'Two shipping crates against a wall, the kind of packed goods an export licence check applies to',
    caption: 'Two crates waiting against a wall',
    photographer: { name: 'Daiki Sato', profile: 'https://unsplash.com/@sur33' },
    page: 'https://unsplash.com/photos/a-couple-of-crates-sitting-next-to-a-wall-ZETiGp0f7hk',
  },
};

export default article;
