/**
 * XUIObject — Base Class for Xpell UI Objects
 *
 * The foundational UI node in the XUI layer.
 * `XUIObject` represents a UI element/component (DOM-backed in browser runtimes)
 * and provides the common lifecycle, parsing, state, styling, and event hooks
 * shared by all XUI components (e.g. `XView`, `XLabel`, `XButton`, `XInput`, etc.).
 *
 * ---
 *
 * ## Responsibilities
 *
 * - Normalize and store UI data (`XObjectData`) + defaults
 * - Parse/resolve properties into a runtime-ready object
 * - Manage lifecycle hooks (create/mount/unmount/destroy)
 * - Provide event wiring and update/render triggers
 * - Expose platform-specific bindings (e.g. DOM element reference)
 *
 * ---
 *
 * ## Architectural Rule
 *
 * XUIObject is responsible for **structure** and **binding**.
 * Visibility and navigation are orchestrated by **XVM** (not XUIObject).
 *
 * @class XUIObject
 * @extends XObject
 * @since 2022-07-22
 * @author Tamir Fridman
 * @packageDocumentation
 * @copyright
 * © 2022–present Aime Technologies. All rights reserved.
 */


import {
    XUtils, _xd, XObject, XObjectData, _xem,
    XEventListenerOptions, _xlog, XObjectOnEventIndex,
    XNanoCommand, XDataXporter
} from "xpell-core"
import XUI from "./XUI";
import _xuiobject_basic_nano_commands from "./XUINanoCommands"
const reservedWords = { _children: "child objects" }
const xpellObjectHtmlFieldsMapping: { [k: string]: string } = { "_id": "id", "css-class": "class", "animation": "xyz", "input-type": "type" };
import { XUIAnimate } from "./XUIAnimations"

/**
 *   ADD On Event support
 *  - override addEventListener to add html event listener if object exist
 *  - override removeEventListener to remove html event listener
 *  - check for events in getDOMObject and add them to the object
*/
export class XUIObject extends XObject {

    declare _id: string;
    declare _type: string;
    declare _children: Array<XUIObject | XObjectData>;
    declare _parent: XUIObject | null
    declare _name?: string
    declare _data_source?: string //XData source
    declare _on: XObjectOnEventIndex
    declare _once: XObjectOnEventIndex
    declare _on_create?: string | Function | undefined
    declare _on_mount?: string | Function | undefined
    declare _on_frame?: string | Function | undefined
    declare _on_data?: string | Function | undefined
    declare _on_event?: string | Function | undefined
    declare _process_frame: boolean
    declare _process_data: boolean
    declare protected _xem_options: XEventListenerOptions
    declare protected _nano_commands: { [k: string]: XNanoCommand }
    declare protected _cache_cmd_txt?: string;
    declare protected _cache_jcmd?: any;
    declare protected _event_listeners_ids: { [eventName: string]: string }
    declare protected _xporter: XDataXporter


    // [k:string]: string | null | [] | undefined | Function | boolean | {}
    _html_tag: string
    _html_ns?: string | null
    protected _dom_object: any
    _html?: string | undefined
    _base_display?: string | undefined | null
    // text: string //depracted
    // _text?: string
    #_text: string = ""
    _visible: boolean
    _parent_element?: string //used for mount parent HTML element id
    _on_click?: Function | string
    _on_show?: Function | string
    _on_hide?: Function | string
    _on_show_animation?: string;
    _on_hide_animation?: string;




    constructor(data: XObjectData, defaults: XObjectData, skipParse?: boolean) {
        super(data, defaults, true)
        this._html_tag = "div";
        this._html_ns = null
        this._dom_object = null;
        this._type = "view";
        this._html = "";
        this._children = [];
        this._visible = true
        this._xem_options = <XEventListenerOptions>{ _once: false, _support_html: true }
        this.addXporterDataIgnoreFields(["_dom_object", "_html", "_xem_options", "_on_click", "#_text"])
        super.addNanoCommandPack(_xuiobject_basic_nano_commands)

        if (!skipParse && data) this.parse(data, reservedWords);
    }




    /**
     * Dispose all object memory (destructor)
     */
    async dispose() {

        this._dom_object = undefined
        this._html = undefined
        this._base_display = undefined
        this.#_text = ""
        this._on_click = undefined
        this._on_show = undefined
        this._on_hide = undefined

        super.dispose()
    }


    /**
     * Removes the HTML DOM object from the document
     */
    remove() {
        if (this._dom_object instanceof HTMLElement) {
            this._dom_object.remove(); // removes subtree too
            this._dom_object = null;   // optional: prevent stale refs
        }
    }




    /**
     * Gets the HTML DOM object, if the object is not created yet it will be created
     * @returns the HTML DOM object
     */


    getDOMObject(): HTMLElement {
        if (!this._dom_object) {
            const dom_object = (this._html_ns)
                ? document.createElementNS(this._html_ns, this._html_tag)
                : document.createElement(this._html_tag);

            // 1) apply attributes
            for (const field of Object.keys(this)) {
                if (!this.hasOwnProperty(field)) continue;
                const val = (this as any)[field];
                if (val == null) continue;

                let outName = field;
                if (xpellObjectHtmlFieldsMapping.hasOwnProperty(field)) {
                    outName = xpellObjectHtmlFieldsMapping[field];
                }

                if (!outName.startsWith("_")) {
                    dom_object.setAttribute(outName, String(val));
                }
            }

            // 2) text
            if ((this as any)["_text"] && String((this as any)["_text"]).length > 0) {
                this.#_text = String((this as any)["_text"]);
                dom_object.textContent = this.#_text;
            }

            // 3) children
            if (this._children.length > 0) {
                this._children.forEach((child: any) => {
                    dom_object.appendChild(child.getDOMObject());
                });
            }

            // ✅ 4) initial visibility detection (INLINE ONLY)
            //    This now works because "style" attribute (if provided) was already set.
            const el = dom_object as HTMLElement;

            if (el.hasAttribute("hidden") || el.style.display === "none") {
                this._visible = false;
                // keep it consistent if "hidden" was used:
                if (el.hasAttribute("hidden") && el.style.display !== "none") {
                    el.style.display = "none";
                }
            } else {
                this._visible = true;

                // cache base display only if it exists inline and isn't none
                // (DO NOT default to "block" here)
                if (!this._base_display && el.style.display && el.style.display !== "none") {
                    this._base_display = el.style.display;
                }
            }

            this._dom_object = dom_object;
        }
        return this._dom_object;
    }



    /**
     * DOM Getter 
     * @returns the HTML DOM object same as getDOMObject()
     */
    get dom() {
        return this.getDOMObject()
    }


    set _text(text: string) {
        this.#_text = text
        if (this._dom_object instanceof HTMLElement) {
            this._dom_object.textContent = text
        }
    }

    get _text() {
        return this.#_text
    }

    /**
     * Gets the HTML representation of the object
     * @returns the HTML representation of the object
     */
    getHTML() {
        const dom = this.getDOMObject()
        this._html = dom?.outerHTML;
        return this._html;
    }

    /**
     * Attach the object to HTML element
     * @param parentElementId 
     * @deprecated use "mount" function instead
     */
    attach(parentElementId: string) {
        document.getElementById(parentElementId)?.append(this.getDOMObject())
        this.onMount()
    }

    /**
     * Mount the object to HTML element
     * @param parentElementId 
     * 
     */
    mount(parentElementId: string) {
        const obj = document.getElementById(parentElementId)
        if (obj) {
            obj.appendChild(this.getDOMObject())
            this.onMount()
        }
    }


    /**
     * Append a child object to the XUIObject, if the object is not XUIObject it will be created
     * @param xObject - the child object to append can be XUIObject or XObjectData
     * @returns 
     */
    append(xObject: XUIObject | XObjectData | any) {
        if (!(xObject instanceof XUIObject)) {
            xObject = XUI.create(xObject)
        }
        //this._children.push(<XUIObject>xObject)
        super.append(xObject)
        if (this._dom_object instanceof HTMLElement) {

            this._dom_object.appendChild(xObject.dom)
            //promisify onMount            
            if (!(xObject as any)._mounted) xObject.onMount();
            return xObject
            // const dom = xObject.dom
            // xObject.mount(this._id)

        }
        else {

            return xObject
        }
    }

    /**
     * Removes a child object from the XUIObject
     * @param xObject - the child object to remove
     */
    removeChild(xObject: XUIObject) {
        if (this._dom_object instanceof HTMLElement) {
            try {

                this._dom_object.removeChild(xObject.dom)
            } catch (error) {
                _xlog.log("Error removing child from dom")
            }
        }
        super.removeChild(xObject)
    }


    /**
     * Sets the object text content
     * @param text - the text content
     * @deprecated use _text property instead (e.g. xuiObj._text = "Xpell rulz!")
     */
    setText(text: string) {
        this._text = text
    }

    /**
     * Sets the object CSS style
     * @param attr - the CSS attribute 
     * @param val - the CSS value
     * @example
     * xuiObj.setStyle("background-color","red")
     */
    setStyleAttribute(attr: string, val: string) {
        if (this._dom_object instanceof HTMLElement) {
            this._dom_object.style.setProperty(attr, val)
        }
    }

    /**
     * Adds a css class to the object
     * @param className - the css class name
     */
    addClass(className: string) {
        if (this._dom_object instanceof HTMLElement) {
            this._dom_object.classList.add(className)
        }
    }

    /**
     * Removes a css class from the object
     * @param className - the css class name
     */
    removeClass(className: string) {
        if (this._dom_object instanceof HTMLElement) {
            this._dom_object.classList.remove(className)
        }
    }

    /**
     * Toggles a css class on the object
     * @param className - the css class name
     */
    toggleClass(className: string) {
        if (this._dom_object instanceof HTMLElement) {
            this._dom_object.classList.toggle(className)
        }
    }


    /**
     * Replaces a css class on the object
     * @param oldClass class to be replaced
     * @param newClass new class to replace the old class
     */
    replaceClass(oldClass: string, newClass: string) {

        if (this._dom_object instanceof HTMLElement) {
            this._dom_object.classList.replace(oldClass, newClass)
        } else {
            this.class = newClass
        }
    }


    /**
     * Show the object and trigger onShow (only if visibility actually changes)
     */
    show() {
        const el = this.getDOMObject(); // ensure DOM exists
        if (!(el instanceof HTMLElement)) return;

        const currentDisplay = getComputedStyle(el).getPropertyValue("display");
        if (currentDisplay && currentDisplay !== "none") {
            this._visible = true;
            return;
        }

        if (!this._base_display || this._base_display === "none") {
            this._base_display = "block";
        }

        if (this._on_show_animation) {
            el.classList.add(XUIAnimate._animation_base_class, this._on_show_animation);
            this.addEventListener(
                "animationend",
                () => el.classList.remove(this._on_show_animation as string),
                { _once: true }
            );
        }

        el.style.display = this._base_display;
        this._visible = true;
        this.onShow();
    }

    hide() {
        const el = this.getDOMObject(); // ensure DOM exists
        if (!(el instanceof HTMLElement)) return;

        const computedDisplay = getComputedStyle(el).getPropertyValue("display");
        if (computedDisplay === "none") {
            this._visible = false;
            return;
        }

        if (!this._base_display || this._base_display === "none") {
            this._base_display = computedDisplay || "block";
        }

        this._visible = false;

        if (this._on_hide_animation) {
            el.classList.add(XUIAnimate._animation_base_class, this._on_hide_animation);
            this.addEventListener(
                "animationend",
                () => {
                    el.classList.remove(this._on_hide_animation as string);
                    el.style.display = "none";
                    this.onHide();
                },
                { _once: true }
            );
            return;
        }

        el.style.display = "none";
        this.onHide();
    }



    async animate(animation: string, infinite: boolean = false) {
        if (this._dom_object instanceof HTMLElement) {
            return new Promise((resolve, reject) => {
                this._dom_object.classList.add(XUIAnimate._animation_base_class, animation);
                if (infinite) {
                    this._dom_object.classList.add("animate__infinite")
                    this["_active_animation"] = animation
                    resolve(true)
                } else {
                    this.addEventListener("animationend", () => {
                        this._dom_object.classList.remove(animation);
                        resolve(true)
                    }, { _once: true });
                }
            })
        }
    }

    stopAnimation() {
        if (this._dom_object instanceof HTMLElement && this["_active_animation"]) {
            this._dom_object.classList.remove(<any>this["active-animation"], "animate__infinite");
            delete this["_active_animation"]
        }
    }


    /**
     * This method is used to toggle the object visibility
     */
    toggle() {
        const el = this._dom_object;
        if (el instanceof HTMLElement) {
            const cs = getComputedStyle(el).getPropertyValue("display");
            this._visible = cs !== "none";
        }
        if (this._visible) this.hide();
        else this.show();
    }



    click() {
        if (this._dom_object instanceof HTMLElement) {
            this._dom_object.click()
        }
    }




    /**
     * this method triggered after the HTML DOM object has been mounted by the super
     * it implemented in this class to support the following events for XUIObject:
     * _on_click: (XUIObject,event) => {}
     */

    async onMount() {
        if (this._mounted) return;

        // bind click handler (supports function or nano-command string)
        if (this._on_click) {
            if (typeof this._on_click === "function") {
                this.addEventListener("click", (e) => (this._on_click as any)(this, e));
            } else if (typeof this._on_click === "string") {
                this.addEventListener("click", () => {
                    this.checkAndRunInternalFunction(this._on_click);
                });
            }
        }

        // base lifecycle
        await super.onMount();

        // observe DOM state only (no forcing)
        const el = this._dom_object;
        if (el instanceof HTMLElement) {
            try {
                const cs = getComputedStyle(el).getPropertyValue("display");
                this._visible = cs !== "none";

                // cache only if currently visible
                if (!this._base_display && cs && cs !== "none") {
                    this._base_display = cs;
                }
            } catch {
                // don't guess base_display here
                this._visible = true;
            }
        } else {
            this._visible = true;
        }

        this._mounted = true;
    }





    /**
     * this method triggered when the XUIObject is shown
     */
    async onShow() {
        if (this._on_show) {
            this.checkAndRunInternalFunction(this._on_show)
        } else if (this._on && this._on.show) {
            this.checkAndRunInternalFunction(this._on.show)
        } else if (this._once && this._once.show) {
            this.checkAndRunInternalFunction(this._once.show)
        }

        this._children.forEach((child: any) => {
            if (child.onShow && typeof child.onShow === 'function') {
                child.onShow()
            }
        })
    }

    /**
     * this method triggered when the XUIObject is hidden
     */
    async onHide() {
        if (this._on_hide) {
            this.checkAndRunInternalFunction(this._on_hide)
        } else if (this._on && this._on.hide) {
            this.checkAndRunInternalFunction(this._on.hide)
        } else if (this._once && this._once.hide) {
            this.checkAndRunInternalFunction(this._once.hide)
        }

        this._children.forEach((child: any) => {
            if (child.onHide && typeof child.onHide === 'function') {
                child.onHide()
            }
        })
    }

}

export default XUIObject

