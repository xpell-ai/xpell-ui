/*
XDBClient.ts
local client-side storage/cache engine
NO transport
NO sync
NO server logic
*/

import { _xu, _xlog } from "@xpell/core";

export type XDBClientOptions = {
    encode?: boolean;
    storage?: Storage;
};

export class XDBClient {

    private _version = "1.0.0";

    private _storage: Storage;

    private _encode = false;

    constructor(
        opts: XDBClientOptions = {}
    ) {

        this._storage =
            opts.storage ??
            window.localStorage;

        this._encode =
            opts.encode ?? false;
    }

    info() {
        _xlog.log(
            `XDBClient ${this._version}`
        );
    }

    set encode(
        value: boolean
    ) {
        this._encode = value;
    }

    get encode(): boolean {
        return this._encode;
    }

    has(
        key: string
    ): boolean {

        return (
            this._storage.getItem(key)
            !== null
        );
    }

    remove(
        key: string
    ) {

        this._storage.removeItem(key);
    }

    clear() {

        this._storage.clear();
    }

    saveString(
        key: string,
        value: string
    ) {

        let out =
            value;

        if (this._encode) {
            out =
                _xu.encode(value);
        }

        this._storage.setItem(
            key,
            out
        );
    }

    getString(
        key: string
    ): string | null {

        const val =
            this._storage.getItem(key);

        if (!val) {
            return null;
        }

        if (!this._encode) {
            return val;
        }

        try {

            return _xu.decode(val);

        } catch (err) {

            _xlog.error(
                "XDBClient.getString decode error",
                err
            );

            return val;
        }
    }

    saveObject(
        key: string,
        value: object
    ) {

        this.saveString(
            key,
            JSON.stringify(value)
        );
    }

    getObject<T = any>(
        key: string
    ): T | null {

        const val =
            this.getString(key);

        if (!val) {
            return null;
        }

        try {

            return JSON.parse(val);

        } catch (err) {

            _xlog.error(
                "XDBClient.getObject parse error",
                err
            );

            return null;
        }
    }

    saveArray(
        key: string,
        value: any[]
    ) {

        this.saveObject(
            key,
            value
        );
    }

    getArray<T = any>(
        key: string
    ): T[] {

        return (
            this.getObject<T[]>(key)
            ?? []
        );
    }

    increment(
        key: string,
        step = 1
    ): number {

        const current =
            Number(
                this.getString(key)
                ?? "0"
            );

        const next =
            current + step;

        this.saveString(
            key,
            String(next)
        );

        return next;
    }

    keys(): string[] {

        return Object.keys(
            this._storage
        );
    }
}

export const XDB =
    new XDBClient();

export default XDB;