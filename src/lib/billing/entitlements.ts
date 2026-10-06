import { PAID_PLAN_IDS, type PaidPlanId, type PlanId } from '@/lib/billing/plans';

/**
 * Whether a stored entitlement grants a plan, decided without I/O so it can be tested.
 *
 * The row is written only from verified Stripe events (supabase/migrations/
 * 20261006000100_billing_entitlements.sql). `paid_through` is the end of the last period Stripe
 * reported as paid, so:
 *
 * - a cancelled subscription keeps access until the period it paid for ends (cancelled is not
 *   revoked);
 * - a failed renewal (past due) keeps access only to the end of the period already paid;
 * - a full refund or a dispute sets `revoked_at`, which ends access at once.
 *
 * Anything missing or unrecognised answers false: paid gates fail closed.
 */

export const ENTITLEMENT_STATUSES = [
  'active',
  'past_due',
  'cancelled',
  'inactive',
  'revoked',
] as const;
export type EntitlementStatus = (typeof ENTITLEMENT_STATUSES)[number];

/** The columns members may read. The provider references are not among them. */
export const ENTITLEMENT_COLUMNS =
  'org_id, plan, status, paid_through, cancel_at_period_end, revoked_at, revoke_reason, updated_at';

export type EntitlementRow = {
  org_id: string;
  plan: string;
  status: string;
  paid_through: string | null;
  cancel_at_period_end: boolean;
  revoked_at: string | null;
  revoke_reason: string | null;
  updated_at: string;
};

const GRANTING_STATUSES: readonly string[] = ['active', 'past_due', 'cancelled'];

function isPaidPlan(value: string): value is PaidPlanId {
  return (PAID_PLAN_IDS as readonly string[]).includes(value);
}

export function entitlementGrants(
  row: EntitlementRow | null | undefined,
  plans: readonly PlanId[],
  now: Date,
): boolean {
  if (!row) return false;
  if (row.revoked_at !== null || row.status === 'revoked') return false;
  if (!isPaidPlan(row.plan) || !plans.includes(row.plan)) return false;
  if (!GRANTING_STATUSES.includes(row.status)) return false;
  if (!row.paid_through) return false;
  const end = Date.parse(row.paid_through);
  if (!Number.isFinite(end)) return false;
  return now.getTime() < end;
}

export type EntitlementSummary =
  | { kind: 'free' }
  | { kind: 'active'; plan: PaidPlanId; until: string; renews: boolean }
  | { kind: 'ending'; plan: PaidPlanId; until: string }
  | { kind: 'ended'; plan: PaidPlanId }
  | { kind: 'revoked'; plan: PaidPlanId; reason: 'refund' | 'dispute' | null };

/** What the billing page says about an organization's plan. */
export function summarizeEntitlement(
  row: EntitlementRow | null | undefined,
  now: Date,
): EntitlementSummary {
  if (!row || !isPaidPlan(row.plan)) return { kind: 'free' };
  const plan = row.plan;
  if (row.revoked_at !== null || row.status === 'revoked') {
    const reason =
      row.revoke_reason === 'refund' || row.revoke_reason === 'dispute' ? row.revoke_reason : null;
    return { kind: 'revoked', plan, reason };
  }
  if (!entitlementGrants(row, [plan], now) || !row.paid_through) return { kind: 'ended', plan };
  const until = row.paid_through;
  if (row.status === 'active' && !row.cancel_at_period_end) {
    return { kind: 'active', plan, until, renews: true };
  }
  return { kind: 'ending', plan, until };
}
