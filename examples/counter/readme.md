## Counter Example (Xpell UI)

This example demonstrates a simple reactive counter using the [Xpell UI](https://github.com/fridman-tamir/xpell) framework. It showcases real-time data binding, UI composition, and event handling.

---

## Features
- Reactive counter display
- Increment button with real-time updates
- Uses Xpell modules: XUI and XData

---

## Getting Started

### Prerequisites
- Node.js and npm installed
- The `xpell-ui` package installed (see root README for setup)

### Running the Example
1. Install dependencies in the root of the project:
	```sh
	npm install
	```
2. Start the dev server (from the root or this example folder):
	```sh
	npm run dev
	```
3. Open the corresponding HTML file in your browser (e.g., `examples/counter/index.html`).

---

## How It Works

### Main Concepts
- **Xpell Engine**: Handles the app lifecycle and frame loop.
- **XUI**: Declarative UI module for building views and components.
- **XData**: Real-time data cache for state management.

### Code Overview

#### 1. Engine Initialization
```ts
_x.start();        // Start the Xpell engine
_x.loadModule(XUI); // Load the UI module
```

#### 2. Player Container
```ts
XUI.createPlayer("xplayer", "xpell-root", undefined, true);
// Automatically adds <div id="xplayer" class="xpell-root"></div> to the DOM
```

#### 3. Reactive Data Source
```ts
_xd._o["counter"] = 0; // Initialize counter value
```

#### 4. UI Construction
- The UI is built using XObjects:
  - Title label
  - Counter label (bound to `counter` data)
  - Increment button (updates `counter` on click)

#### 5. Data Binding & Events
- The counter label updates automatically when the data changes.
- The button increments the counter value.

---

## File Structure

- `main.ts` — Main entry point, contains all counter logic and UI setup
- `index.html` — HTML file to load and run the example
- `style.css` — Custom styles for the counter UI (if present)

---

## Customization
- You can modify the UI, styles, or add features (decrement, reset, etc.) by editing `main.ts` and `style.css`.
- Explore the [Xpell UI documentation](https://github.com/xpell-ai/xpell-ui) for more advanced features.

---

## Credits
Created with [Xpell UI](https://github.com/xpell-ai/xpell-ui) by Tamir Fridman.
