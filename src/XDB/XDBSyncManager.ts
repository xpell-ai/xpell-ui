/**
 * XDBSyncManager
 *
 * Local cache sync helper between:
 * - XDBClient local cache
 * - server entity-manager
 * - Wormholes v2 server events via XEM
 *
 * Not authoritative persistence.
 * Server XDB is the source of truth.
 */

import {  _xlog } from "@xpell/core";
import { _xem } from "../XEM/XEventManager";
import { XUIRuntime } from "../XUI/XUIRuntime";
import XDBClient from "./XDBClient.js";

export type XDBSyncEntityConfig = {
    _entity: string;
    _app_id?: string;
    _env?: string;
    _cache_key?: string;
};

export class XDBSyncManager {

    private _subscriptions: Map<string, XDBSyncEntityConfig> = new Map();
    private _started = false;

    constructor() {
    }

    /* -------------------------------------------------- */
    /* START                                              */
    /* -------------------------------------------------- */

    start() {
        if (this._started) return;
        this._started = true;

        _xlog.log("[xdb-sync] started");

        _xem.on("xdb:create", async (ev: any) => {
            await this.onRecordCreated(ev);
        });

        _xem.on("xdb:update", async (ev: any) => {
            await this.onRecordUpdated(ev);
        });

        _xem.on("xdb:delete", async (ev: any) => {
            await this.onRecordDeleted(ev);
        });
    }

    /* -------------------------------------------------- */
    /* SUBSCRIBE                                          */
    /* -------------------------------------------------- */

    subscribe(cfg: XDBSyncEntityConfig) {
        const entity = cfg._entity;

        this._subscriptions.set(entity, cfg);

        _xlog.log(`[xdb-sync] subscribed ${entity}`);
    }

    unsubscribe(entity: string) {
        this._subscriptions.delete(entity);

        _xlog.log(`[xdb-sync] unsubscribed ${entity}`);
    }

    /* -------------------------------------------------- */
    /* HELPERS                                            */
    /* -------------------------------------------------- */

    private getConfig(entity: string) {
        const cfg = this._subscriptions.get(entity);

        if (!cfg) {
            throw new Error(`entity not subscribed: ${entity}`);
        }

        return cfg;
    }

    private getCacheKey(entity: string) {
        const cfg = this.getConfig(entity);

        return cfg._cache_key ?? `xdb:${cfg._env ?? "default"}:${cfg._app_id ?? "default"}:${entity}`;
    }

    private getClient() {
        return XUIRuntime.requireClient();
    }

    private async sendServerXcmd(xcmd: any) {
        const client = this.getClient();

        return await client.sendXcmd(xcmd);
    }

    private async sendEntityCommand(entity: string, op: string, params: any = {}) {
        const cfg = this.getConfig(entity);

        return await this.sendServerXcmd({
            _module: "entity-manager",
            _op: op,
            _params: {
                _app_id: cfg._app_id,
                _env: cfg._env ?? "default",
                _entity: entity,
                ...params
            }
        });
    }

    /* -------------------------------------------------- */
    /* FULL PULL                                          */
    /* -------------------------------------------------- */

    async syncEntity(entity: string) {
        const res = await this.sendEntityCommand(entity, "find", {
            filter: {}
        });

        if (!res?._ok) {
            throw new Error(`sync failed: ${entity}`);
        }

        const records =
            res?._result?._records ??
            res?._result?.records?._data ??
            res?._result?.records ??
            [];

        XDBClient.saveObject(this.getCacheKey(entity), records);

        _xem.fire("xdb-sync-updated", {
            _entity: entity,
            _records: records
        });

        _xlog.log(`[xdb-sync] synced ${entity} (${records.length})`);

        return records;
    }

    /* -------------------------------------------------- */
    /* LOCAL CACHE                                        */
    /* -------------------------------------------------- */

    getLocalRecords(entity: string): any[] {
        try {
            return XDBClient.getObject(this.getCacheKey(entity)) ?? [];
        } catch {
            return [];
        }
    }

    private saveLocalRecords(entity: string, records: any[]) {
        XDBClient.saveObject(this.getCacheKey(entity), records);
    }

    clearLocal(entity: string) {
        XDBClient.remove(this.getCacheKey(entity));
    }

    /* -------------------------------------------------- */
    /* SERVER EVENTS                                      */
    /* -------------------------------------------------- */

    private async onRecordCreated(ev: any) {
        const entity:any = ev?._entity;
        const record:any = ev?._record ?? ev?.record;

        if (!entity || !record || !this._subscriptions.has(entity)) return;

        const records = this.getLocalRecords(entity);
        const exists = records.find((x: any) => x._id === record._id);

        if (!exists) records.push(record);

        this.saveLocalRecords(entity, records);

        _xem.fire("xdb-local-created", ev);
    }

    private async onRecordUpdated(ev: any) {
        const entity:any = ev?._entity;
        const record:any = ev?._record ?? ev?.record;

        if (!entity || !record || !this._subscriptions.has(entity)) return;

        const records = this.getLocalRecords(entity);
        const idx = records.findIndex((x: any) => x._id === record._id);

        if (idx >= 0) {
            records[idx] = record;
        } else {
            records.push(record);
        }

        this.saveLocalRecords(entity, records);

        _xem.fire("xdb-local-updated", ev);
    }

    private async onRecordDeleted(ev: any) {
        const entity:any = ev?._entity;
        const id:any = ev?._id ?? ev?._record_id;

        if (!entity || !id || !this._subscriptions.has(entity)) return;

        const records = this.getLocalRecords(entity)
            .filter((x: any) => x._id !== id);

        this.saveLocalRecords(entity, records);

        _xem.fire("xdb-local-deleted", ev);
    }

    /* -------------------------------------------------- */
    /* REMOTE MUTATIONS                                   */
    /* -------------------------------------------------- */

    async add(entity: string, data: any) {
        const res = await this.sendEntityCommand(entity, "add", {
            data
        });

        const record =
            res?._result?._record ??
            res?._result?.record;

        if (res?._ok && record) {
            await this.onRecordCreated({
                _entity: entity,
                _record: record,
                _source: "xdb-sync:add"
            });
        }

        return res;
    }

    async find(entity: string, filter: any = {}) {
        const res = await this.sendEntityCommand(entity, "find", {
            filter
        });

        const records =
            res?._result?._records ??
            res?._result?.records?._data;

        if (res?._ok && Array.isArray(records)) {
            this.saveLocalRecords(entity, records);
        }

        return res;
    }

    async update(entity: string, filter: any, updates: any) {
        const res = await this.sendEntityCommand(entity, "update", {
            filter,
            updates
        });

        if (res?._ok) {
            await this.syncEntity(entity);
        }

        return res;
    }

    async delete(entity: string, filter: any) {
        const res = await this.sendEntityCommand(entity, "delete", {
            filter
        });

        if (res?._ok) {
            await this.syncEntity(entity);
        }

        return res;
    }
}

export default XDBSyncManager;