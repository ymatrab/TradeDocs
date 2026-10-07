import 'server-only';

import { MAX_BRANDING_BYTES } from '@/lib/limits';
import { brandingAssetsOf, type BrandingImages } from '@/lib/pdf/trade-document';
import type { TradeDocsClient } from '@/lib/supabase/server';
import { BRANDING_BUCKET, parseBrandingObjectPath, sha256Hex } from './assets';

/**
 * Fetches the branding images a snapshot recorded, as the caller (storage policy: members of
 * the organization only), and checks each against the hash the snapshot holds.
 *
 * Answers null when any image is unavailable, not the organization's, or not the recorded
 * bytes. An issued document then fails to render rather than render differently; a preview
 * falls back to no branding.
 */
export async function loadBrandingImages(
  client: TradeDocsClient,
  orgId: string,
  snapshot: unknown,
): Promise<BrandingImages | null> {
  const assets = brandingAssetsOf(snapshot);
  const images = new Map<string, Uint8Array>();
  try {
    const bucket = client.storage.from(BRANDING_BUCKET);
    for (const asset of assets) {
      if (images.has(asset.sha256)) continue;
      const named = parseBrandingObjectPath(asset.object_path);
      if (!named || named.orgId !== orgId || named.sha256 !== asset.sha256) return null;
      const { data, error } = await bucket.download(asset.object_path);
      if (error || !data || data.size > MAX_BRANDING_BYTES) return null;
      const bytes = new Uint8Array(await data.arrayBuffer());
      if (sha256Hex(bytes) !== asset.sha256) return null;
      images.set(asset.sha256, bytes);
    }
  } catch {
    return null;
  }
  return images;
}

/** Whether a snapshot needs branding images at all. */
export function needsBranding(snapshot: unknown): boolean {
  return brandingAssetsOf(snapshot).length > 0;
}
