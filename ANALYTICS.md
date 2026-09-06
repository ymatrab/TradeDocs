# Analytics and consent contract

Status: event design; no collection, consent policy, property or dashboard is claimed implemented.

Proposed owner: Analytics Lead with Privacy and Finance Leads; named assignments pending. Review before event/property changes, consent changes, new identifiers/vendors or revenue policy changes; daily billing reconciliation and weekly funnel review after launch. Last reviewed: 2026-09-06.

## Event catalog

All events are versioned and use allowlisted properties. Common eligible properties: event ID/version, environment/test marker, approved page/tool/document-intent category, coarse attribution, stable pseudonymous actor/session ID and timestamp. Values must never contain names, email addresses, addresses, tax IDs, shipment lines, document numbers/text, private URLs or user-entered free text.

| Event              | Trigger                                              | Additional permitted properties                            | Proposed accountable role  | Classification         |
| ------------------ | ---------------------------------------------------- | ---------------------------------------------------------- | -------------------------- | ---------------------- |
| landing_view       | Eligible public landing renders with allowed consent | Public canonical route category                            | Acquisition owner          | Pseudonymous usage     |
| tool_start         | First meaningful tool interaction                    | Tool type                                                  | Acquisition owner          | Pseudonymous usage     |
| tool_complete      | Valid deterministic tool result                      | Tool type, success category                                | Acquisition owner          | Pseudonymous usage     |
| signup             | Confirmed account creation                           | Entry intent, method category                              | Product analytics owner    | Pseudonymous lifecycle |
| document_preview   | Authorized preview completes                         | Document type, renderer version                            | Product analytics owner    | Pseudonymous usage     |
| checkout_start     | Server creates checkout attempt                      | Catalog plan/price reference, currency                     | Finance analytics owner    | Commercial metadata    |
| purchase_confirmed | Verified committed payment fact                      | Opaque order dedupe reference, minor-unit amount, currency | Finance analytics owner    | Restricted commercial  |
| document_download  | Authorized artifact delivery                         | Document type, delivery category                           | Product analytics owner    | Pseudonymous usage     |
| email_sent         | Provider accepts deduplicated delivery               | Template version, notification category                    | Operations analytics owner | Operational metadata   |
| return_session     | Defined returning authenticated session              | Cohort period                                              | Product analytics owner    | Pseudonymous usage     |

Approve exact identity/session/cohort definitions and retention before implementation. Internal finance records are the revenue source of truth. Send to GA4 only consent-eligible fields/events; internal operational purposes and retention need their own documented privacy basis. Consent denial must leave product and purchase workflows functional. Do not use trade fields as attribution or event properties.

## Metrics and reconciliation

- Acquisition: eligible landing sessions → tool starts → completions → signup by public landing/tool intent.
- Activation: organizations with first valid shipment and coherent finalized set; time from verified signup.
- Commercial: checkout → verified paid order, reconciled revenue/refunds/disputes by currency. Do not sum unlike currencies without an approved conversion policy.
- Retention: eligible organizations creating second/subsequent shipments using saved entities and retrieving prior artifacts, by documented cohort.
- Reliability: per-type generation/set success, retry latency, email delivery and user-facing failure categories from operational stores.

Deduplicate purchase events by immutable order identity; redirects and client clicks are not purchase confirmation. Finance owns daily provider/database/product-event reconciliation and review of differences. Mark sandbox traffic and exclude it from production commercial reporting. Instrumentation tests must scan payloads for sensitive data and prove consent-denied/granted behavior and duplicate suppression. Schema-breaking changes require versioning and migration notes. Experiments need a declared metric, guardrails and stopping rule before rollout.
