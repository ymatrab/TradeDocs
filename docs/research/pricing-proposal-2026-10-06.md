# Pricing proposal — TradeDocs, 2026-10-06

Status: **proposal, not approved** (P-002 stays open). Prepared by the marketing agent under
D-020 ("make packages based on our competitors, put what you think is best, I'll confirm
tomorrow"). Evidence: [competitors-2026-10-06.md](competitors-2026-10-06.md), all figures from
the competitors' live pages retrieved 2026-10-06.

## 1. The packages

| Plan                   | Monthly   | Yearly (2 months free) | Members           | Shipments / documents | Paid-only today |
| ---------------------- | --------- | ---------------------- | ----------------- | --------------------- | --------------- |
| **Free (while early)** | $0 / €0   | —                      | No cap (today)    | No cap (today)        | —               |
| **Pro**                | $19 / €19 | $190 / €190            | Proposed: up to 3 | No cap                | PDF branding    |
| **Team**               | $49 / €49 | $490 / €490            | No cap            | No cap                | PDF branding    |

In code: `PROPOSED_PRICES` in `src/lib/billing/plans.ts`. They render on `/pricing` and in
`/llms.txt` only with `PRICES_APPROVED=true`.

### Why this structure

- **Three plans, matching the market's shape** (IncoDocs Free/Basic/Professional/Organization,
  ovrseas Starter/Pro/Business) so a buyer comparing tabs finds the same ladder.
- **Pro at $19, under every entry price we found** (ovrseas Starter $20, IncoDocs Basic $27),
  with no document meter where theirs stop at 30 a month. Cheaper and unmetered is the simplest
  story against both.
- **Team at $49, under the mid tiers** (ovrseas Pro $60 for 3 members, IncoDocs Professional
  $62 for 2 users) with no member cap: their 5-seat tiers cost $150–167.
- **Bill per organization, not per document.** TradeDocs' value is one shipment record producing
  a consistent set; metering documents would punish exactly the behaviour we want (generating
  the full set, regenerating after edits).
- **Yearly = 10 months** (16.7% off; "2 months free"). Close to the market's 20% while keeping
  round prices; owner may prefer exactly 20% ($182.40 / $470.40 are not round, so we did not).
- **USD and EUR at the same number.** Small exporters in the EU are a core audience (the
  2026-10-05 keyword pulls include UK demand); a 1:1 euro price is simple and common. Whether
  prices include VAT is an owner/legal decision (see 3).

### What the code can and cannot enforce today

- Enforced today, every plan: the limits already in `src/lib/limits.ts` (60 documents per ZIP,
  2,000 rows per CSV import, 30 generator PDFs per 10 minutes per address, line caps).
- **Update 2026-10-07 (D-021):** the first paid-only feature has shipped: **PDF branding**
  (the organization's logo top left of every page and its signature or stamp image above the
  signatory line), `pdf_branding` in `src/lib/billing/plans.ts`, Pro and Team only. Pricing,
  the comparison table and `/llms.txt` now list it under Pro and Team, and "Paid-only
  features: none yet" no longer shows. Nothing Free had was gated or reduced: branding is new.
  The "Prepared with TradeDocs…" statement stays on every branded document.
- The "up to 3 members" for Pro and the proposed Free limits below are **not enforced and not
  shown**. They need a builder change (count memberships / shipments in the invite and
  create-shipment server actions, behind `hasEntitlement()`), and the owner's approval because
  they reduce what Free users have today.

### Proposed Free limits (owner decision; not implemented, not displayed)

Only once at least one paid-only feature ships, and only with `PRICES_APPROVED=true`:

- Free: 1 organization owner + 2 members (3 people), 10 new shipments a month, generators and
  calculators unlimited (within the existing per-address quota).
- Rationale: still more generous than IncoDocs Free (10 documents, 1 user); a shipment yields
  3–4 documents, so 10 shipments is roughly 30–40 documents.
- Existing Free organizations over a new limit keep what they have (no deletion, no lockout of
  past documents); only new invites or shipments are blocked, with an upgrade prompt.

### What paid plans should add first (builder, ranked by effort)

1. Company logo / letterhead on every PDF — Pro and Team.
2. Signature or stamp image on documents (labelled as an image, not a certified e-signature) —
   Pro and Team.
3. Team: unlimited members once Pro is capped at 3.
4. 14-day trial of Pro, no card (the market norm), written server-side as a trial entitlement.

The "Prepared with TradeDocs…" statement on PDFs is the mandatory preparation label (AGENTS.md);
it must stay on every plan and must **never** be sold as "remove branding".

## 2. Rationale versus competitors (sources)

| Competitor         | Entry paid price | Meter                         | Source (retrieved 2026-10-06)                   |
| ------------------ | ---------------- | ----------------------------- | ----------------------------------------------- |
| IncoDocs           | $27 / month      | 30 docs, 1 user; Free 10 docs | <https://www.incodocs.com/pricing>              |
| ovrseas            | $20 / month      | 30 docs, 1 member; no free    | <https://ovrseas.io/pricing>                    |
| Shipping Solutions | $1,199 one-time  | per licence                   | <https://shippingsolutionssoftware.com/pricing> |
| Zoho Invoice       | Free             | 500 invoices/yr, 2 users      | <https://www.zoho.com/us/invoice/pricing/>      |
| Refrens            | Free → premium   | 15 documents total            | <https://www.refrens.com/pricing>               |

## 3. What the owner must confirm

1. **Prices**: Pro $19 / month, $190 / year; Team $49 / month, $490 / year. Edit
   `PROPOSED_PRICES` if different.
2. **Currencies**: USD and EUR, same number. Drop EUR by removing it from `PRICE_CURRENCIES`.
3. **Annual discount**: 2 months free (16.7%) or exactly 20%.
4. **Tax**: whether prices include VAT / sales tax, and whether Stripe Tax is used. The page
   makes no tax claim today.
5. **Refund policy text**, published in the Terms before checkout opens. With checkout open the
   pricing FAQ says "Refunds follow the Terms of service", so the Terms must contain it.
   Suggested starting point for the owner/legal to edit (not legal advice): "You can cancel at
   any time; the plan runs to the end of the period paid. If you ask within 14 days of your
   first payment, we refund it in full."
6. **Pro member cap (3) and the Free limits** in 1 — yes/no; both need builder work first.
7. **Which paid-only feature ships first** — decided (D-021): PDF branding, now built.

## 4. Exact environment to flip

Show the approved prices (no checkout; buttons stay hidden):

```
PRICES_APPROVED=true
```

Open checkout later (RUNBOOK.md, "Opening paid plans"), per plan `<PLAN>` = `PRO` or `TEAM`,
with each Stripe Price equal to the approved amount:

```
PRICE_<PLAN>_AMOUNT=19            # or 190 for a yearly link; must equal the Stripe Price
PRICE_<PLAN>_CURRENCY=USD
PRICE_<PLAN>_INTERVAL=month       # or year
PAYMENT_LINK_<PLAN>_URL=https://buy.stripe.com/...
PAYMENT_LINK_<PLAN>_ID=plink_...
PAYMENT_PROVIDER=stripe
PAYMENT_API_KEY=...               # restricted key
PAYMENT_WEBHOOK_SECRET=...
PAYMENTS_APPROVED=true
ENABLE_PAYMENTS=true
```

Behaviour by state (unit-tested in `tests/unit/billing.test.ts`):

| PRICES_APPROVED | Payments + plan env | Paid plan on /pricing                                 |
| --------------- | ------------------- | ----------------------------------------------------- |
| off (default)   | any                 | "Not available yet", no price, no button (today)      |
| `true`          | not all valid       | Proposed USD + EUR prices, "Checkout is not open yet" |
| `true`          | all valid, open     | The env price, "Upgrade from your workspace"          |

One Payment Link per plan means one interval is buyable per plan at a time; selling both
monthly and yearly needs a second link per plan (a small builder change to `planEnvNames`).
