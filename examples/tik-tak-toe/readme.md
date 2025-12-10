## Tic-Tac-Toe Game Example (Xpell UI)

This example demonstrates how to build a simple interactive Tic-Tac-Toe game using the [Xpell UI](https://github.com/fridman-tamir/xpell) framework. It showcases real-time data binding, UI composition, and basic animation.

### Features
- Interactive 3x3 Tic-Tac-Toe board
- Real-time turn tracking and winner detection
- Dynamic UI updates and simple animations
- Uses Xpell modules: XUI, XData, XUIAnimate, and logging

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
3. Open `examples/tik-tak-toe/testwh.html` or the appropriate entry HTML in your browser.

---

## How It Works

### Main Concepts
- **Xpell Engine**: Handles the app lifecycle and frame loop.
- **XUI**: Declarative UI module for building views and components.
- **XData**: Real-time data cache for state management.
- **XUIAnimate**: Animation utilities for UI elements.

### Code Overview

#### 1. Engine Initialization
```ts
_x.verbose = true; // Enable verbose logging
_x.start();        // Start the Xpell engine
_x.loadModule(XUI); // Load the UI module
```

#### 2. Game State
```ts
const turn = "X";
const board = [
  ["?", "?", "?"],
  ["?", "?", "?"],
  ["?", "?", "?"],
];
_xd._o["ttt-turn"] = turn; // Store current turn in XData
```

#### 3. UI Construction
- The board is built using nested views and buttons.
- Each cell is a button that updates the board and turn on click.
- The status label is bound to the current turn and updates automatically.

#### 4. Winner Detection
- After each move, the code checks for a winner (row, column, diagonal).
- If a winner is found, the status label updates and animates.

#### 5. Animations
- The title uses a bounce animation on show.
- The winner label animates its color on each frame.

---

## File Structure

- `main.ts` — Main entry point, contains all game logic and UI setup
- `style.css` — Custom styles for the game board and UI
- `testwh.html` — HTML file to load and run the example

---

## Customization
- You can modify the board size, styles, or add features (score, reset, etc.) by editing `main.ts` and `style.css`.
- Explore the [Xpell UI documentation](https://github.com/xpell-ai/xpell-ui) for more advanced features.

---

## Credits
Created with [Xpell UI](https://github.com/xpell-ai/xpell-ui) by Tamir Fridman.
