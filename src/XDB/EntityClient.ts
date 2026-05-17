import {
    XModule,
    type XCommand,
    XResponseError,
    XResponseOK,
    _xd
} from "@xpell/core";

import XDBSyncManager from "./XDBSyncManager.js";

export class EntityClient extends XModule {

    static _name = "entity-client";

    private _sync =
        new XDBSyncManager();

    private _started =
        false;

    constructor() {

        super({
            _name:
                EntityClient._name
        });
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