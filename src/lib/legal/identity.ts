import { z } from 'zod';

/**
 * The business behind the legal pages, and whether the owner has approved their text (D-009).
 *
 * Pure: it reads the variables it is handed, never process.env, so the pages and the unit
 * tests ask the same question of the same function. The variables live outside the strict
 * server schema on purpose: a mistyped value here must leave the legal pages in draft, not
 * fail every request on the deployment.
 */

export const TO_BE_PROVIDED = 'to be provided';

export type LegalIdentity = {
  entityName: string | null;
  country: string | null;
  address: string | null;
  contactEmail: string | null;
  governingLaw: string | null;
  dataRegion: string | null;
  /** YYYY-MM-DD, or null while the text is a draft. */
  approvedAt: string | null;
};

const emailSchema = z.email().max(254);

function text(value: string | undefined, max: number): string | null {
  const trimmed = value?.trim();
  if (!trimmed || trimmed.length > max) return null;
  // One line each: these are printed into page text and an email header.
  return /[\r\n\u0000]/.test(trimmed) ? null : trimmed;
}

function email(value: string | undefined): string | null {
  const trimmed = value?.trim().toLowerCase();
  if (!trimmed) return null;
  return emailSchema.safeParse(trimmed).success ? trimmed : null;
}

/** A real calendar date, not in the future. Anything else leaves the pages in draft. */
function approvalDate(value: string | undefined, now: Date): string | null {
  const trimmed = value?.trim();
  if (!trimmed || !/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
  const parsed = new Date(`${trimmed}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== trimmed) return null;
  return parsed.getTime() <= now.getTime() ? trimmed : null;
}

export function readLegalIdentity(
  input: Record<string, string | undefined>,
  now: Date = new Date(),
): LegalIdentity {
  return {
    entityName: text(input.LEGAL_ENTITY_NAME, 200),
    country: text(input.LEGAL_ENTITY_COUNTRY, 100),
    address: text(input.LEGAL_ENTITY_ADDRESS, 300),
    contactEmail: email(input.LEGAL_CONTACT_EMAIL),
    governingLaw: text(input.LEGAL_GOVERNING_LAW, 200),
    dataRegion: text(input.LEGAL_DATA_REGION, 100),
    approvedAt: approvalDate(input.LEGAL_APPROVED_AT, now),
  };
}

/**
 * Approved only when the owner has dated the approval and the identity the pages name is
 * complete. A date beside "to be provided" would publish an incomplete policy as final, so
 * this fails closed: anything missing keeps the draft banner, noindex and sitemap exclusion.
 */
export function isLegalApproved(identity: LegalIdentity): boolean {
  return Boolean(
    identity.approvedAt && identity.entityName && identity.country && identity.contactEmail,
  );
}

/** The value to print, or the visible placeholder. Never a made-up default. */
export function shown(value: string | null): string {
  return value ?? TO_BE_PROVIDED;
}
