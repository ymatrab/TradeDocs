/**
 * Applies pending Supabase migrations from the Vercel production build (D-026).
 *
 * vercel.json runs it after `next build`, so migrations apply only once the release has
 * built. It runs only on Vercel (VERCEL=1) for the production target; previews and CI skip.
 * The database URL is the Supabase integration's POSTGRES_URL_NON_POOLING and is never
 * printed: output names migrations and counts only, and failure output is redacted.
 *
 * Refuses (fails the build, so the previous deployment stays live) when the pending list
 * cannot be read, when the dry run or push fails, or when a pending file contains a
 * destructive statement without its approval marker (scripts/migration-safety.mjs).
 * MIGRATE_ON_DEPLOY=false skips it for an emergency deploy.
 */

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  assessMigration,
  pendingFromDryRun,
  redact,
  reportsUpToDate,
} from './migration-safety.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const MIGRATIONS = join(ROOT, 'supabase', 'migrations');
const CLI = join(ROOT, 'node_modules', '.bin', 'supabase');
const log = (message) => console.log(`migrate-on-deploy: ${message}`);

function fail(message, detail = '') {
  console.error(`migrate-on-deploy: ${message}`);
  if (detail) {
    const lines = detail.trim().split('\n').slice(-20);
    for (const line of lines) console.error(`  ${line}`);
  }
  console.error('migrate-on-deploy: nothing further was applied; the build fails.');
  process.exit(1);
}

if (process.env.VERCEL !== '1' || process.env.VERCEL_ENV !== 'production') {
  log('not a Vercel production build; skipped.');
  process.exit(0);
}
if (process.env.MIGRATE_ON_DEPLOY?.trim() === 'false') {
  log('MIGRATE_ON_DEPLOY=false; skipped.');
  process.exit(0);
}
const url = process.env.POSTGRES_URL_NON_POOLING?.trim();
if (!url) {
  log('POSTGRES_URL_NON_POOLING is not set (Supabase integration not connected); skipped.');
  process.exit(0);
}
if (!existsSync(CLI)) fail('the supabase CLI (devDependency) is not installed.');

function supabase(args) {
  const result = spawnSync(CLI, [...args, '--db-url', url], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
    timeout: 5 * 60 * 1000,
  });
  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
  return { ok: result.status === 0, output, safe: redact(output, url) };
}

const dryRun = supabase(['db', 'push', '--dry-run']);
if (!dryRun.ok) fail('the dry run failed.', dryRun.safe);

const listed = pendingFromDryRun(dryRun.output);
const unknown = listed.filter((name) => !existsSync(join(MIGRATIONS, name)));
if (unknown.length > 0) fail(`the dry run names files not in supabase/migrations: ${unknown}`);
if (listed.length === 0) {
  if (reportsUpToDate(dryRun.output)) {
    log('0 pending migrations; the database is up to date.');
    process.exit(0);
  }
  // Refuse rather than push migrations this script could not scan.
  fail('could not read the pending migrations from the dry run.', dryRun.safe);
}

log(`${listed.length} pending migration(s):`);
for (const name of listed) log(`  ${name}`);

const assessments = listed.map((name) =>
  assessMigration(name, readFileSync(join(MIGRATIONS, name), 'utf8')),
);
const refused = assessments.filter((assessment) => assessment.refused);
if (refused.length > 0) {
  for (const { name, findings } of refused) log(`  refused ${name}: ${findings.join(', ')}`);
  fail(
    'destructive statements without "-- tradedocs: destructive-approved <date> <reason>". ' +
      'Take a backup, add the marker with a rollout and rollback note, and redeploy.',
  );
}
for (const { name, approval } of assessments) {
  if (approval) log(`  ${name}: destructive, approved ${approval.date}`);
}

const push = supabase(['db', 'push', '--yes']);
if (!push.ok) fail('the push failed.', push.safe);
log(`applied ${listed.length} migration(s).`);
