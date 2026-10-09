/**
 * The limits the product enforces, named once.
 *
 * The routes and the database apply these; the pricing page states them. Keeping the numbers
 * here means a page can never advertise a limit the code does not have, and a limit cannot
 * change without the published figure changing with it.
 */

export { MAX_TOOL_LINES } from '@/lib/tools/document-snapshot';

/** Per network address, where the deployment enforces quotas (see /api/ready). */
export const TOOL_DOCUMENT_QUOTA = { limit: 30, windowSeconds: 600 } as const;

/** HS code lookups per network address; each one reads two official tariff services. */
export const HS_LOOKUP_QUOTA = { limit: 60, windowSeconds: 600 } as const;

/** Denied-party screening searches per network address (the CSL key's quota is shared). */
export const SCREENING_QUOTA = { limit: 30, windowSeconds: 600 } as const;

/** The most current documents one shipment's ZIP set will bundle. */
export const MAX_SET_DOCUMENTS = 60;

/**
 * Rows per product import file. Enforced by public.import_products
 * (supabase/migrations/20261006000400_shipment_reuse_and_import.sql); the import action
 * refuses a larger file before calling it, and this mirrors it for display.
 */
export const MAX_IMPORT_ROWS = 2000;

/**
 * A branding image (logo, signature or stamp): its file size and longest side. Enforced by
 * the upload action (src/app/(app)/branding-actions.ts) and by the org-branding bucket's own
 * size limit (supabase/migrations/20261007000100_pdf_branding.sql).
 */
export const MAX_BRANDING_BYTES = 1_048_576;
/** Pixels, either side. The image reader (src/lib/pdf/image.ts) refuses anything larger. */
export const MAX_BRANDING_SIDE = 2000;
