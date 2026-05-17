import { _x } from "@xpell/core";

import { XUI } from "./XUI";
import { XVM } from "../XVM/XVM";
import { XFM } from "../XFM/FlowManagerClient";
import { XVMClient, type XVMClientOptions } from "../XVM/XVMClient";
import { EntityClient } from "../XDB/EntityClient";

/* -------------------------------------------------------------------------- */

export type XUIRuntimeOptions = {
  auto_start?: boolean;
  load_flow?: boolean;
  load_xvm?: boolean;
  load_entity_client?: boolean;
};

export type XUIRuntimeAppOptions = XVMClientOptions & {
  runtime?: XUIRuntimeOptions;
};

/* -------------------------------------------------------------------------- */

export class XUIRuntime {
  private static _client: XVMClient | null = null;

  /* ---------------------------------------------------------------------- */
  /* LOAD MODULES                                                           */
  /* ---------------------------------------------------------------------- */



  static loadModules(opts: XUIRuntimeOptions = {}) {
    const {
      auto_start = true,
      load_flow = true,
      load_xvm = true,
      load_entity_client = true
    } = opts;

    _x.loadModule(XUI);

    if (load_xvm) {
      _x.loadModule(XVM);
    }

    if (load_flow) {
      _x.loadModule(XFM);
    }

    if (load_entity_client) {
      _x.loadModule(new EntityClient());
    }

    if (auto_start) {
      _x.start();
    }
  }

  /* ---------------------------------------------------------------------- */
  /* LOAD APP                                                               */
  /* ---------------------------------------------------------------------- */

  static async loadApp(opts: XUIRuntimeAppOptions) {
    if (!opts?.app_id) throw new Error("Missing app_id");
    if (!opts?.wormhole_url) throw new Error("Missing wormhole_url");

    /* -------------------------------------------------------------- */
    /* 1. Load modules                                                */
    /* -------------------------------------------------------------- */

    this.loadModules(opts.runtime);

    /* -------------------------------------------------------------- */
    /* 2. Create XVM client                                           */
    /* -------------------------------------------------------------- */

    const client = new XVMClient({
      app_id: opts.app_id,
      env: opts.env ?? "default",
      wormhole_url: opts.wormhole_url,

      region: opts.region,
      fallback_view_id: opts.fallback_view_id,

      onViewRendered: opts.onViewRendered,
      onConnectionChange: opts.onConnectionChange,
      onError: opts.onError,
      onAppMounted: opts.onAppMounted
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
