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
allowed to sit on: `--surface` (`#ffffff`) and `--paper` (`#f6f8fa`). Text tokens meet WCAG 2.2 AA
(4.5:1); the focus ring and control border are non-text and meet 3:1.

| Token       | Value     | Role                                          | On surface | On paper | Meets                                         |
| ----------- | --------- | --------------------------------------------- | ---------- | -------- | --------------------------------------------- |
| `--ink`     | `#0d1f2b` | Body text, primary action, sidebar ground     | 16.83      | 15.81    | AAA text                                      |
| `--slate`   | `#54646f` | Captions, hints, units, absent values         | 6.12       | 5.75     | AA text                                       |
| `--rust`    | `#c2410c` | Document identity, box ordinals, active rules | 5.18       | 4.86     | AA text                                       |
| `--link`    | `#0e6ba8` | Inline links                                  | 5.70       | 5.35     | AA text                                       |
| `--danger`  | `#a62424` | Errors, void, destructive actions             | 7.24       | 6.75     | AA text                                       |
| `--success` | `#1f6b45` | Final state, successful outcomes              | 6.47       | 6.03     | AA text                                       |
| `--caution` | `#8a5a00` | Stale state, warnings                         | 5.93       | 5.52     | AA text                                       |
| `--focus`   | `#0e7fb5` | Focus ring only                               | 4.45       | 4.18     | 3:1 non-text                                  |
| `--control` | `#7d8b98` | Input, select and secondary-button borders    | 3.49       | 3.25     | 3:1 non-text                                  |
| `--rule`    | `#dfe5ea` | Decorative separators and box grid lines      | 1.27       | 1.19     | Decorative; never the sole carrier of meaning |

Reversed pairs used by the authenticated shell: `#ffffff` on `--ink` is 16.83:1, and the sidebar
section caption `#a9b8c5` on `--ink` is 8.32:1.

### The reversed ground

Public pages open on `--canvas` (`#0b1b26`), a marine near-black carrying a low-opacity amber and
blue wash. Against it: white 17.51, `--canvas-muted` (`#9db3c0`) 8.04, `--amber` (`#f0a02a`) 8.15.

`--amber` is a **reversed-ground token only**. It measures 2.15 against white and 2.02 against
paper, so it fails as text on any light surface; `--rust` is the accent that belongs there. The
constraint is structural rather than remembered — `--amber` is referenced only inside `.hero`,
which sets the canvas as its own background.

A reversed marketing section redefines the text tokens rather than patching one selector at a time,
so a component placed on that ground inherits legible values instead of rendering slate on navy.
Background roles (`--rust`, `--danger`, `--success`) are deliberately not redefined: they sit behind
white text, and lightening them would break it.

| Token on `--ink` | Value                     | Role                              | Ratio | Meets        |
| ---------------- | ------------------------- | --------------------------------- | ----- | ------------ |
| `--slate`        | `#a9b8c5`                 | Captions, hints, secondary prose  | 7.08  | AA text      |
| `--link`         | `#8fc7e8`                 | Inline links                      | 7.87  | AA text      |
| `--control`      | `#7f929f`                 | Input and secondary-button border | 4.46  | 3:1 non-text |
| `--rule`         | `rgb(255 255 255 / 0.22)` | Decorative separators             | —     | Decorative   |

Every control darkens on `:active`, because a tap has to answer before the server does. The pressed
grounds are measured against the text they carry.

| Token               | Value     | Carries        | Ratio |
| ------------------- | --------- | -------------- | ----- |
| `--ink-pressed`     | `#0c1d29` | `#ffffff` text | 17.17 |
| `--danger-pressed`  | `#741818` | `#ffffff` text | 11.13 |
| `--rust-pressed`    | `#7d2b0d` | `#ffffff` text | 9.45  |
| `--surface-pressed` | `#e2e8ee` | `--ink` text   | 11.64 |

Body text is set in a system grotesque stack (`Arial, Helvetica, sans-serif`), with a monospace
stack for references and codes, so no font file stands between the reader and the words. Headings
use Archivo, self-hosted at build time by `next/font` with a size-matched fallback and
`font-display: swap`; the fallback is metric-matched, so the swap costs no layout shift. Numeric
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
ever expressed as colour alone. Two lifecycles use it: documents (draft, stale, final, superseded,
voided, archived, endorsed) and shipments (draft, confirmed, shipped, closed). A value the schema
has grown but the interface has not been taught renders as itself, marked unrecognised, rather than
being silently drawn as something it is not.

The meaning of a state travels in two forms — a `title` a pointer can reveal, and text only
assistive technology reads. `title` alone reaches neither a keyboard nor a touch screen, so it is
never the only copy.

## Navigation below the sidebar breakpoint

The authenticated sidebar is a wide-screen affordance, not the navigation itself. Under 900 px it is
replaced by a topbar disclosure carrying the same destinations, the account links and sign-out, so no
page of the workspace becomes unreachable on a phone. Both disclosures close on navigation, on
Escape — which returns focus to the control that opened them — and on a pointer landing outside.

Destructive actions confirm before they act, and the confirmation stays open until the action has
actually succeeded: a rejected password or a refused removal keeps the user's input where they can
correct it, instead of dropping them onto a page-level message with nothing left to edit.
