'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { hasEntitlement } from '@/lib/billing/server';
import {
  BRANDING_BUCKET,
  BRANDING_SLOT_LABELS,
  BRANDING_SLOTS,
  brandingObjectPath,
  validateBrandingImage,
} from '@/lib/branding/assets';
import { MAX_BRANDING_BYTES } from '@/lib/limits';
import { AUTH_LIMITS, actionContext, consumeQuotas, userSubject } from '@/lib/security/auth-limits';
import { createClient, type TradeDocsClient } from '@/lib/supabase/server';
import type { ActionState } from './actions';

/**
 * PDF branding (D-021): an organization's logo and its signature or stamp image.
 *
 * A paid feature, so every upload checks hasEntitlement(org, 'pdf_branding') first and the
 * database checks it again (the bucket's insert policy and the branding_assets policies
 * call private.branding_entitled): either refusing stops the upload. Owners and
 * administrators only, which the same policies decide. Removing an image needs no plan, so
 * an organization whose plan has ended can still take its images down.
 *
 * Images are content-addressed and never overwritten. Replacing or removing one deletes the
 * old object only when no slot and no document of the organization still refers to it; an
 * issued document keeps the exact image it was issued with.
 */

const PRO_REQUIRED =
  'Branding is part of Pro. Upgrade the organization from Billing to add a logo or signature.';
const NOT_MANAGER = 'Only an owner or administrator can change branding.';

const target = z.object({ org: z.uuid(), slot: z.enum(BRANDING_SLOTS) });

function read(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === 'string' ? value : '';
}

async function manages(client: TradeDocsClient, org: string, user: string): Promise<boolean> {
  const { data } = await client
    .from('memberships')
    .select('role')
    .eq('org_id', org)
    .eq('user_id', user)
    .maybeSingle();
  return data?.role === 'owner' || data?.role === 'admin';
}

/** Deletes an image nothing needs any more. A failure leaves a harmless orphan, logged. */
async function deleteIfUnused(
  client: TradeDocsClient,
  org: string,
  previous: { sha256: string; object_path: string },
): Promise<void> {
  const { data: inUse, error } = await client.rpc('branding_asset_in_use', {
    target_org: org,
    asset_sha256: previous.sha256,
  });
  if (error || inUse !== false) return;
  const bucket = client.storage.from(BRANDING_BUCKET);
  const { error: removal } = await bucket.remove([previous.object_path]);
  if (removal) {
    console.error('branding: unused image not deleted', { org, cause: removal.message });
  }
}

function alreadyStored(error: { message?: string; statusCode?: unknown }): boolean {
  return String(error.statusCode) === '409' || /already exists/i.test(error.message ?? '');
}

export async function uploadBrandingImage(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = target.safeParse({
    org: read(formData, 'org').toLowerCase(),
    slot: read(formData, 'slot'),
  });
  if (!parsed.success) return { error: 'That upload was not understood. Reload and try again.' };
  const { org, slot } = parsed.data;
  const label = BRANDING_SLOT_LABELS[slot];

  const file = formData.get('image');
  if (!(file instanceof File) || file.size === 0) {
    const message = 'Choose a PNG or JPEG image.';
    return { error: message, fields: { image: message } };
  }
  if (file.size > MAX_BRANDING_BYTES) {
    const message = 'Use an image of 1 MB or smaller.';
    return { error: message, fields: { image: message } };
  }

  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return { error: 'Sign in again, then retry.' };
  if (!(await manages(client, org, user.id))) return { error: NOT_MANAGER };
  // Paid gate, fail closed: a missing entitlement or a failed lookup both refuse.
  if (!(await hasEntitlement(org, 'pdf_branding'))) return { error: PRO_REQUIRED };

  const { env } = await actionContext();
  const quota = await consumeQuotas(env, [[AUTH_LIMITS.brandingUpload, userSubject(user.id)]]);
  if (!quota.ok) return { error: quota.message };

  const bytes = new Uint8Array(await file.arrayBuffer());
  const checked = validateBrandingImage(bytes);
  if (!checked.ok) return { error: checked.error, fields: { image: checked.error } };
  const image = checked.value;
  const objectPath = brandingObjectPath(org, image.sha256, image.format);

  const bucket = client.storage.from(BRANDING_BUCKET);
  const { error: stored } = await bucket.upload(objectPath, bytes, {
    contentType: image.contentType,
    cacheControl: '3600',
    upsert: false,
  });
  // The same bytes stored before (another slot, or an earlier upload) are the same object.
  if (stored && !alreadyStored(stored)) {
    console.error('branding: upload refused', { org, slot, cause: stored.message });
    return { error: `The ${label.toLowerCase()} could not be stored. Try again.` };
  }

  const { data: previous } = await client
    .from('branding_assets')
    .select('sha256, object_path')
    .eq('org_id', org)
    .eq('slot', slot)
    .maybeSingle();

  const { data: saved, error } = await client
    .from('branding_assets')
    .upsert(
      {
        org_id: org,
        slot,
        sha256: image.sha256,
        format: image.format,
        object_path: objectPath,
        width: image.width,
        height: image.height,
        byte_size: image.byteSize,
        updated_by: user.id,
      },
      { onConflict: 'org_id,slot' },
    )
    .select('org_id');
  if (error?.code === '42501' || (!error && !saved?.length)) return { error: PRO_REQUIRED };
  if (error) {
    console.error('branding: record not saved', { org, slot, cause: error.message });
    return { error: `The ${label.toLowerCase()} could not be saved. Try again.` };
  }

  if (previous && previous.sha256 !== image.sha256) await deleteIfUnused(client, org, previous);

  revalidatePath(`/app/${org}/settings`);
  return {
    notice: `${label} saved. Documents generated from now on carry it; earlier documents keep what they were issued with.`,
  };
}

export async function removeBrandingImage(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = target.safeParse({
    org: read(formData, 'org').toLowerCase(),
    slot: read(formData, 'slot'),
  });
  if (!parsed.success) return { error: 'That request was not understood. Reload and try again.' };
  const { org, slot } = parsed.data;
  const label = BRANDING_SLOT_LABELS[slot];

  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return { error: 'Sign in again, then retry.' };
  if (!(await manages(client, org, user.id))) return { error: NOT_MANAGER };

  // Waits for any document being generated with this image to commit (generate_document
  // holds a share lock on the row), so the in-use check below counts it.
  const { data: removed, error } = await client
    .from('branding_assets')
    .delete()
    .eq('org_id', org)
    .eq('slot', slot)
    .select('sha256, object_path');
  if (error) {
    console.error('branding: record not removed', { org, slot, cause: error.message });
    return { error: `The ${label.toLowerCase()} could not be removed. Try again.` };
  }
  const row = removed?.[0];
  if (row) await deleteIfUnused(client, org, row);

  revalidatePath(`/app/${org}/settings`);
  return {
    notice: `${label} removed. New documents are generated without it; earlier documents keep what they were issued with.`,
  };
}
