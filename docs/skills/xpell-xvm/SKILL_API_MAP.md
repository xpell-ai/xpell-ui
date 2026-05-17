# Xpell XVM API Map

Code-derived from:

- `packages/xnode/src/XVM/ServerXVMModule.ts`
- `packages/xnode/src/index.ts`
- `packages/xnode/src/XServer/XNode.ts`
- `packages/xnode/src/XFM/FlowManagerModule.ts`
- `packages/xpell-ui/src/XVM/XVM.ts`
- `packages/xpell-ui/src/XVM/XVMClient.ts`
- `packages/xpell-ui/src/XUI/XUIRuntime.ts`
- `packages/xpell-ui/src/index.ts`

## Package Summary

Server package:

- Package: `@xpell/node`
- Version seen in `package.json`: `2.0.0-alpha.34`
- Source module: `src/XVM/ServerXVMModule.ts`
- Runtime module name: `server-xvm`

Client package:

- Package: `@xpell/ui`
- Version seen in `package.json`: `2.0.0-alpha.26`
- Source modules:
  - `src/XVM/XVM.ts`
  - `src/XVM/XVMClient.ts`
- Runtime module name: `xvm`

## Server Exports

`@xpell/node` root entrypoint exports:

```ts
export { ServerXVMModule } from "./XVM/ServerXVMModule.js";
export { default as ServerXVMModuleDefault } from "./XVM/ServerXVMModule.js";
export type {
  XVMEnv,
  XVMView,
  XVMAppMeta,
  XVMAppFile,
  XVMAppBundle,
} from "./XVM/ServerXVMModule.js";
```

`XVMFlow` is exported by `ServerXVMModule.ts`, but the root `src/index.ts` export list currently does not include it.

## Server Types

```ts
export type XVMEnv = string;

export type XVMView = Record<string, any> & {
  _id: string;
};

export type XVMFlow = Record<string, any> & {
  _id: string;
};

export type XVMAppMeta = {
  _name?: string;
  _version: number;
  _entry_view_id?: string;
  _updated_at?: string;
  [k: string]: any;
};

export type XVMAppFile = {
  _app_id: string;
  _env: XVMEnv;
  _meta: XVMAppMeta;
  _config: Record<string, any>;
};

export type XVMAppBundle = {
  _app: XVMAppFile;
  _views: Record<string, XVMView>;
  _flows: Record<string, XVMFlow>;
};
```

## Server Constructor

```ts
new ServerXVMModule(opts?: {
  _work_folder?: string;
  _apps_root?: string;
})
```

Defaults:

```ts
_work_folder = "./work";
_apps_root = path.join(_work_folder, "xvm/apps");
```

## Server Storage

```text
<work_folder>/xvm/apps/<env>/<app_id>/
  app.json
  views/<view_id>.json
  flows/<flow_id>.json
```

Scope key:

```ts
app_scope_key(app_id, env) === `${env}::${app_id}`;
```

Default env:

```ts
const DEFAULT_ENV = "default";
```

## Server Op: create_app

Method:

```ts
async _create_app(xcmd: XCommand)
```

Command:

```json
{
  "_module": "server-xvm",
  "_op": "create_app",
  "_params": {
    "_app_id": "vibe-app",
    "_env": "default",
    "_name": "Vibe App",
    "_entry_view_id": "view-main",
    "_config": {}
  }
}
```

Behavior:

- Validates `_app_id`.
- Defaults `_env` to `"default"`.
- If bundle already exists, returns the existing app with `_created: false`.
- Otherwise creates `app.json` with `_version: 1`, `_entry_view_id` defaulting to `"view-main"`, and `_config` defaulting to `{}`.
- Initializes empty `_views` and `_flows`.
- Persists the bundle.

Return:

```json
{
  "_ok": true,
  "_result": {
    "_app": {},
    "_created": true
  }
}
```

## Server Op: get_app

Method:

```ts
async _get_app(xcmd: XCommand)
```

Command:

```json
{
  "_module": "server-xvm",
  "_op": "get_app",
  "_params": {
    "_app_id": "vibe-app",
    "_env": "default",
    "_include_views": true,
    "_include_flows": true
  }
}
```

Hyphenated op used by `XVMClient`:

```json
{ "_module": "server-xvm", "_op": "get-app" }
```

Return:

```json
{
  "_ok": true,
  "_result": {
    "_app": {},
    "_view_ids": [],
    "_flow_ids": [],
    "_views": {},
    "_flows": {}
  }
}
```

Rules:

- `_views` is included only when `_include_views === true`.
- `_flows` is included only when `_include_flows === true`.

## Server Op: get_view

Method:

```ts
async _get_view(xcmd: XCommand)
```

Command:

```json
{
  "_module": "server-xvm",
  "_op": "get_view",
  "_params": {
    "_app_id": "vibe-app",
    "_env": "default",
    "_view_id": "view-main"
  }
}
```

Hyphenated op used by `XVMClient`:

```json
{ "_module": "server-xvm", "_op": "get-view" }
```

Return:

```json
{
  "_ok": true,
  "_result": {
    "_app_id": "vibe-app",
    "_env": "default",
    "_version": 1,
    "_view": {}
  }
}
```

Throws when the app or view is missing.

## Server Op: push_update

Method:

```ts
async _push_update(xcmd: XCommand)
```

Command:

```json
{
  "_module": "server-xvm",
  "_op": "push_update",
  "_params": {
    "_app_id": "vibe-app",
    "_env": "default",
    "_view": {
      "_id": "view-main",
      "_type": "view",
      "_children": []
    }
  }
}
```

Behavior:

- Validates `_app_id`.
- Defaults `_env`.
- Validates `_view` is a plain object.
- Validates `_view._id`.
- Replaces or creates the view in memory.
- Increments `bundle._app._meta._version`.
- Updates `bundle._app._meta._updated_at`.
- Persists `app.json` and all views/flows.
- Fires internal event `server-xvm:update`.
- Broadcasts Wormholes event `xvm:update` scoped by app/env.

Internal event payload and Wormholes `_args[0]`:

```ts
{
  _app_id: string;
  _env: string;
  _view_id: string;
  _version: number;
  _view: XVMView;
}
```

Broadcast shape:

```ts
wsBroadcastScoped(app_id, env, {
  _name: "xvm:update",
  _args: [payload],
});
```

Return:

```json
{
  "_ok": true,
  "_result": {
    "_view_id": "view-main",
    "_version": 2
  }
}
```

## Server Op: subscribe

Method:

```ts
async _subscribe(xcmd: XCommand)
```

Command:

```json
{
  "_module": "server-xvm",
  "_op": "subscribe",
  "_params": {
    "_app_id": "vibe-app",
    "_env": "default"
  }
}
```

Context used by current implementation:

```ts
const ctx = (xcmd as any)?._ctx;
const wid = ctx?._meta?._wid;
const sid = ctx?._sid;
```

Behavior:

- Validates `_app_id`.
- Defaults `_env`.
- If no `_wid` exists in context, logs a warning and returns `{ _ok: true }`.
- Calls `wsSetScope(wid, { _app_id, _env })`.
- Does not require the client to know or send `_wid`.

Return:

```json
{ "_ok": true }
```

## Server Op: set_flow

Method:

```ts
async _set_flow(xcmd: XCommand)
```

Command:

```json
{
  "_module": "server-xvm",
  "_op": "set_flow",
  "_params": {
    "_app_id": "vibe-app",
    "_env": "default",
    "_flow": {
      "_id": "signup_flow",
      "_meta": { "_title": "Signup Flow" },
      "_steps": []
    }
  }
}
```

Behavior:

- Validates `_app_id`.
- Defaults `_env`.
- Validates `_flow` is a plain object.
- Validates `_flow._id`.
- Replaces or creates the flow in memory.
- Increments app version and updates `_updated_at`.
- Persists app, views, and flows.
- Does not execute the flow.

Return:

```json
{
  "_ok": true,
  "_result": {
    "_flow_id": "signup_flow"
  }
}
```

## Server Op: get_flow

Method:

```ts
async _get_flow(xcmd: XCommand)
```

Command:

```json
{
  "_module": "server-xvm",
  "_op": "get_flow",
  "_params": {
    "_app_id": "vibe-app",
    "_env": "default",
    "_flow_id": "signup_flow"
  }
}
```

Return:

```json
{
  "_ok": true,
  "_result": {
    "_flow": {}
  }
}
```

`FlowManagerModule` uses this op before executing a flow.

## Server Op: list_flows

Method:

```ts
async _list_flows(xcmd: XCommand)
```

Command:

```json
{
  "_module": "server-xvm",
  "_op": "list_flows",
  "_params": {
    "_app_id": "vibe-app",
    "_env": "default"
  }
}
```

Return:

```json
{
  "_ok": true,
  "_result": {
    "_flows": ["signup_flow"]
  }
}
```

## Server Boot API

Method:

```ts
async init_on_boot()
```

Behavior:

- Ensures apps root exists.
- Clears in-memory app bundle map.
- Scans env directories.
- Loads `app.json`.
- Loads `views/*.json` with `_id`.
- Loads `flows/*.json` with `_id`.
- Rebuilds in-memory bundle map.

Return:

```json
{
  "_apps_loaded": 1,
  "_views_loaded": 2,
  "_flows_loaded": 1
}
```

`XNode.start()` constructs `new ServerXVMModule({ _work_folder: this._work_folder })`, loads it into `_x`, and calls `init_on_boot()`.

## Client Exports

`@xpell/ui` root entrypoint exports:

```ts
export { XVM, _xvm } from "./XVM/XVM";
export type {
  XVMApp,
  XVMRouteSpec,
  XVMRegionSpec,
  XVMContainerSpec,
  XVMViewFactory,
  RegionConfig,
  NavigateOptions,
  ShowOptions,
  CloseOptions,
} from "./XVM/XVM";
export { XVMClient } from "./XVM/XVMClient";
export type { XVMClientOptions, XVMClientConnectionChange } from "./XVM/XVMClient";
export { XUIRuntime, type XUIRuntimeOptions, type XUIRuntimeAppOptions } from "./XUI/XUIRuntime";
```

## Client XVM Types

```ts
export type RegionConfig = {
  containerId: string;
  history?: boolean;
  hashSync?: boolean;
};

export type NavigateOptions = {
  containerId?: string;
  region?: string;
  replace?: boolean;
  silent?: boolean;
};

export type ShowOptions = {
  containerId?: string;
  region?: string;
  allowCreateFromRaw?: boolean;
  allowCreateFromFactory?: boolean;
};

export type CloseOptions = {
  containerId?: string;
  region?: string;
  clearHistory?: boolean;
};

export type XVMViewFactory = (ctx: {
  _id: string;
  _container_id: string;
  _region?: string;
  _params?: any;
  _route?: XVMRouteSpec;
}) => XObjectData | Promise<XObjectData>;

export type XVMContainerSpec = {
  _id: string;
  _parent_element?: string;
  class?: string;
  style?: string;
};

export type XVMRegionSpec = {
  _id: string;
  _container_id: string;
  _history?: boolean;
  _hash_sync?: boolean;
};

export type XVMRouteSpec = {
  _id: string;
  _view_id?: string;
  _region?: string;
  _container_id?: string;
  _replace?: boolean;
  _silent?: boolean;
};

export type XVMApp = {
  xpell?: { version?: number };
  _player?: {
    _id?: string;
    _parent_element?: string;
    class?: string;
    style?: string;
    _set_as_main_player?: boolean;
  };
  _shell?: XObjectData | (() => XObjectData | Promise<XObjectData>);
  _containers?: XVMContainerSpec[];
  _regions?: XVMRegionSpec[];
  _views?: Record<string, XObjectData | XVMViewFactory>;
  _routes?: XVMRouteSpec[];
  _router?: {
    _region?: string;
    _fallback_view_id?: string;
  };
  _start?: {
    _route_id?: string;
    _view_id?: string;
    _region?: string;
    _container_id?: string;
    _params?: any;
  };
};
```

## Client XVM Events

```ts
export const XVMEvents = {
  container_added: "xvm-container-added",
  app_loaded: "xvm-app-loaded",
} as const;
```

On module load, `XVM` listens to `xvm:update` and updates its raw view registry when the payload contains `_view_id` and `_view`.

## Client XVM Public Runtime API

Singleton:

```ts
export const XVM = new _XVM();
export const _xvm = XVM;
export default XVM;
```

Core methods:

- `load()`
- `addContainer(container, create = false)`
- `getContainer(containerId)`
- `registerRegion(region, cfg)`
- `setDefaultRegion(region)`
- `clearContainerHistory(opts?)`
- `registerRawView(view)`
- `registerViewFactory(viewId, factory)`
- `registerRoute(route)`
- `getRoute(routeId)`
- `clearContainer(opts?)`
- `add(view, opts?)`
- `remove(viewId)`
- `getActiveViewId(opts?)`
- `stack(view, opts?)`
- `show(to, opts?)`
- `close(opts?)`
- `navigate(to, opts?)`
- `back(opts?)`
- `getCurrentView()`
- `getViewById(viewId)`
- `initRouter(opts?)`
- `loadApp(app)`
- `app(app)`
- `help(op?)`

Interpreter ops:

- `_load_app`
- `_show`
- `_navigate`
- `_back`
- `_close`
- `_help`

Interpreter op params are read through `XParams` and use underscore/snake fields such as `_region`, `_container_id`, `_replace`, `_silent`, and `_params`.

Public method options use TypeScript names such as `region`, `containerId`, `replace`, and `silent`.

## Client XVM Manifest Load Order

`loadApp(app)` performs:

1. optional player creation through `XUI.createPlayer`
2. optional `_shell` resolution and `XUI.add(shell)`
3. container registration or creation
4. region registration
5. raw view and factory registration
6. route registration
7. router initialization
8. start navigation
9. `xvm-app-loaded` event

## Client XVM Navigation Semantics

- `show(to, opts)` resolves route id or view id, creates raw/factory views when allowed, and stacks the view. It does not change the URL.
- `navigate(to, opts)` resolves route id or view id, calls `show`, and writes the hash if the target region is hash-synced and `silent` is false.
- `back(opts)` pops per-container history and optionally syncs the hash.
- `close(opts)` clears the active view in a region/container and can clear history.
- `getCurrentView()` returns the current `XUIObject`.
- `getViewById(viewId)` returns raw registered view data or `null`.

## XVMClient Options

```ts
export type XVMClientOptions = {
  app_id: string;
  env: string;
  wormhole_url: string;
  region?: string;
  fallback_view_id?: string;
  onViewRendered?: (view_id: string) => void;
  onConnectionChange?: (payload: XVMClientConnectionChange) => void;
  onError?: (error: any) => void;
  onAppMounted?: (payload: { _app_id: string; _env: string; _region: string }) => void;
};
```

Connection event:

```ts
export type XVMClientConnectionChange = {
  _status: "connected" | "disconnected" | "error" | "connecting";
  _connected: boolean;
  _app_id: string;
  _env: string;
  _source?: string;
};
```

## XVMClient Server Response Shapes

```ts
type ServerXVMApp = {
  _app_id: string;
  _env: string;
  _meta?: Record<string, any>;
  _config?: Record<string, any>;
};

type ServerGetAppRes = {
  _app: ServerXVMApp;
  _view_ids?: string[];
  _views?: Record<string, any>;
};

type ServerGetViewRes = {
  _app_id: string;
  _env: string;
  _version?: number;
  _view: Record<string, any>;
};

type ServerUpdateEvt = {
  _app_id: string;
  _env: string;
  _view_id: string;
  _version?: number;
  _view: Record<string, any>;
};
```

## XVMClient Cache Keys

```ts
app:     `xvm:last_app:${env}:${app_id}`
version: `xvm:version:${env}:${app_id}`
view:    `xvm:view:${env}:${app_id}:${view_id}`
```

Cache backend:

- `XDB.saveObject`
- `XDB.getObject`
- `XDB.saveString`
- `XDB.getString`

## XVMClient Bootstrap

`bootstrap()` flow:

1. `_bind_events()`
2. `_render_cached_boot_view()`
3. `_ensure_connected()`
4. `_wait_for_wormhole_open()`
5. `server-xvm.get-app` with `_include_views: false`
6. `_apply_server_get_app(out)`
7. pick entry view:
   - `app._meta._entry_view_id`
   - `app._config._start._view_id`
   - first returned view id
8. fetch each view with `server-xvm.get-view`
9. `render_view(entry)`
10. `server-xvm.subscribe`
11. set connection status to connected
12. on failure, call `onError` and mount an offline app when no view has rendered

Wormholes calls:

```ts
Wormholes.sendXcmd({
  _module: "server-xvm",
  _op,
  _params,
});
```

Ops currently sent by `XVMClient`:

- `get-app`
- `get-view`
- `subscribe`

## XVMClient Runtime App Build

`_build_runtime_app()` merges server app config and cached views into an `XVMApp`.

Server `app._config` may provide:

- `_player`
- `_shell`
- `_containers`
- `_regions`
- `_router`
- `_start`

Defaults:

- default region: `"main"`
- default container id for main: `"region-main"`
- default player: `{ _id: "xplayer", _set_as_main_player: true }`
- default region spec: `{ _id: region, _container_id: default_container_id }`

## XVMClient Rendering

`render_view(view_id)`:

- ensures the view exists locally or fetches it from server
- mounts runtime app if needed
- syncs newly cached views into XVM if app is already mounted
- navigates to the view
- updates `_current_view_id`
- calls `onViewRendered`
- fires `xvm:view-rendered`

`get_view(view_id)` returns cached raw view JSON.

`get_current_view()` returns cached raw JSON for the current view id.

## XVMClient Realtime

Events bound by `_bind_events()`:

- `wormhole-open` -> connection status `connected`
- `wormhole-close` -> connection status `disconnected`
- `wormhole-error` -> connection status `error`
- `xvm:update` -> server view update handling

Update handling:

1. Normalize payload from direct payload or Wormholes `{ _args: [payload] }`.
2. Ignore if `_app_id` or `_env` does not match this client.
3. Require `_view_id` string and `_view` object.
4. Ignore stale versions when `_version <= _current_version`.
5. Cache the pushed view.
6. Persist the pushed view.
7. Update version cache.
8. If pushed view is active, call `currentView.update(_view)` when possible.
9. Register raw view with `XVM.registerRawView(_view)` after live patch.
10. If patching fails or is unavailable, call `render_view(_view_id)`.

## XUIRuntime Integration

`XUIRuntime.loadModules(opts)`:

- loads `XUI`
- optionally loads `XVM`
- optionally loads `FlowManagerClient`
- optionally starts `_x`

`XUIRuntime.loadApp(opts)`:

- requires `app_id`
- requires `wormhole_url`
- defaults `env` to `"default"`
- constructs `new XVMClient(opts)`
- calls `client.bootstrap()`
- stores the client in `XUIRuntime.getClient()`

## Server / Client Interop Summary

Authoritative server state:

- `app.json`
- `views/*.json`
- `flows/*.json`

Client bootstrap surface:

- `server-xvm.get-app`
- `server-xvm.get-view`
- `server-xvm.subscribe`

Realtime surface:

- server internal event: `server-xvm:update`
- Wormholes/client event name: `xvm:update`
- payload: `_app_id`, `_env`, `_view_id`, `_version`, `_view`

Flow surface:

- `server-xvm.set_flow` stores flows.
- `server-xvm.get_flow` loads flows.
- `flow.run` executes flows by loading them from `server-xvm`.
- `XVMClient` currently hydrates views, not flows.

## Validation Expectations

Server:

- `_app_id`: non-empty string
- `_env`: defaults to `"default"`
- `_view`: plain object for `push_update`
- `_view._id`: non-empty string
- `_flow`: plain object for `set_flow`
- `_flow._id`: non-empty string

Client:

- containers must have `_id`
- regions must have `_id` and `_container_id`
- raw views must have `_id`
- routes must have `_id`
- `XVM.show` requires a target
- `XVM.navigate` ignores empty targets
- `XVMClient` requires `app_id`, `env`, and `wormhole_url`
