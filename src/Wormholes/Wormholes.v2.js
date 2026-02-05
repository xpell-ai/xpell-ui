/**
 * Wormholes v2 — WebSocket client (xpell-ui)
 *
 * ALIGNED with Wormholes v2 (xnode):
 * - env._kind (UPPERCASE) instead of env._type (lowercase)
 * - REQ/RES correlation via RES._rid === REQ._id
 * - HELLO/AUTH are envelopes
 * - JSON-only envelope (no nested JSON strings)
 */
import { _xd, XLogger as _xlog } from "@xpell/core";
import { _xem } from "../XEM/XEventManager";
import { setWormholeState } from "./wh.xdata";
import { makeEnvelope, makeHello, makeAuth, makeReq, makeEvt, parseEnvelope, stringifyEnvelope, } from "./wh.codec";
export const WormholeEvents = {
    WormholeOpen: "wormhole-open",
    WormholeClose: "wormhole-close",
    WormholeError: "wormhole-error",
    WormholeHello: "wormhole-hello",
    WormholeAuth: "wormhole-auth",
};
function toStringData(evtData) {
    try {
        return evtData?.toString?.() ?? String(evtData);
    }
    catch {
        return String(evtData);
    }
}
export class WormholesV2 {
    constructor() {
        this._ws = null;
        this.__ready = false;
        this._waiters = {};
        this._data_queue = {};
        this._log = { _connect: false, _disconnect: false, _send: false, _receive: false, _evt: false };
    }
    set verbose(v) {
        this._log = { _connect: v, _disconnect: v, _send: v, _receive: v, _evt: v };
    }
    get _ready() {
        return this.__ready;
    }
    get _wid() {
        return this.__wid;
    }
    get _sid() {
        return this.__sid;
    }
    open(opts) {
        // helper must be defined before any use
        const _briefFireError = (e) => {
            _xlog.error(e);
            _xem.fire(WormholeEvents.WormholeError, { _error: e });
        };
        this._opts = { _auto_reconnect: true, _reconnect_ms: 1500, ...opts };
        const url = this._opts._url;
        if (this._log._connect)
            _xlog.log("[WHv2] connecting", url);
        try {
            this._ws = new WebSocket(url);
        }
        catch (e) {
            _briefFireError(e);
            return;
        }
        this._ws.onopen = () => {
            this.__ready = true;
            setWormholeState(WormholeEvents.WormholeOpen, true, "wormholes:v2:open");
            if (this._log._connect)
                _xlog.log("[WHv2] open");
            // Send HELLO (aligned): payload is WHHelloPayload
            const helloPayload = {
                _protocol: "wormholes",
                _v: 2,
                ...(this._opts?._hello_payload ?? {}),
            };
            this._sendEnvelope(makeHello(helloPayload, {
                _user_agent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
            }));
            _xem.fire(WormholeEvents.WormholeOpen, {});
            if (this._on_open) {
                try {
                    this._on_open();
                }
                catch (e) {
                    _xlog.error(e);
                }
            }
        };
        this._ws.onmessage = (evt) => {
            try {
                const raw = toStringData(evt.data);
                const env = parseEnvelope(raw);
                if (this._log._receive)
                    _xlog.log("[WHv2] recv", env);
                if (env._wid)
                    this.__wid = env._wid;
                if (env._sid)
                    this.__sid = env._sid;
                // tolerate early-alpha sid inside payload
                const p = env._payload ?? {};
                if (p?._sid && !this.__sid)
                    this.__sid = p._sid;
                // tolerate wid inside HELLO payload
                if (env._kind === "HELLO") {
                    const hp = env._payload ?? {};
                    if (hp?._wid && !this.__wid)
                        this.__wid = hp._wid;
                }
                this._handleEnvelope(env);
            }
            catch (e) {
                _xlog.error(e);
            }
        };
        this._ws.onclose = () => {
            this.__ready = false;
            setWormholeState(WormholeEvents.WormholeOpen, false, "wormholes:v2:close");
            if (this._log._disconnect)
                _xlog.log("[WHv2] closed");
            _xem.fire(WormholeEvents.WormholeClose, {});
            for (const id of Object.keys(this._waiters)) {
                this._waiters[id]._reject({ _code: "E_WORMHOLE_CLOSED", _id: id });
                delete this._waiters[id];
            }
            if (this._opts?._auto_reconnect) {
                const ms = this._opts?._reconnect_ms ?? 1500;
                setTimeout(() => {
                    if (!this.__ready && this._opts)
                        this.open(this._opts);
                }, ms);
            }
        };
        this._ws.onerror = (err) => {
            if (this._log._disconnect)
                _xlog.log("[WHv2] error", err);
            _xem.fire(WormholeEvents.WormholeError, { _error: err });
        };
    }
    close() {
        this._opts = { ...(this._opts ?? {}), _auto_reconnect: false };
        try {
            this._ws?.close();
        }
        catch { }
        this._ws = null;
        this.__ready = false;
    }
    onOpen(cb) {
        this._on_open = cb;
    }
    async sendXcmd(xcmd, timeoutMs = 20000) {
        return this.sendSync(xcmd, timeoutMs);
    }
    sendSync(payload, timeoutMs = 20000) {
        return new Promise((resolve, reject) => {
            if (!this._ws || !this.__ready)
                return reject({ _code: "E_WORMHOLE_NOT_READY" });
            // IMPORTANT: match codec signature: makeReq(payload, wid?, sid?)
            const env = makeReq(payload, this.__wid, this.__sid);
            this._waiters[env._id] = { _resolve: resolve, _reject: reject, _ts: Date.now() };
            try {
                if (this._log._send)
                    _xlog.log("[WHv2] send", env);
                this._ws.send(stringifyEnvelope(env));
            }
            catch (e) {
                delete this._waiters[env._id];
                reject(e);
                return;
            }
            setTimeout(() => {
                const w = this._waiters[env._id];
                if (!w)
                    return;
                delete this._waiters[env._id];
                w._reject({ _code: "E_TIMEOUT", _id: env._id, _timeout_ms: timeoutMs });
            }, timeoutMs);
        });
    }
    sendEvt(name, data, args) {
        const env = makeEvt({ _name: name, _data: data, _args: args }, this.__sid, this.__wid);
        this._sendEnvelope(env);
    }
    _sendEnvelope(env) {
        if (!this._ws || !this.__ready)
            return;
        try {
            if (this._log._send)
                _xlog.log("[WHv2] send", env);
            this._ws.send(stringifyEnvelope(env));
        }
        catch (e) {
            _xlog.error(e);
        }
    }
    _handleEnvelope(env) {
        switch (env._kind) {
            case "HELLO":
                _xem.fire(WormholeEvents.WormholeHello, env._payload);
                return;
            case "AUTH":
                _xem.fire(WormholeEvents.WormholeAuth, env._payload);
                return;
            case "RES": {
                const rid = env._rid;
                if (!rid)
                    return;
                const waiter = this._waiters[rid];
                if (!waiter)
                    return;
                delete this._waiters[rid];
                const p = env._payload ?? {};
                if (p._ok === false)
                    waiter._reject(p._result ?? p);
                else
                    waiter._resolve(p._result ?? p);
                return;
            }
            case "EVT":
                this._handleEvt(env._payload);
                return;
            case "ERR":
                _xem.fire(WormholeEvents.WormholeError, env._payload);
                return;
            case "PING":
                this._sendEnvelope(makeEnvelope("PONG", { _ts: Date.now() }, { _wid: this.__wid, _sid: this.__sid }));
                return;
            case "PONG":
            default:
                return;
        }
    }
    _handleEvt(payload) {
        if (!payload)
            return;
        const name = payload._name ?? payload.name;
        const data = payload._data ?? payload.data;
        const args = payload._args ?? payload.args;
        if (this._log._evt)
            _xlog.log("[WHv2] evt", name, data, args);
        if (name === "datasource") {
            const dsName = data?._data_source ?? data?._name ?? data?._ds;
            const dsData = data?._data ?? data?._value;
            if (!dsName)
                return;
            if (!this._data_queue[dsName])
                this._data_queue[dsName] = [];
            this._data_queue[dsName].push(dsData);
            return;
        }
        if (name === "xem") {
            const ev = data?._event ?? data?._name;
            const evData = data?._data;
            if (ev)
                _xem.fire(ev, evData);
            return;
        }
        _xem.fire(name, data ?? args);
    }
    async onFrame(_) {
        const keys = Object.keys(this._data_queue);
        for (const key of keys) {
            if (this._data_queue[key].length === 0)
                continue;
            const next = this._data_queue[key].shift();
            setWormholeState(key, next, "wormholes:v2:data");
        }
    }
}
export default WormholesV2;
