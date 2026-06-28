import { XUtils as _xu } from "@xpell/core";

import json_viewer_view from "./views/json-viewer.json";
import module_viewer_view from "./views/module-viewer.json";
import runtime_editor_view from "./views/runtime-editor.json";
import runtime_inspector_view from "./views/runtime-inspector.json";

export const STUDIO_RUNTIME_EDITOR_VIEW_ID = "xstudio-editor";
export const STUDIO_RUNTIME_INSPECTOR_VIEW_ID = "xstudio-runtime-inspector-section";
export const STUDIO_JSON_VIEWER_VIEW_ID = "xstudio-json-section";
export const STUDIO_MODULE_VIEWER_VIEW_ID = "xstudio-generated-modules-section";

export const studio_editor_views: Record<string, Record<string, any>> = {
  [STUDIO_RUNTIME_EDITOR_VIEW_ID]: runtime_editor_view as Record<string, any>,
  [STUDIO_RUNTIME_INSPECTOR_VIEW_ID]: runtime_inspector_view as Record<string, any>,
  [STUDIO_JSON_VIEWER_VIEW_ID]: json_viewer_view as Record<string, any>,
  [STUDIO_MODULE_VIEWER_VIEW_ID]: module_viewer_view as Record<string, any>,
};

export const create_studio_editor_view = () => (
  _xu.clone_json(runtime_editor_view) as Record<string, any>
);

export const studio_editor_view: any = create_studio_editor_view();
