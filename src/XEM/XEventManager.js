/**
 * XEventManager — UI Event System (DOM Adapter)
 *
 * Backward compatible behavior:
 * - fire(event, data) ALSO dispatches DOM event by default (xpell-ui only)
 * - supports legacy fire(event, data, supportHtmlBoolean)
 */
import { _xlog } from "@xpell/core";
import { _XEventManager as _XEventManagerBase, } from "@xpell/core";
export class _XEventManager extends _XEventManagerBase {
    constructor() {
        super(...arguments);
        this._html_event_listeners = {};
    }
    on(event_name, listener, options = { _once: false, _support_html: true }, callObject) {
        const coreOptions = {
            ...options,
            _owner: options?._owner ?? callObject,
        };
        const id = super.on(event_name, listener, coreOptions);
        const supportHtml = options?._support_html !== false; // default true
        if (!supportHtml)
            return id;
        const htmlListener = (e) => {
            const dout = e instanceof CustomEvent ? e.detail : e;
            try {
                listener(dout);
            }
            catch (err) {
                _xlog.error(err);
            }
            if (options?._once)
                this.remove(id);
        };
        if (callObject?.dom?.addEventListener) {
            callObject.dom.addEventListener(event_name, htmlListener);
        }
        else if (typeof document !== "undefined") {
            document.addEventListener(event_name, htmlListener);
        }
        else {
            return id;
        }
        this._html_event_listeners[id] = {
            _event_name: event_name,
            _listener: htmlListener,
            _object: callObject,
        };
        return id;
    }
    once(event_name, listener, callObject) {
        return this.on(event_name, listener, { _once: true, _support_html: true }, callObject);
    }
    remove(listener_id) {
        const domEntry = this._html_event_listeners[listener_id];
        if (domEntry) {
            const { _event_name, _listener, _object } = domEntry;
            try {
                if (_object?.dom?.removeEventListener)
                    _object.dom.removeEventListener(_event_name, _listener);
                else if (typeof document !== "undefined")
                    document.removeEventListener(_event_name, _listener);
            }
            catch (err) {
                _xlog.error(err);
            }
            delete this._html_event_listeners[listener_id];
        }
        super.remove(listener_id);
    }
    /**
     * fire(event_name, data?)
     * fire(event_name, data?, support_html?)
     *
     * UI default: also dispatch DOM unless support_html === false.
     * This preserves old behavior where DOM events "fly" in xpell-ui.
     */
    async fire(event_name, data, support_html = true, callObject) {
        // 1) always fire runtime bus (canonical)
        await super.fire(event_name, data);
        // 2) DOM bridge (xpell-ui only) — default ON
        if (support_html === false)
            return;
        if (typeof document === "undefined")
            return;
        const evt = new CustomEvent(event_name, { detail: data });
        try {
            if (callObject?.dom?.dispatchEvent)
                callObject.dom.dispatchEvent(evt);
            else
                document.dispatchEvent(evt);
        }
        catch (err) {
            _xlog.error(err);
        }
    }
}
export const XEventManager = new _XEventManager();
export const _xem = XEventManager;
export default XEventManager;
