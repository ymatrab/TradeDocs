import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources first cited by the wave C guide ata-carnet. Each URL was opened on 2026-10-08 and the
 * cited sentence checked. No fee or security amount is cited: none of these pages states one.
 */
export default {
  'c8-icc-ata-carnet-solution': {
    authority: 'International Chamber of Commerce (ICC)',
    title: 'ATA Carnet',
    url: 'https://iccwbo.org/business-solutions/ata-carnet/ata-carnet-solution/',
    jurisdiction: 'International (temporary admission)',
    supports:
      'the ATA Carnet as an international customs document for duty-free and tax-free temporary import for up to one year, multiple trips during its validity, goods for trade fairs, commercial samples and professional equipment, acceptance in approximately 80 countries and customs territories, the carnet serving as a guarantee in place of deposits at each border, and applying through the national guaranteeing association',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'c8-icc-wcf-ata-carnet': {
    authority: 'ICC World Chambers Federation (WCF)',
    title: 'ATA Carnet (World Chambers Federation chamber services)',
    url: 'https://iccwbo.org/world-chambers-federation/chamber-services/ata-carnet/',
    jurisdiction: 'International (temporary admission)',
    supports:
      'the ATA Chain as a guaranteeing mechanism administered by the WCF under the ATA Convention and the Convention on Temporary Admission, one national guaranteeing association per country that guarantees duties and taxes to its customs authority, NGAs usually being chambers of commerce, and carnets being recorded in the ICC ATA Carnet System',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'c8-wco-eata-rollout': {
    authority: 'World Customs Organization (WCO)',
    title: 'Global trade takes a digital leap with eATA rollout in 30 countries (news, June 2026)',
    url: 'https://www.wcoomd.org/en/media/newsroom/2026/june/global-trade-takes-a-digital-leap-with-eata-rollout-in-30-countries.aspx',
    jurisdiction: 'International (ATA and Istanbul Conventions)',
    supports:
      'the European Union, Norway, Switzerland and the United Kingdom implementing digital ATA Carnets on 1 June 2026, ICC developing the eATA Carnet platform, and all customs administrations expected to move to digital carnets by the end of 2027',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'c8-wco-istanbul-convention': {
    authority: 'World Customs Organization (WCO) Academy',
    title: 'The Istanbul Convention',
    url: 'https://academy.wcoomd.org/courses/the-istanbul-convention/',
    jurisdiction: 'International (temporary admission)',
    supports:
      'the Convention on Temporary Admission signed in Istanbul on 26 June 1990 bringing together earlier temporary admission instruments, its main tools being the ATA carnet for goods and the CPD carnet for vehicles, and temporary admission meaning relief from duty on condition that goods are re-exported within a set time',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'c8-cbp-ata-carnet-faqs': {
    authority: 'U.S. Customs and Border Protection (CBP)',
    title: 'ATA Carnet Frequently Asked Questions',
    url: 'https://www.cbp.gov/trade/programs-administration/entry-summary/ata-carnet-faqs',
    jurisdiction: 'United States (temporary import and export)',
    supports:
      'USCIB as the US guaranteeing association and its appointed issuers, one-year validity and replacement carnets, eligible goods (commercial samples, professional equipment, exhibitions and fairs) and excluded goods (personal use, consumables, agricultural products, disposables, goods for sale), presenting goods and carnet at export, import and re-export, the possible 110% charge, the colour-coded sheets with counterfoils and vouchers, licences that may still be required, and the temporary importation bond alternative with Form 3461 or 7501 and a surety bond',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'c8-gov-uk-apply-ata-carnet': {
    authority: 'HM Revenue & Customs (GOV.UK)',
    title: 'Applying for an ATA Carnet',
    url: 'https://www.gov.uk/guidance/apply-for-an-ata-carnet',
    jurisdiction: 'United Kingdom (temporary export)',
    supports:
      'the carnet working like a passport for goods that will return to the UK, no processing or repair abroad except routine maintenance, the CPD carnet for vehicles, applying through a listed Chamber of Commerce, and the issuing office stating the fee and the guarantee or security required',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'c8-gov-uk-use-ata-carnet': {
    authority: 'HM Revenue & Customs (GOV.UK)',
    title: 'How to use your ATA Carnet',
    url: 'https://www.gov.uk/guidance/how-to-use-your-ata-carnet',
    jurisdiction: 'United Kingdom (temporary export)',
    supports:
      'showing the carnet to customs at export, customs keeping the yellow export voucher, the white import and re-export vouchers and the blue transit voucher, completing box F on the yellow re-import voucher, contacting the customs authority where goods will stay, and the guidance on digital carnets added on 1 June 2026',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
} satisfies Record<string, SourceFields>;
