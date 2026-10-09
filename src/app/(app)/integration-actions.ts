'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { hasEntitlement } from '@/lib/billing/server';
import { ProviderError } from '@/lib/integrations/http';
import {
  NotConnectedError,
  prepareImport,
  readOutcome,
  type PreparedImport,
  type RecordIssue,
} from '@/lib/integrations/importer';
import type { Json } from '@/lib/database.types';
import type { ImportEntity } from '@/lib/integrations/mapping';
import {
  PROVIDER_FEATURES,
  PROVIDER_IDS,
  PROVIDER_NAMES,
  type ProviderId,
} from '@/lib/integrations/providers';
import {
  beginAuthorization,
  currentProviderConfig,
  removeConnection,
  type ReadyConfig,
} from '@/lib/integrations/server';
import { AUTH_LIMITS, actionContext, consumeQuotas, userSubject } from '@/lib/security/auth-limits';
import { createClient, getUser, type TradeDocsClient } from '@/lib/supabase/server';
import type { ActionState } from './actions';

/**
 * QuickBooks Online and Xero (D-025). Connecting, importing and disconnecting are for owners
 * and administrators. Connecting and importing are paid (Pro and Team): every action checks
 * hasEntitlement first and the database routine checks the plan again, so either refusing
 * stops it. Disconnecting needs no plan, so a lapsed organization can still revoke access.
 *
 * Each step fails for that provider alone: an unconfigured provider, a provider outage or a
 * refused token ends in a message, never an exception the page cannot show.
 */

const NOT_MANAGER = 'Only an owner or administrator can manage integrations.';
const PLAN_REQUIRED =
  'Importing from accounting software is part of Pro and Team. Upgrade the organization from Billing.';
const NOT_AVAILABLE = 'This integration is not available on this site yet.';

const target = z.object({ org: z.uuid(), provider: z.enum(PROVIDER_IDS) });

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

type Authorized =
  | { ok: true; org: string; provider: ProviderId; user: string; config: ReadyConfig; client: TradeDocsClient }
  | { ok: false; error: string };

async function authorize(formData: FormData, paid: boolean): Promise<Authorized> {
  const parsed = target.safeParse({ org: read(formData, 'org'), provider: read(formData, 'provider') });
  if (!parsed.success) return { ok: false, error: 'That integration could not be found.' };
  const { org, provider } = parsed.data;
  const config = currentProviderConfig(provider);
  if (config.state !== 'ready') return { ok: false, error: NOT_AVAILABLE };
  const user = await getUser();
  if (!user) return { ok: false, error: 'Sign in again to continue.' };
  const client = await createClient();
  if (!(await manages(client, org, user.id))) return { ok: false, error: NOT_MANAGER };
  if (paid && !(await hasEntitlement(org, PROVIDER_FEATURES[provider]))) {
    return { ok: false, error: PLAN_REQUIRED };
  }
  return { ok: true, org, provider, user: user.id, config, client };
}

function providerMessage(error: unknown, provider: ProviderId): { error: string; detail?: string } {
  const name = PROVIDER_NAMES[provider];
  if (error instanceof NotConnectedError) {
    return error.reason === 'none'
      ? { error: `${name} is not connected.` }
      : { error: `${name} needs to be reconnected before it can be read.` };
  }
  if (error instanceof ProviderError) {
    const detail = error.detail ?? undefined;
    switch (error.code) {
      case 'invalid_grant':
      case 'unauthorized':
        return { error: `${name} no longer accepts this connection. Reconnect it.`, detail };
      case 'forbidden':
        return { error: `${name} refused access to these records.`, detail };
      case 'rate_limited':
        return { error: `${name} is limiting requests. Try again in a minute.`, detail };
      case 'too_large':
        return { error: `${name} returned more data than one import reads.` };
      default:
        return {
          error: `${name} could not be reached or gave an unexpected answer. Try again.`,
          ...(detail ? { detail } : error.status ? { detail: `HTTP ${error.status}` } : {}),
        };
    }
  }
  return { error: `${name} could not be read. Try again.` };
}

// --- Connect and disconnect -------------------------------------------------------------

export async function connectProvider(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const authorized = await authorize(formData, true);
  if (!authorized.ok) return { error: authorized.error };
  const { env } = await actionContext();
  const quota = await consumeQuotas(env, [
    [AUTH_LIMITS.integrationConnect, userSubject(authorized.user)],
  ]);
  if (!quota.ok) return { error: quota.message };

  let location: string;
  try {
    location = await beginAuthorization(authorized.config, authorized.org, authorized.user);
  } catch (error) {
    console.error('integration connect failed', {
      provider: authorized.provider,
      message: error instanceof Error ? error.message : 'unknown',
    });
    return { error: 'The connection could not be started. Try again.' };
  }
  redirect(location);
}

export async function disconnectProvider(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const authorized = await authorize(formData, false);
  if (!authorized.ok) return { error: authorized.error };
  const name = PROVIDER_NAMES[authorized.provider];
  try {
    const { removed, revoked } = await removeConnection(
      authorized.config,
      authorized.org,
      authorized.user,
    );
    revalidatePath(`/app/${authorized.org}/settings/integrations`);
    if (!removed) return { notice: `${name} was not connected.` };
    return {
      notice: revoked
        ? `Disconnected. ${name} access was revoked and the stored credentials deleted. Imported records stay in TradeDocs.`
        : `Disconnected and the stored credentials deleted. ${name} did not confirm the revocation, so also remove TradeDocs from the connected apps in ${name}.`,
    };
  } catch (error) {
    console.error('integration disconnect failed', {
      provider: authorized.provider,
      message: error instanceof Error ? error.message : 'unknown',
    });
    return { error: 'The connection could not be removed. Try again.' };
  }
}

// --- Import ----------------------------------------------------------------------------

export type IntegrationImportState = ActionState & {
  provider?: ProviderId;
  entity?: ImportEntity;
  /** Set by "Check": what an import would do. Nothing was written. */
  previewed?: boolean;
  applied?: boolean;
  counts?: { inserted: number; updated: number; unchanged: number };
  problems?: RecordIssue[];
  conflicts?: RecordIssue[];
  skipped?: RecordIssue[];
  /** Values left blank on import, such as an unrecognised country. */
  notes?: RecordIssue[];
  ignored?: number;
  truncated?: boolean;
  read?: number;
  /** The provider's own explanation of a failure, for the owner or admin who triggered it. */
  detail?: string;
};

const ENTITY_WORDS: Record<ImportEntity, { one: string; many: string }> = {
  company: { one: 'company', many: 'companies' },
  product: { one: 'product', many: 'products' },
};

function plural(count: number, entity: ImportEntity): string {
  const words = ENTITY_WORDS[entity];
  return `${count} ${count === 1 ? words.one : words.many}`;
}

export async function importFromProvider(
  _previous: IntegrationImportState,
  formData: FormData,
): Promise<IntegrationImportState> {
  const entity = z.enum(['company', 'product']).safeParse(read(formData, 'entity'));
  if (!entity.success) return { error: 'Choose what to import.' };
  const authorized = await authorize(formData, true);
  if (!authorized.ok) return { error: authorized.error, entity: entity.data };
  const { org, provider, config, client, user } = authorized;
  const preview = read(formData, 'intent') !== 'apply';
  const base = { provider, entity: entity.data };

  const { env } = await actionContext();
  const quota = await consumeQuotas(env, [[AUTH_LIMITS.integrationImport, userSubject(user)]]);
  if (!quota.ok) return { ...base, error: quota.message };

  let prepared: PreparedImport;
  try {
    prepared = await prepareImport(config, org, entity.data);
  } catch (error) {
    console.error('integration read failed', {
      provider,
      entity: entity.data,
      code: error instanceof ProviderError ? error.code : 'other',
      status: error instanceof ProviderError ? error.status : null,
    });
    revalidatePath(`/app/${org}/settings/integrations`);
    return { ...base, ...providerMessage(error, provider) };
  }

  const shared = {
    ...base,
    notes: prepared.notes,
    ignored: prepared.ignored,
    truncated: prepared.truncated,
    read: prepared.read,
  };
  if (prepared.rows.length === 0) {
    return {
      ...shared,
      notice: `${PROVIDER_NAMES[provider]} has no ${ENTITY_WORDS[entity.data].many} to import.`,
    };
  }

  const { data, error } = await client.rpc('import_integration_records', {
    target_org: org,
    source: provider,
    record_kind: entity.data,
    rows: prepared.rows as unknown as Json,
    dry_run: preview,
  });
  if (error) {
    if (error.code === '42501') {
      return { ...shared, error: error.message || 'This import is not allowed.' };
    }
    return { ...shared, error: 'The import could not be completed. Nothing was changed.' };
  }
  const outcome = readOutcome(data);
  if (!outcome) return { ...shared, error: 'The import could not be completed. Nothing was changed.' };

  const counts = {
    inserted: outcome.inserted,
    updated: outcome.updated,
    unchanged: outcome.unchanged,
  };
  const result = {
    ...shared,
    counts,
    problems: outcome.problems,
    conflicts: outcome.conflicts,
    skipped: outcome.skipped,
  };
  const left = outcome.problems.length + outcome.conflicts.length + outcome.skipped.length;
  const leftText = left > 0 ? ` ${left} will be left as they are; see below.` : '';
  if (preview) {
    return {
      ...result,
      previewed: true,
      notice: `Ready: ${plural(counts.inserted, entity.data)} to add, ${counts.updated} to update, ${counts.unchanged} unchanged.${leftText} Nothing has been written yet.`,
    };
  }
  revalidatePath(`/app/${org}/${entity.data === 'company' ? 'companies' : 'products'}`);
  revalidatePath(`/app/${org}/settings/integrations`);
  return {
    ...result,
    applied: true,
    notice: `Imported: ${plural(counts.inserted, entity.data)} added, ${counts.updated} updated, ${counts.unchanged} unchanged.${left > 0 ? ` ${left} left as they were; see below.` : ''}`,
  };
}
