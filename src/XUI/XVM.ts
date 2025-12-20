/**
 * XVM — Xpell View Manager
 *
 * Single-Page Application (SPA) orchestration layer for Xpell.
 * Responsible for view navigation, region routing, view stacking,
 * history management, URL synchronization, and application structure
 * via the App Manifest.
 *
 * ---
 *
 * ## Responsibilities
 *
 * - Navigation between views
 * - View stacking and lifecycle coordination
 * - Browser history and URL synchronization
 * - Region-based rendering (multi-container support)
 * - Application bootstrapping via App Manifest
 *
 * ---
 *
 * ## Architectural Separation
 *
 * - **XUI**
 *   - Creates, mounts, and removes DOM objects
 *   - Does NOT control visibility on add/mount
 *
 * - **XVM**
 *   - Controls navigation, stacking, and visibility
 *   - Owns history, URL sync, and application structure
 *
 * ---
 *
 * ## Core Invariants
 *
 * - `XUI.add()` MUST NOT call `show()`
 * - `stackInternal()` is the ONLY place allowed to call `view.show()`
 * - `navigate()` is the ONLY method allowed to touch `window.location`
 *   (and only for hash-synced regions)
 *
 * ---
 *
 * ## Region Model
 *
 * - A **Region** is a logical alias and policy wrapper around a container ID
 * - Components navigate by **region name** (default: `"main"`)
 * - Components MUST NOT be aware of concrete container IDs
 *
 * ---
 *
 * ## App Manifest
 *
 * Calling `XVM.load(app)`:
 *
 * - Creates player/container roots (optional)
 * - Registers containers and regions
 * - Registers views (raw objects or factories)
 * - Registers routes and initializes the router
 * - Performs initial navigation
 *
 * ---
 *
 * XVM is the authoritative source of truth for application flow
 * and navigation within the Xpell runtime.
 * 
 * XVM turns UI components into an application.
 *
 * @packageDocumentation
 * @since 2022-07-22
 * @author Tamir Fridman
 */


import { XModule, _xlog, _xd, _xem, type XObjectData, XParams } from "xpell-core";
import { XUI } from "./XUI";
import { XUIObject } from "./XUIObject";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type XViewContainer = XUIObject;
type ContainerMap = Record<string, XViewContainer>;
type HistoryMap = Record<string, XUIObject[]>;
type RawViewsMap = Record<string, XObjectData>;
type ActiveMap = Record<string, string | null>;

export const XVMEvents = {
  container_added: "xvm-container-added",
  app_loaded: "xvm-app-loaded",
} as const;

type RegionName = string;

export type RegionConfig = {
  containerId: string;
  history?: boolean; // default true
  hashSync?: boolean; // default true only for "main"
};

export type NavigateOptions = {
  containerId?: string; // power-user override
  region?: RegionName; // recommended
  replace?: boolean;
  silent?: boolean;
};

export type ShowOptions = {
  containerId?: string; // power-user override
  region?: RegionName; // recommended
  allowCreateFromRaw?: boolean; // default true
  allowCreateFromFactory?: boolean; // default true
};

export type CloseOptions = {
  containerId?: string;
  region?: RegionName;
  clearHistory?: boolean; // default false
};

/* -------------------------------------------------------------------------- */
/* App Manifest                                                               */
/* -------------------------------------------------------------------------- */

export type XVMViewFactory = (ctx: {
  _id: string;
  _container_id: string;
  _region?: string;
  _params?: any;
  _route?: XVMRouteSpec;
}) => XObjectData | Promise<XObjectData>;

export type XVMContainerSpec = {
  _id: string;
  _parent_element?: string; // DOM id to mount into (defaults to player)
  class?: string;
  style?: string;
};

export type XVMRegionSpec = {
  _id: string; // region name
  _container_id: string;
  _history?: boolean; // default true
  _hash_sync?: boolean; // default: true only for "main"
};

export type XVMRouteSpec = {
  _id: string; // route id
  _view_id?: string; // if omitted, defaults to _id
  _region?: string; // default region
  _container_id?: string; // optional override
  _replace?: boolean;
  _silent?: boolean;
};

export type XVMApp = {
  xpell?: { version?: number };

  // Optional: create player root automatically
  _player?: {
    _id?: string; // "xplayer"
    _parent_element?: string; // DOM id to mount player into
    class?: string;
    style?: string;
    _set_as_main_player?: boolean; // default true
  };

  // Shell: static layout frame (topbar/sidebar/regions hosts)
  _shell?: XObjectData | (() => XObjectData | Promise<XObjectData>);

  // Optional: define containers and regions in one place
  _containers?: XVMContainerSpec[];
  _regions?: XVMRegionSpec[];

  // Views: raw JSON or factory (async allowed)
  _views?: Record<string, XObjectData | XVMViewFactory>;
  _routes?: XVMRouteSpec[];

  // Router + start
  _router?: {
    _region?: string; // default "main"
    _fallback_view_id?: string;
  };

  _start?: {
    _route_id?: string;
    _view_id?: string;
    _region?: string;
    _container_id?: string;
    _params?: any;
  };
};

/* -------------------------------------------------------------------------- */
/* Implementation                                                             */
/* -------------------------------------------------------------------------- */

class _XVM extends XModule {
  static _module_name = "xvm";

  _event_container_added = XVMEvents.container_added;
  _event_app_loaded = XVMEvents.app_loaded;

  _debug = false;

  private _containers: ContainerMap = {};
  private _history: HistoryMap = {};
  private _rawViews: RawViewsMap = {};
  private _factories: Record<string, XVMViewFactory> = {};
  private _routes: Record<string, XVMRouteSpec> = {};
  private _active: ActiveMap = {};

  private _regions: Record<RegionName, RegionConfig> = {};
  private _defaultRegion: RegionName = "main";

  constructor() {
    super({ _name: _XVM._module_name });
  }

  private log(...args: any[]) {
    if (!this._debug) return;
    _xlog.log("XVM", ...args);
  }

  /* ------------------------------------------------------------------------ */
  /* Containers                                                               */
  /* ------------------------------------------------------------------------ */

  /**
   * Register an existing XUIObject as a container.
   * (You can still keep this strict for non-manifest usage.)
   */
  addContainer(container: XViewContainer | XObjectData, create = false) {
    let c: XViewContainer;

    if (container instanceof XUIObject) {
      c = container;
    } else {
      if (!create) throw new Error("XVM.addContainer: container is raw data but create=false");
      // NOTE: XUI.add mounts but DOES NOT show (required by XVM contract)
      c = XUI.add(container as any) as XUIObject;
    }

    if (!c?._id) throw new Error("XVM container must have an _id");

    if (!this._containers[c._id]) {
      this._containers[c._id] = c;
      this._active[c._id] = this._active[c._id] ?? null;
      this.log("Container added:", c._id);
      _xem.fire(this._event_container_added, c);
    }

    return c;
  }

  getContainer(containerId: string): XViewContainer | undefined {
    return this._containers[containerId];
  }

  private requireContainer(containerId: string): XViewContainer {
    const c = this._containers[containerId];
    if (!c) throw new Error(`XVM: container not registered: ${containerId}`);
    return c;
  }

  /* ------------------------------------------------------------------------ */
  /* Regions                                                                  */
  /* ------------------------------------------------------------------------ */

  registerRegion(region: RegionName, cfg: RegionConfig) {
    if (!region) throw new Error("XVM.registerRegion: region is required");
    if (!cfg?.containerId) throw new Error("XVM.registerRegion: containerId is required");

    // container must already be registered
    this.requireContainer(cfg.containerId);

    this._regions[region] = {
      containerId: cfg.containerId,
      history: cfg.history ?? true,
      hashSync: cfg.hashSync ?? (region === "main"),
    };

    this.log("Region registered:", region, this._regions[region]);
  }

  setDefaultRegion(region: RegionName) {
    if (!this._regions[region]) throw new Error("XVM.setDefaultRegion: unknown region: " + region);
    this._defaultRegion = region;
  }

  private resolveTarget(opts?: { containerId?: string; region?: RegionName }) {
    // containerId override always wins (but must be registered)
    if (opts?.containerId) {
      this.requireContainer(opts.containerId);
      return { containerId: opts.containerId, region: undefined as any };
    }

    const region = opts?.region ?? this._defaultRegion;
    const cfg = this._regions[region];
    if (!cfg?.containerId) throw new Error(`XVM: region not registered: ${region}`);

    this.requireContainer(cfg.containerId);
    return { containerId: cfg.containerId, region };
  }

  private regionPolicy(region?: RegionName) {
    if (!region) return { history: true, hashSync: true };
    const cfg = this._regions[region];
    return {
      history: cfg?.history ?? true,
      hashSync: cfg?.hashSync ?? (region === "main"),
    };
  }

  /* ------------------------------------------------------------------------ */
  /* History                                                                  */
  /* ------------------------------------------------------------------------ */

  private ensureHistory(containerId: string): XUIObject[] {
    if (!this._history[containerId]) this._history[containerId] = [];
    return this._history[containerId];
  }

  clearContainerHistory(opts?: { containerId?: string; region?: RegionName }) {
    const t = this.resolveTarget(opts);
    this._history[t.containerId] = [];
    this.log("History cleared:", t.containerId);
  }

  /* ------------------------------------------------------------------------ */
  /* Views + Routes registry                                                  */
  /* ------------------------------------------------------------------------ */

  registerRawView(view: XObjectData) {
    if (!view?._id) throw new Error("XVM.registerRawView: raw view must have _id");
    this._rawViews[String(view._id)] = view;
    this.log("Raw view registered:", view._id);
  }

  registerViewFactory(viewId: string, factory: XVMViewFactory) {
    if (!viewId) throw new Error("XVM.registerViewFactory: viewId is required");
    if (typeof factory !== "function") throw new Error("XVM.registerViewFactory: factory must be a function");
    this._factories[viewId] = factory;
    this.log("View factory registered:", viewId);
  }

  registerRoute(route: XVMRouteSpec) {
    if (!route?._id) throw new Error("XVM.registerRoute: route must have _id");
    this._routes[String(route._id)] = route;
    this.log("Route registered:", route._id);
  }

  getRoute(routeId: string): XVMRouteSpec | undefined {
    return this._routes[String(routeId)];
  }

  /* ------------------------------------------------------------------------ */
  /* Internals: active child management                                        */
  /* ------------------------------------------------------------------------ */

  private detachFromParent(view: XUIObject) {
    const p = view?._parent;
    if (p && p instanceof XUIObject) {
      const idx = (p._children ?? []).indexOf(view as any);
      if (idx > -1) p._children.splice(idx, 1);
    }
    view._parent = null as any;
  }

  private clearActive(containerId: string) {
    const container = this.requireContainer(containerId);
    const activeId = this._active[containerId];
    if (!activeId) return;

    const activeObj = XUI.getObject(activeId) as XUIObject | undefined;

    if (activeObj) {
      // try hide (optional)
      try { activeObj.hide(); } catch { }

      // ✅ remove from DOM so it can't capture input
      try {
        const cdom = container.dom as any;
        const vdom = activeObj.dom as any;
        if (cdom instanceof HTMLElement && vdom instanceof HTMLElement) {
          vdom.remove(); // removes subtree
        }
      } catch { }

      // detach from XUI tree refs
      this.detachFromParent(activeObj);
    }

    // keep container children list consistent
    const idx = (container._children ?? []).findIndex((c: any) => c?._id === activeId);
    if (idx > -1) container._children.splice(idx, 1);

    this._active[containerId] = null;

    // optional: class hook
    try {
      const el = container.dom as any;
      if (el instanceof HTMLElement) el.classList.remove("xvm-open");
    } catch { }
  }



  /* ------------------------------------------------------------------------ */
  /* Core ops                                                                 */
  /* ------------------------------------------------------------------------ */

  clearContainer(opts?: { containerId?: string; region?: RegionName }) {
    const t = this.resolveTarget(opts);
    this.clearActive(t.containerId);
  }

  /**
   * Add (append) a view instance into a container. DOES NOT call show().
   */
  add(view: string | XUIObject | XObjectData, opts?: { containerId?: string; region?: RegionName }): XUIObject {
    const t = this.resolveTarget(opts);
    const container = this.requireContainer(t.containerId);

    let xView: XUIObject;

    if (view instanceof XUIObject) {
      xView = view;
      this.detachFromParent(xView);
    } else if (typeof view === "string") {
      const existing = XUI.getObject(view);
      if (!existing) throw new Error("XVM.add: view not found by ID: " + view);
      xView = existing as XUIObject;
      this.detachFromParent(xView);
    } else {
      xView = XUI.create(view as any) as XUIObject;
    }

    container.append(xView);
    return xView;
  }

  remove(viewId: string) {
    if (!viewId) return;

    Object.keys(this._history).forEach((cid) => {
      const h = this._history[cid] ?? [];
      const idx = h.findIndex((v) => v?._id === viewId);
      if (idx > -1) h.splice(idx, 1);
    });

    Object.keys(this._active).forEach((cid) => {
      if (this._active[cid] === viewId) this.clearActive(cid);
    });

    XUI.remove(viewId);
    this.log("Removed view:", viewId);
  }

  getActiveViewId(opts?: { containerId?: string; region?: RegionName }): string | null {
    const t = this.resolveTarget(opts);
    return this._active[t.containerId] ?? null;
  }

  /**
   * Resolve a view by ID:
   * 1) if exists in history -> return it (and remove it from history to avoid duplicates)
   * 2) if exists in XUI -> return it
   * 3) if exists in raw registry -> create it (if allowed) and return
   * 4) if exists in factory registry -> create it (if allowed) and return
   */
  private async resolveViewByIdAsync(
    viewId: string,
    opts: ShowOptions,
    containerId: string,
    route?: XVMRouteSpec,
    params?: any,
    region?: string
  ): Promise<XUIObject> {
    const hist = this.ensureHistory(containerId);

    const histIdx = hist.findIndex((v) => v?._id === viewId);
    if (histIdx > -1) {
      const v = hist[histIdx];
      hist.splice(histIdx, 1);
      return v;
    }

    const fromXUI = XUI.getObject(viewId) as XUIObject | undefined;
    if (fromXUI) return fromXUI;

    if (opts.allowCreateFromRaw !== false && this._rawViews[viewId]) {
      return XUI.create(this._rawViews[viewId] as any) as XUIObject;
    }

    if (opts.allowCreateFromFactory !== false && this._factories[viewId]) {
      const data = await this._factories[viewId]({
        _id: viewId,
        _container_id: containerId,
        _region: region,
        _params: params,
        _route: route,
      });

      const normalized: XObjectData = {
        _type: (data as any)._type ?? "view",
        _id: (data as any)._id ?? viewId,
        ...(data as any),
      };

      return XUI.create(normalized as any) as XUIObject;
    }

    throw new Error("XVM: view not found: " + viewId);
  }

  private stackInternal(
    view: XUIObject,
    opts?: { containerId?: string; region?: RegionName },
    cfg?: { pushCurrent?: boolean }
  ) {
    const t = this.resolveTarget(opts);
    const policy = this.regionPolicy(t.region);
    const containerId = t.containerId;

    const pushCurrent = cfg?.pushCurrent !== false;
    const currentId = this._active[containerId];
    const hist = this.ensureHistory(containerId);

    if (pushCurrent && policy.history && currentId && currentId !== view._id) {
      const curObj = XUI.getObject(currentId) as XUIObject | undefined;
      if (curObj) hist.push(curObj);
      this.log("Pushed to history:", currentId, "container:", containerId);
    }

    this.clearActive(containerId);

    const target = this.add(view, { containerId });
    target.show(); // ONLY place that shows
    try {
      const el = this.requireContainer(containerId).dom as any;
      if (el instanceof HTMLElement) el.classList.add("xvm-open");
    } catch { }


    this._active[containerId] = target._id ?? null;
  }

  stack(view: XUIObject, opts?: { containerId?: string; region?: RegionName }) {
    this.stackInternal(view, opts, { pushCurrent: true });
  }

  /**
   * Show by viewId OR routeId. DOES NOT touch URL.
   */
  async show(to: string, opts: ShowOptions = {}) {
    if (!to) throw new Error("XVM.show: No target");

    const id = to.startsWith("#") ? to.slice(1) : to;
    const route = this._routes[id];
    const viewId = route?._view_id ?? id;

    const region = (opts.region ?? route?._region) as any;
    const containerId = (opts.containerId ?? route?._container_id) as any;

    const t = this.resolveTarget({ containerId, region });
    const view = await this.resolveViewByIdAsync(viewId, opts, t.containerId, route, (opts as any)._params, t.region);

    this.stackInternal(view, { containerId: t.containerId, region: t.region }, { pushCurrent: true });
  }

  close(opts: CloseOptions = {}) {
    const t = this.resolveTarget({ containerId: opts.containerId, region: opts.region });
    this.clearActive(t.containerId);
    if (opts.clearHistory) this._history[t.containerId] = [];
  }

  /**
   * Navigate (show + updates URL hash).
   * Hash is updated only if region policy allows it (hashSync=true).
   */
  async navigate(to: string, opts: NavigateOptions = {}) {
    if (!to) return;

    const id = to.startsWith("#") ? to.slice(1) : to;
    if (!id) return;

    const route = this._routes[id];
    const region = (opts.region ?? route?._region) as any;
    const containerId = (opts.containerId ?? route?._container_id) as any;

    const t = this.resolveTarget({ containerId, region });
    const policy = this.regionPolicy(t.region);

    await this.show(route ? route._id : id, {
      containerId: t.containerId,
      region: t.region,
      allowCreateFromRaw: true,
      allowCreateFromFactory: true,
      // pass params through via a private field (no type explosion)
      ...(route ? { _params: (opts as any)._params } : {}),
    } as any);

    if (!opts.silent && policy.hashSync) {
      _xd._o["ignore-hash-change"] = true;

      const nextHash = "#" + (route ? route._id : id);

      if (opts.replace) window.location.replace(nextHash);
      else window.location.hash = nextHash.replace("#", "");

      setTimeout(() => {
        _xd._o["ignore-hash-change"] = false;
      }, 0);
    }
  }

  back(opts?: { containerId?: string; region?: RegionName; syncHash?: boolean; ifEmptyClose?: boolean }) {
    const t = this.resolveTarget(opts);
    const policy = this.regionPolicy(t.region);

    if (!policy.history) return;

    const containerId = t.containerId;
    const hist = this.ensureHistory(containerId);

    if (!hist.length) {
      if (opts?.ifEmptyClose) this.close({ containerId, region: t.region });
      return;
    }

    const prev = hist.pop();
    if (!prev) return;

    this.stackInternal(prev, { containerId, region: t.region }, { pushCurrent: false });

    if (opts?.syncHash && policy.hashSync && prev._id) {
      // sync hash to view id (not route) - keep existing behavior
      this.navigate("#" + prev._id, { region: t.region, replace: true } as any);
    }
  }

  initRouter(opts?: { containerId?: string; region?: RegionName; fallbackViewId?: string }) {
    const t = this.resolveTarget(opts);
    const policy = this.regionPolicy(t.region);

    if (!policy.hashSync) {
      this.log("initRouter skipped: region has hashSync=false", t.region);
      return;
    }

    const fallbackViewId = opts?.fallbackViewId;

    const runHash = async () => {
      if (_xd._o["ignore-hash-change"]) return;

      const id = (window.location.hash || "").replace("#", "");
      if (!id) {
        if (fallbackViewId) {
          try {
            await this.navigate("#" + fallbackViewId, { containerId: t.containerId, region: t.region, replace: true } as any);
          } catch (e) {
            _xlog.error(e);
          }
        }
        return;
      }

      try {
        await this.show(id, { containerId: t.containerId, region: t.region });
      } catch (e) {
        _xlog.error(e);
        if (fallbackViewId) {
          try {
            await this.navigate("#" + fallbackViewId, { containerId: t.containerId, region: t.region, replace: true } as any);
          } catch (err) {
            _xlog.error(err);
          }
        }
      }
    };

    void runHash();
    window.addEventListener("hashchange", () => void runHash());

    this.log("Router initialized for container:", t.containerId, "region:", t.region);
  }

  /* ------------------------------------------------------------------------ */
  /* App Manifest loader                                                      */
  /* ------------------------------------------------------------------------ */

  /**
   * Load an app manifest:
   * - optional: create player via XUI.createPlayer
   * - create + register containers
   * - register regions
   * - register views (raw + factories)
   * - register routes
   * - init router (optional)
   * - navigate to start (optional)
   */
  async loadApp(app: XVMApp) {
    if (!app) throw new Error("XVM.load: app is required");

    // 1) optional player
    if (app._player) {
      const pid = app._player._id ?? "xplayer";
      XUI.createPlayer(
        pid,
        app._player.class,
        app._player._parent_element,
        app._player._set_as_main_player !== false
      );

      // optional style injection (rare but useful)
      if (app._player.style) {
        const el = document.getElementById(pid);
        if (el) (el as HTMLElement).setAttribute("style", app._player.style);
      }
    }

    // 1.5) shell (static layout)
    // after player creation block
    // 1.5) shell (static layout)
    if (Array.isArray((app as any)._shell) || typeof (app as any)._shell === "function" || (app as any)._shell) {
      const shell = typeof (app as any)._shell === "function"
        ? await (app as any)._shell()
        : (app as any)._shell;

      if (shell) XUI.add(shell as any);
    }



    // 2) containers (prefer existing containers from shell / XUI)
    if (Array.isArray(app._containers) && app._containers.length) {
      for (const c of app._containers) {
        if (!c?._id) throw new Error("XVM.loadApp: container missing _id");

        // already registered in XVM?
        if (this.getContainer(c._id)) continue;

        // exists in XUI already? (e.g. defined inside shell)
        const fromXUI = XUI.getObject(c._id) as any;
        if (fromXUI) {
          this.addContainer(fromXUI);
          continue;
        }

        // otherwise create it
        const data: XObjectData = {
          _type: "view",
          _id: c._id,
          class: c.class,
          style: c.style,
          _parent_element: c._parent_element,
        } as any;

        const obj = XUI.add(data as any) as any;
        this.addContainer(obj);
      }
    }



    // 3) regions
    if (Array.isArray(app._regions) && app._regions.length) {
      for (const r of app._regions) {
        if (!r?._id) throw new Error("XVM.load: region missing _id");
        if (!r?._container_id) throw new Error("XVM.load: region missing _container_id");
        this.registerRegion(r._id, {
          containerId: r._container_id,
          history: r._history ?? true,
          hashSync: r._hash_sync ?? (r._id === "main"),
        });
      }
    }

    // 4) views registry
    if (app._views) {
      for (const [id, v] of Object.entries(app._views)) {
        if (typeof v === "function") this.registerViewFactory(id, v as XVMViewFactory);
        else this.registerRawView({ _id: id, ...(v as any) } as any);
      }
    }

    // 5) routes
    if (Array.isArray(app._routes) && app._routes.length) {
      for (const r of app._routes) this.registerRoute(r);
    }

    // 6) router init (optional)
    if (app._router) {
      const region = app._router._region ?? "main";
      const cfg = this._regions[region];
      if (cfg?.containerId) {
        this.initRouter({
          region,
          containerId: cfg.containerId,
          fallbackViewId: app._router._fallback_view_id,
        });
      }
    }

    // 7) start (optional)
    if (app._start) {
      const startTo = app._start._route_id ?? app._start._view_id;
      if (startTo) {
        await this.navigate(startTo, {
          region: (app._start._region as any) ?? undefined,
          containerId: (app._start._container_id as any) ?? undefined,
          replace: true,
          silent: false,
          // pass params through
          ...(app._start._params ? ({ _params: app._start._params } as any) : {}),
        } as any);
      }
    }

    _xem.fire(this._event_app_loaded, app);
    this.log("App loaded");
    return true;
  }


  /**
   * Top-level app loader.
   * @param app 
   * @returns 
   */
  async app(app: XVMApp) {
    return this.loadApp(app);
  }


  /* ------------------------------------------------------------------------ */
  /* Interpreter ops (underscore methods)                                     */
  /* ------------------------------------------------------------------------ */

  async _load_app(cmd: any) {
    const app = XParams.json(cmd, "_app", "app") as any;
    if (!app) throw new Error("xvm load_app: missing _app");
    return this.loadApp(app);
  }

  async _show(cmd: any) {
    const viewId = XParams.str(cmd, "_id", "viewId") || "";
    const region = XParams.str(cmd, "_region") as any;
    const containerId = XParams.str(cmd, "_container_id") as any;
    const allowCreateFromRaw = XParams.bool(cmd, "_allow_create_from_raw", true) as any;

    if (!viewId) throw new Error("xvm show: missing viewId");
    return this.show(viewId, { region, containerId, allowCreateFromRaw });
  }

  async _navigate(cmd: any) {
    const to = XParams.str(cmd, "_to", "to", "_id", "id", 0) || "";
    const region = XParams.str(cmd, "_region", "region", 1) as any;
    const replace = XParams.bool(cmd, "_replace", false);
    const silent = XParams.bool(cmd, "_silent", false);
    const containerId = XParams.str(cmd, "_container_id", "container_id", "_containerId", "containerId", 4) as any;

    // optional params payload
    const params = XParams.json(cmd, "_params", "params") as any;

    if (!to) throw new Error("xvm navigate: missing _to/_id");
    return this.navigate(to, { region, replace, silent, containerId, ...(params ? ({ _params: params } as any) : {}) } as any);
  }

  async _back(cmd: any) {
    const region = XParams.str(cmd, "_region", "region", 0) as any;
    const containerId = XParams.str(cmd, "_container_id", "container_id", "_containerId", "containerId") as any;
    const syncHash = XParams.bool(cmd, "_sync_hash", false);
    const ifEmptyClose = XParams.bool(cmd, "_if_empty_close", true);
    return this.back({ region, containerId, syncHash, ifEmptyClose });
  }

  async _close(cmd: any) {
    const region = (XParams.str(cmd, "_region", "region") as any) ?? "modal";
    const containerId = XParams.str(cmd, "_container_id", "container_id", "_containerId", "containerId") as any;
    const clearHistory = XParams.bool(cmd, "_clear_history", false);
    return this.close({ region, containerId, clearHistory });
  }

  async _help(cmd: any) {
    const op = XParams.str(cmd, "_op", "op") || undefined;
    return this.help(op);
  }


  help(op?: string) {
    const ops: Record<string, any> = {
      load_app: {
        cli: `xvm load_app _app:{...}`,
        params: ["_app (required)"],
        note: "Loads an app manifest: creates containers/regions, registers views/routes, optional router/start."
      },
      show: {
        cli: `xvm show _id:"view1" _region:"main" _container_id:"c1" _allow_create_from_raw:true`,
        params: ["_id (routeId or viewId, required)", "_region", "_container_id", "_allow_create_from_raw"],
        note: "Stacks into region container. Does not touch URL hash."
      },
      navigate: {
        cli: `xvm navigate _to:"route-or-view" _region:"main" _replace:false _silent:false _container_id:"c1" _params:{...}`,
        params: ["_to (or _id)", "_region", "_replace", "_silent", "_container_id", "_params"],
        note: "Stacks and updates hash only if region hashSync=true and _silent=false."
      },
      back: {
        cli: `xvm back _region:"modal" _sync_hash:false _if_empty_close:true _container_id:"c1"`,
        params: ["_region", "_sync_hash", "_if_empty_close", "_container_id"],
        note: "Pops history and shows previous. Optionally syncs hash."
      },
      close: {
        cli: `xvm close _region:"modal" _clear_history:false _container_id:"c1"`,
        params: ["_region (default modal)", "_clear_history", "_container_id"],
        note: "Closes the active view in region (implementation-defined)."
      }
    };

    if (op) return ops[op] ?? { error: `Unknown op '${op}'`, available: Object.keys(ops) };

    return {
      module: this._name,
      usage: [`xvm help`, `xvm help _op:"navigate"`],
      available: Object.keys(ops),
      note: "snake_case params are canonical. Read via XParams."
    };
  }
}

/* -------------------------------------------------------------------------- */
/* Public singleton                                                           */
/* -------------------------------------------------------------------------- */

export const XVM = new _XVM();
export const _xvm = XVM;
export default XVM;
