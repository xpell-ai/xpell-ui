import {
  XModule,
  XLogger as _xlog,
  _xd,
  type XCommand,
  type XpellSkill,
  type XpellSkillCommand,
} from "@xpell/core";

import { XUI } from "../XUI/XUI";
import { _xem } from "../XEM/XEventManager";

type VibeSystemClientRuntime = {
  _env?: string;
  _wormhole_url?: string;
  isServerReady?(): boolean;
  isWormholeReady?(): boolean;
  load_server_app?(app_id: string, env?: string, opts?: Record<string, any>): Promise<any>;
  sendXcmd(xcmd: any, timeoutMs?: number): Promise<any>;
};

type VibeSystemMCPTokenState = {
  _token: string;
  _expires_at_ms: number;
};

type VibeSystemMCPStatusState = "unknown" | "connecting" | "enabled" | "disabled";
type VibeSystemImportStatus = "idle" | "uploading" | "uploaded" | "inspecting" | "ready" | "importing" | "completed" | "failed";
type VibeSystemImportState = {
  _open: boolean;
  _status: VibeSystemImportStatus;
  _file_name: string;
  _file_size: number | null;
  _package_ref: string;
  _inspect: Record<string, any> | null;
  _preview: Record<string, any> | null;
  _error: string;
};
type VibeSystemSelectedApp = {
  _app_id: string;
  _env: string;
};

const DEFAULT_ENV = "default";
const XAPP_CONTENT_TYPE = "application/vnd.xpell.xapp+zip";
const DEFAULT_SERVER_APP_SELECT_ID = "default-server-app-select";
const DEFAULT_SERVER_APP_STATUS_ID = "default-server-app-status";
const APP_ACTIONS_MODAL_ID = "app-actions-modal";
const APP_ACTIONS_SELECTED_LABEL_ID = "app-actions-selected-label";
const APP_ACTIONS_STATUS_LABEL_ID = "app-actions-status-label";
const IMPORT_MODAL_ID = "import-app-modal";
const IMPORT_FILE_ID = "import-app-file";
const MCP_TOKEN_ENV_VAR = "XPELL_MCP_TOKEN";
const MCP_TOKEN_HTTP_PATH = "/xauth/mcp-token";
const MCP_TOKEN_COMMAND_TIMEOUT_MS = 20000;
const MCP_EXPIRED_STATUS = "Token expired";
const MCP_CONNECTING_STATUS = "● Checking";
const MCP_STATUS_UNAVAILABLE_HELP = "MCP status is unavailable until the server connection is ready.";
const MCP_LIFECYCLE_OWNER = "vibe-system:mcp-access";
const EVT_XVM_CONNECTION = "xvm:connection-change";
const EVT_XVM_SERVER_SUBSCRIPTION_READY = "xvm:server-subscription-ready";

const is_record = (value: unknown): value is Record<string, any> =>
  Boolean(value && typeof value === "object" && !Array.isArray(value));

const empty_import_state = (): VibeSystemImportState => ({
  _open: false,
  _status: "idle",
  _file_name: "",
  _file_size: null,
  _package_ref: "",
  _inspect: null,
  _preview: null,
  _error: "",
});

const file_size_label = (size: number | null) => {
  if (typeof size !== "number" || !Number.isFinite(size) || size < 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  let value = size;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return unit === 0 ? `${value} ${units[unit]}` : `${value.toFixed(value >= 10 ? 1 : 2)} ${units[unit]}`;
};

const change_items = (changes: any, group: string, kind: string): string[] => {
  const values = changes?.[group]?.[kind];
  return Array.isArray(values) ? values.map(String).filter(Boolean) : [];
};

const has_replace_changes = (preview: any) => {
  const changes = preview?._changes;
  return ["_views", "_flows", "_entities", "_public_files"].some((group) =>
    change_items(changes, group, "_modified").length > 0 ||
    change_items(changes, group, "_deleted").length > 0
  );
};

const manifest_files = (manifest: any): any[] =>
  Array.isArray(manifest?._content?._files) ? manifest._content._files : [];

const manifest_count = (manifest: any, kinds: string[]) => {
  const wanted = new Set(kinds);
  return manifest_files(manifest).filter((file) => wanted.has(String(file?._kind ?? ""))).length;
};

const package_ref_from_result = (result: any) => {
  for (const value of [result?._package_ref, result?._package_reference, result?._ref]) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
};

const download_url_from_result = (result: any) => {
  for (const value of [result?._download_url, result?._download?._url, result?._url]) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
};

const expected_size_from_result = (result: any) => {
  for (const value of [result?._size, result?._download?._size, result?._content_length]) {
    if (typeof value === "number" && Number.isFinite(value) && value >= 0) return value;
  }
  return null;
};

const safe_xapp_filename = (app_id: string) => {
  const clean = app_id.trim().replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return `${clean || "app"}.xapp`;
};

const is_zip_bytes = (bytes: Uint8Array) => {
  if (bytes.length < 4) return false;
  if (bytes[0] !== 0x50 || bytes[1] !== 0x4b) return false;
  const signature = bytes[2] << 8 | bytes[3];
  return signature === 0x0304 || signature === 0x0506 || signature === 0x0708;
};

const blob_part_from_bytes = (bytes: Uint8Array): BlobPart =>
  bytes.slice();

const find_file = (args: any[]): File | null => {
  for (const arg of args) {
    const files =
      arg?.target?.files ??
      arg?.currentTarget?.files ??
      arg?._event_target?.files ??
      arg?._event?.target?.files ??
      arg?.files ??
      arg?._files;
    if (files?.[0]) return files[0] as File;
  }
  return null;
};

const safe_error_message = (err: unknown) => {
  if (err instanceof Error) return err.message;
  if (is_record(err)) {
    const message = typeof err._message === "string"
      ? err._message
      : typeof err.message === "string"
        ? err.message
        : typeof err._error === "string"
          ? err._error
          : "";
    if (message) return message;
  }
  return "Unknown error";
};

const safe_display_message = (err: unknown) => {
  const message = safe_error_message(err)
    .replace(/[A-Za-z0-9_-]+?\.[A-Za-z0-9_-]+?\.[A-Za-z0-9_-]+/gu, "[redacted]")
    .replace(/Bearer\s+\S+/giu, "Bearer [redacted]")
    .replace(/\/(?:Users|private|var|tmp|Volumes)\/[^\s"'<>]+/gu, "[redacted-path]")
    .replace(/[A-Z]:\\[^\s"'<>]+/gu, "[redacted-path]")
    .trim();

  return message.slice(0, 160) || "Unknown error";
};

const unwrap_result = (raw: any) => {
  let current = raw;

  for (let depth = 0; depth < 8; depth += 1) {
    if (!is_record(current)) return current;

    if (current._ok === false) {
      throw new Error(safe_error_message(current._error ?? current._result ?? current));
    }

    if (is_record(current._payload)) {
      if (current._payload._ok === false) {
        throw new Error(safe_error_message(current._payload._error ?? current._payload._result ?? current._payload));
      }
      current = "_result" in current._payload ? current._payload._result : current._payload;
      continue;
    }

    if ("_result" in current && !("_mcp" in current) && !("_enabled" in current)) {
      current = current._result;
      continue;
    }

    return current;
  }

  return current;
};

export class VibeSystemModule extends XModule {
  static _name = "vibe-system";

  static _skill: XpellSkill = {
    _id: "vibe-system",
    _title: "VIBE System Client",
    _version: "1.0.0",
    _active: true,
    _type: "client-module-api",
    _requires: ["xmodule", "xui", "xvm"],
    _description:
      "Client-side actions for the authenticated VIBE system admin app.",
    _core_rules: [
      "Keep admin-only actions behind authenticated server commands.",
      "Do not persist generated MCP bearer tokens.",
      "Do not log generated MCP bearer tokens.",
    ],
  };

  static _ops: Record<string, XpellSkillCommand> = {
    "refresh-apps": {
      _name: "refresh-apps",
      _scope: "module",
      _description: "Refresh user apps and default-app controls.",
    },
    "open-app-actions": {
      _name: "open-app-actions",
      _scope: "module",
      _description: "Open row-scoped app actions for a user app.",
    },
    "close-app-actions": {
      _name: "close-app-actions",
      _scope: "module",
      _description: "Close row-scoped app actions.",
    },
    "edit-selected-app": {
      _name: "edit-selected-app",
      _scope: "module",
      _description: "Open the selected app in edit mode.",
    },
    "open-selected-app": {
      _name: "open-selected-app",
      _scope: "module",
      _description: "Open the selected app in run mode.",
    },
    "export-app": {
      _name: "export-app",
      _scope: "module",
      _description: "Export a user app as a .xapp package.",
    },
    "trash-app": {
      _name: "trash-app",
      _scope: "module",
      _description: "Move a user app to recoverable server trash.",
    },
    "set-default-app": {
      _name: "set-default-app",
      _scope: "module",
      _description: "Set the server-owned default app for an environment.",
    },
    "open-import-app": {
      _name: "open-import-app",
      _scope: "module",
      _description: "Open the app import dialog.",
    },
    "close-import-app": {
      _name: "close-import-app",
      _scope: "module",
      _description: "Close the app import dialog.",
    },
    "select-import-file": {
      _name: "select-import-file",
      _scope: "module",
      _description: "Upload and inspect a selected .xapp package.",
    },
    "confirm-import-app": {
      _name: "confirm-import-app",
      _scope: "module",
      _description: "Confirm and import the uploaded .xapp package.",
    },
    "refresh-mcp-access": {
      _name: "refresh-mcp-access",
      _scope: "module",
      _description: "Refresh non-sensitive MCP status and endpoint UI.",
    },
    "generate-mcp-token": {
      _name: "generate-mcp-token",
      _scope: "module",
      _description: "Generate a short-lived MCP bearer token for the current admin session.",
    },
    "copy-mcp-token": {
      _name: "copy-mcp-token",
      _scope: "module",
      _description: "Copy the current in-memory MCP bearer token to the clipboard.",
    },
  };

  private _mcp_enabled = false;
  private _mcp_endpoint = "";
  private _mcp_status_state: VibeSystemMCPStatusState = "unknown";
  private _mcp_status_deferred = false;
  private _mcp_last_server_ready = false;
  private _mcp_lifecycle_bound = false;
  private _mcp_refresh_in_flight: Promise<any> | null = null;
  private _mcp_token_state: VibeSystemMCPTokenState | null = null;
  private _mcp_expiry_timer: ReturnType<typeof setTimeout> | null = null;
  private _mcp_copy_feedback_timer: ReturnType<typeof setTimeout> | null = null;
  private _selected_app: VibeSystemSelectedApp | null = null;
  private _import_state: VibeSystemImportState = empty_import_state();

  constructor() {
    super({ _name: VibeSystemModule._name });
  }

  protected async onLoad(): Promise<void> {
    this._bind_mcp_lifecycle();
  }

  private _client(): VibeSystemClientRuntime {
    const client = typeof window !== "undefined"
      ? (window as any).__xvm_client
      : null;

    if (!client || typeof client.sendXcmd !== "function") {
      throw new Error("vibe-system requires an authenticated XVM client");
    }

    return client;
  }

  private _server_ready() {
    const client = typeof window !== "undefined"
      ? (window as any).__xvm_client
      : null;

    if (typeof client?.isServerReady === "function") return client.isServerReady() === true;
    if (typeof client?.isWormholeReady === "function") return client.isWormholeReady() === true;
    return Boolean(client && typeof client.sendXcmd === "function");
  }

  private async _send_mcp_command(_op: string, _params: Record<string, any> = {}) {
    return unwrap_result(
      await this._client().sendXcmd(
        {
          _module: "mcp",
          _op,
          _params,
        },
        MCP_TOKEN_COMMAND_TIMEOUT_MS,
      ),
    );
  }

  private _object(id: string): any {
    try {
      return XUI.getObject(id) as any;
    } catch {
      return null;
    }
  }

  private _set_text(id: string, text: string) {
    const object = this._object(id);
    if (!object) return;
    object?.setText?.(text);
    if (object?.dom) object.dom.textContent = text;
    object._text = text;
  }

  private _set_value(id: string, value: string) {
    const object = this._object(id);
    if (!object) return;
    object?.setValue?.(value);
    if (object?.dom && "value" in object.dom) object.dom.value = value;
    object.value = value;
    object._value = value;
  }

  private _set_visible(id: string, visible: boolean) {
    const object = this._object(id);
    if (!object) return;
    if (visible) object.show?.();
    if (!visible) object.hide?.();
    if (object.dom?.style) object.dom.style.display = visible ? "" : "none";
    object._visible = visible;
  }

  private _set_disabled(id: string, disabled: boolean) {
    const object = this._object(id);
    if (!object) return;
    object.disabled = disabled;
    if (object.dom && "disabled" in object.dom) object.dom.disabled = disabled;
    if (object.dom?.setAttribute) object.dom.setAttribute("aria-disabled", String(disabled));
  }

  private _update_object(id: string, data: Record<string, any>) {
    const object = this._object(id);
    if (!object) return;
    object.update?.(data);
    for (const [key, value] of Object.entries(data)) {
      object[key] = value;
    }
  }

  private _show_object(id: string) {
    this._object(id)?.show?.();
  }

  private _hide_object(id: string) {
    this._object(id)?.hide?.();
  }

  private _env(value?: unknown) {
    return typeof value === "string" && value.trim()
      ? value.trim()
      : this._client()._env || DEFAULT_ENV;
  }

  private async _send_server_xvm(_op: string, _params: Record<string, any> = {}) {
    return unwrap_result(
      await this._client().sendXcmd(
        {
          _module: "server-xvm",
          _op,
          _params,
        },
        MCP_TOKEN_COMMAND_TIMEOUT_MS,
      ),
    );
  }

  private _apps_from_xdata() {
    const value = _xd.get("system.apps");
    if (Array.isArray(value)) return value;
    if (Array.isArray(value?._apps)) return value._apps;
    if (Array.isArray(value?._records?._data)) return value._records._data;
    if (Array.isArray(value?._records)) return value._records;
    return [];
  }

  private _selected_app_from_params(params: Record<string, any> = {}): VibeSystemSelectedApp | null {
    const app_id = String(params._selected_app_id ?? params._row_app_id ?? params._app_id ?? params.app_id ?? "").trim();
    if (!app_id) return null;
    return {
      _app_id: app_id,
      _env: this._env(params._env ?? params._row_env ?? params.env),
    };
  }

  private _set_package_status(message: string, level: "info" | "success" | "error" = "info") {
    _xd.set("system.package_status", { _message: message, _level: level, _ts: Date.now() }, { source: "vibe-system" });
    const object = this._object("package-status-label");
    if (!object) return;
    object.class = `package-status-label package-status-${level}`;
    if (object.dom) object.dom.className = object.class;
    this._set_text("package-status-label", message);
  }

  private _set_app_actions_status(message: string) {
    this._set_text(APP_ACTIONS_STATUS_LABEL_ID, message);
  }

  private async _refresh_default_app_controls(env = DEFAULT_ENV) {
    const apps = this._apps_from_xdata();
    let default_app_id = "";

    try {
      const result = await this._send_server_xvm("get-default-app", { _env: env });
      default_app_id = typeof result?._app_id === "string" ? result._app_id : "";
    } catch (err) {
      this._set_text(DEFAULT_SERVER_APP_STATUS_ID, `Default app unavailable: ${safe_display_message(err)}`);
    }

    const options = apps.length > 0
      ? [
        {
          label: default_app_id ? "Select default app" : "No default selected",
          value: "",
          disabled: true,
          selected: !default_app_id,
        },
        ...apps.map((app: any) => {
          const app_id = String(app?._app_id ?? "").trim();
          return {
            label: app_id,
            value: app_id,
            selected: app_id === default_app_id,
          };
        }).filter((option: { value: string }) => option.value),
      ]
      : [
        {
          label: "No apps available",
          value: "",
          disabled: true,
          selected: true,
        },
      ];

    const select = this._object(DEFAULT_SERVER_APP_SELECT_ID);
    if (select) {
      select._options = options;
      select.renderOptions?.();
      select.setValue?.(default_app_id);
      if (select.dom && "value" in select.dom) select.dom.value = default_app_id;
    }

    _xd.set("system.default_app", {
      _app_id: default_app_id || null,
      _env: env,
      _has_default: Boolean(default_app_id),
    }, { source: "vibe-system" });
    this._set_text(
      DEFAULT_SERVER_APP_STATUS_ID,
      default_app_id ? `Default server app: ${default_app_id}` : "Default server app: none",
    );
  }

  async _refresh_apps(xcmd?: any) {
    const params = xcmd?._params ?? {};
    const env = this._env(params._env ?? params.env);
    this._set_package_status("Refreshing apps");

    try {
      const result = await this._send_server_xvm("list-apps", {
        _env: env,
        _include_system: params._include_system === true,
      });
      const apps = Array.isArray(result?._apps) ? result._apps : [];
      const output = typeof params._output === "string" && params._output.trim()
        ? params._output.trim()
        : "system.apps";
      _xd.set(output, apps, { source: "vibe-system" });
      await this._refresh_default_app_controls(env);
      this._set_package_status("");
      return { _ok: true, _result: { _apps: apps, _app_ids: apps.map((app: any) => app?._app_id).filter(Boolean) } };
    } catch (err) {
      const message = `Refresh failed: ${safe_display_message(err)}`;
      this._set_package_status(message, "error");
      return { _ok: false, _error: { _message: message } };
    }
  }

  async _set_default_app(xcmd?: XCommand) {
    const params = xcmd?._params ?? {};
    const app_id = String(params._selected_app_id ?? params._app_id ?? params._row_app_id ?? params._value ?? "").trim();
    const env = this._env(params._env ?? params._row_env ?? params.env);
    if (!app_id) return { _ok: false, _error: { _message: "Set Default requires an app." } };

    this._set_package_status("Setting default app");
    try {
      const result = await this._send_server_xvm("set-default-app", { _app_id: app_id, _env: env });
      await this._refresh_default_app_controls(env);
      this._set_package_status(`Default server app set to ${app_id}`, "success");
      return { _ok: true, _result: result };
    } catch (err) {
      const message = `Set Default failed: ${safe_display_message(err)}`;
      this._set_package_status(message, "error");
      await this._refresh_default_app_controls(env);
      return { _ok: false, _error: { _message: message } };
    }
  }

  async _open_app_actions(xcmd?: XCommand) {
    const selected = this._selected_app_from_params(xcmd?._params ?? {});
    if (!selected) {
      this._set_package_status("No app selected", "error");
      return { _ok: false };
    }

    this._selected_app = selected;
    this._set_text(APP_ACTIONS_SELECTED_LABEL_ID, `${selected._app_id} / ${selected._env}`);
    this._set_app_actions_status("");
    this._show_object(APP_ACTIONS_MODAL_ID);
    return { _ok: true };
  }

  async _close_app_actions() {
    this._selected_app = null;
    this._hide_object(APP_ACTIONS_MODAL_ID);
    return { _ok: true };
  }

  async _edit_selected_app() {
    const selected = this._selected_app;
    if (!selected) {
      this._set_app_actions_status("No app selected");
      return { _ok: false };
    }
    const client = this._client();
    if (typeof client.load_server_app !== "function") {
      this._set_app_actions_status("Edit unavailable");
      return { _ok: false };
    }
    await client.load_server_app(selected._app_id, selected._env, { _edit: true });
    this._hide_object(APP_ACTIONS_MODAL_ID);
    return { _ok: true };
  }

  async _open_selected_app() {
    const selected = this._selected_app;
    if (!selected) {
      this._set_app_actions_status("No app selected");
      return { _ok: false };
    }
    const client = this._client();
    if (typeof client.load_server_app !== "function") {
      this._set_app_actions_status("Open unavailable");
      return { _ok: false };
    }
    await client.load_server_app(selected._app_id, selected._env, { _edit: false });
    this._hide_object(APP_ACTIONS_MODAL_ID);
    return { _ok: true };
  }

  private _xapp_base_url() {
    const wormhole_url = this._client()._wormhole_url || "";
    try {
      const url = new URL(wormhole_url || window.location.href, window.location.href);
      url.protocol = url.protocol === "wss:" ? "https:" : url.protocol === "ws:" ? "http:" : url.protocol;
      url.pathname = "/";
      url.search = "";
      url.hash = "";
      return url.toString();
    } catch {
      return typeof window !== "undefined" && window.location?.href ? window.location.href : "";
    }
  }

  private _resolve_xapp_transfer_url(url: string) {
    if (/^https?:\/\//iu.test(url)) return url;
    return new URL(url, this._xapp_base_url()).toString();
  }

  private async _file_to_base64(file: File) {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const chunk_size = 0x8000;
    let binary = "";
    for (let offset = 0; offset < bytes.length; offset += chunk_size) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + chunk_size));
    }
    return btoa(binary);
  }

  private _download_blob(blob: Blob, filename: string) {
    if (typeof URL === "undefined" || typeof URL.createObjectURL !== "function") {
      throw new Error("Browser file saving is unavailable.");
    }

    const url = URL.createObjectURL(blob);
    try {
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.rel = "noopener";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } finally {
      setTimeout(() => URL.revokeObjectURL?.(url), 0);
    }
  }

  async _export_app(xcmd?: XCommand) {
    const selected = this._selected_app_from_params(xcmd?._params ?? {}) ?? this._selected_app;
    if (!selected) {
      this._set_package_status("Export failed: No app selected", "error");
      this._set_app_actions_status("No app selected");
      return { _ok: false };
    }

    const filename = safe_xapp_filename(selected._app_id);
    this._set_package_status("Exporting");
    this._set_app_actions_status("Exporting");

    try {
      const result = await this._send_server_xvm("export-app", {
        _app_id: selected._app_id,
        _env: selected._env,
      });
      const url = download_url_from_result(result);
      if (!url) throw new Error("Export did not return a download URL.");

      const response = await fetch(this._resolve_xapp_transfer_url(url));
      if (!response.ok) throw new Error(`Export download failed with HTTP ${response.status}.`);

      const bytes = new Uint8Array(await response.arrayBuffer());
      const expected_size = expected_size_from_result(result);
      if (expected_size !== null && bytes.byteLength !== expected_size) {
        throw new Error(`Export size mismatch. Expected ${expected_size}, received ${bytes.byteLength}.`);
      }
      if (!is_zip_bytes(bytes)) throw new Error("Export did not return valid .xapp ZIP bytes.");

      this._download_blob(new Blob([blob_part_from_bytes(bytes)], { type: XAPP_CONTENT_TYPE }), filename);
      this._set_package_status("Export complete", "success");
      this._set_app_actions_status("Export complete");
      return { _ok: true, _result: { _filename: filename } };
    } catch (err) {
      const message = `Export failed: ${safe_display_message(err)}`;
      this._set_package_status(message, "error");
      this._set_app_actions_status(message);
      return { _ok: false, _error: { _message: message } };
    }
  }

  async _trash_app(xcmd?: XCommand) {
    const selected = this._selected_app_from_params(xcmd?._params ?? {}) ?? this._selected_app;
    if (!selected || selected._app_id === "vibe-system") {
      const message = selected ? "System apps cannot be moved to Trash." : "No app selected";
      this._set_package_status(message, "error");
      this._set_app_actions_status(message);
      return { _ok: false };
    }

    const ok = window.confirm(
      `Move ${selected._app_id} to Trash?\n\nThe app will disappear from Your Apps. It can be restored later. This is not permanent deletion.`,
    );
    if (!ok) return { _ok: false, _result: { _cancelled: true } };

    this._set_package_status("Moving to Trash");
    this._set_app_actions_status("Moving to Trash");
    try {
      await this._send_server_xvm("trash-app", {
        _app_id: selected._app_id,
        _env: selected._env,
      });
      await this._refresh_apps({ _params: { _env: selected._env } });
      this._hide_object(APP_ACTIONS_MODAL_ID);
      this._set_package_status("Moved to Trash", "success");
      return { _ok: true };
    } catch (err) {
      const message = `Move to Trash failed: ${safe_display_message(err)}`;
      this._set_package_status(message, "error");
      this._set_app_actions_status(message);
      return { _ok: false, _error: { _message: message } };
    }
  }

  private _render_import_state() {
    const state = this._import_state;
    const preview = state._preview;
    const inspect = state._inspect;
    const manifest = preview?._manifest ?? inspect?._manifest ?? {};
    const app = manifest?._app ?? inspect?._app ?? {};
    const build = manifest?._build ?? {};
    const changes = preview?._changes ?? {};
    const status =
      state._status === "uploading" ? "Uploading package" :
        state._status === "uploaded" ? "Package uploaded" :
          state._status === "inspecting" ? "Inspecting package" :
            state._status === "ready" ? "Package ready" :
              state._status === "importing" ? "Importing package" :
                state._status === "completed" ? "Import complete" :
                  state._status === "failed" ? state._error :
                    "Select a .xapp package";

    const rows = [
      ["Views", "_views"],
      ["Flows", "_flows"],
      ["Entities", "_entities"],
      ["Assets/styles", "_public_files"],
    ].map(([label, group]) => ({
      _label: label,
      _added: change_items(changes, group, "_added").join(", ") || "None",
      _modified: change_items(changes, group, "_modified").join(", ") || "None",
      _deleted: change_items(changes, group, "_deleted").join(", ") || "None",
    }));

    this._update_object("import-app-selected-label", {
      _text: state._file_name
        ? `${state._file_name}${file_size_label(state._file_size) ? ` - ${file_size_label(state._file_size)}` : ""}`
        : "No package selected",
    });
    this._update_object("import-app-upload-label", { _text: status });
    this._update_object("import-app-package-label", {
      _text: state._preview || state._inspect
        ? `App ${app?._app_id ?? preview?._target_app_id ?? "Unknown"} - ${manifest?._format ?? "Unknown"} ${manifest?._format_version ?? ""}`.trim()
        : "Package metadata will appear after upload",
    });
    this._update_object("import-app-source-label", {
      _text: `Source env: ${build?._source_env ?? app?._env ?? "Unknown"}`,
    });
    this._update_object("import-app-counts-label", {
      _text: `Views ${manifest_count(manifest, ["view"])} / Flows ${manifest_count(manifest, ["flow"])} / Entities ${manifest_count(manifest, ["entity"])} / Assets ${manifest_count(manifest, ["asset", "style"])}`,
    });
    this._update_object("import-app-target-label", {
      _text: `Target: ${preview?._target_app_id ?? app?._app_id ?? "Unknown"} / ${preview?._target_env ?? this._env()}`,
    });
    this._update_object("import-app-replace-label", {
      _text: has_replace_changes(preview)
        ? "Replace/update: package-owned artifacts will be replaced. Conversations, Project Memory, XDB, old_views, vibe-runs, and runtime state are preserved."
        : "",
    });
    this._update_object("import-app-preview-table", { _rows: rows });
  }

  private _publish_import_state() {
    const preview = this._import_state._preview;
    const inspect = this._import_state._inspect;
    const manifest = preview?._manifest ?? inspect?._manifest ?? {};
    const app = manifest?._app ?? inspect?._app ?? {};
    const build = manifest?._build ?? {};
    const changes = preview?._changes ?? {};
    const rows = [
      ["Views", "_views"],
      ["Flows", "_flows"],
      ["Entities", "_entities"],
      ["Assets/styles", "_public_files"],
    ].map(([label, group]) => ({
      _label: label,
      _added: change_items(changes, group, "_added").join(", ") || "None",
      _modified: change_items(changes, group, "_modified").join(", ") || "None",
      _deleted: change_items(changes, group, "_deleted").join(", ") || "None",
    }));

    _xd.set("system.import", {
      ...this._import_state,
      _file_size_label: file_size_label(this._import_state._file_size),
      _app_id: app?._app_id ?? preview?._target_app_id ?? "",
      _format: manifest?._format ?? "",
      _format_version: manifest?._format_version ?? "",
      _source_env: build?._source_env ?? app?._env ?? "",
      _target_app_id: preview?._target_app_id ?? app?._app_id ?? "",
      _target_env: preview?._target_env ?? this._env(),
      _views_count: manifest_count(manifest, ["view"]),
      _flows_count: manifest_count(manifest, ["flow"]),
      _entities_count: manifest_count(manifest, ["entity"]),
      _assets_count: manifest_count(manifest, ["asset", "style"]),
      _changes_rows: rows,
      _is_replace: has_replace_changes(preview),
      _replace_message: has_replace_changes(preview)
        ? "This is a replace/update. Package-owned artifacts will be replaced. Conversations, Project Memory, XDB, old_views, vibe-runs, and runtime state are preserved."
        : "",
    }, { source: "vibe-system" });
    this._render_import_state();
  }

  async _open_import_app() {
    this._import_state = { ...empty_import_state(), _open: true };
    this._publish_import_state();
    this._show_object(IMPORT_MODAL_ID);
    queueMicrotask(() => this._object(IMPORT_FILE_ID)?.dom?.focus?.());
    return { _ok: true };
  }

  async _close_import_app() {
    this._import_state = empty_import_state();
    this._publish_import_state();
    this._hide_object(IMPORT_MODAL_ID);
    return { _ok: true };
  }

  async _select_import_file(xcmd?: XCommand) {
    const file = find_file([xcmd, (xcmd as any)?._event, xcmd?._params]);
    if (!file) return { _ok: false, _error: { _message: "No file selected" } };

    this._import_state = {
      ...empty_import_state(),
      _open: true,
      _status: "uploading",
      _file_name: file.name,
      _file_size: file.size,
    };
    this._publish_import_state();
    this._set_package_status("Uploading package");

    try {
      const bytes_base64 = await this._file_to_base64(file);
      const upload = await this._send_server_xvm("upload-app-package", {
        _filename: file.name,
        _size: file.size,
        _content_type: file.type || XAPP_CONTENT_TYPE,
        _bytes_base64: bytes_base64,
      });
      const package_ref = package_ref_from_result(upload);
      if (!package_ref) throw new Error("Upload completed without package reference.");
      this._import_state = { ...this._import_state, _status: "uploaded", _package_ref: package_ref };
      this._publish_import_state();
      await this._inspect_import_package();
      return { _ok: true };
    } catch (err) {
      const message = `Upload failed: ${safe_display_message(err)}`;
      this._import_state = { ...this._import_state, _status: "failed", _error: message };
      this._publish_import_state();
      this._set_package_status(message, "error");
      return { _ok: false, _error: { _message: message } };
    }
  }

  async _inspect_import_package(xcmd?: XCommand) {
    if (!this._import_state._package_ref) return { _ok: false };
    const env = this._env(xcmd?._params?._env);
    this._import_state = { ...this._import_state, _status: "inspecting", _error: "" };
    this._publish_import_state();

    try {
      const inspect = await this._send_server_xvm("inspect-app-package", { _package_ref: this._import_state._package_ref });
      const preview = await this._send_server_xvm("preview-app-import", {
        _package_ref: this._import_state._package_ref,
        _env: env,
      });
      this._import_state = { ...this._import_state, _status: "ready", _inspect: inspect, _preview: preview };
      this._publish_import_state();
      this._set_package_status("Package ready");
      return { _ok: true };
    } catch (err) {
      const message = `Package inspection failed: ${safe_display_message(err)}`;
      this._import_state = { ...this._import_state, _status: "failed", _error: message };
      this._publish_import_state();
      this._set_package_status(message, "error");
      return { _ok: false, _error: { _message: message } };
    }
  }

  async _confirm_import_app(xcmd?: XCommand) {
    if (!this._import_state._package_ref || !this._import_state._preview) return { _ok: false };
    const env = this._env(xcmd?._params?._env);
    const replacing = has_replace_changes(this._import_state._preview);
    const target = this._import_state._preview?._target_app_id ?? this._import_state._inspect?._app?._app_id ?? "app";
    const ok = window.confirm(
      replacing
        ? `Import ${target} as a replace/update? Package-owned artifacts will be replaced. Conversations, Project Memory, XDB, old_views, vibe-runs, and runtime state are preserved.`
        : `Import ${target}?`,
    );
    if (!ok) return { _ok: false, _result: { _cancelled: true } };

    this._import_state = { ...this._import_state, _status: "importing", _error: "" };
    this._publish_import_state();

    try {
      await this._send_server_xvm("import-app", {
        _package_ref: this._import_state._package_ref,
        _env: env,
        _mode: "upsert",
      });
      this._import_state = { ...empty_import_state(), _status: "completed" };
      this._publish_import_state();
      await this._refresh_apps({ _params: { _env: env } });
      this._hide_object(IMPORT_MODAL_ID);
      this._set_package_status("Import complete", "success");
      return { _ok: true };
    } catch (err) {
      const message = `Import failed: ${safe_display_message(err)}`;
      this._import_state = { ...this._import_state, _status: "failed", _error: message };
      this._publish_import_state();
      this._set_package_status(message, "error");
      return { _ok: false, _error: { _message: message } };
    }
  }

  private _window_origin() {
    if (typeof window === "undefined") return "";
    const origin = typeof window.location?.origin === "string" ? window.location.origin.trim() : "";
    if (origin) return origin;

    const href = typeof window.location?.href === "string" ? window.location.href : "";
    if (!href) return "";
    try {
      return new URL(href).origin;
    } catch {
      return "";
    }
  }

  private _fallback_origin_from_wormhole() {
    const client = typeof window !== "undefined" ? (window as any).__xvm_client : null;
    const wormhole_url = typeof client?._wormhole_url === "string" ? client._wormhole_url.trim() : "";
    if (!wormhole_url) return "";

    try {
      const parsed = new URL(wormhole_url, typeof window !== "undefined" ? window.location?.href : undefined);
      parsed.protocol = parsed.protocol === "wss:" ? "https:" : parsed.protocol === "ws:" ? "http:" : parsed.protocol;
      return parsed.origin;
    } catch {
      return "";
    }
  }

  private _resolve_mcp_endpoint(path_or_url: string) {
    const raw = path_or_url.trim() || "/mcp";
    if (/^https?:\/\//iu.test(raw)) return raw;
    const path = raw.startsWith("/") ? raw : `/${raw}`;
    const origin = this._window_origin() || this._fallback_origin_from_wormhole();
    return origin ? `${origin}${path}` : path;
  }

  private _resolve_http_path(path: string) {
    if (/^https?:\/\//iu.test(path)) return path;
    const normalized = path.startsWith("/") ? path : `/${path}`;
    const origin = this._window_origin();
    return origin ? `${origin}${normalized}` : normalized;
  }

  private _mcp_status_record(status_result: any) {
    const normalized = unwrap_result(status_result);
    return is_record(normalized?._mcp) ? normalized._mcp : normalized;
  }

  private _read_mcp_path(status_result: any) {
    const mcp = this._mcp_status_record(status_result);
    const endpoint = typeof mcp?._endpoint === "string"
      ? mcp._endpoint
      : typeof mcp?.endpoint === "string"
        ? mcp.endpoint
        : "";
    if (endpoint) return endpoint;

    return typeof mcp?._path === "string"
      ? mcp._path
      : typeof mcp?.path === "string"
        ? mcp.path
        : "/mcp";
  }

  private _read_mcp_enabled(status_result: any) {
    const mcp = this._mcp_status_record(status_result);
    return mcp?._enabled === true || mcp?.enabled === true;
  }

  private _clear_mcp_timers() {
    if (this._mcp_expiry_timer) clearTimeout(this._mcp_expiry_timer);
    if (this._mcp_copy_feedback_timer) clearTimeout(this._mcp_copy_feedback_timer);
    this._mcp_expiry_timer = null;
    this._mcp_copy_feedback_timer = null;
  }

  private _clear_mcp_token_ui(status = "") {
    this._mcp_token_state = null;
    if (this._mcp_expiry_timer) clearTimeout(this._mcp_expiry_timer);
    this._mcp_expiry_timer = null;
    this._set_value("mcp-token-value", "");
    this._set_value("mcp-setup-snippet", this._setup_snippet(""));
    this._set_text("mcp-token-expires", "Expires: Not generated");
    this._set_visible("mcp-token-group", false);
    this._set_visible("mcp-copy-token", false);
    this._set_disabled("mcp-copy-token", true);
    if (status) this._set_text("mcp-generation-status", status);
  }

  private _has_mcp_access_ui() {
    return Boolean(this._object("mcp-access-panel") || this._object("mcp-status-value"));
  }

  private _render_mcp_connecting(clear_token = true) {
    this._mcp_enabled = false;
    this._mcp_status_state = "connecting";
    this._mcp_endpoint = this._resolve_mcp_endpoint("/mcp");
    this._set_text("mcp-endpoint-value", `Endpoint: ${this._mcp_endpoint}`);
    this._set_text("mcp-status-value", MCP_CONNECTING_STATUS);
    this._set_text("mcp-disabled-help", MCP_STATUS_UNAVAILABLE_HELP);
    this._set_disabled("mcp-generate-token", true);
    if (clear_token) {
      this._clear_mcp_token_ui("");
    } else {
      this._set_value("mcp-setup-snippet", this._setup_snippet(this._mcp_token_state?._token ?? ""));
    }
  }

  private _render_mcp_unknown() {
    this._mcp_enabled = false;
    this._mcp_status_state = "unknown";
    this._set_text("mcp-status-value", "● Available");
    this._set_disabled("mcp-generate-token", true);
    this._set_text("mcp-disabled-help", "MCP status is unavailable.");
  }

  private _bind_mcp_lifecycle() {
    if (this._mcp_lifecycle_bound) return;
    this._mcp_lifecycle_bound = true;

    _xem.removeOwner(MCP_LIFECYCLE_OWNER);

    _xem.on(
      EVT_XVM_SERVER_SUBSCRIPTION_READY,
      (payload: any) => {
        const ready = payload?._ready === true;
        const was_ready = this._mcp_last_server_ready;
        this._mcp_last_server_ready = ready;

        if (!ready) {
          if (was_ready || this._mcp_status_deferred || this._has_mcp_access_ui()) {
            this._mcp_status_deferred = true;
            this._render_mcp_connecting(false);
          }
          return;
        }

        if (was_ready) return;
        if (!this._mcp_status_deferred && !this._has_mcp_access_ui()) return;
        void this._trigger_mcp_status_refresh("server_ready");
      },
      { _owner: MCP_LIFECYCLE_OWNER },
    );

    _xem.on(
      EVT_XVM_CONNECTION,
      (payload: any) => {
        if (payload?._connected === false || payload?._status === "disconnected" || payload?._status === "error") {
          this._mcp_last_server_ready = false;
          if (this._mcp_status_deferred || this._has_mcp_access_ui()) {
            this._mcp_status_deferred = true;
            this._render_mcp_connecting(false);
          }
          return;
        }

        if (payload?._connected === true && !this._mcp_last_server_ready && this._server_ready()) {
          this._mcp_last_server_ready = true;
          if (this._mcp_status_deferred || this._has_mcp_access_ui()) {
            void this._trigger_mcp_status_refresh("server_ready");
          }
        }
      },
      { _owner: MCP_LIFECYCLE_OWNER },
    );
  }

  private _trigger_mcp_status_refresh(source: "server_ready") {
    if (this._mcp_refresh_in_flight) return this._mcp_refresh_in_flight;

    _xlog.log("[vibe-system] mcp status refresh triggered", {
      _source: source,
    });

    return this._refresh_mcp_access({
      _module: this._name,
      _op: "refresh-mcp-access",
      _params: {
        _source: source,
      },
    } as any);
  }

  private _setup_snippet(token: string) {
    const export_value = token || "<generated token>";
    return [
      `export ${MCP_TOKEN_ENV_VAR}="${export_value}"`,
      "",
      "codex mcp add xpell \\",
      `  --url ${this._mcp_endpoint || this._resolve_mcp_endpoint("/mcp")} \\`,
      `  --bearer-token-env-var ${MCP_TOKEN_ENV_VAR}`,
    ].join("\n");
  }

  private _normalize_expiry_ms(result: any) {
    const raw =
      result?._expires_at_ms ??
      result?.expires_at_ms ??
      result?._expires_at ??
      result?.expires_at ??
      result?._expires ??
      result?.expires ??
      null;

    if (typeof raw === "number" && Number.isFinite(raw)) {
      return raw > 1_000_000_000_000 ? raw : raw * 1000;
    }

    if (typeof raw === "string" && raw.trim()) {
      const as_number = Number(raw);
      if (Number.isFinite(as_number)) return as_number > 1_000_000_000_000 ? as_number : as_number * 1000;

      const parsed = Date.parse(raw);
      if (Number.isFinite(parsed)) return parsed;
    }

    const seconds =
      typeof result?._expires_in_seconds === "number"
        ? result._expires_in_seconds
        : typeof result?.expires_in_seconds === "number"
          ? result.expires_in_seconds
          : typeof result?._expires_in === "number"
            ? result._expires_in
            : typeof result?.expires_in === "number"
              ? result.expires_in
              : 0;

    return seconds > 0 ? Date.now() + seconds * 1000 : 0;
  }

  private _normalize_token_result(raw_result: any) {
    const result = is_record(raw_result?._mcp_token) ? raw_result._mcp_token : raw_result;
    const token =
      typeof result?._token === "string"
        ? result._token.trim()
        : typeof result?.token === "string"
          ? result.token.trim()
          : typeof result?._bearer_token === "string"
            ? result._bearer_token.trim()
            : typeof result?.bearer_token === "string"
              ? result.bearer_token.trim()
              : "";

    const expires_at_ms = this._normalize_expiry_ms(result);
    if (!token || !expires_at_ms) {
      throw new Error("MCP token response did not include a token and expiration.");
    }

    return {
      _token: token,
      _expires_at_ms: expires_at_ms,
    };
  }

  private async _request_mcp_token() {
    const fetch_fn = typeof fetch === "function" ? fetch : null;
    if (!fetch_fn) throw new Error("Token generation failed: fetch is unavailable.");

    let response: Response;
    try {
      response = await fetch_fn(this._resolve_http_path(MCP_TOKEN_HTTP_PATH), {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
        body: "{}",
      });
    } catch (err) {
      throw new Error(`Token generation failed: ${safe_display_message(err)}`);
    }

    let body: any = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }

    if (response.status === 401) {
      throw new Error("Admin authentication required");
    }

    const error_body = is_record(body?._result)
      ? body._result
      : is_record(body?._error)
        ? body._error
        : body;
    const error_code = is_record(error_body) && typeof error_body._code === "string"
      ? error_body._code
      : "";
    const error_message = safe_display_message(error_body);

    if (response.status === 404 || error_code === "E_XMCP_DISABLED" || /disabled/iu.test(error_message)) {
      throw new Error("MCP is disabled");
    }

    if (!response.ok || body?._ok === false) {
      throw new Error(`Token generation failed: ${error_message}`);
    }

    return body;
  }

  private _format_expiry(expires_at_ms: number) {
    try {
      return new Date(expires_at_ms).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  }

  private _arm_expiry_timer(expires_at_ms: number) {
    if (this._mcp_expiry_timer) clearTimeout(this._mcp_expiry_timer);
    const delay = Math.max(0, Math.min(expires_at_ms - Date.now(), 2_147_483_647));
    this._mcp_expiry_timer = setTimeout(() => {
      this._clear_mcp_token_ui(MCP_EXPIRED_STATUS);
    }, delay);
  }

  private _render_token(token_state: VibeSystemMCPTokenState) {
    this._mcp_token_state = token_state;
    this._set_value("mcp-token-value", token_state._token);
    this._set_value("mcp-setup-snippet", this._setup_snippet(token_state._token));
    this._set_text("mcp-token-expires", `Expires: ${this._format_expiry(token_state._expires_at_ms)}`);
    this._set_text("mcp-generation-status", "MCP token generated");
    this._set_visible("mcp-token-group", true);
    this._set_visible("mcp-copy-token", true);
    this._set_disabled("mcp-copy-token", false);
    this._arm_expiry_timer(token_state._expires_at_ms);
  }

  async _refresh_mcp_access(_xcmd?: XCommand) {
    if (this._mcp_refresh_in_flight) return this._mcp_refresh_in_flight;

    const refresh = this._refresh_mcp_access_inner(_xcmd);
    this._mcp_refresh_in_flight = refresh;
    try {
      return await refresh;
    } finally {
      if (this._mcp_refresh_in_flight === refresh) {
        this._mcp_refresh_in_flight = null;
      }
    }
  }

  private async _refresh_mcp_access_inner(_xcmd?: XCommand) {
    this._clear_mcp_timers();
    this._mcp_endpoint = this._resolve_mcp_endpoint("/mcp");
    this._set_text("mcp-endpoint-value", `Endpoint: ${this._mcp_endpoint}`);
    this._set_text("mcp-disabled-help", "");
    this._clear_mcp_token_ui("");
    this._set_disabled("mcp-generate-token", true);

    if (!this._server_ready()) {
      this._mcp_status_deferred = true;
      this._render_mcp_connecting(false);
      _xlog.log("[vibe-system] mcp status deferred", {
        _reason: "server_not_ready",
      });
      return {
        _ok: true,
        _status: this._mcp_status_state,
        _deferred: true,
        _endpoint: this._mcp_endpoint,
      };
    }

    try {
      const status = await this._send_mcp_command("status");
      this._mcp_enabled = this._read_mcp_enabled(status);
      this._mcp_status_state = this._mcp_enabled ? "enabled" : "disabled";
      this._mcp_status_deferred = false;
      this._mcp_last_server_ready = true;
      this._mcp_endpoint = this._resolve_mcp_endpoint(this._read_mcp_path(status));
      _xlog.log("[vibe-system] mcp status resolved", {
        _enabled: this._mcp_enabled,
        _path: this._read_mcp_path(status),
      });
      this._set_text("mcp-status-value", this._mcp_enabled ? "● MCP Ready" : "● MCP Disabled");
      this._set_text("mcp-endpoint-value", `Endpoint: ${this._mcp_endpoint}`);
      this._set_value("mcp-setup-snippet", this._setup_snippet(""));
      this._set_disabled("mcp-generate-token", !this._mcp_enabled);
      this._set_text(
        "mcp-disabled-help",
        this._mcp_enabled ? "" : "MCP is disabled",
      );
      return {
        _ok: true,
        _status: this._mcp_status_state,
        _enabled: this._mcp_enabled,
        _endpoint: this._mcp_endpoint,
      };
    } catch {
      this._mcp_status_deferred = true;
      this._render_mcp_unknown();
      return {
        _ok: false,
        _status: this._mcp_status_state,
        _endpoint: this._mcp_endpoint,
      };
    }
  }

  async _generate_mcp_token(_xcmd?: XCommand) {
    if (this._mcp_status_state === "connecting" || this._mcp_status_state === "unknown") {
      this._set_text("mcp-generation-status", MCP_STATUS_UNAVAILABLE_HELP);
      this._set_text("mcp-disabled-help", MCP_STATUS_UNAVAILABLE_HELP);
      return { _ok: false, _error: { _code: "E_MCP_STATUS_UNAVAILABLE" } };
    }

    if (!this._mcp_enabled) {
      this._set_text("mcp-generation-status", "MCP is disabled");
      this._set_text("mcp-disabled-help", "MCP is disabled");
      return { _ok: false, _error: { _code: "E_MCP_DISABLED" } };
    }

    this._clear_mcp_token_ui("Generating...");
    this._set_disabled("mcp-generate-token", true);

    try {
      const raw = await this._request_mcp_token();
      const token_state = this._normalize_token_result(raw);
      this._render_token(token_state);
      this._set_disabled("mcp-generate-token", false);
      return {
        _ok: true,
        _expires_at: token_state._expires_at_ms,
      };
    } catch (err) {
      this._mcp_token_state = null;
      this._set_text("mcp-generation-status", safe_display_message(err));
      this._set_disabled("mcp-generate-token", false);
      return {
        _ok: false,
        _error: {
          _message: safe_display_message(err),
        },
      };
    }
  }

  async _copy_mcp_token(_xcmd?: XCommand) {
    const token = this._mcp_token_state?._token ?? "";
    if (!token) {
      this._set_text("mcp-generation-status", MCP_EXPIRED_STATUS);
      return { _ok: false };
    }

    const clipboard = typeof navigator !== "undefined" ? navigator.clipboard : null;
    if (!clipboard || typeof clipboard.writeText !== "function") {
      this._set_text("mcp-generation-status", "Copy failed");
      return { _ok: false };
    }

    try {
      await clipboard.writeText(token);
      this._set_text("mcp-generation-status", "Copied");
      if (this._mcp_copy_feedback_timer) clearTimeout(this._mcp_copy_feedback_timer);
      this._mcp_copy_feedback_timer = setTimeout(() => {
        if (this._mcp_token_state?._token === token) {
          this._set_text("mcp-generation-status", "MCP token generated");
        }
      }, 1800);
      return { _ok: true };
    } catch {
      this._set_text("mcp-generation-status", "Copy failed");
      return { _ok: false };
    }
  }
}

export const VibeSystem = new VibeSystemModule();
