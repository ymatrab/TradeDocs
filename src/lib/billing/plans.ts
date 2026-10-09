import { z } from 'zod';
import { documentKindLabels } from '@/lib/labels';
import {
  API_REQUEST_QUOTA,
  MAX_BRANDING_BYTES,
  MAX_BRANDING_SIDE,
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
 * - A feature is listed only if the code really does it, and its `plans` say who gets it. A
 *   feature that lists 'free' is never gated. The paid-only features are PDF branding
 *   (D-021, Pro and Team), gated by hasEntitlement(org, 'pdf_branding') in
 *   src/lib/billing/server.ts and, in the database, by private.branding_entitled
 *   (supabase/migrations/20261007000100_pdf_branding.sql); and the REST API (D-025, Team),
 *   gated by hasEntitlement(org, 'api') and by private.api_entitled
 *   (supabase/migrations/20261009000400_public_api.sql). Each SQL function mirrors its plans.
 * - No price shows unless the owner has approved the prices (PRICES_APPROVED=true, D-020).
 *   PROPOSED_PRICES below are the marketing proposal, unapproved (P-002 stays open until the
 *   owner confirms). With the flag off every paid plan is "Not available yet": no price, no
 *   buy button. With it on, a paid plan shows its proposed prices; it becomes purchasable only
 *   when payments are open and its env price and Payment Link are all set and valid, and the
 *   price it then shows is the env one, which must match what the Payment Link charges.
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
  /** A short name for running text, such as "PDF branding". Set on paid-only features. */
  short?: string;
  /** True when it needs an account, so it is absent on a deployment without accounts. */
  needsAccount: boolean;
};

const EVERY_PLAN: readonly PlanId[] = PLAN_IDS;
const PAID_PLANS: readonly PlanId[] = PAID_PLAN_IDS;
const TEAM_PLAN: readonly PlanId[] = ['team'];

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
    label:
      'Documents locked to the revision they came from, marked stale when the shipment changes',
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
    key: 'pdf_branding',
    group: 'Workspace',
    label: 'PDF branding: your logo and signature',
    short: 'PDF branding',
    limit: `Logo top left of every page, signature or stamp above the signatory line; PNG or JPEG, up to ${MAX_BRANDING_BYTES / 1_048_576} MB and ${MAX_BRANDING_SIDE} × ${MAX_BRANDING_SIDE} pixels each`,
    plans: PAID_PLANS,
    needsAccount: true,
  },
  {
    key: 'api',
    group: 'Team',
    label:
      'REST API: list and create shipments, generate documents and download their PDFs with organization API keys',
    short: 'the REST API',
    limit: `${API_REQUEST_QUOTA.limit} requests per minute per key; keys are created and revoked by owners and administrators`,
    plans: TEAM_PLAN,
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

/** Features no free account has. A paid card lists them; it never invents any. */
export function paidOnlyFeatures(plan: PaidPlanId): Feature[] {
  return FEATURES.filter(
    (feature) =>
      (feature.plans as readonly PlanId[]).includes(plan) &&
      !(feature.plans as readonly PlanId[]).includes('free'),
  );
}

/** The paid-only features of every paid plan, by short name, as running text ("" if none). */
export function paidOnlySummary(): string {
  const names = new Set(
    PAID_PLAN_IDS.flatMap((plan) =>
      paidOnlyFeatures(plan).map((feature) => feature.short ?? feature.label),
    ),
  );
  return listOf([...names]);
}

/**
 * What the paid plans add over Free, as one sentence without a final full stop, or "" when
 * they add nothing. Grouped by the plans that include each feature, so a Team-only feature is
 * never credited to Pro: "Pro and Team add PDF branding; Team also adds the REST API".
 */
export function paidAdditions(): string {
  const proOnly = paidOnlyFeatures('pro').map((feature) => feature.short ?? feature.label);
  const teamOnly = paidOnlyFeatures('team')
    .filter((feature) => !(feature.plans as readonly PlanId[]).includes('pro'))
    .map((feature) => feature.short ?? feature.label);
  const parts: string[] = [];
  if (proOnly.length > 0) parts.push(`Pro and Team add ${listOf(proOnly)}`);
  if (teamOnly.length > 0) {
    parts.push(`${proOnly.length > 0 ? 'Team also adds' : 'Team adds'} ${listOf(teamOnly)}`);
  }
  return parts.join('; ');
}

// --- Offers ------------------------------------------------------------------------------

export type PlanInterval = 'month' | 'year';

/**
 * Proposed prices (marketing, 2026-10-06; docs/research/pricing-proposal-2026-10-06.md).
 * Not approved: they render only with PRICES_APPROVED=true. A year costs ten months.
 */
export const PRICE_CURRENCIES = ['USD', 'EUR'] as const;
export type PriceCurrency = (typeof PRICE_CURRENCIES)[number];

export const PROPOSED_PRICES = {
  pro: { USD: { month: 19, year: 190 }, EUR: { month: 19, year: 190 } },
  team: { USD: { month: 49, year: 490 }, EUR: { month: 49, year: 490 } },
} as const satisfies Record<PaidPlanId, Record<PriceCurrency, Record<PlanInterval, number>>>;

/** The owner's approval of PROPOSED_PRICES. Any value other than "true" leaves it off. */
export const PRICES_APPROVED_ENV = 'PRICES_APPROVED';

export function pricesApproved(input: PlanEnvironment): boolean {
  return input[PRICES_APPROVED_ENV]?.trim() === 'true';
}

export type ListedPrice = {
  currency: PriceCurrency;
  /** Formatted, such as "$19". */
  month: string;
  year: string;
  /** Whole months a yearly payment saves, such as 2. */
  monthsFree: number;
};

/** A paid plan's proposed prices, formatted, in the order of PRICE_CURRENCIES. */
export function listedPrices(plan: PaidPlanId): ListedPrice[] {
  return PRICE_CURRENCIES.flatMap((currency) => {
    const { month, year } = PROPOSED_PRICES[plan][currency];
    const monthly = formatPrice(String(month), currency);
    const yearly = formatPrice(String(year), currency);
    if (!monthly || !yearly) return [];
    return [{ currency, month: monthly, year: yearly, monthsFree: Math.round(12 - year / month) }];
  });
}

export type PlanOffer =
  | { state: 'free' }
  | { state: 'unavailable' }
  /** Approved prices on show, but nothing can be bought yet: no button. */
  | { state: 'listed'; prices: ListedPrice[] }
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
 * A paid plan's offer. Without price approval it is "unavailable" (no price at all). With
 * approval, closed payments or any missing or invalid checkout value answer "listed": the
 * proposed prices show and nothing can be bought, so the one plan fails closed for buying and
 * nothing else on the page is affected.
 */
export function resolveOffer(
  plan: PaidPlanId,
  input: PlanEnvironment,
  paymentsOpen: boolean,
): PlanOffer {
  if (!pricesApproved(input)) return { state: 'unavailable' };
  const listed: PlanOffer = { state: 'listed', prices: listedPrices(plan) };
  if (!paymentsOpen) return listed;
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
    return listed;
  }
  const price = formatPrice(amount.data, currency.data);
  if (!price) return listed;
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

function freeSummary(): string {
  const paid = paidOnlySummary();
  return `Every generator, calculator and workspace feature${paid ? ` except ${paid}` : ''}, for any organization, while it is early.`;
}

export function resolvePlans(input: PlanEnvironment, paymentsOpen: boolean): Plan[] {
  return [
    {
      id: 'free',
      name: PLAN_NAMES.free,
      summary: freeSummary(),
      offer: { state: 'free' },
    },
    {
      id: 'pro',
      name: PLAN_NAMES.pro,
      summary: 'For one exporting business that prepares its own shipments.',
      offer: resolveOffer('pro', input, paymentsOpen),
    },
    {
      id: 'team',
      name: PLAN_NAMES.team,
      summary: 'For a team that prepares shipments together in one organization.',
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
