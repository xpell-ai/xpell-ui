import { XModule, type XCommand, _x, _xu } from "@xpell/core";
import { _xem } from "../XEM/XEventManager";

/* -------------------------------------------------------------------------- */

type XFlowBinding = {
    _flow_id: string;
    _event: string;
    _app_id: string;
    _env?: string;
};

/* -------------------------------------------------------------------------- */

export class FlowManagerClient extends XModule {
    static _name = "flow-client";

    private _bindings: XFlowBinding[] = [];
    private _bound_events: Set<string> = new Set();

    constructor() {
        super({ _name: FlowManagerClient._name });
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

                try {
                    await _x.execute({
                        _module: "flow",
                        _op: "run",
                        _params: {
                            _flow_id: binding._flow_id,
                            _app_id: binding._app_id,
                            ...(binding._env ? { _env: binding._env } : {}),
                            ...(evt_payload !== undefined ? { _event_payload: evt_payload } : {})
                        }
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
                }
            }
        };
    }
}


export const XFM = new FlowManagerClient();
export const _xfm = XFM;
export default XFM;
