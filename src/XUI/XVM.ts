/**
 * XVM - Xpell View Manager
 *
 * New multi-view manager for XUI.
 * Manages containers, stacked views, and history per container.
 *
 * Backward-compatible with existing apps:
 * - Old XViewManager stays as-is (deprecated)
 * - New API: XVM / _xvm
 */

import {
  XModule,
  _xlog,
  _xd,
  _xem,
  type XObjectData
} from "xpell-core";
import { XUI } from "./XUI";
import { XUIObject } from "./XUIObject";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type XViewContainer = XUIObject;

type XViewContainerList = Record<string, XViewContainer>;

// History per container: stack (array) of views
type XViewHistory = Record<string, XUIObject[]>;

/* -------------------------------------------------------------------------- */
/*  Events                                                                     */
/* -------------------------------------------------------------------------- */

export const XVMEvents = {
  _container_added: "container-added"
} as const;

/* -------------------------------------------------------------------------- */
/*  XVM Implementation                                                         */
/* -------------------------------------------------------------------------- */

class _XVM extends XModule {
  static _module_name = "view-manager";

  _event_container_added = XVMEvents._container_added;

  _containers: XViewContainerList = {};
  _views_history: XViewHistory = {};
  _raw_views: Record<string, XObjectData> = {};
  _debug = false;

  constructor() {
    super({ _name: _XVM._module_name });
  }

  log(...args: any[]) {
    if (!this._debug) return;
    _xlog.log("XVM", ...args);
  }

  /* ------------------------------------------------------------------------ */
  /*  Containers                                                              */
  /* ------------------------------------------------------------------------ */

  /**
   * Register an XUI container object with the manager.
   * If a plain view config is passed, it will be created via XUI.add.
   */
  addContainer(container: XViewContainer | XObjectData, create = true) {
    // If it's not an XUIObject yet, create it
    if (!(container instanceof XUIObject)) {
      if (!create) {
        throw new Error("Container not found and create=false");
      }
      container = XUI.add(container as any) as XUIObject;
    }

    if (!container._id) {
      throw new Error("Container must have an _id");
    }

    if (!this._containers[container._id]) {
      this._containers[container._id] = container;
      this.log("Container", container._id, "added to view manager");
      _xem.fire(this._event_container_added, container);
    }
  }

  /**
   * Get a container by ID, optionally creating it if missing.
   */
  getContainer(containerId: string, create = false): XViewContainer | undefined {
    if (!this._containers[containerId] && create) {
      const view: XObjectData = {
        _id: containerId,
        _type: "view",
        class: "aime-view-container"
      };
      this.addContainer(view, true);
    }
    return this._containers[containerId];
  }

  /**
   * Returns the first registered container, if any.
   */
  getDefaultContainer(): XViewContainer | undefined {
    const keys = Object.keys(this._containers);
    return keys.length > 0 ? this._containers[keys[0]] : undefined;
  }

  /**
   * Clear all views from a container.
   * - remove=false: just hide children
   * - remove=true: remove container (and its children) from XUI
   * - clearHistory=true: clear stored view history for this container
   */
  clearContainer(
    containerId?: string,
    remove = false,
    clearHistory = false
  ) {
    const container =
      containerId != null
        ? this._containers[containerId]
        : this.getDefaultContainer();

    if (!container) {
      throw new Error("No container found to clear");
    }

    this.log(
      "Clearing container",
      container._id,
      "removeChildren:",
      remove,
      "clearHistory:",
      clearHistory
    );

    if (!remove) {
      container._children.forEach((view) => {
        if (view instanceof XUIObject) {
          view.hide();
        }
      });
    } else {
      XUI.remove(container._id);
    }

    if (clearHistory) {
      this.clearContainerHistory(container._id);
    }
  }

  clearContainerHistory(containerId?: string) {
    const container =
      containerId != null
        ? this._containers[containerId]
        : this.getDefaultContainer();

    if (!container) {
      throw new Error("No container found to clear history");
    }

    if (this._views_history[container._id]) {
      this.log("Clearing view history for container", container._id);
      this._views_history[container._id] = [];
    }
  }

  /* ------------------------------------------------------------------------ */
  /*  Raw views registration                                                  */
  /* ------------------------------------------------------------------------ */

  /**
   * Register a raw (JSON) view configuration by ID.
   * It can later be instantiated and shown via showById/viewId.
   */
  registerRawView(view: XObjectData, containerId?: string) {
    let container = this.getDefaultContainer();
    if (containerId) container = this.getContainer(containerId);

    if (!container) {
      throw new Error("No container found");
    }

    if (!view || !view._id) {
      throw new Error("No view ID provided for raw view");
    }

    this.log("Registering raw view:", view._id, "in container:", container._id);
    this._raw_views[view._id as string] = view;
  }

  /* ------------------------------------------------------------------------ */
  /*  Add / remove / hide                                                     */
  /* ------------------------------------------------------------------------ */

  /**
   * Add a view to a container.
   * - view can be:
   *    - XUIObject instance
   *    - string (viewId)
   *    - raw XObjectData
   */
  add(view: string | XUIObject | XObjectData, containerId?: string) {
    let container = this.getDefaultContainer();
    if (containerId) container = this.getContainer(containerId, true);

    if (!container) {
      throw new Error("No container found");
    }

    let xView: XUIObject;

    if (view instanceof XUIObject) {
      // detach from old parent if needed
      if (view._parent) {
        const idx = view._parent._children.indexOf(view);
        if (idx > -1) view._parent._children.splice(idx, 1);
        this.log(
          "Removing view from parent",
          view._parent._id,
          "before adding to container",
          container._id
        );
      }
      xView = view;
    } else if (typeof view === "string") {
      const existing = XUI.getObject(view);
      if (!existing) {
        throw new Error("View not found by ID: " + view);
      }
      xView = existing as XUIObject;
    } else {
      // raw view config
      xView = XUI.create(view as any) as XUIObject;
    }

    try {
      this.log("Adding view", xView._id, "to container", container._id);
      container.append(xView);
      xView.show();
    } catch (e) {
      _xlog.error(e);
      throw new Error("Error adding view: " + e);
    }
  }

  /**
   * Remove a view by ID from container + history.
   */
  remove(viewId: string, containerId?: string) {
    let container = this.getDefaultContainer();
    if (containerId) container = this.getContainer(containerId);

    if (!container) {
      throw new Error("No container found");
    }

    XUI.remove(viewId);

    const historyStack = this._views_history[container._id];
    if (historyStack) {
      const index = historyStack.findIndex((v) => v._id === viewId);
      if (index > -1) {
        historyStack.splice(index, 1);
        this.log(
          "View",
          viewId,
          "removed from history for container",
          container._id
        );
      }
    }

    this.log("View", viewId, "removed from container", container._id);

    if (container._children.length === 0) {
      this.log("Container", container._id, "is empty, clearing container");
      this.clearContainer(container._id, true, true);
    }
  }

  hide(viewId: string) {
    XUI.hide(viewId);
  }

  /* ------------------------------------------------------------------------ */
  /*  Active view & history lookup                                            */
  /* ------------------------------------------------------------------------ */

  getActiveViewId(containerId?: string): string | null {
    let container = this.getDefaultContainer();
    if (containerId) container = this.getContainer(containerId);

    if (!container) {
      throw new Error("No container found");
    }

    const children = container._children;
    if (children.length === 0) {
      this.log("No active view in container", container._id);
      return null;
    }

    const activeView = children[children.length - 1] as XUIObject;
    this.log("Active view in container", container._id, "is", activeView._id);
    return activeView._id;
  }

  private ensureHistory(containerId: string): XUIObject[] {
    if (!this._views_history[containerId]) {
      this.log("Creating new view history for container", containerId);
      this._views_history[containerId] = [];
    }
    return this._views_history[containerId];
  }

  getViewFromHistory(
    viewId: string,
    containerId?: string
  ): XUIObject | false {
    let container = this.getDefaultContainer();
    if (containerId) container = this.getContainer(containerId);

    if (!container) {
      throw new Error("No container found");
    }

    const history = this.ensureHistory(container._id);
    this.log("history for container", container._id, ":", history);

    const outView = history.find((view) => view._id === viewId);
    if (!outView) {
      this.log("View not found in history", viewId);
      return false;
    }
    return outView;
  }

  /* ------------------------------------------------------------------------ */
  /*  Show / stack / navigation                                               */
  /* ------------------------------------------------------------------------ */

  /**
   * Show a view by its ID:
   * - If found in history, reuse that instance
   * - Else check XUI object manager
   * - Else check raw_views and create it
   * - Else throw + redirect hash to home-overview-page
   */
  showById(viewId: string, containerId?: string) {
    if (!viewId) throw new Error("No view ID provided");

    let container = this.getDefaultContainer();
    if (containerId) container = this.getContainer(containerId);

    if (!container) {
      throw new Error("No container found");
    }

    this.log("Showing by ID view:", viewId, "in container:", container._id);

    const historyView = this.getViewFromHistory(viewId, containerId);
    if (historyView) {
      this.log("View found in history, stacking view:", historyView._id);
      this.stack(historyView, container._id);
      return;
    }

    const fromXUI = XUI.getObject(viewId) as XUIObject | undefined;
    if (fromXUI) {
      this.log("View found by ID in XUI, stacking:", fromXUI._id);
      this.stack(fromXUI, container._id);
      return;
    }

    const rawView = this._raw_views[viewId];
    if (rawView) {
      this.log("View found in raw views, creating view:", viewId);
      const newView = XUI.create(rawView as any) as XUIObject;
      this.stack(newView, container._id);
      return;
    }

    this.log(
      viewId,
      "View not found by ID, changing hash to home-overview-page"
    );
    window.location.hash = "home-overview-page";
    throw new Error("View not found by ID: " + viewId);
  }

  /**
   * Show a view (instance or ID) in container (stacks it).
   */
  show(view: string | XUIObject, containerId?: string) {
    let container = this.getDefaultContainer();
    if (containerId) container = this.getContainer(containerId);

    if (!container) {
      throw new Error("No container found");
    }

    const viewId = typeof view === "string" ? view : view._id;
    if (!viewId) throw new Error("No view ID provided");

    this.log("Showing view:", viewId, "in container:", container._id);

    let xView: XUIObject;
    if (view instanceof XUIObject) {
      xView = view;
    } else {
      const obj = XUI.getObject(viewId);
      if (!obj) throw new Error("View not found: " + viewId);
      xView = obj as XUIObject;
    }

    this.stack(xView, container._id);
  }

  /**
   * Stack view on top of the current view in the container.
   * Saves previous view in history, clears current container, then shows new one.
   */
  stack(view: XUIObject, containerId?: string) {
    const container = containerId
      ? this.getContainer(containerId, true)
      : this.getDefaultContainer();

    if (!container) throw new Error("No container found");

    const viewId = view._id;
    this.log("Stacking view:", viewId, "in container:", container._id);

    const history = this.ensureHistory(container._id);

    // Save current top view into history (if different)
    const currentView = container._children[container._children.length - 1] as
      | XUIObject
      | undefined;
    if (currentView && currentView._id !== viewId) {
      history.push(currentView);
      this.log(
        "View",
        currentView._id,
        "added to history for container",
        container._id
      );
    }

    // Clear container (hide)
    this.clearContainer(container._id);

    // If exists in history, reuse that instance
    const historyView = history.find((v) => v._id === viewId);
    const targetView = historyView ?? view;

    this.add(targetView, container._id);
    targetView.show();

    // Update URL hash
    _xd._o["ignore-hash-change"] = true;
    window.location.hash = viewId;
  }

  /**
   * Get a view from history without modifying it.
   */
  getFromHistory(
    viewId: string,
    containerId?: string
  ): XUIObject | undefined {
    const container = containerId
      ? this.getContainer(containerId, true)
      : this.getDefaultContainer();

    if (!container) throw new Error("No container found");

    const history = this.ensureHistory(container._id);
    const viewExists = history.find((view) => view._id === viewId);
    if (viewExists) {
      _xlog.log("View found in history", viewId);
      return viewExists;
    }

    _xlog.log("View not found in history", viewId);
    return undefined;
  }

  /**
   * Go back to the previous view in the container.
   */
  back(containerId?: string) {
    const container = containerId
      ? this.getContainer(containerId)
      : this.getDefaultContainer();

    if (!container) throw new Error("No container found");

    const historyStack = this._views_history[container._id];
    if (!historyStack || historyStack.length === 0) return;

    const prevView = historyStack.pop();
    if (!prevView) return;

    this.clearContainer(container._id);
    this.stack(prevView, container._id);
  }

  /**
   * Pop the top view from the container and show the previous one (if any).
   */
  pop(containerId?: string) {
    let container = this.getDefaultContainer();
    if (containerId) container = this.getContainer(containerId);

    if (!container) {
      throw new Error("No container found");
    }

    const view = container._children.pop() as XUIObject | undefined;
    if (view) {
      XUI.remove(view._id);
    }

    if (container._children.length > 0) {
      const topView = container._children[container._children.length - 1] as XUIObject;
      topView.show();
    }
  }
}

/* -------------------------------------------------------------------------- */
/*  Public Singleton (like _x, XUI, etc.)                                     */
/* -------------------------------------------------------------------------- */

export const XVM = new _XVM();
export const _xvm = XVM;
export default XVM;
