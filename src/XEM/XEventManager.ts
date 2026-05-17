/**
 * XEventManager — UI binding (NO DOM LOGIC)
 *
 * This module ONLY wires the core XEM into the UI runtime.
 * No overrides, no HTML bridging.
 */

import {
  _XEventManager,
  setXEventManager
} from "@xpell/core";

export const XEventManager = new _XEventManager();
export const _xem = XEventManager;

// 🔥 THIS is the only important part
setXEventManager(XEventManager);

export default XEventManager;