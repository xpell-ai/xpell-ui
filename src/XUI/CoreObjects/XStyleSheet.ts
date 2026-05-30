import {
    XObject,
    type XObjectData,
    type XpellSkill,
    createNanoCommandWithSkill,
    _xd, _xlog
} from "@xpell/core";

import XUIObject, { type XUIObjectData } from "../XUIObject";


export type XStyleSheetRuleValue =
    string | number;

export type XStyleSheetRules =
    Record<string, XStyleSheetRuleValue>;

export type XStyleSheetData =
    XUIObjectData & {
        _classes?: Record<string, string | XStyleSheetRules>;
        _vars?: Record<string, string>;
        _media?: Record<string, Record<string, string | XStyleSheetRules>>;
    };

export class XStyleSheet extends XUIObject {

    static _xtype = "style-sheet";

    static _skill: XpellSkill = {
        _id: "style-sheet",
        _title: "XStyleSheet",
        _version: "1.0.0",
        _active: true,
        _type: "view-skill",
        _requires: ["xuiobject"],

        _description:
            "Runtime-managed stylesheet object. Defines CSS classes, CSS variables, and optional media rules for XUI views without inline style strings.",

        _fields: {
            _classes:
                "Map of class names to CSS declarations. Values may be CSS strings or style objects.",
            _vars:
                "Map of CSS variables to values. Usually written as --var-name.",
            _media:
                "Optional map of media queries to class rule maps.",
            class:
                "Optional CSS class for the generated style element. Defaults to xstyle-sheet."
        },

        _core_rules: [
            "Use style-sheet to define reusable runtime CSS classes.",
            "Use class fields on XUI objects to apply generated classes.",
            "Prefer style-sheet over repeated inline style strings.",
            "Do not use style-sheet for JavaScript logic.",
            "Do not inject external imports, @import, or remote URLs.",
            "Keep generated CSS deterministic and data-only."
        ],

        _canonical_examples: [
            {
                _type: "style-sheet",
                _id: "system-styles",
                _classes: {
                    "system-home": {
                        "max-width": "720px",
                        "margin": "0 auto"
                    },
                    "hero-actions": "display:flex;gap:12px;align-items:center;"
                },
                _vars: {
                    "--app-accent": "#635bff"
                }
            }
        ]
    };

    _classes?: Record<string, string | XStyleSheetRules>;
    _vars?: Record<string, string>;
    _media?: Record<string, Record<string, string | XStyleSheetRules>>;

    constructor(data: XStyleSheetData) {
        const defaults = {
            _type: XStyleSheet._xtype,
            _html_tag: "style"
        };

        super(data, defaults, true);
        this.parse(data);
    }

    override getDOMObject(): HTMLElement {
        const dom = super.getDOMObject();
        dom.textContent = this.renderCSS();
        return dom;
    }

    override update(data: Partial<XStyleSheetData>) {
        super.update(data);

        if (this._dom_object) {
            this.dom.textContent = this.renderCSS();
        }
    }

    private renderCSS(): string {
        const parts: string[] = [];

        if (this._vars && Object.keys(this._vars).length > 0) {
            parts.push(`:root {\n${this.renderRuleBody(this._vars)}\n}`);
        }

        if (this._classes) {
            for (const [class_name, rules] of Object.entries(this._classes)) {
                parts.push(this.renderClassRule(class_name, rules));
            }
        }

        if (this._media) {
            for (const [query, class_map] of Object.entries(this._media)) {
                const body = Object
                    .entries(class_map)
                    .map(([class_name, rules]) =>
                        this.renderClassRule(class_name, rules)
                    )
                    .join("\n\n");

                parts.push(`@media ${query} {\n${body}\n}`);
            }
        }

        return parts.join("\n\n");
    }

    private renderClassRule(
        class_name: string,
        rules: string | XStyleSheetRules
    ): string {
        const safe_class_name =
            class_name.startsWith(".")
                ? class_name
                : `.${class_name}`;

        if (typeof rules === "string") {
            return `${safe_class_name} {\n${rules}\n}`;
        }

        return `${safe_class_name} {\n${this.renderRuleBody(rules)}\n}`;
    }

    private renderRuleBody(
        rules: Record<string, string | number>
    ): string {
        return Object
            .entries(rules)
            .map(([key, value]) => `  ${key}: ${String(value)};`)
            .join("\n");
    }
}