// ============================================================================
// xpell-ui/src/index.ts
// FIX: stop `export * from "xpell-core"` because it re-exports core _xem/_XEventManager
// and you want xpell-ui to expose the UI-adapted XEventManager as `_xem`.
// This version keeps core types + core engine default, but overrides _xem.
// ============================================================================

/**
 * Xpell — Real-Time User Interface Platform
 * TypeScript Edition
 *
 * Library entry point for xpell-ui.
 */

/* -------------------------------------------------------------------------- */
/* Core exports (SAFE + deterministic)                                        */
/* -------------------------------------------------------------------------- */

// 1) Export ALL core *types* (no runtime collisions)
// Core type surface (explicit = reliable)
export type {
  XValue,
  IXData,
  XObjectData,
  XDataXporter,
  XDataXporterHandler,
  XObjectOnEventIndex,
  XObjectOnEventHandler,
  XEventListener,
  XEventListenerOptions,
  XNanoCommandPack,
  XNanoCommand,
  XCommandData,
  XModuleData,
  XDataObject,
  XDataVariable,
  XErrorOptions,
  XErrorLevel,
  XErrorMeta,
} from "xpell-core";


// 2) Export the core default (XpellEngine instance) as the DEFAULT of xpell-ui
//    If you prefer UI default (XUI) later, change this line.
export { default } from "xpell-core";

// 3) Re-export core runtime symbols explicitly EXCEPT `_xem` / `XEventManager` / `_XEventManager`
//    because xpell-ui must expose the DOM-adapted event manager instead.
export {
  Xpell, _x,

  XUtils,_xu,
  XData,_xd,_XData,
  // type XDataObject,
  // type XDataVariable,

  XParser,

  XCommand,
  // type XCommandData,

  XLogger,
  _xlog,
  _XLogger,

  XModule,
  // type XModuleData,

  XObject,
  XObjectPack,
  
  XObjectManager,


  XParams,

  XError,
  // type XErrorOptions,
  // type XErrorLevel,
  // type XErrorMeta,

  XD_FRAME_NUMBER,
  XD_FPS,
  XpellEngine,
} from "xpell-core";

/* -------------------------------------------------------------------------- */
/* Wormholes                                                                  */
/* -------------------------------------------------------------------------- */

export {
  Wormholes,
  Wormholes as _wh,
  WormholeEvents,
  type MessageType,
} from "./Wormholes/Wormholes";

/* -------------------------------------------------------------------------- */
/* XUI (renderer)                                                             */
/* -------------------------------------------------------------------------- */

export { XUI, XUI as _xui, XUIModule } from "./XUI/XUI";
export { XUIObject } from "./XUI/XUIObject";
export type { XUIObjectData } from "./XUI/XUIObject";

export {
  XUIObjectPack as XUIObjects,
  XView,
  XButton,
  XForm,
  XImage,
  XLabel,
  XLink,
  XList,
  XTextArea,
  XTextField,
  XVideo,
  XWebcam,
  XHTML,
  XInput,
  XSVG,
  XPassword,
  XSVGCircle,
  XSVGEllipse,
  XSVGLine,
  XSVGPolygon,
  XSVGRect,
  XSVGPolyline,
  XSVGPath,
} from "./XUI/XUICoreObjects";

export { XUIAnimate, _AnimateCSS } from "./XUI/XUIAnimations";

/* -------------------------------------------------------------------------- */
/* XVM (SPA runtime)                                                          */
/* -------------------------------------------------------------------------- */

export { XVM, _xvm } from "./XUI/XVM";
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
} from "./XUI/XVM";

/* -------------------------------------------------------------------------- */
/* XDB                                                                        */
/* -------------------------------------------------------------------------- */

export { XDB, XDB as _xdb, _XDataBase } from "./XDB/XDB";

/* -------------------------------------------------------------------------- */
/* XEM (UI adapter overrides core exports)                                    */
/* -------------------------------------------------------------------------- */

// IMPORTANT: xpell-ui owns the public XEventManager on the UI package surface.
// This intentionally shadows core's XEventManager/_xem.

export { XEventManager, XEventManager as _xem, _XEventManager } from "./XEM/XEventManager";
export type { HTMLEventListenersIndex } from "./XEM/XEventManager";
