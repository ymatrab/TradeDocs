import type { SourceFields } from '@/lib/trade/sources';

const RETRIEVED = '2026-10-08';
const PENDING = 'pending owner review';

/**
 * Sources first cited by the wave D comparison batch: cif-vs-dap, exw-vs-dap, cfr-vs-cif and
 * cif-vs-ddp. Each URL was opened and the claim checked on the retrieval date.
 */
export default {
  'd2-cfr-19-141-18': {
    authority: 'Legal Information Institute, Cornell Law School (Code of Federal Regulations)',
    title: '19 CFR § 141.18: Entry by nonresident corporation',
    url: 'https://www.law.cornell.edu/cfr/text/19/141.18',
    jurisdiction: 'United States (imports)',
    supports:
      'a corporation not incorporated in the US customs territory entering goods for consumption only if it has a resident agent authorised to accept service in the state of the port of entry and files a bond with a resident corporate surety',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd2-cbp-importer-exporter-tips': {
    authority: 'U.S. Customs and Border Protection (CBP)',
    title: 'Importer/Exporter Tips',
    url: 'https://www.cbp.gov/trade/basic-import-export/importer-exporter-tips',
    jurisdiction: 'United States (imports)',
    supports:
      'the importer of record being ultimately responsible for the correctness of the entry documentation, even when a customs broker is used',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'd2-gov-uk-eori': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Get an EORI number',
    url: 'https://www.gov.uk/eori',
    jurisdiction: 'United Kingdom (customs)',
    supports:
      'an EORI number being needed to move goods between Great Britain and other countries, businesses not established in the UK usually being unable to apply themselves, and appointing someone to deal with customs on their behalf',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
