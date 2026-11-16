/** Types for migration-safety.mjs, so the strict TypeScript tests can import it. */

export type DestructiveApproval = { date: string; reason: string };

export type MigrationAssessment = {
  name: string;
  findings: string[];
  approval: DestructiveApproval | null;
  refused: boolean;
};

export function stripSql(sql: string): string;
export function findDestructiveStatements(sql: string): string[];
export function destructiveApproval(sql: string): DestructiveApproval | null;
export function assessMigration(name: string, sql: string): MigrationAssessment;
export function pendingFromDryRun(output: string): string[];
export function reportsUpToDate(output: string): boolean;
export function redact(text: string, url?: string): string;
