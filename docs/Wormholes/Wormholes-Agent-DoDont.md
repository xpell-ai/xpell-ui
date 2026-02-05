# Wormholes v2 — Codex DO / DON'T

## DO ✅
- Use `_kind` (UPPERCASE)
- Use `makeReq`, `makeEvt`, `makeEnvelope`
- Correlate RES via `_rid`
- Fire UI events via `_xem`
- Funnel incoming data into XData

## DON'T ❌
- Don't invent fields
- Don't use lowercase message kinds
- Don't bypass envelope
- Don't mutate `_xd._o` outside Wormholes
- Don't call WebSocket APIs directly in UI components
