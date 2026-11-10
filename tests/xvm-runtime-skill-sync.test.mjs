import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { register } from "node:module";

register("./ignore-css-loader.mjs", import.meta.url);

function createMemoryStorage() {
  const values = new Map();
  return {
    getItem(key) {
      return values.has(String(key)) ? values.get(String(key)) : null;
    },
    setItem(key, value) {
      values.set(String(key), String(value));
    },
    removeItem(key) {
      values.delete(String(key));
    },
    clear() {
      values.clear();
    },
  };
}

const classList = {
  add() {},
  remove() {},
  toggle() {},
};

globalThis.window = {
  localStorage: createMemoryStorage(),
  sessionStorage: createMemoryStorage(),
  addEventListener() {},
  removeEventListener() {},
  location: {
    search: "",
    hash: "",
  },
};

globalThis.document = {
  documentElement: {
    classList,
    setAttribute() {},
    getAttribute() {
      return "";
    },
  },
  body: {},
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() {},
};

globalThis.HTMLElement = class HTMLElement {};

const {
  _x,
  XUI,
  XVMClient,
} = await import("../dist/xpell-ui.es.js");

function registerRuntimeSkillObject(type, skillOverrides = {}) {
  class RuntimeSkillObject {
    static _xtype = type;
    static _skill = {
      _id: type,
      _title: type,
      _version: "1.0.0",
      _active: true,
      _type: "view-skill",
      _description: `${type} runtime component skill.`,
      _fields: {
        _data_source: "XData key for records.",
        _item: "Collection item template.",
      },
      _exports: {
        _xui_objects: [type],
      },
      _design: {
        _palette: {
          _title: type,
          _category: "Data Display",
          _default_object: { _type: type },
        },
      },
      ...skillOverrides,
    };

    static getOwnSkill() {
      return this._skill;
    }
  }

  XUI.importObject(type, RuntimeSkillObject);
  return RuntimeSkillObject;
}

function collectSkillIds(value, out = new Set()) {
  if (!value) return out;
  if (Array.isArray(value)) {
    for (const item of value) collectSkillIds(item, out);
    return out;
  }
  if (typeof value !== "object") return out;

  for (const key of ["_id", "_xtype", "_xui_type", "_object_type"]) {
    if (typeof value[key] === "string" && value[key].trim()) {
      out.add(value[key].trim());
    }
  }
  if (Array.isArray(value._xui_objects)) {
    for (const type of value._xui_objects) {
      if (typeof type === "string" && type.trim()) out.add(type.trim());
    }
  }
  if (Array.isArray(value._exports?._xui_objects)) {
    for (const type of value._exports._xui_objects) {
      if (typeof type === "string" && type.trim()) out.add(type.trim());
    }
  }

  collectSkillIds(value._skills, out);
  collectSkillIds(value._objects, out);
  collectSkillIds(value._modules, out);
  return out;
}

function duplicateRuntimeObjectIds(runtimeSkills) {
  const locations = new Map();
  for (const skill of runtimeSkills?._objects ?? []) {
    if (skill?._id) locations.set(skill._id, [...(locations.get(skill._id) ?? []), "root"]);
  }
  for (const moduleItem of runtimeSkills?._modules ?? []) {
    for (const skill of moduleItem?._objects ?? []) {
      if (skill?._id) {
        locations.set(skill._id, [...(locations.get(skill._id) ?? []), moduleItem._name ?? "module"]);
      }
    }
  }
  return Array.from(locations.entries()).filter(([, refs]) => refs.length > 1);
}

function findRuntimeSkillById(value, id) {
  if (!value) return null;
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findRuntimeSkillById(item, id);
      if (found) return found;
    }
    return null;
  }
  if (typeof value !== "object") return null;
  if (value._id === id) return value;
  return (
    findRuntimeSkillById(value._objects, id) ??
    findRuntimeSkillById(value._skills, id) ??
    findRuntimeSkillById(value._modules, id)
  );
}

function findSemanticNode(value, predicate) {
  if (!value) return null;
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findSemanticNode(item, predicate);
      if (found) return found;
    }
    return null;
  }
  if (typeof value !== "object") return null;
  if (predicate(value)) return value;
  return (
    findSemanticNode(value._children, predicate) ??
    findSemanticNode(value._semantic_children, predicate) ??
    findSemanticNode(value._slots, predicate)
  );
}

function createLoadServerAppClient({ appId = "plantkeeper", env = "default", failSync = false, falsePositiveSync = false } = {}) {
  const events = [];
  const serverCommands = [];
  const syncCommands = [];
  const scopedRuntimeSkills = new Map();
  let syncShouldFail = failSync;
  let syncShouldFalsePositive = falsePositiveSync;
  const client = new XVMClient({
    _app_id: "vibe-system",
    _env: "default",
    _wormhole_url: "ws://test",
  });
  client._runtime_skill_server_identity = "server-a";

  client._send_cmd = async (op, params) => {
    events.push(op);
    serverCommands.push({ op, params });
    if (op === "get-app") {
      assert.equal(params._app_id, appId);
      assert.equal(params._env, env);
      return {
        _app: {
          _app_id: appId,
          _env: env,
          _meta: {
            _entry_view_id: "main",
            _version: 1,
          },
          _config: {},
        },
        _view_ids: ["main"],
        _flows: {},
      };
    }
    if (op === "get-view") {
      assert.equal(params._app_id, appId);
      assert.equal(params._env, env);
      assert.equal(params._view_id, "main");
      return {
        _view: {
          _type: "view",
          _id: "main",
          _children: [],
        },
        _version: 1,
      };
    }
    if (op === "subscribe") {
      assert.equal(params._app_id, appId);
      assert.equal(params._env, env);
      return { _ok: true, _result: {} };
    }
    throw new Error(`unexpected server op ${op}`);
  };

  client._mount_runtime_app = async () => {
    events.push("mount");
    client._app_mounted = true;
    client._app_needs_refresh = false;
  };

  client.render_view = async (viewId) => {
    events.push("render");
    assert.equal(viewId, "main");
    client._current_view_id = viewId;
    client._app_view_id = viewId;
    client._has_rendered_view = true;
  };

  client.sendXcmd = async (command) => {
    events.push(`${command._module}.${command._op}`);
    syncCommands.push(command);
    if (syncShouldFail) {
      throw new Error("sync unavailable");
    }
    if (syncShouldFalsePositive) {
      return {
        _ok: true,
        _result: {
          _synced: false,
          _error: {
            _code: "E_XVIBE_SYNC_SKILLS_FAILED",
            _message: "sync failed",
          },
        },
      };
    }
    scopedRuntimeSkills.set(
      `${command._params._env}::${command._params._app_id}::${command._params._mode}`,
      command._params._skills,
    );
    return { _ok: true, _result: { _synced: true } };
  };

  return {
    client,
    events,
    serverCommands,
    syncCommands,
    scopedRuntimeSkills,
    setFailSync(value) {
      syncShouldFail = value;
    },
    setFalsePositiveSync(value) {
      syncShouldFalsePositive = value;
    },
  };
}

const originalGetSkills = _x.getSkills;

try {
  _x.getSkills = () => ({
    _modules: [
      {
        _name: "server-runtime",
        _skills: [
          {
            _id: "label",
            _title: "Label",
            _exports: { _xui_objects: ["label"] },
          },
        ],
      },
    ],
    _skills: [],
    _objects: [],
  });

  const xgallerySemanticChildren = [
    {
      _id: "item-template",
      _label: "Item Template",
      _role: "collection-item-template",
      _kind: "group",
      _path: "_item",
      _children: [
        {
          _id: "item-title",
          _label: "Title",
          _role: "title",
          _kind: "property",
          _path: "_title",
          _style_path: "_styles._title._style",
          _capabilities: ["typography", "spacing", "appearance"],
        },
        {
          _id: "deep-root",
          _label: "Deep Root",
          _role: "deep-root",
          _kind: "group",
          _path: "_deep",
          _semantic_children: [
            {
              _id: "deep-branch",
              _label: "Deep Branch",
              _role: "deep-branch",
              _kind: "group",
              _path: "_branch",
              _slots: [
                {
                  _id: "deep-slot",
                  _label: "Deep Slot",
                  _role: "deep-slot",
                  _kind: "group",
                  _path: "_slot",
                  _children: [
                    {
                      _id: "deep-title",
                      _label: "Deep Title",
                      _role: "deep-title",
                      _kind: "property",
                      _path: "_title",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  registerRuntimeSkillObject("xgallery", {
    _design: {
      _palette: {
        _title: "Gallery",
        _category: "Data Display",
        _default_object: { _type: "xgallery" },
      },
      _semantic_children: xgallerySemanticChildren,
    },
  });
  registerRuntimeSkillObject("xlist");
  registerRuntimeSkillObject("xpage");

  const harness = createLoadServerAppClient();
  const result = await harness.client.load_server_app("plantkeeper", "default");

  assert.equal(result._ok, true);
  assert.deepEqual(
    harness.events,
    ["get-app", "get-view", "mount", "render", "subscribe", "studio.sync-client-skills"]
  );
  assert.equal(harness.syncCommands.length, 1);

  const syncCommand = harness.syncCommands[0];
  assert.equal(syncCommand._module, "studio");
  assert.equal(syncCommand._op, "sync-client-skills");
  assert.equal(syncCommand._params._app_id, "plantkeeper");
  assert.equal(syncCommand._params._env, "default");
  assert.equal(syncCommand._params._mode, "runtime");

  const syncedIds = collectSkillIds(syncCommand._params._skills);
  assert.equal(syncedIds.has("xgallery"), true);
  assert.equal(syncedIds.has("xlist"), true);
  assert.equal(syncedIds.has("xpage"), true);
  assert.equal(syncedIds.has("label"), true);
  assert.equal(JSON.stringify(syncCommand._params._skills).includes("_implementation"), false);
  assert.deepEqual(duplicateRuntimeObjectIds(syncCommand._params._skills), []);
  assert.equal(harness.scopedRuntimeSkills.has("default::plantkeeper::runtime"), true);
  const syncedGallery = findRuntimeSkillById(syncCommand._params._skills, "xgallery");
  const payloadBytes = Buffer.byteLength(JSON.stringify(syncCommand._params._skills), "utf8");
  assert.equal(Array.isArray(xgallerySemanticChildren[0]._children), true);
  assert.equal(xgallerySemanticChildren[0]._children[0]._role, "title");
  assert.equal(xgallerySemanticChildren[0]._children[0]._style_path, "_styles._title._style");
  assert.equal(Array.isArray(syncedGallery?._design?._semantic_children), true);
  assert.equal(syncedGallery._design._semantic_children.length, 1);
  const syncedTitle = findSemanticNode(
    syncedGallery._design._semantic_children,
    (node) => node._role === "title",
  );
  assert.equal(syncedTitle?._id, "item-title");
  assert.equal(syncedTitle?._role, "title");
  assert.equal(syncedTitle?._path, "_title");
  assert.equal(syncedTitle?._style_path, "_styles._title._style");
  assert.deepEqual(syncedTitle?._capabilities, ["typography", "spacing", "appearance"]);
  assert.equal(
    findSemanticNode(syncedGallery._design._semantic_children, (node) => node._id === "deep-title")?._role,
    "deep-title",
  );
  assert.ok(payloadBytes > 0);
  assert.ok(payloadBytes < 2_000_000);

  await harness.client._sync_runtime_skills("duplicate-test", "plantkeeper", "default");
  assert.equal(harness.syncCommands.length, 1);

  registerRuntimeSkillObject("xkanban");
  await harness.client._sync_runtime_skills("changed-snapshot-test", "plantkeeper", "default");
  assert.equal(harness.syncCommands.length, 2);
  assert.equal(collectSkillIds(harness.syncCommands[1]._params._skills).has("xkanban"), true);

  await harness.client._sync_runtime_skills("same-server-unchanged-test", "plantkeeper", "default");
  assert.equal(harness.syncCommands.length, 2);

  harness.client._runtime_skill_server_identity = "server-b";
  await harness.client._sync_runtime_skills("server-restart-test", "plantkeeper", "default");
  assert.equal(harness.syncCommands.length, 3);
  assert.equal(harness.syncCommands[2]._params._app_id, "plantkeeper");
  assert.equal(harness.syncCommands[2]._params._env, "default");
  assert.equal(harness.syncCommands[2]._params._mode, "runtime");

  harness.scopedRuntimeSkills.delete("default::plantkeeper::runtime");
  assert.equal(harness.scopedRuntimeSkills.has("default::plantkeeper::runtime"), false);
  harness.client.isWormholeReady = () => true;
  harness.client._note_runtime_skill_server_hello({ _node: "server-c" });
  await harness.client._resubscribe_runtime_after_reconnect("wormhole-hello");
  assert.equal(harness.scopedRuntimeSkills.has("default::plantkeeper::runtime"), true);
  assert.equal(harness.syncCommands.length, 4);

  await harness.client._sync_runtime_skills("scope-isolation-test", "garden-app", "prod");
  assert.equal(harness.syncCommands.length, 5);
  assert.equal(harness.syncCommands[4]._params._app_id, "garden-app");
  assert.equal(harness.syncCommands[4]._params._env, "prod");
  assert.equal(harness.syncCommands[4]._params._mode, "runtime");
  assert.equal(harness.scopedRuntimeSkills.has("default::plantkeeper::runtime"), true);
  assert.equal(harness.scopedRuntimeSkills.has("prod::garden-app::runtime"), true);

  const failureHarness = createLoadServerAppClient({ appId: "failure-app", failSync: true });
  const failureResult = await failureHarness.client.load_server_app("failure-app", "default");
  assert.equal(failureResult._ok, true);
  assert.equal(failureHarness.syncCommands.length, 1);
  failureHarness.setFailSync(false);
  await failureHarness.client._sync_runtime_skills("retry-after-throw", "failure-app", "default");
  assert.equal(failureHarness.syncCommands.length, 2);

  const falsePositiveHarness = createLoadServerAppClient({ appId: "false-positive-app", falsePositiveSync: true });
  await falsePositiveHarness.client.load_server_app("false-positive-app", "default");
  assert.equal(falsePositiveHarness.syncCommands.length, 1);
  falsePositiveHarness.setFalsePositiveSync(false);
  await falsePositiveHarness.client._sync_runtime_skills("retry-after-false-positive", "false-positive-app", "default");
  assert.equal(falsePositiveHarness.syncCommands.length, 2);

  harness.client._note_runtime_skill_server_hello({ _node: "server-d" });
  assert.equal(harness.client._runtime_skill_server_identity, "server-d");

  const sourceText = readFileSync(new URL("../src/XVM/XVMClient.ts", import.meta.url), "utf8");
  assert.equal(/xgallery|xlist|xpage|xdashboard/i.test(sourceText), false);
} finally {
  _x.getSkills = originalGetSkills;
}

console.log("xvm runtime skill sync tests passed");
