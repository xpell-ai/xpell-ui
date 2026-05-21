import {
    XModule,
    type XCommand,
    XResponseError,
    XResponseOK,
    _xd,
    type XpellSkill,
    type XpellSkillCommand
} from "@xpell/core";


import XDBSyncManager from "./XDBSyncManager.js";

export class EntityClient extends XModule {

    static _name = "entity-client";
    static _skill: XpellSkill = {
        _id: "entity-client",
        _title: "Entity Client Runtime",
        _version: "1.0.0",
        _active: true,
        _type: "client-module-api",
        _requires: ["xmodule", "xdata"],

        _description:
            "Client-side runtime entity manager for synced CRUD operations and local entity cache access.",

        _core_rules: [
            "Use entity-client for runtime CRUD operations.",
            "Entity records are synced through XDBSyncManager.",
            "Entity subscriptions are created automatically on first usage.",
            "Use _entity to select the target entity.",
            "Use _filter for querying and updates."
        ],

        _fields: {
            _entity: "Entity name.",
            _filter: "Entity query filter.",
            _updates: "Update payload object.",
            data: "Record data for add operation.",
            _env: "Optional environment.",
            _app_id: "Optional application id."
        }
    };

    static _ops: Record<string, XpellSkillCommand> = {
        add: {
            _name: "add",
            _scope: "module",
            _description:
                "Add a new entity record.",
            _params: {
                _entity: "Entity name.",
                data: "Record data object.",
                _env: "Optional environment.",
                _app_id: "Optional application id."
            },
            _example: {
                _module: "entity-client",
                _op: "add",
                _params: {
                    _entity: "users",
                    data: {
                        username: "john"
                    }
                }
            }
        },

        find: {
            _name: "find",
            _scope: "module",
            _description:
                "Find entity records using a filter.",
            _params: {
                _entity: "Entity name.",
                _filter: "Query filter object.",
                _env: "Optional environment.",
                _app_id: "Optional application id."
            }
        },

        update: {
            _name: "update",
            _scope: "module",
            _description:
                "Update entity records using filter + update payload.",
            _params: {
                _entity: "Entity name.",
                _filter: "Query filter object.",
                _updates: "Update payload object.",
                _env: "Optional environment.",
                _app_id: "Optional application id."
            }
        },

        delete: {
            _name: "delete",
            _scope: "module",
            _description:
                "Delete entity records using a filter.",
            _params: {
                _entity: "Entity name.",
                _filter: "Query filter object.",
                _env: "Optional environment.",
                _app_id: "Optional application id."
            }
        },

        "sync-entity": {
            _name: "sync-entity",
            _scope: "module",
            _description:
                "Synchronize entity records from the server into the local runtime cache.",
            _params: {
                _entity: "Entity name.",
                _env: "Optional environment.",
                _app_id: "Optional application id."
            }
        },

        "get-local": {
            _name: "get-local",
            _scope: "module",
            _description:
                "Return locally cached entity records.",
            _params: {
                _entity: "Entity name."
            }
        }
    };

    private _sync = new XDBSyncManager();

    private _started = false;

    constructor() {
        super({ _name: EntityClient._name });
    }

    /* -------------------------------------------------- */
    /* HELPERS                                            */
    /* -------------------------------------------------- */

    private getCurrentAppId() {
        return (
            _xd.get("xvm:current_app_id")
            ?? "default"
        );
    }

    private getEnv(
        params: any
    ) {

        return (
            params?._env
            ?? "default"
        );
    }

    private getAppId(
        params: any
    ) {

        return (
            params?._app_id
            ?? this.getCurrentAppId()
        );
    }

    private ensureEntitySubscription(
        entity: string,
        params: any
    ) {

        try {

            this._sync.subscribe({

                _entity:
                    entity,

                _app_id:
                    this.getAppId(params),

                _env:
                    this.getEnv(params)

            });

        } catch { }
    }

    private getEntity(
        params: any
    ) {

        const entity =
            params?._entity;

        if (!entity) {
            throw new Error(
                "missing _entity"
            );
        }

        return entity;
    }

    /* -------------------------------------------------- */
    /* START                                              */
    /* -------------------------------------------------- */

    async start() {

        if (this._started) {
            return;
        }

        this._started = true;
        this._sync.start();
    }

    /* -------------------------------------------------- */
    /* CRUD                                               */
    /* -------------------------------------------------- */

    async _add(
        xcmd: XCommand
    ) {

        try {

            const params =
                xcmd?._params ?? {};

            const entity =
                this.getEntity(params);

            this.ensureEntitySubscription(
                entity,
                params
            );

            const res =
                await this._sync.add(
                    entity,
                    params.data ?? {}
                );

            return res;

        } catch (err) {

            return new XResponseError(
                err
            ).toXData();
        }
    }

    async _find(
        xcmd: XCommand
    ) {

        try {

            const params =
                xcmd?._params ?? {};

            const entity =
                this.getEntity(params);

            this.ensureEntitySubscription(
                entity,
                params
            );

            const res =
                await this._sync.find(
                    entity,
                    params._filter ?? params.filter ?? {}
                );

            return res;

        } catch (err) {

            return new XResponseError(
                err
            ).toXData();
        }
    }

    async _update(
        xcmd: XCommand
    ) {

        try {

            const params =
                xcmd?._params ?? {};

            const entity =
                this.getEntity(params);

            this.ensureEntitySubscription(
                entity,
                params
            );

            const res =
                await this._sync.update(
                    entity,
                    params._filter ?? params.filter ?? {},
                    params._updates ?? params.updates ?? {}
                );

            return res;

        } catch (err) {

            return new XResponseError(
                err
            ).toXData();
        }
    }

    async _delete(
        xcmd: XCommand
    ) {

        try {

            const params =
                xcmd?._params ?? {};

            const entity =
                this.getEntity(params);

            this.ensureEntitySubscription(
                entity,
                params
            );

            const res =
                await this._sync.delete(
                    entity,
                    params._filter ?? params.filter ?? {}
                );

            return res;

        } catch (err) {

            return new XResponseError(
                err
            ).toXData();
        }
    }

    async _sync_entity(
        xcmd: XCommand
    ) {

        try {

            const params =
                xcmd?._params ?? {};

            const entity =
                this.getEntity(params);

            this.ensureEntitySubscription(
                entity,
                params
            );

            const records =
                await this._sync.syncEntity(
                    entity
                );

            return new XResponseOK({
                _records:
                    records
            }).toXData();

        } catch (err) {

            return new XResponseError(
                err
            ).toXData();
        }
    }

    async _get_local(
        xcmd: XCommand
    ) {

        try {

            const params =
                xcmd?._params ?? {};

            const entity =
                this.getEntity(params);

            this.ensureEntitySubscription(
                entity,
                params
            );

            return new XResponseOK({

                _records:
                    this._sync.getLocalRecords(
                        entity
                    )

            }).toXData();

        } catch (err) {

            return new XResponseError(
                err
            ).toXData();
        }
    }
}

export default EntityClient;