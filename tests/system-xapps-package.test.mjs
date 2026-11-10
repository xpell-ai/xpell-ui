import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const systemRoot = path.join(packageRoot, "system-xapps");
const vibeSystemRoot = path.join(systemRoot, "vibe-system");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function walkFiles(root, out = []) {
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) walkFiles(fullPath, out);
    if (entry.isFile()) out.push(path.relative(packageRoot, fullPath).replaceAll(path.sep, "/"));
  }
  return out;
}

const packageJson = readJson(path.join(packageRoot, "package.json"));
const manifest = readJson(path.join(systemRoot, "manifest.json"));
const vibeApp = readJson(path.join(vibeSystemRoot, "app.json"));
const xuiCss = readText(path.join(packageRoot, "src", "XUI", "Style", "xui.css"));
const xstudioCss = readText(path.join(packageRoot, "src", "XStudio", "xstudio.css"));
const xstudioShellText = readText(path.join(packageRoot, "src", "XStudio", "views", "shell.json"));
const xuiRuntimeText = readText(path.join(packageRoot, "src", "XUI", "XUIRuntime.ts"));
const vibeSystemModuleText = readText(path.join(packageRoot, "src", "XStudio", "VibeSystemModule.ts"));
const vibeMainViewText = readText(path.join(vibeSystemRoot, "views", "xvibe-sys-main.json"));
const vibeAiCardText = readText(path.join(vibeSystemRoot, "views", "ai-card.json"));
const vibeCreateFlowText = readText(path.join(vibeSystemRoot, "flows", "flow-create-app-from-starter.json"));
const vibeCreateFlow = JSON.parse(vibeCreateFlowText);
const vibeGenerateFlowText = readText(path.join(vibeSystemRoot, "flows", "flow-generate-app.json"));
const vibeToolbar = readJson(path.join(vibeSystemRoot, "views", "toolbar.json"));
const vibeToolbarText = readText(path.join(vibeSystemRoot, "views", "toolbar.json"));

assert.equal(packageJson.name, "@xpell/ui");
assert.ok(packageJson.files.includes("system-xapps"), "@xpell/ui package files must include system-xapps");
assert.equal(packageJson.exports["./system-xapps/manifest.json"], "./system-xapps/manifest.json");

assert.equal(manifest._owner_package, "@xpell/ui");
assert.equal(manifest._apps.length, 1);
assert.equal(manifest._apps[0]._app_id, "vibe-system");
assert.equal(manifest._apps[0]._type, "system_app");
assert.equal(manifest._apps[0]._path, "vibe-system");

assert.equal(vibeApp._app_id, "vibe-system");
assert.ok(fs.existsSync(path.join(vibeSystemRoot, "views", "xvibe-sys-main.json")));
assert.ok(fs.existsSync(path.join(vibeSystemRoot, "flows", "flow-create-app-from-starter.json")));
assert.ok(fs.existsSync(path.join(vibeSystemRoot, "flows", "flow-generate-app.json")));
assert.ok(fs.existsSync(path.join(vibeSystemRoot, "flows", "flow-open-generated-app.json")));

const toolbarLeft = vibeToolbar._children[0];
const toolbarRight = vibeToolbar._children[1];
assert.equal(toolbarLeft.class, "page-toolbar__left");
assert.equal(toolbarLeft._children.length, 2, "vibe-system header must include product identity and tagline");
assert.equal(toolbarLeft._children[0]._text, "Visual Xpell");
assert.equal(toolbarLeft._children[0].class, "page-title");
assert.equal(toolbarLeft._children[1]._text, "Build apps while they run.");
assert.equal(toolbarLeft._children[1].class, "page-tagline");
assert.equal(vibeToolbarText.includes("page-subtitle"), false, "vibe-system header must not use marketing subtitle typography");
assert.equal(toolbarRight._children[0]._id, "home-theme-select");

for (const mode of ["light", "dark", "terminal"]) {
  assert.ok(xuiCss.includes(`[data-theme="${mode}"]`), `xui.css must keep ${mode} theme mode`);
}

for (const token of [
  "--vx-bg",
  "--vx-surface",
  "--vx-surface-raised",
  "--vx-border",
  "--vx-text-primary",
  "--vx-text-muted",
  "--vx-accent",
  "--vx-success",
  "--vx-warning",
  "--vx-danger",
  "--vx-font-sans",
  "--vx-radius-md",
  "--vx-space-3",
  "--vx-control-h-sm"
]) {
  assert.ok(xstudioCss.includes(token), `Visual Xpell theme contract must define ${token}`);
}

assert.match(
  xstudioCss,
  /\.xstudio-shell,\s*#xvibe-sys-main \.page-shell\s*\{[\s\S]*--vx-bg:\s*var\(--x-bg\);[\s\S]*--vx-accent:\s*var\(--x-accent\);/,
  "Visual Xpell tokens must be scoped to XStudio and the packaged system app root"
);

for (const selector of [
  "#xvibe-sys-main .page-shell",
  ".page-toolbar",
  ".home-content-grid",
  "#xvibe-sys-main .page-shell .panel",
  "#xvibe-sys-main .page-shell .toolbar-theme-select",
  ".page-tagline",
  ".status-panel",
  ".config-panel",
  ".default-app-control-row",
  ".app-row-more-action",
  ".xtable-action-menu",
  ".xbutton--variant-primary",
  ".xbutton--variant-secondary",
  ".apps-table"
]) {
  assert.ok(xstudioCss.includes(selector), `vibe-system must have shared style selector ${selector}`);
}

assert.equal(
  xstudioShellText.includes('"class": "xstudio-portlet xstudio-selected-object-panel"'),
  false,
  "selected object panel xvm-view wrapper must not inherit generic portlet spacing"
);

{
  const genericPortletRule = xstudioCss.lastIndexOf(".xstudio-portlet,\n.xstudio-section");
  const selectedPanelRule = xstudioCss.lastIndexOf(".xstudio-selected-object-panel {");
  assert.ok(selectedPanelRule > genericPortletRule, "selected object panel stack reset must follow generic portlet theme rules");
  const selectedPanelRuleBody = xstudioCss.slice(selectedPanelRule, xstudioCss.indexOf("}", selectedPanelRule) + 1);
  assert.match(selectedPanelRuleBody, /padding:\s*0;/);
  assert.match(selectedPanelRuleBody, /border:\s*0;/);
  assert.match(selectedPanelRuleBody, /background:\s*transparent;/);
}

assert.match(
  xstudioCss,
  /#xvibe-sys-main \.page-shell\s*\{[\s\S]*background:\s*var\(--vx-bg\);[\s\S]*font-family:\s*var\(--vx-font-sans\);/,
  "vibe-system shell must consume shared Visual Xpell tokens"
);
assert.match(
  xstudioCss,
  /#xvibe-sys-main \.page-shell \.panel\s*\{[\s\S]*background:\s*var\(--vx-surface\);[\s\S]*border-radius:\s*var\(--vx-radius-lg\);/,
  "vibe-system panels must consume shared Visual Xpell tokens"
);
assert.equal(/font-family:\s*[^;]*serif/i.test(xstudioCss), false, "shared XStudio/vibe-system CSS must not introduce serif typography");

assert.equal(vibeMainViewText.includes('"_click"'), false, "vibe-system main view must use real DOM event names");
assert.equal(vibeAiCardText.includes('"_click"'), false, "vibe-system AI card must use real DOM event names");
assert.equal(vibeMainViewText.includes('"click"'), true, "vibe-system main view must preserve click handlers");
assert.equal(vibeAiCardText.includes('"click"'), true, "vibe-system AI card must preserve click handlers");
for (const method of [
  "async _refresh_apps",
  "async _open_app_actions",
  "async _edit_selected_app",
  "async _open_selected_app",
  "async _export_app",
  "async _trash_app",
  "async _set_default_app",
  "async _open_import_app",
  "async _select_import_file",
  "async _confirm_import_app"
]) {
  assert.ok(vibeSystemModuleText.includes(method), `vibe-system module must implement ${method}`);
}
assert.equal(vibeCreateFlowText.includes("xvibe.active_app"), false, "create flow must not write client active app storage");
assert.equal(vibeGenerateFlowText.includes("xvibe.active_app"), false, "generate flow must not write client active app storage");
assert.equal(vibeToolbar._children[1]._children[0]._on.change._module, "xui");
assert.equal(vibeToolbar._children[1]._children[0]._on.change._op, "set-theme");
assert.equal(vibeToolbar._children[1]._children[0]._on.change._params._theme, "$event.target.value");
assert.equal(
  vibeCreateFlow._open_created_app_in_edit,
  true,
  "starter-created apps must open in Visual Xpell edit mode"
);

const vibeMainView = JSON.parse(vibeMainViewText);
function findView(root, predicate) {
  const stack = [root];
  while (stack.length > 0) {
    const item = stack.pop();
    if (!item || typeof item !== "object") continue;
    if (predicate(item)) return item;
    if (Array.isArray(item._children)) stack.push(...item._children);
  }
  return null;
}

const appsTable = (() => {
  return findView(vibeMainView, item => item._id === "apps-table");
})();
const appActionsModal = findView(vibeMainView, item => item._id === "app-actions-modal");
assert.equal(Boolean(findView(vibeMainView, item => item._text === "Your Apps")), true);
assert.equal(Boolean(findView(vibeMainView, item => item._text === "+ New App")), true);
assert.equal(Boolean(findView(vibeMainView, item => item._id === "default-server-app-select")), true);
const actionColumn = appsTable?._columns?.find((column) => column?._key === "actions");
const editAction = actionColumn?._actions?.find((action) => action?._text === "Edit");
const moreAction = actionColumn?._actions?.find((action) => action?._text === "⋯");
const secondaryActions = actionColumn?._secondary_actions ?? [];
const openAction = secondaryActions.find((action) => action?._text === "Open");
const exportAction = secondaryActions.find((action) => action?._text === "Export");
const trashAction = secondaryActions.find((action) => action?._text === "Move to Trash");
const defaultSelect = findView(vibeMainView, item => item._id === "default-server-app-select");
const modalOpenAction = appActionsModal?._actions?.find((action) => action?._text === "Open");
assert.equal(editAction?._on?.click?._module, "xvm");
assert.equal(editAction?._on?.click?._op, "load-server-app");
assert.equal(editAction?._on?.click?._params?._edit, true);
assert.equal(moreAction?._on?.click?._module, "vibe-system");
assert.equal(moreAction?._on?.click?._op, "open-app-actions");
assert.equal(moreAction?._on?.click?._params?._row_app_id, "$row._app_id");
assert.equal(openAction?._on?.click?._module, "xvm");
assert.equal(openAction?._on?.click?._op, "load-server-app");
assert.equal(openAction?._on?.click?._params?._edit, false);
assert.equal(modalOpenAction?._on?.click?._module, "vibe-system");
assert.equal(modalOpenAction?._on?.click?._op, "open-selected-app");
assert.equal(exportAction?._on?.click?._module, "vibe-system");
assert.equal(exportAction?._on?.click?._op, "export-app");
assert.equal(defaultSelect?._on?.change?._module, "vibe-system", "Default app select must route through vibe-system client actions");
assert.equal(defaultSelect?._on?.change?._op, "set-default-app");
assert.equal(defaultSelect?._on?.change?._params?._selected_app_id, "$event.target.value");
assert.equal(
  vibeMainViewText.includes('"_app_id": "$event.target.value"'),
  false,
  "Dynamic select values must not use _app_id in persisted view JSON because ServerXVM validates artifact identity fields before runtime"
);
assert.equal(trashAction?._on?.click?._module, "vibe-system");
assert.equal(trashAction?._on?.click?._op, "trash-app");
assert.equal(actionColumn?._actions?.[0]?._text, "Edit", "Edit must be the first direct app action");
assert.deepEqual(
  actionColumn?._actions?.map((action) => action?._text),
  ["Edit", "⋯"],
  "legacy inline table actions must expose only Edit and a compact secondary action trigger"
);
assert.deepEqual(
  secondaryActions.map((action) => action?._text),
  ["Open", "Export", "Move to Trash"],
  "secondary app actions must remain available away from the main row"
);
const statusPanel = findView(vibeMainView, item => item._id === "visual-xpell-status-panel");
assert.equal(Boolean(statusPanel), true, "home screen must include concise runtime/AI/agent status");
assert.equal(statusPanel._on_mount?.[0]?._module, "xai-client");
assert.equal(statusPanel._on_mount?.[0]?._op, "get-provider-status");
assert.equal(statusPanel._on_mount?.[1]?._module, "vibe-system");
assert.equal(statusPanel._on_mount?.[1]?._op, "refresh-mcp-access");
assert.equal(findView(statusPanel, item => item._id === "runtime-status-value")?._data_source, "system.ready.wormhole");
assert.equal(findView(statusPanel, item => item._id === "ai-status-value")?._data_source, "ai.connection");
assert.equal(findView(statusPanel, item => item._id === "mcp-status-value")?._text, "● Available");
const mcpPanel = findView(vibeMainView, item => item._id === "mcp-access-panel");
assert.equal(Boolean(mcpPanel), true, "authenticated admin home must include MCP Access");
assert.equal(mcpPanel._html_tag, "details", "MCP access configuration must be collapsed by default");
assert.equal(findView(mcpPanel, item => item._text === "Connect an Agent")?.class, "config-summary");
const mcpMountMethod = `_${statusPanel._on_mount?.[1]?._op?.replaceAll("-", "_")}`;
assert.equal(vibeSystemModuleText.includes(`"${statusPanel._on_mount?.[1]?._op}"`), true, "MCP Access mount op must be listed by VibeSystemModule");
assert.equal(vibeSystemModuleText.includes(mcpMountMethod), true, "MCP Access mount op must map to a VibeSystemModule dispatcher method");
const vibeSystemLoadIndex = xuiRuntimeText.indexOf("loadModuleAsync(VibeSystem)");
const appModulesLoadIndex = xuiRuntimeText.indexOf("if (Array.isArray(opts._modules))");
assert.notEqual(vibeSystemLoadIndex, -1, "XUIRuntime must register VibeSystem");
assert.notEqual(appModulesLoadIndex, -1, "XUIRuntime must keep caller module loading path");
assert.equal(
  vibeSystemLoadIndex < appModulesLoadIndex,
  true,
  "XUIRuntime must register canonical VibeSystem before caller-provided modules can shadow it"
);
assert.equal(findView(statusPanel, item => item._id === "mcp-status-value")?._text, "● Available");
assert.equal(findView(mcpPanel, item => item._id === "mcp-endpoint-value")?._text, "Endpoint: /mcp");
assert.equal(findView(mcpPanel, item => item._id === "mcp-generate-token")?._on?.click?._op, "generate-mcp-token");
assert.equal(findView(mcpPanel, item => item._id === "mcp-copy-token")?._visible, false);
assert.equal(findView(mcpPanel, item => item._id === "mcp-token-group")?._visible, false);
assert.equal(vibeMainViewText.includes("eyJ"), false, "packaged admin view must not include a persisted MCP token");
assert.equal(vibeMainViewText.includes("xauth_session"), false, "packaged admin view must not expose the browser session cookie");
assert.equal(vibeMainViewText.includes("auth:token"), false, "packaged admin view must not read the browser session JWT");

const resourceFiles = walkFiles(systemRoot);
assert.equal(resourceFiles.some((file) => file.includes("app-starters/")), false);
assert.equal(resourceFiles.some((file) => file.endsWith(".DS_Store")), false);

const npmCache = fs.mkdtempSync(path.join(os.tmpdir(), "xpell-ui-npm-cache-"));
let packResult;
try {
  const pack = spawnSync("npm", ["pack", "--dry-run", "--json"], {
    cwd: packageRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      npm_config_cache: npmCache,
      npm_config_loglevel: "silent",
    },
  });
  assert.equal(pack.status, 0, pack.stderr || pack.stdout);
  packResult = JSON.parse(pack.stdout)[0];
} finally {
  fs.rmSync(npmCache, { recursive: true, force: true });
}
const packFiles = new Set(packResult.files.map((file) => file.path));

for (const required of [
  "system-xapps/manifest.json",
  "system-xapps/vibe-system/app.json",
  "system-xapps/vibe-system/views/xvibe-sys-main.json",
  "system-xapps/vibe-system/views/ai-card.json",
  "system-xapps/vibe-system/views/toolbar.json",
  "system-xapps/vibe-system/flows/flow-create-app-from-starter.json",
  "system-xapps/vibe-system/flows/flow-generate-app.json",
  "system-xapps/vibe-system/flows/flow-open-generated-app.json"
]) {
  assert.ok(packFiles.has(required), `npm package must include ${required}`);
}

assert.equal([...packFiles].some((file) => file.includes("app-starters/")), false);
assert.equal([...packFiles].some((file) => file.endsWith(".DS_Store")), false);

console.log("@xpell/ui system-xapps package tests passed");
