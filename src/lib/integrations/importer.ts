import 'server-only';

import { fetchQuickBooks, fetchXero, type Fetched } from '@/lib/integrations/api';
import { ProviderError, type Fetcher } from '@/lib/integrations/http';
import { mapRecords, type ImportEntity, type MappedRecord } from '@/lib/integrations/mapping';
import {
  loadConnection,
  usableAccessToken,
  type OpenConnection,
  type ReadyConfig,
} from '@/lib/integrations/server';
import { MAX_IMPORT_ROWS } from '@/lib/limits';

/**
 * Reads one entity from a connected provider and maps it, ready for
 * public.import_integration_records. A 401 from the API forces one token refresh and one
 * retry; anything else is the provider's answer, passed up as a ProviderError.
 */

export type RecordIssue = { row: number; label: string; problem: string };

export type PreparedImport = {
  rows: { external_id: string; line: number; values: unknown }[];
  notes: RecordIssue[];
  ignored: number;
  truncated: boolean;
  read: number;
};

export class NotConnectedError extends Error {
  constructor(readonly reason: 'none' | 'needs_reconnect') {
    super(`Not connected: ${reason}.`);
    this.name = 'NotConnectedError';
  }
}

async function read(
  config: ReadyConfig,
  entity: ImportEntity,
  connection: OpenConnection,
  accessToken: string,
  fetcher: Fetcher,
): Promise<Fetched> {
  const target = { accessToken, tenantId: connection.tenantId };
  return config.provider === 'quickbooks'
    ? fetchQuickBooks(entity, target, config.quickbooksEnvironment, MAX_IMPORT_ROWS, fetcher)
    : fetchXero(entity, target, MAX_IMPORT_ROWS, fetcher);
}

export async function prepareImport(
  config: ReadyConfig,
  org: string,
  entity: ImportEntity,
  fetcher: Fetcher = fetch,
): Promise<PreparedImport> {
  const connection = await loadConnection(config, org);
  if (!connection) throw new NotConnectedError('none');
  if (connection.status !== 'active') throw new NotConnectedError('needs_reconnect');

  let token = await usableAccessToken(config, org, connection, fetcher);
  let fetched: Fetched;
  try {
    fetched = await read(config, entity, connection, token, fetcher);
  } catch (error) {
    if (!(error instanceof ProviderError) || error.code !== 'unauthorized') throw error;
    // The access token was revoked or expired early: refresh once, then try again.
    token = await usableAccessToken(
      config,
      org,
      { ...connection, accessExpiresAt: new Date(0) },
      fetcher,
    );
    fetched = await read(config, entity, connection, token, fetcher);
  }

  const mapped = mapRecords(config.provider, entity, fetched.entries);
  const records = mapped.records as MappedRecord<unknown>[];
  return {
    rows: records.map((record) => ({
      external_id: record.external_id,
      line: record.line,
      values: record.values,
    })),
    notes: records.flatMap((record) =>
      record.notes.map((note) => ({ row: record.line, label: record.label, problem: note })),
    ),
    ignored: mapped.ignored,
    truncated: fetched.truncated,
    read: records.length,
  };
}

/** The routine's issue lists, filtered to well-formed entries. */
export function issuesFrom(value: unknown): RecordIssue[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (typeof entry !== 'object' || entry === null) return [];
    const e = entry as Record<string, unknown>;
    if (typeof e.row !== 'number' || typeof e.problem !== 'string') return [];
    return [{ row: e.row, label: typeof e.label === 'string' ? e.label : '', problem: e.problem }];
  });
}

export type ImportOutcome = {
  inserted: number;
  updated: number;
  unchanged: number;
  problems: RecordIssue[];
  conflicts: RecordIssue[];
  skipped: RecordIssue[];
};

export function readOutcome(data: unknown): ImportOutcome | null {
  if (typeof data !== 'object' || data === null) return null;
  const d = data as Record<string, unknown>;
  if (
    typeof d.inserted !== 'number' ||
    typeof d.updated !== 'number' ||
    typeof d.unchanged !== 'number'
  ) {
    return null;
  }
  return {
    inserted: d.inserted,
    updated: d.updated,
    unchanged: d.unchanged,
    problems: issuesFrom(d.problems),
    conflicts: issuesFrom(d.conflicts),
    skipped: issuesFrom(d.skipped),
  };
}
