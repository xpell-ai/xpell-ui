---
name: xpell-ui
description: Use when working with @xpell/ui, XUI JSON views, XUIObject wrappers, XVM browser navigation, XVMClient server-driven views, Wormholes browser transport, XFM flow bindings, XUIRuntime bootstrap, or reviewing browser-only Xpell UI code.
metadata:
  short-description: Browser UI runtime contract for @xpell/ui
---
# xpell-ui Codex Skill
Use this skill when creating, reviewing, or modifying browser UI code built on `@xpell/ui`.
This skill depends on the contracts from `xpell-contract` and `xpell-core`.
## Load Order
- Read this file first for the contract and workflow.
- Read `SKILL_API_MAP.md` when exact exports, object types, browser subsystems, or runtime ops matter.
- Read `SKILL_CHECKLIST.md` before finalizing generated UI code or reviewing a change.
## Scope
- Applies to package `@xpell/ui`.
- Applies to the public package root export `"."` and `"./package.json"` only.
- Applies to source areas `src/XUI`, `src/XVM`, `src/XEM`, `src/Wormholes`, `src/XDB`, and `src/XFM`.
- This is a browser runtime contract. It is not a Node.js runtime, SSR renderer, React/Vue layer, or server persistence layer.
## Core Model
- `@xpell/ui` is a browser UI runtime on top of `@xpell/core`.
- UI is declarative JSON: `_type`, `_id`, `_children`, and underscore-prefixed runtime fields.
- Runtime objects are `XUIObject` subclasses created through `XUI.create(...)`, mounted through `XUI.add(...)` / `XUI.mount(...)`, and orchestrated by `XVM`.
- Built-in wrapper resolution is handled by `XUIObjectPack`; new wrapper `_type` values must be registered in an object pack.
- Public root imports should come from `@xpell/ui`; do not import private `src/*` paths in user code.
## Working Pattern
1. Start from JSON view data, not JSX or framework components.
2. Use concrete `_type` values such as `view`, `label`, `button`, `input`, `textarea`, `image`, `form`, `svg`, or HTML aliases before reaching for generic `xhtml`.
3. Put app flow in XVM regions/routes/views. Use `XUI` for structure and DOM materialization only.
4. Use `_on` / `_once` with Nano-Commands v2 text or JSON for persisted event handlers.
5. Do not use `_on_click`; use `_on: { click: ... }`.
6. Use `_flow`, `_flow_event`, and `_flow_auto` only as declarative UI-to-flow triggers.
7. Use `_xd`, `_data_source`, and `_on_data` for shared runtime data binding.
8. Use Wormholes/XVMClient/XUIRuntime for server-driven views; keep server commands behind the transport boundary.
9. Keep browser local persistence infrastructure-scoped. `XDB` is allowed for runtime cache/local browser storage, not as a hidden app domain database.
## XUI Rules
- `XUI.create(data)` defaults missing `_type` to `view`.
- `XUI.add(data, parent?)` creates and mounts, then queues a post-mount create pass with `queueMicrotask`.
- `XUI.mount(...)` and `XUI.add(...)` are structural; they must not call `show()` or imply navigation.
- `XUI.createPlayer(...)` creates the default mount root used by later `XUI.add(...)` calls.
- Direct DOM mutation belongs inside XUI infrastructure (`XUIObject`, wrapper classes, low-level rendering helpers), not app-level business logic.
## XUIObject Rules
- New built-in or package-level UI wrappers must extend `XUIObject`.
- Constructor shape should follow local patterns: defaults, `super(data, defaults, true)`, then `this.parse(data)`.
- Non-underscore fields become HTML attributes during DOM materialization.
- Child composition uses `_children`; do not bypass the object graph with unmanaged DOM append/remove in app code.
- Class/style/text changes should use `setText`, `addClass`, `removeClass`, `toggleClass`, `setStyleAttribute`, `update`, or Nano-Commands.
- `show()`, `hide()`, and `toggle()` own visibility and trigger `onShow()` / `onHide()`.
- DOM handlers must use `_on` / `_once`; `_on_click` is deprecated and must not be generated in new persisted view data.
- `_flow` is declarative sugar for UI-to-flow triggering. `XUIObject` must only emit `ui:flow-trigger`; it must not execute flows directly.
- `_flow_event` selects the DOM event for `_flow`; default is `click`.
- `_flow_auto: false` disables automatic flow trigger binding.
## XVM Rules
- XVM owns SPA flow: containers, regions, routes, history, hash sync, and active view ownership.
- `stackInternal()` is the only implementation path that calls `target.show()`.
- `stack()` delegates to `stackInternal()`.
- `add()`, `registerRawView()`, `registerViewFactory()`, and `registerRoute()` must not call `show()`.
- `navigate()` is the URL/hash write owner and only writes when region policy has `hashSync=true` and `_silent` is false.
- Container active-view ownership is enforced through `_active` and `clearActive()`: one active view per container.
## XVMClient and XUIRuntime
- `XVMClient` bootstraps server-driven apps over the `server-xvm` command surface: `get-app`, `get-view`, and `subscribe`.
- `XVMClient` uses browser `XDB` for app/view/version cache and renders a cached/offline view when server bootstrap fails.
- Live view pushes are consumed through the UI event bus as `xvm:update`; current active views may be patched through `XUIObject.update(...)`.
- `XUIRuntime.loadModules(...)` loads `XUI`, optionally `XVM` and a flow client, then optionally starts `_x`.
- `XUIRuntime.loadApp(...)` builds an `XVMClient`, bootstraps it, stores the client, and returns it.
## Events, Data, and Flows
- `_xem` is the UI event manager singleton exported by `@xpell/ui`.
- DOM event handlers in `_on` / `_once` maps are bound during `XUIObject.onMount()`.
- `_on` supports both DOM events and runtime XEM events.
- DOM events use plain event names: `click`, `input`, `change`, `keydown`, etc.
- Runtime XEM events must use the `xem:` prefix inside `_on` / `_once`.
- The `xem:` prefix is a UI routing hint only; it is stripped before registering to XEM.
- Example: listen with `_on: { "xem:test:event": ... }`, but fire with `xem.fire("test:event", data)`.
- Object handlers can invoke Nano-Commands through `checkAndRunInternalFunction(...)`.
- Generated persisted view data must not embed JavaScript functions. Functions are acceptable only in local runtime-only factories/tests where the codebase already uses them.
- Flow-triggering UI emits `_xem.fire("ui:flow-trigger", normalizedPayload)`.
- The normalized flow trigger payload shape is:
  - `_flow_id`
  - `_event_name?`
  - `_event_payload?`
  - `_object_id?`
  - `_app_id?`
  - `_env?`
  - `_source?`
- Raw DOM `Event` objects must not be forwarded as flow payloads.
- `FlowManagerClient` owns client-side flow execution and routes through `_x.execute(...)`; XUI objects must not call flow modules directly.
- Avoid direct `_xd._o[...]` writes; use `_xd` APIs and keep the `check:xdata-legacy` guard passing.
## Timers Policy
- Allowed: bounded one-shot `setTimeout` or `queueMicrotask` for infrastructure transitions, request deadlines, hash guards, reconnect backoff, and post-mount create passes.
- Forbidden: `setInterval`, polling loops, busy loops, and unbounded retries without explicit stop control.
## Hard Forbiddens
- No Node.js APIs (`fs`, `path`, `process`, `child_process`) in UI runtime paths.
- No server modules, server persistence, or request handlers inside UI object/view code.
- No framework layer not present in the package.
- No bypass of `XUIObject` inheritance for UI wrappers.
- No hidden app state outside declared object props, XData channels, or explicit transport/cache infrastructure.
- No direct UI-to-flow execution from XUIObject.
- No raw DOM event payloads in flow triggers.
- No public API changes without updating the package entrypoint and this skill's API map.
## Minimal Examples
Manual app bootstrap:
```ts
import { _x, XUI, XVM } from "@xpell/ui";
_x.loadModule(XUI);
_x.loadModule(XVM);
_x.start();
await XVM.app({
  _player: { _id: "xplayer", _set_as_main_player: true },
  _containers: [{ _id: "region-main" }],
  _regions: [{ _id: "main", _container_id: "region-main" }],
  _views: {
    home: {
      _type: "view",
      _id: "home",
      _children: [
        { _type: "label", _id: "title", _text: "Home" },
        { _type: "button", _id: "next", _text: "Next", _on: { click: "xvm navigate _to:\"details\"" } }
      ]
    }
  },
  _start: { _view_id: "home", _region: "main" }
});

Declarative flow trigger:

{
  _type: "button",
  _id: "submit-user",
  _text: "Submit",
  _flow: "submit-user-form",
  _flow_event: "click"
}

Server-driven app bootstrap:

import { XUIRuntime } from "@xpell/ui";
const client = await XUIRuntime.loadApp({
  app_id: "demo",
  env: "default",
  wormhole_url: "ws://localhost:3000/wh/v2"
});