# @xpell/ui

Xpell 2 Alpha --- Real-Time Runtime UI Framework

`@xpell/ui` is the browser-based UI runtime of the Xpell 2 platform.

It is designed for structured, runtime-driven applications where
interfaces can be loaded, mutated, and evolved without rebuild cycles.
Unlike traditional build-time component frameworks, Xpell UI executes
applications as structured runtime data.

This package works together with:

-   `@xpell/core` --- runtime contracts and execution engine
-   `@xpell/node` --- server runtime (xnode, Wormholes, XDB)
-   `@xpell/3d` --- spatial runtime layer

> This package is part of the Xpell 2 Alpha platform.\
> Learn more at https://xpell.ai

------------------------------------------------------------------------

## Core Architecture

Xpell UI is composed of three layers:

XVMApp (Application Manifest) │ ▼ XVM (Runtime / Navigation) │ ▼ XUI
(DOM Renderer)

### Responsibilities

-   **XUI** → Rendering & lifecycle (DOM engine)
-   **XVM** → Navigation, regions, history, routing
-   **XVMApp** → Declarative application description

XUI renders.\
XVM decides.\
XVMApp describes.

------------------------------------------------------------------------

## What @xpell/ui Provides

### XUI --- Real-Time DOM Engine

-   Creates native HTML elements
-   Manages lifecycle (`onMount`, `onShow`, `onHide`)
-   Controls visibility and transitions
-   Avoids virtual DOM and diffing

XUI does not manage navigation or global application state.

------------------------------------------------------------------------

### XVM --- View Manager

-   Container & region management
-   Deterministic SPA navigation
-   View stacking and history
-   Modal flows
-   URL synchronization
-   Runtime app loading

XVM enforces strict runtime rules: - `add()` does not show views -
`stack()` controls visibility - `navigate()` controls URL - One active
view per container

------------------------------------------------------------------------

### XVMApp --- Declarative App Manifest

Applications are defined as structured data.

An `XVMApp` can describe:

-   App shell layout
-   Containers and regions
-   Views (JSON or factories)
-   Routes
-   Router behavior
-   Initial navigation

This enables:

-   Server-stored UI definitions
-   Runtime loading
-   Versioned applications
-   AI-generated interfaces
-   Vibe coding workflows

------------------------------------------------------------------------

## Installation (Alpha)

npm install @xpell/ui@alpha

Typically combined with:

npm install @xpell/core@alpha\
npm install @xpell/node@alpha

Alpha builds are intentionally not published under the `latest` tag.

------------------------------------------------------------------------

## Minimal Example

``` ts
import { _x, XUI, XVM } from "@xpell/ui";

_x.start();
_x.loadModule(XUI);

XUI.createPlayer("xplayer");

XUI.add({
  _type: "label",
  _id: "hello",
  _text: "Hello Xpell"
});
```

For full applications, use `XVMApp` instead of manual wiring.

------------------------------------------------------------------------

## When to Use @xpell/ui

Ideal for:

-   Dashboards and admin systems
-   Real-time control panels
-   AI-generated interfaces
-   Server-driven applications
-   Visual builders and editors
-   Systems requiring deterministic navigation
-   Applications that evolve at runtime

If you need build-time JSX components and compile-time tooling, other
frameworks may be more suitable.

If you need runtime-native applications, Xpell UI is designed for that
model.

------------------------------------------------------------------------

## Architecture Role in Xpell 2

Xpell 2 is modular:

-   `@xpell/core` → Runtime contracts + execution engine\
-   `@xpell/ui` → Real-time UI framework\
-   `@xpell/3d` → Three.js-based spatial runtime\
-   `@xpell/node` → Server runtime (xnode, Wormholes, XDB)

`@xpell/ui` implements the browser execution layer on top of the core
runtime.

------------------------------------------------------------------------

## Alpha Status

This package is currently in Alpha.

-   APIs may evolve
-   XVMApp contracts may be refined
-   SSR integration via xnode is planned

This release targets early adopters and architectural experimentation.

------------------------------------------------------------------------

## Documentation & Links

Website: https://xpell.ai\
GitHub: https://github.com/xpell-ai/xpell-ui

------------------------------------------------------------------------

## Versioning

Follows semantic versioning under the Xpell 2 release stream.

------------------------------------------------------------------------

## License

MIT License\
© Aime Technologies
