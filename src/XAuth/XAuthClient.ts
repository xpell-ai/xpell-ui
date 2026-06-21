import {
    XModule,
    type XCommand,
    _x,
    _xd,
    _xlog,
    _xu
} from "@xpell/core";

import type {
    XpellSkill,
    XpellSkillCommand
} from "@xpell/core";

export const AUTH_SESSION_KEY = "xui:auth:session";
export const AUTH_XD_KEYS = {
    SESSION: "auth:session",
    USER: "auth:user",
    ACCOUNT: "auth:account",
    TOKEN: "auth:token",
    PROVIDER: "auth:provider"
} as const;

export type AuthXDataKey =
    typeof AUTH_XD_KEYS[
    keyof typeof AUTH_XD_KEYS
    ];


type XAuthSession = Record<string, any> & {
    _authenticated?: boolean;
    _user?: any;
    _account?: any;
    _token?: string | null;
    _provider?: string | null;
};

type XAuthResult = Record<string, any> & {
    _ok: boolean;
    _authenticated?: boolean;
    _session?: XAuthSession | null;
    _error?: any;
};

const is_object = (
    value: unknown
): value is Record<string, any> =>
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value);

const auth_source = {
    source:
        "auth-client"
};

const safe_error = (
    err: unknown
) => {
    if (err instanceof Error) {
        return {
            _message:
                err.message
        };
    }

    return {
        _message:
            String(err)
    };
};

export class XAuthClient extends XModule {

    static _name = "auth-client";
    static _instance: XAuthClient | null = null;

    static _skill: XpellSkill = {
        _id: "auth-client",
        _title: "XAuth Client",
        _version: "1.0.0",
        _active: true,
        _type: "client-module-api",
        _requires: ["xmodule", "xdata", "xdb-client", "xvm"],

        _description:
            "Generic client-side auth/session module for saving, restoring, checking, logging out, and calling configurable server auth endpoints.",

        _core_rules: [
            "Use auth-client for provider-neutral client auth/session state.",
            "Persist only the server-returned auth session object under auth:session.",
            "Mirror auth session fields into XData using auth:* keys.",
            "Call server auth endpoints through xvm.call-server.",
            "Do not add provider SDK logic, JWT verification, refresh-token logic, product hardcoding, or navigation behavior."
        ],

        _fields: {
            "auth:session": "Current auth session object.",
            "auth:user": "Current auth user object from the session.",
            "auth:account": "Current auth account object from the session.",
            "auth:token": "Current auth token string from the session.",
            "auth:provider": "Current auth provider id from the session."
        }
    };

    static _ops: Record<string, XpellSkillCommand> = {
        "save-session": {
            _name: "save-session",
            _scope: "module",
            _description: "Save an auth session to XDB and mirror it into XData.",
            _params: {
                _session: "Session object to persist.",
                _provider: "Optional provider override."
            }
        },

        "restore-session": {
            _name: "restore-session",
            _scope: "module",
            _description: "Restore auth session from XDB and mirror it into XData."
        },

        "get-session": {
            _name: "get-session",
            _scope: "module",
            _description: "Get auth session from XData first, then XDB."
        },

        "is-authenticated": {
            _name: "is-authenticated",
            _scope: "module",
            _description:
                "Return true when the current or provided session is authenticated."
        },

        logout: {
            _name: "logout",
            _scope: "module",
            _description: "Remove persisted auth session and clear auth XData keys."
        },

        "login-with-credential": {
            _name: "login-with-credential",
            _scope: "module",
            _description:
                "Call a configurable server auth endpoint with a provider credential.",
            _params: {
                _provider: "Provider id.",
                _credential: "Provider credential string.",
                _server_module: "Server module to call.",
                _server_op: "Server operation to call.",
                _credential_param: "Server params key for the credential."
            }
        },

        "call-auth-server": {
            _name: "call-auth-server",
            _scope: "module",
            _description:
                "Call a configurable server auth endpoint through xvm.call-server.",
            _params: {
                _server_module: "Server module to call.",
                _server_op: "Server operation to call.",
                _params: "Server params object."
            }
        }
    };

    constructor() {
        super({
            _name:
                XAuthClient._name
        });

        if (XAuthClient._instance) {
            return XAuthClient._instance;
        }

        XAuthClient._instance = this;
    }

    private write_session_to_xdata(
        session: XAuthSession | null
    ) {
        _xd.set(
            AUTH_XD_KEYS.SESSION,
            session,
            auth_source
        );

        _xd.set(
            AUTH_XD_KEYS.USER,
            session?._user ?? null,
            auth_source
        );

        _xd.set(
            AUTH_XD_KEYS.ACCOUNT,
            session?._account ?? null,
            auth_source
        );

        _xd.set(
            AUTH_XD_KEYS.TOKEN,
            session?._token ?? null,
            auth_source
        );

        _xd.set(
            AUTH_XD_KEYS.PROVIDER,
            session?._provider ?? null,
            auth_source
        );
    }

    private clear_session_xdata() {
        Object.values(AUTH_XD_KEYS).forEach(
            (key) =>
                _xd.set(
                    key,
                    null,
                    auth_source
                )
        );
    }

    private is_session_authenticated(
        session: unknown
    ): boolean {
        if (!is_object(session)) {
            return false;
        }

        return (
            session._authenticated === true &&
            typeof session._token === "string" &&
            session._token.trim().length > 0
        );
    }

    private async read_stored_session(): Promise<XAuthSession | null> {
        const res: any =
            await _x.execute({
                _module:
                    "xdb-client",
                _op:
                    "get-object",
                _params: {
                    key:
                        AUTH_SESSION_KEY
                }
            });

        return this.storage_value_to_session(
            res
        );
    }

    private storage_value_to_session(
        res: any
    ): XAuthSession | null {
        const value =
            res?._result?.value ??
            res?.value ??
            res?._payload?._result?.value ??
            res?._payload?.value ??
            null;

        return is_object(value)
            ? value
            : null;
    }

    private normalize_response(
        raw: any
    ): XAuthResult {
        const source =
            is_object(raw?._payload)
                ? raw._payload
                : raw;

        if (is_object(source) && typeof source._ok === "boolean") {
            if (source._ok !== true) {
                return {
                    _ok: false,
                    _error:
                        source._error ??
                        source._result ??
                        source
                };
            }

            if (is_object(source._result)) {
                return this.normalize_auth_result({
                    _ok: true,
                    ...source._result
                });
            }

            if ("_result" in source) {
                return this.normalize_auth_result({
                    _ok: true,
                    _result:
                        source._result
                });
            }

            return this.normalize_auth_result(
                source as XAuthResult
            );
        }

        if (is_object(source)) {
            return this.normalize_auth_result({
                _ok: true,
                ...source
            });
        }

        return {
            _ok: true,
            _result:
                source,
            _authenticated:
                false
        };
    }

    private normalize_auth_result(
        result: XAuthResult
    ): XAuthResult {
        const session =
            is_object(result._session)
                ? result._session
                : this.looks_like_session(result)
                    ? result as XAuthSession
                    : null;

        const authenticated =
            result._authenticated === true ||
            this.is_session_authenticated(session);

        if (!session) {
            return {
                ...result,
                _authenticated:
                    authenticated
            };
        }

        return {
            ...result,
            _authenticated:
                authenticated,
            _session:
                session
        };
    }

    private looks_like_session(
        value: Record<string, any>
    ): boolean {
        return (
            "_authenticated" in value ||
            "_token" in value ||
            "_user" in value ||
            "_account" in value ||
            "_provider" in value
        );
    }

    private log_auth_state(
        message: string,
        data: {
            _provider?: string | null;
            _authenticated?: boolean;
            _server_module?: string;
            _server_op?: string;
            _session?: XAuthSession | null;
        } = {}
    ) {
        _xlog.log(
            message,
            {
                _provider:
                    data._provider ?? null,
                _authenticated:
                    data._authenticated ?? false,
                _has_token:
                    typeof data._session?._token === "string" &&
                    data._session._token.trim().length > 0,
                _server_module:
                    data._server_module,
                _server_op:
                    data._server_op
            }
        );
    }

    async _save_session(
        xcmd: XCommand
    ) {
        try {
            const params =
                _xu.ensure_params(
                    xcmd?._params
                );

            const raw_session =
                params._session;

            if (!is_object(raw_session)) {
                throw new Error(
                    "auth-client save-session: missing _session object"
                );
            }

            const provider =
                typeof params._provider === "string" &&
                    params._provider.trim().length > 0
                    ? params._provider.trim()
                    : undefined;

            const session: XAuthSession = {
                ...raw_session,
                ...(provider
                    ? {
                        _provider:
                            provider
                    }
                    : {})
            };

            await _x.execute({
                _module:
                    "xdb-client",
                _op:
                    "save-object",
                _params: {
                    key:
                        AUTH_SESSION_KEY,
                    value:
                        session
                }
            });

            this.write_session_to_xdata(
                session
            );

            this.log_auth_state(
                "[auth-client] session saved",
                {
                    _provider:
                        session._provider,
                    _authenticated:
                        this.is_session_authenticated(session),
                    _session:
                        session
                }
            );

            return {
                _ok: true,
                _session:
                    session
            };
        } catch (err) {
            _xlog.error(
                "[auth-client] save-session failed",
                safe_error(err)
            );

            return {
                _ok: false,
                _error:
                    safe_error(err)
            };
        }
    }

    async _restore_session() {
        try {
            const session =
                await this.read_stored_session();

            if (!session) {
                return {
                    _ok: true,
                    _authenticated:
                        false
                };
            }

            this.write_session_to_xdata(
                session
            );

            const authenticated =
                this.is_session_authenticated(
                    session
                );

            this.log_auth_state(
                "[auth-client] session restored",
                {
                    _provider:
                        session._provider,
                    _authenticated:
                        authenticated,
                    _session:
                        session
                }
            );

            return {
                _ok: true,
                _authenticated:
                    authenticated,
                _session:
                    session
            };
        } catch (err) {
            _xlog.error(
                "[auth-client] restore-session failed",
                safe_error(err)
            );

            return {
                _ok: false,
                _error:
                    safe_error(err)
            };
        }
    }

    async _get_session() {
        try {
            const has_xd_session =
                _xd.has(AUTH_XD_KEYS.SESSION);

            const xd_session =
                has_xd_session
                    ? _xd.get(AUTH_XD_KEYS.SESSION)
                    : null;

            const session =
                has_xd_session
                    ? is_object(xd_session)
                        ? xd_session as XAuthSession
                        : null
                    : await this.read_stored_session();

            return {
                _ok: true,
                _session:
                    session,
                _authenticated:
                    this.is_session_authenticated(
                        session
                    )
            };
        } catch (err) {
            _xlog.error(
                "[auth-client] get-session failed",
                safe_error(err)
            );

            return {
                _ok: false,
                _error:
                    safe_error(err)
            };
        }
    }

    async _is_authenticated(
        xcmd: XCommand
    ) {
        try {
            const params =
                _xu.ensure_params(
                    xcmd?._params
                );

            const current =
                is_object(params._session)
                    ? {
                        _session:
                            params._session as XAuthSession
                    }
                    : await _x.execute({
                        _module:
                            XAuthClient._name,
                        _op:
                            "get-session"
                    }) as XAuthResult;

            const session =
                current._session;

            return {
                _ok: true,
                _authenticated:
                    this.is_session_authenticated(
                        session
                    )
            };
        } catch (err) {
            _xlog.error(
                "[auth-client] is-authenticated failed",
                safe_error(err)
            );

            return {
                _ok: false,
                _authenticated:
                    false,
                _error:
                    safe_error(err)
            };
        }
    }

    async _logout() {
        try {
            await _x.execute({
                _module:
                    "xdb-client",
                _op:
                    "remove",
                _params: {
                    key:
                        AUTH_SESSION_KEY
                }
            });

            this.clear_session_xdata();

            _xlog.log(
                "[auth-client] logout",
                {
                    _authenticated:
                        false,
                    _has_token:
                        false
                }
            );

            return {
                _ok: true
            };
        } catch (err) {
            _xlog.error(
                "[auth-client] logout failed",
                safe_error(err)
            );

            return {
                _ok: false,
                _error:
                    safe_error(err)
            };
        }
    }

    async _login_with_credential(
        xcmd: XCommand
    ) {
        try {
            const params =
                _xu.ensure_params(
                    xcmd?._params
                );

            const provider =
                _xu.ensure_string(
                    params._provider,
                    "_provider"
                );

            const credential =
                _xu.ensure_string(
                    params._credential,
                    "_credential"
                );

            const server_module =
                _xu.ensure_string(
                    params._server_module,
                    "_server_module"
                );

            const server_op =
                _xu.ensure_string(
                    params._server_op,
                    "_server_op"
                );

            const credential_param =
                typeof params._credential_param === "string" &&
                    params._credential_param.trim().length > 0
                    ? params._credential_param.trim()
                    : "_credential";

            this.log_auth_state(
                "[auth-client] login-with-credential",
                {
                    _provider:
                        provider,
                    _server_module:
                        server_module,
                    _server_op:
                        server_op
                }
            );

            const auth_result =
                await _x.execute({
                    _module:
                        XAuthClient._name,
                    _op:
                        "call-auth-server",
                    _params: {
                        _server_module:
                            server_module,
                        _server_op:
                            server_op,
                        _params: {
                            [credential_param]:
                                credential
                        }
                    }
                }) as XAuthResult;

            if (auth_result._ok !== true) {
                return auth_result;
            }

            const session =
                is_object(auth_result._session)
                    ? auth_result._session as XAuthSession
                    : null;

            const authenticated =
                auth_result._authenticated === true ||
                this.is_session_authenticated(
                    session
                );

            if (authenticated && session) {
                if (
                    typeof session._provider !== "string" ||
                    session._provider.trim().length === 0
                ) {
                    session._provider =
                        provider;
                }

                const save_result =
                    await _x.execute({
                        _module:
                            XAuthClient._name,
                        _op:
                            "save-session",
                        _params: {
                            _session:
                                session,
                            _provider:
                                provider
                        }
                    });

                if (save_result?._ok !== true) {
                    return save_result;
                }

                return {
                    ...auth_result,
                    _authenticated:
                        authenticated,
                    _session:
                        session
                };
            }

            return {
                ...auth_result,
                _authenticated:
                    authenticated
            };
        } catch (err) {
            _xlog.error(
                "[auth-client] login-with-credential failed",
                safe_error(err)
            );

            return {
                _ok: false,
                _error:
                    safe_error(err)
            };
        }
    }

    async _call_auth_server(
        xcmd: XCommand
    ) {
        try {
            const params =
                _xu.ensure_params(
                    xcmd?._params
                );

            const server_module =
                _xu.ensure_string(
                    params._server_module,
                    "_server_module"
                );

            const server_op =
                _xu.ensure_string(
                    params._server_op,
                    "_server_op"
                );

            const server_params =
                is_object(params._params)
                    ? params._params
                    : {};

            this.log_auth_state(
                "[auth-client] call-auth-server",
                {
                    _server_module:
                        server_module,
                    _server_op:
                        server_op
                }
            );

            const raw =
                await _x.execute({
                    _module:
                        "xvm",
                    _op:
                        "call-server",
                    _params: {
                        _cmd: {
                            _module:
                                server_module,
                            _op:
                                server_op,
                            _params:
                                server_params
                        }
                    }
                });

            const normalized =
                this.normalize_response(
                    raw
                );

            this.log_auth_state(
                "[auth-client] auth server response",
                {
                    _provider:
                        normalized._session?._provider,
                    _authenticated:
                        normalized._authenticated,
                    _server_module:
                        server_module,
                    _server_op:
                        server_op,
                    _session:
                        normalized._session
                }
            );

            return normalized;
        } catch (err) {
            _xlog.error(
                "[auth-client] call-auth-server failed",
                safe_error(err)
            );

            return {
                _ok: false,
                _error:
                    safe_error(err)
            };
        }
    }
}

export const XAuth =
    new XAuthClient();

export const _xauth =
    XAuth;


export type { XAuthSession, XAuthResult };

export default XAuthClient;
