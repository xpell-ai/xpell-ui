/**
 * Xpell — Real-Time User Interface Platform
 * TypeScript Edition
 *
 * Library entry point for the Xpell runtime core.
 *
 * Xpell is a universal real-time UI engine for JavaScript,
 * designed to run across browsers and devices with a
 * component-based, event-driven architecture.
 *
 * @packageDocumentation
 * @author Tamir Fridman
 * @since 2022-07-22
 * @copyright
 * © 2022–present Aime Technologies. All rights reserved.
 */


/* -------------------------------------------------------------------------- */
/* Core exports                                                               */
/* -------------------------------------------------------------------------- */

export * from "xpell-core";
export { default } from "xpell-core";

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
/* XVM (SPA runtime) - explicit exports (no wildcard)                         */
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
