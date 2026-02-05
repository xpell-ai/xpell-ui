// ============================================================================
// xpell-ui/src/Wormholes/wh.types.ts
// Wormholes v2 — UI types (ALIGNED with xnode protocol)
// - Single canonical envelope shape shared with xnode
// - Uses Xpell "_" naming convention
// - UPPERCASE _kind values (matches server)
// - Supports REQ/RES correlation via _rid
// ============================================================================

/**
 * Wormholes v2 — Protocol Types (xpell-ui)
 *
 * This file is the UI-side *canonical* Wormholes v2 contract, aligned with
 * xnode's `wh.types.ts` so client/server can speak the same envelope.
 *
 * Rules:
 * - Envelope is ALWAYS JSON (no "JSON inside JSON" strings).
 * - REQ payload is an XCmd (input to `_x.execute()` on server).
 * - RES payload is `XResponseData` (xpell-core response envelope).
 * - EVT payload is `{ _name, _args? }` (maps to `_xem.fire(_name, ..._args)`).
 *
 * UI notes:
 * - `_wid` is optional; over WS it can be assigned by server in HELLO/RES meta,
 *   and UI may also keep a local connection id.
 * - Keep this file type-only (no DOM/WebSocket imports).
 */

import type { XResponseData } from "@xpell/core";

/* -------------------------------------------------------------------------- */
/* Versioning                                                                 */
/* -------------------------------------------------------------------------- */

export const WH_VERSION = 2 as const;
export type WHVersion = typeof WH_VERSION;

/* -------------------------------------------------------------------------- */
/* Kinds                                                                      */
/* -------------------------------------------------------------------------- */

export type WHKind =
  | "HELLO"
  | "AUTH"
  | "REQ"
  | "RES"
  | "EVT"
  | "ERR"
  | "PING"
  | "PONG";

/* -------------------------------------------------------------------------- */
/* Identity & Routing                                                         */
/* -------------------------------------------------------------------------- */

export type WHPeer = {
  _node?: string;   // xnode id/name
  _agent?: string;  // agent id/name
  _client?: string; // client id/name (web/app)
};

export type WHRoute = {
  _from?: WHPeer;
  _to?: WHPeer;
};

/* -------------------------------------------------------------------------- */
/* Payloads                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Canonical command payload for REQ (goes into `_x.execute()`).
 */
export type XCmd = {
  _module: string;
  _op: string;
  _params?: Record<string, any>;
};

/**
 * HELLO payload: server declares protocol + capabilities.
 */
export type WHHelloPayload = {
  _protocol: "wormholes";
  _v: WHVersion;
  _node?: string;     // server node name/id
  _xpell?: string;    // xpell version (e.g. "2.0.0-alpha.0")
  _caps?: string[];   // e.g. ["reqres","evt","ping","rest"]
  _ts?: number;       // server timestamp (ms)
  _wid?: string;      // optional: connection id assigned by server (ws)
};

/**
 * AUTH request payload (client->server).
 * Minimal v2: token-based auth. Server returns sid in RES._result.
 */
export type WHAuthPayload = {
  _token?: string;
  _owner_entity_id?: string;

  // optional: xnode-to-xnode auth
  _server_name?: string;
  _server_token?: string;
};

/**
 * EVT payload: event name with optional args array.
 * Maps to: `_xem.fire(_name, ...(_args ?? []))`
 */
export type WHEventPayload = {
  _name: string;
  _args?: any[];

  /**
   * UI convenience (optional):
   * Some older callers used `_data` separate from `_args`.
   * New code should prefer putting data into `_args` (e.g. [_data]).
   * Server MAY ignore `_data` unless you explicitly support it.
   */
  _data?: any;
};

export type WHPingPayload = {
  _ts?: number;
  _msg?: string;
};

export type WHPongPayload = {
  _ts?: number;
  _rtt_ms?: number;
};

export type WHErrPayload = {
  _code: string;          // machine code
  _message: string;       // human-readable
  _meta?: Record<string, any>;
};

/* -------------------------------------------------------------------------- */
/* Envelope                                                                   */
/* -------------------------------------------------------------------------- */

export type WHMeta = {
  _node?: string;
  _user_agent?: string;
  _ip?: string;
};

/**
 * Wormholes v2 Envelope (UI-aligned with xnode)
 *
 * Correlation:
 * - RES MUST include `_rid` (request id it answers)
 *
 * Session/auth:
 * - `_sid` is returned by AUTH and then sent on REQ/EVT
 *
 * Timing/debug:
 * - `_ts`: send timestamp
 * - `_trace`: correlation id for logs (optional)
 */
export type WHEnvelope<TPayload = any> = WHRoute & {
  _v: WHVersion;
  _id: string;
  _kind: WHKind;

  _rid?: string; // RES -> REQ correlation

  _sid?: string;
  _token?: string;

  _wid?: string;   // optional connection id (ws or local)
  _ts: number;

  _meta?: WHMeta;
  _trace?: string;

  _payload?: TPayload;
};

/* -------------------------------------------------------------------------- */
/* Typed Envelopes                                                            */
/* -------------------------------------------------------------------------- */

export type WHHello = WHEnvelope<WHHelloPayload> & { _kind: "HELLO" };
export type WHAuth = WHEnvelope<WHAuthPayload> & { _kind: "AUTH" };
export type WHReq = WHEnvelope<XCmd> & { _kind: "REQ" };
export type WHRes = WHEnvelope<XResponseData> & { _kind: "RES"; _rid: string };
export type WHEvt = WHEnvelope<WHEventPayload> & { _kind: "EVT" };
export type WHErr = WHEnvelope<WHErrPayload> & { _kind: "ERR" };
export type WHPing = WHEnvelope<WHPingPayload> & { _kind: "PING" };
export type WHPong = WHEnvelope<WHPongPayload> & { _kind: "PONG" };

export type WHAny = WHHello | WHAuth | WHReq | WHRes | WHEvt | WHErr | WHPing | WHPong;

/* -------------------------------------------------------------------------- */
/* Client API                                                                 */
/* -------------------------------------------------------------------------- */

export type WormholesOpenOptions = {
  _url: string;               // ws(s)://.../wh/v2
  _auto_reconnect?: boolean;  // default true
  _reconnect_ms?: number;     // default 1500
  _allow_v1?: boolean;        // default false (opt-in legacy)
  _force_v1?: boolean;        // default false
  _hello_payload?: Record<string, any>;
};

export type WormholesClientAPI = {
  open(opts: WormholesOpenOptions): void;
  close(): void;

  sendSync(payload: any, timeoutMs?: number): Promise<any>;
  sendXcmd(xcmd: XCmd, timeoutMs?: number): Promise<any>;
  sendEvt(name: string, data?: any, args?: any[]): void;

  onOpen(cb: () => void): void;
  set verbose(v: boolean);

  get _ready(): boolean;
  get _wid(): string | undefined;
  get _sid(): string | undefined;
};
