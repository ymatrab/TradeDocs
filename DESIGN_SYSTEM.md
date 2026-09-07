# Design system

Status: implemented by Task 03. Shipped token values and their measured contrast ratios are recorded below; component variants and states are demonstrated at `/design-system`, which returns 404 in production.

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

## Shipped tokens

Defined in `src/app/globals.css`. Ratios are computed against the two backgrounds every token is
allowed to sit on: `--surface` (`#ffffff`) and `--paper` (`#f5f7fa`). Text tokens meet WCAG 2.2 AA
(4.5:1); the focus ring and control border are non-text and meet 3:1.

| Token       | Value     | Role                                          | On surface | On paper | Meets                                         |
| ----------- | --------- | --------------------------------------------- | ---------- | -------- | --------------------------------------------- |
| `--ink`     | `#152c3e` | Body text, primary action, sidebar ground     | 14.37      | 13.39    | AAA text                                      |
| `--slate`   | `#5b6874` | Captions, hints, units, absent values         | 5.71       | 5.32     | AA text                                       |
| `--rust`    | `#bd4218` | Document identity, box ordinals, active rules | 5.31       | 4.95     | AA text                                       |
| `--link`    | `#17608a` | Inline links                                  | 6.83       | 6.36     | AA text                                       |
| `--danger`  | `#a62424` | Errors, void, destructive actions             | 7.24       | 6.75     | AA text                                       |
| `--success` | `#1f6b45` | Final state, successful outcomes              | 6.47       | 6.03     | AA text                                       |
| `--caution` | `#8a5a00` | Stale state, warnings                         | 5.93       | 5.52     | AA text                                       |
| `--focus`   | `#087ca7` | Focus ring only                               | 4.72       | 4.40     | 3:1 non-text                                  |
| `--control` | `#7d8b98` | Input, select and secondary-button borders    | 3.49       | 3.25     | 3:1 non-text                                  |
| `--rule`    | `#cbd5dd` | Decorative separators and box grid lines      | 1.49       | 1.39     | Decorative; never the sole carrier of meaning |

Reversed pairs used by the authenticated shell: `#ffffff` on `--ink` is 14.37:1, and the sidebar
section caption `#a9b8c5` on `--ink` is 7.08:1.

Type is set in a system grotesque stack (`Arial, Helvetica, sans-serif`) with a monospace stack for
references and codes. No font file is requested, so no text can reflow after first paint. Numeric
contexts set `font-variant-numeric: tabular-nums` so quantities, weights and totals align in a
column.

## Signature primitive: the field box

A bill of lading, a commercial invoice and a certificate of origin are all grids of numbered,
bordered boxes, each captioned in its corner. `BoxGrid` and `FieldBox` reproduce that grid, so the
screen a user fills in and the document they print share one structure and a field can be named by
its box number in either place. The same caption treatment labels tables, panels and shell
sections, which keeps one idea covering the whole product rather than three competing ones.

Status is the second product-specific primitive. Every state carries a word, a glyph and a border
treatment together, so it survives greyscale printing and colour-vision differences; no state is
ever expressed as colour alone.
