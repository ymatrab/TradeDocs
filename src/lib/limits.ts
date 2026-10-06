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

/** The most current documents one shipment's ZIP set will bundle. */
export const MAX_SET_DOCUMENTS = 60;

/**
 * Rows per product import file. Enforced by public.import_products
 * (supabase/migrations/20260908000200_master_data_access.sql); this mirrors it for display.
 */
export const MAX_IMPORT_ROWS = 2000;
