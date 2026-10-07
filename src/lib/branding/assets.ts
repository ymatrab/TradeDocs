import { createHash } from 'node:crypto';
import { MAX_BRANDING_BYTES, MAX_BRANDING_SIDE } from '@/lib/limits';
import { embedImage, ImageError, readImageInfo, type ImageFormat } from '@/lib/pdf/image';

/**
 * PDF branding images: an organization's logo and its signature or stamp.
 *
 * Stored in the private org-branding bucket under a content-addressed name,
 * org/<org id>/assets/<sha-256>.<png|jpg>, so an object never changes once written and a
 * document that recorded a hash can always fetch the exact bytes it was issued with
 * (supabase/migrations/20261007000100_pdf_branding.sql). Nothing in a name comes from the
 * uploaded file: not its name, not its declared type.
 *
 * Pure apart from hashing: no I/O, so it can be tested directly.
 */

export const BRANDING_BUCKET = 'org-branding';

/** How long a settings-page preview link lives, in seconds. */
export const PREVIEW_URL_SECONDS = 120;

export const BRANDING_SLOTS = ['logo', 'signature'] as const;
export type BrandingSlot = (typeof BRANDING_SLOTS)[number];

export const BRANDING_SLOT_LABELS: Record<BrandingSlot, string> = {
  logo: 'Logo',
  signature: 'Signature or stamp',
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const SHA256 = /^[0-9a-f]{64}$/;
const OBJECT_PATH =
  /^org\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/assets\/([0-9a-f]{64})\.(png|jpg)$/;

const EXTENSIONS: Record<ImageFormat, 'png' | 'jpg'> = { png: 'png', jpeg: 'jpg' };
export const CONTENT_TYPES: Record<ImageFormat, 'image/png' | 'image/jpeg'> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
};

/** The one name an image can have: derived from the organization and the bytes' hash. */
export function brandingObjectPath(orgId: string, sha256: string, format: ImageFormat): string {
  if (!UUID.test(orgId) || !SHA256.test(sha256)) throw new Error('Invalid branding object name.');
  return `org/${orgId}/assets/${sha256}.${EXTENSIONS[format]}`;
}

/** The organization and hash a stored name stands for, or null when it is not one of ours. */
export function parseBrandingObjectPath(path: string): { orgId: string; sha256: string } | null {
  const match = OBJECT_PATH.exec(path);
  if (!match?.[1] || !match[2]) return null;
  return { orgId: match[1], sha256: match[2] };
}

export function sha256Hex(bytes: Uint8Array): string {
  return createHash('sha256').update(bytes).digest('hex');
}

export type BrandingUpload = {
  format: ImageFormat;
  width: number;
  height: number;
  sha256: string;
  byteSize: number;
  contentType: 'image/png' | 'image/jpeg';
};

const MEGABYTES = MAX_BRANDING_BYTES / 1_048_576;

/**
 * Whether uploaded bytes are an image TradeDocs can print. The format is decided by the
 * bytes' signature, and the image is decoded in full here, so anything accepted is something
 * the renderer can draw: a file that only claims to be a PNG never reaches storage.
 */
export function validateBrandingImage(
  bytes: Uint8Array,
): { ok: true; value: BrandingUpload } | { ok: false; error: string } {
  if (bytes.byteLength === 0) return { ok: false, error: 'Choose an image file to upload.' };
  if (bytes.byteLength > MAX_BRANDING_BYTES) {
    return { ok: false, error: `Use an image of ${MEGABYTES} MB or smaller.` };
  }
  try {
    const info = readImageInfo(bytes);
    if (info.width > MAX_BRANDING_SIDE || info.height > MAX_BRANDING_SIDE) {
      return {
        ok: false,
        error: `Use an image of at most ${MAX_BRANDING_SIDE} × ${MAX_BRANDING_SIDE} pixels.`,
      };
    }
    embedImage(bytes);
    return {
      ok: true,
      value: {
        format: info.format,
        width: info.width,
        height: info.height,
        sha256: sha256Hex(bytes),
        byteSize: bytes.byteLength,
        contentType: CONTENT_TYPES[info.format],
      },
    };
  } catch (error) {
    if (error instanceof ImageError) return { ok: false, error: error.message };
    return { ok: false, error: 'That image could not be read. Save it again as a PNG or JPEG.' };
  }
}
