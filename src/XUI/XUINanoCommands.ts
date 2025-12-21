/**
 * XUI Nano Commands
 *
 * Defines the built-in nano commands available to XUI objects.
 *
 * Nano commands are lightweight, string-addressable commands
 * that can be invoked from UI definitions, attributes, events,
 * or dynamic bindings to trigger runtime behavior.
 *
 * They provide a minimal command layer between declarative UI
 * schemas and imperative runtime logic.
 *
 * ---
 *
 * ## Purpose
 *
 * - Enable declarative event handling in XUI
 * - Allow UI schemas to trigger logic without embedding code
 * - Provide a safe, controlled command surface for runtime execution
 *
 * ---
 *
 * ## Scope
 *
 * - Commands defined here are **UI-scoped**
 * - Navigation-related commands are delegated to **XVM**
 * - Data and entity commands are delegated to **XDB / XObject**
 *
 * ---
 *
 * ## Architectural Rule
 *
 * Nano commands MUST remain:
 * - Small and composable
 * - Side-effect aware
 * - Deterministic in execution
 *
 * @packageDocumentation
 * @since 2022-07-22
 * @copyright
 * © 2022–present Aime Technologies. All rights reserved.
 */

import { XNanoCommandPack, XCommand, _xlog, XObject, _xd } from "xpell-core"
import {_xem} from "../XEM/XEventManager"

// import { _xem } from "../XEM/XEventManager"
import XUIObject from "./XUIObject"



/**
 * XUINanoCommand Pack
 */
export const _xuiobject_basic_nano_commands: XNanoCommandPack = {
  hide: (_cmd, obj?: XObject) => (obj as any as XUIObject)?.hide?.(),
  show: (_cmd, obj?: XObject) => (obj as any as XUIObject)?.show?.(),
  toggle: (_cmd, obj?: XObject) => (obj as any as XUIObject)?.toggle?.(),

  // canonical text setter
  "set-text": (cmd, obj?: XObject) => {
    if (!obj) return;
    (obj as any as XUIObject)._text = String((cmd as any)._params?.text ?? "");
  },

  // keep old alias
  set: (cmd, obj?: XObject) => {
    if (!cmd._params) return;
    if ((cmd as any)._params?.text !== undefined) {
      (obj as any as XUIObject)._text = String((cmd as any)._params.text ?? "");
    }
  },

  "set-text-from-frame": (cmd, obj?: XObject) => {
    if (!obj) return;
    let text: any = _xd._o["frame-number"];
    const pattern = (cmd as any)._params?.pattern;
    if (pattern) text = String(pattern).replace("$data", String(text ?? ""));
    (obj as any as XUIObject)._text = String(text ?? "");
  },

  "set-text-from-data": (cmd, obj?: XObject) => {
    if (!obj || !obj._data_source) return;
    const ds = obj._data_source;
    if (!_xd._o[ds]) return;

    let data = _xd._o[ds];
    let text: any = data;

    const pattern = (cmd as any)._params?.pattern;
    if (pattern) text = String(pattern).replace("$data", String(data ?? ""));

    const empty = (cmd as any)._params?.empty;
    if (empty === true || empty === "true") obj.emptyDataSource();

    (obj as any as XUIObject)._text = String(text ?? "");
  },

  // ---- New universal UI commands ----
  "add-class": (cmd, obj?: XObject) => {
    const cls = (cmd as any)._params?.class;
    if (obj && cls) (obj as any as XUIObject).addClass(String(cls));
  },
  "remove-class": (cmd, obj?: XObject) => {
    const cls = (cmd as any)._params?.class;
    if (obj && cls) (obj as any as XUIObject).removeClass(String(cls));
  },
  "toggle-class": (cmd, obj?: XObject) => {
    const cls = (cmd as any)._params?.class;
    if (obj && cls) (obj as any as XUIObject).toggleClass(String(cls));
  },

  "set-style": (cmd, obj?: XObject) => {
    const name = (cmd as any)._params?.name;
    const value = (cmd as any)._params?.value;
    if (obj && name != null && value != null) {
      (obj as any as XUIObject).setStyleAttribute(String(name), String(value));
    }
  },

  "set-attr": (cmd, obj?: XObject) => {
    if (!obj) return;
    const name = (cmd as any)._params?.name;
    const value = (cmd as any)._params?.value;
    if (!name) return;
    const el = (obj as any as XUIObject).dom as any;
    if (el?.setAttribute) el.setAttribute(String(name), String(value ?? ""));
    else (obj as any)[String(name)] = value;
  },

  "remove-attr": (cmd, obj?: XObject) => {
    if (!obj) return;
    const name = (cmd as any)._params?.name;
    if (!name) return;
    const el = (obj as any as XUIObject).dom as any;
    if (el?.removeAttribute) el.removeAttribute(String(name));
    else delete (obj as any)[String(name)];
  },
};


export default (_xuiobject_basic_nano_commands)




