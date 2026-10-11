import { describe, expect, it } from 'vitest';
import {
  assessMigration,
  destructiveApproval,
  findDestructiveStatements,
  pendingFromDryRun,
  redact,
  reportsUpToDate,
} from '../../scripts/migration-safety.mjs';

/** Fixtures for the deploy-time migration gate (D-026). Synthetic SQL only. */
const fixtures = {
  additive: `
    create table public.notes (id uuid primary key, body text not null);
    alter table public.notes enable row level security;
    alter table public.invitations alter column invited_by drop not null;
    alter table public.notes alter column body set default '';
    alter table public.notes drop constraint if exists notes_body_check;
    drop policy if exists notes_select on public.notes;
    drop function if exists public.old_helper();
    create function private.sweep() returns void language plpgsql as $$
    begin
      delete from private.rate_limit_counters r
       where r.window_end < now();
    end $$;
  `,
  commentsAndStrings: `
    -- Rollback: drop table public.notes; truncate public.audit.
    /* drop schema private cascade; */
    insert into public.help (body) values ('To reset, drop table then truncate; delete from x');
    comment on table public.notes is 'never drop column body';
  `,
  dropTable: 'drop table if exists public.notes;',
  dropSchema: 'DROP SCHEMA legacy CASCADE;',
  dropColumn: 'alter table public.notes drop column body;',
  dropColumnBare: 'alter table public.notes drop if exists body, add column title text;',
  truncate: 'truncate table public.audit_events;',
  deleteAll: 'delete from public.notes;',
  deleteSome: "delete from public.notes where created_at < now() - interval '1 year';",
  alterType: 'alter table public.notes alter column body type varchar(200);',
  alterSetDataType: 'ALTER TABLE public.notes ALTER body SET DATA TYPE text;',
};

describe('destructive-statement scanner', () => {
  it('passes additive changes, safe drops and bounded deletes', () => {
    expect(findDestructiveStatements(fixtures.additive)).toEqual([]);
    expect(findDestructiveStatements(fixtures.deleteSome)).toEqual([]);
  });

  it('ignores comments and string literals', () => {
    expect(findDestructiveStatements(fixtures.commentsAndStrings)).toEqual([]);
  });

  it('names each destructive kind', () => {
    expect(findDestructiveStatements(fixtures.dropTable)).toEqual(['drop table']);
    expect(findDestructiveStatements(fixtures.dropSchema)).toEqual(['drop schema']);
    expect(findDestructiveStatements(fixtures.dropColumn)).toEqual(['drop column']);
    expect(findDestructiveStatements(fixtures.dropColumnBare)).toEqual(['drop column']);
    expect(findDestructiveStatements(fixtures.truncate)).toEqual(['truncate']);
    expect(findDestructiveStatements(fixtures.deleteAll)).toEqual(['delete without where']);
    expect(findDestructiveStatements(fixtures.alterType)).toEqual(['alter column type']);
    expect(findDestructiveStatements(fixtures.alterSetDataType)).toEqual(['alter column type']);
  });

  it('reports several kinds in one file once each', () => {
    const sql = `${fixtures.truncate}\n${fixtures.dropTable}\n${fixtures.dropTable}`;
    expect(findDestructiveStatements(sql)).toEqual(['drop table', 'truncate']);
  });
});

describe('approval marker', () => {
  const marker = '-- tradedocs: destructive-approved 2026-10-11 retire unused notes table';

  it('approves a destructive migration that carries a dated reason', () => {
    const verdict = assessMigration('x.sql', `${marker}\n${fixtures.dropTable}`);
    expect(verdict).toEqual({
      name: 'x.sql',
      findings: ['drop table'],
      approval: { date: '2026-10-11', reason: 'retire unused notes table' },
      refused: false,
    });
  });

  it('refuses without the marker, with a malformed date or without a reason', () => {
    expect(assessMigration('x.sql', fixtures.truncate).refused).toBe(true);
    const badDate = '-- tradedocs: destructive-approved 2026-02-30 reason';
    expect(destructiveApproval(badDate)).toBeNull();
    expect(destructiveApproval('-- tradedocs: destructive-approved 2026-10-11')).toBeNull();
    expect(assessMigration('x.sql', `${badDate}\n${fixtures.truncate}`).refused).toBe(true);
  });

  it('never refuses an additive migration', () => {
    expect(assessMigration('x.sql', fixtures.additive)).toMatchObject({ refused: false });
  });
});

describe('dry-run output', () => {
  it('lists pending migration names once each', () => {
    const output = [
      'DRY RUN: migrations will *not* be pushed to the database.',
      'Would push these migrations:',
      ' • 20261012000100_notes.sql',
      ' • 20261012000200_notes_access.sql',
      'Applying migration 20261012000100_notes.sql...',
    ].join('\n');
    expect(pendingFromDryRun(output)).toEqual([
      '20261012000100_notes.sql',
      '20261012000200_notes_access.sql',
    ]);
    expect(reportsUpToDate(output)).toBe(false);
  });

  it('recognises an up-to-date database', () => {
    const output = 'Remote database is up to date.';
    expect(pendingFromDryRun(output)).toEqual([]);
    expect(reportsUpToDate(output)).toBe(true);
  });

  it('redacts the connection string and its password', () => {
    const url = 'postgresql://postgres.ref:synthetic%40pass@pooler.example.com:5432/postgres';
    const text = `failed: ${url}\npassword synthetic@pass rejected\npostgres://other@host/db`;
    const safe = redact(text, url);
    expect(safe).not.toContain('synthetic');
    expect(safe).not.toContain('pooler.example.com');
    expect(safe).not.toContain('other@host');
  });
});
