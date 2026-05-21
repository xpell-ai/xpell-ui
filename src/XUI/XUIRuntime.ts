import { _x, _xlog } from "@xpell/core";

import { XUI } from "./XUI";
import { XVM } from "../XVM/XVM";
import { XFM } from "../XFM/FlowManagerClient";
import { XVMClient, type XVMClientOptions } from "../XVM/XVMClient";
import { EntityClient } from "../XDB/EntityClient";
import { XDBClientModule } from "../XDB/XDBModule";

/* -------------------------------------------------------------------------- */

export type XUIRuntimeOptions = {
  _auto_start?: boolean;
  _load_flow?: boolean;
  _load_xvm?: boolean;
  _load_entity_client?: boolean;
};

export type XUIRuntimeAppOptions = XVMClientOptions & {
  _runtime?: XUIRuntimeOptions;
  _object_packs?: any[];
  _modules?: any[];
  _debug?: boolean;
};

/* -------------------------------------------------------------------------- */

export class XUIRuntime {
  private static _client: XVMClient | null = null;

  /* ---------------------------------------------------------------------- */
  /* LOAD MODULES                                                           */
  /* ---------------------------------------------------------------------- */



  static async loadModules(opts: XUIRuntimeOptions = {}) {
    const {
      _auto_start: auto_start = true,
      _load_flow: load_flow = true,
      _load_xvm: load_xvm = true,
      _load_entity_client: load_entity_client = true
    } = opts;

    await _x.loadModuleAsync(XUI);
    await _x.loadModuleAsync(new XDBClientModule());

    if (load_xvm) {
      await _x.loadModuleAsync(XVM);
    }

    if (load_flow) {
      await _x.loadModuleAsync(XFM);
    }

    if (load_entity_client) {
      await _x.loadModuleAsync(new EntityClient());
    }


    if (auto_start) {
      _x.start();
    }
  }

  /* ---------------------------------------------------------------------- */
  /* LOAD APP                                                               */
  /* ---------------------------------------------------------------------- */

  static async loadApp(opts: XUIRuntimeAppOptions) {
    if (!opts?._app_id) throw new Error("Missing app_id");
    if (!opts?._wormhole_url) throw new Error("Missing wormhole_url");

    /* -------------------------------------------------------------- */
    /* 1. Load modules                                                */
    /* -------------------------------------------------------------- */

    await this.loadModules(opts._runtime);

    if (Array.isArray(opts._modules)) {

      for (const mod of opts._modules) {

        await _x.loadModuleAsync(mod);

      }

    }
    const xui = _x.getModule("xui");



    if (Array.isArray(opts._object_packs)) {
      for (const pack of opts._object_packs) {
        if(opts._debug) _xlog.log("[XUIRuntime] Importing object pack", pack.getObjects());
        xui.importObjectPack(pack);
      }
    }

    /* -------------------------------------------------------------- */
    /* 2. Create XVM client                                           */
    /* -------------------------------------------------------------- */

    const client = new XVMClient({
      _app_id: opts._app_id,
      _env: opts._env ?? "default",
      _wormhole_url: opts._wormhole_url,

      _region: opts._region,
      _fallback_view_id: opts._fallback_view_id,

      onViewRendered: opts.onViewRendered,
      onConnectionChange: opts.onConnectionChange,
      onError: opts.onError,
      onAppMounted: opts.onAppMounted,
      _theme: opts._theme
    });

    this._client = client;
    if (typeof window !== "undefined") {
      (window as any).__xvm_client = client;
    }

    /* -------------------------------------------------------------- */
    /* 3. Bootstrap app                                               */
    /* -------------------------------------------------------------- */

    await client.bootstrap();

    return client;
  }

  /* ---------------------------------------------------------------------- */
  /* GET CLIENT                                                             */
  /* ---------------------------------------------------------------------- */

  static getClient(): XVMClient | null {
    return this._client;
  }

  static requireClient(): XVMClient {
    if (!this._client) {
      throw new Error("[xui-runtime] XVMClient not initialized");
    }
    return this._client;
  }
}

export default XUIRuntime;
