import { z } from 'zod';
import { documentKindLabels } from '@/lib/labels';
import {
  MAX_IMPORT_ROWS,
  MAX_SET_DOCUMENTS,
  MAX_TOOL_LINES,
  TOOL_DOCUMENT_QUOTA,
} from '@/lib/limits';
import { PUBLIC_DOCUMENT_KINDS, PUBLIC_TOOLS } from '@/lib/seo/site';

/**
 * Plans, features and prices: the one source for every public claim about what TradeDocs
 * costs and what each plan includes (rules/product.md, "One source for capability claims").
 *
 * Two rules hold here:
 *
 * - A feature is listed only if the code really does it, and its `plans` say who gets it. No
 *   feature is paid-only today, so every feature lists every plan and nothing free is gated.
 * - No price is ever written in this file (P-002). A paid plan's price, currency, interval and
 *   Payment Link come only from the environment. Until all of them are set, valid, and payments
 *   are open, the plan is "Not available yet": no price, no buy button.
 *
 * Pure: it never reads process.env. The server module passes the environment in.
 */

export const PLAN_IDS = ['free', 'pro', 'team'] as const;
export type PlanId = (typeof PLAN_IDS)[number];
export type PaidPlanId = Exclude<PlanId, 'free'>;
export const PAID_PLAN_IDS = ['pro', 'team'] as const satisfies readonly PaidPlanId[];

export type FeatureGroup = 'Free tools' | 'Workspace' | 'Team';

export type Feature = {
  key: string;
  group: FeatureGroup;
  label: string;
  /** A real limit the code enforces, stated beside the feature. */
  limit?: string;
  /** The plans that include it. A feature that lists 'free' is never gated. */
  plans: readonly PlanId[];
  /** True when it needs an account, so it is absent on a deployment without accounts. */
  needsAccount: boolean;
};

const EVERY_PLAN: readonly PlanId[] = PLAN_IDS;

function listOf(names: string[]): string {
  if (names.length <= 1) return names.join('');
  return `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`;
}

const generatorCount = PUBLIC_TOOLS.filter((tool) => tool.path.endsWith('-generator')).length;
const calculatorCount = PUBLIC_TOOLS.length - generatorCount;
const documentNames = PUBLIC_DOCUMENT_KINDS.map((kind, index) => {
  const label: string = documentKindLabels[kind];
  return index === 0 ? label : label.toLowerCase();
});
const quotaMinutes = TOOL_DOCUMENT_QUOTA.windowSeconds / 60;

export const FEATURES = [
  {
    key: 'tools.generators',
    group: 'Free tools',
    label: `${generatorCount} document generators (commercial invoice, proforma invoice, packing list), no account`,
    limit: `Up to ${MAX_TOOL_LINES} lines per document; ${TOOL_DOCUMENT_QUOTA.limit} PDFs per ${quotaMinutes} minutes from one address`,
    plans: EVERY_PLAN,
    needsAccount: false,
  },
  {
    key: 'tools.calculators',
    group: 'Free tools',
    label: `${calculatorCount} calculators and references (CBM, dimensional weight, landed cost, Incoterms 2020), no account`,
    plans: EVERY_PLAN,
    needsAccount: false,
  },
  {
    key: 'workspace.shipments',
    group: 'Workspace',
    label: 'Shipments with parties, goods, packing, route and Incoterm, saved to your organization',
    limit: 'No cap on the number of shipments',
    plans: EVERY_PLAN,
    needsAccount: true,
  },
  {
    key: 'workspace.documents',
    group: 'Workspace',
    label: `${listOfDocuments()} from one shipment revision, as PDFs`,
    plans: EVERY_PLAN,
    needsAccount: true,
  },
  {
    key: 'workspace.revisions',
    group: 'Workspace',
    label: 'Documents locked to the revision they came from, marked stale when the shipment changes',
    plans: EVERY_PLAN,
    needsAccount: true,
  },
  {
    key: 'workspace.zip',
    group: 'Workspace',
    label: 'A shipment’s current documents as one ZIP with a checksum manifest',
    limit: `Up to ${MAX_SET_DOCUMENTS} documents per ZIP`,
    plans: EVERY_PLAN,
    needsAccount: true,
  },
  {
    key: 'workspace.catalog',
    group: 'Workspace',
    label: 'Company directory and product catalog, reused on every shipment',
    plans: EVERY_PLAN,
    needsAccount: true,
  },
  {
    key: 'workspace.import',
    group: 'Workspace',
    label: 'Product import from a CSV spreadsheet',
    limit: `Up to ${MAX_IMPORT_ROWS.toLocaleString('en')} rows per file`,
    plans: EVERY_PLAN,
    needsAccount: true,
  },
  {
    key: 'team.members',
    group: 'Team',
    label: 'Teammates invited by link, with owner, admin and member roles',
    limit: 'No cap on members',
    plans: EVERY_PLAN,
    needsAccount: true,
  },
] as const satisfies readonly Feature[];

export type FeatureKey = (typeof FEATURES)[number]['key'];

function listOfDocuments(): string {
  return listOf(documentNames);
}

/** The plans that include a feature. An unknown key includes none, so a check on it fails. */
export function featurePlans(key: string): readonly PlanId[] {
  return FEATURES.find((feature) => feature.key === key)?.plans ?? [];
}

/** Features no free account has. Empty today; a paid card says so rather than inventing any. */
export function paidOnlyFeatures(plan: PaidPlanId): Feature[] {
  return FEATURES.filter(
    (feature) =>
      (feature.plans as readonly PlanId[]).includes(plan) &&
      !(feature.plans as readonly PlanId[]).includes('free'),
  );
}

// --- Offers ------------------------------------------------------------------------------

export type PlanInterval = 'month' | 'year';

export type PlanOffer =
  | { state: 'free' }
  | { state: 'unavailable' }
  | {
      state: 'purchasable';
      /** Formatted for display, such as "$29". Built from the environment, never typed here. */
      price: string;
      interval: PlanInterval;
      paymentLinkUrl: string;
    };

export type Plan = {
  id: PlanId;
  name: string;
  summary: string;
  offer: PlanOffer;
};

/** The environment names a paid plan reads. Listed in .env.example and RUNBOOK.md. */
export function planEnvNames(plan: PaidPlanId) {
  const upper = plan.toUpperCase();
  return {
    amount: `PRICE_${upper}_AMOUNT`,
    currency: `PRICE_${upper}_CURRENCY`,
    interval: `PRICE_${upper}_INTERVAL`,
    linkUrl: `PAYMENT_LINK_${upper}_URL`,
    linkId: `PAYMENT_LINK_${upper}_ID`,
  } as const;
}

export type PlanEnvironment = Record<string, string | undefined>;

const amountSchema = z
  .string()
  .trim()
  .regex(/^\d{1,6}(\.\d{1,2})?$/)
  .refine((value) => Number(value) > 0);
const currencySchema = z
  .string()
  .trim()
  .regex(/^[A-Z]{3}$/);
const intervalSchema = z.enum(['month', 'year']);
const paymentLinkIdSchema = z
  .string()
  .trim()
  .regex(/^plink_[A-Za-z0-9]{8,255}$/);
const paymentLinkUrlSchema = z
  .string()
  .trim()
  .refine((value) => {
    try {
      const url = new URL(value);
      // A Payment Link is an HTTPS page of its own; a query string would collide with the
      // client_reference_id the upgrade button appends.
      return (
        url.protocol === 'https:' && !url.username && !url.password && !url.search && !url.hash
      );
    } catch {
      return false;
    }
  });

function blankToUndefined(value: string | undefined): string | undefined {
  return value === undefined || value.trim() === '' ? undefined : value;
}

/** A formatted price, or undefined when the currency is not one Intl knows. */
function formatPrice(amount: string, currency: string): string | undefined {
  try {
    const whole = Number.isInteger(Number(amount));
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency,
      minimumFractionDigits: whole ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(Number(amount));
  } catch {
    return undefined;
  }
}

/**
 * A paid plan's offer. Any missing or invalid value, or closed payments, answers
 * "unavailable": the one plan fails closed, and nothing else on the page is affected.
 */
export function resolveOffer(
  plan: PaidPlanId,
  input: PlanEnvironment,
  paymentsOpen: boolean,
): PlanOffer {
  if (!paymentsOpen) return { state: 'unavailable' };
  const names = planEnvNames(plan);
  const amount = amountSchema.safeParse(blankToUndefined(input[names.amount]));
  const currency = currencySchema.safeParse(blankToUndefined(input[names.currency]));
  const interval = intervalSchema.safeParse(blankToUndefined(input[names.interval]));
  const linkUrl = paymentLinkUrlSchema.safeParse(blankToUndefined(input[names.linkUrl]));
  const linkId = paymentLinkIdSchema.safeParse(blankToUndefined(input[names.linkId]));
  if (
    !amount.success ||
    !currency.success ||
    !interval.success ||
    !linkUrl.success ||
    !linkId.success
  ) {
    return { state: 'unavailable' };
  }
  const price = formatPrice(amount.data, currency.data);
  if (!price) return { state: 'unavailable' };
  return {
    state: 'purchasable',
    price,
    interval: interval.data,
    paymentLinkUrl: linkUrl.data,
  };
}

/**
 * Payment Link id to plan, for the webhook. Independent of the displayed price, so removing a
 * price from the page never stops a paid checkout from being recognised.
 */
export function paymentLinkPlans(input: PlanEnvironment): Map<string, PaidPlanId> {
  const map = new Map<string, PaidPlanId>();
  for (const plan of PAID_PLAN_IDS) {
    const id = paymentLinkIdSchema.safeParse(blankToUndefined(input[planEnvNames(plan).linkId]));
    if (id.success && !map.has(id.data)) map.set(id.data, plan);
  }
  return map;
}

export const PLAN_NAMES: Record<PlanId, string> = {
  free: 'Free (while early)',
  pro: 'Pro',
  team: 'Team',
};

export function resolvePlans(input: PlanEnvironment, paymentsOpen: boolean): Plan[] {
  return [
    {
      id: 'free',
      name: PLAN_NAMES.free,
      summary: 'Everything TradeDocs does today, for any organization, while it is early.',
      offer: { state: 'free' },
    },
    {
      id: 'pro',
      name: PLAN_NAMES.pro,
      summary: 'A paid plan for one organization.',
      offer: resolveOffer('pro', input, paymentsOpen),
    },
    {
      id: 'team',
      name: PLAN_NAMES.team,
      summary: 'A paid plan for larger teams.',
      offer: resolveOffer('team', input, paymentsOpen),
    },
  ];
}

/**
 * The Payment Link the in-app upgrade button opens. It carries the organization's id as
 * client_reference_id so the verified webhook knows which organization paid. An organization
 * id is a random UUID, not personal data; nothing else is added (no email, no name).
 */
export function upgradeUrl(paymentLinkUrl: string, orgId: string): string | undefined {
  if (!z.uuid().safeParse(orgId).success) return undefined;
  const url = new URL(paymentLinkUrl);
  url.searchParams.set('client_reference_id', orgId);
  return url.toString();
}

export const INTERVAL_LABELS: Record<PlanInterval, string> = {
  month: 'per month',
  year: 'per year',
};
