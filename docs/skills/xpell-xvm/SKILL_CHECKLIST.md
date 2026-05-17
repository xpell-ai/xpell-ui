# Xpell XVM Checklist

Use this before finalizing XVM implementation or review work.

## Scope

- [ ] Identify whether the change is server-only, client-only, or cross-runtime.
- [ ] Read `SKILL_API_MAP.md` when touching exact ops, payloads, method names, exports, or manifest fields.
- [ ] Keep `server-xvm`, `XVM`, `XVMClient`, and `XUIRuntime` responsibilities separate.

## Server XVM

- [ ] `_app_id` is validated as a non-empty string.
- [ ] `_env` defaults to `"default"` when omitted.
- [ ] Views require `_id`; flows require `_id`.
- [ ] View/flow writes increment `app._meta._version`.
- [ ] View/flow writes refresh `app._meta._updated_at`.
- [ ] Persistence goes through `server-xvm`; product modules do not write `app.json`, `views/*.json`, or `flows/*.json` directly.
- [ ] Persisted app/view/flow JSON is data-only and contains no functions.
- [ ] `_subscribe` uses transport-owned context for `_wid`; it does not trust client-authored connection ids.
- [ ] Realtime broadcasts use `wsBroadcastScoped(app_id, env, ...)`, not global fanout.
- [ ] Server push event name sent to clients remains `xvm:update`.
- [ ] `server-xvm` stores flows but does not execute them.

## Client XVM

- [ ] XUI add/mount paths remain structural and do not call `show()`.
- [ ] View visibility remains owned by XVM stacking.
- [ ] URL/hash writes remain owned by `XVM.navigate()`.
- [ ] App code uses regions by default; container IDs are explicit low-level overrides.
- [ ] Containers are registered before regions.
- [ ] Raw views and factories are registered before route/start navigation.
- [ ] `show()` does not mutate the URL.
- [ ] `navigate()` respects region `hashSync` and `silent`.
- [ ] No Node.js APIs or server persistence are introduced in browser XVM code.

## XVMClient

- [ ] Bootstrap still fetches app metadata before fetching views.
- [ ] Entry view resolution checks `_meta._entry_view_id`, then `_config._start._view_id`, then first view id.
- [ ] Client cache keys remain scoped by `env` and `app_id`.
- [ ] Cache remains infrastructure-scoped inside `XVMClient`.
- [ ] `xvm:update` handlers filter by `_app_id` and `_env`.
- [ ] Stale pushed versions are ignored.
- [ ] Active view updates patch with `update(_view)` when possible and re-render as fallback.
- [ ] Offline fallback only mounts when no view has already rendered.

## Cross-Runtime

- [ ] Server and client agree on `_app_id`, `_env`, `_view_id`, `_version`, and `_view` payload fields.
- [ ] Command op naming stays dispatcher-compatible for snake-case and hyphenated callers.
- [ ] Server `app._config` manifest fragments are valid client `XVMApp` fragments.
- [ ] Flow changes coordinate with `FlowManagerModule`; XVMClient does not assume flow hydration.
- [ ] Build or typecheck the touched package when implementation changed:
  - server: `pnpm -C packages/xnode build`
  - client: `pnpm -C packages/xpell-ui build`
