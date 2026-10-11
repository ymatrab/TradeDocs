/**
 * Destructive-statement scanner for migrations applied on deploy (D-026, RUNBOOK.md
 * "Migrations on deploy"). Pure and dependency-free: scripts/migrate-on-deploy.mjs runs it
 * in the Vercel build, and tests/unit/migration-safety.test.ts runs it on fixtures.
 *
 * A pending migration that drops a table, column or schema, truncates, deletes without a
 * WHERE clause or changes a column's type is refused unless the file carries the marker
 *   -- tradedocs: destructive-approved YYYY-MM-DD <reason>
 * The scan is deliberately conservative: it reads function bodies too, so a false positive
 * blocks the deploy (the previous deployment stays live) rather than losing data.
 */

const MARKER = /^ *-- *tradedocs: *destructive-approved +(\d{4}-\d{2}-\d{2}) +(\S.*)$/im;

/** Words that may follow DROP inside ALTER TABLE without removing a column's data. */
const SAFE_DROPS = new Set(['constraint', 'default', 'not', 'identity', 'expression']);

/** ALTER TABLE … DROP [COLUMN] [IF EXISTS] name, with or without the COLUMN keyword. */
function dropsColumn(statement) {
  if (!/^alter\s+table\b/.test(statement)) return false;
  if (/\bdrop\s+column\b/.test(statement)) return true;
  const drops = statement.matchAll(/\bdrop\s+(?:if\s+exists\s+)?([a-z_][a-z0-9_$]*)/g);
  return [...drops].some((match) => !SAFE_DROPS.has(match[1]));
}

/** Removes comments and string literals; quoted identifiers become a neutral placeholder. */
export function stripSql(sql) {
  let out = '';
  let index = 0;
  while (index < sql.length) {
    const char = sql[index];
    const next = sql[index + 1];
    if (char === '-' && next === '-') {
      const end = sql.indexOf('\n', index);
      index = end === -1 ? sql.length : end;
    } else if (char === '/' && next === '*') {
      const end = sql.indexOf('*/', index + 2);
      index = end === -1 ? sql.length : end + 2;
      out += ' ';
    } else if (char === "'") {
      index += 1;
      while (index < sql.length) {
        if (sql[index] === "'" && sql[index + 1] === "'") index += 2;
        else if (sql[index] === "'") break;
        else index += 1;
      }
      index += 1;
      out += "''";
    } else if (char === '"') {
      const end = sql.indexOf('"', index + 1);
      index = end === -1 ? sql.length : end + 1;
      out += 'quoted_identifier';
    } else {
      out += char;
      index += 1;
    }
  }
  return out;
}

const RULES = [
  { name: 'drop table', test: (s) => /\bdrop\s+table\b/.test(s) },
  { name: 'drop schema', test: (s) => /\bdrop\s+schema\b/.test(s) },
  { name: 'drop database', test: (s) => /\bdrop\s+database\b/.test(s) },
  { name: 'truncate', test: (s) => /\btruncate\b/.test(s) },
  { name: 'drop column', test: dropsColumn },
  {
    name: 'alter column type',
    test: (s) =>
      /^alter\s+table\b/.test(s) &&
      /\balter\s+(?:column\s+)?[a-z_][a-z0-9_$]*\s+(?:set\s+data\s+)?type\b/.test(s),
  },
  {
    name: 'delete without where',
    test: (s) => /\bdelete\s+from\b/.test(s) && !/\bwhere\b/.test(s),
  },
];

/** The destructive kinds a migration contains, each named once, in rule order. */
export function findDestructiveStatements(sql) {
  const statements = stripSql(sql)
    .toLowerCase()
    .split(';')
    .map((statement) => statement.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  const found = RULES.filter((rule) => statements.some((statement) => rule.test(statement)));
  return found.map((rule) => rule.name);
}

/** The approval marker's date and reason, or null when absent or its date is not real. */
export function destructiveApproval(sql) {
  const match = MARKER.exec(sql);
  if (!match) return null;
  const [, date, reason] = match;
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) return null;
  return { date, reason: reason.trim() };
}

/** One migration's verdict: refused when it is destructive and carries no valid marker. */
export function assessMigration(name, sql) {
  const findings = findDestructiveStatements(sql);
  const approval = findings.length > 0 ? destructiveApproval(sql) : null;
  return { name, findings, approval, refused: findings.length > 0 && approval === null };
}

/** Migration file names a `supabase db push --dry-run` lists, each once, in order. */
export function pendingFromDryRun(output) {
  return [...new Set(output.match(/\b\d{14}_[A-Za-z0-9_-]+\.sql\b/g) ?? [])];
}

/** Whether a dry run reported nothing to apply. */
export function reportsUpToDate(output) {
  return /\bup to date\b/i.test(output);
}

/** Removes a connection string, its password and any other database URL from CLI output. */
export function redact(text, url) {
  let out = text;
  if (url) {
    out = out.split(url).join('[database url]');
    try {
      const password = decodeURIComponent(new URL(url).password);
      if (password) out = out.split(password).join('[redacted]');
    } catch {
      // Not a parseable URL: the whole value was already removed above.
    }
  }
  return out.replace(/postgres(?:ql)?:\/\/\S+/gi, '[database url]');
}
