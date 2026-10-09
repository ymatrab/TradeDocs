/**
 * The certificate of origin's printed wording and what a shipment needs before one is
 * generated (D-008, D-025).
 *
 * This wording is what the legal review records (LEGAL_COO_REVIEWED_BY/AT, RUNBOOK.md
 * "Certificate of origin"). It is versioned rather than edited: every certificate records
 * the version it printed (snapshot `certificate.wording_version`, set by
 * 20261009000200_certificate_of_origin.sql), so changing the text means adding a version,
 * bumping CURRENT_COO_WORDING and the migration's constant together, and a new review.
 *
 * The certificate is the exporter's own preparation. It never says, or implies, that
 * TradeDocs certifies or issues it; where certification is required, the issuing chamber of
 * commerce or authority does that on its own form or by its own stamp.
 *
 * Pure: imported by the renderer, the server action and the tests.
 */

export type CooWording = {
  /** Under the title on every page. */
  preparationLabel: string;
  declarationCaption: string;
  declaration: string;
  /** The box left empty for the issuing body. */
  certificationCaption: string;
  certificationNote: string;
  /** The full statement, printed under the declaration. */
  preparationCaption: string;
  preparationStatement: string;
  signatureCaption: string;
};

const WORDING_1: CooWording = {
  preparationLabel:
    'Exporter’s preparation · to be certified by the issuing chamber or authority where required',
  declarationCaption: 'DECLARATION BY THE EXPORTER',
  declaration:
    'The undersigned, as exporter, declares that the details above are correct, and that the goods described originate in the country of origin stated for each line.',
  certificationCaption: 'CERTIFICATION BY THE ISSUING BODY, WHERE REQUIRED',
  certificationNote:
    'Left blank for the chamber of commerce or competent authority that certifies this document. Not completed by TradeDocs.',
  preparationCaption: 'PREPARED BY THE EXPORTER, NOT CERTIFIED BY TRADEDOCS',
  preparationStatement:
    'This certificate of origin was prepared by the exporter with TradeDocs from the exporter’s own data. It is not certified or issued by TradeDocs. Where a certified certificate of origin is required, it must be certified by the issuing chamber of commerce or competent authority.',
  signatureCaption: 'Signature of the exporter, place and date',
};

export const COO_WORDING: Readonly<Record<number, CooWording>> = { 1: WORDING_1 };

/** The wording new certificates print. Must match the migration's `wording_version`. */
export const CURRENT_COO_WORDING = 1;

/** The wording a stored certificate printed; certificates without a version printed 1. */
export function cooWording(version: number | null | undefined): CooWording {
  return COO_WORDING[version ?? 1] ?? WORDING_1;
}

export type CooReadiness = {
  exporter: boolean;
  consignee: boolean;
  /** Each line's own origin country, as stored (ISO alpha-2 or null). */
  lineOrigins: readonly (string | null)[];
  signatoryName: string | null;
};

/**
 * What a shipment lacks before it can carry a certificate of origin, as sentences the
 * workspace shows. A certificate states origin line by line, so every line needs its own
 * origin country; the shipment-level field is not copied onto lines that leave it out.
 */
export function certificateOfOriginGaps(input: CooReadiness): string[] {
  const gaps: string[] = [];
  if (!input.exporter) gaps.push('Choose the exporter.');
  if (!input.consignee) gaps.push('Choose the consignee.');
  if (input.lineOrigins.length === 0) gaps.push('Add at least one line.');
  const missing = input.lineOrigins.filter((origin) => !origin).length;
  if (missing > 0) {
    gaps.push(
      missing === 1
        ? 'Enter the country of origin on 1 line.'
        : `Enter the country of origin on ${missing} lines.`,
    );
  }
  if (!input.signatoryName?.trim()) {
    gaps.push(
      'Add the signatory’s name in the document settings; the exporter signs the declaration.',
    );
  }
  return gaps;
}
