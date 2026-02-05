/**
 * Wormholes v1 — legacy client (xpell-ui)
 * Kept for backward compatibility only.
 *
 * Notes:
 * - This file exports ONLY the WormholesV1 class (no singleton).
 * - The Wormholes facade (Wormholes.ts) decides whether to instantiate v1 or v2.
 */

import { _xd, XLogger as _xlog, XUtils as _xu, XModule } from "@xpell/core";
import { _xem } from "../XEM/XEventManager";
import { setWormholeState } from "./wh.xdata";

import type { WormholesClientAPI, WormholesOpenOptions } from "./wh.types";

export const WormholeEvents = {
  WormholeOpen: "wormhole-open",
  WormholeClose: "wormhole-close",
  ResponseDataArrived: "wh-data-res",
} as const;

export enum MessageType {
  Text,
  JSON,
}

type WaitersPack = {
  [waiterID: string]: CallableFunction;
};

type WormholeMessage = {
  id: string;
  type: MessageType;
  data: string;
};

/**
 * WormholesV1 — your original Wormholes implementation,
 * converted to a class-only export so it can be used by the v2 facade.
 */
export class WormholesV1 extends XModule {
  _ws: WebSocket | null = null;
  _ready = false;

  _data_waiters: WaitersPack = {};
  _wh_log_rules: { [key: string]: boolean } = {
    _open: false,
    _connect: false,
    _disconnect: false,
    _send: false,
    _receive: false,
  };

  _on_open?: CallableFunction;
  _data_queue: Record<string, any[]> = {};

  constructor() {
    super({ _name: "wormholes-v1" });
  }

  /**
   * v2 facade expects a "verbose" property.
   */
  set verbose(val: boolean) {
    this._wh_log_rules = {
      _open: val,
      _connect: val,
      _disconnect: val,
      _send: val,
      _receive: val,
    };
  }

  private createMessage(msg: object, type: MessageType = MessageType.JSON): WormholeMessage {
    const oData: string = this.stringify(msg);
    return {
      id: _xu.guid(),
      type,
      data: oData,
    };
  }

  /**
   * Opens a legacy Wormhole connection.
   */
  open(url: string) {
    try {
      this._ws = new WebSocket(url);
    } catch (ex) {
      _xlog.log(ex);
      return;
    }

    const sthis = this;

    if (this._wh_log_rules._open) _xlog.log("[WHv1] opening...");

    // v1 internal routing based on old server push format
    _xem.on(WormholeEvents.ResponseDataArrived, (e: any) => {
      const edata = e.sed;
      sthis._data_waiters[edata["waiterID"]]?.(edata.data);

      if (edata.data?._msg_action === "datasource") {
        const dsName = edata.data?._params?._data_source;
        const dsData = edata.data?._params?._data;

        if (!dsName) return;

        if (!this._data_queue[dsName]) this._data_queue[dsName] = [];
        this._data_queue[dsName].push(dsData);
      } else if (edata.data?._msg_action === "xem") {
        const eventName = edata.data?._params?._event;
        const eventData = edata.data?._params?._data;
        if (eventName) _xem.fire(eventName, eventData);
      }
    });

    if (!this._ws) return;

    this._ws.onopen = async () => {
      this._ready = true;
      if (this._wh_log_rules._open) _xlog.log("[WHv1] open");

      setWormholeState(WormholeEvents.WormholeOpen, true, "wormholes:v1:open");
      _xem.fire(WormholeEvents.WormholeOpen, {});

      if (this._on_open) {
        try {
          this._on_open();
        } catch (e) {
          _xlog.error(e);
        }
      }
    };

    this._ws.onmessage = async (evt) => {
      try {
        const msg = JSON.parse(evt.data.toString());
        let ddata: any = msg.data;

        try {
          ddata = JSON.parse(msg.data);
        } catch {}

        const sed = {
          waiterID: ddata["eid"],
          data: ddata,
        };

        _xem.fire(WormholeEvents.ResponseDataArrived, { sed });

        if (this._wh_log_rules._receive) _xlog.log("[WHv1] recv", ddata);
      } catch (e) {
        _xlog.error(e);
      }
    };

    this._ws.onclose = async () => {
      this._ready = false;
      if (this._wh_log_rules._open) _xlog.log("[WHv1] closed");

      setWormholeState(WormholeEvents.WormholeOpen, false, "wormholes:v1:close");
      _xem.fire(WormholeEvents.WormholeClose, {});
    };
  }

  close() {
    this._ws?.close();
  }

  /**
   * v1 async send with callback waiter.
   */
  send(message: any, cb: CallableFunction, type = MessageType.JSON) {
    if (!this._ws) return;

    const wormholeMessage = this.createMessage(message, type);

    if (!cb) {
      cb = (data: string) => _xlog.log("[WHv1 default callback] data ->", data);
    }

    this._data_waiters[wormholeMessage.id] = cb;

    try {
      this._ws.send(JSON.stringify(wormholeMessage));
      if (this._wh_log_rules._send) _xlog.log("[WHv1] send", wormholeMessage);
    } catch (ex) {
      _xlog.log("[WHv1] send error", ex);
    }
  }

  /**
   * v1 sync send.
   * NOTE: uses v1 protocol response shape: { _ok, _result }
   */
  sendSync(message: any, checkXProtocol = true): Promise<any> {
    return new Promise((resolve, reject) => {
      this.send(message, (data: any) => {
        if (!data) return reject("ERROR: No response from server");

        if (!checkXProtocol) return resolve(data);

        if (data["_ok"]) resolve(data["_result"]);
        else reject(data["_result"]);
      });
    });
  }

  /**
   * v2 facade compatibility: send a command (xcmd).
   * In v1, the server expects the xcmd shape directly.
   */
  sendXcmd(xcmd: any, _timeoutMs?: number): Promise<any> {
    return this.sendSync(xcmd, true);
  }

  /**
   * v2 facade compatibility: send an event push.
   * v1 server expects { _msg_action:"xem", _params:{ _event,_data } }
   */
  sendEvt(name: string, data?: any, args?: any[]) {
    // args are ignored in v1 (legacy)
    void args;

    const msg = {
      _msg_action: "xem",
      _params: {
        _event: name,
        _data: data,
      },
    };

    // fire-and-forget in v1
    this.send(msg, () => {}, MessageType.JSON);
  }

  private stringify(obj: object, esc = false): string {
    let no = JSON.stringify(obj);
    if (esc) no = no.replace(/\"/g, '\\"');
    return no;
  }

  onOpen(cb: CallableFunction) {
    if (cb && typeof cb === "function") this._on_open = cb;
  }

  async onFrame(_frameNumber: number): Promise<void> {
    const keys = Object.keys(this._data_queue);

    for (const key of keys) {
      if (this._data_queue[key].length === 0) continue;
      const next = this._data_queue[key].shift();
      setWormholeState(key, next, "wormholes:v1:data");
    }
  }
}

export default WormholesV1;

/**
 * Wormholes v1 adapter — makes legacy v1 look like WormholesClientAPI.
 * v1 does NOT support sessions (_sid) and may not provide a true _wid.
 */


export  class WormholesV1Adapter implements WormholesClientAPI {
  private _v1 = new WormholesV1();

  private _ready_flag = false;
  private _wid_value: string | undefined;
  private _sid_value: string | undefined;

  set verbose(v: boolean) {
    // Forward if v1 supports it; otherwise ignore safely
    try {
      (this._v1 as any).verbose = v;
    } catch {
      // ignore
    }
  }

  get _ready(): boolean {
    return this._ready_flag;
  }

  get _wid(): string | undefined {
    return this._wid_value;
  }

  get _sid(): string | undefined {
    return this._sid_value;
  }

  open(opts: WormholesOpenOptions): void {
    // v1 signature: open(url: string)
    this._v1.open(opts._url);

    // v1 has no server-issued wid/sid. We keep stable-ish identifiers.
    this._ready_flag = true;
    this._wid_value = this._wid_value ?? `v1:${_xu.guid()}`; // stable per adapter instance
    this._sid_value = undefined;
  }

  close(): void {
    this._ready_flag = false;
    try {
      this._v1.close();
    } catch {
      // ignore
    }
  }

  async sendSync(payload: any, timeoutMs?: number): Promise<any> {
    // v1 implementation usually: sendSync(message:any, checkXProtocol=true)
    // timeoutMs is ignored by legacy v1 (no change).
    void timeoutMs;

    if (typeof (this._v1 as any).sendSync === "function") {
      return (this._v1 as any).sendSync(payload, true);
    }

    throw new Error("WormholesV1Adapter: legacy v1 does not implement sendSync()");
  }

  async sendXcmd(xcmd: any, timeoutMs?: number): Promise<any> {
    return this.sendSync(xcmd, timeoutMs);
  }

  sendEvt(name: string, data?: any, args?: any[]): void {
    // Best-effort emulation: legacy server used "_msg_action":"xem"
    void this.sendSync({
      _msg_action: "xem",
      _params: { _event: name, _data: data, _args: args },
    }).catch(() => {
      // v1 fire-and-forget
    });
  }

  onOpen(cb: () => void): void {
    if (typeof (this._v1 as any).onOpen === "function") {
      (this._v1 as any).onOpen(cb);
      return;
    }

    // Fallback: call immediately if already open
    if (this._ready_flag) cb();
  }
}
