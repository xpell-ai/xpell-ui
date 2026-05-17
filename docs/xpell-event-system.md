
Xpell Event System — Strict Rules & Usage

This document defines the NON-NEGOTIABLE rules for events in Xpell projects.
If you generate code that violates these rules, it is considered incorrect output.

⸻

1) Two Event Layers

Xpell has two event layers:
	1.	Global / system events (not tied to a specific object) → use _xem
	2.	Object-bound events (tied to an XObject / XUIObject) → use _on + lifecycle hooks

⸻

2) Global Events: _xem (Non-Object Events)

Use _xem for events that are not owned by a single object:
	•	data pipeline signals
	•	app-level orchestration
	•	cross-module notifications
	•	non-UI runtime events

✅ Correct:

_xem.on("data-arrived", handle);
_xem.fire("data-arrived", { p: 1 });

✅ Also correct:

const off = _xem.on("my-event", (payload) => { ... });
off?.();

❌ Forbidden:
	•	using DOM events as a global bus
	•	using mutable globals as an event system
	•	polling timers to emulate events

⸻

3) Object Events: _on (Primary Event System)

Object-bound events MUST be defined using the _on map.

Event names MUST be real DOM or runtime event names (NO underscore prefix).

✅ Correct:

{
  _type: "button",
  _on: {
    click: (xobj, e) => {
      _xlog.log("clicked");
    }
  }
}

❌ Forbidden:

_on_click ❌
_on_hover ❌
_on_change ❌

These are legacy patterns and must not be used.

⸻

3.1 DOM Event Binding

XUI binds DOM events directly via addEventListener.

Event names MUST match native DOM events:
	•	click
	•	input
	•	change
	•	keyup
	•	keydown
	•	mouseenter
	•	mouseleave

Example:

_on: {
  click: ...
  keyup: ...
}

No automatic mapping is performed.

⸻

3.2 Lifecycle Events (Non-DOM)

These are runtime-driven events (not DOM):
	•	_on_create
	•	_on_mount
	•	_on_show
	•	_on_hide
	•	_on_data
	•	_on_frame

Example:

{
  _type: "view",
  _on_show: (xobj) => {
    _xlog.log("view shown");
  }
}


⸻

4) Nano Commands (Preferred for Pure JSON / Non-Dev Users)

Event handlers may be strings invoking nano commands.

Why:
	•	Avoid executable JS in JSON
	•	Safer for non-developers
	•	Enables runtime-driven UI logic

✅ Example:

{
  _type: "view",
  _on: {
    click: "consolog payload:'clicked'"
  }
}

Nano command:

"consolog": (xCommand, xObject) => {
  const payload = xCommand._params["payload"] || "";
  _xlog.log(payload);
}


⸻

5) Data Events: _data_source + _on_data

Basic contract

{
  _type: "label",
  _data_source: "some-xd-key",
  _on_data: (xobj, data) => {
    xobj._text = String(data ?? "");
  }
}

Rule:
	•	_on_data triggers automatically when _xd._o[key] updates

Optional consumption pattern

_on_data: (xobj, data) => {
  xobj._text = String(data ?? "");
  xobj.emptyDataSorce?.();
}


⸻

6) Frame Events: _on_frame (No Timers)

Use frame hooks for periodic logic.

✅ Correct:

_on_frame: (xobj, frame) => {
  // periodic logic
}

❌ Forbidden:
	•	setInterval
	•	setTimeout
	•	polling loops

⸻

7) Forbidden Patterns (Absolute)

❌ FORBIDDEN:
	•	onClick, onChange, onclick, etc.
	•	_on_click, _on_change, _on_hover
	•	direct DOM event handlers
	•	React/Vue/Angular conventions
	•	polling timers
	•	querying DOM for state

✅ REQUIRED:
	•	_xem for global/system events
	•	_on for object-bound DOM events
	•	lifecycle hooks for runtime events
	•	nano commands for JSON-driven logic

⸻

8) Recommended Conventions
	•	Prefer _on with real event names:

_on: {
  click: ...
  change: ...
}

	•	Do NOT use _on_click, _on_change (deprecated)
	•	Prefer _on_data over polling
	•	Prefer nano commands in untrusted JSON
	•	Keep handlers small

⸻

9) ⚠️ Common Mistake

❌ Wrong:

_on: { _click: ... }

✔ Correct:

_on: { click: ... }

Underscore-prefixed event names are NOT valid DOM events.

⸻

10) Architecture Summary

Layer	Responsibility
_xem	global runtime events
_on	DOM event binding
_on_*	lifecycle/runtime hooks


⸻

Final Rule

Xpell does NOT use magic event naming anymore.
All DOM events must be explicit and standard.

⸻
