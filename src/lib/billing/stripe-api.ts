import 'server-only';

import { CHARGE_ID, SUBSCRIPTION_ID } from '@/lib/billing/stripe-events';

/**
 * The two Stripe reads the webhook needs, over plain HTTPS (no SDK). Each reads the live
 * object so the entitlement follows Stripe's current state rather than an event's snapshot.
 * A failure throws, and the webhook answers 5xx so Stripe delivers the event again.
 */

const STRIPE_API = 'https://api.stripe.com/v1/';

export class StripeReadError extends Error {
  constructor(readonly status: number | null) {
    super(`Stripe read failed${status === null ? '' : ` with HTTP ${status}`}.`);
    this.name = 'StripeReadError';
  }
}

export type StripeReader = {
  subscription(id: string): Promise<unknown>;
  charge(id: string): Promise<unknown>;
};

export function createStripeReader(apiKey: string, fetcher: typeof fetch = fetch): StripeReader {
  async function read(path: string): Promise<unknown> {
    let response: Response;
    try {
      response = await fetcher(new URL(path, STRIPE_API), {
        headers: { Authorization: `Bearer ${apiKey}` },
        cache: 'no-store',
        redirect: 'error',
        signal: AbortSignal.timeout(5_000),
      });
    } catch {
      throw new StripeReadError(null);
    }
    if (!response.ok) {
      void response.body?.cancel().catch(() => undefined);
      throw new StripeReadError(response.status);
    }
    return response.json();
  }
  return {
    async subscription(id) {
      // Validated before it becomes part of a URL path.
      if (!SUBSCRIPTION_ID.safeParse(id).success) throw new StripeReadError(null);
      return read(`subscriptions/${id}`);
    },
    async charge(id) {
      if (!CHARGE_ID.safeParse(id).success) throw new StripeReadError(null);
      return read(`charges/${id}`);
    },
  };
}
