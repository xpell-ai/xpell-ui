// ============================================================================
// xpell-ui/src/XUI/XUIObject.ts
// PATCH: make XUIObject overrides compatible with XObject (TS5 strict)
// - Do NOT override base fields with incompatible types
// - Keep UI convenience by casting where needed (runtime unchanged)
// ============================================================================

import {
    _xd, XObject, type XObjectData,
    type XEventListenerOptions, _xlog, type XObjectOnEventIndex,
    type XNanoCommand, type XDataXporter
} from "xpell-core";

import { _xem } from "../XEM/XEventManager"

import XUI from "./XUI";
import _xuiobject_basic_nano_commands from "./XUINanoCommands";
import { XUIAnimate } from "./XUIAnimations";

const reservedWords = { _children: "child objects" };
const xpellObjectHtmlFieldsMapping: { [k: string]: string } = { "_id": "id", "css-class": "class", "animation": "xyz", "input-type": "type" };

export type XUIHandler = Function | string;


export interface XUIObjectData extends XObjectData {
    _html_tag?: string;
    _html_ns?: string | null;
    _html?: string;
    _visible?: boolean;
    _parent_element?: string;
    _on_click?: Function | string;
    _on_show?: Function | string;
    _on_hide?: Function | string;
    _on_show_animation?: string;
    _on_hide_animation?: string;
}

export class XUIObject extends XObject {

    declare _id: string;
    declare _type: string;

    // ✅ MUST match base XObject contract (TS override compatibility)
    declare _children: Array<XObject | XObjectData>;
    declare _parent: XObject | null;

    declare _name?: string;
    declare _data_source?: string;
    declare _on: XObjectOnEventIndex;
    declare _once: XObjectOnEventIndex;
    declare _on_create?: string | Function | undefined;
    declare _on_mount?: string | Function | undefined;
    declare _on_frame?: string | Function | undefined;
    declare _on_data?: string | Function | undefined;
    declare _on_event?: string | Function | undefined;
    declare _process_frame: boolean;
    declare _process_data: boolean;

    declare protected _xem_options: XEventListenerOptions;
    declare protected _nano_commands: { [k: string]: XNanoCommand };
    declare protected _cache_cmd_txt?: string;
    declare protected _cache_jcmd?: any;

    // ✅ MUST match base XObject contract (string[] not string)
    declare protected _event_listeners_ids: { [eventName: string]: string[] };

    declare protected _xporter: XDataXporter;

    _html_tag: string;
    _html_ns?: string | null;
    protected _dom_object: any;
    _html?: string | undefined;
    _base_display?: string | undefined | null;
    #_text: string = "";
    _visible: boolean;
    _parent_element?: string;
    _on_click?: Function | string;
    _on_show?: Function | string;
    _on_hide?: Function | string;
    _on_show_animation?: string;
    _on_hide_animation?: string;

    constructor(data: XUIObjectData, defaults: XUIObjectData, skipParse?: boolean) {
        super(data, defaults, true);
        this._html_tag = "div";
        this._html_ns = null;
        this._dom_object = null;
        this._type = "view";
        this._html = "";
        this._children = [];
        this._visible = true;

        // NOTE: _support_html is UI-only. If core typings don't have it, keep cast.
        this._xem_options = <any>{ _once: false, _support_html: true };

        this.addXporterDataIgnoreFields(["_dom_object", "_html", "_xem_options", "_on_click", "#_text"]);
        super.addNanoCommandPack(_xuiobject_basic_nano_commands);

        if (!skipParse && data) this.parse(data, reservedWords);
    }

    // --------------------------------------------------------------------------
    // UI convenience typed accessors (DO NOT change base field types)
    // --------------------------------------------------------------------------
    get ui_parent(): XUIObject | null {
        return (this._parent as any) as XUIObject | null;
    }

    get ui_children(): XUIObject[] {
        return this._children.filter((c: any) => c instanceof XUIObject) as any;
    }

    // --------------------------------------------------------------------------

    async dispose() {
        this._dom_object = undefined;
        this._html = undefined;
        this._base_display = undefined;
        this.#_text = "";
        this._on_click = undefined;
        this._on_show = undefined;
        this._on_hide = undefined;

        super.dispose();
    }

    remove() {
        if (this._dom_object instanceof HTMLElement) {
            this._dom_object.remove();
            this._dom_object = null;
        }
    }

    getDOMObject(): HTMLElement {
        if (!this._dom_object) {
            const dom_object = (this._html_ns)
                ? document.createElementNS(this._html_ns, this._html_tag)
                : document.createElement(this._html_tag);

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

            if ((this as any)["_text"] && String((this as any)["_text"]).length > 0) {
                this.#_text = String((this as any)["_text"]);
                dom_object.textContent = this.#_text;
            }

            if (this._children.length > 0) {
                this._children.forEach((child: any) => {
                    dom_object.appendChild(child.getDOMObject());
                });
            }

            const el = dom_object as HTMLElement;

            if (el.hasAttribute("hidden") || el.style.display === "none") {
                this._visible = false;
                if (el.hasAttribute("hidden") && el.style.display !== "none") {
                    el.style.display = "none";
                }
            } else {
                this._visible = true;
                if (!this._base_display && el.style.display && el.style.display !== "none") {
                    this._base_display = el.style.display;
                }
            }

            this._dom_object = dom_object;
        }
        return this._dom_object;
    }

    get dom() {
        return this.getDOMObject();
    }

    set _text(text: string) {
        this.#_text = text;
        if (this._dom_object instanceof HTMLElement) {
            this._dom_object.textContent = text;
        }
    }

    get _text() {
        return this.#_text;
    }

    getHTML() {
        const dom = this.getDOMObject();
        this._html = dom?.outerHTML;
        return this._html;
    }

    attach(parentElementId: string) {
        document.getElementById(parentElementId)?.append(this.getDOMObject());
        this.onMount();
    }

    mount(parentElementId: string) {
        const obj = document.getElementById(parentElementId);
        if (obj) {
            obj.appendChild(this.getDOMObject());
            this.onMount();
        }
    }

    append(xObject: XUIObject | XObjectData | any) {
        if (!(xObject instanceof XUIObject)) {
            xObject = XUI.create(xObject);
        }

        super.append(xObject); // base handles _children/_parent types

        if (this._dom_object instanceof HTMLElement) {
            this._dom_object.appendChild((xObject as XUIObject).dom);
            if (!(xObject as any)._mounted) (xObject as XUIObject).onMount();
            return xObject;
        }

        return xObject;
    }

    /**
   * UI override: bind DOM events via UI XEventManager adapter.
   * This keeps legacy behavior:
   * - addEventListener("click", ...) binds to DOM when possible
   * - listener ids are tracked in _event_listeners_ids[eventName] as string[]
   */
    addEventListener(eventName: string, handler: any, options: XEventListenerOptions = {} as any): string {
        const id = (_xem as any).on(eventName, handler, { ...(options as any), _support_html: true }, this);

        if (!this._event_listeners_ids) (this as any)._event_listeners_ids = {};
        if (!this._event_listeners_ids[eventName]) this._event_listeners_ids[eventName] = [];
        this._event_listeners_ids[eventName].push(id);

        return id;
    }

    /**
     * UI override: remove a specific listener id (both DOM + bus) via UI _xem.
     */
    removeEventListener(listenerId: string): void {
        try {
            (_xem as any).remove(listenerId);
        } catch (e) {
            // ignore
        }

        // cleanup index
        if (!this._event_listeners_ids) return;
        for (const [ev, ids] of Object.entries(this._event_listeners_ids)) {
            const idx = (ids as string[]).indexOf(listenerId);
            if (idx >= 0) (ids as string[]).splice(idx, 1);
            if ((ids as string[]).length === 0) delete this._event_listeners_ids[ev];
        }
    }

    /**
     * UI override convenience: remove ALL listeners for an eventName.
     */
    removeAllEventListeners(eventName?: string): void {
        if (!this._event_listeners_ids) return;

        const keys = eventName ? [eventName] : Object.keys(this._event_listeners_ids);
        for (const ev of keys) {
            const ids = this._event_listeners_ids[ev] || [];
            for (const id of ids) {
                try {
                    (_xem as any).remove(id);
                } catch { }
            }
            delete this._event_listeners_ids[ev];
        }
    }

    // ✅ MUST match base signature: removeChild(child: XObject, dispose?: boolean)
    removeChild(child: XObject, dispose?: boolean): void {
        // UI cleanup if child is UI
        if (this._dom_object instanceof HTMLElement && child instanceof XUIObject) {
            try {
                this._dom_object.removeChild(child.dom);
            } catch (error) {
                _xlog.log("Error removing child from dom");
            }
        }

        super.removeChild(child, dispose);
    }

    setText(text: string) {
        this._text = text;
    }

    setStyleAttribute(attr: string, val: string) {
        if (this._dom_object instanceof HTMLElement) {
            this._dom_object.style.setProperty(attr, val);
        }
    }

    // XUIObject — class helpers (safe for "a b c" inputs)
    //
    // - Accepts single or multi-class strings (space/newline/tab separated)
    // - Never feeds spaces into DOMTokenList APIs
    // - Keeps (this as any).class in sync when possible
    // - Backward compatible: addClass("a b") now works instead of throwing

    private splitClass(input: string): string[] {
        return String(input || "")
            .split(/\s+/g)
            .map(s => s.trim())
            .filter(Boolean);
    }

    addClass(className: string) {
        const tokens = this.splitClass(className);
        if (tokens.length === 0) return;

        if (this._dom_object instanceof HTMLElement) {
            this._dom_object.classList.add(...tokens);
        }

        const cur = this.splitClass(String((this as any).class || ""));
        const set = new Set([...cur, ...tokens]);
        (this as any).class = Array.from(set).join(" ");
    }

    removeClass(className: string) {
        const tokens = this.splitClass(className);
        if (tokens.length === 0) return;

        if (this._dom_object instanceof HTMLElement) {
            this._dom_object.classList.remove(...tokens);
        }

        const cur = this.splitClass(String((this as any).class || ""));
        const remove = new Set(tokens);
        (this as any).class = cur.filter(c => !remove.has(c)).join(" ");
    }

    toggleClass(className: string) {
        const tokens = this.splitClass(className);
        if (tokens.length === 0) return;

        if (this._dom_object instanceof HTMLElement) {
            for (const t of tokens) this._dom_object.classList.toggle(t);
            (this as any).class = this._dom_object.className;
            return;
        }

        const cur = new Set(this.splitClass(String((this as any).class || "")));
        for (const t of tokens) {
            if (cur.has(t)) cur.delete(t);
            else cur.add(t);
        }
        (this as any).class = Array.from(cur).join(" ");
    }

    replaceClass(oldClass: string, newClass: string) {
        const oldTokens = this.splitClass(oldClass);
        const newTokens = this.splitClass(newClass);

        if (this._dom_object instanceof HTMLElement) {
            if (oldTokens.length) this._dom_object.classList.remove(...oldTokens);
            if (newTokens.length) this._dom_object.classList.add(...newTokens);
            (this as any).class = this._dom_object.className;
            return;
        }

        const cur = this.splitClass(String((this as any).class || ""));
        const remove = new Set(oldTokens);
        const kept = cur.filter(c => !remove.has(c));
        const set = new Set([...kept, ...newTokens]);
        (this as any).class = Array.from(set).join(" ");
    }


    show() {
        const el = this.getDOMObject();
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
                { _once: true } as any
            );
        }

        el.style.display = this._base_display;
        this._visible = true;
        this.onShow();
    }

    hide() {
        const el = this.getDOMObject();
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
                { _once: true } as any
            );
            return;
        }

        el.style.display = "none";
        this.onHide();
    }

    async animate(animation: string, infinite: boolean = false) {
        if (this._dom_object instanceof HTMLElement) {
            return new Promise((resolve) => {
                this._dom_object.classList.add(XUIAnimate._animation_base_class, animation);
                if (infinite) {
                    this._dom_object.classList.add("animate__infinite");
                    (this as any)["_active_animation"] = animation;
                    resolve(true);
                } else {
                    this.addEventListener(
                        "animationend",
                        () => {
                            this._dom_object.classList.remove(animation);
                            resolve(true);
                        },
                        { _once: true } as any
                    );
                }
            });
        }
    }

    stopAnimation() {
        if (this._dom_object instanceof HTMLElement && (this as any)["_active_animation"]) {
            this._dom_object.classList.remove(<any>(this as any)["active-animation"], "animate__infinite");
            delete (this as any)["_active_animation"];
        }
    }

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
            this._dom_object.click();
        }
    }

    async onMount() {
        if ((this as any)._mounted) return;

        if (this._on_click) {
            if (typeof this._on_click === "function") {
                this.addEventListener("click", (e:any) => (this._on_click as any)(this, e));
            } else if (typeof this._on_click === "string") {
                this.addEventListener("click", () => {
                    this.checkAndRunInternalFunction(this._on_click);
                });
            }
        }

        await super.onMount();

        const el = this._dom_object;
        if (el instanceof HTMLElement) {
            try {
                const cs = getComputedStyle(el).getPropertyValue("display");
                this._visible = cs !== "none";
                if (!this._base_display && cs && cs !== "none") {
                    this._base_display = cs;
                }
            } catch {
                this._visible = true;
            }
        } else {
            this._visible = true;
        }

        (this as any)._mounted = true;
    }

    async onShow() {
        if (this._on_show) {
            this.checkAndRunInternalFunction(this._on_show);
        } else if (this._on && (this._on as any).show) {
            this.checkAndRunInternalFunction((this._on as any).show);
        } else if (this._once && (this._once as any).show) {
            this.checkAndRunInternalFunction((this._once as any).show);
        }

        this._children.forEach((child: any) => {
            if (child.onShow && typeof child.onShow === "function") child.onShow();
        });
    }

    async onHide() {
        if (this._on_hide) {
            this.checkAndRunInternalFunction(this._on_hide);
        } else if (this._on && (this._on as any).hide) {
            this.checkAndRunInternalFunction((this._on as any).hide);
        } else if (this._once && (this._once as any).hide) {
            this.checkAndRunInternalFunction((this._once as any).hide);
        }

        this._children.forEach((child: any) => {
            if (child.onHide && typeof child.onHide === "function") child.onHide();
        });
    }
}

export default XUIObject;
