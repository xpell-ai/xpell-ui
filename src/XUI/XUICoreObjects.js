/**
 * XUI Core Objects
 *
 * Object-pack registry for the built-in XUI primitives.
 *
 * This module defines the default mapping between `_type` / HTML tag aliases
 * and their corresponding XUI classes. It is used by the Xpell runtime to
 * materialize UI nodes from JSON/UI schemas (e.g. `XDB.create({ _type })`,
 * view factories, manifests, or dynamic UI generation).
 *
 * ---
 *
 * ## What this pack provides
 *
 * - Canonical XUI primitives (`XView`, `XLabel`, `XButton`, `XInput`, ...)
 * - HTML tag aliases mapped to `XHTML` (e.g. `header`, `section`, `p`, `li`, ...)
 * - Convenience alias: `"div"` → `XView`
 * - SVG primitives (`XSVG`, `XSVGCircle`, `XSVGPath`, ...)
 *
 * ---
 *
 * ## Contract
 *
 * - Keys are `_type` values (or HTML tag aliases)
 * - Values are XUI classes that extend `XUIObject`
 * - Registration order must remain stable to keep `_type` resolution deterministic
 *
 * @packageDocumentation
 * @since 2022-07-22
 * @copyright
 * © 2022–present Aime Technologies. All rights reserved.
 */
import { XUIObject } from "./XUIObject";
import { _x, XObjectPack, _xlog, XObject } from "@xpell/core";
import { _xem } from "../XEM/XEventManager";
export class XView extends XUIObject {
    constructor(data) {
        const defaults = {
            _type: XView._xtype,
            "class": "xview",
            _html_tag: "div"
        };
        super(data, defaults, true);
        this.parse(data);
    }
}
XView._xtype = "view";
export class XForm extends XUIObject {
    constructor(data) {
        const tag = "form";
        const defaults = {
            _type: tag,
            class: "x" + tag,
            _html_tag: tag
        };
        super(data, defaults, true);
        this.parse(data);
    }
}
XForm._xtype = "form";
export class XImage extends XUIObject {
    constructor(data) {
        const defaults = {
            _type: XImage._xtype,
            class: "x" + XImage._xtype,
            _html_tag: "img"
        };
        super(data, defaults, true);
        this.parse(data);
    }
}
XImage._xtype = "image";
export class XVideo extends XUIObject {
    constructor(data) {
        const defaults = {
            _type: XVideo._xtype,
            class: "x" + XVideo._xtype,
            _html_tag: "video"
        };
        super(data, defaults, true);
        this.parse(data);
    }
}
XVideo._xtype = "video";
export class XWebcam extends XUIObject {
    constructor(data) {
        const defaults = {
            _type: XWebcam._xtype,
            class: "x" + XWebcam._xtype,
            _html_tag: "video"
        };
        super(data, defaults, true);
        this.parse(data);
        this.autoplay = true;
        this.muted = true;
        this._video_constraints = {
            video: true,
            width: 320,
            height: 280
        };
    }
    /**
     * this method checks if the browser has "getMedia" support for webcam & mic
     * @returns boolean
     */
    isAvailable() {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }
    setSource(video_elem) {
        navigator.mediaDevices.getUserMedia(this._video_constraints).then((stream) => {
            video_elem.srcObject = stream;
            video_elem.addEventListener('loadeddata', async () => {
                // video_playing = true;
                // await load_hands_model()
                // //ENABLE_CAM_BUTTON.classList.add('removed');
                //detect()
                //if ai
                //_X.run("xai handpose detect")
            });
        });
    }
    get isPlaying() {
        const v = this.getDOMObject();
        return !!(v?.currentTime > 0 && !v?.paused && !v?.ended && v?.readyState > 2);
    }
    async pause() {
        const v = this.getDOMObject();
        v?.pause();
        //Spell.run("xai handpose stop-detect")
    }
}
XWebcam._xtype = "webcam";
/**
 *
 * based on bootstrap card component:
 *
 * <div class="card" style="width: 18rem;">
  <img class="card-img-top" src="..." alt="Card image cap">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
 */
// use with 
export class XTextField extends XUIObject {
    constructor(data) {
        const defaults = {
            _type: XTextField._xtype,
            class: "x" + XTextField._xtype,
            _html_tag: "input"
        };
        super(data, defaults, true);
        this.type = "text"; //default type is text
        if (data._text) {
            this.value = data._text;
        }
        this.parse(data);
    }
    set _text(text) {
        super._text = text;
        if (this._dom_object) {
            (this.dom).value = text;
        }
    }
}
XTextField._xtype = "text";
export class XPassword extends XUIObject {
    constructor(data) {
        const tag = "password";
        const defaults = {
            _type: XPassword._xtype,
            type: "password",
            class: "x" + tag,
            _html_tag: "input"
        };
        super(data, defaults, true);
        this.type = "password"; //default type is password
        if (data._text) {
            this.value = data._text;
        }
        this.parse(data);
    }
    set _text(text) {
        super._text = text;
        if (this._dom_object) {
            (this.dom).value = text;
        }
    }
}
XPassword._xtype = "password";
export class XInput extends XUIObject {
    constructor(data) {
        const tag = "input";
        const defaults = {
            _type: XInput._xtype,
            class: "x" + XInput._xtype,
            _html_tag: "input"
        };
        super(data, defaults, true);
        this.type = "text"; //default type is text
        if (data._text) {
            this.value = data._text;
        }
        this.parse(data);
    }
    set _text(text) {
        super._text = text;
        if (this._dom_object) {
            (this.dom).value = text;
        }
    }
    set _input_type(type) {
        this.type = type;
        if (this._dom_object) {
            (this.dom).type = type;
        }
    }
    get _input_type() {
        return this.dom.getAttribute("type") || "text";
    }
}
XInput._xtype = "input";
export class XTextArea extends XUIObject {
    constructor(data) {
        const defaults = {
            _type: XTextArea._xtype,
            "class": "x" + XTextArea._xtype,
            "_html_tag": "textarea"
        };
        super(data, defaults, true);
        this.parse(data);
    }
    set _text(text) {
        super._text = text;
        if (this._dom_object) {
            this.dom.value = text;
        }
    }
}
XTextArea._xtype = "textarea";
export class XLink extends XUIObject {
    constructor(data) {
        const tag = "link";
        const defaults = {
            _type: XLink._xtype,
            class: "x" + XLink._xtype,
            _html_tag: "a"
        };
        super(data, defaults, true);
        this.parse(data);
    }
}
XLink._xtype = "link";
export class XLabel extends XUIObject {
    constructor(data) {
        const defaults = {
            _type: XLabel._xtype,
            _html_tag: "label",
            class: "xlabel"
        };
        super(data, defaults, true);
        this.parse(data);
        this.addNanoCommand("text", (xCommand, xObject) => {
            xObject._text = xCommand._params?.text || "";
        });
    }
}
XLabel._xtype = "label";
export class XButton extends XUIObject {
    constructor(data) {
        const defs = {
            _type: XButton._xtype,
            class: "xbutton",
            _html_tag: "button"
        };
        super(data, defs, true);
        this.parse(data);
    }
}
XButton._xtype = "button";
export class XList extends XUIObject {
    constructor(data) {
        const defaults = {
            _type: XList._xtype,
            _html_tag: "div",
            class: "xlist",
            _items: []
        };
        super(data, defaults, true);
        super.parse(data);
        if (this._items.length > 0) {
            this._items.forEach((item) => {
                const si = new XView(item);
                this.append(si);
            });
        }
    }
}
XList._xtype = "list";
export class XSVG extends XUIObject {
    constructor(data) {
        const defaults = {
            _type: XSVG._xtype,
            _html_tag: "svg",
            _svg_data: "",
            _html_ns: "http://www.w3.org/2000/svg",
            xmlns: "http://www.w3.org/2000/svg"
        };
        super(data, defaults, true);
        this.parse(data);
        if (this.src && !this._url) {
            this._url = this.src; // set _url from src
        }
    }
    async onMount() {
        super.onMount();
        if (this._url) {
            await this.getFromUrl(this._url);
        }
        else if (this._svg_data) {
            this.getFromData(this._svg_data);
        }
    }
    async animate(className = "fillPulse") {
        //save the current class name
        if (this._dom_object) {
            this._prev_class_name = this._dom_object.className.baseVal; // save the previous class name
            // console.log("Previous class name:", this._prev_class_name);
            // remove the previous class name from the svg element
            this._dom_object.classList.remove(this._prev_class_name);
            void this.dom.offsetWidth;
            this._dom_object.classList.add(className);
        }
    }
    stopAnimation() {
        if (this._dom_object && this._prev_class_name) {
            // remove the current class name from the svg element
            this._dom_object.classList.remove(this._dom_object.className.baseVal);
            // restore the previous class name
            // console.log("Restoring previous class name:", this._prev_class_name);
            void this.dom.offsetWidth;
            this._dom_object.classList.add(this._prev_class_name);
            delete this._prev_class_name; // reset the previous class name
        }
    }
    getDataFromSVGElement(svgData) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = svgData;
        // copy the viewBox and other attributes from the tempDiv to the _dom_object
        const tempSvg = tempDiv.querySelector("svg");
        if (tempSvg) {
            // Copy attributes from tempSvg to _dom_object
            const attributes = tempSvg.attributes;
            const ignoredAttributes = ["class"];
            for (let i = 0; i < attributes.length; i++) {
                const attr = attributes[i];
                if (ignoredAttributes.includes(attr.name))
                    continue; // skip ignored attributes
                this._dom_object.setAttribute(attr.name, attr.value);
            }
        }
        //get the svg path from the tempDiv and set it to the _dom_object
        const svgElement = tempDiv.querySelector("svg");
        if (svgElement) {
            this._dom_object.innerHTML = svgElement.innerHTML;
        }
    }
    /**
     * Load SVG content from external URL and inject into the DOM
     */
    async getFromUrl(url) {
        if (!this._dom_object)
            return;
        try {
            const response = await fetch(url);
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);
            const svgData = await response.text();
            this._svg_data = svgData;
            //load svg data into temp object
            this.getDataFromSVGElement(svgData);
            // this.parse(this); // re-parse if needed
        }
        catch (error) {
            _xlog.error("Error fetching SVG:", error);
        }
    }
    getFromData(data) {
        this._svg_data = data;
        if (this._dom_object) {
            //load svg data into temp object
            this.getDataFromSVGElement(data);
        }
    }
    getSVGData() {
        if (this._dom_object) {
            // return the innerHTML of the svg element
            return this._dom_object.outerHTML;
        }
        return "";
    }
}
XSVG._xtype = "svg";
export class XSVGCircle extends XUIObject {
    constructor(data) {
        const defaults = {
            _type: XSVGCircle._xtype,
            _html_tag: "circle",
            _svg_data: "",
            _html_ns: "http://www.w3.org/2000/svg",
        };
        super(data, defaults, true);
        this.parse(data);
    }
}
XSVGCircle._xtype = "circle";
export class XSVGEllipse extends XUIObject {
    constructor(data) {
        const defaults = {
            _type: XSVGEllipse._xtype,
            _html_tag: "ellipse",
            _svg_data: "",
            _html_ns: "http://www.w3.org/2000/svg",
        };
        super(data, defaults, true);
        this.parse(data);
    }
}
XSVGEllipse._xtype = "ellipse";
export class XSVGRect extends XUIObject {
    constructor(data) {
        const defaults = {
            _type: XSVGRect._xtype,
            _html_tag: "rect",
            _svg_data: "",
            _html_ns: "http://www.w3.org/2000/svg",
        };
        super(data, defaults, true);
        this.parse(data);
    }
}
XSVGRect._xtype = "rect";
export class XSVGLine extends XUIObject {
    constructor(data) {
        const defaults = {
            _type: XSVGLine._xtype,
            _html_tag: "line",
            _svg_data: "",
            _html_ns: "http://www.w3.org/2000/svg",
        };
        super(data, defaults, true);
        this.parse(data);
    }
}
XSVGLine._xtype = "line";
export class XSVGPolyline extends XUIObject {
    constructor(data) {
        const defaults = {
            _type: XSVGPolyline._xtype,
            _html_tag: "polyline",
            _svg_data: "",
            _html_ns: "http://www.w3.org/2000/svg",
        };
        super(data, defaults, true);
        this.parse(data);
    }
}
XSVGPolyline._xtype = "polyline";
export class XSVGPolygon extends XUIObject {
    constructor(data) {
        const defaults = {
            _type: XSVGPolygon._xtype,
            _html_tag: "polygon",
            _svg_data: "",
            _html_ns: "http://www.w3.org/2000/svg",
        };
        super(data, defaults, true);
        this.parse(data);
    }
}
XSVGPolygon._xtype = "polygon";
export class XSVGPath extends XUIObject {
    constructor(data) {
        const defaults = {
            _type: XSVGPath._xtype,
            _html_tag: "path",
            _svg_data: "",
            _html_ns: "http://www.w3.org/2000/svg",
        };
        super(data, defaults, true);
        this.parse(data);
    }
}
XSVGPath._xtype = "path";
export class XHTML extends XUIObject {
    constructor(data) {
        const t = (data?._type ?? "").toString();
        const defaults = {
            _type: XHTML._xtype,
            _html_tag: data["_html_tag"]
                ? data["_html_tag"]
                : (t && t !== XHTML._xtype ? t : "div"),
        };
        super(data, defaults, true);
        this.parse(data);
    }
}
XHTML._xtype = "xhtml";
export class XUIObjectPack extends XObjectPack {
    static getObjects() {
        return {
            [XView._xtype]: XView, // "view"
            "div": XView, //alias for XView
            "header": XHTML,
            "aside": XHTML,
            "main": XHTML,
            "section": XHTML,
            "article": XHTML,
            "nav": XHTML,
            "footer": XHTML,
            "span": XHTML,
            "p": XHTML,
            "a": XLink,
            "ul": XHTML,
            "ol": XHTML,
            "li": XHTML,
            "h1": XHTML, "h2": XHTML, "h3": XHTML, "h4": XHTML, "h5": XHTML, "h6": XHTML,
            [XLabel._xtype]: XLabel, //"label"
            [XLink._xtype]: XLink, //"link"
            [XButton._xtype]: XButton, //"button"
            [XTextField._xtype]: XTextField, //"text"
            [XPassword._xtype]: XPassword, //"password"
            [XInput._xtype]: XInput, //"input"
            [XTextArea._xtype]: XTextArea, //"textarea"
            [XVideo._xtype]: XVideo, //"video"
            [XImage._xtype]: XImage, //"image"
            [XList._xtype]: XList, //"list"
            [XForm._xtype]: XForm, //"form"
            [XWebcam._xtype]: XWebcam, //"webcam"
            [XHTML._xtype]: XHTML, //"xhtml"
            [XSVG._xtype]: XSVG, //"svg"
            [XSVGCircle._xtype]: XSVGCircle, //"circle"
            [XSVGRect._xtype]: XSVGRect, //"rect"
            [XSVGEllipse._xtype]: XSVGEllipse, //"ellipse"
            [XSVGLine._xtype]: XSVGLine, //"line"
            [XSVGPolyline._xtype]: XSVGPolyline, //"polyline"
            [XSVGPolygon._xtype]: XSVGPolygon, //"polygon"
            [XSVGPath._xtype]: XSVGPath, //"path"
        };
    }
}
export default XUIObjectPack;
