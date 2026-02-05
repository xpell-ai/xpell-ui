
# Wormholes v2 — Protocol & Usage Guide (xpell-ui)

> **Status:** Alpha  
> **Scope:** Client-side Wormholes (xpell-ui)  
> **Audience:** Xpell developers, Codex users, contributors

---

## 1. What is Wormholes?

**Wormholes** is Xpell’s real-time communication layer.

It provides a **persistent, bidirectional channel** between:
- a **UI runtime** (`xpell-ui`)
- a **server runtime** (`xnode`)

Wormholes is **transport + session orchestration only**.  
It is **NOT UI**, **NOT state**, **NOT navigation**, **NOT persistence**.

---

## 2. Design Goals

- JSON-only protocol (no nested JSON strings)
- Deterministic request/response correlation
- Explicit session & identity handling
- Compatible with:
  - WebSocket (primary)
  - REST (secondary, optional)
- Safe ingress boundary into Xpell runtime

---

## 3. Versioning

This document describes **Wormholes v2**.

| Version | Status | Notes |
|-------|--------|------|
| v1 | Legacy | Kept only for backward compatibility |
| v2 | Current | Canonical protocol (this doc) |

The default export in `xpell-ui` is **v2 via facade**.

---

## 4. High-Level Architecture

```
UI (xpell-ui)
   |
   |  Wormholes (WS / REST)
   |
xnode (server)
   |
   |  _x.execute()
   |
Xpell modules / XDB / MAT
```

Wormholes **never bypasses** `_x.execute()`.

---

## 5. Envelope (Canonical Shape)

Every message is a **single JSON object**.

```ts
type WHEnvelope<T = any> = {
  _v: 2;
  _id: string;
  _kind: "HELLO" | "AUTH" | "REQ" | "RES" | "EVT" | "ERR" | "PING" | "PONG";

  _rid?: string;        // RES → REQ correlation
  _sid?: string;        // session id
  _wid?: string;        // connection id
  _ts: number;

  _payload?: T;
  _meta?: {
    _node?: string;
    _user_agent?: string;
    _ip?: string;
  };
};
```

### Rules
- `_kind` is **UPPERCASE**
- `_id` is unique per message
- `RES._rid === REQ._id`
- Payload is **never stringified JSON**

---

## 6. Message Kinds

### 6.1 HELLO
Sent by client immediately after WS open.

```ts
{
  _kind: "HELLO",
  _payload: {
    _protocol: "wormholes",
    _v: 2,
    _caps: ["reqres","evt"]
  }
}
```

Purpose:
- protocol negotiation
- capability discovery
- optional server → client `_wid` assignment

---

### 6.2 AUTH
Optional authentication step.

```ts
{
  _kind: "AUTH",
  _payload: {
    _token: "...",
    _owner_entity_id: "..."
  }
}
```

Server returns `_sid` inside `RES._payload`.

---

### 6.3 REQ / RES (Command Execution)

REQ payload is **XCmd**:

```ts
{
  _kind: "REQ",
  _id: "abc",
  _payload: {
    _module: "users",
    _op: "list",
    _params: {}
  }
}
```

RES payload is **XResponseData**:

```ts
{
  _kind: "RES",
  _rid: "abc",
  _payload: {
    _ok: true,
    _result: [...]
  }
}
```

---

### 6.4 EVT (Push Events)

Server → client push event.

```ts
{
  _kind: "EVT",
  _payload: {
    _name: "inventory:update",
    _args: [{ id: 1 }]
  }
}
```

Client behavior:
```ts
_xem.fire(_name, ..._args)
```

---

### 6.5 PING / PONG

Used to keep connection alive and measure RTT.

---

## 7. Client API (xpell-ui)

You **MUST NOT** create WebSocket manually.

Always use the **Wormholes facade**.

```ts
import { Wormholes } from "xpell-ui";

Wormholes.open({
  _url: "ws://localhost:3000/wh/v2"
});

Wormholes.sendXcmd({
  _module: "users",
  _op: "list"
});
```

### Available Methods

```ts
open(opts)
close()

sendSync(payload)
sendXcmd(xcmd)
sendEvt(name, data?, args?)

onOpen(cb)

get _ready
get _sid
get _wid
```

---

## 8. XData Integration (IMPORTANT)

Wormholes is an **ingress boundary only**.

Allowed:
- Server pushes EVT
- Client maps EVT → `_xem.fire()`
- Legacy support may write to `_xd._o`

Forbidden:
- Writing to `_xd._o` in new code
- Treating Wormholes as state
- Mirroring server state locally

---

## 9. Facade & Backward Compatibility

- `Wormholes` (default) → v2
- `WormholesV1` → legacy
- `WormholesFacade` auto-selects based on URL

v1 usage requires **explicit opt-in**.

---

## 10. Codex Rules (CRITICAL)

Codex-generated code MUST:

- Use `Wormholes.open()`
- NEVER create WebSocket / fetch manually
- NEVER parse JSON envelopes manually
- NEVER assume server behavior
- NEVER bypass `_x.execute()`

If unsure → STOP.

---

## 11. Summary

Wormholes is:
- ✔ transport
- ✔ session
- ✔ protocol

Wormholes is NOT:
- ❌ UI
- ❌ state
- ❌ database
- ❌ event bus replacement

Treat it as a **clean, strict bridge**.

---

© Aime Technologies / Xpell
