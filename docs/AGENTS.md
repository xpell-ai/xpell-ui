# AGENTS.md — @xpell/ui

Before making changes, apply:

- /docs/skills/xpell-contract
- /docs/skills/xpell-core
- /docs/skills/xpell-xvm
- /docs/skills/xpell-ui

Rules:
- Client/browser only.
- No Node APIs.
- Views are JSON-first.
- Use `_on` with real DOM event names: `click`, `change`, `input`, `keyup`.
- Do not use `_click`.
- Use XEM for app events.
- Use FlowManagerClient only as event → server flow router.
- Use XVM for navigation and active-view lifecycle.
- Use Wormholes for server calls.
- Do not infer missing state.