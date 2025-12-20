/**
 * XDB — Xpell Data Engine
 *
 * Core data layer of the Xpell runtime.
 *
 * XDB provides a unified in-memory data engine for structured objects,
 * graph-like relationships, and semantic (vector-based) representations.
 * It serves as the authoritative runtime store for entities used by UI,
 * AI, and application logic.
 *
 * ---
 *
 * ## Responsibilities
 *
 * - Manage XObject-based entities and their lifecycle
 * - Store and resolve structured data and relationships
 * - Support semantic fields and vectorized content
 * - Provide fast in-memory access for real-time systems
 * - Act as the data bridge between UI, AI, and runtime logic
 *
 * ---
 *
 * ## Architectural Role
 *
 * - **XDB** owns data and semantics
 * - **XUI** renders data
 * - **XVM** orchestrates application flow
 *
 * XDB itself is UI- and navigation-agnostic.
 *
 * ---
 *
 * ## Entity Model
 *
 * - Entities are instances of `XObject`
 * - Each entity is identified by `_id` and `_type`
 * - Types may be predefined or dynamically registered
 * - Objects may include semantic/vector fields for AI retrieval
 *
 * ---
 *
 * ## Performance Model
 *
 * - Primary store is in-memory for low-latency access
 * - Vector operations may be offloaded to a Matrix Processor (MAT)
 * - Designed for high-frequency reads and real-time mutation
 *
 * ---
 *
 * XDB is not a database adapter.
 * It is a runtime data engine designed for AI-first applications.
 *
 * @packageDocumentation
 * @since 2022-07-22
 * @author Tamir Fridman
 * @copyright
 * © 2022–present Aime Technologies. All rights reserved.
 */

import { Xpell, XUtils, XData, _xlog } from "xpell-core"



/**
* @class XDataBase - manage local storage
*/
export class _XDataBase {


    private _version: string = "1.0.0"
    private _local = window.localStorage
    private _session = window.sessionStorage
    private _vectors = {}
    private _encode_context: boolean = false

    constructor() {
    }

    info() {
        _xlog.log("XDB Version " + this._version)
    }

    /**
     * Indicates if the data will be encoded before saving to the local storage
     */
    set encode(value: boolean) {
        this._encode_context = value
    }

    /**
     * 
     * @param itemName 
     * @param item 
     * @deprecated use saveString instead
     */
    save(itemName: string, item: any) {
        //check if context should be encoded

        this._local.setItem(itemName, item)
    }

    /**
         * loads value from local storage
         * @param itemName @
         * @returns string
         * @deprecated use getString() function instead
         */
    load(itemName: string) {
        return this._local.getItem(itemName)
    }

    /**
     * Saves a string to the XDB
     * @param id The id of the string (tag)
     * @param stringValue the string value 
     */
    saveString(id: string, stringValue: any) {
        if (this._encode_context) {
            stringValue = XUtils.encode(stringValue)
        }
        this._local.setItem(id, stringValue)
    }




    /**
     * Gets a string value from the data storage
     * @param id the id that the string was tagged with
     * @returns <string>
     */
    getString(id: string):string | null {
        const val = this._local.getItem(id)
        if (this._encode_context && val) {
            try {
                const out = XUtils.decode(val)
                return out
            } catch (ex) {
                _xlog.error("XDB GetString ERROR", ex)
                return val
            }
        } else {
            return val
        }
    }


    /**
     * Gets a JSON Object 
     * @param id the id of the object 
     * @returns object (null if not exists)
     */
    getObject(id: string) {
        const strObj = this.getString(id)
        let outObj = null
        if (strObj) {
            try {
                outObj = JSON.parse(strObj)
            }
            catch (ex) {
                _xlog.error("XDB GetObject ERROR", ex)
            }
        }
        return outObj
    }

    /**
     * Saves an object to the XDB with an ID as a tag (will be used to retrieve the data back)
     * @param id id of the object (tag)
     * @param obj the object it self
     * @returns 
     */
    saveObject(id: string, obj: object): boolean {
        let rv = false
        if (id?.length > 0) {
            try {
                this.saveString(id, JSON.stringify(obj))
                rv = true
            } catch (ex) {
                _xlog.error("XDB Save Object ERROR", ex)
            }
        }
        return rv
    }


    resetAllData() {
        this._local.clear()
    }
}

export const XDB = new _XDataBase()


export default XDB