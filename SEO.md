# Search and editorial contract

Status: indexing built correct-by-config and **closed** (D-007). Every public page is ready to index, but robots.txt, the `robots` meta and `X-Robots-Tag` only open once `isIndexable()` (`src/lib/http/base-url.ts`) is true: `APP_ENV=production`, `APPLICATION_MODE=service` and `APP_URL` on a custom domain (never `*.vercel.app`). Search Console and IndexNow are not configured. Last updated: 2026-10-05.

## How indexing is decided

| Mechanism                                                                         | Closed (today)                        | Open (`isIndexable()` true)                                                                                                                                                         |
| --------------------------------------------------------------------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `robots.txt` (`src/app/robots.ts`)                                                | `Disallow: /`                         | `Allow: /`, disallows `/app/ /auth/ /api/ /invitations/ /design-system`, links the sitemap                                                                                          |
| Root `robots` meta (`src/app/layout.tsx`)                                         | `noindex, nofollow, nocache`          | `index, follow`; app, auth, invitation and design-system pages keep an explicit `noindex` of their own                                                                              |
| `X-Robots-Tag` (`src/proxy.ts` → `robotsHeaderFor` in `src/lib/http/indexing.ts`) | `noindex, nofollow` on every page     | Sent only on private paths: `/app /auth /sign-in /sign-up /magic-link /reset-password /invitations /design-system /api`                                                             |
| Host canonicalisation (`canonicalHostRedirect`)                                   | No redirect                           | On a **production** deployment with a custom `APP_URL`, any `*.vercel.app` host or the production alias 308s to `APP_URL` + path + query. Preview deployments are never redirected. |
| Canonicals, sitemap URLs, Open Graph URLs, JSON-LD URLs, llms.txt links           | Resolved against `getPublicBaseUrl()` | Same; `APP_URL` is the canonical origin                                                                                                                                             |

The decision functions are pure and unit-tested in `tests/unit/indexing.test.ts`.

## Route inventory (2026-10-05)

| Route                                                       | Intent                                                                      | Canonical                  | Index eligibility (when open)                                     | Sitemap | Structured data                                     |
| ----------------------------------------------------------- | --------------------------------------------------------------------------- | -------------------------- | ----------------------------------------------------------------- | ------- | --------------------------------------------------- |
| `/`                                                         | Product: one shipment, a consistent document set                            | `/`                        | Index                                                             | Yes     | Organization, WebSite, FAQPage (visible FAQ)        |
| `/tools`                                                    | Hub: free trade tools                                                       | `/tools`                   | Index                                                             | Yes     | BreadcrumbList                                      |
| `/tools/invoice-generator`                                  | Transactional: free commercial invoice / proforma / packing PDF             | `/tools/invoice-generator` | Index                                                             | Yes     | BreadcrumbList, SoftwareApplication (free), FAQPage |
| `/tools/cbm-calculator`                                     | Tool: CBM from carton dimensions                                            | `/tools/cbm-calculator`    | Index                                                             | Yes     | BreadcrumbList, SoftwareApplication (free), FAQPage |
| `/tools/chargeable-weight`                                  | Tool: volumetric vs actual weight                                           | `/tools/chargeable-weight` | Index                                                             | Yes     | BreadcrumbList, SoftwareApplication (free), FAQPage |
| `/tools/incoterms`                                          | Reference: all eleven Incoterms 2020 rules compared                         | `/tools/incoterms`         | Index                                                             | Yes     | BreadcrumbList (FAQPage pending, see below)         |
| `/tools/incoterms/[code]` ×11                               | Reference: one rule (exw, fca, cpt, cip, dap, dpu, ddp, fas, fob, cfr, cif) | `/tools/incoterms/{code}`  | Index; unknown codes 404                                          | Yes     | BreadcrumbList                                      |
| `/llms.txt`                                                 | Plain-text site map for language-model crawlers                             | n/a                        | Served on every deployment; `X-Robots-Tag` follows the rule above | No      | n/a                                                 |
| `/opengraph-image`                                          | Share card (Manifest palette)                                               | n/a                        | n/a                                                               | No      | n/a                                                 |
| `/sign-in` `/sign-up` `/magic-link` `/reset-password(/new)` | Credential flows                                                            | none                       | Noindex (layout meta + header)                                    | No      | none                                                |
| `/auth/callback` `/auth/sign-out`                           | Auth route handlers                                                         | none                       | Noindex header; robots-disallowed                                 | No      | none                                                |
| `/app/**`                                                   | Tenant workspace                                                            | none                       | Noindex (layout meta + header); robots-disallowed                 | No      | none                                                |
| `/invitations/accept`                                       | Single-use invitation                                                       | none                       | Noindex (page meta + header); robots-disallowed                   | No      | none                                                |
| `/design-system`                                            | Component showcase, production-gated                                        | none                       | Noindex (page meta + header); robots-disallowed                   | No      | none                                                |
| `/api/**`                                                   | API                                                                         | none                       | Robots-disallowed; outside the proxy matcher                      | No      | none                                                |

Sitemap `lastModified` values come from `SITEMAP_PAGES` in `src/lib/seo/site.ts` — the date each page's content last changed, never the request time. Update the date there whenever a page's copy or data changes.

Structured data is emitted by `src/components/seo/json-ld.tsx` from builders in `src/lib/seo/json-ld.ts`. FAQPage is fed the same array the page renders, so it cannot describe a hidden question. SoftwareApplication carries a zero-price offer only because the tools are free; there are no ratings or reviews and none may be added without real ones. The Incoterms hub has a visible FAQ, but the content agent is moving that data into `src/lib/trade/incoterms.ts`; wire FAQPage to that export once it exists. The Incoterms guide is a reference page, so it is not marked up as software.

Internal links: every tool page and every Incoterm page ends with the shared related-tools block (`src/components/seo/related-tools.tsx`), built from `PUBLIC_TOOLS`.

## Go-live checklist (owner, in order)

1. Buy the domain and attach it to the Vercel project (production). Decide apex or `www`; set the other to redirect in Vercel's domain settings.
2. Set `APP_URL=https://<the domain>` in the production environment only. Do not set it on preview.
3. Set `APP_ENV=production` and `APPLICATION_MODE=service` (with the service-mode configuration it requires), then redeploy production.
4. Verify on the custom domain: `/robots.txt` allows and links `/sitemap.xml`; `/sitemap.xml` lists only custom-domain URLs; a public page has no `X-Robots-Tag` and `index, follow` meta; `/sign-in` still returns `X-Robots-Tag: noindex, nofollow`; `https://<project>.vercel.app/tools` answers 308 to the custom domain; a preview URL still serves `noindex` and `Disallow: /`.
5. Validate a tool page and the home page in Google's Rich Results Test; check the share card in a social debugger.
6. Verify the domain property in Google Search Console (DNS TXT), submit `https://<domain>/sitemap.xml`, and request indexing for `/` and `/tools`. Record the property owner and recovery contact here.
7. Later: Bing Webmaster Tools (import from Search Console) and IndexNow with the real `INDEXNOW_KEY`, submitting only changed canonical URLs.

Proposed owner: SEO/Editorial Lead with Legal Reviewer; named assignments pending. Review for any new/removed route, canonical/redirect change, template or structured-data change, regulatory copy change and release; monthly content decay review. Last reviewed: 2026-09-06.

## Route inventory policy

Final route names are set during Tasks 09/22. Every built route must be inventoried with intent, canonical, index eligibility, sitemap membership, content owner and review date.

| Planned route family                                                                    | Indexation contract                                                                |
| --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Product, document/template, functioning free generator/calculator                       | Eligible only with unique substantive value and accurate capability claims         |
| Workflow hubs, glossary, Incoterms topics, guides, help                                 | Eligible after editorial/source review; no thin generated country/port/HS pages    |
| Pricing, security, approved legal/trust pages                                           | Eligible when actual policies/capabilities are approved and visible                |
| Auth, workspace, billing, admin, private shipment/document preview                      | Noindex and absent from sitemap; authentication protects data                      |
| Expiring share links, anonymous drafts, filters, search parameters, duplicate templates | Noindex, excluded from sitemap and IndexNow; private values excluded from metadata |
| Preview/staging/component showcase                                                      | Noindex with appropriate access/deployment protections                             |

Robots directives are not authorization. Never include customer IDs, document text or trade values in public metadata, OpenGraph, canonical URLs or search previews. Use meaningful server-rendered public content, correct canonical links, breadcrumbs, redirects, 404/410 behavior and sitemap indexes. Structured data must match visible content; do not fabricate ratings, testimonials or functionality.

## Publishing workflow

Each indexed page needs unique intent, a functioning tool/template or substantive guide, accountable editorial owner, accurate source/review metadata and purposeful links to the saved workspace. Guides link to useful tools; tools explain saved reuse without misleading promises. High-risk copy requires the registry approval in [LEGAL.md](LEGAL.md). Verify broken links, mobile accessibility, structured data, canonicals, robots and sitemap membership with a built-route crawler before publishing.

## Provider operations and measurement

Task 09 must document verified production domain ownership in Google Search Console, submission/access review and recovery. IndexNow must use the actual configured key and only enqueue changed eligible canonical URLs, with deduplication, bounded retries and rate control. Never submit preview/private URLs. Task 22 must validate full-route factual metadata and Core Web Vitals budgets (p75 LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1), linking performance evidence to landing/tool/document-intent funnels. Search setup is pending until verified against real approved properties.
