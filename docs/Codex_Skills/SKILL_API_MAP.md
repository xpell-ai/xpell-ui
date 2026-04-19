# @xpell/ui Skill API Map (code-derived)

## package.json exports map summary

- Package: `@xpell/ui`
- Version: `2.0.0-alpha.5`
- `exports`:
  - `"."`:
    - `types`: `./dist/types/index.d.ts`
    - `import`: `./dist/xpell-ui.es.js`
    - `require`: `./dist/xpell-ui.cjs.js`
  - `"./package.json"`: `./package.json`
- No additional subpath entrypoints are exported.

## entrypoints and what they export

- Source entrypoint: `src/index.ts` (mirrored by `dist/index.d.ts`)
- Build entrypoints:
  - ESM runtime: `dist/xpell-ui.es.js`
  - CJS runtime: `dist/xpell-ui.cjs.js`
  - Types: `dist/types/index.d.ts` -> `export * from '../index'`

### Public root exports (`src/index.ts`)

- Core re-exported runtime symbols:
  - `XpellCore` (default export from `@xpell/core` as named)
  - `Xpell`, `_x`, `XUtils`, `_xu`, `XData`, `_xd`, `_XData`, `XParser`, `XCommand`, `XLogger`, `_xlog`, `_XLogger`, `XModule`, `XObject`, `XObjectPack`, `XObjectManager`, `XParams`, `XError`, `XD_FRAME_NUMBER`, `XD_FPS`, `XpellEngine`, `XResponse`, `XResponseOK`, `XResponseError`
- Core re-exported types:
  - `XValue`, `IXData`, `XObjectData`, `XDataXporter`, `XDataXporterHandler`, `XObjectOnEventIndex`, `XObjectOnEventHandler`, `XEventListener`, `XEventListenerOptions`, `XNanoCommandPack`, `XNanoCommand`, `XCommandData`, `XModuleData`, `XErrorOptions`, `XErrorLevel`, `XErrorMeta`, `XResponseData`, `XFrameScheduler`
- Wormholes exports:
  - Types: `WormholesOpenOptions`, `WormholesClientAPI`, `WHEnvelope`, `WHKind`, `WHEventPayload`, `XCmd`
  - Codec helpers: `parseEnvelope`, `stringifyEnvelope`, `makeEnvelope`, `makeHello`, `makeAuth`, `makeReq`, `makeEvt`
  - Implementations: `WormholesV1`, `WormholesV2`
  - Facade: `Wormholes` (singleton), `WormholesFacade`
- XUI exports:
  - `XUI`, `_xui`, `XUIModule`
  - `XUIObject`, `XUIObjectData`
  - `XUIObjects` (`XUIObjectPack`) and wrappers
  - `XUIAnimate`, `_AnimateCSS`
- XVM exports:
  - `XVM`, `_xvm`
  - Types: `XVMApp`, `XVMRouteSpec`, `XVMRegionSpec`, `XVMContainerSpec`, `XVMViewFactory`, `RegionConfig`, `NavigateOptions`, `ShowOptions`, `CloseOptions`
  - `XVMClient`, `XVMClientOptions`, `XVMClientConnectionChange`
- XDB exports:
  - `XDB`, `_xdb`, `_XDataBase`
- XEM exports:
  - `XEventManager`, `_xem`, `_XEventManager`, `HTMLEventListenersIndex`

## list of built-in XUI object types

Declared in `XUIObjectPack.getObjects()`:

- Primary wrappers:
  - `view` (`XView`)
  - `label` (`XLabel`)
  - `link` (`XLink`)
  - `button` (`XButton`)
  - `text` (`XTextField`)
  - `password` (`XPassword`)
  - `input` (`XInput`)
  - `textarea` (`XTextArea`)
  - `video` (`XVideo`)
  - `image` (`XImage`)
  - `list` (`XList`)
  - `form` (`XForm`)
  - `webcam` (`XWebcam`)
  - `xhtml` (`XHTML`)
- SVG wrappers:
  - `svg` (`XSVG`)
  - `circle` (`XSVGCircle`)
  - `rect` (`XSVGRect`)
  - `ellipse` (`XSVGEllipse`)
  - `line` (`XSVGLine`)
  - `polyline` (`XSVGPolyline`)
  - `polygon` (`XSVGPolygon`)
  - `path` (`XSVGPath`)
- HTML aliases mapped via pack:
  - `div` -> `XView`
  - `header`, `aside`, `main`, `section`, `article`, `nav`, `footer`, `span`, `p`, `ul`, `ol`, `li`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6` -> `XHTML`
  - `a` -> `XLink`

## list of special objects (XView, XForm, XSVG, etc.)

- `XView`: default structural container.
- `XForm`: form wrapper (`_html_tag: form`).
- `XList`: list-like wrapper with `_items` to child views.
- `XHTML`: generic wrapper that maps `_type` to HTML tag.
- `XSVG`: SVG root loader/parser with optional `fetch` by `_url`/`src`.
- `XWebcam`: media wrapper using `navigator.mediaDevices.getUserMedia`.
- `XUIObject`: base UI class, lifecycle, DOM materialization, class/style utilities.
- `XUIModule` (`XUI` singleton): creation/mount/player/root utilities.
- `_XVM` (`XVM` singleton): regions/routes/history/navigation.
- `XVMClient`: server-driven app/view bootstrap over Wormholes.
- `WormholesFacade`: v2-first transport selector with v1 fallback controls.

## singletons re-exported

- Core singletons from `@xpell/core`:
  - `_x`, `_xd`, `_xu`, `_xlog`
- UI singletons:
  - `XUI` and `_xui` (same singleton)
  - `XVM` and `_xvm` (same singleton)
  - `XEventManager` and `_xem` (same singleton)
  - `XDB` and `_xdb` (same singleton)
  - `Wormholes` (facade singleton)
  - `XUIAnimate` (animation singleton)

## browser-only subsystems

Code paths that require browser globals:

- DOM renderer (`XUIObject`, `XUI`): `document`, `HTMLElement`, `window`, `CustomEvent`, `getComputedStyle`.
- Router/navigation (`XVM`): `window.location.hash`, `hashchange` event.
- Transport (`WormholesV1`, `WormholesV2`): `WebSocket`.
- Local persistence (`XDB`, used by `XVMClient` cache): `window.localStorage`, `window.sessionStorage`.
- Media and fetch wrappers:
  - `XWebcam`: `navigator.mediaDevices.getUserMedia`
  - `XSVG`: `fetch(url)`
