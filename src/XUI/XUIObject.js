// ============================================================================
// xpell-ui/src/XUI/XUIObject.ts
// PATCH: make XUIObject overrides compatible with XObject (TS5 strict)
// - Do NOT override base fields with incompatible types
// - Keep UI convenience by casting where needed (runtime unchanged)
// ============================================================================
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _XUIObject__text;
import { XObject, _xlog } from "@xpell/core";
import { _xem } from "../XEM/XEventManager";
import XUI from "./XUI";
import _xuiobject_basic_nano_commands from "./XUINanoCommands";
import { XUIAnimate } from "./XUIAnimations";
const reservedWords = { _children: "child objects" };
const xpellObjectHtmlFieldsMapping = { "_id": "id", "css-class": "class", "animation": "xyz", "input-type": "type" };
export class XUIObject extends XObject {
    constructor(data, defaults, skipParse) {
        super(data, defaults, true);
        _XUIObject__text.set(this, "");
        this._html_tag = "div";
        this._html_ns = null;
        this._dom_object = null;
        this._type = "view";
        this._html = "";
        this._children = [];
        this._visible = true;
        // NOTE: _support_html is UI-only. If core typings don't have it, keep cast.
        this._xem_options = { _once: false, _support_html: true };
        this.addXporterDataIgnoreFields(["_dom_object", "_html", "_xem_options", "_on_click", "#_text"]);
        super.addNanoCommandPack(_xuiobject_basic_nano_commands);
        if (!skipParse && data)
            this.parse(data, reservedWords);
    }
    // --------------------------------------------------------------------------
    // UI convenience typed accessors (DO NOT change base field types)
    // --------------------------------------------------------------------------
    get ui_parent() {
        return this._parent;
    }
    get ui_children() {
        return this._children.filter((c) => c instanceof XUIObject);
    }
    // --------------------------------------------------------------------------
    async dispose() {
        this._dom_object = undefined;
        this._html = undefined;
        this._base_display = undefined;
        __classPrivateFieldSet(this, _XUIObject__text, "", "f");
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
    getDOMObject() {
        if (!this._dom_object) {
            const dom_object = (this._html_ns)
                ? document.createElementNS(this._html_ns, this._html_tag)
                : document.createElement(this._html_tag);
            for (const field of Object.keys(this)) {
                if (!this.hasOwnProperty(field))
                    continue;
                const val = this[field];
                if (val == null)
                    continue;
                let outName = field;
                if (xpellObjectHtmlFieldsMapping.hasOwnProperty(field)) {
                    outName = xpellObjectHtmlFieldsMapping[field];
                }
                if (!outName.startsWith("_")) {
                    dom_object.setAttribute(outName, String(val));
                }
            }
            if (this["_text"] && String(this["_text"]).length > 0) {
                __classPrivateFieldSet(this, _XUIObject__text, String(this["_text"]), "f");
                dom_object.textContent = __classPrivateFieldGet(this, _XUIObject__text, "f");
            }
            if (this._children.length > 0) {
                this._children.forEach((child) => {
                    dom_object.appendChild(child.getDOMObject());
                });
            }
            const el = dom_object;
            if (el.hasAttribute("hidden") || el.style.display === "none") {
                this._visible = false;
                if (el.hasAttribute("hidden") && el.style.display !== "none") {
                    el.style.display = "none";
                }
            }
            else {
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
    set _text(text) {
        __classPrivateFieldSet(this, _XUIObject__text, text, "f");
        if (this._dom_object instanceof HTMLElement) {
            this._dom_object.textContent = text;
        }
    }
    get _text() {
        return __classPrivateFieldGet(this, _XUIObject__text, "f");
    }
    getHTML() {
        const dom = this.getDOMObject();
        this._html = dom?.outerHTML;
        return this._html;
    }
    attach(parentElementId) {
        document.getElementById(parentElementId)?.append(this.getDOMObject());
        this.onMount();
    }
    mount(parentElementId) {
        const obj = document.getElementById(parentElementId);
        if (obj) {
            obj.appendChild(this.getDOMObject());
            this.onMount();
        }
    }
    append(xObject) {
        if (!(xObject instanceof XUIObject)) {
            xObject = XUI.create(xObject);
        }
        super.append(xObject); // base handles _children/_parent types
        if (this._dom_object instanceof HTMLElement) {
            this._dom_object.appendChild(xObject.dom);
            if (!xObject._mounted)
                xObject.onMount();
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
    addEventListener(eventName, handler, options = {}) {
        const id = _xem.on(eventName, handler, { ...options, _support_html: true }, this);
        if (!this._event_listeners_ids)
            this._event_listeners_ids = {};
        if (!this._event_listeners_ids[eventName])
            this._event_listeners_ids[eventName] = [];
        this._event_listeners_ids[eventName].push(id);
        return id;
    }
    /**
     * UI override: remove a specific listener id (both DOM + bus) via UI _xem.
     */
    removeEventListener(listenerId) {
        try {
            _xem.remove(listenerId);
        }
        catch (e) {
            // ignore
        }
        // cleanup index
        if (!this._event_listeners_ids)
            return;
        for (const [ev, ids] of Object.entries(this._event_listeners_ids)) {
            const idx = ids.indexOf(listenerId);
            if (idx >= 0)
                ids.splice(idx, 1);
            if (ids.length === 0)
                delete this._event_listeners_ids[ev];
        }
    }
    /**
     * UI override convenience: remove ALL listeners for an eventName.
     */
    removeAllEventListeners(eventName) {
        if (!this._event_listeners_ids)
            return;
        const keys = eventName ? [eventName] : Object.keys(this._event_listeners_ids);
        for (const ev of keys) {
            const ids = this._event_listeners_ids[ev] || [];
            for (const id of ids) {
                try {
                    _xem.remove(id);
                }
                catch { }
            }
            delete this._event_listeners_ids[ev];
        }
    }
    // ✅ MUST match base signature: removeChild(child: XObject, dispose?: boolean)
    removeChild(child, dispose) {
        // UI cleanup if child is UI
        if (this._dom_object instanceof HTMLElement && child instanceof XUIObject) {
            try {
                this._dom_object.removeChild(child.dom);
            }
            catch (error) {
                _xlog.log("Error removing child from dom");
            }
        }
        super.removeChild(child, dispose);
    }
    setText(text) {
        this._text = text;
    }
    setStyleAttribute(attr, val) {
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
    splitClass(input) {
        return String(input || "")
            .split(/\s+/g)
            .map(s => s.trim())
            .filter(Boolean);
    }
    addClass(className) {
        const tokens = this.splitClass(className);
        if (tokens.length === 0)
            return;
        if (this._dom_object instanceof HTMLElement) {
            this._dom_object.classList.add(...tokens);
        }
        const cur = this.splitClass(String(this.class || ""));
        const set = new Set([...cur, ...tokens]);
        this.class = Array.from(set).join(" ");
    }
    removeClass(className) {
        const tokens = this.splitClass(className);
        if (tokens.length === 0)
            return;
        if (this._dom_object instanceof HTMLElement) {
            this._dom_object.classList.remove(...tokens);
        }
        const cur = this.splitClass(String(this.class || ""));
        const remove = new Set(tokens);
        this.class = cur.filter(c => !remove.has(c)).join(" ");
    }
    toggleClass(className) {
        const tokens = this.splitClass(className);
        if (tokens.length === 0)
            return;
        if (this._dom_object instanceof HTMLElement) {
            for (const t of tokens)
                this._dom_object.classList.toggle(t);
            this.class = this._dom_object.className;
            return;
        }
        const cur = new Set(this.splitClass(String(this.class || "")));
        for (const t of tokens) {
            if (cur.has(t))
                cur.delete(t);
            else
                cur.add(t);
        }
        this.class = Array.from(cur).join(" ");
    }
    replaceClass(oldClass, newClass) {
        const oldTokens = this.splitClass(oldClass);
        const newTokens = this.splitClass(newClass);
        if (this._dom_object instanceof HTMLElement) {
            if (oldTokens.length)
                this._dom_object.classList.remove(...oldTokens);
            if (newTokens.length)
                this._dom_object.classList.add(...newTokens);
            this.class = this._dom_object.className;
            return;
        }
        const cur = this.splitClass(String(this.class || ""));
        const remove = new Set(oldTokens);
        const kept = cur.filter(c => !remove.has(c));
        const set = new Set([...kept, ...newTokens]);
        this.class = Array.from(set).join(" ");
    }
    show() {
        const el = this.getDOMObject();
        if (!(el instanceof HTMLElement))
            return;
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
            this.addEventListener("animationend", () => el.classList.remove(this._on_show_animation), { _once: true });
        }
        el.style.display = this._base_display;
        this._visible = true;
        this.onShow();
    }
    hide() {
        const el = this.getDOMObject();
        if (!(el instanceof HTMLElement))
            return;
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
            this.addEventListener("animationend", () => {
                el.classList.remove(this._on_hide_animation);
                el.style.display = "none";
                this.onHide();
            }, { _once: true });
            return;
        }
        el.style.display = "none";
        this.onHide();
    }
    async animate(animation, infinite = false) {
        if (this._dom_object instanceof HTMLElement) {
            return new Promise((resolve) => {
                this._dom_object.classList.add(XUIAnimate._animation_base_class, animation);
                if (infinite) {
                    this._dom_object.classList.add("animate__infinite");
                    this["_active_animation"] = animation;
                    resolve(true);
                }
                else {
                    this.addEventListener("animationend", () => {
                        this._dom_object.classList.remove(animation);
                        resolve(true);
                    }, { _once: true });
                }
            });
        }
    }
    stopAnimation() {
        if (this._dom_object instanceof HTMLElement && this["_active_animation"]) {
            this._dom_object.classList.remove(this["active-animation"], "animate__infinite");
            delete this["_active_animation"];
        }
    }
    toggle() {
        const el = this._dom_object;
        if (el instanceof HTMLElement) {
            const cs = getComputedStyle(el).getPropertyValue("display");
            this._visible = cs !== "none";
        }
        if (this._visible)
            this.hide();
        else
            this.show();
    }
    click() {
        if (this._dom_object instanceof HTMLElement) {
            this._dom_object.click();
        }
    }
    async onMount() {
        if (this._mounted)
            return;
        if (this._on_click) {
            if (typeof this._on_click === "function") {
                this.addEventListener("click", (e) => this._on_click(this, e));
            }
            else {
                this.addEventListener("click", (e) => {
                    this.checkAndRunInternalFunction(this._on_click, e);
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
            }
            catch {
                this._visible = true;
            }
        }
        else {
            this._visible = true;
        }
        this._mounted = true;
    }
    async onShow() {
        if (this._on_show) {
            this.checkAndRunInternalFunction(this._on_show);
        }
        else if (this._on && this._on.show) {
            this.checkAndRunInternalFunction(this._on.show);
        }
        else if (this._once && this._once.show) {
            this.checkAndRunInternalFunction(this._once.show);
        }
        this._children.forEach((child) => {
            if (child.onShow && typeof child.onShow === "function")
                child.onShow();
        });
    }
    async onHide() {
        if (this._on_hide) {
            this.checkAndRunInternalFunction(this._on_hide);
        }
        else if (this._on && this._on.hide) {
            this.checkAndRunInternalFunction(this._on.hide);
        }
        else if (this._once && this._once.hide) {
            this.checkAndRunInternalFunction(this._once.hide);
        }
        this._children.forEach((child) => {
            if (child.onHide && typeof child.onHide === "function")
                child.onHide();
        });
    }
}
_XUIObject__text = new WeakMap();
export default XUIObject;
