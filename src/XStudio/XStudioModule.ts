import {
  XModule,
  type XpellSkill,
  type XpellSkillCommand,
} from "@xpell/core";
import { _xd, _xlog, XUtils as _xu } from "@xpell/core";

import { _xem } from "../XEM/XEventManager";
import Wormholes from "../Wormholes/Wormholes";
import { XUI } from "../XUI/XUI";
import { XVM, type XVMApp } from "../XVM/XVM";
import {
  create_studio_editor_view,
  studio_editor_views,
} from "./XSEditor";
import object_tree_view from "./views/object-tree.json";
import selected_object_inspector_view from "./views/selected-object-inspector.json";
import shell_view from "./views/shell.json";
import topbar_view from "./views/topbar.json";
import {
  _XD_KEYS,
  is_obj,
  to_err,
  type ServerGetViewRes,
  type ServerListFlowsRes,
  type ServerListGeneratedModulesRes,
  type ServerListViewsRes,
  type VibeGenerationState,
} from "./XStudioTypes";

const LOG = "[xstudio]";
const VIBE_LOG = "[vibe-client]";
const STUDIO_VIEW_ID = "xstudio-editor";
const STUDIO_REGION_ID = "studio";
const STUDIO_CONTAINER_ID = "region-studio";
const STUDIO_SHELL_ID = "xstudio-shell";
const STUDIO_TOPBAR_ID = "xstudio-topbar";
const STUDIO_CANVAS_ID = "xstudio-canvas";
const STUDIO_TOGGLE_LEFT_DOCK_ID = "xstudio-toggle-left-dock";
const STUDIO_TOGGLE_RIGHT_DOCK_ID = "xstudio-toggle-right-dock";
const STUDIO_OBJECT_TREE_ID = "xstudio-object-tree";
const STUDIO_SELECTED_OBJECT_PANEL_ID = "xstudio-selected-object-panel";
const STUDIO_SELECTED_OBJECT_SUMMARY_LINE_ID = "xstudio-selected-object-summary-line";
const STUDIO_SELECTED_OBJECT_SUMMARY_TEXT_ID = "xstudio-selected-object-summary-text";
const STUDIO_SELECTED_OBJECT_TYPE_ID = "xstudio-selected-object-type";
const STUDIO_SELECTED_OBJECT_ID_ID = "xstudio-selected-object-id";
const STUDIO_SELECTED_OBJECT_TEXT_ID = "xstudio-selected-object-text";
const STUDIO_SELECTED_OBJECT_SOURCE_ID = "xstudio-selected-object-source";
const STUDIO_SELECTED_OBJECT_PATH_ID = "xstudio-selected-object-path";
const STUDIO_SELECTED_OBJECT_DOM_ID = "xstudio-selected-object-dom";
const STUDIO_SELECTED_OBJECT_METADATA_ID = "xstudio-selected-object-metadata";
const STUDIO_SELECTED_OBJECT_DETAILS_ID = "xstudio-selected-object-details";
const STUDIO_SELECTED_OBJECT_DETAILS_TOGGLE_ID = "xstudio-selected-object-details-toggle";
const STUDIO_SELECTED_OBJECT_JSON_ID = "xstudio-selected-object-json";
const STUDIO_SELECTED_OBJECT_EDIT_TEXT_ID = "xstudio-selected-object-edit-text";
const STUDIO_SELECTED_OBJECT_EDIT_CLASS_ID = "xstudio-selected-object-edit-class";
const STUDIO_SELECTED_OBJECT_EDIT_STYLE_PROPERTY_ID = "xstudio-selected-object-edit-style-property";
const STUDIO_SELECTED_OBJECT_EDIT_STYLE_VALUE_ID = "xstudio-selected-object-edit-style-value";
const STUDIO_SELECTED_OBJECT_EDIT_DISABLED_ID = "xstudio-selected-object-edit-disabled";
const STUDIO_SELECTED_OBJECT_EDIT_PLACEHOLDER_ID = "xstudio-selected-object-edit-placeholder";
const STUDIO_SELECTED_OBJECT_APPLY_TEXT_ID = "xstudio-selected-object-apply-text";
const STUDIO_SELECTED_OBJECT_APPLY_CLASS_ID = "xstudio-selected-object-apply-class";
const STUDIO_SELECTED_OBJECT_APPLY_STYLE_ID = "xstudio-selected-object-apply-style";
const STUDIO_SELECTED_OBJECT_APPLY_DISABLED_ID = "xstudio-selected-object-apply-disabled";
const STUDIO_SELECTED_OBJECT_APPLY_PLACEHOLDER_ID = "xstudio-selected-object-apply-placeholder";
const STUDIO_SELECTED_OBJECT_MOVE_UP_ID = "xstudio-selected-object-move-up";
const STUDIO_SELECTED_OBJECT_MOVE_DOWN_ID = "xstudio-selected-object-move-down";
const STUDIO_SELECTED_OBJECT_HIDE_ID = "xstudio-selected-object-hide";
const STUDIO_SELECTED_OBJECT_SHOW_ID = "xstudio-selected-object-show";
const STUDIO_SELECTED_OBJECT_DUPLICATE_ID = "xstudio-selected-object-duplicate";
const STUDIO_SELECTED_OBJECT_DELETE_REQUEST_ID = "xstudio-selected-object-delete-request";
const STUDIO_SELECTED_OBJECT_DELETE_DIALOG_ID = "xstudio-selected-object-delete-dialog";
const STUDIO_SELECTED_OBJECT_DELETE_TYPE_ID = "xstudio-selected-object-delete-type";
const STUDIO_SELECTED_OBJECT_DELETE_NAME_ID = "xstudio-selected-object-delete-name";
const STUDIO_SELECTED_OBJECT_DELETE_CANCEL_ID = "xstudio-selected-object-delete-cancel";
const STUDIO_SELECTED_OBJECT_DELETE_CONFIRM_ID = "xstudio-selected-object-delete-confirm";
const STUDIO_SELECTED_OBJECT_UPDATE_JSON_ID = "xstudio-selected-object-update-json";
const STUDIO_SELECTED_OBJECT_RESET_JSON_ID = "xstudio-selected-object-reset-json";
const STUDIO_SELECTED_OBJECT_ROW_CLASS = "xstudio-object-tree-row-selected";
const STUDIO_SELECTED_CANVAS_CLASS = "xstudio-selected-object";
const STUDIO_THEME_DEFAULT = "terminal";
const STUDIO_THEME_SELECTOR_ID = "xstudio-theme-selector";
const STUDIO_THEME_CLASS_PREFIX = "xstudio-theme-";
const STUDIO_THEME_OPTIONS = ["terminal", "dark", "light"] as const;
const STUDIO_RUNTIME_SECTION_ID = "xstudio-runtime-section";
const STUDIO_RUNTIME_INSPECTOR_SECTION_ID = "xstudio-runtime-inspector-section";
const STUDIO_JSON_SECTION_ID = "xstudio-json-section";
const STUDIO_MODULES_SECTION_ID = "xstudio-generated-modules-section";
const STUDIO_PORTLET_TOGGLE_ACTIVE_CLASS = "xstudio-portlet-toggle-active";
const STUDIO_SELECTED_OBJECT_DETAILS_EXPANDED_CLASS = "xstudio-selected-object-details-expanded";

type XStudioTheme = typeof STUDIO_THEME_OPTIONS[number];
type XStudioPortletId = "selected" | "prompt" | "runtime" | "inspector" | "json" | "modules";

const STUDIO_PORTLETS: Record<XStudioPortletId, {
  _object_id: string;
  _button_id?: string;
  _label: string;
}> = {
  selected: {
    _object_id: STUDIO_SELECTED_OBJECT_PANEL_ID,
    _label: "Selected Object",
  },
  prompt: {
    _object_id: STUDIO_VIEW_ID,
    _button_id: "xstudio-portlet-toggle-prompt",
    _label: "Prompt",
  },
  runtime: {
    _object_id: STUDIO_RUNTIME_SECTION_ID,
    _button_id: "xstudio-portlet-toggle-runtime",
    _label: "Runtime",
  },
  inspector: {
    _object_id: STUDIO_RUNTIME_INSPECTOR_SECTION_ID,
    _button_id: "xstudio-portlet-toggle-inspector",
    _label: "Inspector",
  },
  json: {
    _object_id: STUDIO_JSON_SECTION_ID,
    _button_id: "xstudio-portlet-toggle-json",
    _label: "JSON",
  },
  modules: {
    _object_id: STUDIO_MODULES_SECTION_ID,
    _button_id: "xstudio-portlet-toggle-modules",
    _label: "Modules",
  },
};

const STUDIO_PORTLET_IDS = Object.keys(STUDIO_PORTLETS) as XStudioPortletId[];
const STUDIO_SELECTED_OBJECT_INSPECTOR_CONTROL_IDS = [
  STUDIO_SELECTED_OBJECT_EDIT_TEXT_ID,
  STUDIO_SELECTED_OBJECT_EDIT_CLASS_ID,
  STUDIO_SELECTED_OBJECT_EDIT_STYLE_PROPERTY_ID,
  STUDIO_SELECTED_OBJECT_EDIT_STYLE_VALUE_ID,
  STUDIO_SELECTED_OBJECT_EDIT_DISABLED_ID,
  STUDIO_SELECTED_OBJECT_EDIT_PLACEHOLDER_ID,
  STUDIO_SELECTED_OBJECT_APPLY_TEXT_ID,
  STUDIO_SELECTED_OBJECT_APPLY_CLASS_ID,
  STUDIO_SELECTED_OBJECT_APPLY_STYLE_ID,
  STUDIO_SELECTED_OBJECT_APPLY_DISABLED_ID,
  STUDIO_SELECTED_OBJECT_APPLY_PLACEHOLDER_ID,
  STUDIO_SELECTED_OBJECT_JSON_ID,
  STUDIO_SELECTED_OBJECT_UPDATE_JSON_ID,
  STUDIO_SELECTED_OBJECT_RESET_JSON_ID,
];

const EVT_VIBE_GENERATION_STAGE = "vibe:generation-stage";
const EVT_VIBE_GENERATION_COMPLETE = "vibe:generation-complete";
const EVT_VIBE_GENERATION_FAILED = "vibe:generation-failed";
const EVT_XVIBE_ERROR = "xvibe:error";
const EVT_COMMAND_ERROR = "command:error";

const XSTUDIO_PACKAGE_VIEWS: Record<string, Record<string, any>> = {
  [STUDIO_SHELL_ID]: shell_view as Record<string, any>,
  [STUDIO_TOPBAR_ID]: topbar_view as Record<string, any>,
  [STUDIO_OBJECT_TREE_ID]: object_tree_view as Record<string, any>,
  [STUDIO_SELECTED_OBJECT_PANEL_ID]: selected_object_inspector_view as Record<string, any>,
  ...studio_editor_views,
};

type XStudioClientRuntime = {
  getActiveAppId(): string;
  getActiveEnv(): string;
  get_current_view_id(): string;
  get_app_view_id(): string;
  get_view?(view_id: string): Record<string, any> | null;
  get_current_view?(): Record<string, any> | null;
  _read_cached_view?(view_id: string): Record<string, any> | null;
  is_edit_mode_enabled?(): boolean;
  note_structured_view_edit?(edit: { _view_id?: string; _action?: string; _target_id?: string }): void;
  clear_pending_structured_view_edit?(edit: { _view_id?: string; _action?: string; _target_id?: string }): void;
  sendXcmd(xcmd: any): Promise<any>;
};

type StudioRuntimeAppContext = {
  _region: string;
  _container_id: string;
  _fallback_view_id?: string;
  _app_id?: string;
  _edit?: boolean;
};

type StudioXVMUpdateEvt = {
  _app_id: string;
  _env: string;
  _view_id: string;
  _version?: number;
  _view?: Record<string, any>;
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

type XStudioSelectedObject = {
  _id: string;
  _json_id: string;
  _type: string;
  _text: string;
  _source_view_id: string;
  _path: string;
  _parent_path: string;
  _previous_sibling_id: string;
  _next_sibling_id: string;
  _is_xvm_ref_child: boolean;
  _json_metadata: string;
  _dom_status?: string;
};

type XStudioSelectedObjectInspectorDraft = {
  _text: string;
  _class: string;
  _style_property: string;
  _style_value: string;
  _disabled: string;
  _placeholder: string;
};

type XStudioSelectedObjectInspectorField =
  | "text"
  | "class"
  | "style"
  | "disabled"
  | "placeholder";

type XStudioSelectedObjectApplyViewEditParams = {
  _app_id: string;
  _env: string;
  _view_id: string;
  _edit_action: string;
  _target_id: string;
  _target_type: string;
  _property_name?: string;
  _property_value?: string | number | boolean | null;
  _style_property?: string;
  _style_value?: string;
  _object_value?: Record<string, any>;
  _before_id?: string;
  _after_id?: string;
};

type XStudioObjectTreeNode = {
  _key: string;
  _label: string;
  _meta: XStudioSelectedObject | null;
  _object: Record<string, any> | null;
  _depth: number;
  _placeholder?: string;
};

type XStudioSelectedObjectSiblingContext = {
  _is_root: boolean;
  _previous_sibling_id: string;
  _next_sibling_id: string;
};

const empty_selected_object_inspector_draft = (): XStudioSelectedObjectInspectorDraft => ({
  _text: "",
  _class: "",
  _style_property: "",
  _style_value: "",
  _disabled: "",
  _placeholder: "",
});

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
    return raw._result;
  }

  return raw;
};

export class XStudioModule extends XModule {
  static _name = "xstudio";
  private static _shortcut_owner: XStudioModule | null = null;
  static _skill: XpellSkill = {
    _id: "xstudio",
    _title: "XStudio Module",
    _version: "1.0.0",
    _active: true,
    _type: "client-module-api",
    _requires: ["xmodule"],

    _description:
      "XStudio Module for managing and editing Xpell Artifacts.",

    _core_rules: [
      "Use XData/xd for reactive runtime state.",
      "Use string ops for simple values and object ops for JSON data."
    ]
  };

  static _ops: Record<string, XpellSkillCommand> = {
    info: {
      _name: "info",
      _scope: "module",
      _description: "Return XStudio module info."
    },
    "set-studio-theme": {
      _name: "set-studio-theme",
      _scope: "module",
      _description: "Set the local XStudio shell theme without changing the app canvas theme.",
      _params: {
        _theme: "XStudio shell theme: terminal, dark, or light."
      }
    },
    "toggle-portlet": {
      _name: "toggle-portlet",
      _scope: "module",
      _description: "Toggle a right-dock XStudio portlet without recreating it.",
      _params: {
        _portlet: "Portlet id: prompt, runtime, inspector, json, or modules."
      }
    },
  };

  private _xvm_client: XStudioClientRuntime | null = null;
  private _events_bound = false;
  private _generation_listeners_registered = false;
  private _cmd_seq = 0;
  private _active_generation_id = "";
  private _active_generation_view_id = "";
  private _left_dock_collapsed = false;
  private _right_dock_collapsed = false;
  private _shortcuts_registered = false;
  private _shortcut_keydown_handler: ((event: KeyboardEvent) => void) | null = null;
  private _selected_object: XStudioSelectedObject | null = null;
  private _selected_object_pending_delete: XStudioSelectedObject | null = null;
  private _selected_object_pending_select_id = "";
  private _selected_object_json = "";
  private _selected_object_inspector_draft = empty_selected_object_inspector_draft();
  private _selected_object_details_expanded = false;
  private _selected_tree_row_id = "";
  private _selected_canvas_element: HTMLElement | null = null;
  private _object_tree_render_seq = 0;
  private _object_tree_nodes: XStudioObjectTreeNode[] = [];
  private _studio_theme: XStudioTheme = STUDIO_THEME_DEFAULT;
  private _portlet_visibility: Record<XStudioPortletId, boolean> = {
    selected: true,
    prompt: true,
    runtime: false,
    inspector: true,
    json: false,
    modules: false,
  };

  constructor(client?: XStudioClientRuntime | null) {
    super({
      _name: XStudioModule._name
    });

    this._xvm_client = client ?? null;
  }

  private _client() {
    if (!this._xvm_client) {
      throw new Error("XStudioModule requires an XVMClient runtime");
    }
    return this._xvm_client;
  }

  bind_events() {
    if (this._events_bound) return;
    this._events_bound = true;
    this._register_generation_listeners();

    _xem.on("studio:runtime-refresh", async () => {
      await this._refresh_studio_runtime();
    });

    _xem.on("studio:inspect-last-run", async () => {
      await this._inspect_studio_latest_run();
    });

    _xem.on("studio:load-current-view", async () => {
      await this._load_studio_current_view_json();
    });

    _xem.on("xvm:view-rendered", (payload: any) => {
      const evt = this._normalize_event_payload(payload);
      if (!is_obj(evt)) return;
      if (evt._app_id !== this._client().getActiveAppId()) return;
      if (evt._env !== this._client().getActiveEnv()) return;
      this._refresh_object_tree_for_current_view();
    });

    _xem.on("xvm:view-cache-updated", (payload: any) => {
      const evt = this._normalize_event_payload(payload);
      if (!is_obj(evt)) return;
      if (evt._app_id !== this._client().getActiveAppId()) return;
      if (evt._env !== this._client().getActiveEnv()) return;
      this._refresh_object_tree_for_current_view();
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

    _xem.on("studio:toggle-left-dock", () => {
      this._toggle_left_dock();
    });

    _xem.on("studio:toggle-right-dock", () => {
      this._toggle_right_dock();
    });

    _xem.on("studio:preview-request", async () => {
      const prompt = String(_xd.get("studio:prompt") ?? "").trim();
      if (!prompt) {
        this._log("studio preview ignored: empty prompt");
        return;
      }

      this._send_studio_generate_artifact_prompt(
        prompt,
        this._resolve_studio_target_view_id() || "main",
        "studio-preview",
      );
    });

    _xem.on("studio:apply-request", () => {
      this._log("studio apply ignored: preview already persists in V1");
    });

    _xem.on("studio:selected-object:apply-text", async () => {
      await this._apply_selected_object_inspector_field("text");
    });

    _xem.on("studio:selected-object:apply-class", async () => {
      await this._apply_selected_object_inspector_field("class");
    });

    _xem.on("studio:selected-object:apply-style", async () => {
      await this._apply_selected_object_inspector_field("style");
    });

    _xem.on("studio:selected-object:apply-disabled", async () => {
      await this._apply_selected_object_inspector_field("disabled");
    });

    _xem.on("studio:selected-object:apply-placeholder", async () => {
      await this._apply_selected_object_inspector_field("placeholder");
    });

    _xem.on("studio:selected-object:move-up", async () => {
      await this._move_selected_object("up");
    });

    _xem.on("studio:selected-object:move-down", async () => {
      await this._move_selected_object("down");
    });

    _xem.on("studio:selected-object:hide", async () => {
      await this._apply_selected_object_visibility("hide");
    });

    _xem.on("studio:selected-object:show", async () => {
      await this._apply_selected_object_visibility("show");
    });

    _xem.on("studio:selected-object:duplicate", async () => {
      await this._duplicate_selected_object();
    });

    _xem.on("studio:selected-object:delete-request", () => {
      this._request_delete_selected_object();
    });

    _xem.on("studio:selected-object:delete-cancel", () => {
      this._hide_delete_selected_object_dialog();
    });

    _xem.on("studio:selected-object:delete-confirm", async () => {
      await this._confirm_delete_selected_object();
    });

    _xem.on("studio:selected-object:toggle-details", () => {
      this._toggle_selected_object_details();
    });

    _xem.on("studio:selected-object:update-json", async () => {
      await this._update_selected_object_json_from_editor();
    });

    _xem.on("studio:selected-object:reset-json", () => {
      this._reset_selected_object_json_editor();
    });

    _xem.on("studio:close", async () => {
      await this._close_studio();
    });
  }

  register_shortcuts() {
    this.unregister_shortcuts();
  }

  unregister_shortcuts() {
    if (!this._shortcuts_registered) return;
    if (typeof document !== "undefined" && this._shortcut_keydown_handler) {
      document.removeEventListener("keydown", this._shortcut_keydown_handler, true);
    }
    this._shortcut_keydown_handler = null;
    this._shortcuts_registered = false;
    if (XStudioModule._shortcut_owner === this) {
      XStudioModule._shortcut_owner = null;
    }
  }

  clear_active_generation() {
    this._active_generation_id = "";
    this._active_generation_view_id = "";
  }

  extend_runtime_app(base_app: XVMApp, ctx: StudioRuntimeAppContext): XVMApp {
    if (!this._can_edit(ctx)) return base_app;

    const views = is_obj(base_app._views) ? base_app._views : {};

    return {
      ...base_app,

      _shell: this._studio_shell_view(ctx._container_id),

      _containers: [
        { _id: ctx._container_id },
        { _id: STUDIO_CONTAINER_ID },
      ],

      _regions: [
        {
          _id: ctx._region,
          _container_id: ctx._container_id,
        },
        {
          _id: STUDIO_REGION_ID,
          _container_id: STUDIO_CONTAINER_ID,
          _hash_sync: false,
        },
      ],

      _views: {
        ...views,
        [STUDIO_VIEW_ID]: create_studio_editor_view(),
      },

      _router: {
        ...(is_obj(base_app._router) ? base_app._router : {}),
        _region: ctx._region,
        _fallback_view_id: ctx._fallback_view_id,
      },

      _start: {
        ...(is_obj(base_app._start) ? base_app._start : {}),
        _view_id: ctx._fallback_view_id,
        _region: ctx._region,
      },
    } as XVMApp;
  }

  handle_xvm_update(update: StudioXVMUpdateEvt) {
    this._complete_generation_from_update(update);
    this._refresh_object_tree_for_current_view();
  }

  private _can_edit(ctx?: Pick<StudioRuntimeAppContext, "_app_id" | "_edit">) {
    const app_id = typeof ctx?._app_id === "string" ? ctx._app_id : this._xvm_client?.getActiveAppId?.();
    if (app_id === "vibe-system") return false;

    if (typeof ctx?._edit === "boolean") return ctx._edit;

    if (typeof this._xvm_client?.is_edit_mode_enabled === "function") {
      return this._xvm_client.is_edit_mode_enabled() === true;
    }

    return true;
  }

  private _normalize_studio_theme(theme: any): XStudioTheme {
    const value = String(theme ?? "").trim().toLowerCase();
    return (STUDIO_THEME_OPTIONS as readonly string[]).includes(value)
      ? (value as XStudioTheme)
      : STUDIO_THEME_DEFAULT;
  }

  private _studio_theme_class(theme: any = this._studio_theme) {
    return `${STUDIO_THEME_CLASS_PREFIX}${this._normalize_studio_theme(theme)}`;
  }

  private _read_studio_theme_selector_value() {
    const selector = XUI.getObject(STUDIO_THEME_SELECTOR_ID) as any;
    const value = selector?.getValue?.() ?? selector?.dom?.value ?? this._studio_theme;
    return this._normalize_studio_theme(value);
  }

  private _studio_shell_class() {
    return [
      "xstudio-shell",
      this._studio_theme_class(),
      this._left_dock_collapsed ? "xstudio-left-collapsed" : "",
      this._right_dock_collapsed ? "xstudio-right-collapsed" : "",
    ].filter(Boolean).join(" ");
  }

  private _left_dock_toggle_text() {
    return this._left_dock_collapsed ? "▶" : "◀";
  }

  private _right_dock_toggle_text() {
    return this._right_dock_collapsed ? "◀" : "▶";
  }

  private _left_dock_toggle_title() {
    return this._left_dock_collapsed ? "Expand left dock" : "Collapse left dock";
  }

  private _right_dock_toggle_title() {
    return this._right_dock_collapsed ? "Expand right dock" : "Collapse right dock";
  }

  private _clone_studio_package_view(view_id: string) {
    const view = XSTUDIO_PACKAGE_VIEWS[view_id];
    return view ? _xu.clone_json(view) : null;
  }

  private _find_view_data(root: any, object_id: string): Record<string, any> | null {
    if (!is_obj(root)) return null;
    if (root._id === object_id) return root;

    if (!Array.isArray(root._children)) return null;
    for (const child of root._children) {
      const found = this._find_view_data(child, object_id);
      if (found) return found;
    }

    return null;
  }

  private _set_view_data_button_state(root: Record<string, any>, object_id: string, text: string, title: string) {
    const button = this._find_view_data(root, object_id);
    if (!button) return;
    button._text = text;
    button.title = title;
  }

  private _set_view_data_select_value(root: Record<string, any>, object_id: string, value: string) {
    const select = this._find_view_data(root, object_id);
    if (!select) return;

    select._value = value;
    select.value = value;

    if (!Array.isArray(select._options)) return;

    for (const option of select._options) {
      if (!is_obj(option)) continue;
      option.selected = option.value === value;
    }
  }

  private _set_class_token_on_data(obj: Record<string, any>, class_name: string, enabled: boolean) {
    const classes = new Set(
      String(obj.class ?? "")
        .split(/\s+/g)
        .map((item) => item.trim())
        .filter(Boolean)
    );

    if (enabled) {
      classes.add(class_name);
    } else {
      classes.delete(class_name);
    }

    obj.class = Array.from(classes).join(" ");
  }

  private _set_view_data_portlet_button_state(root: Record<string, any>, portlet_id: XStudioPortletId) {
    const config = STUDIO_PORTLETS[portlet_id];
    if (!config._button_id) return;

    const button = this._find_view_data(root, config._button_id);
    if (!button) return;

    const visible = this._portlet_visibility[portlet_id] === true;
    button._text = config._label;
    button.title = `${visible ? "Hide" : "Show"} ${config._label}`;
    button["aria-pressed"] = String(visible);
    this._set_class_token_on_data(button, STUDIO_PORTLET_TOGGLE_ACTIVE_CLASS, visible);
  }

  private _apply_portlet_state_to_view_data(root: Record<string, any>) {
    for (const portlet_id of STUDIO_PORTLET_IDS) {
      const config = STUDIO_PORTLETS[portlet_id];
      const portlet = this._find_view_data(root, config._object_id);
      if (!portlet) continue;
      portlet._visible = this._portlet_visibility[portlet_id] === true;
    }
  }

  private _apply_topbar_state_to_view_data(view: Record<string, any>) {
    this._set_view_data_button_state(
      view,
      STUDIO_TOGGLE_LEFT_DOCK_ID,
      this._left_dock_toggle_text(),
      this._left_dock_toggle_title(),
    );
    this._set_view_data_button_state(
      view,
      STUDIO_TOGGLE_RIGHT_DOCK_ID,
      this._right_dock_toggle_text(),
      this._right_dock_toggle_title(),
    );
    this._set_view_data_select_value(
      view,
      STUDIO_THEME_SELECTOR_ID,
      this._studio_theme,
    );

    for (const portlet_id of STUDIO_PORTLET_IDS) {
      this._set_view_data_portlet_button_state(view, portlet_id);
    }
  }

  private _resolve_studio_view(view_id: string) {
    const local_view = this._clone_studio_package_view(view_id);
    if (local_view) {
      if (view_id === STUDIO_TOPBAR_ID) {
        this._apply_topbar_state_to_view_data(local_view);
      }
      return local_view;
    }

    const app_view = this._xvm_client?.get_view?.(view_id);
    return is_obj(app_view) ? app_view : null;
  }

  private _register_studio_view_resolver() {
    void _xem.fire("xvm:view-resolver-ready", {
      resolver: (view_id: string) => this._resolve_studio_view(view_id),
    });
  }

  private _studio_shell_view(main_container_id: string) {
    this._register_studio_view_resolver();

    const shell = this._clone_studio_package_view(STUDIO_SHELL_ID);
    if (!shell) throw new Error("XStudio shell view is not registered");

    shell.class = this._studio_shell_class();
    shell._theme = this._studio_theme;
    shell["data-xstudio-theme"] = this._studio_theme;

    const canvas = this._find_view_data(shell, STUDIO_CANVAS_ID);
    if (canvas) {
      canvas._children = [
        {
          _type: "view",
          _id: main_container_id,
          class: "xstudio-main-container",
        },
      ];
    }

    this._apply_portlet_state_to_view_data(shell);

    return shell;
  }

  private _set_shell_class_enabled(class_name: string, enabled: boolean) {
    const shell = XUI.getObject(STUDIO_SHELL_ID) as any;
    if (!shell) return;

    if (enabled) {
      shell.addClass?.(class_name);
    } else {
      shell.removeClass?.(class_name);
    }
  }

  private _apply_studio_theme(theme: any = this._studio_theme) {
    this._studio_theme = this._normalize_studio_theme(theme);

    const shell = XUI.getObject(STUDIO_SHELL_ID) as any;
    if (shell) {
      for (const option of STUDIO_THEME_OPTIONS) {
        shell.removeClass?.(`${STUDIO_THEME_CLASS_PREFIX}${option}`);
      }
      shell.addClass?.(this._studio_theme_class());
      shell.dom?.setAttribute?.("data-xstudio-theme", this._studio_theme);
    }

    const selector = XUI.getObject(STUDIO_THEME_SELECTOR_ID) as any;
    if (selector) {
      const current_value = selector?.getValue?.() ?? selector?.dom?.value;
      if (current_value !== this._studio_theme) {
        if (selector.setValue) {
          selector.setValue(this._studio_theme);
        } else if (selector.dom && "value" in selector.dom) {
          selector.dom.value = this._studio_theme;
        }
      }
    }

    return this._studio_theme;
  }

  private _set_button_text(object_id: string, text: string) {
    const button = XUI.getObject(object_id) as any;
    button?.setText?.(text);
  }

  private _set_button_title(object_id: string, title: string) {
    const button = XUI.getObject(object_id) as any;
    if (button?.dom?.setAttribute) {
      button.dom.setAttribute("title", title);
    }
  }

  private _set_object_attribute(object_id: string, name: string, value: string) {
    const object = XUI.getObject(object_id) as any;
    if (!object) return;

    object[name] = value;
    object.dom?.setAttribute?.(name, value);
  }

  private _set_object_class_token(object_id: string, class_name: string, enabled: boolean) {
    const object = XUI.getObject(object_id) as any;
    if (!object) return;

    if (enabled) {
      object.addClass?.(class_name);
    } else {
      object.removeClass?.(class_name);
    }
  }

  private _set_object_visible(object_id: string, visible: boolean) {
    const object = XUI.getObject(object_id) as any;
    if (!object) return;

    object._visible = visible;
    const dom = object.dom;
    if (dom instanceof HTMLElement) {
      if (visible) {
        dom.style.removeProperty("display");
      } else {
        dom.style.display = "none";
      }
    }
  }

  private _set_portlet_button_state(portlet_id: XStudioPortletId) {
    const config = STUDIO_PORTLETS[portlet_id];
    if (!config._button_id) return;

    const visible = this._portlet_visibility[portlet_id] === true;
    this._set_button_text(config._button_id, config._label);
    this._set_button_title(config._button_id, `${visible ? "Hide" : "Show"} ${config._label}`);
    this._set_object_attribute(config._button_id, "aria-pressed", String(visible));
    this._set_object_class_token(config._button_id, STUDIO_PORTLET_TOGGLE_ACTIVE_CLASS, visible);
  }

  private _apply_portlet_state() {
    for (const portlet_id of STUDIO_PORTLET_IDS) {
      const config = STUDIO_PORTLETS[portlet_id];
      this._set_object_visible(config._object_id, this._portlet_visibility[portlet_id] === true);
      this._set_portlet_button_state(portlet_id);
    }
  }

  private _normalize_portlet_id(value: any): XStudioPortletId | "" {
    const portlet_id = String(value ?? "").trim().toLowerCase();
    return (STUDIO_PORTLET_IDS as readonly string[]).includes(portlet_id)
      ? (portlet_id as XStudioPortletId)
      : "";
  }

  private _apply_dock_state() {
    this._set_shell_class_enabled("xstudio-left-collapsed", this._left_dock_collapsed);
    this._set_shell_class_enabled("xstudio-right-collapsed", this._right_dock_collapsed);
    this._set_button_text(
      "xstudio-toggle-left-dock",
      this._left_dock_toggle_text(),
    );
    this._set_button_title(
      "xstudio-toggle-left-dock",
      this._left_dock_toggle_title(),
    );
    this._set_button_text(
      "xstudio-toggle-right-dock",
      this._right_dock_toggle_text(),
    );
    this._set_button_title(
      "xstudio-toggle-right-dock",
      this._right_dock_toggle_title(),
    );
    this._apply_portlet_state();
  }

  private _toggle_left_dock() {
    this._left_dock_collapsed = !this._left_dock_collapsed;
    this._apply_dock_state();
  }

  private _toggle_right_dock() {
    this._right_dock_collapsed = !this._right_dock_collapsed;
    this._apply_dock_state();
  }

  private async _toggle_studio() {
    try {
      if (!this._can_edit()) {
        this._log("studio toggle ignored: edit mode disabled", {
          _app_id: this._xvm_client?.getActiveAppId?.(),
        });
        return;
      }

      const active_view_id = (XVM as any).getActiveViewId?.({ region: STUDIO_REGION_ID });
      if (active_view_id === STUDIO_VIEW_ID) {
        await this._close_studio();
        return;
      }

      await (XVM as any).show?.(STUDIO_VIEW_ID, {
        region: STUDIO_REGION_ID,
        allowCreateFromRaw: true,
      });
      this._apply_dock_state();
      this._refresh_object_tree_for_current_view();
      this._log("studio opened");
    } catch (err) {
      this._error("studio toggle failed", err);
    }
  }

  private _get_cached_view(view_id: string) {
    if (!view_id) return null;
    if (typeof this._xvm_client?._read_cached_view === "function") {
      const persisted_view = this._xvm_client._read_cached_view(view_id);
      if (is_obj(persisted_view)) return persisted_view;
    }
    if (typeof this._xvm_client?.get_view === "function") {
      return this._xvm_client.get_view(view_id);
    }
    if (
      this._xvm_client?.get_current_view_id?.() === view_id &&
      typeof this._xvm_client?.get_current_view === "function"
    ) {
      return this._xvm_client.get_current_view();
    }
    return null;
  }

  private _format_tree_text(text: any, max_chars = 48) {
    if (typeof text !== "string") return "";
    const clean = text.trim().replace(/\s+/g, " ");
    if (!clean) return "";
    return clean.length > max_chars
      ? `${clean.slice(0, Math.max(0, max_chars - 3))}...`
      : clean;
  }

  private _format_object_tree_label(obj: Record<string, any>) {
    const type = typeof obj._type === "string" && obj._type.trim() ? obj._type.trim() : "object";
    const text = this._format_tree_text(obj._text, 44);
    const label = this._format_tree_text(obj._label, 44);
    const title = this._format_tree_text(obj._title, 44);
    const id = this._format_tree_text(obj._id, 28);
    const id_label = id ? `#${id}` : "";
    const view_ref = type === "xvm-view"
      ? this._format_tree_text(obj._view_id, 36)
      : "";

    const primary = text || label || title || id_label || view_ref || "(anonymous)";
    const parts = [primary, type];

    if (id_label && id_label !== primary) parts.push(id_label);
    if (view_ref && view_ref !== primary) parts.push(`ref:${view_ref}`);

    return parts.join(" | ");
  }

  private _selected_object_matches(a: XStudioSelectedObject | null, b: XStudioSelectedObject | null) {
    if (!a || !b) return false;
    if (a._source_view_id !== b._source_view_id) return false;

    const a_id = a._json_id.trim() || a._id.trim();
    const b_id = b._json_id.trim() || b._id.trim();
    if (a_id || b_id) {
      return Boolean(a_id && b_id && a_id === b_id && a._type === b._type);
    }

    return a._path === b._path && a._type === b._type;
  }

  private _safe_selected_json_preview(obj: Record<string, any> | null) {
    if (!obj) return "";
    try {
      return JSON.stringify(
        obj,
        (_key, value) => {
          if (typeof value === "function") return undefined;
          return value;
        },
        2,
      );
    } catch {
      return String(obj);
    }
  }

  private _safe_selected_json_metadata(obj: Record<string, any>) {
    const metadata = obj._meta;
    if (!is_obj(metadata)) return "";

    try {
      return JSON.stringify(metadata, (_key, value) => {
        if (typeof value === "function") return undefined;
        return value;
      });
    } catch {
      return String(metadata);
    }
  }

  private _build_object_tree_nodes(
    obj: Record<string, any>,
    source_view_id: string,
    path: string,
    parent_path: string,
    previous_sibling_id: string,
    next_sibling_id: string,
    depth: number,
    is_xvm_ref_child: boolean,
    allow_xvm_refs: boolean,
    out: XStudioObjectTreeNode[],
  ) {
    if (!is_obj(obj)) return;

    const type = typeof obj._type === "string" && obj._type.trim() ? obj._type.trim() : "object";
    const json_id = typeof obj._id === "string" && obj._id.trim() ? obj._id.trim() : "";
    const text = typeof obj._text === "string" && obj._text.trim() ? obj._text.trim() : "";
    const meta: XStudioSelectedObject = {
      _id: json_id,
      _json_id: json_id,
      _type: type,
      _text: text,
      _source_view_id: source_view_id,
      _path: path,
      _parent_path: parent_path,
      _previous_sibling_id: previous_sibling_id,
      _next_sibling_id: next_sibling_id,
      _is_xvm_ref_child: is_xvm_ref_child,
      _json_metadata: this._safe_selected_json_metadata(obj),
    };

    out.push({
      _key: "",
      _label: this._format_object_tree_label(obj),
      _meta: meta,
      _object: obj,
      _depth: depth,
    });

    if (Array.isArray(obj._children)) {
      obj._children.forEach((child: any, index: number) => {
        if (!is_obj(child)) return;
        const previous = index > 0 ? obj._children[index - 1] : null;
        const next = index < obj._children.length - 1 ? obj._children[index + 1] : null;
        this._build_object_tree_nodes(
          child,
          source_view_id,
          `${path}._children[${index}]`,
          path,
          is_obj(previous) && typeof previous._id === "string" ? previous._id.trim() : "",
          is_obj(next) && typeof next._id === "string" ? next._id.trim() : "",
          depth + 1,
          is_xvm_ref_child,
          allow_xvm_refs,
          out,
        );
      });
    }

    if (type !== "xvm-view" || !allow_xvm_refs) return;

    const ref_id = typeof obj._view_id === "string" && obj._view_id.trim() ? obj._view_id.trim() : "";
    if (!ref_id) return;

    const referenced_view = this._get_cached_view(ref_id);
    if (!is_obj(referenced_view) || !Array.isArray(referenced_view._children)) {
      out.push({
        _key: "",
        _label: "referenced view not loaded",
        _meta: null,
        _object: null,
        _depth: depth + 1,
        _placeholder: "referenced view not loaded",
      });
      return;
    }

    referenced_view._children.forEach((child: any, index: number) => {
      if (!is_obj(child)) return;
      const previous = index > 0 ? referenced_view._children[index - 1] : null;
      const next = index < referenced_view._children.length - 1 ? referenced_view._children[index + 1] : null;
      this._build_object_tree_nodes(
        child,
        ref_id,
        `$._children[${index}]`,
        "$",
        is_obj(previous) && typeof previous._id === "string" ? previous._id.trim() : "",
        is_obj(next) && typeof next._id === "string" ? next._id.trim() : "",
        depth + 1,
        true,
        false,
        out,
      );
    });
  }

  private _render_object_tree_nodes(nodes: XStudioObjectTreeNode[]) {
    const tree = XUI.getObject(STUDIO_OBJECT_TREE_ID) as any;
    if (!tree) return;

    this._object_tree_render_seq += 1;
    const seq = this._object_tree_render_seq;
    let selected_row_id = "";

    if (nodes.length === 0) {
      tree.update?.({
        _children: [
          {
            _type: "label",
            _id: `xstudio-object-tree-empty-${seq}`,
            class: "xstudio-dock-placeholder",
            _text: "No objects found.",
          },
        ],
      });
      this._selected_tree_row_id = "";
      return;
    }

    const children = nodes.map((node, index) => {
      const row_id = `xstudio-object-tree-row-${seq}-${index}`;
      node._key = row_id;
      const selected = this._selected_object_matches(this._selected_object, node._meta);
      if (selected) selected_row_id = row_id;

      if (!node._meta) {
        return {
          _type: "label",
          _id: row_id,
          class: "xstudio-object-tree-placeholder-row",
          _text: node._placeholder ?? node._label,
          _style: {
            "--xstudio-tree-indent": `${node._depth * 14}px`,
          },
        };
      }

      return {
        _type: "button",
        _id: row_id,
        type: "button",
        class: [
          "xstudio-object-tree-row",
          node._meta._is_xvm_ref_child ? "xstudio-object-tree-row-ref" : "",
          selected ? STUDIO_SELECTED_OBJECT_ROW_CLASS : "",
        ].filter(Boolean).join(" "),
        title: node._label,
        _text: node._label,
        _style: {
          "--xstudio-tree-indent": `${node._depth * 14}px`,
        },
        _on: {
          click: (event?: Event) => {
            event?.preventDefault?.();
            event?.stopPropagation?.();
            this._select_object_tree_node(node, row_id);
          },
        },
      };
    });

    this._selected_tree_row_id = selected_row_id;
    tree.update?.({ _children: children });
  }

  private _clear_selected_canvas_highlight() {
    if (this._selected_canvas_element) {
      this._selected_canvas_element.classList.remove(STUDIO_SELECTED_CANVAS_CLASS);
      this._selected_canvas_element = null;
    }
  }

  private _apply_selected_canvas_highlight(meta: XStudioSelectedObject) {
    this._clear_selected_canvas_highlight();

    if (!meta._id) {
      return "No ID";
    }

    if (typeof document === "undefined") {
      return "DOM unavailable";
    }

    const el = document.getElementById(meta._id);
    if (!(el instanceof HTMLElement)) {
      return "DOM element not found";
    }

    const canvas = document.getElementById("xstudio-canvas");
    if (canvas instanceof HTMLElement && !canvas.contains(el)) {
      return "DOM element not found";
    }

    el.classList.add(STUDIO_SELECTED_CANVAS_CLASS);
    this._selected_canvas_element = el;
    return "Highlighted";
  }

  private _mark_selected_tree_row(row_id: string) {
    if (typeof document === "undefined") return;

    document
      .querySelectorAll(`.${STUDIO_SELECTED_OBJECT_ROW_CLASS}`)
      .forEach((el) => el.classList.remove(STUDIO_SELECTED_OBJECT_ROW_CLASS));

    const row = document.getElementById(row_id);
    row?.classList.add(STUDIO_SELECTED_OBJECT_ROW_CLASS);
    this._selected_tree_row_id = row_id;
  }

  private _set_selected_object_label(object_id: string, label: string, value?: string) {
    const text = value && value.trim() ? `${label}: ${value.trim()}` : `${label}: -`;
    this._set_studio_label(object_id, text);
  }

  private _format_selected_object_summary_line(selected: XStudioSelectedObject | null) {
    if (!selected) return "No object selected";

    const type = selected._type.trim() || "object";
    const identity =
      selected._json_id.trim() ||
      selected._text.trim() ||
      selected._id.trim() ||
      selected._path.trim();

    return identity ? `${type} · ${identity}` : type;
  }

  private _format_selected_object_summary_text(selected: XStudioSelectedObject | null) {
    if (!selected) return "";

    const id = selected._json_id.trim() || selected._id.trim();
    const text = selected._text.trim();
    if (!id || !text || text === id) return "";

    return text;
  }

  private _has_own_field(obj: Record<string, any>, field: string) {
    return Object.prototype.hasOwnProperty.call(obj, field);
  }

  private _primitive_field_as_string(obj: Record<string, any>, field: string) {
    if (!this._has_own_field(obj, field)) return "";
    const value = obj[field];
    if (value === undefined || value === null) return "";
    if (typeof value === "object" || typeof value === "function") return "";
    return String(value);
  }

  private _class_field_as_string(obj: Record<string, any>) {
    const class_value = this._primitive_field_as_string(obj, "class");
    if (class_value) return class_value;
    return this._primitive_field_as_string(obj, "_class");
  }

  private _disabled_field_as_string(obj: Record<string, any>) {
    if (this._has_own_field(obj, "disabled")) {
      const value = obj.disabled;
      return typeof value === "boolean" ? String(value) : this._primitive_field_as_string(obj, "disabled");
    }

    if (this._has_own_field(obj, "_disabled")) {
      const value = obj._disabled;
      return typeof value === "boolean" ? String(value) : this._primitive_field_as_string(obj, "_disabled");
    }

    return "";
  }

  private _first_style_draft(obj: Record<string, any>) {
    const style_object = is_obj(obj._style)
      ? obj._style
      : (is_obj(obj.style) ? obj.style : null);

    if (!style_object) {
      return {
        _style_property: "",
        _style_value: "",
      };
    }

    for (const [name, value] of Object.entries(style_object)) {
      if (value === undefined || value === null) continue;
      if (typeof value === "object" || typeof value === "function") continue;
      return {
        _style_property: String(name),
        _style_value: String(value),
      };
    }

    return {
      _style_property: "",
      _style_value: "",
    };
  }

  private _selected_object_inspector_draft_from_json(obj: Record<string, any> | null) {
    if (!obj) return empty_selected_object_inspector_draft();

    const style = this._first_style_draft(obj);
    return {
      _text: this._primitive_field_as_string(obj, "_text"),
      _class: this._class_field_as_string(obj),
      _style_property: style._style_property,
      _style_value: style._style_value,
      _disabled: this._disabled_field_as_string(obj),
      _placeholder: this._primitive_field_as_string(obj, "placeholder"),
    };
  }

  private _set_studio_control_value(object_id: string, value: string) {
    const control = XUI.getObject(object_id) as any;
    if (!control) return;

    if (typeof control.setValue === "function") {
      control.setValue(value);
    } else if (control.dom && "value" in control.dom) {
      control.dom.value = value;
    }

    control.value = value;
  }

  private _read_studio_control_value(object_id: string) {
    const control = XUI.getObject(object_id) as any;
    if (!control) return "";

    if (typeof control.getValue === "function") {
      return String(control.getValue() ?? "");
    }

    if (control.dom && "value" in control.dom) {
      return String(control.dom.value ?? "");
    }

    return "";
  }

  private _write_selected_object_json_editor(value: string) {
    _xd.set(_XD_KEYS.STUDIO_SELECTED_OBJECT_RAW_JSON, value, { source: "xstudio-selected-object-json" });
    this._set_studio_control_value(STUDIO_SELECTED_OBJECT_JSON_ID, value);
  }

  private _set_studio_control_disabled(object_id: string, disabled: boolean) {
    const control = XUI.getObject(object_id) as any;
    if (!control) return;

    control.disabled = disabled;

    if (control.dom instanceof HTMLElement) {
      if (disabled) {
        control.dom.setAttribute("disabled", "true");
      } else {
        control.dom.removeAttribute("disabled");
      }
    }
  }

  private _apply_selected_object_details_state() {
    const details = XUI.getObject(STUDIO_SELECTED_OBJECT_DETAILS_ID) as any;
    const toggle = XUI.getObject(STUDIO_SELECTED_OBJECT_DETAILS_TOGGLE_ID) as any;
    this._set_object_class_token(
      STUDIO_SELECTED_OBJECT_DETAILS_ID,
      STUDIO_SELECTED_OBJECT_DETAILS_EXPANDED_CLASS,
      this._selected_object_details_expanded,
    );

    if (this._selected_object_details_expanded) {
      details?.show?.();
    } else {
      details?.hide?.();
    }

    toggle?.setText?.(
      this._selected_object_details_expanded
        ? "Details ▲"
        : "Details ▼",
    );
  }

  private _toggle_selected_object_details() {
    this._selected_object_details_expanded = !this._selected_object_details_expanded;
    this._apply_selected_object_details_state();
  }

  private _reset_selected_object_json_editor() {
    if (!this._selected_object) {
      this._write_studio_status("Select an object first");
      this._log("selected object JSON reset ignored", { _message: "Select an object first" });
      return;
    }

    this._write_selected_object_json_editor(this._selected_object_json);
    this._write_studio_status("Reset selected object JSON");
  }

  private _selected_object_json_error(message: string) {
    this._write_studio_status(message);
    this._log("selected object JSON update ignored", { _message: message });
  }

  private _write_selected_object_inspector_draft(
    draft: XStudioSelectedObjectInspectorDraft | null,
    source: string,
  ) {
    _xd.set(_XD_KEYS.STUDIO_SELECTED_OBJECT_INSPECTOR_DRAFT, draft, { source });
    _xd.set(_XD_KEYS.STUDIO_SELECTED_OBJECT_DRAFT_TEXT, draft?._text ?? "", { source });
    _xd.set(_XD_KEYS.STUDIO_SELECTED_OBJECT_DRAFT_CLASS, draft?._class ?? "", { source });
    _xd.set(_XD_KEYS.STUDIO_SELECTED_OBJECT_DRAFT_STYLE_PROPERTY, draft?._style_property ?? "", { source });
    _xd.set(_XD_KEYS.STUDIO_SELECTED_OBJECT_DRAFT_STYLE_VALUE, draft?._style_value ?? "", { source });
    _xd.set(_XD_KEYS.STUDIO_SELECTED_OBJECT_DRAFT_DISABLED, draft?._disabled ?? "", { source });
    _xd.set(_XD_KEYS.STUDIO_SELECTED_OBJECT_DRAFT_PLACEHOLDER, draft?._placeholder ?? "", { source });
  }

  private _set_selected_object_inspector_controls(
    draft: XStudioSelectedObjectInspectorDraft,
    has_selected_object: boolean,
  ) {
    this._set_studio_control_value(STUDIO_SELECTED_OBJECT_EDIT_TEXT_ID, draft._text);
    this._set_studio_control_value(STUDIO_SELECTED_OBJECT_EDIT_CLASS_ID, draft._class);
    this._set_studio_control_value(STUDIO_SELECTED_OBJECT_EDIT_STYLE_PROPERTY_ID, draft._style_property);
    this._set_studio_control_value(STUDIO_SELECTED_OBJECT_EDIT_STYLE_VALUE_ID, draft._style_value);
    this._set_studio_control_value(STUDIO_SELECTED_OBJECT_EDIT_DISABLED_ID, draft._disabled);
    this._set_studio_control_value(STUDIO_SELECTED_OBJECT_EDIT_PLACEHOLDER_ID, draft._placeholder);

    for (const control_id of STUDIO_SELECTED_OBJECT_INSPECTOR_CONTROL_IDS) {
      this._set_studio_control_disabled(control_id, !has_selected_object);
    }
  }

  private _parse_children_path_indices(path: string) {
    if (path === "$") return [] as number[];
    if (!path.startsWith("$._children[")) return null;

    const indices: number[] = [];
    let offset = 1;
    while (offset < path.length) {
      const match = path.slice(offset).match(/^\._children\[(\d+)\]/);
      if (!match) return null;
      indices.push(Number(match[1]));
      offset += match[0].length;
    }

    return indices;
  }

  private _get_cached_json_node_by_path(
    root: Record<string, any>,
    path: string,
  ): Record<string, any> | null {
    const indices = this._parse_children_path_indices(path.trim());
    if (!indices) return null;

    let current: Record<string, any> = root;
    for (const index of indices) {
      if (!Array.isArray(current._children)) return null;
      const child = current._children[index];
      if (!is_obj(child)) return null;
      current = child;
    }

    return current;
  }

  private _sibling_context_from_parent_children(
    children: any[],
    index: number,
  ): XStudioSelectedObjectSiblingContext | null {
    const current = children[index];
    if (!is_obj(current)) return null;

    const previous = index > 0 ? children[index - 1] : null;
    const next = index < children.length - 1 ? children[index + 1] : null;
    const previous_id =
      is_obj(previous) && typeof previous._id === "string"
        ? previous._id.trim()
        : "";
    const next_id =
      is_obj(next) && typeof next._id === "string"
        ? next._id.trim()
        : "";

    return {
      _is_root: false,
      _previous_sibling_id: previous_id,
      _next_sibling_id: next_id,
    };
  }

  private _find_selected_object_sibling_context_by_path(
    view: Record<string, any>,
    selected: XStudioSelectedObject,
  ): XStudioSelectedObjectSiblingContext | null {
    const path = selected._path.trim();
    const parent_path = selected._parent_path.trim();
    const indices = this._parse_children_path_indices(path);
    const parent_indices = this._parse_children_path_indices(parent_path || "$");
    if (!indices || !parent_indices) return null;
    if (indices.length === 0) {
      return {
        _is_root: true,
        _previous_sibling_id: "",
        _next_sibling_id: "",
      };
    }

    const parent = this._get_cached_json_node_by_path(view, parent_path || "$");
    if (!parent) return null;

    if (!Array.isArray(parent._children)) return null;
    const index = indices[indices.length - 1];
    const current = parent._children[index];
    if (!is_obj(current)) return null;

    const selected_id = selected._json_id.trim();
    const current_id = typeof current._id === "string" ? current._id.trim() : "";
    if (!selected_id || !current_id || selected_id !== current_id) return null;

    return this._sibling_context_from_parent_children(parent._children, index);
  }

  private _selected_object_sibling_context(
    selected: XStudioSelectedObject | null = this._selected_object,
  ) {
    if (!selected) return null;

    const source_view_id = selected._source_view_id.trim();
    if (!source_view_id) return null;

    const view = this._get_cached_view(source_view_id);
    if (!is_obj(view)) return null;

    return this._find_selected_object_sibling_context_by_path(view, selected);
  }

  private _set_selected_object_move_controls(
    selected: XStudioSelectedObject | null = this._selected_object,
  ) {
    const sibling_context = this._selected_object_sibling_context(selected);
    const has_movable_selection = Boolean(
      selected &&
      selected._json_id.trim() &&
      selected._source_view_id.trim() &&
      sibling_context &&
      !sibling_context._is_root,
    );

    this._set_studio_control_disabled(
      STUDIO_SELECTED_OBJECT_MOVE_UP_ID,
      !(has_movable_selection && Boolean(sibling_context?._previous_sibling_id)),
    );
    this._set_studio_control_disabled(
      STUDIO_SELECTED_OBJECT_MOVE_DOWN_ID,
      !(has_movable_selection && Boolean(sibling_context?._next_sibling_id)),
    );
  }

  private _selected_object_is_root_view(selected: XStudioSelectedObject | null) {
    if (!selected) return false;
    if (selected._path.trim() === "$") return true;
    return this._selected_object_sibling_context(selected)?._is_root === true;
  }

  private _set_selected_object_delete_controls(
    selected: XStudioSelectedObject | null = this._selected_object,
  ) {
    this._set_studio_control_disabled(
      STUDIO_SELECTED_OBJECT_DELETE_REQUEST_ID,
      !selected || this._selected_object_is_root_view(selected),
    );
  }

  private _set_selected_object_visibility_controls(
    selected: XStudioSelectedObject | null = this._selected_object,
  ) {
    const disabled = !selected ||
      !selected._json_id.trim() ||
      this._selected_object_is_root_view(selected);

    this._set_studio_control_disabled(STUDIO_SELECTED_OBJECT_HIDE_ID, disabled);
    this._set_studio_control_disabled(STUDIO_SELECTED_OBJECT_SHOW_ID, disabled);
  }

  private _set_selected_object_duplicate_controls(
    selected: XStudioSelectedObject | null = this._selected_object,
  ) {
    this._set_studio_control_disabled(
      STUDIO_SELECTED_OBJECT_DUPLICATE_ID,
      !selected ||
        !selected._json_id.trim() ||
        this._selected_object_is_root_view(selected),
    );
  }

  private _populate_selected_object_inspector_draft(obj: Record<string, any> | null) {
    this._selected_object_inspector_draft = this._selected_object_inspector_draft_from_json(obj);
    this._write_selected_object_inspector_draft(
      this._selected_object_inspector_draft,
      "xstudio-object-tree",
    );
    this._set_selected_object_inspector_controls(this._selected_object_inspector_draft, obj !== null);
  }

  private _clear_selected_object_inspector_draft() {
    this._selected_object_inspector_draft = empty_selected_object_inspector_draft();
    this._write_selected_object_inspector_draft(null, "xstudio-object-tree");
    this._set_selected_object_inspector_controls(this._selected_object_inspector_draft, false);
  }

  private _read_selected_object_inspector_draft_from_controls() {
    return {
      _text: this._read_studio_control_value(STUDIO_SELECTED_OBJECT_EDIT_TEXT_ID),
      _class: this._read_studio_control_value(STUDIO_SELECTED_OBJECT_EDIT_CLASS_ID),
      _style_property: this._read_studio_control_value(STUDIO_SELECTED_OBJECT_EDIT_STYLE_PROPERTY_ID),
      _style_value: this._read_studio_control_value(STUDIO_SELECTED_OBJECT_EDIT_STYLE_VALUE_ID),
      _disabled: this._read_studio_control_value(STUDIO_SELECTED_OBJECT_EDIT_DISABLED_ID),
      _placeholder: this._read_studio_control_value(STUDIO_SELECTED_OBJECT_EDIT_PLACEHOLDER_ID),
    };
  }

  private _selected_object_apply_error(message: string, field: XStudioSelectedObjectInspectorField) {
    this._write_studio_status(message);
    this._log("selected object inspector apply ignored", { _field: field, _message: message });
  }

  private _selected_object_move_error(message: string, direction: "up" | "down") {
    this._write_studio_status(message);
    this._log("selected object move ignored", { _direction: direction, _message: message });
  }

  private _selected_object_visibility_error(message: string, action: "hide" | "show", selected: XStudioSelectedObject | null) {
    this._write_studio_status(message);
    this._log("selected object visibility ignored", {
      _action: action,
      _message: message,
      ...this._selected_object_persisted_metadata(selected),
    });
  }

  private _selected_object_duplicate_error(message: string, selected: XStudioSelectedObject | null) {
    this._write_studio_status(message);
    this._log("selected object duplicate ignored", {
      _message: message,
      ...this._selected_object_persisted_metadata(selected),
    });
  }

  private _selected_object_delete_error(message: string, selected: XStudioSelectedObject | null) {
    this._write_studio_status(message);
    this._log("selected object delete ignored", {
      _message: message,
      ...this._selected_object_persisted_metadata(selected),
    });
  }

  private _selected_object_persisted_metadata(selected: XStudioSelectedObject | null) {
    return {
      _selected_id: selected?._id ?? "",
      _json_id: selected?._json_id ?? "",
      _source_view_id: selected?._source_view_id ?? "",
      _path: selected?._path ?? "",
      _parent_path: selected?._parent_path ?? "",
    };
  }

  private _log_selected_object_persisted_metadata(selected: XStudioSelectedObject | null) {
    this._log(
      "selected object persisted metadata",
      this._selected_object_persisted_metadata(selected),
    );
  }

  private _selected_object_json_id(selected: XStudioSelectedObject | null) {
    return selected?._json_id?.trim() ?? "";
  }

  private _selected_object_persisted_id_error(context: string, selected: XStudioSelectedObject | null) {
    this._write_studio_status("selected object has no persisted JSON id");
    this._log(`${context} ignored`, {
      _message: "selected object has no persisted JSON id",
      ...this._selected_object_persisted_metadata(selected),
    });
  }

  private _format_apply_view_edit_failure(result: any) {
    const error_value = result?._error;
    const error = is_obj(error_value) ? error_value : {};
    const details = is_obj(error._details) ? error._details : {};
    const error_message =
      typeof error_value === "string" && error_value.trim()
        ? error_value.trim()
        : "";
    const message =
      typeof error._message === "string" && error._message.trim()
        ? error._message.trim()
        : error_message ||
          (typeof result?._message === "string" && result._message.trim()
            ? result._message.trim()
            : "");
    const reason =
      typeof result?._reason === "string" && result._reason.trim()
        ? result._reason.trim()
        : typeof error._reason === "string" && error._reason.trim()
          ? error._reason.trim()
          : typeof details._reason === "string" && details._reason.trim()
            ? details._reason.trim()
            : "";
    const code =
      typeof error._code === "string" && error._code.trim()
        ? error._code.trim()
        : "";
    const primary = message || reason || code || "Structured view edit failed";

    if (reason && primary !== reason && !primary.includes(reason)) {
      return `Apply failed: ${primary} (${reason})`;
    }

    return `Apply failed: ${primary}`;
  }

  private _extract_new_target_id(result: any): string {
    const candidates = [
      result?._new_target_id,
      result?._result?._new_target_id,
      result?._mutation?._new_target_id,
      result?._result?._mutation?._new_target_id,
    ];

    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate.trim();
      }
    }

    return "";
  }

  private _build_selected_object_inspector_edit_params(
    field: XStudioSelectedObjectInspectorField,
    selected: XStudioSelectedObject,
    draft: XStudioSelectedObjectInspectorDraft,
    app_id: string,
    env: string,
  ) {
    const view_id = selected._source_view_id.trim();
    const id = selected._json_id.trim();
    const type = selected._type.trim() || "object";
    const base: XStudioSelectedObjectApplyViewEditParams = {
      _app_id: app_id,
      _env: env,
      _view_id: view_id,
      _edit_action: "set-property",
      _target_id: id,
      _target_type: type,
    };

    if (field === "text") {
      return {
        _ok: true,
        _error: "",
        _params: {
          ...base,
          _property_name: "_text",
          _property_value: draft._text,
        },
      };
    }

    if (field === "class") {
      return {
        _ok: true,
        _error: "",
        _params: {
          ...base,
          _property_name: "class",
          _property_value: draft._class,
        },
      };
    }

    if (field === "style") {
      const property = draft._style_property.trim();
      if (!property) {
        return {
          _ok: false,
          _error: "Enter a style property first",
          _params: null,
        };
      }

      return {
        _ok: true,
        _error: "",
        _params: {
          ...base,
          _edit_action: "set-style",
          _style_property: property,
          _style_value: draft._style_value,
        },
      };
    }

    if (field === "disabled") {
      const disabled = draft._disabled.trim().toLowerCase();
      if (disabled !== "true" && disabled !== "false") {
        return {
          _ok: false,
          _error: "Choose disabled true or false first",
          _params: null,
        };
      }

      return {
        _ok: true,
        _error: "",
        _params: {
          ...base,
          _property_name: "disabled",
          _property_value: disabled === "true",
        },
      };
    }

    return {
      _ok: true,
      _error: "",
      _params: {
        ...base,
        _property_name: "placeholder",
        _property_value: draft._placeholder,
      },
    };
  }

  private async _apply_selected_object_inspector_field(field: XStudioSelectedObjectInspectorField) {
    if (!this._selected_object) {
      this._set_selected_object_inspector_controls(this._selected_object_inspector_draft, false);
      this._selected_object_apply_error("Select an object first", field);
      return;
    }

    const target_id = this._selected_object_json_id(this._selected_object);
    if (!target_id) {
      this._selected_object_persisted_id_error("selected object inspector apply", this._selected_object);
      return;
    }

    if (!this._selected_object._source_view_id.trim()) {
      this._selected_object_apply_error("Selected object has no source view", field);
      return;
    }

    this._selected_object_inspector_draft = this._read_selected_object_inspector_draft_from_controls();
    this._write_selected_object_inspector_draft(
      this._selected_object_inspector_draft,
      "xstudio-selected-object-inspector",
    );

    const app_id = this._client().getActiveAppId();
    const env = this._client().getActiveEnv();

    if (!app_id) {
      this._selected_object_apply_error("No active app selected", field);
      return;
    }

    if (!env) {
      this._selected_object_apply_error("No active environment selected", field);
      return;
    }

    const edit_result = this._build_selected_object_inspector_edit_params(
      field,
      this._selected_object,
      this._selected_object_inspector_draft,
      app_id,
      env,
    );

    if (!edit_result._ok || !edit_result._params) {
      this._selected_object_apply_error(edit_result._error, field);
      return;
    }

    this._write_studio_status(`Applying selected object ${field}...`);
    this._log("selected object inspector apply request", {
      _field: field,
      _source_view_id: edit_result._params._view_id,
      _target_id: edit_result._params._target_id,
      _edit_action: edit_result._params._edit_action,
      _path: this._selected_object._path,
      _parent_path: this._selected_object._parent_path,
    });

    try {
      const result =
        await this._send_xvibe_command("apply-view-edit", edit_result._params);
      if (!is_obj(result) || result._ok !== true) {
        this._write_studio_status(this._format_apply_view_edit_failure(result));
        this._error("selected object inspector apply failed", {
          _field: field,
          _structured_error: result,
        });
        return;
      }

      this._write_studio_status(`Applied selected object ${field}`);
      this._log("selected object inspector apply result", {
        _field: field,
        _result: result,
      });
    } catch (err) {
      const message = `Apply failed: ${to_err(err)}`;
      this._write_studio_status(message);
      this._error("selected object inspector apply failed", {
        _field: field,
        _error: to_err(err),
      });
    }
  }

  private async _update_selected_object_json_from_editor() {
    const selected = this._selected_object;

    if (!selected) {
      this._selected_object_json_error("Select an object first");
      return;
    }

    const target_id = this._selected_object_json_id(selected);
    if (!target_id) {
      this._selected_object_persisted_id_error("selected object JSON update", selected);
      return;
    }

    if (!selected._source_view_id.trim()) {
      this._selected_object_json_error("Selected object has no source view");
      return;
    }

    if (selected._path === "$") {
      this._selected_object_json_error("Root view JSON editing is not supported in V1");
      return;
    }

    const raw_json = this._read_studio_control_value(STUDIO_SELECTED_OBJECT_JSON_ID);
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw_json);
    } catch (err) {
      this._selected_object_json_error(`Invalid JSON: ${to_err(err)}`);
      return;
    }

    if (!is_obj(parsed)) {
      this._selected_object_json_error("Selected object JSON must be an object");
      return;
    }

    const parsed_id = typeof parsed._id === "string" ? parsed._id.trim() : "";
    if (parsed_id !== target_id) {
      this._selected_object_json_error("Selected object JSON must keep the same _id");
      return;
    }

    const parsed_type = typeof parsed._type === "string" ? parsed._type.trim() : "";
    if (parsed_type !== selected._type) {
      this._selected_object_json_error("Selected object JSON must keep the same _type");
      return;
    }

    const app_id = this._client().getActiveAppId();
    const env = this._client().getActiveEnv();

    if (!app_id) {
      this._selected_object_json_error("No active app selected");
      return;
    }

    if (!env) {
      this._selected_object_json_error("No active environment selected");
      return;
    }

    const params: XStudioSelectedObjectApplyViewEditParams = {
      _app_id: app_id,
      _env: env,
      _view_id: selected._source_view_id.trim(),
      _edit_action: "replace-object",
      _target_id: target_id,
      _target_type: selected._type.trim(),
      _object_value: parsed,
    };

    this._write_studio_status("Updating selected object JSON...");
    this._log("selected object JSON update request", {
      _source_view_id: params._view_id,
      _target_id: params._target_id,
      _target_type: params._target_type,
      _path: selected._path,
      _parent_path: selected._parent_path,
    });

    try {
      const result =
        await this._send_xvibe_command("apply-view-edit", params);
      if (!is_obj(result) || result._ok !== true) {
        this._write_studio_status(this._format_apply_view_edit_failure(result));
        this._error("selected object JSON update failed", {
          _structured_error: result,
        });
        return;
      }

      this._write_studio_status("Updated selected object JSON");
      this._log("selected object JSON update result", {
        _result: result,
      });
    } catch (err) {
      const message = `Update JSON failed: ${to_err(err)}`;
      this._write_studio_status(message);
      this._error("selected object JSON update failed", {
        _error: to_err(err),
      });
    }
  }

  private async _move_selected_object(direction: "up" | "down") {
    const selected = this._selected_object;

    if (!selected) {
      this._set_selected_object_move_controls(null);
      this._selected_object_move_error("Select an object first", direction);
      return;
    }

    const target_id = this._selected_object_json_id(selected);
    if (!target_id) {
      this._set_selected_object_move_controls(selected);
      this._selected_object_persisted_id_error("selected object move", selected);
      return;
    }

    const source_view_id = selected._source_view_id.trim();
    if (!source_view_id) {
      this._selected_object_move_error("Selected object has no source view", direction);
      return;
    }

    const sibling_context = this._selected_object_sibling_context(selected);
    if (!sibling_context || sibling_context._is_root) {
      this._set_selected_object_move_controls(selected);
      this._selected_object_move_error("Root object cannot be moved", direction);
      return;
    }

    this._log("move-object resolved siblings", {
      _target_id: target_id,
      _source_view_id: source_view_id,
      _previous_sibling_id: sibling_context._previous_sibling_id,
      _next_sibling_id: sibling_context._next_sibling_id,
    });

    const anchor_id =
      direction === "up"
        ? sibling_context._previous_sibling_id
        : sibling_context._next_sibling_id;
    if (!anchor_id) {
      this._set_selected_object_move_controls(selected);
      this._selected_object_move_error(
        direction === "up"
          ? "Selected object is already the first child"
          : "Selected object is already the last child",
        direction,
      );
      return;
    }

    const app_id = this._client().getActiveAppId();
    const env = this._client().getActiveEnv();

    if (!app_id) {
      this._selected_object_move_error("No active app selected", direction);
      return;
    }

    if (!env) {
      this._selected_object_move_error("No active environment selected", direction);
      return;
    }

    const params: XStudioSelectedObjectApplyViewEditParams = {
      _app_id: app_id,
      _env: env,
      _view_id: source_view_id,
      _edit_action: "move-object",
      _target_id: target_id,
      _target_type: selected._type.trim() || "object",
      ...(direction === "up"
        ? { _before_id: anchor_id }
        : { _after_id: anchor_id }),
    };

    this._write_studio_status(
      direction === "up"
        ? "Moving selected object up..."
        : "Moving selected object down...",
    );
    this._log("selected object move request", {
      _direction: direction,
      _source_view_id: params._view_id,
      _target_id: params._target_id,
      _target_type: params._target_type,
      _before_id: params._before_id,
      _after_id: params._after_id,
      _path: selected._path,
      _parent_path: selected._parent_path,
    });

    try {
      const result = await this._send_xvibe_command("apply-view-edit", params);
      if (!is_obj(result) || result._ok !== true) {
        this._write_studio_status(this._format_apply_view_edit_failure(result));
        this._error("selected object move failed", {
          _direction: direction,
          _structured_error: result,
        });
        return;
      }

      this._write_studio_status(
        direction === "up"
          ? "Moved selected object up"
          : "Moved selected object down",
      );
      this._log("selected object move result", {
        _direction: direction,
        _result: result,
      });
    } catch (err) {
      const message = `Move ${direction} failed: ${to_err(err)}`;
      this._write_studio_status(message);
      this._error("selected object move failed", {
        _direction: direction,
        _error: to_err(err),
      });
    }
  }

  private async _apply_selected_object_visibility(action: "hide" | "show") {
    const selected = this._selected_object;

    if (!selected) {
      this._set_selected_object_visibility_controls(null);
      this._selected_object_visibility_error("Select an object first", action, null);
      return;
    }

    const target_id = this._selected_object_json_id(selected);
    if (!target_id) {
      this._set_selected_object_visibility_controls(selected);
      this._selected_object_persisted_id_error(`selected object ${action}`, selected);
      return;
    }

    const source_view_id = selected._source_view_id.trim();
    if (!source_view_id) {
      this._selected_object_visibility_error("Selected object has no source view", action, selected);
      return;
    }

    if (this._selected_object_is_root_view(selected)) {
      this._set_selected_object_visibility_controls(selected);
      this._selected_object_visibility_error("Root object visibility cannot be edited", action, selected);
      return;
    }

    const app_id = this._client().getActiveAppId();
    const env = this._client().getActiveEnv();

    if (!app_id) {
      this._selected_object_visibility_error("No active app selected", action, selected);
      return;
    }

    if (!env) {
      this._selected_object_visibility_error("No active environment selected", action, selected);
      return;
    }

    const params: XStudioSelectedObjectApplyViewEditParams = {
      _app_id: app_id,
      _env: env,
      _view_id: source_view_id,
      _target_id: target_id,
      _target_type: selected._type.trim() || "object",
      _edit_action: action === "hide" ? "hide-object" : "show-object",
    };

    this._write_studio_status(
      action === "hide"
        ? "Hiding selected object..."
        : "Showing selected object...",
    );
    this._log("selected object visibility request", {
      _action: action,
      _source_view_id: params._view_id,
      _target_id: params._target_id,
      _target_type: params._target_type,
      _edit_action: params._edit_action,
      _path: selected._path,
      _parent_path: selected._parent_path,
    });

    try {
      const result = await this._send_xvibe_command("apply-view-edit", params);
      if (!is_obj(result) || result._ok !== true) {
        this._write_studio_status(this._format_apply_view_edit_failure(result));
        this._error("selected object visibility failed", {
          _action: action,
          _structured_error: result,
        });
        return;
      }

      this._write_studio_status(
        action === "hide"
          ? "Hidden selected object"
          : "Shown selected object",
      );
      this._log("selected object visibility result", {
        _action: action,
        _result: result,
      });
      this._refresh_object_tree_for_current_view();
    } catch (err) {
      const message = `${action === "hide" ? "Hide" : "Show"} failed: ${to_err(err)}`;
      this._write_studio_status(message);
      this._error("selected object visibility failed", {
        _action: action,
        _error: to_err(err),
      });
    }
  }

  private async _duplicate_selected_object() {
    const selected = this._selected_object;

    if (!selected) {
      this._set_selected_object_duplicate_controls(null);
      this._selected_object_duplicate_error("Select an object first", null);
      return;
    }

    const target_id = this._selected_object_json_id(selected);
    if (!target_id) {
      this._set_selected_object_duplicate_controls(selected);
      this._selected_object_persisted_id_error("selected object duplicate", selected);
      return;
    }

    const source_view_id = selected._source_view_id.trim();
    if (!source_view_id) {
      this._selected_object_duplicate_error("Selected object has no source view", selected);
      return;
    }

    if (this._selected_object_is_root_view(selected)) {
      this._set_selected_object_duplicate_controls(selected);
      this._selected_object_duplicate_error("Root object cannot be duplicated", selected);
      return;
    }

    const app_id = this._client().getActiveAppId();
    const env = this._client().getActiveEnv();

    if (!app_id) {
      this._selected_object_duplicate_error("No active app selected", selected);
      return;
    }

    if (!env) {
      this._selected_object_duplicate_error("No active environment selected", selected);
      return;
    }

    const params: XStudioSelectedObjectApplyViewEditParams = {
      _app_id: app_id,
      _env: env,
      _view_id: source_view_id,
      _target_id: target_id,
      _target_type: selected._type.trim() || "object",
      _edit_action: "duplicate-object",
    };

    this._write_studio_status("Duplicating selected object...");
    this._log("selected object duplicate request", {
      _source_view_id: params._view_id,
      _target_id: params._target_id,
      _target_type: params._target_type,
      _edit_action: params._edit_action,
      _path: selected._path,
      _parent_path: selected._parent_path,
    });

    try {
      const result = await this._send_xvibe_command("apply-view-edit", params);
      if (!is_obj(result) || result._ok !== true) {
        this._write_studio_status(this._format_apply_view_edit_failure(result));
        this._error("selected object duplicate failed", {
          _structured_error: result,
        });
        return;
      }

      const new_target_id = this._extract_new_target_id(result);
      if (new_target_id) {
        this._selected_object_pending_select_id = new_target_id;
      }

      this._write_studio_status(
        new_target_id
          ? "Duplicated selected object"
          : "Duplicated selected object; preserved selection",
      );
      this._log("selected object duplicate result", {
        _new_target_id: new_target_id,
        _result: result,
      });
      this._refresh_object_tree_for_current_view();
    } catch (err) {
      const message = `Duplicate failed: ${to_err(err)}`;
      this._write_studio_status(message);
      this._error("selected object duplicate failed", {
        _error: to_err(err),
      });
    }
  }

  private _format_selected_object_delete_name(selected: XStudioSelectedObject) {
    const text = selected._text.trim();
    if (text) return text;

    const json_id = selected._json_id.trim();
    if (json_id) return json_id;

    const id = selected._id.trim();
    return id || "-";
  }

  private _hide_delete_selected_object_dialog() {
    this._selected_object_pending_delete = null;
    this._set_studio_control_disabled(STUDIO_SELECTED_OBJECT_DELETE_CANCEL_ID, false);
    this._set_studio_control_disabled(STUDIO_SELECTED_OBJECT_DELETE_CONFIRM_ID, false);
    const dialog = XUI.getObject(STUDIO_SELECTED_OBJECT_DELETE_DIALOG_ID) as any;
    dialog?.hide?.();
  }

  private _request_delete_selected_object() {
    const selected = this._selected_object;

    if (!selected) {
      this._set_selected_object_delete_controls(null);
      this._selected_object_delete_error("Select an object first", null);
      return;
    }

    if (this._selected_object_is_root_view(selected)) {
      this._set_selected_object_delete_controls(selected);
      this._selected_object_delete_error("Root view cannot be deleted", selected);
      return;
    }

    this._selected_object_pending_delete = { ...selected };
    this._set_studio_label(STUDIO_SELECTED_OBJECT_DELETE_TYPE_ID, selected._type.trim() || "-");
    this._set_studio_label(STUDIO_SELECTED_OBJECT_DELETE_NAME_ID, this._format_selected_object_delete_name(selected));
    this._set_studio_control_disabled(STUDIO_SELECTED_OBJECT_DELETE_CANCEL_ID, false);
    this._set_studio_control_disabled(STUDIO_SELECTED_OBJECT_DELETE_CONFIRM_ID, false);

    const dialog = XUI.getObject(STUDIO_SELECTED_OBJECT_DELETE_DIALOG_ID) as any;
    dialog?.show?.();
  }

  private async _confirm_delete_selected_object() {
    const selected = this._selected_object_pending_delete;

    if (!selected) {
      this._hide_delete_selected_object_dialog();
      this._selected_object_delete_error("Select an object first", null);
      return;
    }

    const target_id = this._selected_object_json_id(selected);
    if (!target_id) {
      this._hide_delete_selected_object_dialog();
      this._selected_object_persisted_id_error("selected object delete", selected);
      return;
    }

    const source_view_id = selected._source_view_id.trim();
    if (!source_view_id) {
      this._hide_delete_selected_object_dialog();
      this._selected_object_delete_error("Selected object has no source view", selected);
      return;
    }

    if (this._selected_object_is_root_view(selected)) {
      this._hide_delete_selected_object_dialog();
      this._set_selected_object_delete_controls(selected);
      this._selected_object_delete_error("Root view cannot be deleted", selected);
      return;
    }

    const app_id = this._client().getActiveAppId();
    const env = this._client().getActiveEnv();

    if (!app_id) {
      this._selected_object_delete_error("No active app selected", selected);
      return;
    }

    if (!env) {
      this._selected_object_delete_error("No active environment selected", selected);
      return;
    }

    const params: XStudioSelectedObjectApplyViewEditParams = {
      _app_id: app_id,
      _env: env,
      _view_id: source_view_id,
      _target_id: target_id,
      _target_type: selected._type.trim() || "object",
      _edit_action: "remove-object",
    };

    this._set_studio_control_disabled(STUDIO_SELECTED_OBJECT_DELETE_CANCEL_ID, true);
    this._set_studio_control_disabled(STUDIO_SELECTED_OBJECT_DELETE_CONFIRM_ID, true);
    this._write_studio_status("Deleting selected object...");
    this._log("selected object delete request", {
      _source_view_id: params._view_id,
      _target_id: params._target_id,
      _target_type: params._target_type,
      _edit_action: params._edit_action,
      _path: selected._path,
      _parent_path: selected._parent_path,
    });

    try {
      this._xvm_client?.note_structured_view_edit?.({
        _view_id: params._view_id,
        _action: params._edit_action,
        _target_id: params._target_id,
      });

      const result = await this._send_xvibe_command("apply-view-edit", params);
      if (!is_obj(result) || result._ok !== true) {
        this._xvm_client?.clear_pending_structured_view_edit?.({
          _view_id: params._view_id,
          _action: params._edit_action,
          _target_id: params._target_id,
        });
        this._set_studio_control_disabled(STUDIO_SELECTED_OBJECT_DELETE_CANCEL_ID, false);
        this._set_studio_control_disabled(STUDIO_SELECTED_OBJECT_DELETE_CONFIRM_ID, false);
        this._write_studio_status(this._format_apply_view_edit_failure(result));
        this._error("selected object delete failed", {
          _structured_error: result,
        });
        return;
      }

      this._hide_delete_selected_object_dialog();
      this._write_studio_status("Deleted selected object");
      this._log("selected object delete result", {
        _result: result,
      });
      this._refresh_object_tree_for_current_view();
    } catch (err) {
      this._xvm_client?.clear_pending_structured_view_edit?.({
        _view_id: params._view_id,
        _action: params._edit_action,
        _target_id: params._target_id,
      });
      this._set_studio_control_disabled(STUDIO_SELECTED_OBJECT_DELETE_CANCEL_ID, false);
      this._set_studio_control_disabled(STUDIO_SELECTED_OBJECT_DELETE_CONFIRM_ID, false);
      const message = `Delete failed: ${to_err(err)}`;
      this._write_studio_status(message);
      this._error("selected object delete failed", {
        _error: to_err(err),
      });
    }
  }

  private _update_selected_object_inspector() {
    const selected = this._selected_object;

    if (!selected) {
      this._set_selected_object_inspector_controls(this._selected_object_inspector_draft, false);
      this._set_studio_label(STUDIO_SELECTED_OBJECT_SUMMARY_LINE_ID, this._format_selected_object_summary_line(null));
      this._set_studio_label(STUDIO_SELECTED_OBJECT_SUMMARY_TEXT_ID, "");
      this._set_object_visible(STUDIO_SELECTED_OBJECT_SUMMARY_TEXT_ID, false);
      this._set_selected_object_label(STUDIO_SELECTED_OBJECT_TYPE_ID, "Type");
      this._set_selected_object_label(STUDIO_SELECTED_OBJECT_ID_ID, "ID");
      this._set_selected_object_label(STUDIO_SELECTED_OBJECT_TEXT_ID, "Text");
      this._set_selected_object_label(STUDIO_SELECTED_OBJECT_SOURCE_ID, "Source View");
      this._set_selected_object_label(STUDIO_SELECTED_OBJECT_PATH_ID, "Path");
      this._set_selected_object_label(STUDIO_SELECTED_OBJECT_DOM_ID, "DOM");
      this._set_selected_object_label(STUDIO_SELECTED_OBJECT_METADATA_ID, "Metadata");
      this._write_selected_object_json_editor("");
      this._apply_selected_object_details_state();
      this._set_selected_object_move_controls(null);
      this._set_selected_object_visibility_controls(null);
      this._set_selected_object_duplicate_controls(null);
      this._set_selected_object_delete_controls(null);
      return;
    }

    this._set_selected_object_inspector_controls(this._selected_object_inspector_draft, true);
    const summary_text = this._format_selected_object_summary_text(selected);
    this._set_studio_label(STUDIO_SELECTED_OBJECT_SUMMARY_LINE_ID, this._format_selected_object_summary_line(selected));
    this._set_studio_label(STUDIO_SELECTED_OBJECT_SUMMARY_TEXT_ID, summary_text);
    this._set_object_visible(STUDIO_SELECTED_OBJECT_SUMMARY_TEXT_ID, Boolean(summary_text));
    this._set_selected_object_label(STUDIO_SELECTED_OBJECT_TYPE_ID, "Type", selected._type);
    this._set_selected_object_label(STUDIO_SELECTED_OBJECT_ID_ID, "ID", selected._json_id);
    this._set_selected_object_label(STUDIO_SELECTED_OBJECT_TEXT_ID, "Text", selected._text);
    this._set_selected_object_label(STUDIO_SELECTED_OBJECT_SOURCE_ID, "Source View", selected._source_view_id);
    this._set_selected_object_label(STUDIO_SELECTED_OBJECT_PATH_ID, "Path", selected._path);
    this._set_selected_object_label(STUDIO_SELECTED_OBJECT_DOM_ID, "DOM", selected._dom_status);
    this._set_selected_object_label(STUDIO_SELECTED_OBJECT_METADATA_ID, "Metadata", selected._json_metadata);
    this._write_selected_object_json_editor(this._selected_object_json);
    this._apply_selected_object_details_state();
    this._set_selected_object_move_controls(selected);
    this._set_selected_object_visibility_controls(selected);
    this._set_selected_object_duplicate_controls(selected);
    this._set_selected_object_delete_controls(selected);
  }

  private _clear_selected_object() {
    this._hide_delete_selected_object_dialog();
    this._selected_object_pending_select_id = "";
    this._selected_object = null;
    this._selected_object_json = "";
    this._selected_tree_row_id = "";
    this._clear_selected_canvas_highlight();
    this._clear_selected_object_inspector_draft();
    _xd.set(_XD_KEYS.STUDIO_SELECTED_OBJECT, null, { source: "xstudio-object-tree" });
    this._update_selected_object_inspector();
  }

  private _select_object_tree_node(node: XStudioObjectTreeNode, row_id: string) {
    if (!node._meta) return;

    this._selected_object_pending_select_id = "";
    const selected = { ...node._meta };
    selected._dom_status = this._apply_selected_canvas_highlight(selected);

    this._selected_object = selected;
    this._selected_object_json = this._safe_selected_json_preview(node._object);
    this._populate_selected_object_inspector_draft(node._object);
    _xd.set(_XD_KEYS.STUDIO_SELECTED_OBJECT, selected, { source: "xstudio-object-tree" });
    this._log_selected_object_persisted_metadata(selected);
    this._mark_selected_tree_row(row_id);
    this._update_selected_object_inspector();
  }

  private _resolve_object_tree_view_id() {
    return this._resolve_studio_target_view_id();
  }

  private _refresh_object_tree_for_current_view() {
    if (!XUI.getObject(STUDIO_OBJECT_TREE_ID)) return;

    const view_id = this._resolve_object_tree_view_id();
    const view = this._get_cached_view(view_id);

    if (!view_id || !is_obj(view)) {
      this._object_tree_nodes = [];
      const tree = XUI.getObject(STUDIO_OBJECT_TREE_ID) as any;
      tree?.update?.({
        _children: [
          {
            _type: "label",
            _id: `xstudio-object-tree-missing-${this._object_tree_render_seq + 1}`,
            class: "xstudio-dock-placeholder",
            _text: "No active view loaded.",
          },
        ],
      });
      this._clear_selected_object();
      return;
    }

    const nodes: XStudioObjectTreeNode[] = [];
    this._build_object_tree_nodes(view, view_id, "$", "$", "", "", 0, false, true, nodes);
    this._object_tree_nodes = nodes;

    const previous_selected = this._selected_object;
    const pending_select_id = this._selected_object_pending_select_id.trim();
    const pending_selected_node = pending_select_id
      ? nodes.find((node) =>
        node._meta?._json_id.trim() === pending_select_id ||
        node._meta?._id.trim() === pending_select_id)
      : undefined;
    if (pending_selected_node) {
      this._selected_object_pending_select_id = "";
    }

    const next_selected_node =
      pending_selected_node ||
      (previous_selected
        ? nodes.find((node) => this._selected_object_matches(previous_selected, node._meta))
        : undefined);

    if (previous_selected && !next_selected_node && !pending_select_id) {
      this._clear_selected_object();
    } else if (next_selected_node?._meta) {
      const dom_status = this._apply_selected_canvas_highlight(next_selected_node._meta);
      this._selected_object = { ...next_selected_node._meta, _dom_status: dom_status };
      this._selected_object_json = this._safe_selected_json_preview(next_selected_node?._object ?? null);
      this._populate_selected_object_inspector_draft(next_selected_node?._object ?? null);
      _xd.set(_XD_KEYS.STUDIO_SELECTED_OBJECT, this._selected_object, { source: "xstudio-object-tree" });
      this._log_selected_object_persisted_metadata(this._selected_object);
    }

    this._render_object_tree_nodes(nodes);
    this._update_selected_object_inspector();
  }

  private _log(...args: any[]) {
    _xlog.log(LOG, ...args);
  }

  private _error(...args: any[]) {
    _xlog.error(LOG, ...args);
  }

  private _vibe_log(...args: any[]) {
    _xlog.log(VIBE_LOG, ...args);
  }

  private async _send_command(_module: string, _op: string, _params: Record<string, any>) {
    const req_id = ++this._cmd_seq;
    this._log(`-> ${_module}.${_op}`, { _req_id: req_id, _params });
    try {
      const raw = await this._client().sendXcmd({ _module, _op, _params });
      this._log(`<- ${_module}.${_op} raw`, { _req_id: req_id, _raw: raw });
      const result = to_result(raw);
      this._log(`<- ${_module}.${_op} result`, { _req_id: req_id, _result: result });
      return result;
    } catch (err: any) {
      this._error(`xx ${_module}.${_op} failed`, { _req_id: req_id, _error: to_err(err) });
      throw err;
    }
  }

  private _send_server_xvm_command(_op: string, _params: Record<string, any>) {
    return this._send_command("server-xvm", _op, _params);
  }

  private _send_studio_command(_op: string, _params: Record<string, any>) {
    return this._send_command("studio", _op, _params);
  }

  private _send_xvibe_command(_op: string, _params: Record<string, any>) {
    return this._send_command("xvibe", _op, _params);
  }

  private _send_module_creator_command(_op: string, _params: Record<string, any>) {
    return this._send_command("module-creator", _op, _params);
  }

  private _send_generation_fire_and_listen(xcmd: any) {
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

  private _send_studio_generate_artifact_prompt(prompt: string, view_id: string, source: string) {
    let generation_id = "";

    try {
      const normalized_prompt = String(prompt ?? "").trim();
      const target_view_id = String(view_id ?? "").trim();

      if (!normalized_prompt) {
        this._write_studio_status("No edit prompt to apply");
        this._log("studio generate-artifact ignored: empty prompt", { _source: source });
        return false;
      }

      if (!target_view_id) {
        this._write_studio_status("No target view selected");
        this._error("studio generate-artifact failed: missing view_id", { _source: source });
        return false;
      }

      const app_id = this._client().getActiveAppId();
      const env = this._client().getActiveEnv();
      const artifact_type = "auto";

      if (!app_id) {
        this._write_studio_status("No active app selected");
        this._error("studio generate-artifact failed: missing app_id", {
          _source: source,
          _app_id: app_id,
          _view_id: target_view_id,
        });
        return false;
      }

      generation_id = _xu.guid();
      this._start_generation(generation_id, target_view_id);
      this._log("studio generate-artifact request", {
        _source: source,
        _artifact_type: artifact_type,
        _app_id: app_id,
        _env: env,
        _view_id: target_view_id,
        _generation_id: generation_id,
      });

      this._send_generation_fire_and_listen({
        _module: "studio",
        _op: "generate-artifact",
        _params: {
          _prompt: normalized_prompt,
          _app_id: app_id,
          _env: env,
          _view_id: target_view_id,
          _generation_id: generation_id,
          _artifact_type: artifact_type,
        },
      });
      this._set_generation_state("running", "Preparing generation...");
      return true;
    } catch (err) {
      if (this._is_timeout_error(err)) {
        this._vibe_log("generation request ack timed out; still listening for events", {
          _generation_id: generation_id,
          _source: source,
        });
        this._vibe_log("generation ack timeout ignored", {
          _generation_id: generation_id,
          _source: source,
        });
        return true;
      }

      this.clear_active_generation();
      this._set_generation_state("failed", to_err(err), err);
      this._write_studio_status(`Apply failed: ${to_err(err)}`);
      this._error("studio generate-artifact failed", { _source: source, _error: to_err(err) });
      return false;
    }
  }

  private _normalize_event_payload(payload: any): any {
    const raw = typeof payload === "string" && payload.trim()
      ? (() => {
        try {
          return JSON.parse(payload);
        } catch {
          return payload;
        }
      })()
      : payload;

    if (is_obj(raw) && is_obj(raw?._payload)) return this._normalize_event_payload(raw._payload);
    if (is_obj(raw) && is_obj(raw?.payload)) return this._normalize_event_payload(raw.payload);
    if (is_obj(raw) && Array.isArray(raw?._args) && is_obj(raw._args[0])) return raw._args[0];
    if (is_obj(raw) && Array.isArray(raw?.args) && is_obj(raw.args[0])) return raw.args[0];
    if (is_obj(raw) && is_obj(raw?._data)) return raw._data;
    if (is_obj(raw) && is_obj(raw?.data)) return raw.data;
    return raw;
  }

  private _is_timeout_error(err: any) {
    const e = is_obj(err) ? ((err as any)._error ?? err) : err;
    return is_obj(e) && (e as any)._code === "E_TIMEOUT";
  }

  private _format_generation_error(evt: VibeGenerationFailureEvt) {
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

  private _normalize_generation_stage(stage: string) {
    return stage.trim().toLowerCase().replaceAll("_", "-");
  }

  private _humanize_generation_stage(stage: string) {
    const text = stage
      .trim()
      .replaceAll("_", " ")
      .replaceAll("-", " ")
      .replace(/\s+/g, " ")
      .toLowerCase();

    if (!text) return "Generating...";
    return `${text.charAt(0).toUpperCase()}${text.slice(1)}...`;
  }

  private _format_generation_stage_message(evt: Record<string, any>) {
    const message = typeof evt._message === "string" && evt._message.trim() ? evt._message.trim() : "";
    if (message) return message;

    const stage = typeof evt._stage === "string" && evt._stage.trim() ? evt._stage.trim() : "";
    if (!stage) return "Generating...";

    const normalized_stage = this._normalize_generation_stage(stage);
    return GENERATION_STAGE_STATUS[normalized_stage] ?? this._humanize_generation_stage(stage);
  }

  private _write_generation_state(state: VibeGenerationState, status: string, error?: any) {
    _xd.set(_XD_KEYS.STUDIO_GENERATION_STATE, state, { source: "vibe-client" });
    _xd.set(_XD_KEYS.STUDIO_GENERATION_STATUS, status, { source: "vibe-client" });
    if (error !== undefined) {
      _xd.set(_XD_KEYS.STUDIO_GENERATION_ERROR, error, { source: "vibe-client" });
    }
  }

  private _set_generation_state(state: VibeGenerationState, status: string, error?: any) {
    this._write_generation_state(state, status, error);
    const button_text = this._set_studio_generation_ui(state, status);
    this._vibe_log("generation-status updated", {
      _state: state,
      _status: status,
      _button_text: button_text,
      _generation_id: this._active_generation_id,
    });
  }

  private _remember_generation_id(generation_id?: string) {
    if (typeof generation_id !== "string" || !generation_id.trim()) return;
    _xd.set(_XD_KEYS.STUDIO_GENERATION_ID, generation_id.trim(), { source: "vibe-client" });
  }

  private _get_event_generation_id(evt: Record<string, any>) {
    if (!is_obj(evt)) return "";

    const direct = evt._generation_id;
    if (typeof direct === "string" && direct.trim()) return direct.trim();

    const meta = evt._meta?._generation_id;
    if (typeof meta === "string" && meta.trim()) return meta.trim();

    const data = evt._data?._generation_id ?? evt.data?._generation_id;
    if (typeof data === "string" && data.trim()) return data.trim();

    const payload = evt._payload?._generation_id ?? evt.payload?._generation_id;
    if (typeof payload === "string" && payload.trim()) return payload.trim();

    const args_payload = Array.isArray(evt._args)
      ? evt._args[0]
      : Array.isArray(evt.args)
        ? evt.args[0]
        : null;
    const args_generation_id = args_payload?._generation_id ?? args_payload?._meta?._generation_id;
    return typeof args_generation_id === "string" && args_generation_id.trim()
      ? args_generation_id.trim()
      : "";
  }

  private _event_matches_active_generation(evt: Record<string, any>) {
    if (!this._active_generation_id) return false;
    if (evt._app_id !== this._client().getActiveAppId() || evt._env !== this._client().getActiveEnv()) return false;

    const event_generation_id = this._get_event_generation_id(evt);

    if (event_generation_id) {
      return event_generation_id === this._active_generation_id;
    }

    if (typeof evt._view_id === "string" && this._active_generation_view_id) {
      return evt._view_id === this._active_generation_view_id;
    }

    return false;
  }

  private _generation_event_matches(evt: Record<string, any>) {
    const event_generation_id = this._get_event_generation_id(evt);

    if (this._active_generation_id) {
      return event_generation_id === this._active_generation_id;
    }

    const active_app_id = this._client().getActiveAppId();
    const active_env = this._client().getActiveEnv();
    const has_app_id = typeof evt._app_id === "string" && evt._app_id.trim();
    const has_env = typeof evt._env === "string" && evt._env.trim();
    if (has_app_id && evt._app_id !== active_app_id) return false;
    if (has_env && evt._env !== active_env) return false;

    const has_app_env_match = Boolean(has_app_id && has_env);
    const view_id = typeof evt._view_id === "string" && evt._view_id.trim() ? evt._view_id.trim() : "";
    const view_matches =
      view_id === this._client().get_app_view_id() ||
      view_id === this._client().get_current_view_id();

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

  private _start_generation(generation_id: string, view_id: string) {
    this._active_generation_id = generation_id;
    this._active_generation_view_id = view_id;
    this._remember_generation_id(generation_id);
    this._vibe_log("generation started", {
      _generation_id: generation_id,
      _app_id: this._client().getActiveAppId(),
      _env: this._client().getActiveEnv(),
      _view_id: view_id,
    });
    this._set_generation_state("pending", "Preparing generation...");
  }

  private _complete_generation_from_update(upd: StudioXVMUpdateEvt) {
    if (!this._event_matches_active_generation(upd as any)) return;
    this._vibe_log("generation completed from xvm:update", {
      _generation_id: this._active_generation_id,
      _view_id: upd._view_id,
    });
    this._remember_generation_id(upd._generation_id || this._active_generation_id);
    this.clear_active_generation();
    this._set_generation_state("completed", "Generation complete");
  }

  private _fail_generation_from_event(evt: VibeGenerationFailureEvt, source_evt: string, error_payload: any = evt) {
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
    this._remember_generation_id(this._get_event_generation_id(evt as any) || this._active_generation_id);
    this.clear_active_generation();
    this._set_generation_state("failed", message, error_payload);
  }

  private _handle_generation_stage(payload: any) {
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

    this._remember_generation_id(this._get_event_generation_id(evt_payload));

    if (next_state === "completed") {
      this.clear_active_generation();
      this._set_generation_state("completed", status);
      return;
    }

    if (next_state === "failed") {
      this.clear_active_generation();
      this._set_generation_state("failed", status, evt_payload);
      return;
    }

    this._set_generation_state("running", status);
  }

  private _handle_generation_complete(payload: any) {
    const evt_payload = this._normalize_event_payload(payload);
    if (!is_obj(evt_payload)) return;

    if (!this._event_matches_active_generation(evt_payload)) return;

    this._vibe_log("generation complete received", {
      _generation_id: this._get_event_generation_id(evt_payload),
      _app_id: evt_payload._app_id,
      _env: evt_payload._env,
      _view_id: evt_payload._view_id,
      _message: evt_payload._message,
    });

    this._remember_generation_id(this._get_event_generation_id(evt_payload) || this._active_generation_id);
    this.clear_active_generation();
    this._set_generation_state("completed", evt_payload._message ?? "Generation complete");
  }

  private _register_generation_listeners() {
    if (this._generation_listeners_registered) {
      return;
    }
    this._generation_listeners_registered = true;

    _xem.on(EVT_VIBE_GENERATION_STAGE, (payload: any) => {
      this._vibe_log("generation-stage raw", payload);
      this._handle_generation_stage(payload);
    });

    _xem.on(EVT_VIBE_GENERATION_COMPLETE, (payload: any) => {
      this._vibe_log("generation-complete raw", payload);
      this._handle_generation_complete(payload);
    });

    const handle_generation_failure = (payload: any, source_evt: string) => {
      const evt_payload = this._normalize_event_payload(payload);
      if (!is_obj(evt_payload)) return;
      this._fail_generation_from_event(evt_payload as VibeGenerationFailureEvt, source_evt);
    };

    _xem.on(EVT_VIBE_GENERATION_FAILED, (payload: any) => {
      this._vibe_log("generation-failed raw", payload);
      handle_generation_failure(payload, EVT_VIBE_GENERATION_FAILED);
    });
    _xem.on(EVT_XVIBE_ERROR, (payload: any) => {
      handle_generation_failure(payload, EVT_XVIBE_ERROR);
    });
    _xem.on(EVT_COMMAND_ERROR, (payload: any) => {
      handle_generation_failure(payload, EVT_COMMAND_ERROR);
    });

    this._vibe_log("generation listeners registered", {
      _events: [
        EVT_VIBE_GENERATION_STAGE,
        EVT_VIBE_GENERATION_COMPLETE,
        EVT_VIBE_GENERATION_FAILED,
      ],
    });
  }

  private async _close_studio() {
    try {
      await (XVM as any).close?.({ region: STUDIO_REGION_ID });
      this._clear_selected_canvas_highlight();
      this._log("studio closed");
    } catch (err) {
      this._error("studio close failed", err);
    }
  }

  private _short_generation_status(status: string) {
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

  async _set_studio_theme(xcmd: any) {
    const params = xcmd?._params ?? xcmd ?? {};
    const requested_theme = params?._theme ?? params?.theme;
    const requested_theme_value = String(requested_theme ?? "").trim().toLowerCase();
    const has_valid_requested_theme =
      (STUDIO_THEME_OPTIONS as readonly string[]).includes(requested_theme_value);
    const theme = has_valid_requested_theme
      ? requested_theme_value
      : this._read_studio_theme_selector_value();

    return {
      _ok: true,
      _result: {
        _theme: this._apply_studio_theme(theme),
      },
    };
  }

  async _toggle_portlet(xcmd: any) {
    const params = xcmd?._params ?? xcmd ?? {};
    const portlet_id = this._normalize_portlet_id(
      params?._portlet ?? params?.portlet ?? params?._id ?? params?.id,
    );

    if (!portlet_id) {
      return {
        _ok: false,
        _result: {
          _error: "Unknown XStudio portlet.",
        },
      };
    }

    const visible = this._portlet_visibility[portlet_id] !== true;
    this._portlet_visibility[portlet_id] = visible;

    if (visible) {
      this._right_dock_collapsed = false;
    }

    this._apply_dock_state();

    return {
      _ok: true,
      _result: {
        _portlet: portlet_id,
        _visible: visible,
      },
    };
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

  _set_studio_run_inspector(text: string) {
    const editor = XUI.getObject("xstudio-run-inspector") as any;
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

  _format_studio_run_inspector_section(section: any) {
    if (!is_obj(section)) return "";

    const label =
      typeof section._label === "string" && section._label.trim()
        ? section._label.trim()
        : typeof section._file === "string" && section._file.trim()
          ? section._file.trim()
          : "Section";
    const preview =
      typeof section._preview === "string"
        ? section._preview
        : section._content === undefined || section._content === null
          ? ""
          : JSON.stringify(section._content, null, 2);

    return [`## ${label}`, preview || "-"].join("\n");
  }

  _format_studio_run_inspector(result: any) {
    const inspector = is_obj(result?._inspector) ? result._inspector : {};
    const summary_text =
      typeof inspector._summary_text === "string" && inspector._summary_text.trim()
        ? inspector._summary_text.trim()
        : is_obj(result?._summary)
          ? JSON.stringify(result._summary, null, 2)
          : "No run summary.";
    const sections =
      Array.isArray(inspector._sections)
        ? inspector._sections
          .map((section: any) => this._format_studio_run_inspector_section(section))
          .filter((section: string) => section.trim().length > 0)
        : [];

    return [
      summary_text,
      ...sections,
    ].join("\n\n");
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
    const current_view_id = this._client().get_current_view_id() === STUDIO_VIEW_ID
      ? ""
      : this._client().get_current_view_id();
    return this._client().get_app_view_id() || current_view_id || "";
  }

  async _inspect_studio_latest_run() {
    try {
      const app_id = this._client().getActiveAppId();
      const env = this._client().getActiveEnv();
      const generation_id = String(_xd.get(_XD_KEYS.STUDIO_GENERATION_ID) ?? "").trim();

      if (!app_id) {
        throw new Error("Missing active app id");
      }

      this._set_studio_label("xstudio-run-inspector-status", "Inspecting...");

      const out = await this._send_studio_command("inspect-latest-run", {
        _app_id: app_id,
        _env: env,
        ...(generation_id ? { _generation_id: generation_id } : {}),
      });
      if (!is_obj(out) || out._ok !== true) {
        throw new Error(`Invalid inspect-latest-run response: ${to_err(out)}`);
      }

      const formatted = this._format_studio_run_inspector(out);
      const status =
        is_obj(out._summary) && typeof out._summary._status === "string"
          ? out._summary._status
          : is_obj(out._inspector) && typeof out._inspector._status === "string"
            ? out._inspector._status
            : "completed";

      _xd.set(_XD_KEYS.STUDIO_RUN_INSPECTOR, formatted, { source: "xstudio-runtime" });
      this._set_studio_run_inspector(formatted);
      this._set_studio_label("xstudio-run-inspector-status", status);
      this._write_studio_status("Run inspected");
    } catch (err) {
      const message = `Inspect last run failed: ${to_err(err)}`;
      this._set_studio_label("xstudio-run-inspector-status", "failed");
      this._write_studio_status(message);
      this._error("studio inspect latest run failed", err);
    }
  }

  async _refresh_studio_runtime() {
    try {
      const app_id = this._client().getActiveAppId();
      const env = this._client().getActiveEnv();

      if (!app_id) {
        throw new Error("Missing active app id");
      }

      this._write_studio_status("Refreshing runtime...");

      const params = { _app_id: app_id, _env: env };
      const [views_res, flows_res, modules_res] = await Promise.all([
        this._send_server_xvm_command("list-views", params) as Promise<ServerListViewsRes>,
        this._send_server_xvm_command("list-flows", params) as Promise<ServerListFlowsRes>,
        // TODO: move list-generated-modules to module-creator once server API is available.
        this._send_server_xvm_command("list-generated-modules", {}) as Promise<ServerListGeneratedModulesRes>,
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
      const app_id = this._client().getActiveAppId();
      const env = this._client().getActiveEnv();
      const view_id = this._resolve_studio_target_view_id();

      if (!app_id || !view_id) {
        throw new Error("Missing active app id or view id");
      }

      this._write_studio_status(`Loading ${view_id}...`);

      const out = (await this._send_server_xvm_command("get-view", { _app_id: app_id, _env: env, _view_id: view_id })) as ServerGetViewRes;
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
      const app_id = this._client().getActiveAppId();
      const env = this._client().getActiveEnv();
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

      await this._send_server_xvm_command("save-view-json", {
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

      const out = await this._send_module_creator_command("get-generated-module", {
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

      await this._send_module_creator_command("save-generated-module-source", {
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

      await this._send_module_creator_command("repair-generated-module", {
        _name: selected_module,
        _prompt: prompt,
      });

      const out = await this._send_module_creator_command("get-generated-module", {
        _name: selected_module,
      });

      const parsed = this._extract_studio_generated_module_response(out, selected_module);

      if (typeof parsed._source !== "string") {
        throw new Error(`Invalid get-generated-module response for '${selected_module}'`);
      }

      _xd.set(_XD_KEYS.STUDIO_MODULE_SOURCE, parsed._source, { source: "xstudio-module-editor" });
      this._set_studio_module_source_editor(parsed._source);
      const runtime_refreshed = await this._refresh_studio_runtime();
      this._write_studio_status(
        runtime_refreshed
          ? `Repaired module ${parsed._name}. Runtime refreshed`
          : `Repaired module ${parsed._name}. Runtime refresh failed`
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

      await this._send_module_creator_command("disable-generated-module", {
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

      await this._send_module_creator_command("delete-generated-module", {
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
}
