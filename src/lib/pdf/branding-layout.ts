/**
 * Where branding images print, in PDF points (1/72 inch). A plain module, so the settings page
 * can state the same sizes the renderer uses without loading the renderer.
 */

/** The box a logo is fitted into, top left of every page (about 53 × 14 mm). */
export const LOGO_BOX = { width: 150, height: 40 } as const;

/** The box a signature or stamp is fitted into, above the signatory line (about 64 × 18 mm). */
export const SIGNATURE_BOX = { width: 180, height: 50 } as const;
