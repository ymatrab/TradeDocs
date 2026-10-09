'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { apiKeyPepper, generateApiKey } from '@/lib/api/keys';
import { hasEntitlement } from '@/lib/billing/server';
import { fieldErrors, summaryOf } from '@/lib/form-errors';
import { AUTH_LIMITS, actionContext, consumeQuotas, userSubject } from '@/lib/security/auth-limits';
import { createClient } from '@/lib/supabase/server';
import type { ActionState } from './actions';

/**
 * Organization API keys (D-025), managed from the organization's settings.
 *
 * Owners and administrators only, which public.create_api_key and public.revoke_api_key
 * decide (the checks here only choose the message). Creating a key needs the Team plan,
 * checked here with hasEntitlement(org, 'api') and again by the routine; revoking needs no
 * plan, so a lapsed organization can still turn its keys off. Both are audited by the routine.
 *
 * The key is generated here, hashed with the server pepper, and only the hash and the visible
 * prefix are sent to the database. The key itself goes back to the person who created it in
 * this one response and is never stored or logged.
 */

export type ApiKeyState = ActionState & {
  /** The new key, present only in the response that created it. */
  key?: string;
};

const TEAM_REQUIRED =
  'API access is part of the Team plan. Upgrade the organization from Billing to create keys.';
const NOT_MANAGER = 'Only an owner or administrator can manage API keys.';

function read(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === 'string' ? value : '';
}

export async function createApiKey(
  _previous: ApiKeyState,
  formData: FormData,
): Promise<ApiKeyState> {
  const parsed = z
    .object({
      org: z.uuid(),
      name: z
        .string()
        .trim()
        .min(1, 'Name the key after what will use it, such as "ERP export".')
        .max(60, 'Use 60 characters or fewer.'),
    })
    .safeParse({ org: read(formData, 'org').toLowerCase(), name: read(formData, 'name') });
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    return { error: summaryOf(fields, 'Check the details.'), fields };
  }
  const { org, name } = parsed.data;

  const pepper = apiKeyPepper();
  if (!pepper) {
    console.error('api-keys: API_KEY_PEPPER is missing or shorter than 32 characters');
    return { error: 'API keys are not available on this deployment yet.' };
  }

  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return { error: 'Sign in again, then retry.' };
  // Paid gate, fail closed: a missing entitlement or a failed lookup both refuse.
  if (!(await hasEntitlement(org, 'api'))) return { error: TEAM_REQUIRED };

  const { env } = await actionContext();
  const quota = await consumeQuotas(env, [[AUTH_LIMITS.apiKeyChange, userSubject(user.id)]]);
  if (!quota.ok) return { error: quota.message };

  const created = generateApiKey(pepper);
  const { error } = await client.rpc('create_api_key', {
    target_org: org,
    key_name: name,
    key_prefix: created.prefix,
    key_hash: created.hash,
  });
  if (error) {
    if (error.message?.includes('Team plan')) return { error: TEAM_REQUIRED };
    if (error.code === '42501') return { error: NOT_MANAGER };
    if (error.message?.includes('at most 20')) {
      return { error: 'This organization already has 20 active keys. Revoke one first.' };
    }
    console.error('api-keys: create failed', { code: error.code });
    return { error: 'That key could not be created. Try again.' };
  }

  revalidatePath(`/app/${org}/settings`);
  return {
    notice: `Key "${name}" created. Copy it now: it is shown only this once.`,
    key: created.key,
  };
}

export async function revokeApiKey(
  _previous: ApiKeyState,
  formData: FormData,
): Promise<ApiKeyState> {
  const parsed = z
    .object({ org: z.uuid(), key: z.uuid() })
    .safeParse({ org: read(formData, 'org').toLowerCase(), key: read(formData, 'key') });
  if (!parsed.success) return { error: 'That request was not understood. Reload and try again.' };

  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return { error: 'Sign in again, then retry.' };

  const { env } = await actionContext();
  const quota = await consumeQuotas(env, [[AUTH_LIMITS.apiKeyChange, userSubject(user.id)]]);
  if (!quota.ok) return { error: quota.message };

  const { error } = await client.rpc('revoke_api_key', { target_key: parsed.data.key });
  if (error) {
    if (error.code === '42501') return { error: NOT_MANAGER };
    console.error('api-keys: revoke failed', { code: error.code });
    return { error: 'That key could not be revoked. Try again.' };
  }
  revalidatePath(`/app/${parsed.data.org}/settings`);
  return { notice: 'Key revoked. Requests that use it are refused from now on.' };
}
