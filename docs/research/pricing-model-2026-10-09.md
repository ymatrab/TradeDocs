# Pricing model research: per document vs subscription (2026-10-09)

Requested by the owner on 2026-10-09: compare TradeDocs with competitors on service and price,
and research whether to charge per document (one payment) or by subscription. Competitor figures
were re-read from their live pricing pages on 2026-10-09; market studies are cited with their
limits. TradeDocs prices are the unapproved proposal (P-002).

## 1. Competitor prices, re-checked 2026-10-09

| Product                                                                                                     | Model                              | Entry paid                                    | Mid                                   | Top                               | Document cap                    | Users                        | Per-document option                               |
| ----------------------------------------------------------------------------------------------------------- | ---------------------------------- | --------------------------------------------- | ------------------------------------- | --------------------------------- | ------------------------------- | ---------------------------- | ------------------------------------------------- |
| [IncoDocs](https://www.incodocs.com/pricing)                                                                | Monthly/yearly subscription        | Basic $27/mo                                  | Professional $62/mo                   | Organization $167/mo; Plus custom | 10 free, 30 / 100 / 300 a month | 1 / 1 / 2 / 5                | None stated                                       |
| [ovrseas](https://ovrseas.io/pricing)                                                                       | Monthly/yearly subscription        | Starter $20/mo ($192/yr per FAQ)              | Pro $60/mo                            | Business $150/mo                  | 30 / 100 / 300 a month          | 1 / 3 / 5                    | None: documents pause at the cap until reset      |
| [Shipping Solutions](https://shippingsolutionssoftware.com/pricing)                                         | One payment + yearly maintenance   | Classic $1,199 (+$300/yr from yr 2)           | Professional $2,999 (+$900/yr)        | Enterprise $9,999 per year        | None (per licence)              | $600–1,500 per extra licence | Licence, not per document                         |
| [customs-declarations.uk](https://www.customs-declarations.uk/faqs/pricing/) (adjacent: UK customs filings) | Pay as you go **and** subscription | Up to £25 per CDS declaration, no monthly fee | Subscriptions from £75/mo (50 a year) | £1,400/mo (10,000 a year)         | —                               | —                            | **Yes**: PAYG per declaration; bulk plans cheaper |

Notes: IncoDocs shows "Save 20%" yearly but no yearly figures; its sign-up link says a 7-day
trial while plan cards say 14 days. ovrseas lists the same number for monthly and yearly but its
FAQ gives Starter at $192 a year ($16 a month).

Effective price per document at each competitor's cap: IncoDocs $0.90 (Basic) to $0.56
(Organization); ovrseas $0.67 (Starter) to $0.50 (Business). A TradeDocs shipment yields 3–4
documents, so a 30-document cap is roughly 8–10 shipments a month.

No trade-document competitor found sells documents one at a time. The only pay-per-use precedent
is in customs filing, where a declaration is a discrete, high-value, irregular event.

## 2. What the pricing-model research says

- Growth Unhinged 2025 State of B2B Monetization (240+ software companies, April–May 2025):
  flat-fee subscriptions fell from 29% to 22% and seat pricing from 21% to 15% in a year;
  hybrid (subscription plus a usage element) rose from 27% to 41%. Companies under $5,000 ACV
  publish prices online. <https://www.growthunhinged.com/p/2025-state-of-b2b-monetization>
- Churn by model: no independent study isolates small businesses. Secondary benchmarks disagree
  (one puts usage-based at 3.8% monthly churn vs 5.9% monthly subscriptions vs 1.7% annual
  contracts; another puts usage-based at 6.8%). The consistent finding is that **annual
  contracts churn least**, and usage customers "churn soft" by using less.
- Credits/packs grew fast in 2025 (companies using credit models 35 → 79, PricingSaaS via
  secondary sources), mostly in AI products; commentators call them a workaround.

Evidence quality: vendor blogs and secondary summaries dominate; treat percentages as
directional.

## 3. What this means for TradeDocs

1. **Single documents are already free.** The invoice, proforma, packing list and delivery note
   generators need no account. Charging per document would charge for what the free tools give
   away; the paid value is the workspace (saved shipments, consistent sets, revisions, team) and
   PDF branding.
2. **Subscription is the market norm** for this exact product, and buyers comparing IncoDocs and
   ovrseas expect it. Our "no document cap" is the clearest difference; a per-document price
   would reintroduce the meter we beat them on.
3. **Irregular exporters are real** (customs PAYG exists for them). The answer for them is a
   cheap yearly plan or an occasional one-off pack, not per-document billing.
4. **Build cost:** today the Stripe webhook only grants subscriptions (`mode !== 'subscription'`
   is ignored in `src/lib/billing/stripe-events.ts`). A one-off pack needs a credit ledger,
   one-time-payment webhook handling, metering at document finalization and refund rules:
   medium work plus legal text.

## 4. Recommendation

- **Launch with subscription only**: Pro $19/mo or $190/yr; Team $49/mo or $490/yr; Free stays
  uncapped while early. Push the yearly plan (lowest churn; $190 is level with ovrseas
  Starter's $192 with no 30-document cap).
- **Do not sell per document.**
- **Revisit after 60–90 days of real traffic:** if pricing-page data shows occasional exporters
leaving, add one hybrid option, e.g. a one-time "branded shipment pack" (one shipment's full
set with logo and signature), priced from data then. Owner decision; not built.
</content>

</invoke>
