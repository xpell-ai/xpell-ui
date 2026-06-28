import assert from "node:assert/strict";
import { register } from "node:module";

register("./ignore-css-loader.mjs", import.meta.url);

class FakeStyleDeclaration {
  #props = new Map();

  get display() {
    return this.getPropertyValue("display");
  }

  set display(value) {
    if (value == null || value === "") {
      this.removeProperty("display");
      return;
    }

    this.setProperty("display", value);
  }

  get cssText() {
    return Array
      .from(this.#props.entries())
      .map(([name, value]) => `${name}: ${value};`)
      .join(" ");
  }

  set cssText(value) {
    this.#props.clear();

    for (const part of String(value ?? "").split(";")) {
      const idx = part.indexOf(":");
      if (idx < 0) continue;

      const name = part.slice(0, idx).trim();
      const val = part.slice(idx + 1).trim();
      if (!name || !val) continue;

      this.setProperty(name, val);
    }
  }

  setProperty(name, value) {
    this.#props.set(String(name), String(value));
  }

  getPropertyValue(name) {
    return this.#props.get(String(name)) ?? "";
  }

  removeProperty(name) {
    const key = String(name);
    const prev = this.getPropertyValue(key);
    this.#props.delete(key);
    return prev;
  }
}

class FakeClassList {
  constructor(el) {
    this.el = el;
  }

  add(...tokens) {
    for (const token of tokens) {
      if (token) this.el._classTokens.add(String(token));
    }
  }

  remove(...tokens) {
    for (const token of tokens) {
      this.el._classTokens.delete(String(token));
    }
  }

  toggle(token) {
    const value = String(token);
    if (this.el._classTokens.has(value)) {
      this.el._classTokens.delete(value);
      return false;
    }

    this.el._classTokens.add(value);
    return true;
  }

  contains(token) {
    return this.el._classTokens.has(String(token));
  }
}

class FakeTextNode {
  static TEXT_NODE = 3;

  constructor(text) {
    this.nodeType = FakeTextNode.TEXT_NODE;
    this.textContent = String(text ?? "");
    this.parentElement = null;
  }
}

class FakeElement {
  constructor(tagName) {
    this.tagName = String(tagName).toUpperCase();
    this.attributes = new Map();
    this.childNodes = [];
    this.parentElement = null;
    this.style = new FakeStyleDeclaration();
    this._classTokens = new Set();
    this.classList = new FakeClassList(this);
  }

  get className() {
    return Array.from(this._classTokens).join(" ");
  }

  set className(value) {
    this._classTokens = new Set(
      String(value ?? "")
        .split(/\s+/g)
        .map(token => token.trim())
        .filter(Boolean)
    );
  }

  get firstChild() {
    return this.childNodes[0] ?? null;
  }

  get textContent() {
    return this.childNodes.map(child => child.textContent ?? "").join("");
  }

  set textContent(value) {
    this.childNodes = [new FakeTextNode(value)];
  }

  setAttribute(name, value) {
    const attr = String(name);
    const val = String(value);

    if (attr === "class") {
      this.className = val;
      return;
    }

    if (attr === "style") {
      this.attributes.set(attr, val);
      this.style.cssText = val;
      return;
    }

    this.attributes.set(attr, val);
  }

  getAttribute(name) {
    const attr = String(name);

    if (attr === "class") {
      return this.className || null;
    }

    if (attr === "style") {
      return this.style.cssText || null;
    }

    return this.attributes.get(attr) ?? null;
  }

  hasAttribute(name) {
    const attr = String(name);
    if (attr === "class") return this.className.length > 0;
    if (attr === "style") return this.style.cssText.length > 0;
    return this.attributes.has(attr);
  }

  removeAttribute(name) {
    const attr = String(name);

    if (attr === "class") {
      this.className = "";
      return;
    }

    if (attr === "style") {
      this.attributes.delete(attr);
      this.style.cssText = "";
      return;
    }

    this.attributes.delete(attr);
  }

  appendChild(child) {
    child.parentElement = this;
    this.childNodes.push(child);
    return child;
  }

  append(child) {
    return this.appendChild(child);
  }

  insertBefore(child, before) {
    child.parentElement = this;
    const idx = this.childNodes.indexOf(before);
    if (idx < 0) {
      this.childNodes.push(child);
    } else {
      this.childNodes.splice(idx, 0, child);
    }

    return child;
  }

  removeChild(child) {
    const idx = this.childNodes.indexOf(child);
    if (idx >= 0) this.childNodes.splice(idx, 1);
    child.parentElement = null;
    return child;
  }

  replaceChildren(...children) {
    this.childNodes = [];
    for (const child of children) this.appendChild(child);
  }

  remove() {
    this.parentElement?.removeChild(this);
  }
}

const storage = new Map();

globalThis.window = {
  localStorage: {
    getItem: key => storage.get(String(key)) ?? null,
    setItem: (key, value) => storage.set(String(key), String(value)),
    removeItem: key => storage.delete(String(key)),
    clear: () => storage.clear()
  },
  sessionStorage: {
    getItem: key => storage.get(String(key)) ?? null,
    setItem: (key, value) => storage.set(String(key), String(value)),
    removeItem: key => storage.delete(String(key)),
    clear: () => storage.clear()
  }
};

globalThis.document = {
  createElement: tagName => new FakeElement(tagName),
  createElementNS: (_ns, tagName) => new FakeElement(tagName),
  createTextNode: text => new FakeTextNode(text),
  getElementById: () => null,
  body: new FakeElement("body")
};

globalThis.HTMLElement = FakeElement;
globalThis.Node = FakeTextNode;
globalThis.getComputedStyle = el => ({
  getPropertyValue: name => el.style.getPropertyValue(name)
});

const ui = await import("../dist/xpell-ui.es.js");
const { _x, XButton, XUI, XUIObject, XVM, XView } = ui;

assert.equal("XVMView" in ui, false);

await _x.loadModuleAsync(XUI);
await _x.loadModuleAsync(XVM);

{
  const registeredViewRef = XUI.create({
    _type: "xvm-view",
    _view_id: "registered-smoke-view"
  });

  assert.equal(registeredViewRef instanceof XUIObject, true);
  assert.equal(registeredViewRef._type, "xvm-view");
  assert.equal(typeof registeredViewRef.resolveView, "function");
}

function assertClass(el, className) {
  assert.equal(
    el.classList.contains(className),
    true,
    `Expected class "${className}" in "${el.getAttribute("class")}"`
  );
}

function assertNoObjectStyle(el) {
  assert.equal(
    String(el.getAttribute("style") ?? "").includes("[object Object]"),
    false
  );
}

{
  const button = new XButton({ _text: "Save" });
  const dom = button.getDOMObject();

  button.update({
    class: "cta",
    _variant: "primary"
  });

  assertClass(dom, "cta");
  assertClass(dom, "xbutton");
  assertClass(dom, "xbutton--variant-primary");

  button.update({
    class: "secondary",
    _variant: "quiet"
  });

  assertClass(dom, "secondary");
  assertClass(dom, "xbutton");
  assertClass(dom, "xbutton--variant-quiet");
  assert.equal(dom.classList.contains("xbutton--variant-primary"), false);
}

{
  const button = new XButton({ _text: "Alias" });
  const dom = button.getDOMObject();

  button.update({ _class: "alias-class" });

  assertClass(dom, "alias-class");
  assertClass(dom, "xbutton");
}

{
  const view = new XView({});
  const dom = view.getDOMObject();

  view.update({ style: "color: red; display: flex;" });

  assert.equal(dom.style.getPropertyValue("color"), "red");
  assert.equal(dom.style.display, "flex");
  assertNoObjectStyle(dom);
}

{
  const view = new XView({});
  const dom = view.getDOMObject();

  view.update({
    style: "color: red; display: flex;",
    _style: {
      color: "blue",
      backgroundColor: "white"
    }
  });

  assert.equal(dom.style.getPropertyValue("color"), "blue");
  assert.equal(dom.style.getPropertyValue("background-color"), "white");
  assert.equal(dom.style.display, "flex");
  assertNoObjectStyle(dom);
}

{
  const view = new XView({ style: "display: flex;" });
  const dom = view.getDOMObject();

  view.update({ _visible: false });
  assert.equal(dom.style.display, "none");

  view.update({ _visible: true });
  assert.equal(dom.style.display, "flex");
}

{
  const view = new XView({
    style: "display: none;",
    _visible: false
  });
  const dom = view.getDOMObject();

  assert.equal(dom.style.display, "none");

  view.update({ _visible: true });

  assert.notEqual(dom.style.display, "none");

  view.update({ _text: "Later projection" });

  assert.notEqual(dom.style.display, "none");
}

{
  const view = new XView({
    style: "display: none;",
    _visible: false
  });
  const dom = view.getDOMObject();

  view.update({ _text: "Infer visible" });

  assert.equal(dom.style.display, "");
  assert.equal(view._visible, true);
}

{
  const view = new XView({});
  const dom = view.getDOMObject();

  view.update({ style: { color: "red" } });
  assertNoObjectStyle(dom);
}

{
  const view = new XView({});
  const dom = view.getDOMObject();

  view.update({
    title: "plain attribute",
    "data-object": { value: true },
    onclick: () => {}
  });

  assert.equal(dom.getAttribute("title"), "plain attribute");
  assert.equal(dom.hasAttribute("data-object"), false);
  assert.equal(dom.hasAttribute("onclick"), false);
}

{
  const button = new XButton({ _text: "Class reset" });
  const dom = button.getDOMObject();

  button.update({ class: "stale-class" });
  assertClass(dom, "stale-class");
  assertClass(dom, "xbutton");

  button.update({ _text: "No class in patch" });

  assert.equal(dom.classList.contains("stale-class"), false);
  assertClass(dom, "xbutton");
}

{
  const button = new XButton({ _text: "Semantic reset" });
  const dom = button.getDOMObject();

  button.update({
    _variant: "primary",
    _tone: "danger"
  });

  assertClass(dom, "xbutton--variant-primary");
  assertClass(dom, "xbutton--tone-danger");

  button.update({ _text: "No semantic fields in patch" });

  assert.equal(dom.classList.contains("xbutton--variant-primary"), false);
  assert.equal(dom.classList.contains("xbutton--tone-danger"), false);
  assertClass(dom, "xbutton");
}
