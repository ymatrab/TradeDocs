/**
 * Document types that make a regulated claim.
 *
 * A certificate of origin states where goods were produced, which is what preferential
 * duty is decided on. Until the wording, the evidence it rests on and the disclaimer have
 * named legal and regulatory approval, it is not offered, and the server refuses it even
 * if a request names it directly (D-008, D-025).
 *
 * It is offered only when all of these hold (certificateOfOriginGate):
 *
 * - ENABLE_REGULATED_DOCUMENTS=true and REGULATED_DOCUMENTS_APPROVED=true, which the
 *   configuration schema already accepts only together, and only in service mode;
 * - a review record: LEGAL_COO_REVIEWED_BY (the named reviewer) and LEGAL_COO_REVIEWED_AT
 *   (YYYY-MM-DD, a real date not in the future).
 *
 * The review record is read outside the strict server schema on purpose, like the legal
 * identity: a missing or mistyped record fails this one feature closed and is reported by
 * /api/ready, it never fails the deployment.
 *
 * This is the single source for that claim: the action, the preview route, the panel and
 * every public page that lists document types read it from here. Pure and client-safe: it
 * never reads process.env; the server module passes the environment in.
 */
export const REGULATED_DOCUMENT_KINDS = ['certificate_of_origin'] as const;

export type RegulatedDocumentKind = (typeof REGULATED_DOCUMENT_KINDS)[number];

export function isRegulatedDocumentKind(kind: string): kind is RegulatedDocumentKind {
  return (REGULATED_DOCUMENT_KINDS as readonly string[]).includes(kind);
}

export const REGULATED_DOCUMENT_LIMITATION =
  'Certificates of origin are not available yet. Their wording is pending legal and regulatory review.';

/**
 * Shown beside the document types once the certificate of origin is offered. It is the
 * exporter's own preparation; TradeDocs never certifies or issues it.
 */
export const CERTIFICATE_OF_ORIGIN_NOTICE =
  'A certificate of origin is your own preparation as exporter. Where one must be certified, the issuing chamber of commerce or authority certifies it; TradeDocs does not certify or issue it.';

/** The review record variables, listed in .env.example and RUNBOOK.md. */
export const COO_REVIEW_ENV = {
  reviewedBy: 'LEGAL_COO_REVIEWED_BY',
  reviewedAt: 'LEGAL_COO_REVIEWED_AT',
} as const;

export type CooReview = { reviewedBy: string; reviewedAt: string };

export type CooGate =
  | { state: 'off' }
  | { state: 'on'; review: CooReview }
  /** Switched on without what it needs: refused, and reported by /api/ready. */
  | { state: 'misconfigured'; reason: string };

type Environment = Record<string, string | undefined>;

function reviewer(value: string | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed || trimmed.length < 2 || trimmed.length > 200) return null;
  // One line: it is a name, printed into the review evidence and nowhere else.
  return /[\r\n\u0000]/.test(trimmed) ? null : trimmed;
}

/** A real calendar date, not in the future. */
function reviewDate(value: string | undefined, now: Date): string | null {
  const trimmed = value?.trim();
  if (!trimmed || !/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
  const parsed = new Date(`${trimmed}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== trimmed) return null;
  return parsed.getTime() <= now.getTime() ? trimmed : null;
}

/** The recorded legal review of the certificate of origin, or null while there is none. */
export function readCooReview(input: Environment, now: Date = new Date()): CooReview | null {
  const reviewedBy = reviewer(input[COO_REVIEW_ENV.reviewedBy]);
  const reviewedAt = reviewDate(input[COO_REVIEW_ENV.reviewedAt], now);
  return reviewedBy && reviewedAt ? { reviewedBy, reviewedAt } : null;
}

/**
 * Whether the certificate of origin may be generated and claimed. Fails closed: anything
 * short of the flag, its approval, service mode and a valid review record answers no.
 */
export function certificateOfOriginGate(input: Environment, now: Date = new Date()): CooGate {
  if (input.ENABLE_REGULATED_DOCUMENTS?.trim() !== 'true') return { state: 'off' };
  if (input.REGULATED_DOCUMENTS_APPROVED?.trim() !== 'true') {
    return { state: 'misconfigured', reason: 'REGULATED_DOCUMENTS_APPROVED is not true.' };
  }
  if (input.APPLICATION_MODE?.trim() !== 'service') {
    return { state: 'misconfigured', reason: 'Regulated documents need service mode.' };
  }
  const review = readCooReview(input, now);
  if (!review) {
    return {
      state: 'misconfigured',
      reason: `${COO_REVIEW_ENV.reviewedBy} and ${COO_REVIEW_ENV.reviewedAt} (YYYY-MM-DD, not in the future) must record the legal review.`,
    };
  }
  return { state: 'on', review };
}

/**
 * Phrases public content may not use while the certificate of origin is not offered. The
 * content tests (posts, guides, glossary, countries) check every page against this list, so
 * no page can describe the document as available before its review is recorded; once it
 * is offered, the list is empty and pages may name it.
 */
export function gatedPublicPhrases(cooOffered: boolean): readonly RegExp[] {
  return cooOffered ? [] : [/certificate of origin/i];
}
