# Task 03 — Design system and application shell

Source: `TradeDocs_Production_Build_Plan.pdf` page 9. Dependencies: Tasks 01–02.
Execution constraint: **no local runs**; every gate below is executed in GitHub Actions only.

## Acceptance criteria → implementation → evidence

| Acceptance criterion                                                    | Implementation                                                                                                                                                                                                          | Evidence                                                                 |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| All foundational components render at mobile/tablet/desktop breakpoints | Token system in `src/app/globals.css`; primitives in `src/components/primitives`; showcase route `/design-system` renders every component and state                                                                     | `design-system.spec.ts` screenshots at 360/768/1440                      |
| Keyboard and screen-reader labels work; focus never becomes trapped     | Native semantic controls; labelled fields with `aria-describedby` error/hint wiring; dialog via native `<dialog>` so focus returns to the invoker; roving tabindex tabs; Escape closes menu, dialog and command palette | `design-system.spec.ts` keyboard traversal and dialog focus-return cases |
| No layout shift from icons/fonts; print styles hide navigation          | System font stack only, no web font requests; every icon has explicit width/height; `@media print` hides navigation and shells                                                                                          | `design-system.spec.ts` print emulation and CLS assertions               |
| Design decisions and tokens are documented                              | `DESIGN_SYSTEM.md` records shipped token values with measured contrast ratios                                                                                                                                           | `DESIGN_SYSTEM.md` contrast table                                        |

## Required tests

| Requirement                                                                                     | Where                                                                                                                                                               |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| format, lint, strict typecheck, unit, integration, production build, zero unexplained warnings  | `Quality gates` workflow                                                                                                                                            |
| Playwright happy path, validation failure, authorization failure, retry/reload, mobile viewport | `tests/e2e/design-system.spec.ts`, `tests/e2e/foundation.spec.ts`                                                                                                   |
| Automated axe checks on affected pages                                                          | `design-system.spec.ts` axe runs on `/` and `/design-system`                                                                                                        |
| Visual snapshots for core states at three viewports                                             | `design-system.spec.ts` screenshot artifacts, inspected before completion                                                                                           |
| Keyboard navigation E2E                                                                         | `design-system.spec.ts`                                                                                                                                             |
| Tenant isolation for every new data path                                                        | Not applicable: Task 03 introduces no data path. Authorization failure is covered by the production gating of `/design-system`. Tenant isolation begins at Task 04. |

## Scope boundary

Task 03 delivers presentation only. No database, authentication, tenant data or customer capability is introduced; `APPLICATION_MODE` stays `foundation`. The showcase route is not customer-facing and returns 404 when `APP_ENV=production`.

## Evidence

Verification ran entirely in GitHub Actions; the no-local-runs instruction stayed in force and no
application, browser or build was started on the developer machine.

| Item | Result |
| --- | --- |
| Gate run | [34069861800](https://github.com/ymatrab/TradeDocs/actions/runs/34069861800) — all gates green |
| Playwright | 61 tests passed across chromium, firefox, webkit and the mobile project |
| Accessibility | axe (wcag2a, wcag2aa, wcag21aa, wcag22aa) clean on `/` and `/design-system` |
| Visual reference | `test-results/visual/*.png` at 360, 768 and 1440 for both routes; downloaded and inspected |
| Contrast | Every shipped token measured and recorded in `DESIGN_SYSTEM.md` |

### Defects found and fixed during verification

| Defect | Cause | Fix |
| --- | --- | --- |
| Showcase route returned 404 everywhere | `src/app/_design` is a private folder: the App Router excludes underscore-prefixed directories from routing | Route renamed to `/design-system` |
| Print test failed in all four engines | The assertion matched the closed dialog's copy of the invoice reference, which is correctly hidden | Assertion scoped to the field-box grid and widened to identity, units, totals and the mandatory disclosure |
| Unfilled box-grid row rendered a stray grey panel | `gap` over a rule-coloured background paints the gap wherever a cell is missing | Each box carries its own rule as a shadow; neighbouring rules meet in the gap and an unfilled row leaves nothing behind |
| Headline orphaned a single word at tablet width | Measure was set to 18ch | Widened to 24ch |

### Known limitations

The command trigger prints `Ctrl K` on every platform. Detecting the platform during render would
cause a hydration mismatch, and the shortcut itself already accepts both Meta and Control. A
platform-aware label belongs with the first task that ships the real search behaviour.

Task 03 delivers presentation only; no data path, tenant boundary or customer capability exists yet,
so the deployment stays in `APPLICATION_MODE=foundation`.
