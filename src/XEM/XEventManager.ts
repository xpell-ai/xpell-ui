/**
 * XEventManager — UI Event System (DOM Adapter)
 *
 * Backward compatible behavior:
 * - fire(event, data) ALSO dispatches DOM event by default (xpell-ui only)
 * - supports legacy fire(event, data, supportHtmlBoolean)
 */

import { _xlog } from "@xpell/core";

import {
  _XEventManager as _XEventManagerBase,
  type XEventListenerOptions as XEventListenerOptionsBase,
} from "@xpell/core";

export type XEventListenerOptions = XEventListenerOptionsBase & {
  _support_html?: boolean; // UI-only legacy flag
  _owner?: any;
  _tag?: string;
};

export type HTMLEventListenersIndex = {
  [id: string]: {
    _listener: EventListener;
    _event_name: string;
    _object?: any;
  };
};

export class _XEventManager extends _XEventManagerBase {
  protected _html_event_listeners: HTMLEventListenersIndex = {};

  on(
    event_name: string,
    listener: Function,
    options: XEventListenerOptions = { _once: false, _support_html: true },
    callObject?: any
  ): string {
    const coreOptions = {
      ...(options as any),
      _owner: (options as any)?._owner ?? callObject,
    } as XEventListenerOptionsBase;

    const id = super.on(event_name, listener, coreOptions);

    const supportHtml = options?._support_html !== false; // default true
    if (!supportHtml) return id;

    const htmlListener: EventListener = (e: Event) => {
      const dout = e instanceof CustomEvent ? (e as CustomEvent).detail : e;

      try {
        listener(dout);
      } catch (err) {
        _xlog.error(err);
      }

      if (options?._once) this.remove(id);
    };

    if (callObject?.dom?.addEventListener) {
      callObject.dom.addEventListener(event_name, htmlListener);
    } else if (typeof document !== "undefined") {
      document.addEventListener(event_name, htmlListener);
    } else {
      return id;
    }

    this._html_event_listeners[id] = {
      _event_name: event_name,
      _listener: htmlListener,
      _object: callObject,
    };

    return id;
  }

  once(event_name: string, listener: Function, callObject?: any): string {
    return this.on(event_name, listener, { _once: true, _support_html: true }, callObject);
  }

  remove(listener_id: string): void {
    const domEntry = this._html_event_listeners[listener_id];
    if (domEntry) {
      const { _event_name, _listener, _object } = domEntry;

      try {
        if (_object?.dom?.removeEventListener) _object.dom.removeEventListener(_event_name, _listener);
        else if (typeof document !== "undefined") document.removeEventListener(_event_name, _listener as any);
      } catch (err) {
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
  async fire(event_name: string, data?: any, support_html: boolean = true, callObject?: any): Promise<void> {
    // 1) always fire runtime bus (canonical)
    await super.fire(event_name, data);

    // 2) DOM bridge (xpell-ui only) — default ON
    if (support_html === false) return;

    if (typeof document === "undefined") return;

    const evt = new CustomEvent(event_name, { detail: data });

    try {
      if (callObject?.dom?.dispatchEvent) callObject.dom.dispatchEvent(evt);
      else document.dispatchEvent(evt);
    } catch (err) {
      _xlog.error(err);
    }
  }
}

export const XEventManager = new _XEventManager();
export const _xem = XEventManager;

export default XEventManager;
