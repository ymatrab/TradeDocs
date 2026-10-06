import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-06';

/**
 * Demand (DataForSEO, 2026-10-06): UK "eori number" 14,800, KD 31; UK "what is an eori number" 1,900;
 * US "eori number" 4,400, KD 36; US "eori number uk" 70.
 * Plan: docs/research/content-plan-v2-2026-10-06.md, batch 1.
 */
const article: ContentArticle = {
  slug: 'eori-number',
  title: 'What is an EORI number, and do you need one?',
  metaTitle: 'EORI number: who needs one and how to get it',
  description:
    'What an EORI number is, who needs one to move goods into or out of the EU or the UK, how to apply, what the GB and XI numbers are, and where the number is used.',
  lede: 'Ship goods to a buyer in the EU or the UK and sooner or later someone asks for an EORI number. It is a customs registration number, and whether you need your own depends on where your business is established and what you do at the border.',
  answer:
    'An EORI number (Economic Operators Registration and Identification number) identifies a business to customs in the EU or the UK. It is needed for customs operations such as import and export declarations. A business established in the EU or UK gets one from its own customs authority; a business established elsewhere usually needs one only to lodge declarations itself.',
  keyFacts: [
    'The European Commission says an EORI number is mandatory for all customs operations in the EU customs territory, such as import, export and transit.',
    'An EU EORI number is a two-letter code of the issuing EU country followed by up to 15 alphanumeric characters.',
    'EU EORI numbers have no expiry date, according to the European Commission.',
    'HMRC usually issues a GB EORI number immediately, or within 5 working days if it needs to make checks.',
    'An XI EORI number, for moving goods to or from Northern Ireland, requires a GB EORI number first, according to GOV.UK.',
  ],
  definitions: [
    {
      term: 'EORI number',
      meaning: 'A customs identification number for an economic operator in the EU or the UK.',
    },
    {
      term: 'Economic operator',
      meaning: 'A business or person that takes part in customs activities, such as importing or exporting.',
    },
    {
      term: 'Established',
      meaning:
        'Having a registered office, central headquarters or permanent business establishment in the country concerned.',
    },
    {
      term: 'XI EORI number',
      meaning: 'The EORI number used for customs activity involving Northern Ireland.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is an EORI number?',
      paragraphs: [
        'It is the number customs uses to identify a business in the EU or the UK. The European Commission describes the EORI number as mandatory for the clearance of all types of customs operations in the EU customs territory, and says a person can hold only one valid EU EORI number at a time. Businesses must give this number to the customs authorities of EU countries for customs operations.',
        'The UK runs its own EORI system. GOV.UK says you may need a UK EORI number if you move goods between Great Britain or the Isle of Man and any other country, including the EU, between Great Britain and Northern Ireland, between Great Britain and the Channel Islands, or between Northern Ireland and countries outside the EU.',
      ],
    },
    {
      heading: 'Who needs an EORI number?',
      paragraphs: [
        'In the EU, any economic operator established in the EU customs territory, according to the European Commission. Operators not established there need one if they carry out certain customs activities themselves: lodging customs declarations, entry or exit summary declarations, or temporary storage declarations, or acting as a carrier.',
        'In the UK, GOV.UK says your business usually needs premises in the country you import to or export from, which it calls being established: a registered office, a central headquarters or a permanent business establishment. You also need an EORI number to register for a UK export licence. You do not need one for goods that are both not controlled and for personal use only.',
      ],
    },
    {
      heading: 'Does a US exporter need an EORI number?',
      paragraphs: [
        'Often not. Under rules such as FCA or DAP, the ICC’s Incoterms® 2020 rules put import clearance on the buyer, and the buyer, established in the EU or UK, declares the goods with its own EORI number. A US seller that only exports and leaves import clearance to the buyer is not the one lodging the import declaration.',
        'It changes when the US seller takes on import clearance itself, most obviously under DDP. A business not established in the EU needs an EORI number if it lodges customs declarations there, and the Commission says it gets one from the EU country where it intends to carry out its first customs operation. GOV.UK adds that a business that is not eligible to apply has to appoint someone to deal with customs for it, and that person gets the EORI number instead.',
      ],
    },
    {
      heading: 'How do you get an EORI number?',
      paragraphs: [
        'You apply to the customs authority that issues it. In the EU, that is the national customs authority of the country where the business is established; for a business with no EU establishment, it is the country of its first customs operation. In the UK, HMRC issues numbers through an online application on GOV.UK.',
      ],
      steps: [
        'Work out which number you need: an EU number from one member state, a GB number, or an XI number for Northern Ireland.',
        'For a GB number, gather your Unique Taxpayer Reference, business start date and SIC code, VAT number if registered, or National Insurance number as a sole trader.',
        'If your business is not based in the UK, note that GOV.UK says the UTR, SIC code and National Insurance number are not needed.',
        'Apply online; HMRC usually issues a GB number immediately, or within 5 working days if it makes checks.',
        'For an XI number, get the GB number first, then complete the XI registration form.',
        'Give the number to your customs broker and to the trading partner who will declare the goods.',
      ],
    },
    {
      heading: 'What does an EORI number look like?',
      paragraphs: [
        'An EU EORI number starts with the two-letter code of the EU country that issued it, followed by an identifier unique in that country of up to 15 alphanumeric characters, according to the European Commission. UK numbers start with GB, or XI for Northern Ireland.',
      ],
      table: {
        caption: 'EORI numbers compared',
        head: ['', 'EU EORI', 'GB EORI', 'XI EORI'],
        rows: [
          ['Issued by', 'Customs authority of one EU country', 'HMRC', 'HMRC'],
          ['Starts with', 'The issuing country’s two-letter code', 'GB', 'XI'],
          ['Used for', 'Customs operations in the EU', 'Customs activity involving Great Britain', 'Customs activity involving Northern Ireland'],
          ['Prerequisite', 'Established in the EU, or a first customs operation there', 'Usually established in the UK', 'A GB EORI number'],
        ],
      },
    },
    {
      heading: 'Where is the EORI number used?',
      paragraphs: [
        'On the customs declarations and the summary declarations that carry it, and with the broker who lodges them. The number identifies the declarant or the importer, so the broker asks for it before it can clear the goods.',
        'If your buyer or its broker asks for the EORI number on the commercial invoice, put it next to the buyer’s name and address, exactly as issued; ask before you ship rather than after the goods are held. To check an EU number you have been given, the European Commission runs an EORI validation service.',
      ],
    },
  ],
  faq: [
    {
      q: 'Does an EORI number expire?',
      a: 'EU EORI numbers have no expiry date, but they can be invalidated on request or when the business stops trading, according to the European Commission, which says the data is then kept for 10 years.',
    },
    {
      q: 'Is an EORI number the same as a VAT number?',
      a: 'No. They are separate registrations, although HMRC asks for your VAT number, if you have one, when you apply for a GB EORI number.',
    },
    {
      q: 'Can one EU EORI number be used in every EU country?',
      a: 'Yes. The Commission describes a common identification number across the EU, and a person can hold only one valid EU EORI number at a time.',
    },
    {
      q: 'Do I need an EORI number for a gift or personal parcel?',
      a: 'In the UK, GOV.UK says you do not need one for goods that are both not controlled and for personal use only. Check the destination’s rules for other cases.',
    },
  ],
  sources: ['w5-ec-eori', 'w5-gov-uk-eori', 'w5-gov-uk-eori-apply', 'icc-incoterms-2020'],
  primaryTool: '/tools/invoice-generator',
  tools: ['/tools/invoice-generator', '/tools/incoterms', '/tools/landed-cost-calculator'],
  callout: {
    afterSection: 2,
    tool: '/tools/incoterms',
    title: 'Who clears the goods depends on the rule',
    text: 'Look up which Incoterms® 2020 rule puts import clearance on the seller and which on the buyer, before you agree to clear goods in a country where you have no EORI number.',
  },
  related: [
    '/guides/dap-vs-ddp',
    '/guides/shipper-consignee-notify-party',
    '/blog/commercial-invoice-requirements',
    '/guides/landed-cost',
  ],
  cover: {
    id: 'UE_BCpFTuz0',
    src: 'https://images.unsplash.com/photo-1772959785247-e0904e476455',
    width: 4608,
    height: 3072,
    alt: 'Road border crossing with Austrian and European Union flags, where EU customs rules apply',
    caption: 'Border crossing with Austrian and EU flags',
    photographer: { name: 'viktor rejent', profile: 'https://unsplash.com/@viktor_rejent' },
    page: 'https://unsplash.com/photos/border-crossing-with-austrian-and-eu-flags-visible-UE_BCpFTuz0',
  },
};

export default article;
