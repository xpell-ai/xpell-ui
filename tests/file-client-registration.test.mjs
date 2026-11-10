import assert from "node:assert/strict";
import { register } from "node:module";

register("./ignore-css-loader.mjs", import.meta.url);

function createStorage() {
  const values = new Map();
  return {
    get length() {
      return values.size;
    },
    key(index) {
      return Array.from(values.keys())[index] ?? null;
    },
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
    }
  };
}

const classList = {
  add() {},
  remove() {},
  toggle() {}
};

const storage = createStorage();
globalThis.window = {
  localStorage: storage,
  sessionStorage: storage,
  addEventListener() {},
  removeEventListener() {},
  location: {
    search: "",
    hash: ""
  }
};
globalThis.localStorage = storage;
globalThis.sessionStorage = storage;
globalThis.document = {
  documentElement: {
    classList,
    setAttribute() {},
    getAttribute() {
      return "";
    }
  },
  body: {},
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() {}
};
globalThis.HTMLElement = class HTMLElement {};

const {
  _x,
  XUIRuntime,
  XVMClient,
  FILE_CLIENT_MODULE_ID
} = await import("../dist/xpell-ui.es.js");

await XUIRuntime.loadModules({
  _auto_start: false,
  _load_auth_client: false,
  _load_xvm: false,
  _load_flow: false,
  _load_entity_client: false,
  _load_studio: false,
  _load_xai_client: false,
  _load_project_memory_client: false,
  _load_file_client: true
});

const fileClient = _x.getModule(FILE_CLIENT_MODULE_ID);
assert.equal(fileClient._name, "file-client");
assert.equal(fileClient.constructor._skill._type, "client-module-api");
assert.equal(fileClient.constructor._skill._runtime._target, "client");

const skills = _x.getSkills();
assert.match(JSON.stringify(skills), /file-client/);

const xvmClient = new XVMClient({
  _app_id: "pc-10",
  _env: "default",
  _wormhole_url: "ws://test"
});
const snapshot = xvmClient._collect_runtime_skill_snapshot();
assert.match(JSON.stringify(snapshot), /file-client/);

console.log("file-client XUI registration test passed");
