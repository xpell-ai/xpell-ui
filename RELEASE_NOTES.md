Xpell UI – Release Notes
Version 2.0.0-alpha.1

Breaking Changes
----------------
- XAI module removed from xpell-ui and moved into a separate package.
- xpell-core is now required instead of the old internal /core folder.
- XViewManager replaced by XVM (XViewManagerModule).
- XViewManager is deprecated – migrate to XVM.
- XUIObject updated to support XVM and the new view management flow.
- Default XUI object display style changed from block to flex.

New Features
------------
- Bi-directional Wormholes:
  Improved communication layer for real-time, two-way client–server sync.

- XNanoCommands:
  - Fire nano-commands for events and data, e.g.:
    event: "myEvent", data: "myData".
  - XUI objects now support nano commands directly in HTML event handlers.

- XObject Debug Mode:
  - New _debug property on XObject to enable per-object debugging.
  - New log() method on XObject that logs messages when _debug is true, including type and id.
  - XLogger now includes a debug() method for structured debug logging.

Fixes and Improvements
----------------------
- xui-core-objects:
  Fixed super constructor calls to ensure correct inheritance behavior.
- General stability and internal refactoring to align with xpell-core and XVM.
