# Design system

Status: proposed foundation direction; full component library and authenticated/public shells are Task 03 deliverables. Exact shipped tokens/variants must be recorded with that task's evidence.

Proposed owner: Design/Accessibility Lead; named assignment pending. Review on token/component/interaction changes, new document family or template, localization requirements and each visual baseline update; quarterly accessibility regression. Last reviewed: 2026-09-06.

## Product character

Create a precise, calm workspace that makes shipment state, document consistency and next actions easy to understand. Use original typography/layout/assets, generous readable spacing and clear information hierarchy. Avoid copying competitor assets. Distinguish draft, stale, final, superseded, voided, archived and externally endorsed status with text and iconography, never color alone. Always show the underlying legal meaning of constrained preparation outputs.

## Foundation decisions

Use Tailwind with semantic CSS tokens for canvas/surface/text/muted/border/accent/danger/success/focus, spacing, typography, radius and elevation. The implementation must document actual values and contrast checks; this document does not invent tokens absent from code. Prefer an accessible component foundation with native semantic controls and explicit labels. Pin font assets/metrics or use an appropriate system stack to avoid layout shift. Standardize table density, numeric alignment, units, empty values and validation messages.

Task 03 must implement and document buttons, links, fields, select/combobox, checkbox/radio, tables, dialogs, menus, tabs, toasts, skeletons, status/disclosure components and loading/empty/error/success states. Supply public header/footer/mobile navigation, authenticated sidebar/topbar, command/search pattern and print styles. Restrict the component showcase outside production or protect it.

## Interaction and responsive requirements

Target WCAG 2.2 AA: semantic heading order, named fields, associated errors, visible focus, keyboard-only operation, announced asynchronous results, contrast, zoom/reflow and reduced motion. Dialog focus returns to the invoker and cannot become unintentionally trapped. Preserve user inputs through recoverable errors; conflict resolution must show competing revisions rather than overwrite silently. Document actions show specific progress and safe retry affordances.

Verify at 360 px mobile, tablet and large desktop; test current and previous major Chrome, Safari, Firefox and Edge. Stress long multilingual descriptions, international addresses, currencies and labels. Responsive tables preserve access to all data without hiding legal status. Avoid layout shift from fonts/icons and ensure adequate touch targets. Print hides navigation and retains document identity, units, totals and mandatory disclosures.

## Visual acceptance

Task 03 captures visual snapshots for core states at three viewports, automated axe checks and keyboard E2E, followed by actual visual inspection. Task 18 adds all document types at 1/3/10 pages, Unicode/logo/long-table cases, repeated headers, no clipping/orphan totals and non-removable legal labels. Review every changed baseline; do not approve image diffs merely because tests pass. Provide accessible document alternatives where feasible and record limitations accurately.
