---
name: Xpell XVM Contract
id: xpell-xvm
version: 2.0.0
updated: 2026-05-01
description: Xpell View Manager (XVM) contract covering both @xpell/node server-xvm persistence/realtime and @xpell/ui browser XVM/XVMClient navigation/bootstrap. Use for XVM app/view/flow storage, manifests, routes, region navigation, server-backed view loading, and realtime updates.
requires:
  - xpell-contract
  - xpell-core
  - xpell-node
  - xpell-ui
---

## 1) Applies to / Scope

- Server runtime: `@xpell/node`, especially `packages/xnode/src/XVM/ServerXVMModule.ts`.
- Client runtime: `@xpell/ui`, especially `packages/xpell-ui/src/XVM/XVM.ts` and `packages/xpell-ui/src/XVM/XVMClient.ts`.
- Related boot paths:
  - `packages/xnode/src/XServer/XNode.ts` loads `ServerXVMModule` and calls `init_on_boot()`.
  - `packages/xpell-ui/src/XUI/XUIRuntime.ts` loads `XUI`, `XVM`, `FlowManagerClient`, creates `XVMClient`, and calls `bootstrap()`.
- Keep this file as the compact contract. Load `SKILL_API_MAP.md` for exact types, ops, payloads, exports, and method names. Load `SKILL_CHECKLIST.md` before implementing or reviewing XVM changes.

## 2) Core Identity

XVM is the cross-runtime app/view manager for Xpell.

- Server XVM (`server-xvm`) owns persisted app, view, and flow files plus app-scoped realtime fanout.
- Client XVM (`xvm`) owns browser SPA structure: player/container setup, regions, routes, active views, history, and hash navigation.
- XVMClient bridges both sides over Wormholes: it fetches persisted server views, builds a client `XVMApp`, renders the entry view, caches views in `XDB`, subscribes to updates, and hot-patches or re-renders pushed views.

Boundary:

- Server XVM never owns DOM, browser navigation, XUI mounting, prompt generation, or product-specific UX.
- Client XVM never writes authoritative server files and never embeds Node.js persistence logic.
- Flow storage lives in `server-xvm`; flow execution belongs to the `flow` module.
- XUI builds/mounts objects; XVM decides when a view becomes visible.

## 3) Server XVM Contract

`ServerXVMModule` is an `XModule` with module name `server-xvm`.

Storage layout:

```text
<work_folder>/xvm/apps/<env>/<app_id>/
  app.json
  views/<view_id>.json
  flows/<flow_id>.json
```

Bundle shape:

```ts
type XVMAppBundle = {
  _app: XVMAppFile;
  _views: Record<string, XVMView>;
  _flows: Record<string, XVMFlow>;
};
```

Public server ops:

- `_create_app`
- `_get_app`
- `_get_view`
- `_push_update`
- `_subscribe`
- `_set_flow`
- `_get_flow`
- `_list_flows`

Use normal Xpell command mapping. The code exposes underscore methods, while callers may use snake-case or hyphenated ops through the dispatcher. The browser client currently sends `get-app`, `get-view`, and `subscribe`.

Server rules:

- `_app_id` must be a non-empty string.
- `_env` defaults to `"default"`.
- Persisted views require `_id`.
- Persisted flows require `_id`.
- View and flow writes increment `app._meta._version` and refresh `app._meta._updated_at`.
- Product modules must not write `app.json`, `views/*.json`, or `flows/*.json` directly. Use `server-xvm` ops.
- Persisted app/view/flow JSON must be data-only. Do not persist functions.

Realtime rules:

- `_subscribe` reads the transport-owned connection id from command context: `xcmd._ctx._meta._wid`. It may also read `xcmd._ctx._sid`.
- `_wid` and `_sid` are runtime metadata. Never trust client-authored params for subscriber identity.
- `_push_update` persists the view, emits internal event `server-xvm:update`, then broadcasts Wormholes event `xvm:update`.
- Realtime fanout must be scoped by `_app_id` and `_env` via `wsBroadcastScoped(app_id, env, ...)`.
- Do not broadcast XVM updates globally unless a task explicitly changes the contract and updates both server and client docs.

## 4) Client XVM Contract

`XVM` is the browser SPA orchestrator singleton exported as `XVM` and `_xvm`, with module name `xvm`.

It owns:

- app manifest loading
- optional player root creation
- shell mounting
- container registration
- region registration
- raw view and view factory registration
- route registration
- active-view stacking
- per-container history
- hash synchronization for hash-synced regions

Core invariants:

- `XUI.add()` / `XUI.mount()` are structural only and must not imply visibility.
- `stackInternal()` is the place that calls `target.show()`.
- `navigate()` is the owner of URL/hash writes.
- Use region names for app code; container IDs are low-level overrides.
- One active view per container is maintained through `_active` and `clearActive()`.
- `show()` stacks a view without touching the URL hash.
- `navigate()` calls `show()` and writes the hash only when the target region has `hashSync=true` and the call is not silent.

App manifest shape is `XVMApp`:

- `_player`
- `_shell`
- `_containers`
- `_regions`
- `_views`
- `_routes`
- `_router`
- `_start`

Manifest load order:

1. create optional player
2. mount optional shell
3. create/register containers
4. register regions
5. register raw views and factories
6. register routes
7. initialize router
8. navigate to start target
9. fire `xvm-app-loaded`

## 5) XVMClient Contract

`XVMClient` is the server-backed browser runtime for persisted XVM apps.

Required options:

- `app_id`
- `env`
- `wormhole_url`

Optional options:

- `region`
- `fallback_view_id`
- `onViewRendered`
- `onConnectionChange`
- `onError`
- `onAppMounted`

Bootstrap flow:

1. bind Wormholes and `xvm:update` event handlers
2. render cached entry view if available
3. open Wormholes if needed
4. call `server-xvm.get-app` with `_include_views: false`
5. resolve entry view from `app._meta._entry_view_id`, `app._config._start._view_id`, or first view id
6. fetch views with `server-xvm.get-view`
7. mount a runtime `XVMApp`
8. render the entry view
9. call `server-xvm.subscribe`
10. emit connection/view lifecycle events

Client cache:

- app cache key: `xvm:last_app:<env>:<app_id>`
- app version key: `xvm:version:<env>:<app_id>`
- view cache key: `xvm:view:<env>:<app_id>:<view_id>`
- Cache is infrastructure-scoped inside `XVMClient`; app/view objects should not use `XDB` as authoritative state.

Realtime update handling:

- Client consumes event name `xvm:update`.
- Payload must include `_app_id`, `_env`, `_view_id`, `_version`, and `_view`.
- Client filters updates by `_app_id` and `_env`.
- Stale versions are ignored.
- Matching active views are patched through `currentView.update(_view)` when possible.
- If patching fails or is unavailable, the client re-renders the updated view.

## 6) Cross-Runtime Data Contract

Server-persisted views should be valid XUI/XVM raw view data:

```json
{
  "_id": "view-main",
  "_type": "view",
  "_children": []
}
```

Use the same `_id` as:

- server persisted view identity
- `XVM.registerRawView()` identity
- client navigation target unless a route maps to a different `_view_id`
- realtime `_view_id`

Server `app._config` may contain client manifest fragments such as `_player`, `_shell`, `_containers`, `_regions`, `_router`, and `_start`. `XVMClient` merges these with fetched views to build the runtime `XVMApp`.

## 7) Hard Forbiddens

- Do not put DOM/browser APIs in `@xpell/node` XVM code.
- Do not put Node.js filesystem/server persistence in `@xpell/ui` XVM code.
- Do not let product modules write ServerXVM files directly.
- Do not execute flows from `server-xvm`.
- Do not persist functions inside server app/view/flow JSON.
- Do not trust client-authored `_wid`, `_sid`, or subscriber identifiers.
- Do not broadcast XVM updates globally by default.
- Do not call `show()` from XUI mount/add paths.
- Do not mutate `window.location` outside XVM navigation ownership.
- Do not add polling loops for XVM refresh; use Wormholes events and explicit fetches.

## 8) Working Procedure

When changing XVM:

1. Decide whether the change is server-only, client-only, or cross-runtime.
2. Read `SKILL_API_MAP.md` for the exact current API and payload shape before editing.
3. Keep server and client contracts aligned when touching payloads, event names, versioning, or manifest shape.
4. Use `SKILL_CHECKLIST.md` before finalizing implementation or review.
