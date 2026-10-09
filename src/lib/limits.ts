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

/**
 * E-signature (D-025): signers per request and the message length, enforced by the send
 * action and by the esign_requests table (supabase/migrations/20261009000600_esign_requests.sql).
 * The signed copy's size bound matches the esign-signed bucket's own limit.
 */
export const MAX_ESIGN_SIGNERS = 5;
export const MAX_ESIGN_MESSAGE = 2000;
export const MAX_SIGNED_PDF_BYTES = 26_214_400;

/**
 * The public REST API (src/app/api/v1). Requests per key per minute, where the deployment
 * enforces quotas (see /api/ready); POSTs count against both quotas. Lines per shipment
 * created through the API, page sizes and active keys per organization (the last enforced
 * by public.create_api_key, supabase/migrations/20261009000400_public_api.sql).
 */
export const API_REQUEST_QUOTA = { limit: 120, windowSeconds: 60 } as const;
export const API_WRITE_QUOTA = { limit: 30, windowSeconds: 60 } as const;
export const API_MAX_LINES = 200;
export const API_PAGE_SIZE = { default: 25, max: 100 } as const;
export const MAX_ACTIVE_API_KEYS = 20;
