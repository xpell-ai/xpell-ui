// ============================================================================
// xpell-ui/src/index.ts
// - Explicit core exports to avoid collisions
// - xpell-ui overrides `_xem` with DOM-adapted XEventManager
// - Clean Wormholes surface (v1 + v2 + facade)
// ============================================================================
// 2) (Optional) default export — keep only if intentional
export { default as XpellCore } from "@xpell/core";
// 3) Explicit core runtime exports (exclude core XEM)
export { Xpell, _x, XUtils, _xu, XData, _xd, _XData, XParser, XCommand, XLogger, _xlog, _XLogger, XModule, XObject, XObjectPack, XObjectManager, XParams, XError, XD_FRAME_NUMBER, XD_FPS, XpellEngine, XResponse, XResponseOK, XResponseError, } from "@xpell/core";
export { 
// helpful for advanced users / debugging
parseEnvelope, stringifyEnvelope, makeEnvelope, makeHello, makeAuth, makeReq, makeEvt, } from "./Wormholes/wh.codec";
// Implementations (explicit)
export { default as WormholesV1 } from "./Wormholes/Wormholes.v1";
export { default as WormholesV2 } from "./Wormholes/Wormholes.v2";
// Facade (default export = singleton instance)
// NOTE: This file should export:
//  - default Wormholes (singleton)
//  - export { Wormholes } (named singleton) optional
//  - export class WormholesFacade (class)
export { default as Wormholes } from "./Wormholes/Wormholes";
export { WormholesFacade } from "./Wormholes/Wormholes";
/* -------------------------------------------------------------------------- */
/* XUI (renderer)                                                             */
/* -------------------------------------------------------------------------- */
export { XUI, XUI as _xui, XUIModule } from "./XUI/XUI";
export { XUIObject } from "./XUI/XUIObject";
export { XUIObjectPack as XUIObjects, XView, XButton, XForm, XImage, XLabel, XLink, XList, XTextArea, XTextField, XVideo, XWebcam, XHTML, XInput, XSVG, XPassword, XSVGCircle, XSVGEllipse, XSVGLine, XSVGPolygon, XSVGRect, XSVGPolyline, XSVGPath, } from "./XUI/XUICoreObjects";
export { XUIAnimate, _AnimateCSS } from "./XUI/XUIAnimations";
/* -------------------------------------------------------------------------- */
/* XVM (SPA runtime)                                                          */
/* -------------------------------------------------------------------------- */
export { XVM, _xvm } from "./XVM/XVM";
export { XVMClient } from "./XVM/XVMClient";
/* -------------------------------------------------------------------------- */
/* XDB                                                                        */
/* -------------------------------------------------------------------------- */
export { XDB, XDB as _xdb, _XDataBase } from "./XDB/XDB";
/* -------------------------------------------------------------------------- */
/* XEM (UI adapter overrides core exports)                                    */
/* -------------------------------------------------------------------------- */
export { XEventManager, XEventManager as _xem, _XEventManager } from "./XEM/XEventManager";
