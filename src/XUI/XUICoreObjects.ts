/**
 * XUI Core Objects 
 * @description XUI Core Objects are the basic building blocks of the XUI Framework
 * @since  22/07/2022
 * @copyright Aime Technologies 2022, all right reserved
 */
import XUIObject from "./XUIObject";
import {_x,XObjectData,XObjectPack ,_xem, _xlog} from "../Core/Xpell"



export class XView extends XUIObject {

    static _xtype = "view"

    constructor(data:XObjectData) {
        const defaults =  {
            _type: XView._xtype,
            "class":"xview",
            _html_tag: "div"
        };
        super(data, defaults, true);
        this.parse(data);
    }
}


export class XHeader extends XUIObject {
    static _xtype = "header"
    constructor(data:XObjectData) {
        const defaults = {
            _type: XHeader._xtype,
            class:"x" + XHeader._xtype,
            _html_tag:"header"
        }
         super(data, defaults, true);
        this.parse(data);
    }
}

export class XNavBar extends XUIObject {
    static _xtype = "navbar"
    constructor(data:XObjectData) {
        
        const defaults = {
            _type: XNavBar._xtype,
            class:"x" + XNavBar._xtype,
            _html_tag:"nav"
        }
         super(data, defaults, true);
        this.parse(data);
    }
}

export class XForm extends XUIObject {
    static _xtype = "form"
    constructor(data:XObjectData) {
        const tag = "form"
        const defaults = {
            _type: tag,
            class:"x" + tag,
            _html_tag:tag
        }
        super(data,defaults, true);
        this.parse(data)
    }
}


export class XImage extends XUIObject {
   
    static _xtype = "image"

    constructor(data:XObjectData) {
        const defaults = {
            _type: XImage._xtype,
            class:"x" + XImage._xtype,
            _html_tag:"img"
        }
        super(data,defaults, true);
        this.parse(data)
    }
}

export class XVideo extends XUIObject {
    static _xtype = "video"
    constructor(data:XObjectData) {
        const defaults = {
            _type: XVideo._xtype,
            class:"x" + XVideo._xtype,
            _html_tag:"video"
        }
        super(data,defaults, true);
        this.parse(data)

    }
}


export class XWebcam extends XUIObject {
    static _xtype = "webcam"
    autoplay: boolean;
    muted: boolean;
    _video_constraints: { video: boolean; width: number; height: number; };
    
    constructor(data:XObjectData) {
        const defaults = {
            _type: XWebcam._xtype,
            class:"x" + XWebcam._xtype,
            _html_tag:"video"
        }
        super(data,defaults,true)
        this.parse(data)

        this.autoplay = true
        this.muted = true
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

    setSource(video_elem:any) {

        navigator.mediaDevices.getUserMedia(this._video_constraints).then((stream) => {
            video_elem.srcObject = stream;
            video_elem.addEventListener('loadeddata',async  () => {
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
        const v:any   = this.getDOMObject()
        return !!(v?.currentTime > 0 && !v?.paused && !v?.ended && v?.readyState > 2);
    }

    async pause() {
        const v:any   = this.getDOMObject()
        v?.pause()
        //Spell.run("xai handpose stop-detect")
    }

}


export class XTextField extends XUIObject {
    static _xtype = "text"
    type: string = "text" //default type is text
    constructor(data:XObjectData) {
        const defaults = {
            _type : XTextField._xtype,
            class:"x" + XTextField._xtype,
            _html_tag:"input"
        }
        super(data,defaults,true);
        if(data._text) {
            this.value = data._text
        }
        this.parse(data)
    }

    set _text(text:string) {
        super._text = text     
        if(this._dom_object) {
            (<HTMLInputElement>(this.dom)).value = text
        }
    }
}

export class XPassword extends XUIObject {
    static _xtype = "password"
    type: string = "password" //default type is password
    constructor(data:XObjectData) {
        const tag = "password"
        const defaults = {
            _type : XPassword._xtype,
            type:"password",
            class:"x" + tag,
            _html_tag:"input"
        }
        super(data,defaults,true);
        if(data._text) {
            this.value = data._text
        }
        this.parse(data)
        
        
    }

    set _text(text:string) {
        super._text = text     
        if(this._dom_object) {
            (<HTMLInputElement>(this.dom)).value = text
        }
    }
}


export class XInput extends XUIObject {
    static _xtype = "input"
    type: string = "text" //default type is text
    constructor(data:XObjectData) {
        const tag = "input"
        const defaults = {
            _type : XInput._xtype,
            class:"x" + XInput._xtype,
            _html_tag:"input"
        }
        super(data,defaults,true);
        if(data._text) {
            this.value = data._text
        }
        this.parse(data)
        
        
    }

    set _text(text:string) {
        super._text = text     
        if(this._dom_object) {
            (<HTMLInputElement>(this.dom)).value = text
        }
    }

    set _input_type(type:string) {
        this.type = type;
        if(this._dom_object) {
            (<HTMLInputElement>(this.dom)).type = type
        }
    }

    get _input_type() {
        return this.dom.getAttribute("type") || "text";
    }
}


export class XTextArea extends XUIObject {
    static _xtype = "textarea"
    constructor(data:XObjectData) {
        const defaults = {
            _type:XTextArea._xtype,
            "class":"x" + XTextArea._xtype,
            "_html_tag":"textarea"
        }
        super(data,defaults,true);
        this.parse(data)
        
        
    }

    set _text(text:string) {
        super._text = text     
        if(this._dom_object) {
            (<HTMLInputElement>(this.dom)).value = text
        }
    }

}

export class XLink extends XUIObject {
    static _xtype = "link"
    
    constructor(data:XObjectData) {
        const tag = "link"
        const defaults = {
            _type : XLink._xtype,
            class:"x" + XLink._xtype,
            _html_tag:"a"
        }
         super(data, defaults, true);
        this.parse(data);
    }
}

export class XLabel extends XUIObject {    
    static _xtype = "label"
    constructor(data:XObjectData) {
        const defaults = {
            _type:XLabel._xtype,
            _html_tag:"label",
            class:"xlabel"
        }
        super(data,defaults, true);
        this.parse(data)
    }
}

export class XHTML extends XUIObject {    
    static _xtype = "xhtml"
    constructor(data:XObjectData) {
        const defaults = {
            _type:XHTML._xtype,
            _html_tag: (data["_html_tag"]) ?data["_html_tag"] : "div"

        }
        super(data,defaults, true);
        this.parse(data)
    }
}





export class XButton extends XUIObject {
    static _xtype = "button"

    constructor(data:XObjectData) {
        const defs = {
            _type : XButton._xtype,
            class:"xbutton",
            _html_tag :"button"
        }
        super(data,defs);        
    }
    
    setOnclick(fun:CallableFunction)
    {
        this._on_click = fun;
    }
}


export class XList extends XUIObject {
    static _xtype = "list";
    _items: any;
    constructor(data:XObjectData) {
    
        const defaults = {
            _type:XList._xtype,
            _html_tag:"div",
            class:"xlist",
            _items:[]
        }
        super(data,defaults,true);
        super.parse(data)
        if(this._items.length>0) {
            this._items.forEach((item:any) => {
                const si = new XView(item)
                this.append(si)
            });
        }
    }
}



export class XSVG extends XUIObject {

    static _xtype = "svg";


    private _svg_data!: string;
    _url: string | undefined;
    src: string | undefined // alias for _url to maintain compatibility with older code for HTML <img> tag

    constructor(data: XObjectData) {
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

    async onMount(): Promise<void> {
        super.onMount();
        if (this._url) {
            await this.getFromUrl(this._url);
        } else if (this._svg_data) {
            this.getFromData(this._svg_data);
        }
    }


    async animate(className: string = "fillPulse") {

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

    stopAnimation(): void {
        if (this._dom_object && this._prev_class_name) {
            // remove the current class name from the svg element
            this._dom_object.classList.remove(this._dom_object.className.baseVal);
            // restore the previous class name
            // console.log("Restoring previous class name:", this._prev_class_name);
            void this.dom.offsetWidth;

            this._dom_object.classList.add(this._prev_class_name);
            delete this._prev_class_name  // reset the previous class name
        }
    }

    private getDataFromSVGElement(svgData: string): any {
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
                if (ignoredAttributes.includes(attr.name)) continue; // skip ignored attributes
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
    async getFromUrl(url: string) {
        if (!this._dom_object) return;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const svgData = await response.text();
            this._svg_data = svgData;
            //load svg data into temp object
            this.getDataFromSVGElement(svgData);


            // this.parse(this); // re-parse if needed
        } catch (error) {
            _xlog.error("Error fetching SVG:", error);
        }
    }

    getFromData(data: string) {
        this._svg_data = data;
        if (this._dom_object) {
            //load svg data into temp object
            this.getDataFromSVGElement(data);


        }
    }

    getSVGData(): string {
        if (this._dom_object) {
            // return the innerHTML of the svg element
            return this._dom_object.outerHTML;
        }
        return "";
    }
}



export class XSVGCircle extends XUIObject {
    static _xtype = "circle"

    constructor(data:XObjectData) {
        const defaults = {
            _type:XSVGCircle._xtype,
            _html_tag: "circle",
            _svg_data: "",
            _html_ns: "http://www.w3.org/2000/svg",

        }
        super(data, defaults, true);
        this.parse(data);
    }
}

export class XSVGEllipse extends XUIObject {
    static _xtype = "ellipse"

    constructor(data:XObjectData) {
        const defaults = {
            _type:XSVGEllipse._xtype,
            _html_tag: "ellipse",
            _svg_data: "",
            _html_ns: "http://www.w3.org/2000/svg",

        }
        super(data, defaults, true);
        this.parse(data);
    }
}

export class XSVGRect extends XUIObject {
    static _xtype = "rect"

    constructor(data:XObjectData) {
        const defaults = {
            _type:XSVGRect._xtype,
            _html_tag: "rect",
            _svg_data: "",
            _html_ns: "http://www.w3.org/2000/svg",

        }
         super(data, defaults, true);
        this.parse(data);
    }
}

export class XSVGLine extends XUIObject {
    static _xtype = "line"

    constructor(data:XObjectData) {
        const defaults = {
            _type:XSVGLine._xtype,
            _html_tag: "line",
            _svg_data: "",
            _html_ns: "http://www.w3.org/2000/svg",

        }
         super(data, defaults, true);
        this.parse(data);
    }
}

export class XSVGPolyline extends XUIObject {
    static _xtype = "polyline" 

    constructor(data:XObjectData) {
        const defaults = {
            _type: XSVGPolyline._xtype,
            _html_tag: "polyline",
            _svg_data: "",
            _html_ns: "http://www.w3.org/2000/svg",

        }
         super(data, defaults, true);
        this.parse(data);
    }
}

export class XSVGPolygon extends XUIObject {
    static _xtype = "polygon"

    constructor(data:XObjectData) {
        const defaults = {
            _type:XSVGPolygon._xtype,
            _html_tag: "polygon",
            _svg_data: "",
            _html_ns: "http://www.w3.org/2000/svg",

        }
         super(data, defaults, true);
        this.parse(data);
    }
}

export class XSVGPath extends XUIObject {
    static _xtype = "path"

    constructor(data:XObjectData) {
        const defaults = {
            _type:XSVGPath._xtype,
            _html_tag: "path",
            _svg_data: "",
            _html_ns: "http://www.w3.org/2000/svg",

        }
         super(data, defaults, true);
        this.parse(data);
    }
}

export class XUIObjects extends XObjectPack {
    static getObjects() {
        return {
            [XView._xtype]:XView,
            "div":XView, //alias for XView
            [XLabel._xtype]:XLabel,
            [XLink._xtype]:XLink,
            [XButton._xtype]:XButton,
            [XTextField._xtype]:XTextField,
            [XPassword._xtype]:XPassword,
            [XInput._xtype]:XInput,
            [XTextArea._xtype]:XTextArea,
            [XVideo._xtype]:XVideo,
            [XImage._xtype]:XImage,
            [XList._xtype]:XList,
            [XForm._xtype]:XForm,
            [XWebcam._xtype]:XWebcam,
            [XHTML._xtype]:XHTML,
            [XSVG._xtype]:XSVG,
            [XSVGCircle._xtype]:XSVGCircle,
            [XSVGRect._xtype]:XSVGRect,
            [XSVGEllipse._xtype]:XSVGEllipse,
            [XSVGLine._xtype]:XSVGLine,
            [XSVGPolyline._xtype]:XSVGPolyline,
            [XSVGPolygon._xtype]:XSVGPolygon,
            [XSVGPath._xtype]:XSVGPath,
            // "grid" : TO-DO,
            // "table": TO-DO,
        }
    }
}





export default XUIObjects


