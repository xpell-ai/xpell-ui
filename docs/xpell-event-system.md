# xpell-event-system.md
# Xpell Event System — Strict Rules & Usage

This document defines the **NON-NEGOTIABLE** rules for events in Xpell projects.
If you generate code that violates these rules, it is considered incorrect output.

---

## 1) Two Event Layers

Xpell has **two** event layers:

1) **Global / system events** (not tied to a specific object) → use **`_xem`**
2) **Object-bound events** (tied to an `XObject` / `XUIObject`) → use **`_on_*` hooks** and **`_on` map**

---

## 2) Global Events: `_xem` (Non-Object Events)

Use `_xem` for events that are **not owned by a single XObject**:
- data pipeline signals
- app-level orchestration
- cross-module notifications
- non-UI runtime events

✅ Correct:
```ts
_xem.on("data-arrived", handle);
_xem.fire("data-arrived", { p: 1 });
````

✅ Also correct:

```ts
const off = _xem.on("my-event", (payload) => { ... }); // if your _xem returns unsubscribe
off?.();
```

❌ Forbidden:

* using DOM events as a global bus
* using mutable globals as an “event system”
* polling timers to emulate events

---

## 3) Object Events: JSON Hooks (XObject / XUIObject)

XObjects are already connected to `_xem`.
To handle events on an object, define event handlers in the object JSON.

✅ Correct:

```ts
{
  _type: "view",
  _id: "my-view",
  _on_show: (xobj, e) => {
    // your logic
  }
}
```

### 3.1 Built-in shortcut hooks

**XObject common shortcuts**

* `_on_create`
* `_on_mount`
* `_on_data`
* `_on_frame`

**XUIObject common shortcuts**

* `_on_click`
* `_on_show`
* `_on_hide`
* `_on_change` (for inputs/selects)
* `_on_input` (if supported for live typing)

> If a shortcut exists, prefer it.

---

## 4) Nano Commands (Preferred for Pure JSON / Non-Dev Users)

Event handlers **may be strings** that invoke nano commands instead of JS functions.

Why:

* Pure JSON should not contain executable JS (avoid `eval`)
* Reduces security risk for non-developers
* Enables real-time actions driven by data/schema

✅ Correct:

```ts
{
  _type: "view",
  _on_show: "consolog payload:'like a king'"
}
```

This invokes a nano command named `consolog`, e.g.

```ts
"consolog": (xCommand, xObject) => {
  const payload = xCommand._params["payload"] || "";
  _xlog.log("view loaded " + payload);
}
```

### 4.1 Where nano commands come from

Nano commands can be:

1. **Built into the component** (recommended when developing an XObject)
2. **Attached per instance** via JSON (allowed)

✅ Allowed per-instance nano commands:

```ts
const v = {
  _type: "view",
  _on_show: "consolog payload:'like a king'",
  _nano_commands: {
    consolog: (xCommand, xObject) => {
      const payload = xCommand._params["payload"] || "";
      _xlog.log("view loaded " + payload);
    }
  }
};
```

---

## 5) Generic Event Map: `_on` (Any Event Name)

Use `_on` to attach handlers for:

* custom events (e.g. `keyup`)
* base events (e.g. `show`) when you want uniform syntax
* multiple events on one object

✅ Correct:

```ts
{
  _type: "view",
  _id: "my-view",
  _on: {
    keyup: (xobj, e) => { _xlog.log("Key up:", e.key); },
    show: (xobj) => { _xlog.log("View shown:", xobj._id); }
  }
}
```

✅ Nano-command form in `_on` is allowed if your runtime supports it:

```ts
{
  _type: "view",
  _on: {
    show: "consolog payload:'shown'",
    keyup: "consolog payload:'keyup'"
  }
}
```

---

## 6) Data Events: `_data_source` + `_on_data`

### 6.1 Basic contract

Objects can bind to an XData entry:

```ts
{
  _type: "label",
  _data_source: "some-xd-key",
  _on_data: (xobj, data) => {
    xobj._text = String(data ?? "");
  }
}
```

Rule:

* `_on_data` runs **automatically** when `_xd._o[_data_source]` is updated.

### 6.2 Emptying the data source (optional handshake)

If the object wants to **consume** data and clear it for the next operation:

```ts
{
  _type: "label",
  _data_source: "some-xd-key",
  _on_data: (xobj, data) => {
    xobj._text = String(data ?? "");
    xobj.emptyDataSorce?.();
  }
}
```

> `emptyDataSorce()` is a supported helper in your project to clear the bound data source.

---

## 7) Frame Events: `_on_frame` (No Timers)

If you need periodic work, use frame hooks — **not timers**.

✅ Correct:

```ts
{
  _type: "view",
  _on_frame: (xobj, frame) => {
    // do periodic checks here
  }
}
```

❌ Forbidden:

* `setInterval`
* `setTimeout`
* polling loops to detect XData changes

> If Codex generates timers for polling, it must be refactored to `_on_frame` or proper `_on_data`.

---

## 8) Forbidden Patterns (Absolute)

❌ FORBIDDEN:

* `onClick`, `onChange`, `onclick`, `onchange`, `oninput`, etc.
* `addEventListener` directly
* direct DOM event handlers
* React/Vue/Angular event conventions
* polling timers to emulate events
* querying DOM to discover state or trigger logic

✅ REQUIRED:

* `_xem` for global/system events
* `_on_*` hooks and `_on` map for object-bound events
* nano command strings for safe JSON-driven actions

---

## 9) Recommended Conventions

* Prefer underscore event props:

  * `_on_click`, `_on_change`, `_on_show`, `_on_hide`
* Prefer `_on_data` over polling.
* Prefer nano commands when events are defined in untrusted JSON contexts.
* Keep handlers small; complex logic should live in module code or commands.

---

