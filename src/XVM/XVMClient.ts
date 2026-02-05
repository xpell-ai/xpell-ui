import { _xd, _xlog } from "@xpell/core";

import { _xem } from "../XEM/XEventManager";
import Wormholes from "../Wormholes/Wormholes";
import { XDB } from "../XDB/XDB";
import { XVM, type XVMApp } from "./XVM";

const LOG = "[xvm-client]";
const DEFAULT_REGION = "main";
const DEFAULT_CONTAINER_ID = "region-main";

const EVT_SERVER_XVM_UPDATE = "server-xvm:update";
const EVT_XVM_VIEW_RENDERED = "xvm:view-rendered";
const EVT_XVM_CONNECTION = "xvm:connection-change";

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
};

type ServerGetViewRes = {
  _app_id: string;
  _env: string;
  _version?: number;
  _view: Record<string, any>;
};

type ServerUpdateEvt = {
  _app_id: string;
  _env: string;
  _view_id: string;
  _version?: number;
  _view: Record<string, any>;
};

export type XVMClientConnectionChange = {
  _status: "connected" | "disconnected" | "error" | "connecting";
  _connected: boolean;
  _app_id: string;
  _env: string;
  _source?: string;
};

export type XVMClientOptions = {
  app_id: string;
  env: string;
  wormhole_url: string;
  region?: string;
  fallback_view_id?: string;
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
    return raw._result;
  }

  if (is_obj(raw) && is_obj(raw._payload) && typeof raw._payload._ok === "boolean") {
    if (raw._payload._ok !== true) throw new Error(to_err(raw._payload._result ?? raw._payload));
    return raw._payload._result;
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
  _known_view_ids: Set<string> = new Set();
  _cmd_seq = 0;
  _app: ServerXVMApp | null = null;
  _current_view_id = "";
  _current_version = 0;
  _bound = false;
  _app_mounted = false;
  _has_rendered_view = false;
  _app_needs_refresh = false;
  _connected = false;

  _cache_key_app: string;
  _cache_key_version: string;

  constructor(opts: XVMClientOptions) {
    this._app_id = opts.app_id;
    this._env = opts.env;
    this._wormhole_url = opts.wormhole_url;
    this._region_override = typeof opts.region === "string" && opts.region.trim() ? opts.region.trim() : undefined;
    this._fallback_view_id =
      typeof opts.fallback_view_id === "string" && opts.fallback_view_id.trim() ? opts.fallback_view_id.trim() : undefined;
    this._on_view_rendered = typeof opts.onViewRendered === "function" ? opts.onViewRendered : undefined;
    this._on_connection_change = typeof opts.onConnectionChange === "function" ? opts.onConnectionChange : undefined;
    this._on_error = typeof opts.onError === "function" ? opts.onError : undefined;
    this._on_app_mounted = typeof opts.onAppMounted === "function" ? opts.onAppMounted : undefined;

    this._cache_key_app = `xvm:last_app:${this._env}:${this._app_id}`;
    this._cache_key_version = `xvm:version:${this._env}:${this._app_id}`;
  }

  get_current_view_id(): string {
    return this._current_view_id;
  }

  _log(...args: any[]) {
    _xlog.log(LOG, ...args);
  }

  _error(...args: any[]) {
    _xlog.error(LOG, ...args);
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
      (is_obj(config._router) && typeof config._router._fallback_view_id === "string" && config._router._fallback_view_id) ||
      this._fallback_view_id ||
      this._current_view_id ||
      Object.keys(views)[0];
    const region =
      (is_obj(config._router) && typeof config._router._region === "string" && config._router._region) ||
      this._region_override ||
      DEFAULT_REGION;
    const default_container_id = this._resolve_container_id(region);

    return {
      _player: is_obj((config as any)._player) ? (config as any)._player : { _id: "xplayer", _set_as_main_player: true },
      _shell: (config as any)._shell,
      _containers: Array.isArray((config as any)._containers) ? (config as any)._containers : [{ _id: default_container_id }],
      _regions: Array.isArray((config as any)._regions)
        ? (config as any)._regions
        : [{ _id: region, _container_id: default_container_id }],
      _views: views,
      _router: is_obj((config as any)._router) ? (config as any)._router : { _region: region, _fallback_view_id: fallback_view_id },
      _start: is_obj((config as any)._start)
        ? (config as any)._start
        : { _view_id: fallback_view_id, _region: region },
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
    const out = (await this._send_cmd("get-app", {
      _app_id: this._app_id,
      _env: this._env,
      _include_views: true,
    })) as any;

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

    _xem.on(EVT_SERVER_XVM_UPDATE, async (payload: any) => {
      const evt_payload =
        is_obj(payload) && Array.isArray((payload as any)._args) && is_obj((payload as any)._args[0])
          ? (payload as any)._args[0]
          : payload;
      if (!is_obj(evt_payload)) return;
      if (evt_payload._app_id !== this._app_id || evt_payload._env !== this._env) return;
      if (typeof evt_payload._view_id !== "string" || !is_obj(evt_payload._view)) return;

      const upd = evt_payload as ServerUpdateEvt;
      const next_version = Number.isFinite(upd._version) ? Number(upd._version) : 0;
      if (next_version > 0 && !this._should_accept_push_version(next_version, EVT_SERVER_XVM_UPDATE)) {
        return;
      }

      this._views_cache.set(upd._view_id, upd._view);
      this._known_view_ids.add(upd._view_id);
      this._persist_cached_view(upd._view_id, upd._view);
      this._sync_cache_state();
      this._app_needs_refresh = true;

      if (next_version > 0) {
        this._set_current_version(next_version);
        XDB.saveString(this._cache_key_version, String(next_version));
      }
      this._log(
        `update applied view='${upd._view_id}' version=${next_version || this._current_version} active='${this._current_view_id}'`
      );

      if (this._current_view_id === upd._view_id) {
        try {
          await this.render_view(upd._view_id);
        } catch (err) {
          this._error("hot reload failed", err);
        }
      }
    });
  }

  async bootstrap() {
    this._bind_events();
    const used_cache = await this._render_cached_boot_view();

    try {
      this._ensure_connected();
      await this._wait_for_wormhole_open();

      const out = (await this._send_cmd("get-app", {
        _app_id: this._app_id,
        _env: this._env,
        _include_views: false,
      })) as ServerGetAppRes;
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
}

export default XVMClient;
