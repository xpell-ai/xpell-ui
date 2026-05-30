import {
    XObject,
    type XObjectData,
    type XpellSkill,
    createNanoCommandWithSkill,
    _xd, _xlog
} from "@xpell/core";

import XUIObject from "../XUIObject";

export class XInput extends XUIObject {
    static _xtype = "input"

    static _skill: XpellSkill = {
        _id: "input",
        _title: "XInput",
        _version: "1.0.0",
        _active: true,
        _type: "view-skill",
        _requires: ["xuiobject"],

        _description:
            "Generic HTML input field base object for text, password, checkbox, radio, and other input types.",

        _fields: {
            _text: "Initial input value.",
            value: "Current input value.",
            _input_type: "HTML input type.",
            placeholder: "Placeholder text.",
            name: "Input/form name.",
            autocomplete: "Browser autocomplete hint.",
            required: "Native required flag.",
            disabled: "Disable input.",
            readonly: "Read-only input.",

            _data_source:
                "Optional _xd key bound to the input value.",

            _data_output:
                "Optional XData key to write this input value to when the update event fires.",

            _update_data_source_event:
                "DOM event used for _data_output updates. Usually input or change."
        },

        _core_rules: [
            "Use input as a generic HTML input abstraction.",
            "Prefer semantic child types like text or password when possible.",
            "Use _data_source for reactive form state.",
            "Use _update_data_source_on_change for realtime _xd synchronization."
        ],
        _canonical_examples: [
            {
                _type: "input",
                name: "username",
                placeholder: "Enter username",
                _text:"",
                _data_output:"user.name"
            }
        ]
    };

    type: string = "text";

    _data_output?: string;
    _update_data_source_event?: string;
    private _auto_binding_initialized: boolean = false;

    constructor(data: XObjectData, defaults: XObjectData = {}, skipParse = false) {

        const tag = "input";

        const defaultsNext = {
            _type: XInput._xtype,
            class: "x" + XInput._xtype,
            _html_tag: "input",
            ...(defaults || {})
        };

        super(data, defaultsNext, true);

        if (data._text) {
            this.value = data._text;
        }
        if (!skipParse) {
            this.parse(data);
        }


        this.addNanoCommand(
            "focus",
            createNanoCommandWithSkill(
                (_cmd, obj?: XObject) => {
                    (obj as XInput)?.focus?.();
                },
                {
                    _name: "focus",
                    _scope: "input",
                    _description: "Focus the input element."
                }
            )
        );

        this.addNanoCommand(
            "blur",
            createNanoCommandWithSkill(
                (_cmd, obj?: XObject) => {
                    (obj as XInput)?.blur?.();
                },
                {
                    _name: "blur",
                    _scope: "input",
                    _description: "Blur the input element."
                }
            )
        );

        this.addNanoCommand(
            "clear",
            createNanoCommandWithSkill(
                (_cmd, obj?: XObject) => {
                    (obj as XInput)?.setValue("");
                },
                {
                    _name: "clear",
                    _scope: "input",
                    _description: "Clear the input value."
                }
            )
        );
    }

    protected enableAutoDataBinding() {

        if (
            !this._data_output ||
            this._auto_binding_initialized
        ) {
            return;
        }

        const dom = this.dom as HTMLInputElement;

        this._auto_binding_initialized = true;

        const event_name =
            this._update_data_source_event ?? "input";

        if (this._debug) {

            _xlog.log(
                `[XInput] Enabling auto data binding for data output: ${this._data_output}, event: ${event_name}`
            );
        }

        dom.addEventListener(
            event_name,
            () => {

                const value = this.getValue();

                if (this._debug) {

                    _xlog.log(
                        `[XInput] Updating data output: ${this._data_output} with value: ${value}`
                    );
                }

                _xd.set(
                    this._data_output as string,
                    value,
                    {
                        source: `${this._type}#${this._id}.${event_name}`
                    }
                );
            }
        );
    }




    override getDOMObject(): HTMLElement {
        const dom = super.getDOMObject();
        if (!this._auto_binding_initialized) {
            this._auto_binding_initialized = true;
            this.enableAutoDataBinding();
        }
        return dom;
    }

    getValue(): any {
        return (this.dom as HTMLInputElement)?.value;
    }

    setValue(value: any) {
        (this.dom as HTMLInputElement).value =
            String(value ?? "");
    }

    focus() {
        (this.dom as HTMLInputElement)?.focus?.();
    }

    blur() {
        (this.dom as HTMLInputElement)?.blur?.();
    }

    set _text(text: string) {
        super._text = text;

        if (this._dom_object) {
            (this.dom as HTMLInputElement).value = text;
        }
    }

    set _input_type(type: string) {

        this.type = type;

        if (this._dom_object) {
            (this.dom as HTMLInputElement).type = type;
        }
    }

    get _input_type() {
        return this.dom.getAttribute("type") || "text";
    }
}


export class XTextField extends XInput {
    static _xtype = "text"
    static _skill: XpellSkill = {
        _id: "text",
        _title: "XTextField",
        _version: "1.0.0",
        _active: true,
        _type: "view-skill",
        _requires: ["xuiobject","input"],

        _description:
            "Single-line text input rendered as an HTML input element.",

        _fields: {
            _text: "Initial input value.",
            value: "Input value.",
            placeholder: "Placeholder text.",
            name: "Form/input name.",
            type: "Input type. Defaults to text.",
            autocomplete: "Browser autocomplete hint.",
            required: "Native required flag.",
            disabled: "Disable input.",
            readonly: "Read-only input.",
             _data_source:
                "Optional _xd key bound to the input value.",

            _data_output:
                "Optional XData key to write this input value to when the update event fires.",

            _update_data_source_event:
                "DOM event used for _data_output updates. Usually input or change."
        },

        _core_rules: [
            "Use text for single-line text input.",
            "Use textarea for multiline text.",
            "Use password for password input.",
            "Use name when input belongs to a form.",
            "Use _data_source when binding input value to _xd."
        ],

        _canonical_examples: [
            {
                _type: "text",
                name: "username",
                placeholder: "Enter username",
                _text:"",
                _data_output:"user.name"
            }
        ]
    };

    type: string = "text" //default type is text for DOM input element, can be changed to "email", "number", etc. via _input_type field
    constructor(data: XObjectData) {
        const defaults = {
            _type: XTextField._xtype,
            class: "x" + XTextField._xtype,
            _html_tag: "input"
        }
        super(data, defaults, true);
        this.parse(data)
        this.enableAutoDataBinding()
    }




}

export class XPassword extends XInput {
    static _xtype = "password"
    static _skill: XpellSkill = {
        _id: "password",
        _title: "XPassword",
        _version: "1.0.0",
        _active: true,
        _type: "view-skill",
        _requires: ["text", "input"],

        _description:
            "Password input rendered as an HTML input element with type='password'.",

        _fields: {
            _text: "Initial password value. Avoid using for real passwords.",
            value: "Password input value. Avoid hardcoding real passwords.",
            placeholder: "Placeholder text.",
            name: "Form/input name.",
            autocomplete: "Browser autocomplete hint, usually current-password or new-password.",
            required: "Native required flag.",
            disabled: "Disable input.",
            readonly: "Read-only input.",
            _data_output:"uses _xd to store value automatically"
        },

        _core_rules: [
            "Use password for password fields.",
            "Do not use text with type:'password'.",
            "Do not hardcode real password values in generated JSON.",
            "Use autocomplete:'current-password' for login forms.",
            "Use autocomplete:'new-password' for signup/reset forms."
        ],

        _canonical_examples: [
            {
                _type: "password",
                name: "password",
                placeholder: "Enter password",
                autocomplete: "current-password",
                _data_output: "login.password",
            }
        ]
    };
    type: string = "password" //default type is password
    constructor(data: XObjectData) {
        const tag = "password"
        const defaults = {
            _type: XPassword._xtype,
            type: "password",
            class: "x" + tag,
            _html_tag: "input"
        }
        super(data, defaults, true);
        this.parse(data)
        this.enableAutoDataBinding()
    }
}




export class XTextArea extends XInput {

    static _xtype = "textarea";

    static _skill: XpellSkill = {
        _id: "textarea",
        _title: "XTextArea",
        _version: "1.0.0",
        _active: true,
        _type: "view-skill",
        _requires: ["input", "xuiobject"],

        _description:
            "Multiline text input rendered as an HTML textarea element.",

        _fields: {
            rows: "Visible textarea rows.",
            cols: "Visible textarea columns.",
            placeholder: "Placeholder text.",
            maxlength: "Maximum text length.",
             _data_source:
                "Optional _xd key bound to the input value.",

            _data_output:
                "Optional XData key to write this input value to when the update event fires.",

            _update_data_source_event:
                "DOM event used for _data_output updates. Usually input or change."
        },

        _core_rules: [
            "Use textarea for multiline text.",
            "Use text for single-line text.",
            "Use _data_source for reactive content."
        ],
        _canonical_examples: [
            {
                _type: "textarea",
                name: "description",
                placeholder: "Enter description",
                rows: 4,
                cols: 50,
                _data_output: "form.description",
            }
        ]
    };

    constructor(data: XObjectData) {

        const defaults = {
            _type: XTextArea._xtype,
            class: "x" + XTextArea._xtype,
            _html_tag: "textarea"
        };

        super(data, defaults, true);

        this.parse(data);
        this.enableAutoDataBinding();
        if (this._debug) {
            _xlog.log(`[XTextArea] Initialized with data:`, data);
        }

    }

    override getValue(): any {
        return (this.dom as HTMLTextAreaElement)?.value;
    }

    override setValue(value: any) {
        (this.dom as HTMLTextAreaElement).value =
            String(value ?? "");
    }

    override set _text(text: string) {

        super._text = text;

        if (this.dom) {
            (this.dom as HTMLTextAreaElement).value = text;
        }
    }
}

export type XSelectOption = {
    label: string;
    value: string;
    disabled?: boolean;
    selected?: boolean;
};

export class XSelect extends XInput {
    static _xtype = "select";

    static _skill: XpellSkill = {
        _id: "select",
        _title: "XSelect",
        _version: "1.0.0",
        _active: true,
        _type: "view-skill",
        _requires: ["input", "xuiobject"],

        _description:
            "Dropdown/select input rendered as an HTML select element.",

        _fields: {
            _options: "Array of options: { label, value, disabled?, selected? }.",
            _multiple: "Enable multiple selection.",
            value: "Selected value.",
            name: "Form/input name.",
            disabled: "Disable select.",
            required: "Native required flag.",
             _data_source:
                "Optional _xd key bound to the input value.",

            _data_output:
                "Optional XData key to write this input value to when the update event fires.",

            _update_data_source_event:
                "DOM event used for _data_output updates. Usually input or change."
        },

        _core_rules: [
            "Use select when choosing from predefined options.",
            "Use _options for option definitions.",
            "Use _multiple:true only when multiple values can be selected.",
            "Use _data_source for reactive selected value."
        ],

        _canonical_examples: [
            {
                _type: "select",
                name: "role",
                _data_output: "user.role",
                _options: [
                    { label: "Admin", value: "admin" },
                    { label: "User", value: "user" }
                ]
            }
        ]
    };

    _options: XSelectOption[] = [];
    _multiple?: boolean;

    constructor(data: XObjectData) {
        const defaults = {
            _type: XSelect._xtype,
            class: "x" + XSelect._xtype,
            _html_tag: "select"
        };

        super(data, defaults, true);
        this.parse(data);

        if (this._multiple === true) {
            (this.dom as HTMLSelectElement).multiple = true;
        }

        this.renderOptions();

        if (!this._update_data_source_event) {
            this._update_data_source_event = "change";
        }

        this.enableAutoDataBinding();
        this.addNanoCommand(
            "set-options",
            createNanoCommandWithSkill(
                (cmd, obj?: XObject) => {
                    const select = obj as XSelect;
                    select._options = (cmd as any)._params?.options ?? [];
                    select.renderOptions();
                },
                {
                    _name: "set-options",
                    _scope: "select",
                    _description: "Replace select options and re-render.",
                    _params: {
                        options: "Array of { label, value, disabled?, selected? }."
                    }
                }
            )
        );

        this.addNanoCommand(
            "select-value",
            createNanoCommandWithSkill(
                (cmd, obj?: XObject) => {
                    (obj as XSelect)?.setValue((cmd as any)._params?.value);
                },
                {
                    _name: "select-value",
                    _scope: "select",
                    _description: "Set selected value.",
                    _params: {
                        value: "Selected value or array for multiple select."
                    }
                }
            )
        );

        this.addNanoCommand(
            "clear-selection",
            createNanoCommandWithSkill(
                (_cmd, obj?: XObject) => {
                    (obj as XSelect)?.setValue(
                        (obj as XSelect)._multiple ? [] : ""
                    );
                },
                {
                    _name: "clear-selection",
                    _scope: "select",
                    _description: "Clear selected value(s)."
                }
            )
        );
    }

    renderOptions() {
        const select = this.dom as HTMLSelectElement;

        select.innerHTML = "";

        if (!Array.isArray(this._options)) return;

        for (const opt of this._options) {
            const option = document.createElement("option");

            option.value = String(opt.value ?? "");
            option.textContent = String(opt.label ?? opt.value ?? "");

            if (opt.disabled) option.disabled = true;
            if (opt.selected) option.selected = true;

            select.appendChild(option);
        }
    }

    override getValue(): string | string[] {
        const select = this.dom as HTMLSelectElement;

        if (select.multiple) {
            return Array
                .from(select.selectedOptions)
                .map(option => option.value);
        }

        return select.value;
    }

    override setValue(value: any) {
        const select = this.dom as HTMLSelectElement;

        if (select.multiple && Array.isArray(value)) {
            const values = new Set(value.map(String));

            Array
                .from(select.options)
                .forEach(option => {
                    option.selected = values.has(option.value);
                });

            return;
        }

        select.value = String(value ?? "");
    }
}