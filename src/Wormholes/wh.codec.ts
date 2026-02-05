/**
 * Wormholes v2 — codec helpers (xpell-ui)
 * ALIGNED with xnode: _kind (UPPERCASE), _rid correlation, _meta user_agent.
 */

import { XUtils as _xu } from "@xpell/core";
import type {
  WHEnvelope,
  WHKind,
  WHMeta,
  WHHelloPayload,
  WHAuthPayload,
  WHEventPayload,
  WHAny,
  XCmd,
} from "./wh.types";

export function makeEnvelope<TPayload = any>(
  _kind: WHKind,
  _payload?: TPayload,
  opts?: {
    _id?: string;
    _rid?: string;
    _sid?: string;
    _wid?: string;
    _token?: string;
    _meta?: WHMeta;
  }
): WHEnvelope<TPayload> {
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

export function makeHello(_payload: WHHelloPayload, _meta?: WHMeta) {
  return makeEnvelope("HELLO", _payload, { _meta });
}

export function makeAuth(_payload: WHAuthPayload, _sid?: string, _wid?: string, _meta?: WHMeta) {
  return makeEnvelope("AUTH", _payload, { _sid, _wid, _meta });
}

export function makeReq(_payload: XCmd, _sid?: string, _wid?: string, _meta?: WHMeta) {
  return makeEnvelope("REQ", _payload, { _sid, _wid, _meta });
}

export function makeRes(_rid: string, _payload: any, _sid?: string, _wid?: string, _meta?: WHMeta) {
  return makeEnvelope("RES", _payload, { _rid, _sid, _wid, _meta });
}

export function makeEvt(_payload: WHEventPayload, _sid?: string, _wid?: string, _meta?: WHMeta) {
  return makeEnvelope("EVT", _payload, { _sid, _wid, _meta });
}

export function parseEnvelope(s: string): WHEnvelope {
  return JSON.parse(s);
}

export function stringifyEnvelope(env: WHEnvelope): string {
  return JSON.stringify(env);
}
