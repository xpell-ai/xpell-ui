import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const xstudioCss = fs.readFileSync(path.join(packageRoot, "src", "XStudio", "xstudio.css"), "utf8");
const xuiCss = fs.readFileSync(path.join(packageRoot, "src", "XUI", "Style", "xui.css"), "utf8");

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

function assertDistinctTokenSets(leftName, left, rightName, right, keys) {
  const equal = [];
  const different = [];
  for (const key of keys) {
    const leftValue = left.get(key);
    const rightValue = right.get(key);
    assert.ok(leftValue, `${leftName} missing ${key}`);
    assert.ok(rightValue, `${rightName} missing ${key}`);
    if (leftValue === rightValue) equal.push(key);
    else different.push(key);
  }
  assert.ok(
    different.length >= Math.ceil(keys.length / 2),
    `${leftName} and ${rightName} must remain visually distinct; equivalent tokens: ${equal.join(", ")}`
  );
}

const xstudioContract = blockFor(xstudioCss, ".xstudio-shell,\n#xvibe-sys-main .page-shell");
for (const token of ["--vx-bg", "--vx-surface", "--vx-surface-raised", "--vx-border", "--vx-text-primary", "--vx-accent", "--xstudio-bg"]) {
  assert.ok(xstudioContract.includes(token), `XStudio scoped theme contract must include ${token}`);
}

assert.equal(
  /:root,\s*\[data-theme\]\s*\{[\s\S]*--vx-/m.test(xstudioCss),
  false,
  "XStudio theme aliases must not be published globally on :root/[data-theme]"
);
assert.equal(
  /:root,\s*\[data-theme\]\s*\{[\s\S]*--xstudio-/m.test(xstudioCss),
  false,
  "XStudio variables must not be published globally on :root/[data-theme]"
);

const forbiddenRuntimeSelectors = [
  /^\.page-shell\s*\{/m,
  /^\.page-shell\s+\*\s*,/m,
  /^\.page-shell\s+\.panel\s*\{/m,
  /^\.page-shell\s+\.card\s*\{/m,
  /^\.page-shell\s+\.apps-table\s*\{/m,
  /^\.page-shell\s+\.xbutton\b/m,
  /^\.page-shell\s+input\b/m,
  /^\.apps-table\s*\{/m,
  /^\.card-grid\s*\{/m,
  /^\.panel-title\s*\{/m
];

for (const pattern of forbiddenRuntimeSelectors) {
  assert.equal(pattern.test(xstudioCss), false, `XStudio CSS must not expose unscoped runtime-app selector ${pattern}`);
}

for (const requiredScopedSelector of [
  "#xvibe-sys-main .page-shell",
  "#xvibe-sys-main .page-shell .panel",
  "#xvibe-sys-main .apps-table",
  "#xvibe-sys-main .card"
]) {
  assert.ok(
    xstudioCss.includes(requiredScopedSelector),
    `system app styling must stay scoped by ${requiredScopedSelector}`
  );
}

assert.ok(xstudioCss.includes(".xstudio-shell .xbutton"), "XStudio button styling must stay scoped to the editor shell");
assert.ok(xstudioCss.includes(".xstudio-shell input"), "XStudio input styling must stay scoped to the editor shell");
assert.ok(xstudioCss.includes(".xstudio-shell select"), "XStudio select styling must stay scoped to the editor shell");

const xstudioDark = tokenMap(blockFor(xstudioCss, ".xstudio-shell.xstudio-theme-dark"));
const xstudioTerminal = tokenMap(blockFor(xstudioCss, ".xstudio-shell.xstudio-theme-terminal"));
assertDistinctTokenSets("XStudio dark", xstudioDark, "XStudio terminal", xstudioTerminal, [
  "--x-bg",
  "--x-surface",
  "--x-surface-2",
  "--x-panel",
  "--x-card",
  "--x-toolbar",
  "--x-input",
  "--x-text",
  "--x-text-muted",
  "--x-primary",
  "--x-accent",
  "--x-border",
  "--x-border-subtle",
  "--x-border-strong",
  "--x-focus"
]);

const xuiDark = tokenMap(blockFor(xuiCss, "[data-theme=\"dark\"]"));
const xuiTerminal = tokenMap(blockFor(xuiCss, "[data-theme=\"terminal\"]"));
assertDistinctTokenSets("XUI dark", xuiDark, "XUI terminal", xuiTerminal, [
  "--x-bg",
  "--x-surface",
  "--x-surface-2",
  "--x-text",
  "--x-text-muted",
  "--x-primary",
  "--x-accent",
  "--x-border",
  "--x-border-subtle",
  "--x-border-strong",
  "--x-focus"
]);

console.log("@xpell/ui XStudio theme isolation tests passed");
