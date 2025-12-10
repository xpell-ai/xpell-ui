hooks (useState, useEffect)

# Vision: Engine-Based UI vs Framework-Based UI

For more than a decade, web applications have been built using **framework-based UIs** (React, Vue, Angular, Svelte, etc.). These frameworks are excellent tools for building traditional, document-shaped web apps.

But the next era of software — **AI-driven interfaces, real-time tools, interactive dashboards, autonomous agents, dynamic apps generated on the fly** — requires a different foundation.

The future belongs to **UI engines**.

Xpell is built on this vision: a **real-time UI engine** for the web.

---

## 1. Rendering Philosophy

### Framework-Based UI
Frameworks re-render UI by diffing a virtual representation of components:
- Virtual DOM
- Re-render on state change
- Component lifecycle
- Reconciliation logic
- Batching of updates

This works well for **static or semi-dynamic** interfaces.

### Engine-Based UI
A UI engine runs at **real-time** using a frame loop:
- `_x.start()` controls the update cycle
- UI objects update instantly
- Per-frame hooks run at 60–144 FPS
- No diffing, no virtual DOM
- Direct DOM control

This is how **game engines**, **editors**, and **high-performance tools** operate.

---

## 2. Dynamic vs Static UI Model

### Framework-Based UI
The UI is defined *before runtime*:
- JSX/templating
- Components must be compiled/bundled
- Dynamic creation is possible but awkward
- AI cannot safely generate UI code

The structure is mostly static, the data is dynamic.

### Engine-Based UI
The UI is **fully dynamic at runtime**.

Xpell uses JSON-based XObjects:
```ts
XUI.add({ _type: "button", _text: "Click Me" })
```
Meaning:
- UI can be created, modified, or destroyed at runtime
- AI can generate UI trees safely
- Remote servers can push new layouts
- No build step required
- UI behaves like an in-memory scene graph

This enables prompt-driven UI generation (Vibe Coding).

---

## 3. State & Reactivity

### Framework-Based UI
State flows through:
- hooks (`useState`, `useEffect`)
- props
- reducers
- context
- rendering cycles

It works, but becomes complex at scale.

### Engine-Based UI
Xpell uses a global reactive store (XData) that instantly updates UI:
```ts
_xd._o["value"] = 42
```
UI objects watching "value" update instantly, without re-rendering the tree.
- No reconciliation
- No component boundaries
- No diffing
- No “lifting state up”
- No memoization
- No prop drilling

This is more similar to real-time simulation loops.

---

## 4. Real-Time Interactivity

### Framework-Based UI
React or Vue were not built for:
- Continuous 60FPS updates
- Per-frame animation
- Live transformations
- Complex interaction graphs
- Multi-window workspaces

Developers must use `requestAnimationFrame()` manually — which then fights the framework.

### Engine-Based UI
Xpell is engineered for:
- `._on_frame()` per object
- Seamless animation
- Continuous updates
- Real-time interactions
- Tool-like UIs (IDE, editors, dashboards)
- Multi-view engines
- Scene graph style updates

This matches what’s needed for AI editors, dashboards, 3D-like UIs, real-time agents, etc.

---

## 5. AI-Driven UI Generation

### Framework-Based UI
LLMs generating React code:
- Dangerous
- Often invalid
- Requires bundling
- Hard to update live
- Unsafe to execute

In short: not feasible for real-time AI interaction.

### Engine-Based UI
Xpell’s JSON XObject model makes AI-driven UI generation trivial:
```json
{
  "_type": "view",
  "_children": [
    { "_type": "label", "_text": "Hello" },
    { "_type": "button", "_text": "OK" }
  ]
}
```
An AI can generate or modify the entire UI in real time, safely.

This is the foundation for Vibe Coding — prompts → live UI.

---

## 6. The Future: Autonomous, Real-Time, AI-Driven Interfaces

Modern apps are becoming:
- dynamic
- adaptive
- data-driven
- agent-controlled
- user-personalized
- continuously updated

This requires:
- Secure runtime UI generation
- Real-time updates
- A persistent engine loop
- A unified global data store
- Multi-view UI layouts
- Zero-boilerplate component creation

Frameworks were not designed for this world.
Engines were.

---

## Vision Summary

| Feature / Need                  | Framework-Based UI | Engine-Based UI (Xpell) |
|----------------------------------|--------------------|------------------------|
| Real-time interaction           | ❌ Limited         | ✔ Native               |
| Per-frame updates               | ❌ Manual hacks    | ✔ Default behavior     |
| AI-generated UI                 | ❌ Unsafe          | ✔ Safe, native         |
| Dynamic runtime UI creation     | ⚠️ Complex         | ✔ Simple & instant     |
| Global reactive data            | ⚠️ Boilerplate     | ✔ Zero-boilerplate     |
| Multi-window tool UIs           | ❌ Hard            | ✔ Natural              |
| Full runtime layout changes     | ❌ Rare            | ✔ Core feature         |
| Ideal for dashboards/editors    | ⚠️ Heavy           | ✔ Excellent            |
| Ideal for AI-driven apps        | ❌ Not designed    | ✔ Built for it         |

---

## Final Thought

Frameworks model web pages. Engines model interactive worlds.

As AI takes over interface generation and applications become more dynamic, the industry will shift away from framework-based UIs toward engine-based UI layers.

**Xpell is built for that future.**