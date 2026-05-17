# @xpell/ui Skill API Map

## package.json
- Package: `@xpell/ui`
- Version: `2.0.0-alpha.26`
- Package type: ESM (`"type": "module"`)
- Root runtime files:
  - ESM: `./dist/xpell-ui.es.js`
  - CJS: `./dist/xpell-ui.cjs.js`
  - Types: `./dist/types/index.d.ts`
- Public `exports`:
  - `"."`
  - `"./package.json"`
- No public subpath entrypoints are exported.
- Peer dependencies:
  - `@xpell/core`: `workspace:*`
  - `animate.css`: `^4.1.1`
## public root exports from src/index.ts
Core type re-exports:
- `XValue`, `IXData`, `XObjectData`, `XDataXporter`, `XDataXporterHandler`
- `XObjectOnEventIndex`, `XObjectOnEventHandler`, `XEventListener`, `XEventListenerOptions`
- `XNanoCommandPack`, `XNanoCommand`, `XCommandData`, `XModuleData`
- `XErrorOptions`, `XErrorLevel`, `XErrorMeta`, `XResponseData`, `XFrameScheduler`
Core runtime re-exports:
- `XpellCore`
- `Xpell`, `_x`
- `XUtils`, `_xu`
- `XData`, `_xd`, `_XData`
- `XParser`, `XCommand`, `XLogger`, `_xlog`, `_XLogger`
- `XModule`, `XObject`, `XObjectPack`, `XObjectManager`, `XParams`
- `XError`, `XD_FRAME_NUMBER`, `XD_FPS`, `XpellEngine`
- `XResponse`, `XResponseOK`, `XResponseError`
Wormholes exports:
- Types: `WormholesOpenOptions`, `WormholesClientAPI`, `WHEnvelope`, `WHKind`, `WHEventPayload`, `XCmd`
- Codec helpers: `parseEnvelope`, `stringifyEnvelope`, `makeEnvelope`, `makeHello`, `makeAuth`, `makeReq`, `makeEvt`
- Implementations: `WormholesV1`, `WormholesV2`
- Facade: `Wormholes`, `WormholesFacade`
XUI exports:
- `XUI`, `_xui`, `XUIModule`
- `XUIObject`, `XUIObjectData`
- `XUIObjects` alias for `XUIObjectPack`
- Built-in wrappers: `XView`, `XButton`, `XForm`, `XImage`, `XLabel`, `XLink`, `XList`, `XTextArea`, `XTextField`, `XVideo`, `XWebcam`, `XHTML`, `XInput`, `XSVG`, `XPassword`, `XSVGCircle`, `XSVGEllipse`, `XSVGLine`, `XSVGPolygon`, `XSVGRect`, `XSVGPolyline`, `XSVGPath`
- Animation: `XUIAnimate`, `_AnimateCSS`
- Runtime bootstrap: `XUIRuntime`, `XUIRuntimeOptions`, `XUIRuntimeAppOptions`
XVM exports:
- `XVM`, `_xvm`
- Types: `XVMApp`, `XVMRouteSpec`, `XVMRegionSpec`, `XVMContainerSpec`, `XVMViewFactory`, `RegionConfig`, `NavigateOptions`, `ShowOptions`, `CloseOptions`
- `XVMClient`, `XVMClientOptions`, `XVMClientConnectionChange`
Data, events, and flow exports:
- `XDB`, `_xdb`, `_XDataBase`
- `XEventManager`, `_xem`
- `FlowManagerClient`, `XFM`, `_xfm`
## built-in XUI object types
Declared by `XUIObjectPack.getObjects()`:
- Primary wrappers:
  - `view` -> `XView`
  - `label` -> `XLabel`
  - `link` -> `XLink`
  - `button` -> `XButton`
  - `text` -> `XTextField`
  - `password` -> `XPassword`
  - `input` -> `XInput`
  - `textarea` -> `XTextArea`
  - `video` -> `XVideo`
  - `image` -> `XImage`
  - `list` -> `XList`
  - `form` -> `XForm`
  - `webcam` -> `XWebcam`
  - `xhtml` -> `XHTML`
- HTML aliases:
  - `div` -> `XView`
  - `a` -> `XLink`
  - `header`, `aside`, `main`, `section`, `article`, `nav`, `footer`, `span`, `p`, `ul`, `ol`, `li`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6` -> `XHTML`
- SVG wrappers:
  - `svg` -> `XSVG`
  - `circle` -> `XSVGCircle`
  - `rect` -> `XSVGRect`
  - `ellipse` -> `XSVGEllipse`
  - `line` -> `XSVGLine`
  - `polyline` -> `XSVGPolyline`
  - `polygon` -> `XSVGPolygon`
  - `path` -> `XSVGPath`
## XUI module surface
`XUI` is a singleton `XUIModule` with module name `xui`.
Core methods:
- `load()` sets the UI event manager and fires `xui-loaded`.
- `create(data?)` creates an `XUIObject`; missing `_type` becomes `view`.
- `mount(xobj, parent?)` appends an existing object to a DOM target and calls `onMount()`.
- `add(xData, parent?)` creates and mounts, then queues a tree create pass.
- `append(xobj, parentXobjId)` appends to an existing XUI object by id.
- `wrap(xObjects, wrapper?)` wraps an array of object data in a view-like object.
- `openUrl(url, newWindow?)`, `remove(objectId)`.
- `enableFirstUserGestureEvent(...)`, `waitForFirstUserGesture()`.
- `createPlayer(playerId?, cssClass?, parentElementId?, setAsMainPlayer?)`.
- `show(objectId)`, `hide(objectId)`, `toggle(objectId)`.
Important invariant:
- `mount()` and `add()` do not call `show()` or `onShow()`.
## XUIObject surface
Important data fields:
- `_html_tag`, `_html_ns`, `_html`, `_visible`, `_parent_element`
- `_on_show`, `_on_hide`, `_on_show_animation`, `_on_hide_animation`
- `_flow`, `_flow_event`, `_flow_auto`
- Core inherited fields such as `_children`, `_data_source`, `_on`, `_once`, `_on_create`, `_on_mount`, `_on_frame`, `_on_data`, `_on_event`
Deprecated/removed fields:
- `_on_click` must not be used in new persisted view data.
- Use `_on: { click: ... }` instead.
Event naming:
- DOM event handlers: `_on.click`, `_on.input`, `_once.change`
- XEM event handlers: `_on["xem:event-name"]`, `_once["xem:event-name"]`
- XUIObject strips the `xem:` prefix and registers the listener through the inherited `XObject.addEventListener(...)`.
Important methods:
- DOM/object: `getDOMObject()`, `dom`, `getHTML()`, `attach()`, `mount()`, `append()`, `removeChild()`, `remove()`, `dispose()`
- Text/value/style: `_text`, `setText()`, `getValue()`, `setStyleAttribute()`
- Class helpers: `addClass()`, `removeClass()`, `toggleClass()`, `replaceClass()`
- Visibility/animation: `show()`, `hide()`, `toggle()`, `animate()`, `stopAnimation()`, `click()`
- Lifecycle/patching: `parse(data)`, `onMount()`, `onShow()`, `onHide()`, `update(next)`, child patching by `_id`
- Events: `addEventListener()`, `removeEventListener()`, `removeAllEventListeners()`
Event behavior:
- `_on` / `_once` map DOM event names to handlers.
- `show` and `hide` are lifecycle handlers and are not bound as raw DOM events.
- `_flow` auto-emits `ui:flow-trigger` from the configured DOM event.
- `_flow_event` defaults to `click`.
- `_flow_auto: false` disables automatic flow triggering.
- `_flow` must not execute flows directly and must not call `flow-client` directly.
Built-in XUI Nano-Commands:
- `hide`, `show`, `toggle`
- `set-text`, `set`
- `set-text-from-frame`, `set-text-from-data`
- `add-class`, `remove-class`, `toggle-class`
- `set-style`, `set-attr`, `remove-attr`
- `focus`, `scroll-into-view`
## XVM public behavior
`XVM` is a singleton module with module name `xvm`.
Manifest types:
- `XVMApp` supports `_player`, `_shell`, `_containers`, `_regions`, `_views`, `_routes`, `_router`, and `_start`.
- Views can be raw `XObjectData` or async factories.
- Regions map logical names to container ids and configure history/hash sync.
Core methods:
- Containers/regions: `addContainer`, `getContainer`, `registerRegion`, `setDefaultRegion`
- Registries: `registerRawView`, `registerViewFactory`, `registerRoute`, `getRoute`
- Flow: `add`, `remove`, `show`, `navigate`, `back`, `close`, `clearContainer`, `clearContainerHistory`
- State: `getActiveViewId`, `getCurrentView`, `getViewById`
- App loading: `loadApp`, `app`, `initRouter`
Interpreter ops:
- `_load_app`, `_show`, `_navigate`, `_back`, `_close`, `_help`
Events:
- `xvm-container-added`
- `xvm-app-loaded`
- `xvm:update` is consumed to refresh raw views and by `XVMClient` for live view updates.
Invariants:
- `stackInternal()` calls `target.show()`.
- `add()` only appends; it does not show.
- `navigate()` owns hash writes.
- `clearActive()` hides/removes the active view before stacking the next view.
## XVMClient behavior
Constructor options:
- `app_id`, `env`, `wormhole_url`
- Optional `region`, `fallback_view_id`
- Optional callbacks: `onViewRendered`, `onConnectionChange`, `onError`, `onAppMounted`
Server command surface:
- `server-xvm.get-app`
- `server-xvm.get-view`
- `server-xvm.subscribe`
Cache keys:
- `xvm:last_app:{env}:{app_id}`
- `xvm:version:{env}:{app_id}`
- `xvm:view:{env}:{app_id}:{view_id}`
Events:
- Emits connection changes through callback and `_xem.fire("xvm:connection-change", ...)`.
- Emits view render events as `xvm:view-rendered`.
- Consumes `wormhole-open`, `wormhole-close`, `wormhole-error`, and `xvm:update`.
## XUIRuntime behavior
Types:
- `XUIRuntimeOptions`: `auto_start?`, `load_flow?`, `load_xvm?`
- `XUIRuntimeAppOptions`: `XVMClientOptions` plus optional `runtime`
Methods:
- `XUIRuntime.loadModules(opts?)`
  - loads `XUI`
  - loads `XVM` unless `load_xvm=false`
  - loads a new `FlowManagerClient` unless `load_flow=false`
  - starts `_x` unless `auto_start=false`
- `XUIRuntime.loadApp(opts)`
  - validates `app_id` and `wormhole_url`
  - loads modules
  - creates and bootstraps `XVMClient`
  - stores and returns the client
- `XUIRuntime.getClient()`
## Wormholes behavior
Facade:
- `Wormholes` defaults to v2.
- A URL containing `/wh/v2` selects `WormholesV2`.
- Legacy v1 requires `_allow_v1` or `_force_v1`.
V2 events:
- `wormhole-open`, `wormhole-close`, `wormhole-error`, `wormhole-hello`, `wormhole-auth`
V2 methods:
- `open(opts)`, `close()`, `onOpen(cb)`
- `sendXcmd(xcmd, timeoutMs?)`
- `sendSync(payload, timeoutMs?)`
- `sendEvt(name, data?, args?)`
V2 protocol notes:
- JSON envelope protocol.
- `REQ`/`RES` correlation uses `RES._rid === REQ._id`.
- `HELLO`, `AUTH`, `REQ`, `RES`, `EVT`, `PING`, and `PONG` are envelope kinds.
- `sendXcmd` wraps commands with `makeReq(...)`.
## XDB behavior
`XDB` is browser-local storage infrastructure, exported as `XDB` and `_xdb`.
Core methods:
- `saveString(id, value)`, `getString(id)`
- `saveObject(id, obj)`, `getObject(id)`
- Deprecated aliases: `save`, `load`
- `resetAllData()`
- `encode` toggle for encoded string storage
Constraints:
- Uses `window.localStorage` and `window.sessionStorage`; browser only.
- Intended for runtime cache/local browser storage, especially XVMClient cache.
- Do not use it as hidden server persistence or app domain state when XData/transport contracts are expected.
## XFM / FlowManagerClient behavior
`FlowManagerClient` is exported along with singleton aliases `XFM` and `_xfm`.
Interpreter ops:
- `_bind` with `_flow_id`, `_event`, `_app_id`, optional `_env`
- `_trigger` with `_flow_id`, optional `_event_name`, optional `_event_payload`, optional `_app_id`, optional `_env`, optional `_source`
- `_help`
Normalized trigger payload:
```ts
{
  _flow_id: string;
  _event_name?: string;
  _event_payload?: Record<string, any>;
  _app_id?: string;
  _env?: string;
  _source?: "ui" | "event";
}

Behavior:

* load() registers the global ui:flow-trigger listener through _xem.
* ui:flow-trigger payloads are normalized and forwarded to _trigger.
* _trigger executes _x.execute({ _module: "flow", _op: "run", ... }).
* _bind subscribes a flow to a named _xem event.
* Bound event execution forwards _event_name and _event_payload.
* Bound event execution must skip payloads marked _source: "ui" to avoid duplicate execution.
* Duplicate bindings for the same flow/event/app/env should be ignored.
* FlowManagerClient is the only client-side flow execution owner.
* XUIObject must not call _x.execute({ _module: "flow" ... }) or _x.execute({ _module: "flow-client" ... }) directly.

UI flow trigger shape emitted by XUIObject:

_xem.fire("ui:flow-trigger", {
  _flow_id: "...",
  _event_name: "click",
  _event_payload: {
    type: "click",
    value: "...",
    checked: false
  },
  _object_id: "...",
  _app_id: "...",
  _env: "...",
  _source: "ui"
});

browser-only subsystems

* DOM/UI: document, HTMLElement, CustomEvent, getComputedStyle, window.
* XVM router: window.location.hash, window.location.replace, hashchange.
* Wormholes: WebSocket.
* XDB: window.localStorage, window.sessionStorage.
* Media/fetch: navigator.mediaDevices.getUserMedia, fetch.

repository checks

* Package build: run pnpm build from packages/xpell-ui.
* Type build: run pnpm run build:types from packages/xpell-ui.
* XData guard: run pnpm run check:xdata-legacy from packages/xpell-ui.

