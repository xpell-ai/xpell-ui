# xui-codex.md

## XUI — Xpell UI Module (Contract)

XUI is the DOM-backed UI engine for Xpell:
- creates XUIObjects
- mounts/removes DOM nodes
- provides visibility helpers
- manages the UI player root

XUI is **navigation-agnostic**.

---

## Local Codex Rules (XUI Scope)

1. **Do not infer missing APIs**
   - If an XUIObject property, hook, or behavior is not explicitly defined, treat it as unknown.
   - Mark unknown items as TODO, do not invent “magic” defaults.

2. **No silent magic**
   - No implicit navigation, no auto-stacking, no background repairs.
   - Structural actions must be explicit and traceable.

3. **Player creation is explicit**
   - The app (or playground) must explicitly create a player or provide a mount target.
   - If no player exists, XUI may fall back to `document.body` (structural only).

4. **Styling is caller-defined**
   - XUI supports both:
     - external CSS (full apps)
     - inline `style` strings (playground / JSON-first / AI-generated UI)

---

## Two Supported Usage Modes

### Mode A — Standalone / Legacy (No XVM)
Use when you render simple UI directly (banner/toast/debug panel).

- Use `XUI.add()` to create+mount
- Visibility is controlled by the caller via:
  - `obj.show()/hide()/toggle()` or `XUI.show/hide/toggle(id)`
- No stacking/history/regions are involved

> Example: a small banner view that you show/hide manually.

### Mode B — XVM Application Mode
Use when XVM controls screens, regions, containers, history.

- XUI is **structural only**
- XVM is the **only** authority for what is visible

---

## Hard Rules (XVM Mode)

1. `XUI.add()` MUST NOT call `show()` or `onShow()`
2. `XUI.mount()` MUST NOT call `show()` or `onShow()`
3. `XVM.stackInternal()` is the ONLY place allowed to call `target.show()` / `target.onShow()`
4. XUI may call structural hooks (safe):
   - `onMount()` (try/catch)
   - `remove()` (try/catch)
5. XUI must not touch URL/hash/history/regions/containers logic

Result:
- deterministic navigation
- predictable lifecycle
- multi-container safety

---

## Preferred API Usage

### Standalone / Legacy
- `XUI.add(viewData)` and then manually show/hide if needed

### XVM App
- Prefer `XUI.create(...)` when you need to construct without mounting
- Prefer XVM to mount/stack/show via its flow

---

## Recommended Convenience Helpers

### `XUI.createView(...)`
A small helper to make view creation obvious and consistent:

- creates a `{ _type:"view" }` XUIObject
- does not mount
- does not show

(Implementation: wrapper around `XUI.create()`)

Optionally, XVM may add `XVM.createView(...)` / `XVM.ensureView(...)`
if it needs to enforce region/container invariants.
