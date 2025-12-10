# Introduction to Xpell-UI
Xpell-UI is the web implementation of the Xpell Real-Time UI Engine. It is a component-based, code-driven framework for interfaces that need real-time updates, high performance, and minimal bootstrap overhead.

## Core principles
- **Real-time frame loop:** Per-frame updates for animations, data-driven UI, and zero-delay reactions without a virtual DOM diff.
- **Declarative XObjects:** JSON-based element definitions that Xpell translates into DOM nodes it manages.
- **Reactive state (XData):** Lightweight store that pushes updates directly to bound elements.
- **Direct DOM access:** When needed, you can interact with the underlying elements for fine-grained control.

## XObjects at a glance
An XObject is a JSON description of a UI element:

```ts
{
  _type: "label",
  _id: "hello",
  _text: "Hello Xpell!",
  style: "font-size: 24px; color: #333;"
}
```

Supported fields (common):
- `_type` – component type (label, view, button, etc.)
- `_id` – unique identifier
- `_children` – nested elements
- `_text` – text content
- `class` / `style` – styling
- Event handlers: `_on_click`, `_on_mount`, `_on_show_animation`
- Lifecycle hooks: `_on_frame`, `_on_data`

## Reactive state with XData
Bind UI elements to reactive data:

```ts
import { XData as _xd } from "xpell-ui";

_xd._o["score"] = 5;
```

```ts
{
  _type: "label",
  _id: "score-label",
  _data_source: "score",
  _on_data: (xobj, value) => {
    xobj._text = "Score: " + value;
  }
}
```

Updating `_xd._o["score"]` automatically refreshes any bound element.

## Getting started
```ts
import { Xpell as _x, XUI, XData as _xd } from "xpell-ui";

_x.start();         // start the real-time frame loop
_x.loadModule(XUI); // enable the XUI engine
```

### Create a player container
```ts
XUI.createPlayer("xplayer", "xpell-root", undefined, true);
```
This becomes the main mount point, so added components do not need `_parent_element`.

### Add UI
```ts
XUI.add({
  _type: "view",
  _id: "home",
  _children: [
    {
      _type: "label",
      _id: "title",
      _text: "Hello Xpell-UI",
      style: "font-size: 2em;"
    },
    {
      _type: "button",
      _id: "btn",
      _text: "Click Me",
      _on_click: () => console.log("Clicked!")
    }
  ]
});
```

## Events and lifecycle hooks
- Mount: `_on_mount: (xobj) => { ... }`
- Click: `_on_click: (xobj, event) => { ... }`
- Frame loop (animation): `_on_frame: (xobj, frame) => { xobj.dom.style.opacity = (Math.sin(frame / 10) + 1) / 2; }`
- Data binding: `_data_source` + `_on_data`

## Why Xpell-UI?
- Real-time control without a virtual DOM
- Declarative definitions, simple reactive data
- Direct DOM access when performance matters
- Works with Xpell Server, Wormholes, and XAI
- Built for live tools, dashboards, games, editors, and AI-driven apps

## What’s next
Explore components, styling, data binding, animations, and example projects (Tic-Tac-Toe, Counter demo) to see the patterns in practice.
