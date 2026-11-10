import assert from "node:assert/strict";
import fs from "node:fs";
import { register } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

register("./ignore-css-loader.mjs", import.meta.url);

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const xuiCss = fs.readFileSync(path.join(packageRoot, "src", "XUI", "Style", "xui.css"), "utf8");
const xuiObjectSource = fs.readFileSync(path.join(packageRoot, "src", "XUI", "XUIObject.ts"), "utf8");
const packageJson = JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8"));

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function blockFor(css, selector) {
  const match = css.match(new RegExp(`${escapeRegex(selector)}\\s*\\{([\\s\\S]*?)\\}`));
  assert.ok(match, `Missing CSS block for ${selector}`);
  return match[1];
}

function tokenMap(block) {
  const out = new Map();
  for (const match of block.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    out.set(match[1], match[2].trim());
  }
  return out;
}

function assertTokens(tokens, names, label) {
  for (const name of names) {
    assert.ok(tokens.has(name), `${label} missing ${name}`);
  }
}

function walkFiles(root, out = []) {
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) walkFiles(fullPath, out);
    if (entry.isFile()) out.push(fullPath);
  }
  return out;
}

const baseTokens = tokenMap(blockFor(xuiCss, ":root,\n[data-theme]"));
const lightTokens = tokenMap(blockFor(xuiCss, "[data-theme=\"light\"]"));
const darkTokens = tokenMap(blockFor(xuiCss, "[data-theme=\"dark\"]"));
const terminalTokens = tokenMap(blockFor(xuiCss, "[data-theme=\"terminal\"]"));
const xdashboardLightTokens = tokenMap(blockFor(xuiCss, "[data-theme=\"xdashboard-2026-light\"]"));
const xdashboardDarkTokens = tokenMap(blockFor(xuiCss, "[data-theme=\"xdashboard-2026-dark\"]"));

const surfaceTokens = [
  "--x-bg",
  "--x-bg-muted",
  "--x-surface",
  "--x-surface-muted",
  "--x-surface-elevated",
  "--x-surface-overlay",
  "--x-input",
  "--x-text",
  "--x-text-muted",
  "--x-text-subtle",
  "--x-text-inverse",
  "--x-primary",
  "--x-accent",
  "--x-info",
  "--x-success",
  "--x-warning",
  "--x-danger",
  "--x-border",
  "--x-border-subtle",
  "--x-border-strong",
  "--x-focus"
];

for (const [name, tokens] of [
  ["light", lightTokens],
  ["dark", darkTokens],
  ["terminal", terminalTokens],
  ["xdashboard-2026-light", xdashboardLightTokens],
  ["xdashboard-2026-dark", xdashboardDarkTokens]
]) {
  assertTokens(new Map([...baseTokens, ...tokens]), surfaceTokens, `${name} theme`);
}

assertTokens(baseTokens, [
  "--x-font-sans",
  "--x-font-mono",
  "--x-font",
  "--x-font-size-display",
  "--x-font-weight-display",
  "--x-line-height-display",
  "--x-font-size-page-title",
  "--x-font-weight-page-title",
  "--x-line-height-page-title",
  "--x-font-size-page-subtitle",
  "--x-font-weight-page-subtitle",
  "--x-line-height-page-subtitle",
  "--x-font-size-section-title",
  "--x-font-weight-section-title",
  "--x-line-height-section-title",
  "--x-font-size-section-subtitle",
  "--x-font-weight-section-subtitle",
  "--x-line-height-section-subtitle",
  "--x-font-size-title",
  "--x-font-weight-title",
  "--x-line-height-title",
  "--x-font-size-body",
  "--x-font-weight-body",
  "--x-line-height-body",
  "--x-font-size-small",
  "--x-font-weight-small",
  "--x-line-height-small",
  "--x-font-size-caption",
  "--x-font-weight-caption",
  "--x-line-height-caption",
  "--x-font-size-label",
  "--x-font-weight-label",
  "--x-line-height-label"
], "base typography");

assertTokens(baseTokens, [
  "--x-space-1",
  "--x-space-2",
  "--x-space-3",
  "--x-space-4",
  "--x-space-5",
  "--x-space-6",
  "--x-space-8",
  "--x-space-10"
], "base spacing");
assert.equal(baseTokens.get("--x-space-1"), "4px");
assert.equal(baseTokens.get("--x-space-2"), "8px");
assert.equal(baseTokens.get("--x-space-3"), "12px");
assert.equal(baseTokens.get("--x-space-4"), "16px");
assert.equal(baseTokens.get("--x-space-5"), "20px");
assert.equal(baseTokens.get("--x-space-6"), "24px");
assert.equal(baseTokens.get("--x-space-8"), "32px");
assert.equal(baseTokens.get("--x-space-10"), "40px");

assert.equal(baseTokens.get("--x-spacing-xs"), "var(--x-space-1)");
assert.equal(baseTokens.get("--x-spacing-sm"), "var(--x-space-2)");
assert.equal(baseTokens.get("--x-spacing-md"), "var(--x-space-4)");
assert.equal(baseTokens.get("--x-spacing-lg"), "var(--x-space-6)");
assertTokens(baseTokens, [
  "--x-surface-2",
  "--x-card",
  "--x-panel",
  "--x-toolbar",
  "--x-sidebar",
  "--x-text-primary",
  "--x-text-secondary"
], "base legacy aliases");

assertTokens(baseTokens, [
  "--x-radius-sm",
  "--x-radius-md",
  "--x-radius-lg",
  "--x-radius-xl",
  "--x-radius-full"
], "base radius");
assert.equal(baseTokens.get("--x-radius-sm"), "4px");
assert.equal(baseTokens.get("--x-radius-md"), "8px");
assert.equal(baseTokens.get("--x-radius-lg"), "12px");
assert.equal(baseTokens.get("--x-radius-xl"), "16px");
assert.equal(baseTokens.get("--x-radius-full"), "999px");

assertTokens(baseTokens, [
  "--x-shadow-none",
  "--x-shadow-xs",
  "--x-shadow-sm",
  "--x-shadow-md",
  "--x-shadow-lg"
], "base elevation");

assertTokens(baseTokens, [
  "--x-control-height-sm",
  "--x-control-height-md",
  "--x-control-height-lg",
  "--x-control-padding-x-sm",
  "--x-control-padding-x-md",
  "--x-control-padding-x-lg",
  "--x-control-font-size-sm",
  "--x-control-font-size-md",
  "--x-control-font-size-lg"
], "base control sizing");

assertTokens(baseTokens, [
  "--x-page-padding-x",
  "--x-page-padding-y",
  "--x-page-max-width",
  "--x-page-readable-width",
  "--x-section-gap",
  "--x-content-gap",
  "--x-toolbar-height",
  "--x-sidebar-width",
  "--x-sidebar-width-collapsed"
], "base page tokens");

assert.ok(
  /@media\s*\(min-width:\s*768px\)[\s\S]*--x-page-padding-x:\s*var\(--x-space-6\);/.test(xuiCss),
  "tablet page padding override must exist"
);
assert.ok(
  /@media\s*\(min-width:\s*1024px\)[\s\S]*--x-page-padding-x:\s*var\(--x-space-8\);/.test(xuiCss),
  "desktop page padding override must exist"
);

assert.ok(
  xuiObjectSource.indexOf("Projection order is intentional") <
    xuiObjectSource.indexOf("const styleObject = (this as any)._style"),
  "_style projection precedence must remain after style string projection"
);

const packageDependencyNames = new Set([
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.devDependencies ?? {}),
  ...Object.keys(packageJson.peerDependencies ?? {}),
  ...Object.keys(packageJson.optionalDependencies ?? {})
]);
assert.equal(packageDependencyNames.has("@xpell/xdashboard"), false, "XUI must not depend on XDashboard");
for (const filePath of walkFiles(path.join(packageRoot, "src"))) {
  const source = fs.readFileSync(filePath, "utf8");
  assert.equal(
    /from\s+["']@xpell\/xdashboard["']|require\(["']@xpell\/xdashboard["']\)/.test(source),
    false,
    `XUI source must not import XDashboard: ${path.relative(packageRoot, filePath)}`
  );
}

class FakeStyleDeclaration {
  constructor() {
    this.values = new Map();
  }

  setProperty(name, value) {
    this.values.set(name, String(value));
  }

  getPropertyValue(name) {
    return this.values.get(name) ?? "";
  }

  removeProperty(name) {
    this.values.delete(name);
  }
}

class FakeClassList {
  constructor(el) {
    this.el = el;
    this.tokens = new Set();
  }

  add(...tokens) {
    for (const token of tokens) this.tokens.add(String(token));
    this.el.attributes.set("class", Array.from(this.tokens).join(" "));
  }

  remove(...tokens) {
    for (const token of tokens) this.tokens.delete(String(token));
    this.el.attributes.set("class", Array.from(this.tokens).join(" "));
  }

  contains(token) {
    return this.tokens.has(String(token));
  }

  [Symbol.iterator]() {
    return this.tokens[Symbol.iterator]();
  }
}

class FakeElement {
  constructor(tagName = "div") {
    this.tagName = tagName.toUpperCase();
    this.attributes = new Map();
    this.style = new FakeStyleDeclaration();
    this.classList = new FakeClassList(this);
    this.childNodes = [];
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
    if (name === "class") {
      this.classList.tokens = new Set(String(value).split(/\s+/).filter(Boolean));
    }
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  appendChild(child) {
    this.childNodes.push(child);
    return child;
  }

  remove() {}
}

const persisted = new Map();
globalThis.HTMLElement = FakeElement;
globalThis.window = {
  localStorage: {
    getItem: key => persisted.get(String(key)) ?? null,
    setItem: (key, value) => persisted.set(String(key), String(value))
  }
};
globalThis.document = {
  documentElement: new FakeElement("html"),
  body: new FakeElement("body"),
  createElement: tag => new FakeElement(tag),
  createElementNS: (_ns, tag) => new FakeElement(tag),
  getElementById: () => null,
  querySelector: () => null
};

const { XUI } = await import("../dist/xpell-ui.es.js");
XUI._active_theme = undefined;
XUI.applyTheme("xdashboard-2026-light");
assert.equal(document.documentElement.getAttribute("data-theme"), "xdashboard-2026-light");
assert.equal(document.documentElement.classList.contains("xtheme-xdashboard-2026-light"), true);
assert.equal(persisted.get("xpell.theme"), "xdashboard-2026-light");

XUI.applyTheme("xdashboard-2026-dark");
assert.equal(document.documentElement.getAttribute("data-theme"), "xdashboard-2026-dark");
assert.equal(document.documentElement.classList.contains("xtheme-xdashboard-2026-light"), false);
assert.equal(document.documentElement.classList.contains("xtheme-xdashboard-2026-dark"), true);
assert.equal(persisted.get("xpell.theme"), "xdashboard-2026-dark");

console.log("@xpell/ui design foundation tests passed");
