/*
XDBClientModule.ts
runtime bridge for _x.execute()

THIS MODULE DOES NOT:
- sync
- remote fetch
- websocket
- wormholes

ONLY:
- exposes XDBClient through runtime commands
*/

import {
    XModule,
    XResponseOK,
    XResponseError,
    type XCommand
} from "@xpell/core";

import XDB from "./XDBClient.js";

export class XDBClientModule extends XModule {

    static _name = "xdb-client";

    constructor() {

        super({
            _name:
                XDBClientModule._name
        });
    }

    /*
    INFO
    */

    async _info() {

        try {

            return new XResponseOK({
                version: "1.0.0"
            }).toXData();

        } catch (err) {

            return new XResponseError(err)
                .toXData();
        }
    }

    /*
    HAS
    */

    async _has(
        xcmd: XCommand
    ) {

        try {

            const key:any =
                xcmd?._params?.key;

            return new XResponseOK({
                exists:
                    XDB.has(key)
            }).toXData();

        } catch (err) {

            return new XResponseError(err)
                .toXData();
        }
    }

    /*
    GET STRING
    */

    async _get_string(
        xcmd: XCommand
    ) {

        try {

            const key:any =
                xcmd?._params?.key;

            return new XResponseOK({
                value:
                    XDB.getString(key)
            }).toXData();

        } catch (err) {

            return new XResponseError(err)
                .toXData();
        }
    }

    /*
    SAVE STRING
    */

    async _save_string(
        xcmd: XCommand
    ) {

        try {

            const key:any =
                xcmd?._params?.key;

            const value:any =
                xcmd?._params?.value;

            XDB.saveString(
                key,
                value
            );

            return new XResponseOK({
                saved: true
            }).toXData();

        } catch (err) {

            return new XResponseError(err)
                .toXData();
        }
    }

    /*
    GET OBJECT
    */

    async _get_object(
        xcmd: XCommand
    ) {

        try {

            const key:any =
                xcmd?._params?.key;

            return new XResponseOK({
                value:
                    XDB.getObject(key)
            }).toXData();

        } catch (err) {

            return new XResponseError(err)
                .toXData();
        }
    }

    /*
    SAVE OBJECT
    */

    async _save_object(
        xcmd: XCommand
    ) {

        try {

            const key:any =
                xcmd?._params?.key;

            const value:any =
                xcmd?._params?.value;

            XDB.saveObject(
                key,
                value
            );

            return new XResponseOK({
                saved: true
            }).toXData();

        } catch (err) {

            return new XResponseError(err)
                .toXData();
        }
    }

    /*
    REMOVE
    */

    async _remove(
        xcmd: XCommand
    ) {

        try {

            const key:any =
                xcmd?._params?.key;

            XDB.remove(key);

            return new XResponseOK({
                removed: true
            }).toXData();

        } catch (err) {

            return new XResponseError(err)
                .toXData();
        }
    }

    /*
    CLEAR
    */

    async _clear() {

        try {

            XDB.clear();

            return new XResponseOK({
                cleared: true
            }).toXData();

        } catch (err) {

            return new XResponseError(err)
                .toXData();
        }
    }

    /*
    KEYS
    */

    async _keys() {

        try {

            return new XResponseOK({
                keys:
                    XDB.keys()
            }).toXData();

        } catch (err) {

            return new XResponseError(err)
                .toXData();
        }
    }
}

export default XDBClientModule;