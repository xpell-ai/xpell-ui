/**
 * Xpell - Real-Time User Interface Platform
 * Typescript Edition
 * Library Entry Point
 * 
 * @description Universal User Interface (UI) Engine for Javascript supporting devices & browsers
 * @author Fridman Fridman <fridman.tamir@gmail.com>
 * @since  22/07/2022
 * @Copyright Aime Technologies 2022, all right reserved
 *
 *      This program is free software; you can redistribute it and/or
 *		modify it under the terms of the GNU General Public License
 *		as published by the Free Software Foundation; either version
 *		3 of the License, or (at your option) any later version.
 *
 */



/**
 * Xpell Core exports
 */

export * from "xpell-core";
export { default } from "xpell-core";

export {Wormholes,Wormholes as _wh,WormholeEvents,type MessageType} from "./Wormholes/Wormholes"


export {XUI,type XUIApp,XUIModule} from "./XUI/XUI"

export {XUIObject} from "./XUI/XUIObject"

export {XUIObjectPack as XUIObjects,XView,XButton,XForm,XHeader,XImage,XLabel,XLink,XList,XNavBar,
    XTextArea,XTextField,XVideo,XWebcam,
    XHTML,XInput,XSVG,XPassword,XSVGCircle,
    XSVGEllipse,XSVGLine,XSVGPolygon,XSVGRect,XSVGPolyline,XSVGPath
} from "./XUI/XUICoreObjects"


export {XViewManager,type XViewsPack} from "./XUI/XViewManager"


export {XDB,XDB as _xdb,_XDataBase} from "./XDB/XDB"


export {XUIAnimate,_AnimateCSS} from "./XUI/XUIAnimations"
export *  from "./XUI/XVM"

