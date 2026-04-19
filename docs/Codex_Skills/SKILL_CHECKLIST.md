# Codex Generation Checklist for @xpell/ui

Use this checklist before finalizing generated UI code.

## Required

- [ ] Always use declarative JSON objects (`_type`, `_id`, `_children`, props) for UI composition.
- [ ] Prefer concrete wrappers (`view`, `label`, `button`, `input`, `svg`, etc.) over generic `xhtml` when a concrete wrapper exists.
- [ ] Never embed business logic inside UI object classes; keep behavior in nano-commands/events/runtime modules.
- [ ] No direct DOM manipulation in app-level code; use `XUI`, `XVM`, and `XUIObject` APIs.
- [ ] Use XData (`_xd`) for shared runtime state and `_data_source`/`_on_data` for bindings.
- [ ] Use nano-commands for behavior wiring (`_on_*`, `_on`, `_once`) instead of ad-hoc imperative handlers.
- [ ] Do not mix server modules into UI layer code; server calls must stay behind Wormholes/XVMClient boundaries.
- [ ] Do not bypass `XUIObject` inheritance for new UI wrappers.
- [ ] Core symbols re-exported by `@xpell/ui` do not relax UI constraints (no server logic/persistence in UI code, no Node APIs).
- [ ] View handlers stored in view data are Nano-Commands v2 (text/JSON), never JS functions.
- [ ] XVM invariants hold: only `stackInternal()`/`stack()` show active views; `add()`/`register*()` never show; only `navigate()` writes URL/hash.
- [ ] Timers follow infra-only policy: bounded one-shot `setTimeout`/`queueMicrotask` only; no `setInterval`, no polling.

## Additional safety checks

- [ ] Do not introduce Node.js APIs (`fs`, `path`, `process`, `child_process`) in UI runtime files.
- [ ] Do not introduce polling loops (`setInterval` / busy loops). Use event-driven updates.
- [ ] Keep lifecycle separation: mount/add is structural, navigation/showing is owned by XVM.
- [ ] Keep `_`-prefixed contract fields for runtime semantics (`_on_*`, `_data_source`, `_parent_element`, etc.).
- [ ] If persistent cache is needed, keep it infrastructure-scoped (current code uses `XDB` inside `XVMClient`, not UI wrappers).
