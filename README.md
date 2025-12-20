# Xpell UI  
**Declarative Runtime UI Platform for the Web (v2.0-Alpha)**

Xpell UI is the **web runtime** of the Xpell framework — designed to run **applications as data**, not bundles.
It is built for **real-time**, **AI-generated**, and **server-driven** user interfaces using **TypeScript, JavaScript, and native HTML**.

> **Current version:** `2.0.0-alpha.2`  
> **Status:** Alpha — architecture stabilized, APIs evolving

---

## What is Xpell UI?

Xpell UI is not a traditional component framework.

It is a **runtime UI platform** composed of three distinct layers:

- **XUI** – Rendering & lifecycle (DOM engine)
- **XVM** – View Manager (navigation, regions, history)
- **XVMApp** – Declarative application manifest

Together, these enable:

- Runtime-loaded applications
- Server-stored UI definitions
- Deterministic navigation (SPA + modals)
- AI-generated apps and layouts
- High-FPS, real-time interfaces

---

## Core Architecture

```
XVMApp (Application Manifest)
        │
        ▼
XVM (Runtime / Navigation)
        │
        ▼
XUI (DOM Renderer)
```

### Responsibilities

| Layer | Responsibility |
|------|----------------|
| **XUI** | Create DOM elements, mount, lifecycle, animations |
| **XVM** | Navigation, regions, history, routing |
| **XVMApp** | Declarative description of an application |

> XUI renders. XVM decides. XVMApp describes.

---

## What Xpell UI Includes

### ⚡ XUI — Real-Time UI Engine
A low-level DOM engine that:
- Creates native HTML elements
- Manages lifecycle (`onMount`, `onShow`, `onHide`)
- Handles visibility and animations
- Avoids virtual DOMs and diffing

XUI does **not** manage navigation or app state.

---

### 🧭 XVM — Xpell View Manager (NEW)
The application runtime responsible for:

- Containers & regions
- View stacking and history
- SPA navigation
- Modal flows
- URL hash synchronization
- App loading

XVM enforces strict rules:
- `add()` never shows
- `stack()` is the only place that shows
- `navigate()` is the only place that updates URL
- One active view per container

---

### 📦 XVMApp — Declarative App Manifest (NEW)
Applications are now defined as **data**.

An `XVMApp` can describe:
- App shell (layout)
- Containers & regions
- Views (JSON or factories)
- Routes
- Router behavior
- Initial navigation

This enables:
- Server-side app storage
- Runtime loading
- Versioned UI apps
- AI-generated applications

---

## Installation

```bash
npm install xpell-ui
# or
pnpm add xpell-ui
```

---

## Getting Started (Minimal)

```ts
import { _x, XUI, XVM } from "xpell-ui";

_x.start();
_x.loadModule(XUI);

// Create root mount point
XUI.createPlayer("xplayer");

// Add a simple view
XUI.add({
  _type: "label",
  _id: "hello",
  _text: "Hello Xpell"
});
```

For full applications, use **XVMApp** instead of manual wiring.

---

## When to Use Xpell UI

Xpell UI is ideal for:

- Dashboards and admin panels
- Real-time control systems
- AI-generated interfaces
- Server-driven applications
- Visual editors
- Tools requiring deterministic navigation
- Applications that evolve at runtime

If you need **build-time JSX components**, React may be a better fit.

If you need **runtime apps**, Xpell UI is designed for you.

---

## Related Packages

- **xpell-core** – Runtime engine, interpreter, event system
- **xpell-ui** – UI runtime (this package)
- **xpell-3d** – 3D/WebGL engine
- **xpell** – Unified entry point (UI + 3D + AI + sync)

---

## Documentation

- `ARCHITECTURE.md` – Internal architecture & design philosophy
- `README.md` – Overview and usage
- Release notes – See GitHub releases

---

## Alpha Status

This is an **alpha** release:
- APIs may change
- App manifest is stabilizing
- No backward-compatibility guarantees yet

That said:
- **XVMApp is now the foundation**
- Server-side work will target this model

---

## License & Credits

MIT License  
Author: Tamir Fridman  
© Aime Technologies, 2022–Present  
https://xpell.ai
