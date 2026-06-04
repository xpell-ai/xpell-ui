const fire_event = (event: string) => ({
  _module: "xem",
  _op: "fire",
  _params: {
    event,
  },
});

export const studio_editor_view: any = {
  _id: "xstudio-editor",
  _type: "view",
  class: "xstudio-editor",
  _children: [
    {
      _type: "toolbar",
      _justify: "space-between",
      _children: [
        {
          _type: "label",
          _text: "XStudio Runtime Editor",
          _variant: "ghost",
        },
        {
          _type: "button",
          _text: "×",
          _variant: "ghost",
          _on: {
            click: fire_event("studio:close"),
          },
        },
      ],
    },
    {
      _type: "field",
      _label: "Prompt",
      _hint: "Describe the change you want to make to the current view.",
      _control: {
        _id: "xstudio-prompt",
        _type: "textarea",
        placeholder: "Example: make this dashboard use KPI cards and add a table...",
        rows: "6",
        _data_source: "studio:prompt",
        _data_output: "studio:prompt",
        _update_data_source_event: "input",
      },
    },
    {
      _type: "toolbar",
      _justify: "end",
      _children: [
        {
          _type: "label",
          _id: "xstudio-generation-status",
          class: "xstudio-generation-status",
          _text: "",
        },
        {
          _type: "button",
          _id: "xstudio-preview-button",
          _text: "Go",
          _variant: "primary",
          _on: {
            click: fire_event("studio:preview-request"),
          },
        },
        {
          _type: "button",
          _id: "xstudio-more-options-button",
          _text: "More Options",
          _variant: "primary",
          _on: {
            click: fire_event("studio:more-options-toggle"),
          },
        },
      ],
    },
    {
      _type: "view",
      _id: "more_options_container",
      class: "xstudio-more-options",
      _on_mount:{_op:"hide"},
      _on:{
        "_studio:more-options-toggle":{_op:"toggle"},
      },
      _children: [
        {
          _id: "xstudio-runtime-section",
          _type: "view",
          class: "xstudio-section xstudio-runtime-section",
          _children: [
            {
              _type: "toolbar",
              _justify: "space-between",
              _children: [
                {
                  _type: "label",
                  class: "xstudio-section-title",
                  _text: "Runtime",
                },
                {
                  _type: "button",
                  _id: "xstudio-refresh-button",
                  _text: "Refresh",
                  _on: {
                    click: fire_event("studio:runtime-refresh"),
                  },
                },
              ],
            },
            {
              _type: "label",
              _id: "xstudio-status",
              class: "xstudio-status",
              _text: "",
            },
            {
              _type: "label",
              _id: "xstudio-views-list",
              class: "xstudio-runtime-list",
              _text: "Views: -",
            },
            {
              _type: "label",
              _id: "xstudio-flows-list",
              class: "xstudio-runtime-list",
              _text: "Flows: -",
            },
            {
              _type: "label",
              _id: "xstudio-modules-list",
              class: "xstudio-runtime-list",
              _text: "Modules: -",
            },
          ],
        },
        {
          _id: "xstudio-json-section",
          _type: "view",
          class: "xstudio-section xstudio-json-section",
          _children: [
            {
              _type: "field",
              _label: "JSON",
              _hint: "Edit the current view JSON.",
              _control: {
                _id: "xstudio-json",
                _type: "textarea",
                placeholder: "Load the current view or paste view JSON...",
                rows: "16",
                _data_source: "studio:json",
                _data_output: "studio:json",
                _update_data_source_event: "input",
              },
            },
            {
              _type: "toolbar",
              _justify: "end",
              _children: [
                {
                  _type: "button",
                  _id: "xstudio-load-view-button",
                  _text: "Load Current View",
                  _on: {
                    click: fire_event("studio:load-current-view"),
                  },
                },
                {
                  _type: "button",
                  _id: "xstudio-save-view-button",
                  _text: "Save View",
                  _variant: "primary",
                  _on: {
                    click: fire_event("studio:save-view"),
                  },
                },
              ],
            },
          ],
        },
        {
          _id: "xstudio-generated-modules-section",
          _type: "view",
          class: "xstudio-section xstudio-generated-modules-section",
          _children: [
            {
              _type: "label",
              class: "xstudio-section-title",
              _text: "Generated Modules",
            },
            {
              _type: "field",
              _label: "Selected Module",
              _control: {
                _id: "xstudio-selected-module",
                _type: "text",
                placeholder: "tic-tac-toe",
                _text: "tic-tac-toe",
                _data_source: "studio:selected_module",
                _data_output: "studio:selected_module",
                _update_data_source_event: "input",
              },
            },
            {
              _type: "field",
              _label: "Module Source",
              _control: {
                _id: "xstudio-module-source",
                _type: "textarea",
                rows: 18,
                _data_source: "studio:module_source",
                _data_output: "studio:module_source",
                _update_data_source_event: "input",
              },
            },
            {
              _type: "field",
              _label: "Repair Prompt",
              _control: {
                _id: "xstudio-module-repair-prompt",
                _type: "textarea",
                rows: 5,
                _data_source: "studio:module_repair_prompt",
                _data_output: "studio:module_repair_prompt",
                _update_data_source_event: "input",
              },
            },
            {
              _type: "toolbar",
              _justify: "end",
              _children: [
                {
                  _type: "button",
                  _id: "xstudio-load-module-button",
                  _text: "Load",
                  _on: {
                    click: fire_event("studio:load-module"),
                  },
                },
                {
                  _type: "button",
                  _id: "xstudio-save-module-button",
                  _text: "Save",
                  _variant: "primary",
                  _on: {
                    click: fire_event("studio:save-module"),
                  },
                },
                {
                  _type: "button",
                  _id: "xstudio-repair-module-button",
                  _text: "Repair",
                  _on: {
                    click: fire_event("studio:repair-module"),
                  },
                },
                {
                  _type: "button",
                  _id: "xstudio-disable-module-button",
                  _text: "Disable",
                  _on: {
                    click: fire_event("studio:disable-module"),
                  },
                },
                {
                  _type: "button",
                  _id: "xstudio-delete-module-button",
                  _text: "Delete",
                  _on: {
                    click: fire_event("studio:delete-module"),
                  },
                },
              ],
            },
          ],
        },

      ]
    }
  ]
};
