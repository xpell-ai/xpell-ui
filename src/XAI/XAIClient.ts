import { XModule, type XCommand, _x, _xu, _xlog, _xd } from "@xpell/core";
import { _xem } from "../XEM/XEventManager";
import Wormholes from "../Wormholes/Wormholes";
import type {
    XpellSkill,
    XpellSkillCommand
} from "@xpell/core";

/* -------------------------------------------------------------------------- */


export class XAIClient extends XModule {
    static _name = "xai-client";
    static _instance: XAIClient | null = null;

    static _skill: XpellSkill = {
        _id: "xai-client",
        _title: "XAI Client",
        _version: "1.0.0",
        _active: true,
        _type: "client-module-api",
        _requires: ["xmodule", "xem", "xdata"],

        _description:
            "Client-side flow runtime bridge. Binds UI/runtime events to server flows, triggers flows through XUIRuntime, writes flow outputs into XData, and executes on_success/on_error commands.",

        _core_rules: [
            "Use xai-client to trigger server-side XAI modules runtime events.",
            "Flow outputs are written to XData by output key.",
            "Use _on_success and _on_error in flow definitions for post-flow commands.",
            "Do not run server business logic directly on the client."
        ],

        _fields: {
        }
    };

    static _ops: Record<string, XpellSkillCommand> = {
        "set-api-key": {
            _name: "set-api-key",
            _scope: "module",
            _description:
                "Read an AI provider API key from client XData and configure the server-side XAI provider.",
            _params: {
                _provider: "Provider id. Defaults to aime.",
                _xdata_key: "Client XData key containing the API key.",
                _result_key: "Optional XData key to store the server result.",
                _error_key: "Optional XData key to store errors."
            }
        },
        "get-provider-status": {
            _name: "get-provider-status",
            _scope: "module",
            _description:
                "Get the current status of an AI provider from the server.",
            _params: {
                _provider: "Provider id. Defaults to aime.",
                _result_key: "Optional XData key to store the server result."
            }  
         }
    };


    constructor() {
        super({ _name: XAIClient._name });
        if (XAIClient._instance) {
            return XAIClient._instance;
        }
        XAIClient._instance = this;
    }

    async onLoad() {


    }

    async _set_api_key(xcmd: XCommand) {
        const params =
            _xu.ensure_params(xcmd._params);

        const provider =
            _xu.read_optional_string(
                params._provider,
                "_provider"
            ) || "aime";

        const xdataKey =
            _xu.read_optional_string(
                params._xdata_key,
                "_xdata_key"
            ) || "settings.xpell_api_key";

        const resultKey =
            _xu.read_optional_string(
                params._result_key,
                "_result_key"
            ) || "ai.connection";

        const errorKey =
            _xu.read_optional_string(
                params._error_key,
                "_error_key"
            ) || "ai.error";

        const apiKey =
            _xu.ensure_string(
                _xd.get(xdataKey),
                "api_key"
            );

        if (!apiKey.trim()) {
            const error = {
                _ok: false,
                _error: {
                    _code: "E_XAI_CLIENT_API_KEY_REQUIRED",
                    _message: "Developer Console API key is required"
                }
            };

            _xd.set(errorKey, error);
            _xd.set(resultKey, null);

            _xem.fire("xai-client:api-key-error", {
                _provider: provider,
                _error: error
            });

            return error;
        }

        _xlog.log("[xai-client] set api key", {
            _provider: provider,
            _xdata_key: xdataKey,
            _result_key: resultKey
        });

        let result: any;

        try {
            result =
                await Wormholes.sendXcmd({
                    _module: "xai",
                    _op: "set_api_key",
                    _params: {
                        _provider: provider,
                        _api_key: apiKey.trim()
                    }
                });
        } catch (err) {
            const error = {
                _ok: false,
                _error: {
                    _code: "E_XAI_CLIENT_SET_API_KEY_FAILED",
                    _message:
                        err instanceof Error
                            ? err.message
                            : String(err)
                }
            };

            _xd.set(errorKey, error);
            _xd.set(resultKey, null);

            _xem.fire("xai-client:api-key-error", {
                _provider: provider,
                _error: error
            });

            return error;
        }

        if (result?._ok === false) {
            _xd.set(errorKey, result);
            _xd.set(resultKey, null);

            _xem.fire("xai-client:api-key-error", {
                _provider: provider,
                _error: result
            });

            return result;
        }

        _xd.set(resultKey, result);
        _xd.set(errorKey, null);

        _xem.fire("xai-client:api-key-set", {
            _provider: provider,
            _result: result
        });

        return result;
    }

    async _get_provider_status(xcmd: XCommand) {
        const params = _xu.ensure_params(xcmd._params);
        const _debug = params?._debug === true || false;

       
        const provider =
            _xu.read_optional_string(params._provider, "_provider") || "aime";

        const resultKey =
            _xu.read_optional_string(params._result_key, "_result_key") || "ai.connection";


        if (_debug) {
            _xlog.log("[xai-client] get provider status", {
                _provider: provider,
                _result_key: resultKey
            });
        }

        const result = await Wormholes.sendXcmd({
            _module: "xai",
            _op: "get_provider_status",
            _params: {
                _provider: provider,
                _debug: _debug
            }
        });

        if(_debug) {
            _xlog.log("[xai-client] get provider status result", {
                _provider: provider,
                _result_key: resultKey,
                _result: result
            });
        }

        _xd.set(resultKey, result);
        return result;
    }

}


export const XAI = new XAIClient();
export const _xai = XAI;
export default XAI;
