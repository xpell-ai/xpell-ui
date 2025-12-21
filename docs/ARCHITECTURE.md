# Xpell UI – Architecture

> **Status:** Alpha (2.0.x)  
> **Audience:** Framework developers, platform builders, server integrators

This document explains the **internal architecture** and **design philosophy** of Xpell UI.
It complements `README.md` and focuses on *why* the system is structured the way it is.

---

## High-level Architecture

Xpell UI is built around a strict separation of concerns:

```
┌────────────────────┐
│     XVMApp         │  ← Declarative App Manifest (DATA)
│  (Application Spec)│
└─────────┬──────────┘
          │
┌─────────▼──────────┐
│        XVM         │  ← Runtime / Navigation / History
│   (View Manager)   │
└─────────┬──────────┘
          │
┌─────────▼──────────┐
│        XUI         │  ← DOM Renderer / Lifecycle
│   (UI Engine)      │
└────────────────────┘
```

This architecture is intentionally **not React-like** and **not MVC**.

Instead:
- **XUI renders**
- **XVM decides**
- **XVMApp describes**

---

## Design Goals

Xpell UI was designed to support:

- AI-generated user interfaces
- Server-driven applications
- Runtime app loading
- Deterministic navigation
- Zero hidden UI state
- Minimal assumptions about the environment

Key principles:

1. **Runtime-first, not build-time**
2. **Everything is data**
3. **Navigation is explicit**
4. **No implicit DOM mutations**
5. **No magic defaults**

---

## Layer Responsibilities

### XUI – Rendering Layer

**Purpose:**  
Render UI objects into the DOM and manage their lifecycle.

XUI responsibilities:
- Create DOM nodes from `XObjectData`
- Mount objects into the DOM
- Handle lifecycle hooks:
  - `onMount`
  - `onShow`
  - `onHide`
- Control visibility (`show`, `hide`, `toggle`)
- Run animations

XUI does **not**:
- Decide which view is active
- Manage navigation or history
- Touch URL or routing state

> XUI is intentionally dumb and predictable.

---

### XUIObject

`XUIObject` is the base unit of rendering.

Key characteristics:
- Maps directly to a DOM element
- Has an explicit lifecycle
- Knows its parent and children
- Maintains visibility state
- Can exist without being visible

Important rule:
> A `XUIObject` may exist without being shown, but a shown object must always be attached.

---

### XVM – View Manager (Runtime)

**Purpose:**  
Manage application flow at runtime.

XVM responsibilities:
- Containers
- Regions
- View stacking
- History management
- Modal behavior
- URL hash synchronization
- App loading (`XVMApp`)

Strict rules enforced by XVM:
- `add()` never shows
- `stack()` is the only method that shows
- `navigate()` is the only method that touches the URL
- One active view per container
- No hidden active views

These rules prevent:
- Orphan DOM nodes
- Invisible overlays
- Inconsistent navigation state

---

## Containers

A **container** is a static `XUIObject` that hosts dynamic views.

Characteristics:
- Exists permanently in the DOM
- Never auto-created (except via app manifest)
- Never auto-hidden
- Holds at most one active view

Example:

```ts
XVM.addContainer(XUI.getObject("region-main"));
```

Containers define *layout*, not behavior.

---

## Regions

A **region** is a named navigation policy bound to a container.

A region defines:
- Which container it controls
- Whether history is enabled
- Whether URL hash sync is enabled

Example:

```ts
XVM.registerRegion("modal", {
  containerId: "region-modal",
  history: true,
  hashSync: false
});
```

Why regions exist:
- Components navigate by semantic intent, not DOM ids
- Modals are first-class citizens
- Multiple navigation contexts can coexist

---

## View Lifecycle (Important)

A view goes through these phases:

1. **Creation**
   - From raw JSON or factory
2. **Attachment**
   - Appended into a container
3. **Show**
   - Becomes visible (XVM-controlled)
4. **Hide**
   - Detached and hidden
5. **History**
   - Optionally stored for reuse
6. **Removal**
   - Fully destroyed (optional)

At no point does XVM:
- Guess visibility
- Leave hidden DOM behind
- Keep multiple active views

---

## Modal Architecture

Modals are not special cases.

They are:
- Regions
- Backed by containers
- Governed by history rules

This avoids:
- Global overlays
- Z-index hacks
- Click-blocking bugs

CSS example:

```css
.region-modal {
  position: fixed;
  inset: 0;
  pointer-events: none;
}

.region-modal.xvm-open {
  pointer-events: auto;
}
```

XVM toggles `xvm-open` automatically.

---

## XVMApp – Application Manifest

`XVMApp` is the declarative description of an application.

It defines:
- App shell (static layout)
- Containers
- Regions
- Views
- Routes
- Router behavior
- Initial navigation

Key idea:
> Apps are **data**, not bundles.

This enables:
- Server persistence
- AI generation
- Runtime loading
- App cloning
- Versioning

---

## Why No Virtual DOM

Xpell UI intentionally avoids a virtual DOM.

Reasons:
- Runtime determinism
- Lower cognitive overhead
- Direct mapping between data and DOM
- Better fit for interpreters and AI systems

DOM is treated as:
> A target, not a state machine.

---

## Why This Matters

This architecture enables:

- Server-driven UI without hydration hacks
- AI systems that generate real apps
- Predictable navigation flows
- Debuggable runtime behavior
- Multi-region SPAs without frameworks

Xpell UI is designed as a **platform**, not a widget library.

---

## Future Directions

Planned next layers:

- Component registry (`_component`)
- Server-side app storage
- SSR + hydration
- Live app editing
- App version migration
- Prompt → App pipelines

---

## Final Note

> **Xpell UI is not trying to replace React.**  
> It solves a different class of problems.

If React is about *rendering*,  
Xpell is about *running applications*.

---
