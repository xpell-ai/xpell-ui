# Xpell Codex – Working Contract

This document defines the strict rules for AI-assisted development in the Xpell codebase.

---

## Core Principles

1. **Do not infer missing APIs**
   - If an API, method, or behavior is not explicitly known, it must be treated as unknown.
   - Unknown APIs must be marked clearly as TODO or conceptual.

2. **Respect existing architecture**
   - Do not bypass XVM, XUI, or app bootstrap flows.
   - Do not introduce parallel runtimes or standalone apps unless explicitly requested.

3. **Single source of truth**
   - App state, routing, and UI structure must come from the existing XVM app definition.
   - Views are registered once and referenced by `_id`.

4. **No silent magic**
   - No hidden auto-repair, implicit state guessing, or background inference.
   - Every mutation must be explicit and traceable.

5. **Readable over clever**
   - Prefer simple, explicit code over abstractions.
   - This is a platform, not a demo.

---

## XVM Rules

- Navigation must go through XVM router.
- Views must declare `_id` and target region explicitly.
- Regions and containers are pre-declared in the app config.
- Do not create new regions or containers unless requested.

---

## XUI Rules

- UI is created via XUI runtime objects.
- DOM is real DOM, not virtual DOM.
- CSS is external and standard.
- Player creation must be explicit.

---

## Playground-Specific Rules

- Playground must live INSIDE the existing app.
- No iframes unless explicitly requested.
- Preview must be resettable.
- Errors must be visible to the user.

---

## Output Rules (for AI)

When generating code or docs:

- Modify only the files necessary.
- Always list changed files.
- Keep diffs minimal.
- Do not rewrite unrelated code.
- If unsure — stop and mark TODO.

---

## End of Contract
