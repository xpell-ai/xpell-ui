# Codex Checklist for @xpell/ui

Use before finalizing generated UI code or reviewing changes that touch `@xpell/ui`.

## Codex Skill Compatibility

- [ ] `SKILL.md` frontmatter uses only Codex-supported keys: `name`, `description`, optional `license`, `allowed-tools`, and `metadata`.
- [ ] `name` is hyphen-case (`xpell-ui`).
- [ ] `description` is plain text, trigger-oriented, under 1024 characters, and contains no angle brackets.
- [ ] Detailed API facts live in `SKILL_API_MAP.md`, not duplicated heavily in `SKILL.md`.
- [ ] This checklist is loaded only for review/finalization, not as default context.

## UI Composition

- [ ] UI composition uses declarative JSON objects with `_type`, `_id`, `_children`, and props.
- [ ] Concrete wrappers are preferred over generic `xhtml` when available.
- [ ] New UI wrappers extend `XUIObject`.
- [ ] New `_type` values are registered in an object pack.
- [ ] Runtime contract fields remain underscore-prefixed.
- [ ] Public user code imports from `@xpell/ui`, not private source paths.

## XUI and XUIObject

- [ ] `XUI.add()` / `XUI.mount()` remain structural and do not call `show()` or `onShow()`.
- [ ] App-level code does not perform unmanaged DOM mutation when `XUI`, `XVM`, `XUIObject`, or Nano-Commands can express the behavior.
- [ ] Text/class/style/attribute changes use object APIs, `update(...)`, or built-in Nano-Commands.
- [ ] Built-in wrapper constructors follow the local pattern: defaults, `super(data, defaults, true)`, `this.parse(data)`.
- [ ] Child updates preserve the XUI object graph and DOM order.
- [ ] `_on_click` is not used in new persisted view data.
- [ ] Click handlers use `_on: { click: ... }`.
- [ ] `_on` / `_once` DOM bindings are guarded against duplicate listener registration.
- [ ] `_flow` DOM bindings are guarded against duplicate listener registration.

## XVM

- [ ] `stackInternal()` remains the only implementation path that calls `target.show()`.
- [ ] `stack()` delegates to `stackInternal()`.
- [ ] `add()`, `registerRawView()`, `registerViewFactory()`, and `registerRoute()` do not show views.
- [ ] `navigate()` remains the URL/hash write owner.
- [ ] Region/container logic enforces one active view per container through `_active` and `clearActive()`.
- [ ] Hash writes are skipped when region `hashSync=false` or navigation is silent.

## Events, Data, and Flow

- [ ] Persisted view handlers use Nano-Commands v2 text or JSON, not JavaScript functions.
- [ ] JS function handlers are limited to runtime-only factories, local prototypes, or tests where existing code supports them.
- [ ] Shared runtime state uses `_xd`, `_data_source`, and `_on_data`.
- [ ] No direct `_xd._o[...]` writes are introduced.
- [ ] `pnpm run check:xdata-legacy` still passes for `packages/xpell-ui` when relevant.
- [ ] `_flow` only emits `ui:flow-trigger`; it does not execute flows directly.
- [ ] XUIObject does not call `_x.execute({ _module: "flow" ... })` or `_x.execute({ _module: "flow-client" ... })`.
- [ ] Flow trigger payloads are normalized and do not include raw DOM `Event` objects.
- [ ] Flow trigger payloads include `_flow_id`, `_event_name`, `_event_payload`, `_object_id`, optional `_app_id`, optional `_env`, and `_source: "ui"`.
- [ ] `_flow_event` defaults to `click`.
- [ ] `_flow_auto: false` disables automatic flow triggering.
- [ ] FlowManagerClient registers `ui:flow-trigger` through module `load()`, not at import time.
- [ ] FlowManagerClient routes execution through `_x.execute`.
- [ ] Bound flow events skip payloads with `_source: "ui"` to avoid duplicate execution.
- [ ] Duplicate flow bindings for the same flow/event/app/env are ignored.
- [ ] Runtime/XEM events inside `_on` / `_once` use the `xem:` prefix.
- [ ] DOM events inside `_on` / `_once` do not use prefixes.
- [ ] XUIObject does not override XObject event semantics; runtime events go through inherited `addEventListener(...)`.
## Transport and Runtime

- [ ] Server-driven views use `XVMClient` or `XUIRuntime` and stay behind Wormholes/XVMClient boundaries.
- [ ] `Wormholes` v2 is the default; v1 is used only with explicit `_allow_v1` or `_force_v1`.
- [ ] `XDB` use is infrastructure-scoped browser cache/local storage, not hidden app domain persistence.
- [ ] FlowManagerClient bindings route flow execution through `_x.execute` and normalized event payloads.

## Browser Boundary

- [ ] No Node.js APIs are introduced in browser runtime files (`fs`, `path`, `process`, `child_process`).
- [ ] No server handlers, server persistence, or host-owned request routing is embedded in UI objects or view code.
- [ ] Browser globals are kept in browser-only package paths.
- [ ] No SSR assumptions are added.

## Timer Policy

- [ ] No `setInterval`.
- [ ] No polling loops or busy loops.
- [ ] `setTimeout` is one-shot, bounded, and used only for infrastructure such as hash guards, reconnect backoff, request deadlines, or UI settle behavior.
- [ ] `queueMicrotask` is used only for bounded post-mount/create-pass style work.

## Public API and Build

- [ ] Any public API change updates `src/index.ts`.
- [ ] Any package export change updates `package.json` and `SKILL_API_MAP.md`.
- [ ] `pnpm build` passes from `packages/xpell-ui` when code changed.
- [ ] `pnpm run build:types` passes from `packages/xpell-ui` when types changed.