import { _xd, _xlog, XUtils as _xu } from "@xpell/core";

import { _xem } from "../XEM/XEventManager";
import Wormholes from "../Wormholes/Wormholes";
import { XDB } from "../XDB/XDBClient";
import { XVM, type XVMApp } from "./XVM";
import { XUI } from "../XUI/XUI";
import { studio_editor_view } from "../XStudio/XSEditor";

const LOG = "[xvm-client]";
const DEFAULT_REGION = "main";
const DEFAULT_CONTAINER_ID = "region-main";

const EVT_XVM_UPDATE = "xvm:update";
const EVT_XVM_VIEW_RENDERED = "xvm:view-rendered";
const EVT_XVM_CONNECTION = "xvm:connection-change";
const EVT_VIBE_GENERATION_STAGE = "vibe:generation-stage";
const EVT_VIBE_GENERATION_FAILED = "vibe:generation-failed";
const EVT_XVIBE_ERROR = "xvibe:error";
const EVT_COMMAND_ERROR = "command:error";

export const _XD_KEYS = {
  XVM_APP_ID: "xvm:current_app_id",
  XVM_ENV: "xvm:current_env",
  STUDIO_GENERATION_ID: "studio:generation_id",
  STUDIO_GENERATION_STATE: "studio:generation_state",
  STUDIO_GENERATION_STATUS: "studio:generation_status",
  STUDIO_GENERATION_ERROR: "studio:generation_error",
  STUDIO_STATUS: "studio:status",
  STUDIO_JSON: "studio:json",
  STUDIO_SELECTED_MODULE: "studio:selected_module",
  STUDIO_MODULE_SOURCE: "studio:module_source",
  STUDIO_MODULE_REPAIR_PROMPT: "studio:module_repair_prompt",
  STUDIO_VIEWS: "studio:views",
  STUDIO_FLOWS: "studio:flows",
  STUDIO_MODULES: "studio:modules",
}

type ServerXVMApp = {
  _app_id: string;
  _env: string;
  _meta?: Record<string, any>;
  _config?: Record<string, any>;
};

type ServerGetAppRes = {
  _app: ServerXVMApp;
  _view_ids?: string[];
  _views?: Record<string, any>;
  _flow_ids?: string[];
  _flows?: Record<string, any>;
};

type ServerGetViewRes = {
  _app_id: string;
  _env: string;
  _version?: number;
  _view: Record<string, any>;
};

type ServerListViewsRes = {
  _views?: any[];
};

type ServerListFlowsRes = {
  _flows?: any[];
};

type ServerListGeneratedModulesRes = {
  _modules?: any[];
};

type ServerUpdateEvt = {
  _app_id: string;
  _env: string;
  _view_id: string;
  _version?: number;
  _view: Record<string, any>;
  _generation_id?: string;
  _meta?: Record<string, any>;
};

type VibeGenerationFailureEvt = {
  _app_id?: string;
  _env?: string;
  _view_id?: string;
  _generation_id?: string;
  _meta?: Record<string, any>;
  _code?: string;
  _message?: string;
  _details?: any;
  _diagnostic?: any;
  _diagnostics?: any;
};

type VibeGenerationStageEvt = {
  _app_id?: string;
  _env?: string;
  _view_id?: string;
  _generation_id?: string;
  _meta?: Record<string, any>;
  _stage?: string;
  _message?: string;
};

type VibeGenerationState = "idle" | "pending" | "running" | "completed" | "failed";

const GENERATION_STAGE_STATUS: Record<string, string> = {
  preparing: "Preparing generation...",
  planning: "Planning...",
  "selecting-skills": "Selecting skills...",
  "loading-view": "Loading current view...",
  "building-prompt": "Building prompt...",
  generating: "Generating JSON...",
  parsing: "Parsing response...",
  validating: "Validating...",
  repairing: "Repairing...",
  saving: "Saving...",
  complete: "Done",
  completed: "Done",
  failed: "Generation failed",
};

export type XVMClientConnectionChange = {
  _status: "connected" | "disconnected" | "error" | "connecting";
  _connected: boolean;
  _app_id: string;
  _env: string;
  _source?: string;
};

export type XVMClientOptions = {
  _app_id: string;
  _env: string;
  _wormhole_url: string;
  _region?: string;
  _fallback_view_id?: string;
  _theme?: string | Record<string, string>;
  onViewRendered?: (view_id: string) => void;
  onConnectionChange?: (payload: XVMClientConnectionChange) => void;
  onError?: (error: any) => void;
  onAppMounted?: (payload: { _app_id: string; _env: string; _region: string }) => void;
};

const is_obj = (v: unknown): v is Record<string, any> => typeof v === "object" && v !== null && !Array.isArray(v);

const to_err = (e: any) => {
  if (e instanceof Error) return e.message || String(e);
  if (typeof e === "string") return e;
  if (is_obj(e)) {
    const maybe = (e as any)._error ?? (e as any).error ?? (e as any)._result ?? e;
    if (maybe instanceof Error) return maybe.message || String(maybe);
    if (typeof maybe?.message === "string") return maybe.message;
    try {
      return JSON.stringify(maybe);
    } catch {
      return String(maybe);
    }
  }
  return String(e);
};

const to_result = (raw: any) => {
  if (is_obj(raw) && typeof raw._ok === "boolean") {
    if (raw._ok !== true) throw new Error(to_err(raw._result ?? raw));
    return "_result" in raw ? raw._result : raw;
  }

  if (is_obj(raw) && is_obj(raw._payload) && typeof raw._payload._ok === "boolean") {
    if (raw._payload._ok !== true) throw new Error(to_err(raw._payload._result ?? raw._payload));
    return "_result" in raw._payload ? raw._payload._result : raw._payload;
  }

  if (is_obj(raw) && "_result" in raw) {
    return (raw as any)._result;
  }

  return raw;
};

export class XVMClient {
  _app_id: string;
  _env: string;
  _wormhole_url: string;
  _region_override?: string;
  _fallback_view_id?: string;
  _on_view_rendered?: (view_id: string) => void;
  _on_connection_change?: (payload: XVMClientConnectionChange) => void;
  _on_error?: (error: any) => void;
  _on_app_mounted?: (payload: { _app_id: string; _env: string; _region: string }) => void;

  _views_cache: Map<string, any> = new Map();
  _flows: Map<string, any> = new Map();
  _known_view_ids: Set<string> = new Set();
  _cmd_seq = 0;
  _app: ServerXVMApp | null = null;
  _current_view_id = "";
  _app_view_id = "";
  _current_version = 0;
  _bound = false;
  _app_mounted = false;
  _has_rendered_view = false;
  _app_needs_refresh = false;
  _connected = false;
  _theme?: string | Record<string, string>;
  _cache_key_app: string;
  _cache_key_version: string;
  _active_generation_id = "";
  _active_generation_view_id = "";

  constructor(opts: XVMClientOptions) {
    this._app_id = opts._app_id;
    this._env = opts._env;
    this._wormhole_url = opts._wormhole_url;
    this._region_override = typeof opts._region === "string" && opts._region.trim() ? opts._region.trim() : undefined;
    this._fallback_view_id =
      typeof opts._fallback_view_id === "string" && opts._fallback_view_id.trim() ? opts._fallback_view_id.trim() : undefined;
    this._on_view_rendered = typeof opts.onViewRendered === "function" ? opts.onViewRendered : undefined;
    this._on_connection_change = typeof opts.onConnectionChange === "function" ? opts.onConnectionChange : undefined;
    this._on_error = typeof opts.onError === "function" ? opts.onError : undefined;
    this._on_app_mounted = typeof opts.onAppMounted === "function" ? opts.onAppMounted : undefined;
    this._theme = opts._theme;

    this._cache_key_app = `xvm:last_app:${this._env}:${this._app_id}`;
    this._cache_key_version = `xvm:version:${this._env}:${this._app_id}`;
    _xd.set(
      _XD_KEYS.XVM_APP_ID,
      this._app_id,
      {
        source: "xvm-client"
      }
    );

    _xd.set(
      _XD_KEYS.XVM_ENV,
      this._env,
      {
        source: "xvm-client"
      }
    );
  }

  get_current_view_id(): string {
    return this._current_view_id;
  }


  getActiveAppId() {
    return this._app_id;
  }

  getActiveEnv() {
    return this._env;
  }

  _log(...args: any[]) {
    _xlog.log(LOG, ...args);
  }

  _error(...args: any[]) {
    _xlog.error(LOG, ...args);
  }

  _vibe_log(...args: any[]) {
    _xlog.log("[vibe-client]", ...args);
  }

  _normalize_event_payload(payload: any) {
    const raw = typeof payload === "string" && payload.trim()
      ? (() => {
        try {
          return JSON.parse(payload);
        } catch {
          return payload;
        }
      })()
      : payload;

    if (is_obj(raw) && Array.isArray(raw?._args) && is_obj(raw._args[0])) return raw._args[0];
    if (is_obj(raw) && Array.isArray(raw?.args) && is_obj(raw.args[0])) return raw.args[0];
    if (is_obj(raw) && is_obj(raw?._payload)) return raw._payload;
    if (is_obj(raw) && is_obj(raw?.payload)) return raw.payload;
    return raw;
  }

  _is_timeout_error(err: any) {
    const e = is_obj(err) ? ((err as any)._error ?? err) : err;
    return is_obj(e) && (e as any)._code === "E_TIMEOUT";
  }

  _format_generation_error(evt: VibeGenerationFailureEvt) {
    const code = typeof evt._code === "string" && evt._code.trim() ? evt._code.trim() : "";
    const message =
      typeof evt._message === "string" && evt._message.trim()
        ? evt._message.trim()
        : "";

    if (code && message) return `${code}: ${message}`;
    if (message) return message;
    if (code) return code;
    return "Generation failed";
  }

  _normalize_generation_stage(stage: string) {
    return stage.trim().toLowerCase().replaceAll("_", "-");
  }

  _humanize_generation_stage(stage: string) {
    const text = stage
      .trim()
      .replaceAll("_", " ")
      .replaceAll("-", " ")
      .replace(/\s+/g, " ")
      .toLowerCase();

    if (!text) return "Generating...";
    return `${text.charAt(0).toUpperCase()}${text.slice(1)}...`;
  }

  _format_generation_stage_message(evt: Record<string, any>) {
    const message = typeof evt._message === "string" && evt._message.trim() ? evt._message.trim() : "";
    if (message) return message;

    const stage = typeof evt._stage === "string" && evt._stage.trim() ? evt._stage.trim() : "";
    if (!stage) return "Generating...";

    const normalized_stage = this._normalize_generation_stage(stage);
    return GENERATION_STAGE_STATUS[normalized_stage] ?? this._humanize_generation_stage(stage);
  }

  _format_generation_stage(evt: VibeGenerationStageEvt) {
    return this._format_generation_stage_message(evt);
  }

  _short_generation_status(status: string) {
    const text = typeof status === "string" ? status.trim() : "";
    if (!text) return "Working...";

    const mapped: Record<string, string> = {
      "Preparing generation...": "Preparing...",
      "Planning intent...": "Planning...",
      "Planning...": "Planning...",
      "Selecting skills...": "Selecting...",
      "Skills selected": "Skills selected",
      "Loading current view...": "Loading...",
      "Building prompt...": "Prompt...",
      "Generating JSON...": "Generating...",
      "Parsing response...": "Parsing...",
      "Validating artifact...": "Validating...",
      "Validating...": "Validating...",
      "Repairing artifact...": "Repairing...",
      "Repairing...": "Repairing...",
      "Saving view...": "Saving...",
      "Saving...": "Saving...",
      "View updated": "Done",
      "Done": "Done",
      "Generation failed": "Failed",
    };

    if (mapped[text]) return mapped[text];
    return text.length <= 22 ? text : "Working...";
  }

  _write_generation_state(state: VibeGenerationState, status: string, error?: any) {
    _xd.set(_XD_KEYS.STUDIO_GENERATION_STATE, state, { source: "vibe-client" });
    _xd.set(_XD_KEYS.STUDIO_GENERATION_STATUS, status, { source: "vibe-client" });
    if (error !== undefined) {
      _xd.set(_XD_KEYS.STUDIO_GENERATION_ERROR, error, { source: "vibe-client" });
    }
  }

  _set_studio_generation_ui(state: VibeGenerationState, status: string) {
    const button = XUI.getObject("xstudio-preview-button") as any;
    const status_label = XUI.getObject("xstudio-generation-status") as any;
    const running = state === "pending" || state === "running";
    const button_text = running ? this._short_generation_status(status) : "Go";

    if (button) {
      button.setText?.(button_text);
      if (button.dom) {
        if (running) {
          button.dom.setAttribute("disabled", "true");
        } else {
          button.dom.removeAttribute("disabled");
        }
      }
    }

    status_label?.setText?.(status);
    return button_text;
  }

  _set_studio_label(object_id: string, text: string) {
    const label = XUI.getObject(object_id) as any;
    label?.setText?.(text);
  }

  _set_studio_json_editor(text: string) {
    const editor = XUI.getObject("xstudio-json") as any;
    if (editor?.setValue) {
      editor.setValue(text);
    } else if (editor?.dom && "value" in editor.dom) {
      editor.dom.value = text;
    }
  }

  _set_studio_module_source_editor(text: string) {
    const editor = XUI.getObject("xstudio-module-source") as any;
    editor?.setValue?.(text);
  }

  _set_studio_selected_module_editor(text: string) {
    const editor = XUI.getObject("xstudio-selected-module") as any;
    editor?.setValue?.(text);
  }

  _write_studio_status(status: string) {
    _xd.set(_XD_KEYS.STUDIO_STATUS, status, { source: "xstudio-runtime" });
    this._set_studio_label("xstudio-status", status);
  }

  _get_studio_module_name(item: any) {
    if (typeof item === "string" && item.trim()) return item.trim();
    if (!is_obj(item)) return "";

    const name =
      typeof item._name === "string" && item._name.trim()
        ? item._name.trim()
        : typeof item._id === "string" && item._id.trim()
          ? item._id.trim()
          : typeof item.id === "string" && item.id.trim()
            ? item.id.trim()
            : "";

    return name;
  }

  _get_studio_module_state(item: any) {
    if (!is_obj(item)) return "";
    return typeof item._state === "string" && item._state.trim()
      ? item._state.trim()
      : "";
  }

  _get_studio_modules() {
    const modules = _xd.get(_XD_KEYS.STUDIO_MODULES);
    return Array.isArray(modules) ? modules : [];
  }

  _resolve_studio_selected_module(options: { allow_dev_fallback?: boolean } = {}) {
    const selected_module = String(_xd.get(_XD_KEYS.STUDIO_SELECTED_MODULE) ?? "").trim();
    if (selected_module) return selected_module;

    const modules = this._get_studio_modules();
    if (modules.length > 0) {
      this._write_studio_status("Select a module first");
      return "";
    }

    if (options.allow_dev_fallback === false) {
      this._write_studio_status("Select a module first");
      return "";
    }

    const fallback = "tic-tac-toe";
    _xd.set(_XD_KEYS.STUDIO_SELECTED_MODULE, fallback, { source: "xstudio-module-editor" });
    this._set_studio_selected_module_editor(fallback);
    return fallback;
  }

  _format_studio_list_item(item: any) {
    if (typeof item === "string") return item;
    if (!is_obj(item)) return String(item);

    const id =
      typeof item._id === "string" && item._id.trim()
        ? item._id.trim()
        : typeof item.id === "string" && item.id.trim()
          ? item.id.trim()
          : "";
    const title =
      typeof item._title === "string" && item._title.trim()
        ? item._title.trim()
        : typeof item._name === "string" && item._name.trim()
          ? item._name.trim()
          : "";

    if (id && title && title !== id) return `${id} (${title})`;
    if (id) return id;
    if (title) return title;

    try {
      return JSON.stringify(item);
    } catch {
      return String(item);
    }
  }

  _format_studio_list(label: string, items: any[]) {
    if (!Array.isArray(items) || items.length === 0) return `${label}: -`;
    return `${label}: ${items.map((item) => this._format_studio_list_item(item)).join(", ")}`;
  }

  _format_studio_module_list_item(item: any) {
    const name = this._get_studio_module_name(item);
    const state = this._get_studio_module_state(item);

    if (name && state) return `${name} (${state})`;
    if (name) return name;

    try {
      return JSON.stringify(item);
    } catch {
      return String(item);
    }
  }

  _format_studio_module_list(items: any[]) {
    if (!Array.isArray(items) || items.length === 0) return "Modules: -";
    return `Modules: ${items.map((item) => this._format_studio_module_list_item(item)).join(", ")}`;
  }

  _extract_studio_generated_module_response(result: any, selected_module: string) {
    const direct_source =
      is_obj(result) && typeof result._source === "string"
        ? result._source
        : undefined;
    const module_source =
      is_obj(result?._module) && typeof result._module._source === "string"
        ? result._module._source
        : undefined;
    const nested_source =
      is_obj(result?._result) && typeof result._result._source === "string"
        ? result._result._source
        : undefined;
    const nested_module_source =
      is_obj(result?._result?._module) && typeof result._result._module._source === "string"
        ? result._result._module._source
        : undefined;

    const direct_name =
      is_obj(result) && typeof result._name === "string" && result._name.trim()
        ? result._name.trim()
        : "";
    const module_name =
      is_obj(result?._module) && typeof result._module._name === "string" && result._module._name.trim()
        ? result._module._name.trim()
        : "";

    return {
      _name: direct_name || module_name || selected_module,
      _source: direct_source ?? module_source ?? nested_source ?? nested_module_source,
    };
  }

  _resolve_studio_target_view_id() {
    const current_view_id = this._current_view_id === "xstudio-editor" ? "" : this._current_view_id;
    return this._app_view_id || current_view_id || "";
  }

  async _refresh_studio_runtime() {
    try {
      const app_id = this.getActiveAppId();
      const env = this.getActiveEnv();

      if (!app_id) {
        throw new Error("Missing active app id");
      }

      this._write_studio_status("Refreshing runtime...");

      const params = { _app_id: app_id, _env: env };
      const [views_res, flows_res, modules_res] = await Promise.all([
        this._send_cmd("list-views", params) as Promise<ServerListViewsRes>,
        this._send_cmd("list-flows", params) as Promise<ServerListFlowsRes>,
        this._send_cmd("list-generated-modules", {}) as Promise<ServerListGeneratedModulesRes>,
      ]);

      const views = Array.isArray(views_res?._views) ? views_res._views : [];
      const flows = Array.isArray(flows_res?._flows) ? flows_res._flows : [];
      const modules = Array.isArray(modules_res?._modules) ? modules_res._modules : [];

      _xd.set(_XD_KEYS.STUDIO_VIEWS, views, { source: "xstudio-runtime" });
      _xd.set(_XD_KEYS.STUDIO_FLOWS, flows, { source: "xstudio-runtime" });
      _xd.set(_XD_KEYS.STUDIO_MODULES, modules, { source: "xstudio-runtime" });

      const selected_module = String(_xd.get(_XD_KEYS.STUDIO_SELECTED_MODULE) ?? "").trim();
      if (!selected_module && modules.length > 0) {
        const first_module = this._get_studio_module_name(modules[0]);
        if (first_module) {
          _xd.set(_XD_KEYS.STUDIO_SELECTED_MODULE, first_module, { source: "xstudio-runtime" });
          this._set_studio_selected_module_editor(first_module);
        }
      }

      this._set_studio_label("xstudio-views-list", this._format_studio_list("Views", views));
      this._set_studio_label("xstudio-flows-list", this._format_studio_list("Flows", flows));
      this._set_studio_label("xstudio-modules-list", this._format_studio_module_list(modules));
      this._write_studio_status("Runtime refreshed");
      return true;
    } catch (err) {
      const message = `Runtime refresh failed: ${to_err(err)}`;
      this._write_studio_status(message);
      this._error("studio runtime refresh failed", err);
      return false;
    }
  }

  async _load_studio_current_view_json() {
    try {
      const app_id = this.getActiveAppId();
      const env = this.getActiveEnv();
      const view_id = this._resolve_studio_target_view_id();

      if (!app_id || !view_id) {
        throw new Error("Missing active app id or view id");
      }

      this._write_studio_status(`Loading ${view_id}...`);

      const out = (await this._send_cmd("get-view", { _app_id: app_id, _env: env, _view_id: view_id })) as ServerGetViewRes;
      if (!is_obj(out) || !is_obj(out._view)) {
        throw new Error(`Invalid get-view response for '${view_id}'`);
      }

      const json = JSON.stringify(out._view, null, 2);
      _xd.set(_XD_KEYS.STUDIO_JSON, json, { source: "xstudio-runtime" });
      this._set_studio_json_editor(json);
      this._write_studio_status(`Loaded ${view_id}`);
    } catch (err) {
      const message = `Load current view failed: ${to_err(err)}`;
      this._write_studio_status(message);
      this._error("studio load current view failed", err);
    }
  }

  async _save_studio_view_json() {
    try {
      const app_id = this.getActiveAppId();
      const env = this.getActiveEnv();
      const json = String(_xd.get(_XD_KEYS.STUDIO_JSON) ?? "").trim();

      if (!app_id) {
        throw new Error("Missing active app id");
      }
      if (!json) {
        throw new Error("studio:json is empty");
      }

      const view = JSON.parse(json);
      if (!is_obj(view)) {
        throw new Error("studio:json must be a JSON object");
      }

      const json_view_id =
        typeof view._id === "string" && view._id.trim()
          ? view._id.trim()
          : "";
      const view_id = json_view_id || this._resolve_studio_target_view_id();

      if (!view_id) {
        throw new Error("Missing view id");
      }

      this._write_studio_status(`Saving ${view_id}...`);

      await this._send_cmd("save-view-json", {
        _app_id: app_id,
        _env: env,
        _view_id: view_id,
        _view: view,
      });

      this._write_studio_status(`Saved ${view_id}`);
    } catch (err) {
      const message = `Save view failed: ${to_err(err)}`;
      this._write_studio_status(message);
      this._error("studio save view failed", err);
    }
  }

  async _load_studio_generated_module_source() {
    try {
      const selected_module = this._resolve_studio_selected_module();
      if (!selected_module) return;

      this._write_studio_status(`Loading module ${selected_module}...`);

      const out = await this._send_module_creator_cmd("get-generated-module", {
        _name: selected_module,
      });

      this._log("studio get-generated-module result", out);

      const parsed = this._extract_studio_generated_module_response(out, selected_module);

      if (typeof parsed._source !== "string") {
        this._error("studio get-generated-module missing source", {
          _selected_module: selected_module,
          _result: out,
        });
        throw new Error(`Invalid get-generated-module response for '${selected_module}'`);
      }

      _xd.set(_XD_KEYS.STUDIO_MODULE_SOURCE, parsed._source, { source: "xstudio-module-editor" });
      this._set_studio_module_source_editor(parsed._source);
      this._write_studio_status(`Loaded module ${parsed._name}`);
    } catch (err) {
      const message = `Load module failed: ${to_err(err)}`;
      this._write_studio_status(message);
      this._error("studio load module failed", err);
    }
  }

  async _save_studio_generated_module_source() {
    try {
      const selected_module = this._resolve_studio_selected_module();
      if (!selected_module) return;

      const source = String(_xd.get(_XD_KEYS.STUDIO_MODULE_SOURCE) ?? "");

      this._write_studio_status(`Saving module ${selected_module}...`);

      await this._send_module_creator_cmd("save-generated-module-source", {
        _name: selected_module,
        _source: source,
      });

      const runtime_refreshed = await this._refresh_studio_runtime();
      this._write_studio_status(
        runtime_refreshed
          ? `Saved module ${selected_module}. Runtime refreshed`
          : `Saved module ${selected_module}. Runtime refresh failed`
      );
    } catch (err) {
      const message = `Save module failed: ${to_err(err)}`;
      this._write_studio_status(message);
      this._error("studio save module failed", err);
    }
  }

  async _repair_studio_generated_module() {
    try {
      const selected_module = this._resolve_studio_selected_module();
      if (!selected_module) return;

      const prompt = String(_xd.get(_XD_KEYS.STUDIO_MODULE_REPAIR_PROMPT) ?? "").trim();

      if (!prompt) {
        throw new Error("studio:module_repair_prompt is empty");
      }

      this._write_studio_status(`Repairing module ${selected_module}...`);

      await this._send_module_creator_cmd("repair-generated-module", {
        _name: selected_module,
        _prompt: prompt,
      });

      const out = await this._send_module_creator_cmd("get-generated-module", {
        _name: selected_module,
      });

      if (!is_obj(out) || typeof out._source !== "string") {
        throw new Error(`Invalid get-generated-module response for '${selected_module}'`);
      }

      _xd.set(_XD_KEYS.STUDIO_MODULE_SOURCE, out._source, { source: "xstudio-module-editor" });
      this._set_studio_module_source_editor(out._source);
      const runtime_refreshed = await this._refresh_studio_runtime();
      this._write_studio_status(
        runtime_refreshed
          ? `Repaired module ${selected_module}. Runtime refreshed`
          : `Repaired module ${selected_module}. Runtime refresh failed`
      );
    } catch (err) {
      const message = `Repair module failed: ${to_err(err)}`;
      this._write_studio_status(message);
      this._error("studio repair module failed", err);
    }
  }

  async _disable_studio_generated_module() {
    try {
      const selected_module = this._resolve_studio_selected_module();
      if (!selected_module) return;

      this._write_studio_status(`Disabling module ${selected_module}...`);

      await this._send_module_creator_cmd("disable-generated-module", {
        _name: selected_module,
      });

      const runtime_refreshed = await this._refresh_studio_runtime();
      this._write_studio_status(
        runtime_refreshed
          ? `Disabled module ${selected_module}. Runtime refreshed`
          : `Disabled module ${selected_module}. Runtime refresh failed`
      );
    } catch (err) {
      const message = `Disable module failed: ${to_err(err)}`;
      this._write_studio_status(message);
      this._error("studio disable module failed", err);
    }
  }

  async _delete_studio_generated_module() {
    try {
      const selected_module = this._resolve_studio_selected_module({ allow_dev_fallback: false });
      if (!selected_module) return;

      this._write_studio_status(`Deleting module ${selected_module}...`);

      await this._send_module_creator_cmd("delete-generated-module", {
        _name: selected_module,
      });

      const runtime_refreshed = await this._refresh_studio_runtime();
      this._write_studio_status(
        runtime_refreshed
          ? `Deleted module ${selected_module}. Runtime refreshed`
          : `Deleted module ${selected_module}. Runtime refresh failed`
      );
    } catch (err) {
      const message = `Delete module failed: ${to_err(err)}`;
      this._write_studio_status(message);
      this._error("studio delete module failed", err);
    }
  }

  _set_generation_state(state: VibeGenerationState, status: string, error?: any) {
    this._write_generation_state(state, status, error);
    const button_text = this._set_studio_generation_ui(state, status);
    this._vibe_log("generation-status updated", {
      _state: state,
      _status: status,
      _button_text: button_text,
      _generation_id: this._active_generation_id,
    });
  }

  _event_matches_active_generation(evt: Record<string, any>) {
    if (!this._active_generation_id) return false;
    if (evt._app_id !== this._app_id || evt._env !== this._env) return false;

    const event_generation_id = this._get_event_generation_id(evt);

    if (event_generation_id) {
      return event_generation_id === this._active_generation_id;
    }

    if (typeof evt._view_id === "string" && this._active_generation_view_id) {
      return evt._view_id === this._active_generation_view_id;
    }

    return false;
  }

  _get_event_generation_id(evt: Record<string, any>) {
    return typeof evt._generation_id === "string"
      ? evt._generation_id
      : typeof evt._meta?._generation_id === "string"
        ? evt._meta._generation_id
        : "";
  }

  _generation_event_matches(evt: Record<string, any>) {
    const event_generation_id = this._get_event_generation_id(evt);

    if (this._active_generation_id) {
      return event_generation_id === this._active_generation_id;
    }

    const has_app_id = typeof evt._app_id === "string" && evt._app_id.trim();
    const has_env = typeof evt._env === "string" && evt._env.trim();
    if (has_app_id && evt._app_id !== this._app_id) return false;
    if (has_env && evt._env !== this._env) return false;

    const has_app_env_match = Boolean(has_app_id && has_env);
    const view_id = typeof evt._view_id === "string" && evt._view_id.trim() ? evt._view_id.trim() : "";
    const view_matches = view_id === this._app_view_id || view_id === this._current_view_id;

    const matched = has_app_env_match || view_matches;
    if (matched) {
      this._vibe_log("generation event fallback match", {
        _generation_id: event_generation_id,
        _app_id: evt._app_id,
        _env: evt._env,
        _view_id: evt._view_id,
      });
    }

    return matched;
  }

  _start_generation(generation_id: string, view_id: string) {
    this._active_generation_id = generation_id;
    this._active_generation_view_id = view_id;
    _xd.set(_XD_KEYS.STUDIO_GENERATION_ID, generation_id, { source: "vibe-client" });
    this._vibe_log("generation started", {
      _generation_id: generation_id,
      _app_id: this._app_id,
      _env: this._env,
      _view_id: view_id,
    });
    this._set_generation_state("pending", "Preparing generation...");
  }

  _complete_generation_from_update(upd: ServerUpdateEvt) {
    if (!this._event_matches_active_generation(upd as any)) return;
    this._vibe_log("generation completed from xvm:update", {
      _generation_id: this._active_generation_id,
      _view_id: upd._view_id,
    });
    this._active_generation_id = "";
    this._active_generation_view_id = "";
    this._set_generation_state("completed", "Generation complete");
  }

  _fail_generation_from_event(evt: VibeGenerationFailureEvt, source_evt: string, error_payload: any = evt) {
    this._vibe_log("generation-failed received", {
      _source: source_evt,
      _generation_id: this._get_event_generation_id(evt as any),
      _app_id: evt._app_id,
      _env: evt._env,
      _stage: (evt as any)._stage,
      _message: evt._message,
    });

    if (!this._generation_event_matches(evt as any)) {
      this._vibe_log("generation failed ignored", {
        _source: source_evt,
        _generation_id: this._get_event_generation_id(evt as any),
        _active_generation_id: this._active_generation_id,
        _app_id: evt._app_id,
        _env: evt._env,
        _view_id: evt._view_id,
        _current_app_view_id: this._resolve_studio_target_view_id(),
      });
      return;
    }
    const message = this._format_generation_error(evt);
    this._vibe_log("generation failed shown", {
      _source: source_evt,
      _generation_id: this._get_event_generation_id(evt as any) || this._active_generation_id,
      _code: evt._code,
      _message: evt._message,
    });
    this._active_generation_id = "";
    this._active_generation_view_id = "";
    this._set_generation_state("failed", message, error_payload);
  }

  _handle_generation_stage(payload: any) {
    const evt_payload = this._normalize_event_payload(payload);
    if (!is_obj(evt_payload)) return;

    this._vibe_log("generation-stage received", {
      _generation_id: this._get_event_generation_id(evt_payload),
      _app_id: evt_payload._app_id,
      _env: evt_payload._env,
      _stage: evt_payload._stage,
      _message: evt_payload._message,
    });

    if (!this._generation_event_matches(evt_payload)) return;

    const message = this._format_generation_stage_message(evt_payload);
    const stage =
      typeof evt_payload._stage === "string" && evt_payload._stage.trim()
        ? this._normalize_generation_stage(evt_payload._stage)
        : "";
    const next_state: VibeGenerationState =
      stage === "complete" || stage === "completed"
        ? "completed"
        : stage === "failed"
          ? "failed"
          : "running";
    const complete_has_message = typeof evt_payload._message === "string" && evt_payload._message.trim();
    const status = next_state === "completed" && !complete_has_message ? "Generation complete" : message;
    const button_text = next_state === "running"
      ? this._short_generation_status(status)
      : "Go";

    this._vibe_log("generation stage shown", {
      _stage: evt_payload._stage,
      _message: evt_payload._message,
      _status: status,
      _button_text: button_text,
      _generation_id: this._get_event_generation_id(evt_payload),
    });

    if (next_state === "completed") {
      this._active_generation_id = "";
      this._active_generation_view_id = "";
      this._set_generation_state("completed", status);
      return;
    }

    if (next_state === "failed") {
      this._active_generation_id = "";
      this._active_generation_view_id = "";
      this._set_generation_state("failed", status, evt_payload);
      return;
    }

    this._set_generation_state("running", status);
  }

  _send_generation_fire_and_listen(xcmd: any) {
    try {
      const request_id = Wormholes.sendXcmdFireAndListen(xcmd);
      this._vibe_log("generation fire-and-listen started", {
        _generation_id: xcmd?._params?._generation_id,
        _request_id: request_id,
        _op: xcmd?._op,
      });
    } catch (err) {
      if (this._is_timeout_error(err)) {
        this._vibe_log("generation request ack timed out; still listening for events", {
          _generation_id: xcmd?._params?._generation_id,
        });
        this._vibe_log("generation ack timeout ignored", {
          _generation_id: xcmd?._params?._generation_id,
        });
        return;
      }
      throw err;
    }
  }

  _cache_key_view(view_id: string) {
    return `xvm:view:${this._env}:${this._app_id}:${view_id}`;
  }

  _collect_data_sources(node: any, out: Set<string>) {
    if (!node) return;
    if (Array.isArray(node)) {
      node.forEach((n) => this._collect_data_sources(n, out));
      return;
    }
    if (typeof node !== "object") return;
    if (typeof node._data_source === "string" && node._data_source.trim()) {
      out.add(String(node._data_source));
    }
    Object.values(node).forEach((v) => this._collect_data_sources(v as any, out));
  }

  _log_view_payload(view_id: string, view_json: Record<string, any>, source: string) {
    const sources = new Set<string>();
    this._collect_data_sources(view_json, sources);
    const list = Array.from(sources);
    const sample = list.slice(0, 8).reduce((acc, key) => {
      acc[key] = _xd.get(key);
      return acc;
    }, {} as Record<string, any>);
    this._log(`view payload (${source})`, {
      _view_id: view_id,
      _data_sources_count: list.length,
      _data_sources_sample: list.slice(0, 8),
      _data_values_sample: sample,
    });
  }

  _set_connection_status(status: XVMClientConnectionChange["_status"], source?: string) {
    const connected = status === "connected";
    this._connected = connected;
    const payload: XVMClientConnectionChange = {
      _status: status,
      _connected: connected,
      _app_id: this._app_id,
      _env: this._env,
      ...(source ? { _source: source } : {}),
    };
    if (this._on_connection_change) this._on_connection_change(payload);
    _xem.fire(EVT_XVM_CONNECTION, payload);
  }

  _sync_cache_state() {
    // TODO: consider adding a timestamp and/or version to the cache and use it to determine staleness of cached data
    // noop (kept for API parity)
  }

  _set_current_version(version: number) {
    this._current_version = Number.isFinite(version) ? Number(version) : 0;
  }

  _get_version_from_app(app: ServerXVMApp | null | undefined) {
    if (!is_obj(app?._meta)) return 0;
    const raw = (app!._meta as any)._version;
    return Number.isFinite(raw) ? Number(raw) : 0;
  }

  _should_accept_push_version(next_version: number, source: string) {
    if (!Number.isFinite(next_version)) return false;
    if (next_version <= this._current_version) {
      this._log(`ignore stale payload source='${source}' next=${next_version} current=${this._current_version}`);
      return false;
    }
    return true;
  }

  _bump_version_if_newer(next_version: number, source: string) {
    if (!Number.isFinite(next_version)) return;
    if (next_version > this._current_version) {
      this._set_current_version(next_version);
      XDB.saveString(this._cache_key_version, String(next_version));
      return;
    }
    if (next_version < this._current_version) {
      this._log(`older payload version source='${source}' next=${next_version} current=${this._current_version}`);
    }
  }

  _persist_cached_app(app: ServerXVMApp, view_ids: string[], version: number) {
    XDB.saveObject(this._cache_key_app, { _app: app, _view_ids: view_ids });
    XDB.saveString(this._cache_key_version, String(version));
  }

  _persist_cached_view(view_id: string, view: Record<string, any>) {
    XDB.saveObject(this._cache_key_view(view_id), view);
  }

  _read_cached_view(view_id: string): Record<string, any> | null {
    const v = XDB.getObject(this._cache_key_view(view_id));
    return is_obj(v) ? (v as Record<string, any>) : null;
  }

  _normalize_view_ids(view_ids: unknown): string[] {
    if (!Array.isArray(view_ids)) return [];
    return view_ids.filter((v) => typeof v === "string" && v.trim().length > 0).map((v) => String(v));
  }

  _pick_entry_view_id(app: ServerXVMApp | null, view_ids: string[]) {
    const from_meta =
      is_obj(app?._meta) && typeof (app!._meta as any)._entry_view_id === "string"
        ? String((app!._meta as any)._entry_view_id)
        : "";
    if (from_meta) return from_meta;

    const from_start =
      is_obj(app?._config?._start) && typeof (app!._config!._start as any)._view_id === "string"
        ? String((app!._config!._start as any)._view_id)
        : "";
    if (from_start) return from_start;

    return view_ids[0] ?? "";
  }

  async _send_cmd(_op: string, _params: Record<string, any>) {
    const req_id = ++this._cmd_seq;
    this._log(`-> [${req_id}] server-xvm.${_op}`, _params);
    try {
      const raw = await Wormholes.sendXcmd({ _module: "server-xvm", _op, _params });
      this._log(`<- [${req_id}] server-xvm.${_op} raw`, raw);
      const result = to_result(raw);

      if (is_obj(result)) {
        if (_op === "get-app") {
          const app_obj = is_obj((result as any)._app) ? (result as any)._app : {};
          const view_ids = this._normalize_view_ids((result as any)._view_ids);
          const views_obj = is_obj((result as any)._views) ? (result as any)._views : {};
          this._log(`<- [${req_id}] server-xvm.${_op} summary`, {
            _app_id: (app_obj as any)._app_id,
            _env: (app_obj as any)._env,
            _version: (app_obj as any)?._meta?._version,
            _view_ids_count: view_ids.length,
            _views_count: Object.keys(views_obj).length,
          });
        } else if (_op === "get-view") {
          this._log(`<- [${req_id}] server-xvm.${_op} summary`, {
            _app_id: (result as any)._app_id,
            _env: (result as any)._env,
            _version: (result as any)._version,
            _view_id: (result as any)?._view?._id,
          });
        } else {
          this._log(`<- [${req_id}] server-xvm.${_op} result`, result);
        }
      } else {
        this._log(`<- [${req_id}] server-xvm.${_op} result`, result);
      }
      return result;
    } catch (err: any) {
      this._error(`xx [${req_id}] server-xvm.${_op} failed`, to_err(err));
      throw err;
    }
  }

  async _send_module_creator_cmd(_op: string, _params: Record<string, any>) {
    const req_id = ++this._cmd_seq;
    this._log(`-> module-creator.${_op}`, { _req_id: req_id, _params });
    try {
      const raw = await Wormholes.sendXcmd({
        _module: "module-creator",
        _op,
        _params,
      });
      this._log(`<- module-creator.${_op} raw`, { _req_id: req_id, _raw: raw });
      const result = to_result(raw);
      this._log(`<- module-creator.${_op} result`, { _req_id: req_id, _result: result });
      return result;
    } catch (err: any) {
      this._error(`xx [${req_id}] module-creator.${_op} failed`, to_err(err));
      throw err;
    }
  }

  async _wait_for_wormhole_open() {
    if (Wormholes._ready || this._connected) {
      this._log("wormhole already connected");
      return;
    }
    this._log("waiting for wormhole-open...");
    await new Promise<void>((resolve, reject) => {
      let done = false;
      const finish = (fn: () => void) => {
        if (done) return;
        done = true;
        fn();
      };
      _xem.on("wormhole-open", () => {
        this._log("wormhole-open received");
        finish(resolve);
      });
      _xem.on("wormhole-error", (err: any) => {
        this._error("wormhole-error while waiting", to_err(err));
        finish(() => reject(new Error(to_err(err))));
      });
      _xem.on("wormhole-close", () => {
        this._error("wormhole-close while waiting");
        finish(() => reject(new Error("Wormhole closed before server-xvm bootstrap")));
      });
    });
  }

  _ensure_connected() {
    if (Wormholes._ready || this._connected) {
      this._set_connection_status("connected", "ready");
      return;
    }

    if (!this._wormhole_url) throw new Error("Missing wormhole URL");

    Wormholes.open({
      _url: this._wormhole_url,
      _auto_reconnect: true,
      _hello_payload: { _client: "xvm-client", _app: this._app_id },
    });
    this._log(`wormhole open requested url='${this._wormhole_url}'`);
    this._set_connection_status("connecting", "open");
  }

  _resolve_region(): string {
    const router_region =
      is_obj(this._app?._config?._router) && typeof this._app?._config?._router?._region === "string"
        ? this._app!._config!._router!._region
        : "";
    if (router_region) return router_region;
    if (this._region_override) return this._region_override;
    return DEFAULT_REGION;
  }

  _resolve_container_id(region: string): string {
    if (region === DEFAULT_REGION) return DEFAULT_CONTAINER_ID;
    return region;
  }

  _create_offline_app(message: string): XVMApp {
    const region = this._resolve_region();
    const container_id = this._resolve_container_id(region);
    return {
      _player: { _id: "xplayer", _set_as_main_player: true },
      _containers: [{ _id: container_id }],
      _regions: [{ _id: region, _container_id: container_id }],
      _views: {
        "view-server-offline": {
          _type: "view",
          _id: "view-server-offline",
          class: "screen",
          _children: [
            { _type: "label", class: "screen-title", _text: "Server views unavailable" },
            { _type: "label", class: "screen-sub", _text: message },
          ],
        },
      },
      _router: { _region: region, _fallback_view_id: "view-server-offline" },
      _start: { _view_id: "view-server-offline", _region: region },
    };
  }

  _build_runtime_app(): XVMApp {
    if (!this._app) throw new Error("Server app metadata missing");

    const config = is_obj(this._app._config) ? this._app._config : {};
    const views = Object.fromEntries(this._views_cache.entries());

    const fallback_view_id =
      (is_obj(config._router) &&
        typeof config._router._fallback_view_id === "string" &&
        config._router._fallback_view_id) ||
      this._fallback_view_id ||
      this._current_view_id ||
      Object.keys(views)[0];

    const region =
      (is_obj(config._router) &&
        typeof config._router._region === "string" &&
        config._router._region) ||
      this._region_override ||
      DEFAULT_REGION;

    const default_container_id = this._resolve_container_id(region);

    const studio_shell_view = {
      _type: "view",
      _id: "xvibe-shell",
      class: "xvibe-shell",
      _children: [
        { _type: "view", _id: default_container_id, class: "xvibe-main" },
        { _type: "view", _id: "region-studio", class: "xvibe-studio" }
      ]
    };



    const base_app: XVMApp = {
      _player: is_obj((config as any)._player)
        ? (config as any)._player
        : {
          _id: "xplayer",
          _set_as_main_player: true,
        },

      _shell: (config as any)._shell,

      _theme: this._theme ?? (this._app as any)?._theme,

      _containers: Array.isArray((config as any)._containers)
        ? (config as any)._containers
        : [{ _id: default_container_id }],

      _regions: Array.isArray((config as any)._regions)
        ? (config as any)._regions
        : [{ _id: region, _container_id: default_container_id }],

      _views: views,

      _router: is_obj((config as any)._router)
        ? (config as any)._router
        : {
          _region: region,
          _fallback_view_id: fallback_view_id,
        },

      _start: is_obj((config as any)._start)
        ? (config as any)._start
        : {
          _view_id: fallback_view_id,
          _region: region,
        },
    };

    const can_edit = true; // V1, later from permission/session/app meta.

    if (!can_edit) {
      return base_app;
    }

    return {
      ...base_app,

      _shell: studio_shell_view,

      _containers: [
        { _id: default_container_id },
        { _id: "region-studio" },
      ],

      _regions: [
        {
          _id: region,
          _container_id: default_container_id,
        },
        {
          _id: "studio",
          _container_id: "region-studio",
          _hash_sync: false,
        },
      ],

      _views: {
        ...views,
        "xstudio-editor": studio_editor_view,
      },

      _router: {
        ...(is_obj(base_app._router) ? base_app._router : {}),
        _region: region,
        _fallback_view_id: fallback_view_id,
      },

      _start: {
        ...(is_obj(base_app._start) ? base_app._start : {}),
        _view_id: fallback_view_id,
        _region: region,
      },
    } as XVMApp;
  }

  _sync_views_to_xvm() {
    const entries = Array.from(this._views_cache.entries());
    if (entries.length === 0) return;
    for (const [view_id, view_json] of entries) {
      if (!is_obj(view_json)) continue;
      const raw_view = typeof (view_json as any)._id === "string" ? view_json : { ...view_json, _id: view_id };
      (XVM as any).registerRawView(raw_view);
    }
    this._app_needs_refresh = false;
    this._log("xvm raw views synced", { _count: entries.length });
  }

  setTheme(theme: string | Record<string, string>) {
    this._theme = theme;
    XUI.applyTheme(theme);
  }

  async _ensure_view(view_id: string) {
    if (this._views_cache.has(view_id)) return;

    const cached_view = this._read_cached_view(view_id);
    if (cached_view) {
      this._views_cache.set(view_id, cached_view);
      this._known_view_ids.add(view_id);
      this._sync_cache_state();
      this._app_needs_refresh = true;
      return;
    }

    const out = (await this._send_cmd("get-view", { _app_id: this._app_id, _env: this._env, _view_id: view_id })) as ServerGetViewRes;
    if (!is_obj(out) || !is_obj(out._view)) {
      throw new Error(`Invalid get-view response for '${view_id}'`);
    }
    const next_version = Number.isFinite(out._version) ? Number(out._version) : this._current_version;
    this._bump_version_if_newer(next_version, "get-view");
    this._views_cache.set(view_id, out._view);
    this._known_view_ids.add(view_id);
    this._persist_cached_view(view_id, out._view);
    this._sync_cache_state();
    this._app_needs_refresh = true;
    this._log_view_payload(view_id, out._view, "get-view");
  }

  async _fetch_view_from_server(view_id: string, source: string) {
    const out = (await this._send_cmd("get-view", { _app_id: this._app_id, _env: this._env, _view_id: view_id })) as ServerGetViewRes;
    if (!is_obj(out) || !is_obj(out._view)) {
      throw new Error(`Invalid ${source} response for '${view_id}'`);
    }

    const next_version = Number.isFinite(out._version) ? Number(out._version) : this._current_version;
    this._bump_version_if_newer(next_version, source);

    this._views_cache.set(view_id, out._view);
    this._known_view_ids.add(view_id);
    this._persist_cached_view(view_id, out._view);
    this._sync_cache_state();
    this._app_needs_refresh = true;
    this._log_view_payload(view_id, out._view, source);
  }

  async _hydrate_all_views_from_server(source: string) {
    const params: any = {
      _env: this._env,
      _include_views: false,
      _include_flows: true,
    };

    if (
      typeof this._app_id === "string" &&
      this._app_id.trim().length > 0
    ) {
      params._app_id = this._app_id;
    }

    const out = (await this._send_cmd(
      "get-app",
      params
    )) as ServerGetAppRes;

    if (!is_obj(out) || !is_obj(out._app)) {
      throw new Error(`Invalid ${source} get-app(include_views=true) response`);
    }

    this._app = out._app as ServerXVMApp;

    const next_version = this._get_version_from_app(this._app);
    this._bump_version_if_newer(next_version, source);

    const view_ids = this._normalize_view_ids(out._view_ids);
    this._persist_cached_app(this._app, view_ids, next_version);
    this._known_view_ids.clear();
    view_ids.forEach((v) => this._known_view_ids.add(v));

    const views_obj = is_obj(out._views) ? out._views : {};
    for (const [view_id, view_json] of Object.entries(views_obj)) {
      if (!is_obj(view_json)) continue;
      this._views_cache.set(view_id, view_json);
      this._known_view_ids.add(view_id);
      this._persist_cached_view(view_id, view_json);
      this._log_view_payload(view_id, view_json, source);
    }

    this._sync_cache_state();
    this._app_needs_refresh = true;
  }

  async _mount_runtime_app() {
    const runtime_app = this._build_runtime_app();
    const region = this._resolve_region();
    const player_id =
      is_obj((runtime_app as any)._player) && typeof (runtime_app as any)._player._id === "string"
        ? String((runtime_app as any)._player._id)
        : "xplayer";
    const regions_summary = Array.isArray(runtime_app._regions)
      ? runtime_app._regions.map((r: any) => ({
        _id: r?._id,
        _container_id: r?._container_id,
      }))
      : [];

    this._log("mount_runtime_app:before", {
      _region: region,
      _views_cache_size: this._views_cache.size,
      _current_view_id: this._current_view_id,
      _regions: regions_summary,
    });
    if (typeof document !== "undefined") {
      const existing_players = Array.from(document.querySelectorAll(`#${player_id}`));
      if (existing_players.length > 0) {
        existing_players.forEach((el) => el.parentElement?.removeChild(el));
        this._log("mount_runtime_app:cleared_player", { _player_id: player_id, _count: existing_players.length });
      }
    }
    await XVM.app(runtime_app as any);
    this._app_mounted = true;
    this._app_needs_refresh = false;
    this._log("mount_runtime_app:after", {
      _region: region,
      _views_cache_size: this._views_cache.size,
      _current_view_id: this._current_view_id,
    });
    if (this._on_app_mounted) {
      this._on_app_mounted({ _app_id: this._app_id, _env: this._env, _region: region });
    }
  }

  async _navigate_view(view_id: string, region: string) {
    this._log("navigate:try", { _signature: "positional", _view_id: view_id, _region: region });
    try {
      await (XVM as any).navigate(view_id, { _region: region });
      this._log("navigate:ok", { _signature: "positional", _view_id: view_id, _region: region });
    } catch (err: any) {
      this._error("navigate:failed", {
        _signature: "positional",
        _view_id: view_id,
        _region: region,
        _error: to_err(err),
      });
      throw err;
    }
  }

  async render_view(view_id: string) {
    if (!view_id) return;
    await this._ensure_view(view_id);

    if (!this._app_mounted) {
      await this._mount_runtime_app();
    } else if (this._app_needs_refresh) {
      this._sync_views_to_xvm();
    }

    const region = this._resolve_region();
    try {
      await this._navigate_view(view_id, region);
    } catch (err) {
      this._error(`navigate failed for '${view_id}', hydrating all views`, to_err(err));
      await this._hydrate_all_views_from_server("navigate-recovery");
      await this._mount_runtime_app();
      await this._navigate_view(view_id, region);
    }
    this._current_view_id = view_id;
    if (region !== "studio") {
      this._app_view_id = view_id;
      this._log("app view tracked", { _view_id: view_id, _region: region });
    }
    this._has_rendered_view = true;
    if (this._on_view_rendered) this._on_view_rendered(view_id);
    await _xem.fire(EVT_XVM_VIEW_RENDERED, { _view_id: view_id, _app_id: this._app_id, _env: this._env });
  }

  async _render_cached_boot_view() {
    const cached_app_wrap = XDB.getObject(this._cache_key_app);
    if (!is_obj(cached_app_wrap) || !is_obj((cached_app_wrap as any)._app)) {
      this._log("boot cache miss");
      return false;
    }

    const cached_app = (cached_app_wrap as any)._app as ServerXVMApp;
    const cached_view_ids = this._normalize_view_ids((cached_app_wrap as any)._view_ids);
    const cached_version_raw = XDB.getString(this._cache_key_version);
    const cached_version = Number.isFinite(Number(cached_version_raw))
      ? Number(cached_version_raw)
      : this._get_version_from_app(cached_app);
    const cached_entry = this._pick_entry_view_id(cached_app, cached_view_ids);
    const cached_entry_view = cached_entry ? this._read_cached_view(cached_entry) : null;

    if (!cached_entry || !cached_entry_view) {
      this._log("boot cache partial: app found, entry view missing");
      return false;
    }

    this._app = cached_app;
    this._known_view_ids.clear();
    cached_view_ids.forEach((v) => this._known_view_ids.add(v));
    this._views_cache.clear();
    this._views_cache.set(cached_entry, cached_entry_view);
    this._sync_cache_state();
    this._set_current_version(cached_version);
    this._log(`boot cache hit entry='${cached_entry}' version=${cached_version}`);
    await this.render_view(cached_entry);
    return true;
  }

  _apply_server_get_app(res: ServerGetAppRes) {
    if (!is_obj(res) || !is_obj(res._app)) {
      throw new Error("Invalid get-app response");
    }

    const next_app = res._app as ServerXVMApp;
    const next_version = this._get_version_from_app(next_app);
    const next_view_ids = this._normalize_view_ids(res._view_ids);

    this._app = next_app;
    this._known_view_ids.clear();
    next_view_ids.forEach((v) => this._known_view_ids.add(v));
    this._flows.clear();

    if (res._flows && typeof res._flows === "object") {
      for (const key of Object.keys(res._flows)) {
        this._flows.set(
          key,
          res._flows[key]
        );
      }
    }
    this._bump_version_if_newer(next_version, "get-app");
    this._persist_cached_app(this._app, next_view_ids, next_version);
    this._app_needs_refresh = true;
    return {
      _accepted: true,
      _version: next_version,
      _view_ids: next_view_ids,
    };
  }

  async _apply_server_view_payload(res: ServerGetViewRes, source: string) {
    if (!is_obj(res) || !is_obj(res._view) || typeof (res as any)._view._id !== "string") {
      throw new Error(`Invalid ${source} response`);
    }

    const view_id = String((res as any)._view._id);
    const next_version = Number.isFinite(res._version) ? Number(res._version) : this._current_version;
    this._views_cache.set(view_id, res._view);
    this._known_view_ids.add(view_id);
    this._persist_cached_view(view_id, res._view);
    this._sync_cache_state();
    this._app_needs_refresh = true;

    this._bump_version_if_newer(next_version, source);

    return { _accepted: true, _view_id: view_id, _version: next_version };
  }

  _bind_events() {
    if (this._bound) return;
    this._bound = true;

    _xem.on("wormhole-open", () => {
      this._set_connection_status("connected", "wormhole-open");
    });

    _xem.on("wormhole-close", () => {
      this._set_connection_status("disconnected", "wormhole-close");
    });

    _xem.on("wormhole-error", () => {
      this._set_connection_status("error", "wormhole-error");
    });

    const handle_update = async (payload: any, source_evt: string) => {
      try {
        const evt_payload = this._normalize_event_payload(payload);

        if (!is_obj(evt_payload)) return;

        if (evt_payload._app_id !== this._app_id || evt_payload._env !== this._env) return;
        if (typeof evt_payload._view_id !== "string" || !is_obj(evt_payload._view)) return;

        const upd = evt_payload as ServerUpdateEvt;

        const next_version = Number.isFinite(upd._version) ? Number(upd._version) : 0;

        if (next_version > 0 && !this._should_accept_push_version(next_version, source_evt)) {
          return;
        }

        // 🔥 update cache
        this._views_cache.set(upd._view_id, upd._view);
        this._known_view_ids.add(upd._view_id);
        this._persist_cached_view(upd._view_id, upd._view);
        this._sync_cache_state();

        // 🔥 version
        if (next_version > 0) {
          this._set_current_version(next_version);
          XDB.saveString(this._cache_key_version, String(next_version));
        }

        this._complete_generation_from_update(upd);

        this._log(
          `update applied source='${source_evt}' view='${upd._view_id}' version=${next_version || this._current_version} active='${this._current_view_id}'`
        );

        if (this._current_view_id === upd._view_id || this._app_view_id === upd._view_id) {
          const live_obj = XUI.getObject(upd._view_id) as any;

          if (live_obj && typeof live_obj.update === "function") {
            this._log("live view update via XUIObject.update", {
              _view_id: upd._view_id,
              _version: next_version || this._current_version,
            });

            live_obj.update(upd._view);
            (XVM as any).registerRawView?.(upd._view);
            this._app_needs_refresh = false;
            this._current_view_id = upd._view_id;
            this._app_view_id = upd._view_id;

            if (this._on_view_rendered) this._on_view_rendered(upd._view_id);
            await _xem.fire(EVT_XVM_VIEW_RENDERED, {
              _view_id: upd._view_id,
              _app_id: this._app_id,
              _env: this._env,
            });
            return;
          }

          this._log("live view update fallback rerender", {
            _view_id: upd._view_id,
            _version: next_version || this._current_version,
          });
          (XVM as any).registerRawView?.(upd._view);
          this._app_needs_refresh = true;
          await this.render_view(upd._view_id);
        }
      } catch (err) {
        this._error("update handler failed", err);
      }
    };

    /* 🔥 NEW EVENT */
    _xem.on("xvm:update", (payload: any) => handle_update(payload, "xvm:update"));

    _xem.on(EVT_VIBE_GENERATION_STAGE, (payload: any) => {
      this._handle_generation_stage(payload);
    });

    const handle_generation_failure = (payload: any, source_evt: string) => {
      const evt_payload = this._normalize_event_payload(payload);
      if (!is_obj(evt_payload)) return;
      this._fail_generation_from_event(evt_payload as VibeGenerationFailureEvt, source_evt);
    };

    _xem.on(EVT_VIBE_GENERATION_FAILED, (payload: any) => {
      handle_generation_failure(payload, EVT_VIBE_GENERATION_FAILED);
    });
    _xem.on(EVT_XVIBE_ERROR, (payload: any) => {
      handle_generation_failure(payload, EVT_XVIBE_ERROR);
    });
    _xem.on(EVT_COMMAND_ERROR, (payload: any) => {
      handle_generation_failure(payload, EVT_COMMAND_ERROR);
    });

    _xem.on("studio:runtime-refresh", async () => {
      await this._refresh_studio_runtime();
    });

    _xem.on("studio:load-current-view", async () => {
      await this._load_studio_current_view_json();
    });

    _xem.on("studio:save-view", async () => {
      await this._save_studio_view_json();
    });

    _xem.on("studio:load-module", async () => {
      await this._load_studio_generated_module_source();
    });

    _xem.on("studio:save-module", async () => {
      await this._save_studio_generated_module_source();
    });

    _xem.on("studio:repair-module", async () => {
      await this._repair_studio_generated_module();
    });

    _xem.on("studio:disable-module", async () => {
      await this._disable_studio_generated_module();
    });

    _xem.on("studio:delete-module", async () => {
      await this._delete_studio_generated_module();
    });

    _xem.on("studio:preview-request", async () => {
      try {
        const prompt = String(_xd.get("studio:prompt") ?? "").trim();

        if (!prompt) {
          this._log("studio preview ignored: empty prompt");
          return;
        }

        const app_id = this.getActiveAppId();
        const env = this.getActiveEnv();
        const current_view_id = this._current_view_id === "xstudio-editor" ? "" : this._current_view_id;
        const view_id = this._app_view_id || current_view_id || "main";

        if (!app_id || !view_id) {
          this._error("studio preview failed: missing app_id or view_id", { _app_id: app_id, _view_id: view_id });
          return;
        }

        this._log("studio preview target", { _view_id: view_id });
        this._log("studio preview request");

        const generation_id = _xu.guid();
        this._start_generation(generation_id, view_id);

        this._send_generation_fire_and_listen({
          _module: "xvibe",
          _op: "generate-view",
          _params: {
            _mode: "refine",
            _app_id: app_id,
            _env: env,
            _view_id: view_id,
            _prompt: prompt,
            _generation_id: generation_id,
          },
        });
        this._set_generation_state("running", "Preparing generation...");
      } catch (err) {
        if (this._is_timeout_error(err)) {
          this._vibe_log("generation request ack timed out; still listening for events", {
            _generation_id: this._active_generation_id,
          });
          this._vibe_log("generation ack timeout ignored", {
            _generation_id: this._active_generation_id,
          });
          return;
        }
        this._active_generation_id = "";
        this._active_generation_view_id = "";
        this._set_generation_state("failed", to_err(err), err);
        this._error("studio preview failed", err);
      }
    });

    _xem.on("studio:apply-request", () => {
      this._log("studio apply ignored: preview already persists in V1");
    });

    _xem.on("studio:close", async () => {
      try {
        await (XVM as any).close?.({ region: "studio" });
        const shell = XUI.getObject("xvibe-shell") as any;
        shell?.removeClass?.("xstudio-open");
        this._log("studio closed");
      } catch (err) {
        this._error("studio close failed", err);
      }
    });

  }

  async bootstrap() {
    this._bind_events();
    const used_cache = await this._render_cached_boot_view();

    try {
      this._ensure_connected();
      await this._wait_for_wormhole_open();

      const params: any = {
        _env: this._env,
        _include_views: false,
        _include_flows: true,
      };

      if (
        typeof this._app_id === "string" &&
        this._app_id.trim().length > 0
      ) {
        params._app_id = this._app_id;
      }

      const out = (await this._send_cmd(
        "get-app",
        params
      )) as ServerGetAppRes;
      const app_apply = this._apply_server_get_app(out);

      const entry = this._pick_entry_view_id(this._app, app_apply._view_ids);

      if (!entry) {
        throw new Error("Server app has no entry view");
      }

      const ordered_view_ids = [entry, ...app_apply._view_ids.filter((v) => v !== entry)];
      this._log("bootstrap hydrate views", {
        _count: ordered_view_ids.length,
        _entry: entry,
      });
      for (const view_id of ordered_view_ids) {
        await this._fetch_view_from_server(view_id, "bootstrap-hydrate");
      }
      const entry_apply = { _accepted: true };

      if (entry_apply._accepted || this._current_view_id !== entry) {
        await this.render_view(entry);
      }

      await this._send_cmd("subscribe", { _app_id: this._app_id, _env: this._env });
      this._set_connection_status("connected", "subscribe");
      this._log(
        `boot complete cache=${used_cache ? "yes" : "no"} server_version=${app_apply._version || 0} current=${this._current_version} entry='${entry}'`
      );
    } catch (err) {
      const msg = to_err(err);
      this._set_connection_status("error", "bootstrap");
      this._error(msg);
      if (this._on_error) this._on_error(err);
      if (!this._has_rendered_view) {
        await XVM.app(this._create_offline_app(msg) as any);
      } else {
        this._log("offline: using cached rendered view");
      }
    }
  }

  get_view(view_id: string): Record<string, any> | null {
    if (!view_id) return null;
    return this._views_cache.get(view_id) ?? null;
  }

  get_current_view(): Record<string, any> | null {
    if (!this._current_view_id) return null;
    return this.get_view(this._current_view_id);
  }

  async sendXcmd(xcmd: any) {
    return await Wormholes.sendXcmd(xcmd);
  }
}

export default XVMClient;
