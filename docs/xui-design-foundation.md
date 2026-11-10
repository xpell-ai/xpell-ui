# XUI Design Foundation

XUI owns the canonical `--x-*` design tokens for browser UI. Component packs such as XDashboard consume these tokens and may add scoped component classes, but they should not define a competing global token system.

## Theme ownership

Themes are applied through the existing XUI theme runtime by setting `data-theme` and `xtheme-*` on the active root. Named CSS themes and inline token maps continue to share the same `xui apply-theme` / `xui set-theme` command path.

Canonical precedence remains:

```text
theme/tokens
component CSS
app class/custom CSS
explicit object style/_style
```

Theme token definitions must not override explicit XUI object `style` or `_style` values.

## Surface and color roles

Use semantic roles rather than component-local colors:

- `--x-bg`, `--x-bg-muted`
- `--x-surface`, `--x-surface-muted`, `--x-surface-elevated`, `--x-surface-overlay`, `--x-input`
- `--x-text`, `--x-text-muted`, `--x-text-subtle`, `--x-text-inverse`
- `--x-primary`, `--x-accent`, `--x-info`, `--x-success`, `--x-warning`, `--x-danger`
- `--x-border`, `--x-border-subtle`, `--x-border-strong`, `--x-focus`

Legacy aliases such as `--x-surface-2`, `--x-card`, `--x-panel`, `--x-toolbar`, `--x-sidebar`, `--x-text-primary`, and `--x-text-secondary` remain valid.

## Typography roles

XUI exposes semantic typography tokens as size, weight, and line-height triples:

- display: `32px / 700 / 1.12`
- page title: `24px / 700 / 1.2`
- page subtitle: `14px / 400 / 1.45`
- section title: `16px / 650 / 1.3`
- section subtitle: `13px / 400 / 1.45`
- title: `14px / 650 / 1.35`
- body: `14px / 400 / 1.5`
- small: `13px / 400 / 1.45`
- caption: `12px / 400 / 1.35`
- label: `12px / 600 / 1.3`

Font-family tokens are `--x-font-sans`, `--x-font-mono`, and `--x-font`.

## Spacing, radius, and elevation

Canonical spacing tokens are:

- `--x-space-1`: `4px`
- `--x-space-2`: `8px`
- `--x-space-3`: `12px`
- `--x-space-4`: `16px`
- `--x-space-5`: `20px`
- `--x-space-6`: `24px`
- `--x-space-8`: `32px`
- `--x-space-10`: `40px`

Existing spacing aliases remain mapped to the scale: `--x-spacing-xs`, `--x-spacing-sm`, `--x-spacing-md`, and `--x-spacing-lg`.

Radius tokens are `--x-radius-sm`, `--x-radius-md`, `--x-radius-lg`, `--x-radius-xl`, and `--x-radius-full`.

Elevation tokens are `--x-shadow-none`, `--x-shadow-xs`, `--x-shadow-sm`, `--x-shadow-md`, and `--x-shadow-lg`. Ordinary product surfaces should default to none or xs; overlays and dialogs can use md or lg.

## Controls and page composition

Control sizing tokens cover small, medium, and large heights plus matching horizontal padding and font sizes:

- `--x-control-height-sm`, `--x-control-height-md`, `--x-control-height-lg`
- `--x-control-padding-x-sm`, `--x-control-padding-x-md`, `--x-control-padding-x-lg`
- `--x-control-font-size-sm`, `--x-control-font-size-md`, `--x-control-font-size-lg`

Page composition tokens cover layout primitives:

- `--x-page-padding-x`, `--x-page-padding-y`
- `--x-page-max-width`, `--x-page-readable-width`
- `--x-section-gap`, `--x-content-gap`
- `--x-toolbar-height`
- `--x-sidebar-width`, `--x-sidebar-width-collapsed`

Page padding is responsive: mobile uses `16px`, tablet uses `24px`, and desktop uses `32px`.

## XDashboard consumption

XDashboard 2026 should consume XUI tokens in this order:

1. Use canonical `--x-*` semantic tokens directly where possible.
2. Define only component-scoped XDashboard aliases when a component needs a local abstraction.
3. Keep application-level overrides scoped to the app root or class.
4. Do not redefine foundational color, typography, spacing, radius, elevation, control, or page tokens globally.

Opt-in XDashboard 2026 themes are:

- `xdashboard-2026-light`
- `xdashboard-2026-dark`
