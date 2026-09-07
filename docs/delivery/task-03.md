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
