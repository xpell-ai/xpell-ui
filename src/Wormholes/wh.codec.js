/**
 * Wormholes v2 — codec helpers (xpell-ui)
 * ALIGNED with xnode: _kind (UPPERCASE), _rid correlation, _meta user_agent.
 */
import { XUtils as _xu } from "@xpell/core";
export function makeEnvelope(_kind, _payload, opts) {
    return {
        _v: 2,
        _kind,
        _id: opts?._id ?? _xu.guid(),
        _rid: opts?._rid,
        _sid: opts?._sid,
        _wid: opts?._wid,
        _token: opts?._token,
        _ts: Date.now(),
        _meta: opts?._meta,
        _payload,
    };
}
export function makeHello(_payload, _meta) {
    return makeEnvelope("HELLO", _payload, { _meta });
}
export function makeAuth(_payload, _sid, _wid, _meta) {
    return makeEnvelope("AUTH", _payload, { _sid, _wid, _meta });
}
export function makeReq(_payload, _sid, _wid, _meta) {
    return makeEnvelope("REQ", _payload, { _sid, _wid, _meta });
}
export function makeRes(_rid, _payload, _sid, _wid, _meta) {
    return makeEnvelope("RES", _payload, { _rid, _sid, _wid, _meta });
}
export function makeEvt(_payload, _sid, _wid, _meta) {
    return makeEnvelope("EVT", _payload, { _sid, _wid, _meta });
}
export function parseEnvelope(s) {
    return JSON.parse(s);
}
export function stringifyEnvelope(env) {
    return JSON.stringify(env);
}
