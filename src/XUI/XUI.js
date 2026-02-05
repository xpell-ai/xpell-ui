/**
 * XUI — Xpell User Interface Module
 *
 * Universal HTML & CSS UI engine for the Xpell runtime.
 * Provides DOM-backed UI object creation, mounting, removal,
 * and low-level visibility utilities across browsers and devices.
 *
 * ---
 *
 * ## Responsibilities
 *
 * - Create, mount, and remove DOM-backed UI objects
 * - Provide visibility helpers (without owning navigation)
 * - Manage the UI player and root containers
 * - Handle first-user-gesture utilities (audio, video, etc.)
 *
 * ---
 *
 * ## XVM Contract Compatibility
 *
 * XUI MUST remain navigation-agnostic.
 *
 * - `XUI.add()` and `XUI.mount()` MUST NOT call `show()` or `onShow()`
 * - `XVM.stackInternal()` is the ONLY place allowed to call `target.show()`
 *
 * This separation guarantees deterministic navigation,
 * predictable lifecycle behavior, and multi-container safety.
 *
 * ---
 *
 * ## Architectural Boundary
 *
 * - **XUI**: Structure, DOM binding, lifecycle helpers
 * - **XVM**: Navigation, stacking, history, URL sync, regions, containers
 *
 * XUI builds the interface; XVM runs the application.
 *
 * @packageDocumentation
 * @since 2022-07-22
 * @author Tamir Fridman
 * @copyright
 * © 2022–present Aime Technologies. All rights reserved.
 */
import XUIObject from "./XUIObject";
import { _xlog, XModule, } from "@xpell/core";
import { _xem } from "../XEM/XEventManager";
import XUICoreObjects from "./XUICoreObjects";
import "./Style/xui.css";
export const FIRST_USER_GESTURE = "first-user-gesture";
/**
 * XUI Module - Xpell User Interface Module for HTML and CSS
 */
export class XUIModule extends XModule {
    /**
     * @fires "xui-loaded" event
     */
    constructor(data) {
        super(data);
        this._player_element = null;
        this._first_gesture_occurred = false;
        this._events = {
            _loaded: "xui-loaded",
        };
        // Register default objects
        this.importObjectPack(XUICoreObjects);
        _xem.fire(this._events._loaded);
    }
    /* ------------------------------------------------------------------------ */
    /* Core creation / mounting                                                  */
    /* ------------------------------------------------------------------------ */
    /**
     * Create a XUIObject
     */
    create(data) {
        const d = data ?? { _type: "view", _children: [] };
        if (!d._type)
            d._type = "view";
        return super.create(d);
    }
    /**
     * Resolve a DOM parent target.
     * Priority:
     * 1) explicit parent argument (HTMLElement or "#id" string)
     * 2) xobj._parent_element (if provided)
     * 3) current player element
     * 4) document.body
     */
    resolveMountTarget(xobj, parent) {
        if (typeof parent === "string")
            return document.querySelector("#" + parent);
        if (parent instanceof HTMLElement)
            return parent;
        const pe = xobj?._parent_element;
        if (pe)
            return document.querySelector("#" + pe);
        return this._player_element ?? document.body;
    }
    /**
     * Mount an existing XUIObject into a parent.
     * IMPORTANT: DOES NOT call show() or onShow().
     * Mounting is structural; visibility is controlled by XUIObject.show/hide (called by XVM stack).
     */
    mount(xobj, parent) {
        const el = xobj.getDOMObject();
        const target = this.resolveMountTarget(xobj, parent);
        if (!target) {
            _xlog.log(`XUI.mount | Parent not found for object ${xobj?._id ?? "[no-id]"}`);
            return xobj;
        }
        target.appendChild(el);
        if (typeof xobj.onMount === "function") {
            try {
                xobj.onMount();
            }
            catch (e) {
                _xlog.error(e);
            }
        }
        // NOTE: intentionally no onShow() here (XVM controls showing)
        return xobj;
    }
    /**
     * Create + mount a XUIObject.
     * IMPORTANT: DOES NOT call show() or onShow().
     */
    /**
   * Create + mount a XUIObject.
   * IMPORTANT: DOES NOT call show() or onShow().
   *
   * Contract fix:
   * - _on_create / _on.create / _once.create fire AFTER the full tree is mounted/registered
   * - runs once per object, async-safe, never crashes the app
   */
    add(xData, parent) {
        const root = this.create(xData);
        const mounted = this.mount(root, parent);
        // Post-mount create pass (tree-complete)
        queueMicrotask(() => {
            const run = async (o) => {
                if (!o)
                    return;
                try {
                    if (typeof o.onCreate === "function")
                        await o.onCreate();
                }
                catch (e) {
                    // optional: _xlog.error(e);
                }
                const kids = o._children;
                if (Array.isArray(kids)) {
                    for (const c of kids) {
                        if (c && typeof c.onCreate === "function") {
                            await run(c);
                        }
                    }
                }
            };
            run(mounted).catch(() => { });
        });
        return mounted;
    }
    /**
     * Append XUIObject to the parent XUI Object by ID.
     */
    append(xobj, parentXobjId) {
        const parent = this.getObject(parentXobjId);
        if (parent)
            return parent.append(xobj);
        _xlog.log(`XUI.append | Parent object ${parentXobjId} not found for object ${xobj._id ?? "[no-id]"}`);
    }
    /**
     * Wrap an array of XObjectData with a wrapper object (layout helper).
     */
    wrap(xObjects, wrapper) {
        const w = wrapper ?? { _type: "view", class: "xflex", _children: [] };
        if (!w._children)
            w._children = [];
        if (!w.class)
            w.class = "xflex";
        else if (!String(w.class).includes("xflex"))
            w.class += " xflex";
        if (!w._type)
            w._type = "view";
        for (const xobj of xObjects)
            w._children.push(xobj);
        return w;
    }
    /**
     * Navigate the browser to a new URL
     */
    openUrl(url, newWindow) {
        if (!newWindow)
            document.location.href = url;
        else
            window.open(url);
    }
    /**
     * Removes the XUIObject from the DOM by ID and from the Object Manager
     * @override
     */
    remove(objectId) {
        if (this._log_rules?.removeObject)
            _xlog.log("XUI remove object " + objectId);
        const obj = this.getObject(objectId);
        if (obj && typeof obj.remove === "function") {
            try {
                obj.remove();
            }
            catch (e) {
                _xlog.error(e);
            }
        }
        super.remove(objectId);
    }
    /* ------------------------------------------------------------------------ */
    /* First user gesture (kept; improved)                                      */
    /* ------------------------------------------------------------------------ */
    get firstUserGestureOccurred() {
        return this._first_gesture_occurred;
    }
    waitForFirstUserGesture() {
        if (this._first_gesture_occurred)
            return Promise.resolve();
        return new Promise((resolve) => {
            document.addEventListener(FIRST_USER_GESTURE, () => resolve(), { once: true });
        });
    }
    /**
     * Fires FIRST_USER_GESTURE once via a transparent overlay.
     * Useful for Web APIs that require user interaction (audio unlock, pointer lock, fullscreen, etc).
     *
     * - Idempotent
     * - Uses position:fixed to always cover viewport
     */
    enableFirstUserGestureEvent(opts) {
        if (this._first_gesture_occurred)
            return;
        const overlayId = opts?.overlayId ?? "first-gesture-overlay";
        if (document.getElementById(overlayId))
            return;
        const vstyle = "position:fixed;z-index:10000;width:100%;height:100vh;top:0;left:0;background:transparent;";
        const obj = this.create({
            _type: "view",
            _id: overlayId,
            style: vstyle,
        });
        obj.onClick = `document.dispatchEvent(new CustomEvent("${FIRST_USER_GESTURE}"));`;
        document.body.appendChild(obj.getDOMObject());
        document.addEventListener(FIRST_USER_GESTURE, () => {
            this.remove(overlayId);
            this._first_gesture_occurred = true;
        }, { once: true });
    }
    /* ------------------------------------------------------------------------ */
    /* Player                                                                   */
    /* ------------------------------------------------------------------------ */
    /**
     * Creates a player element and appends it to the DOM.
     * If setAsMainPlayer=true, sets it as default mount root for XUI.add/mount.
     */
    createPlayer(playerId = "xplayer", cssClass, parentElementId, setAsMainPlayer) {
        const parent = parentElementId ? document.getElementById(parentElementId) : document.body;
        const div = document.createElement("div");
        div.id = playerId;
        div.className = cssClass ?? playerId;
        if (!cssClass) {
            div.style.width = "100%";
            div.style.height = "100%";
            div.style.position = "absolute";
            div.style.top = "0";
            div.style.left = "0";
        }
        if (!this._player_element || setAsMainPlayer)
            this._player_element = div;
        if (parent) {
            parent.style.margin = "0";
            parent.style.padding = "0";
            parent.appendChild(div);
        }
        return div;
    }
    /* ------------------------------------------------------------------------ */
    /* Visibility helpers (stay in XUI)                                         */
    /* ------------------------------------------------------------------------ */
    show(objectId) {
        const obj = this.getObject(objectId);
        obj?.show();
    }
    hide(objectId) {
        const obj = this.getObject(objectId);
        obj?.hide();
    }
    toggle(objectId) {
        const obj = this.getObject(objectId);
        obj?.toggle();
    }
}
/* -------------------------------------------------------------------------- */
/* Public singleton                                                           */
/* -------------------------------------------------------------------------- */
export const XUI = new XUIModule({ _name: "xui" });
export default XUI;
