# Visual Xpell Inspector Capabilities

Visual Xpell composes reusable inspector capabilities through the existing
`_skill` / `_design` metadata contract.

## Capability Declaration

XUI object skills opt in with `_capabilities`:

```json
{
  "_capabilities": ["typography", "spacing", "layout", "appearance"]
}
```

Reusable capability fields are owned by Visual Xpell and map to canonical XUI
style data:

```json
{
  "_style": {
    "width": "320px",
    "margin-top": "16px",
    "font-size": "24px",
    "font-weight": "600",
    "display": "flex",
    "gap": "12px",
    "background-color": "#f8fafc",
    "border": "1px solid #cbd5e1",
    "border-radius": "8px",
    "box-shadow": "0 4px 12px rgba(15, 23, 42, 0.16)"
  }
}
```

Inspector field metadata uses `_key: "_style.<css-property>"` for stable control
identity and `_style_path: "<css-property>"` for persistence. It does not create
root runtime properties such as `_font_size`, `_width`, `_margin`,
`_background_color`, `_border_radius`, or `_opacity`.

## Typography Capability

Typography exposes:

- `font-size`
- `font-weight`
- `font-family`
- `line-height`
- `color`
- `text-align`
- `letter-spacing`
- `font-style`
- `text-decoration`

## Spacing Capability

Spacing exposes:

- `margin`
- `margin-top`
- `margin-right`
- `margin-bottom`
- `margin-left`
- `padding`
- `padding-top`
- `padding-right`
- `padding-bottom`
- `padding-left`
- `gap`
- `row-gap`
- `column-gap`

## Layout Capability

Layout exposes:

- `width`
- `height`
- `min-width`
- `min-height`
- `max-width`
- `max-height`
- `display`
- `flex-direction`
- `flex-wrap`
- `justify-content`
- `align-items`
- `align-self`
- `overflow`
- `position`
- `top`
- `right`
- `bottom`
- `left`

## Appearance Capability

Appearance exposes:

- `background-color`
- `border`
- `border-width`
- `border-style`
- `border-color`
- `border-radius`
- `opacity`
- `box-shadow`

Typography owns text `color`; Appearance does not duplicate it. Visual Xpell
currently uses the existing text/value inspector control for CSS color values
because the inspector input contract does not include a dedicated color picker.
`border-style` uses a select control.

## Composition

Resolved inspector fields are composed as:

```text
object-specific _skill._design._inspector._fields
+
reusable capability fields declared by _skill._capabilities
```

Object-specific fields are resolved first and reusable capability fields are
appended after them. When an object-specific field and a capability field use
the same `_key`, object-specific metadata wins while capability defaults such as
`_style_path` remain available unless explicitly replaced.

## Persistence

Capability field edits use XVibe structured style edits:

- non-empty values use `apply-view-edit` with `_edit_action: "set-style"`
- cleared values use `apply-view-edit` with `_edit_action: "remove-style"`

Existing `_style` entries are preserved when a single capability property is
changed. Visual Xpell arrange mode currently persists structural reordering with
`move-object`; it does not use a competing width/height/top/left representation.

CSS shorthand and longhand properties are preserved as authored. For example,
`border`, `border-width`, `border-style`, and `border-color` are separate
canonical `_style` keys. Visual Xpell writes only the changed key and does not
normalize, expand, reorder, or erase neighboring border properties; browser CSS
cascade rules determine the effective rendered border.
