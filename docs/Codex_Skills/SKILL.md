---
name: Xpell UI Contract
id: xpell-ui
version: 1.0.0
updated: 2026-02-26
description: Declarative real-time UI runtime for Xpell 2. JSON-driven XUI layer built on XObject, integrated with XData2 and Nano-Commands v2. Browser-only execution.
requires:
  - xpell-contract
  - xpell-core
---

## 1) Applies to / Scope

- Applies to package `@xpell/ui` (currently `2.0.0-alpha.5` in `package.json`).
- Applies to the public package root export `"."` and `"./package.json"` only.
- Applies to runtime subsystems implemented in `src/XUI`, `src/XVM`, `src/XEM`, `src/Wormholes`, and `src/XDB`.
- This contract is for browser execution paths in this package.

## 2) Core identity (what @xpell/ui is and is not)

- `@xpell/ui` is a browser UI runtime on top of `@xpell/core`.
- It is JSON-driven (`_type`, `_children`, props) and object-based (`XUIObject` hierarchy).
- It provides DOM rendering (`XUI`), SPA orchestration (`XVM`), event bridging (`XEM`), and Wormholes client transport.
- It is not a JSX/framework runtime.
- It is not a Node.js/server runtime.
- It is not an SSR renderer in current implementation.

## 3) Public API overview

- Root entrypoint re-exports selected `@xpell/core` types and runtime symbols.
- UI exports:
  - `XUI`, `_xui`, `XUIModule`
  - `XUIObject`, `XUIObjectData`
  - `XUIObjects` (`XUIObjectPack`) and built-in wrapper classes (`XView`, `XButton`, `XInput`, `XSVG`, etc.)
  - `XUIAnimate`, `_AnimateCSS`
- View manager exports:
  - `XVM`, `_xvm`
  - `XVMApp` and route/region/container/factory option types
  - `XVMClient` and client option/connection types
- Transport exports:
  - `Wormholes` singleton facade, `WormholesFacade`, `WormholesV1`, `WormholesV2`
  - Wormholes envelope/types and codec helpers (`makeEnvelope`, `parseEnvelope`, ...)
- Event/data/storage exports:
  - `XEventManager`, `_xem`, `_XEventManager`
  - `XDB`, `_xdb`, `_XDataBase`

### Core re-exports do not change UI-layer constraints

- `@xpell/ui` re-exports many `@xpell/core` symbols for runtime convenience.
- UI-layer constraints still apply to `@xpell/ui` usage:
  - no Node.js APIs
  - no server/persistence logic in UI/view-layer code
  - no bypassing XVM/XUI lifecycle and navigation contracts
- Importing `_x` or `_xd` from `@xpell/ui` does not permit server-side behavior or hidden state.
- Existing internal infrastructure modules may use persistence (for example `XVMClient` cache via `XDB`); that is not permission for app/view code to do the same.

## 4) XUIObject contract

- `XUIObject` extends `XObject` from `@xpell/core`.
- DOM element is lazy-created by `getDOMObject()` using `_html_tag` and optional `_html_ns`.
- Non-underscore fields are written as HTML attributes during DOM creation.
- Child tree is object-based (`_children`) and mounted recursively.
- Lifecycle hooks used by runtime:
  - `onMount()` binds `_on_click` and then delegates to base `XObject` lifecycle.
  - `show()` / `hide()` manage visibility and trigger `onShow()` / `onHide()`.
- Event listener contract:
  - `addEventListener()` and removals are routed through UI `_xem` adapter.
- Nano-command contract:
  - constructor loads `_xuiobject_basic_nano_commands` pack by default.

## 5) XView contract

- `XView` is the default wrapper for `_type: "view"`.
- Defaults:
  - `_type: "view"`
  - `_html_tag: "div"`
  - `class: "xview"`
- `XUI.create()` defaults to a `view` object when `_type` is missing.
- Alias mapping in object pack also maps `_type: "div"` to `XView`.

## 6) Declarative JSON view rules

- Views are declared as plain objects and resolved by `_type` via `XUIObjectPack`.
- Structural composition uses `_children` arrays.
- Concrete wrappers exist for common types (`view`, `button`, `label`, `input`, `form`, `svg`, etc.).
- HTML aliases (`header`, `section`, `article`, `h1`-`h6`, `ul`, `li`, ...) resolve to `XHTML`.
- `XUI.add()` and `XUI.mount()` are structural only and intentionally do not call `show()`.

## 7) XData binding rules

- Shared runtime state is consumed via `_xd` (`@xpell/core`) and object-level data hooks.
- `XUIObject` supports `_data_source` and `_on_data` through base `XObject` lifecycle.
- UI nano-commands include `set-text-from-data` and `set-text-from-frame` (reads `XD_FRAME_NUMBER` from `_xd`).
- Wormholes data events are written into XData through `setWormholeState(key, value, source)`.
- Legacy direct `_xd._o[...]` writes are explicitly guarded by script `check:xdata-legacy`.

## 8) Event handling model

- Global/runtime events use `_xem` (`XEventManager`) API.
- UI `_xem` bridges runtime bus and DOM events:
  - `on()` optionally binds listener on object DOM element or `document`.
  - `fire()` emits to runtime bus and dispatches `CustomEvent` by default.
- Object-level handler fields:
  - `_on_click`, `_on_show`, `_on_hide`
  - `_on` and `_once` maps for lifecycle/event handlers
- Nano-commands can be invoked from handlers through `checkAndRunInternalFunction()` integration.

## 9) Player/bootstrap rules

- `XUI.createPlayer()` creates/attaches player root and can set default mount root.
- XUI first-gesture support exists via `enableFirstUserGestureEvent()` and `waitForFirstUserGesture()`.
- XVM controls visibility/navigation invariants:
  - `stackInternal()` is the only place calling `target.show()`.
  - `navigate()` owns hash updates for hash-synced regions.

### XVM invariants (non-negotiable)

- Only `stackInternal()` calls `target.show()`; `stack()` delegates to `stackInternal()`.
- `add()`/`register*()` paths (`add`, `registerRawView`, `registerViewFactory`, `registerRoute`) must not call `show()`.
- `navigate()` is the URL/hash write owner (`window.location.hash`, `window.location.replace`).
- Active-view ownership is enforced per container through `_active` + `clearActive()` before stack; one active view per container is enforced by implementation.
- `XUI.add()` / `XUI.mount()` may mount structure but must not imply show.

- `XVMClient.bootstrap()` flow:
  - open Wormholes
  - fetch app/view payloads (`server-xvm` ops)
  - mount runtime app and render entry view
  - subscribe to `server-xvm:update`

## 10) Integration rules (with @xpell/core and @xpell/node)

- With `@xpell/core`:
  - peer dependency and primary runtime foundation
  - `XUIObject` inherits `XObject`
  - shared singletons (`_x`, `_xd`, `_xem` override in UI package)
  - command/event/data types are re-exported from core
- With `@xpell/node` runtime services:
  - integration is transport-level through Wormholes envelopes and `sendXcmd`
  - `XVMClient` expects `server-xvm` command surface (`get-app`, `get-view`, `subscribe`)
  - server push event consumed as `server-xvm:update`

## 11) Hard forbiddens

- No Node.js APIs in UI runtime code paths.
- No server logic embedded in `XUIObject`/`XUI`/`XVM` components.
- No bypass of `XUIObject` inheritance for built-in UI object wrappers.
- No direct DOM mutation from app-level business logic when equivalent object API exists (`append`, `show`, `hide`, nano-commands).
- No implicit polling loops (`setInterval` / unbounded background loops).
- No inferred hidden app state outside declared object props and XData channels.

### Timers policy

- Allow:
  - one-shot `setTimeout` / `queueMicrotask` only for infrastructure transitions (navigation guards, UI settle, bounded request timeouts, reconnect backoff) and only when bounded and cancelable or naturally self-terminating.
- Forbid:
  - `setInterval`
  - polling loops ("every N seconds")
  - unbounded retry loops without explicit stop control

Implementation notes from current codebase:
- Timer-based infrastructure exceptions currently present:
  - `XUI.add()` post-mount create pass uses `queueMicrotask`.
  - `XVM.navigate()` resets hash-guard flag with one-shot `setTimeout(..., 0)`.
  - `WormholesV2` uses one-shot timeout for request deadlines and reconnect backoff; reconnect is controlled by `_auto_reconnect` and `close()`.
- Direct `XDB` usage exists in `XVMClient` for local cache persistence; it is infrastructure-level, not UI object behavior.

## 12) Minimal usage examples

Event handlers stored in view data must be Nano-Commands v2 (text or JSON), never JS functions.

```ts
import { _x, XUI } from "@xpell/ui";

_x.start();
_x.loadModule(XUI);
XUI.createPlayer("xplayer");

XUI.add({
  _type: "view",
  _id: "root",
  _children: [
    { _type: "label", _id: "title", _text: "Hello" },
    { _type: "button", _id: "ok", _text: "OK", _on_click: "xvm navigate _to:\"home\"" }
  ]
});
```

```ts
import { XVM } from "@xpell/ui";

await XVM.app({
  _player: { _id: "xplayer", _set_as_main_player: true },
  _containers: [{ _id: "region-main" }],
  _regions: [{ _id: "main", _container_id: "region-main" }],
  _views: {
    home: { _type: "view", _id: "home", _children: [{ _type: "label", _text: "Home" }] }
  },
  _start: { _view_id: "home", _region: "main" }
});
```
