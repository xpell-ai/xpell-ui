# Changelog

## [2.0.8] — 2026-11-13 (unreleased candidate)

- Emit the CommonJS bundle with a .cjs extension and align main/require exports, so ESM package metadata does not misclassify it.
- Compared with public 2.0.7 declarations: add XFileInput and File Client runtime loading, Wormholes hello/server identity and scoped runtime skill synchronization.
- Compatibility review: XVM._set_default_app reports _result rather than the old declared _default_app shape; XVMClient._xstudio is nullable when edit mode is unavailable. Review consumers of these members.
- Fix the public @xpell/ui/xui.css export to reference the generated dist/ui.css.
- Retain the existing typed browser entrypoint, File Service client and system-xapps manifest/assets.
- Verify the stylesheet target exists and is nonempty alongside the system-xapps package checks.

Compatibility: internal workspace specifications are retained. No public API redesign, PostgreSQL backend, persistence migration or automatic SQLite activation is introduced by this preparation.

Validation: package builds and available tests are recorded in the coordinated Gate 2 report. Gate 3 must verify the exact packed artifacts and clean-consumer compatibility before publication. These entries describe verified checked-out capabilities and release-preparation deltas; they do not claim that every capability is new relative to the last npm artifact.

All notable changes to **xpell-ui** will be documented in this file.

This project follows **Semantic Versioning** with pre-release tags (`alpha`, `beta`).
Until `1.0.0`, breaking changes may occur between alpha versions.

---

## [2.0.0-alpha.2] – 2025-03-XX

### 🚀 Added
- **XVM (Xpell View Manager)** – new runtime responsible for navigation, regions, history, and routing.
- **XVMApp** – declarative application manifest for defining apps as data.
- Region-based navigation model with per-region history and URL hash policies.
- First-class modal regions with deterministic lifecycle and no hidden overlays.
- App-level loader via `XVM.app()` / `XVM.loadApp()`.
- Hash-based router initialization with fallback views.

### 🔄 Changed
- XUI is now strictly a **rendering and lifecycle engine** (no navigation logic).
- View visibility (`show`, `hide`) is now controlled exclusively by XVM.
- Navigation responsibilities fully moved out of XUI.
- App structure is defined declaratively instead of imperative wiring.

### ⚠️ Breaking
- `XViewManager` is fully replaced by **XVM**.
- Applications should migrate to `XVMApp` instead of manual view wiring.
- Modal handling must be done via regions, not ad-hoc DOM overlays.

### 📝 Notes
- This release defines the **foundational app architecture** for Xpell UI.
- Server-side work will target the `XVMApp` contract introduced here.
- APIs are still evolving; backward compatibility is not guaranteed in alpha.

---

## [2.0.0-alpha.1]

### ⚠️ Breaking
- XAI module removed from `xpell-ui` and moved into a separate package.
- `xpell-core` is now required instead of the old internal `/core` folder.
- `XViewManager` deprecated in favor of the new view management flow.
- `_xui` global is no longer implicitly available.

### ✨ Added
- Bi-directional **Wormholes** for real-time client–server synchronization.
- **XNanoCommands** support for events and data-driven UI behavior.
- Per-object debug mode (`_debug`) with structured logging.

### 🛠 Fixes & Improvements
- Fixed inheritance issues in core XUI objects.
- Internal refactoring to align with `xpell-core` and the new runtime direction.

---

## Pre-2.0 Releases

Earlier releases focused on:
- Core XUI rendering engine
- Continuous frame updates
- Experimental view management
- Initial real-time and AI integration

These versions are considered **legacy** relative to the 2.x architecture.

---
