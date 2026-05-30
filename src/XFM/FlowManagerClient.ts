import { XModule, type XCommand, _x, _xu, _xlog, _xd } from "@xpell/core";
import { _xem } from "../XEM/XEventManager";
import { XUIRuntime } from "../XUI/XUIRuntime";
import type {
    XpellSkill,
    XpellSkillCommand
} from "@xpell/core";

/* -------------------------------------------------------------------------- */

const is_debug = () =>
    true//typeof window !== "undefined" && (window as any)?.__xpell_debug === true;

const log_debug = (message: string, payload?: any) => {
    if (is_debug()) {
        _xlog.log(message, payload);
    }
};

type XFlowBinding = {
    _flow_id: string;
    _event: string;
    _app_id: string;
    _env?: string;
};

type XFlowTriggerPayload = {
    _flow_id: string;
    _event_name?: string;
    _event_payload?: object;
    _app_id?: string;
    _env?: string;
    _source?: "ui" | "event";
};

/* -------------------------------------------------------------------------- */

const run_command_or_list = async (cmd: any) => {
    if (Array.isArray(cmd)) {
        for (const item of cmd) {
            await _x.execute(item);
        }
        return;
    }

    await _x.execute(cmd);
};

export class FlowManagerClient extends XModule {
    static _name = "flow-client";
    static _instance: FlowManagerClient | null = null;

    static _skill: XpellSkill = {
        _id: "flow-client",
        _title: "Flow Manager Client",
        _version: "1.0.0",
        _active: true,
        _type: "client-module-api",
        _requires: ["xmodule", "xem", "xdata"],

        _description:
            "Client-side flow runtime bridge. Binds UI/runtime events to server flows, triggers flows through XUIRuntime, writes flow outputs into XData, and executes on_success/on_error commands.",

        _core_rules: [
            "Use flow-client to trigger server-side flows from UI/runtime events.",
            "Use _flow on XUIObject for common UI-triggered flows.",
            "Flow outputs are written to XData by output key.",
            "Use _on_success and _on_error in flow definitions for post-flow commands.",
            "Do not run server business logic directly on the client."
        ],

        _fields: {
            _flow: "XUIObject field for flow id or flow definition.",
            _flow_event: "DOM event that triggers _flow. Default click.",
            _flow_auto: "Disable automatic flow binding when false.",
            "_flow._payload": "Payload object passed to the flow.",
            "$xdata.key": "Use XData references inside flow payloads."
        }
    };

    static _ops: Record<string, XpellSkillCommand> = {
        bind: {
            _name: "bind",
            _scope: "module",
            _description:
                "Bind a XEM/runtime event to a server flow execution.",
            _params: {
                _flow_id: "Flow id to execute.",
                _event: "XEM event name to listen for.",
                _app_id: "Current app id.",
                _env: "Optional environment. Defaults to default."
            },
            _example: {
                _module: "flow-client",
                _op: "bind",
                _params: {
                    _flow_id: "login",
                    _event: "user:login-requested",
                    _app_id: "my-app",
                    _env: "default"
                }
            }
        },

        trigger: {
            _name: "trigger",
            _scope: "module",
            _description:
                "Trigger a server flow directly from the client.",
            _params: {
                _flow_id: "Flow id to execute.",
                _event_payload: "Optional payload object passed to the flow.",
                _event_name: "Optional source event name.",
                _app_id: "Optional app id. Defaults from XUIRuntime client.",
                _env: "Optional environment. Defaults from XUIRuntime client.",
                _source: "Trigger source: ui or event."
            },
            _example: {
                _module: "flow-client",
                _op: "trigger",
                _params: {
                    _flow_id: "login",
                    _event_payload: {
                        username: "$xdata.login.username",
                        password: "$xdata.login.password"
                    },
                    _source: "ui"
                }
            }
        },

        help: {
            _name: "help",
            _scope: "module",
            _description: "Return flow-client help."
        }
    };

    private _bindings: XFlowBinding[] = [];
    private _bound_events: Set<string> = new Set();
    private _ui_listener_bound = false;

    constructor() {
        super({ _name: FlowManagerClient._name });
        if (FlowManagerClient._instance) {
            return FlowManagerClient._instance;
        }
        FlowManagerClient._instance = this;
    }

    async onLoad() {

        if (this._ui_listener_bound) return;
        this._ui_listener_bound = true;
        _xem.on("ui:flow-trigger", async (payload: any) => {
            log_debug("[flow-client] ui:flow-trigger received raw", payload);
            if (!payload || typeof payload._flow_id !== "string") {
                _xlog.warn("[flow-client] invalid ui trigger", payload);
                return;
            }

            log_debug("[flow-client] ui-trigger received", payload);

            const client = (window as any)?.__xvm_client;


            const safe_payload = {
                _flow_id: payload._flow_id,
                _event_name: typeof payload._event_name === "string" ? payload._event_name : undefined,
                _event_payload: (payload.hasOwnProperty("_event_payload") && typeof payload._event_payload === "object" && payload._event_payload !== null) ? payload._event_payload : undefined,
                _app_id: payload._app_id ?? client?._app_id,
                _env: payload._env ?? client?._env,
                _source: payload._source === "ui" || payload._source === "event" ? payload._source : "ui"
            };

            try {
                await _x.execute({
                    _module: "flow-client",
                    _op: "trigger",
                    _params: safe_payload
                });
            } catch (err) {
                _xlog.error("[flow-client] ui trigger failed", err, safe_payload);
            }
        });
    }


    /* ------------------------------------------------------------------------ */
    /* REGISTER FLOW BINDING                                                    */
    /* ------------------------------------------------------------------------ */

    async _bind(xcmd: XCommand) {
        const params = _xu.ensure_params(xcmd?._params);

        const flow_id = _xu.ensure_string(params._flow_id, "_flow_id");
        const event = _xu.ensure_string(params._event, "_event");
        const app_id = _xu.ensure_string(params._app_id, "_app_id");
        const env = params._env ?? "default";

        const duplicate = this._bindings.find((binding) =>
            binding._flow_id === flow_id &&
            binding._event === event &&
            binding._app_id === app_id
        );

        if (duplicate) {
            log_debug("[flow-client] bind skipped (duplicate)", {
                flow_id,
                event,
                app_id
            });

            return { _ok: true, _duplicate: true };
        }

        const binding: XFlowBinding = {
            _flow_id: flow_id,
            _event: event,
            _app_id: app_id,
            _env: env
        };

        this._bindings.push(binding);

        this.ensure_event_listener(event);

        return { _ok: true };
    }

    /* ------------------------------------------------------------------------ */
    /* TRIGGER FLOW                                                             */
    /* ------------------------------------------------------------------------ */

    private normalize_trigger_payload(params_in: Record<string, any>): XFlowTriggerPayload {
        const params = _xu.ensure_params(params_in);

        return {
            _flow_id: _xu.ensure_string(params._flow_id, "_flow_id"),
            _event_name: typeof params._event_name === "string" ? params._event_name : undefined,
            _event_payload: typeof params._event_payload === "object" && params._event_payload !== null ? params._event_payload : {},
            _app_id: typeof params._app_id === "string" ? params._app_id : undefined,
            _env: typeof params._env === "string" ? params._env : undefined,
            _source: params._source === "ui" || params._source === "event" ? params._source : undefined
        };
    }

    private async trigger_flow(
        params_in: Record<string, any>
    ) {

        const normalized =
            this.normalize_trigger_payload(
                params_in
            );

        const client: any =
            XUIRuntime.requireClient();

        const app_id =
            normalized._app_id ??
            client?._app_id;

        const env =
            normalized._env ??
            client?._env;

        /* -------------------------------------------------- */
        /* VALIDATION                                         */
        /* -------------------------------------------------- */

        if (
            !app_id ||
            typeof app_id !== "string"
        ) {

            throw new Error(
                "[flow-client] missing _app_id (no payload and no XVM client)"
            );
        }

        /* -------------------------------------------------- */
        /* DEBUG                                              */
        /* -------------------------------------------------- */

        log_debug(
            "[flow-client] trigger",
            {
                event:
                    normalized._event_name,

                flow_id:
                    normalized._flow_id,

                payload:
                    normalized._event_payload,

                source:
                    normalized._source
            }
        );

        /* -------------------------------------------------- */
        /* SEND (NON-BLOCKING)                                */
        /* -------------------------------------------------- */

        const payload = {
            _module: "flow",
            _op: "run",
            _params: {
                _flow_id:
                    normalized._flow_id,

                _app_id:
                    app_id,

                ...(env !== undefined
                    ? { _env: env }
                    : {}),

                _event_payload:
                    normalized._event_payload || {},

                ...(normalized._event_name
                    ? {
                        _event_name:
                            normalized._event_name
                    }
                    : {})
            }
        };

        try {

            client
                .sendXcmd(payload)
                .then((res: any) => {

                    log_debug(
                        "[flow-client] async flow response",
                        res
                    );

                    const generated_app_id =
                        res?._flow?._last?._result?._app_id ??
                        res?._result?._flow?._last?._result?._app_id;

                    if (
                        typeof generated_app_id === "string" &&
                        generated_app_id.trim().length > 0 &&
                        generated_app_id !== app_id
                    ) {
                        log_debug("[flow-client] generated app detected", {
                            _app_id: generated_app_id
                        });

                        _xd.set("xvibe.active_app", generated_app_id, {
                            source: "flow-client"
                        });

                        _xem.fire("studio:open-app", {
                            _app_id: generated_app_id,
                            _env: env ?? "default"
                        });
                    }

                    const flow =
                        res?._flow ??
                        res?._result?._flow;

                    const flow_definition =
                        client?._flows?.get(
                            normalized._flow_id
                        );

                    /* -------------------------------------- */
                    /* APPLY FLOW OUTPUTS                     */
                    /* -------------------------------------- */

                    if (
                        flow?._outputs &&
                        typeof flow._outputs === "object"
                    ) {

                        for (const key of Object.keys(flow._outputs)) {

                            const raw =
                                flow._outputs[key];

                            const value =
                                raw &&
                                    typeof raw === "object" &&
                                    raw._ok === true &&
                                    raw.hasOwnProperty("_result")
                                    ? raw._result
                                    : raw;

                            _xd.set(
                                key,
                                value,
                                {
                                    source: "flow-client"
                                }
                            );
                        }
                    }

                    /* -------------------------------------- */
                    /* SUCCESS / ERROR HANDLERS               */
                    /* -------------------------------------- */

                    const last =
                        flow?._last;

                    if (
                        last &&
                        last._ok === true &&
                        flow_definition?._on_success
                    ) {

                        run_command_or_list(
                            flow_definition._on_success
                        ).catch((error) => {

                            _xlog.error(
                                "[flow-client] on_success failed",
                                error
                            );

                        });
                    }

                    if (
                        last &&
                        last._ok !== true &&
                        flow_definition?._on_error
                    ) {

                        run_command_or_list(
                            flow_definition._on_error
                        ).catch((error) => {

                            _xlog.error(
                                "[flow-client] on_error failed",
                                error
                            );

                        });
                    }

                })
                .catch((err: any) => {

                    _xlog.error(
                        "FLOW SEND ERROR",
                        err
                    );

                });

        } catch (err) {

            _xlog.error(
                "FLOW SEND ERROR",
                err
            );

            throw err;
        }

        /* -------------------------------------------------- */
        /* RETURN IMMEDIATELY                                 */
        /* -------------------------------------------------- */

        return {
            _ok: true,
            _queued: true,
            _flow_id:
                normalized._flow_id
        };
    }

    async _trigger(xcmd: XCommand) {
        const params = _xu.ensure_params(xcmd?._params);
        return await this.trigger_flow(params);
    }

    /* ------------------------------------------------------------------------ */
    /* EVENT LISTENER                                                           */
    /* ------------------------------------------------------------------------ */

    private ensure_event_listener(event: string) {
        if (this._bound_events.has(event)) return;

        this._bound_events.add(event);

        _xem.on(event, async (payload: any) => {
            const evt_payload =
                payload && Array.isArray(payload._args)
                    ? payload._args[0]
                    : payload;

            for (const binding of this._bindings) {
                if (binding._event !== event) continue;
                if (evt_payload?._source === "ui") continue;

                try {
                    await this.trigger_flow({
                        _flow_id: binding._flow_id,
                        _app_id: binding._app_id,
                        _env: binding._env,
                        _event_name: event,
                        _event_payload: evt_payload ?? {},
                        _source: "event"
                    });
                } catch (err) {
                    console.error("[flow-client] flow execution failed", err);
                }
            }
        });
    }

    /* ------------------------------------------------------------------------ */
    /* HELP                                                                     */
    /* ------------------------------------------------------------------------ */

    async _help() {
        return {
            _module: this._name,
            _ops: {
                bind: {
                    _params: ["_flow_id", "_event", "_app_id", "_env?"],
                    _desc: "Bind event → flow execution"
                },
                trigger: {
                    _params: ["_flow_id", "_event_payload?", "_event_name?", "_app_id?", "_env?"],
                    _desc: "Trigger flow execution directly"
                }
            }
        };
    }
}


export const XFM = new FlowManagerClient();
export const _xfm = XFM;
export default XFM;
