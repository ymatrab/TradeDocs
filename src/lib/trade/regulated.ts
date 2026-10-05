/**
 * Document types that make a regulated claim.
 *
 * A certificate of origin states where goods were produced, which is what preferential
 * duty is decided on. Until the wording, the evidence it rests on and the disclaimer have
 * named legal and regulatory approval, it is not offered, and the server refuses it even
 * if a request names it directly. The flag is ENABLE_REGULATED_DOCUMENTS, which the
 * configuration schema only accepts together with REGULATED_DOCUMENTS_APPROVED.
 *
 * This is the single source for that claim: the action, the panel and any page that lists
 * document types read it from here.
 */
export const REGULATED_DOCUMENT_KINDS = ['certificate_of_origin'] as const;

export type RegulatedDocumentKind = (typeof REGULATED_DOCUMENT_KINDS)[number];

export function isRegulatedDocumentKind(kind: string): kind is RegulatedDocumentKind {
  return (REGULATED_DOCUMENT_KINDS as readonly string[]).includes(kind);
}

export const REGULATED_DOCUMENT_LIMITATION =
  'Certificates of origin are not available yet. Their wording is pending legal and regulatory review.';
