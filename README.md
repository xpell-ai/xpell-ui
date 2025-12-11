# Xpell-UI — Real-Time UI Engine for the Web

**Xpell-UI** is the web implementation of the **Xpell real-time application framework**.  
It provides a high-performance UI engine built for interactive, dynamic, and AI-driven web applications using **TypeScript, JavaScript, and HTML**.

Xpell-UI is designed for applications that require:

- real-time UI updates  
- smooth animations  
- high FPS rendering  
- AI-assisted behavior  
- dynamic and reactive interfaces  

It powers dashboards, tools, visual editors, 3D UI layers, and next-generation AI user experiences.

## What Xpell-UI Includes

### ⚡ XUI — Real-Time UI Engine
Low-level component system that updates DOM elements continuously and efficiently.

### 🗄️ XDB — Data Layer for UI State
A lightweight in-memory database designed for live app state and reactive UIs.

### 🔌 Wormholes — Real-Time Communication
Server–client sync via WebSocket and REST, enabling multi-user, collaborative, or AI-powered workflows.

### 🤖 Optional AI-Driven Logic
Xpell-UI can integrate with AI agents (like AIME) to dynamically create, modify, or drive UI behavior.

## Installation

    npm install xpell-ui

or

    pnpm add xpell-ui

## Getting Started

A minimal example that starts the Xpell engine, loads the XUI module, and renders a simple label on screen:

    import { Xpell,XUI } from "xpell-ui";

    // Start the Xpell frame engine
    Xpell.start();

    // Load the UI module
    Xpell.loadModule(XUI);

    // Create a main player div and attach it to <body>
    XUI.createPlayer("xplayer");

    // Add a label element to the UI
    XUI.add({
      _type: "label",
      _id: "hello-label",
      style: "position:absolute;top:10px;left:10px;color:white;",
      _text: "hello world..."
    });

## When to Use Xpell-UI

Use Xpell-UI when building:

- dashboards  
- admin tools  
- real-time control panels  
- creative web applications  
- AI-driven interfaces  
- data visualizations  
- applications requiring continuous UI updates  

For a complete framework including UI, 3D, AI, and real-time sync, install:

    npm install xpell

## Related Packages

- **xpell-core** – Xpell engine and runtime loop  
- **xpell-ui** – the UI engine (this package)  
- **xpell-3d** – 3D/WebGL visual engine  
- **xpell** – unified entry point bundling all modules  

## License & Credits

MIT License  
Author: Tamir Fridman  
Email: fridman.tamir@gmail.com  
First Release: 22/07/2022  
© Aime Technologies, 2022–Present
https://xpell.ai