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

## Route inventory (2026-10-06)

| Route                                                       | Intent                                                                                                                              | Canonical                           | Index eligibility (when open)                                     | Sitemap | Structured data                                          |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ----------------------------------------------------------------- | ------- | -------------------------------------------------------- |
| `/`                                                         | Product: one shipment, a consistent document set                                                                                    | `/`                                 | Index                                                             | Yes     | Organization, WebSite, FAQPage (visible FAQ)             |
| `/tools`                                                    | Hub: free trade tools                                                                                                               | `/tools`                            | Index                                                             | Yes     | BreadcrumbList                                           |
| `/tools/invoice-generator`                                  | Transactional: commercial invoice template / generator                                                                              | `/tools/invoice-generator`          | Index                                                             | Yes     | BreadcrumbList, SoftwareApplication (free), FAQPage      |
| `/tools/proforma-invoice-generator`                         | Transactional: proforma invoice template (generator preset)                                                                         | `/tools/proforma-invoice-generator` | Index                                                             | Yes     | BreadcrumbList, SoftwareApplication (free), FAQPage      |
| `/tools/packing-list-generator`                             | Transactional: export packing list template (generator preset)                                                                      | `/tools/packing-list-generator`     | Index                                                             | Yes     | BreadcrumbList, SoftwareApplication (free), FAQPage      |
| `/tools/cbm-calculator`                                     | Tool: CBM from carton dimensions; CBM ↔ cubic feet                                                                                  | `/tools/cbm-calculator`             | Index                                                             | Yes     | BreadcrumbList, SoftwareApplication (free), FAQPage      |
| `/tools/chargeable-weight`                                  | Tool: dimensional (volumetric) weight calculator                                                                                    | `/tools/chargeable-weight`          | Index                                                             | Yes     | BreadcrumbList, SoftwareApplication (free), FAQPage      |
| `/tools/landed-cost-calculator`                             | Tool: landed cost from user-entered rates                                                                                           | `/tools/landed-cost-calculator`     | Index                                                             | Yes     | BreadcrumbList, SoftwareApplication (free), FAQPage      |
| `/tools/incoterms`                                          | Reference: Incoterms 2020 chart and all eleven rules compared                                                                       | `/tools/incoterms`                  | Index                                                             | Yes     | BreadcrumbList, FAQPage                                  |
| `/tools/incoterms/[code]` ×11                               | Reference: one rule (exw, fca, cpt, cip, dap, dpu, ddp, fas, fob, cfr, cif)                                                         | `/tools/incoterms/{code}`           | Index; unknown codes 404                                          | Yes     | BreadcrumbList, FAQPage                                  |
| `/guides`                                                   | Hub: guides                                                                                                                         | `/guides`                           | Index                                                             | Yes     | BreadcrumbList                                           |
| `/guides/[slug]` ×3                                         | Guides: lcl-vs-fcl, dap-vs-ddp, proforma-vs-commercial-invoice                                                                      | `/guides/{slug}`                    | Index; unknown slugs 404                                          | Yes     | BreadcrumbList, Article + ImageObject, FAQPage           |
| `/blog`                                                     | Hub: blog posts                                                                                                                     | `/blog`                             | Index                                                             | Yes     | BreadcrumbList                                           |
| `/blog/[slug]` ×5                                           | Posts: commercial-invoice-requirements, proforma-invoice-example, export-documents-checklist, packing-list-for-shipping, fca-vs-fob | `/blog/{slug}`                      | Index; unknown slugs 404                                          | Yes     | BreadcrumbList, Article + ImageObject, FAQPage (visible) |
| `/blog/rss.xml`                                             | RSS 2.0 feed of the posts (summaries)                                                                                               | n/a                                 | Linked via `<link rel="alternate">` on the blog pages             | No      | n/a                                                      |
| `/llms-full.txt`                                            | Full text of guides and posts, with sources, for language-model crawlers                                                            | n/a                                 | Served on every deployment; `X-Robots-Tag` follows the rule above | No      | n/a                                                      |
| `/llms.txt`                                                 | Plain-text site map for language-model crawlers                                                                                     | n/a                                 | Served on every deployment; `X-Robots-Tag` follows the rule above | No      | n/a                                                      |
| `/opengraph-image`                                          | Share card (Manifest palette)                                                                                                       | n/a                                 | n/a                                                               | No      | n/a                                                      |
| `/sign-in` `/sign-up` `/magic-link` `/reset-password(/new)` | Credential flows                                                                                                                    | none                                | Noindex (layout meta + header)                                    | No      | none                                                     |
| `/auth/callback` `/auth/sign-out`                           | Auth route handlers                                                                                                                 | none                                | Noindex header; robots-disallowed                                 | No      | none                                                     |
| `/app/**`                                                   | Tenant workspace                                                                                                                    | none                                | Noindex (layout meta + header); robots-disallowed                 | No      | none                                                     |
| `/invitations/accept`                                       | Single-use invitation                                                                                                               | none                                | Noindex (page meta + header); robots-disallowed                   | No      | none                                                     |
| `/design-system`                                            | Component showcase, production-gated                                                                                                | none                                | Noindex (page meta + header); robots-disallowed                   | No      | none                                                     |
| `/api/**`                                                   | API                                                                                                                                 | none                                | Robots-disallowed; outside the proxy matcher                      | No      | none                                                     |

Sitemap `lastModified` values come from `SITEMAP_PAGES` in `src/lib/seo/site.ts` — the date each page's content last changed, never the request time. Update the date there whenever a page's copy or data changes.

Structured data is emitted by `src/components/seo/json-ld.tsx` from builders in `src/lib/seo/json-ld.ts`. FAQPage is fed the same array the page renders, so it cannot describe a hidden question. SoftwareApplication carries a zero-price offer only because the tools are free; there are no ratings or reviews and none may be added without real ones. The Incoterms guide is a reference page, so it is not marked up as software.

Internal links: every tool page and every Incoterm page ends with the shared related-tools block (`src/components/seo/related-tools.tsx`), built from `PUBLIC_TOOLS`.

## Articles: GEO/AEO structure (2026-10-06)

Guides and blog posts render through one component (`src/components/content/article-view.tsx`) from one data shape (`src/lib/content/article.ts`), so the answer-engine structure is the same everywhere and tested in `tests/unit/posts.test.ts`:

- **Answer first.** A visible "Short answer" of 40–60 words directly under the cover, then "Key facts" (one-line statements that are true on their own and name the entity: ICC, Incoterms® 2020, CBP 19 CFR 141.86, ITA) and "Terms used" (a `<dl>` of definitions).
- **Question headings.** At least three quarters of H2s are the question a reader types; steps are `<ol>`, comparisons are captioned tables.
- **FAQ.** Visible `<details>` and FAQPage JSON-LD from the same array.
- **Dates and authorship.** Published, updated and last-reviewed dates as `<time>`; the byline is "TradeDocs team" and Article `author`/`publisher` is the Organization, named in full.
- **Conversion.** The in-context tool button sits under the short answer (account offer only where accounts are open), a mid-article callout links the matching tool, and `/pricing` is linked only as plain text.
- **Machine-readable copies.** llms.txt lists every guide and post with its short answer; `/llms-full.txt` carries the full text and sources; `/blog/rss.xml` carries the posts.

Posts are added as `src/lib/content/posts/<slug>.ts` and listed in `posts/index.ts` (docs/content/WRITING_BRIEF.md); the sitemap (with cover image), llms.txt, llms-full.txt, the feed and the hub pick them up from there. The `/blog` sitemap date is the newest post's `updated`.

## Images (D-016)

- **Source.** Guide, post and hub covers are Unsplash photos, chosen per page and data in each `src/lib/content/guides/<slug>.ts` and `posts/<slug>.ts` (`cover`) and the folders' `index.ts` (`GUIDES_HUB_COVER`, `BLOG_HUB_COVER`), typed by `src/lib/content/images.ts`. The download event was tracked through the Unsplash API when each photo was chosen; a replacement photo needs its own tracked download.
- **Hotlinked, never re-hosted.** The Unsplash API guidelines require loading the photo from `images.unsplash.com`, so covers are a plain `<img>` with imgix parameters (`w`, `h`, `q=75`, `fm=webp`, `fit=crop`, `auto=format`), a 640/960/1280/1920 `srcset` cropped to 2:1 and `sizes`; not `next/image` and not Vercel image optimization. CSP `img-src` allows `https://images.unsplash.com` and nothing else was widened.
- **Credit.** Every cover shows "Photo by <name> on Unsplash", both links carrying `?utm_source=paydocs&utm_medium=referral` (the registered app name).
- **Performance.** Explicit `width`/`height` reserve the box (no CLS). The cover at the top of a page is `loading="eager" fetchpriority="high"` because it is the likely LCP element; any other use is lazy. All are `decoding="async"`.
- **Alt text.** Describe what the photo shows in the page's own vocabulary (e.g. "Container ship loaded with full container loads at a port terminal in Vietnam"), under about 125 characters, no "image of", no keyword lists, and never a claim the photo does not show.
- **Structured data and sharing.** The guide's Article carries `image` as an ImageObject (1920 px rendition, caption, `creditText`, `creator` Person, `license` https://unsplash.com/license, `acquireLicensePage` the photo page). Guide and hub Open Graph/Twitter images are the cover at 1200 × 630 JPEG; other pages keep `/opengraph-image`.
- **Image sitemap.** `/guides`, `/blog`, each guide and each post list their cover's original URL (no query string, so nothing to escape) in `sitemap.xml`.
- **File names.** Keyword file names do not apply to hotlinked photos (the Unsplash path is fixed). Our own assets keep Next's conventional names (`/opengraph-image`, `/icon.svg`).

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
