import {
  type XNanoCommandPack,
  XObject,
  _xd,
  XD_FRAME_NUMBER,
  createNanoCommandWithSkill
} from "@xpell/core";

import XUIObject from "./XUIObject";

export const _xuiobject_basic_nano_commands: XNanoCommandPack = {
  hide: createNanoCommandWithSkill(
    (_cmd, obj?: XObject) => (obj as XUIObject)?.hide?.(),
    {
      _name: "hide",
      _scope: "ui-object",
      _description: "Hide the current UI object."
    }
  ),

  show: createNanoCommandWithSkill(
    (_cmd, obj?: XObject) => (obj as XUIObject)?.show?.(),
    {
      _name: "show",
      _scope: "ui-object",
      _description: "Show the current UI object."
    }
  ),

  toggle: createNanoCommandWithSkill(
    (_cmd, obj?: XObject) => (obj as XUIObject)?.toggle?.(),
    {
      _name: "toggle",
      _scope: "ui-object",
      _description: "Toggle current UI object visibility."
    }
  ),

  "set-text": createNanoCommandWithSkill(
    (cmd, obj?: XObject) => {
      if (!obj) return;
      (obj as XUIObject)._text = String((cmd as any)._params?.text ?? "");
    },
    {
      _name: "set-text",
      _scope: "ui-object",
      _description: "Set the text content/value of the current UI object.",
      _params: {
        text: "Text value to set."
      }
    }
  ),

  set: createNanoCommandWithSkill(
    (cmd, obj?: XObject) => {
      if (!obj || !cmd._params) return;

      if ((cmd as any)._params?.text !== undefined) {
        (obj as XUIObject)._text = String((cmd as any)._params.text ?? "");
      }
    },
    {
      _name: "set",
      _scope: "ui-object",
      _description: "Legacy alias for setting text.",
      _params: {
        text: "Text value to set."
      }
    }
  ),

  "set-text-from-frame": createNanoCommandWithSkill(
    (cmd, obj?: XObject) => {
      if (!obj) return;

      let v: any = _xd.get(XD_FRAME_NUMBER);

      if (v === undefined && _xd._compat_legacy_keys) {
        v = _xd.get("frame-number");
      }

      let text: any = v;
      const pattern = (cmd as any)._params?.pattern;

      if (pattern) {
        text = String(pattern).replace("$data", String(text ?? ""));
      }

      (obj as XUIObject)._text = String(text ?? "");
    },
    {
      _name: "set-text-from-frame",
      _scope: "ui-object",
      _description: "Set text from the current Xpell frame number.",
      _params: {
        pattern: "Optional pattern using $data placeholder."
      }
    }
  ),

  "set-text-from-data": createNanoCommandWithSkill(
    (cmd, obj?: XObject) => {
      if (!obj) return;

      const data = (cmd as any)._params?.data;
      if (data === undefined) return;

      let text: any = data;
      const pattern = (cmd as any)._params?.pattern;

      if (typeof text === "object" && text !== null) {
        text = JSON.stringify(text, null, 2);
      }

      if (pattern) {
        text = String(pattern).replace("$data", String(text ?? ""));
      }

      const empty = (cmd as any)._params?.empty;

      if (empty === true || empty === "true") {
        obj.emptyDataSource();
      }

      (obj as XUIObject)._text = String(text ?? "");
    },
    {
      _name: "set-text-from-data",
      _scope: "ui-object",
      _description: "Set text from event/data payload.",
      _params: {
        data: "Source data.",
        pattern: "Optional pattern using $data placeholder.",
        empty: "If true, clear the object's data source after setting text."
      }
    }
  ),

  "append-text-from-data": createNanoCommandWithSkill(
    (cmd, obj?: XObject) => {
      if (!obj) return;

      const ui = obj as XUIObject;

      let data = (cmd as any)._params?.data;

      if (data === undefined || data === null) {
        return;
      }

      if (typeof data === "object") {
        data = JSON.stringify(data);
      }

      const separator =
        (cmd as any)._params?.separator ?? "";

      const current =
        String(ui._text ?? "");

      ui._text =
        current + separator + String(data);
    },
    {
      _name: "append-text-from-data",
      _scope: "ui-object",
      _description:
        "Append incoming event/data payload to the current UI object's text.",
      _params: {
        data: "Source data.",
        separator:
          "Optional separator inserted before appended value."
      }
    }
  ),

  "clear-text": createNanoCommandWithSkill(
    (_cmd, obj?: XObject) => {
      if (!obj) return;
      (obj as XUIObject)._text = "";
    },
    {
      _name: "clear-text",
      _scope: "ui-object",
      _description:
        "Clear current UI object text."
    }
  ),

  "add-class": createNanoCommandWithSkill(
    (cmd, obj?: XObject) => {
      const cls = (cmd as any)._params?.class;
      if (obj && cls) (obj as XUIObject).addClass(String(cls));
    },
    {
      _name: "add-class",
      _scope: "ui-object",
      _description: "Add CSS class/classes to the current UI object.",
      _params: {
        class: "Class name or space-separated class names."
      }
    }
  ),

  "remove-class": createNanoCommandWithSkill(
    (cmd, obj?: XObject) => {
      const cls = (cmd as any)._params?.class;
      if (obj && cls) (obj as XUIObject).removeClass(String(cls));
    },
    {
      _name: "remove-class",
      _scope: "ui-object",
      _description: "Remove CSS class/classes from the current UI object.",
      _params: {
        class: "Class name or space-separated class names."
      }
    }
  ),

  "toggle-class": createNanoCommandWithSkill(
    (cmd, obj?: XObject) => {
      const cls = (cmd as any)._params?.class;
      if (obj && cls) (obj as XUIObject).toggleClass(String(cls));
    },
    {
      _name: "toggle-class",
      _scope: "ui-object",
      _description: "Toggle CSS class/classes on the current UI object.",
      _params: {
        class: "Class name or space-separated class names."
      }
    }
  ),

  "set-style": createNanoCommandWithSkill(
    (cmd, obj?: XObject) => {
      const name = (cmd as any)._params?.name;
      const value = (cmd as any)._params?.value;

      if (obj && name != null && value != null) {
        (obj as XUIObject).setStyleAttribute(String(name), String(value));
      }
    },
    {
      _name: "set-style",
      _scope: "ui-object",
      _description: "Set a CSS style property on the current UI object.",
      _params: {
        name: "CSS property name.",
        value: "CSS property value."
      }
    }
  ),

  "set-attr": createNanoCommandWithSkill(
    (cmd, obj?: XObject) => {
      if (!obj) return;

      const name = (cmd as any)._params?.name;
      const value = (cmd as any)._params?.value;

      if (!name) return;

      const el = (obj as XUIObject).dom as any;

      if (el?.setAttribute) {
        el.setAttribute(String(name), String(value ?? ""));
      } else {
        (obj as any)[String(name)] = value;
      }
    },
    {
      _name: "set-attr",
      _scope: "ui-object",
      _description: "Set a DOM attribute on the current UI object.",
      _params: {
        name: "Attribute name.",
        value: "Attribute value."
      }
    }
  ),

  "remove-attr": createNanoCommandWithSkill(
    (cmd, obj?: XObject) => {
      if (!obj) return;

      const name = (cmd as any)._params?.name;
      if (!name) return;

      const el = (obj as XUIObject).dom as any;

      if (el?.removeAttribute) {
        el.removeAttribute(String(name));
      } else {
        delete (obj as any)[String(name)];
      }
    },
    {
      _name: "remove-attr",
      _scope: "ui-object",
      _description: "Remove a DOM attribute from the current UI object.",
      _params: {
        name: "Attribute name."
      }
    }
  ),

  "focus": createNanoCommandWithSkill(
    (_cmd, obj?: XObject) => {
      const el = (obj as XUIObject)?.dom as any;
      if (el?.focus) el.focus();
    },
    {
      _name: "focus",
      _scope: "ui-object",
      _description: "Focus the current UI object if focusable."
    }
  ),

  "scroll-into-view": createNanoCommandWithSkill(
    (cmd, obj?: XObject) => {
      const el = (obj as XUIObject)?.dom as any;
      if (!el?.scrollIntoView) return;

      const behavior = (cmd as any)._params?.behavior;
      const block = (cmd as any)._params?.block;

      el.scrollIntoView({
        behavior: behavior === "smooth" ? "smooth" : "auto",
        block: ["start", "center", "end", "nearest"].includes(block)
          ? block
          : "start"
      });
    },
    {
      _name: "scroll-into-view",
      _scope: "ui-object",
      _description: "Scroll the current UI object into view.",
      _params: {
        behavior: "auto or smooth.",
        block: "start, center, end, or nearest."
      }
    }
  )
};

export default _xuiobject_basic_nano_commands;