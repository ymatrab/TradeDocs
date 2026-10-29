# Competitor comparison and paid-plan check (2026-10-27)

Requested by the owner on 2026-10-27: compare TradeDocs with what competitors really offer, so
we charge for a service that is worth it. Competitor facts were read from their live pages on
**2026-10-27**: <https://incodocs.com/pricing> (browser render), <https://ovrseas.io/pricing> and
<https://ovrseas.io/> (WebFetch), <https://shippingsolutionssoftware.com/pricing> (WebFetch).
Anything a page did not state is marked **not stated**. TradeDocs facts come from the code
(`src/lib/billing/plans.ts`, `src/app/(marketing)/tools/`). Earlier rounds:
[competitors-2026-10-06.md](competitors-2026-10-06.md), [pricing-model-2026-10-09.md](pricing-model-2026-10-09.md).

## 1. What changed since 9 October

**ovrseas dropped its document meter.** On 2026-10-09 it sold 30 / 100 / 300 documents a month
at $20 / $60 / $150. On 2026-10-27 it sells:

| Plan        | Price                   | Documents                |
| ----------- | ----------------------- | ------------------------ |
| Free        | $0, no card, no end     | One shipment set a month |
| 1-week pass | $15 once, never renews  | Unlimited for 7 days     |
| Monthly     | $20 / month             | Unlimited                |
| Yearly      | $192 / year ($16/month) | Unlimited                |

Paid adds digital signatures ("type, draw, or upload"), saved exporters/buyers/products, email
support, and removes the "Prepared with ovrseas.io/doc" line. Team members on paid plans,
integrations and an API: **not stated**. Its 12 documents are almost exactly ours (quotation,
purchase order, sales confirmation, sales contract, proforma, commercial invoice, packing list,
certificate of origin, USMCA certificate of origin, shipper's letter of instruction, VGM, bill of
lading), and its tools are CBM, container loading, denied party screening, HS lookup and
Incoterms 2020.

So "no document meter" no longer sets us apart from ovrseas' paid plan. It still does against
IncoDocs.

**IncoDocs is unchanged**: Free 10 docs/month, 1 user; Basic $27 (30 docs, 1 user); Professional
$62 (100 docs, 2 users); Organization $167 (300 docs, 5 users); Organization Plus custom. 14-day
trial, 20% off yearly. New on the page: a $1.2M seed round led by Maersk, and a separately
priced landed-cost product.

**Shipping Solutions is unchanged**: Classic $1,199, Professional $2,999 (one payment + yearly
maintenance), Enterprise $9,999/year. Desktop, US-centric (AES filing, dangerous goods).

## 2. Side by side

| What the customer gets                | TradeDocs Free                                                | TradeDocs Pro $19 / Team $49                  | ovrseas $20 ($16 yearly)   | IncoDocs Basic $27                  |
| ------------------------------------- | ------------------------------------------------------------- | --------------------------------------------- | -------------------------- | ----------------------------------- |
| Documents per month                   | Unlimited                                                     | Unlimited                                     | Unlimited (Free: 1 set)    | 30 (Free: 10)                       |
| Users                                 | Unlimited, with roles                                         | Unlimited                                     | Not stated (Free: 1)       | 1 (2 at $62, 5 at $167)             |
| Saved companies and product catalog   | Yes                                                           | Yes                                           | Paid only                  | Yes                                 |
| Document types                        | 11, certificate of origin gated                               | Same                                          | 12 incl. CoO and USMCA CoO | 30+ templates (CMR, phyto and more) |
| Logo and signature image on PDFs      | No                                                            | Yes                                           | Not stated                 | Yes (letterhead)                    |
| E-signature                           | No                                                            | Built (Dropbox Sign), **off until connected** | Yes                        | Yes                                 |
| QuickBooks / Xero import              | No                                                            | Built, **off until apps are configured**      | Not stated                 | Yes                                 |
| API                                   | No                                                            | Team, **off until configured**                | Not stated                 | Yes (plan not stated)               |
| Revisions locked, stale marking       | Yes                                                           | Yes                                           | Not stated                 | "Version control"                   |
| ZIP of the set with checksum manifest | Yes                                                           | Yes                                           | Not stated                 | Not stated                          |
| Free tools without an account         | 15 (generators, calculators, HS lookup, screening, Incoterms) | —                                             | 5 tools                    | Calculators, templates need account |
| Trial of paid plan                    | —                                                             | None configured                               | Free plan instead          | 14 days                             |
| Short pass                            | —                                                             | No                                            | $15 for 7 days             | No                                  |

## 3. Honest verdict

**The core service is good.** One shipment record drives every document, revisions are locked
and flagged stale, the set downloads as one ZIP, and the free tools are the widest of the three.
On features we match ovrseas and beat it on teams, integrations and the API once they are on.

**But today the paid plans sell very little.** Free already gives unlimited documents, unlimited
users and the saved directory, which is what ovrseas charges $20 for. On the day we launch, with
no provider connected, Pro adds only the logo and signature image. Few businesses will pay $19 a
month for a logo on a PDF when ovrseas gives unlimited documents plus e-signature for $16–20.

**Where we are weaker:** no certificate of origin until the legal review (both competitors have
it, and it is a top search); no USMCA certificate; IncoDocs has 30+ templates and Maersk
backing; we are new, with no reviews; no trial.

## 4. What to do before charging (owner decisions)

1. **Make Pro worth $19 on day one**: connect Dropbox Sign (e-signature) and the Intuit/Xero apps.
   Then Pro = branding + e-signature + accounting import, which is more than ovrseas' paid plan.
2. **Give Free a limit on the saved workspace**, keeping the no-account generators unlimited.
   Example: 3 saved shipments a month on Free, unlimited on Pro. This reverses D-024's "Free stays
   uncapped while early", so it needs your decision; one option is to keep it uncapped for an
   announced early-access period and add the limit with notice.
3. **Give Team a reason to exist**: today members are free on every plan, so Team only adds the
   API. Market practice is seats as the second limit, for example Free 1 user, Pro 3, Team
   unlimited plus the API.
4. **Keep the prices.** $19 sits under ovrseas ($20) and IncoDocs ($27); $190 a year is level with
   ovrseas' $192. Add a 14-day trial on the Payment Links (the webhook already treats a Stripe
   trial as active).
5. **Certificate of origin**: book the legal review; it is the biggest document gap.
6. **Watch ovrseas' $15 week pass.** It answers the occasional exporter; revisit our own pass
   after 60–90 days of pricing-page data, as D-024 planned.
