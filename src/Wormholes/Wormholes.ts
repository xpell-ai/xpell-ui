/**
 * Wormholes — facade (xpell-ui)
 *
 * Default: Wormholes v2.
 * Optional: legacy v1 when explicitly allowed.
 *
 * Goals:
 * - Single import surface for app code: `import Wormholes from "@xpell/ui"`
 * - Prefer v2 protocol when possible
 * - Allow explicit opt-in fallback to v1 for legacy servers
 */

import type { WormholesClientAPI, WormholesOpenOptions } from "./wh.types";
import WormholesV2 from "./Wormholes.v2";
import WormholesV1, { WormholesV1Adapter } from "./Wormholes.v1";

type WHImplCtor = new () => WormholesClientAPI;

function _isV2Url(url: string): boolean {
  // Keep simple and safe: you can improve later (or remove entirely once you add opts._version)
  return typeof url === "string" && url.includes("/wh/v2");
}

export class WormholesFacade implements WormholesClientAPI {
  private _impl: WormholesClientAPI;

  constructor() {
    this._impl = new WormholesV2();
  }

  private _setImpl(Ctor: WHImplCtor) {
    // close previous impl (best-effort) before swapping
    try {
      this._impl?.close?.();
    } catch {
      // ignore
    }
    this._impl = new Ctor();
  }

  /* -------------------------------------------------------------------------- */
  /* Contract passthrough                                                       */
  /* -------------------------------------------------------------------------- */

  set verbose(v: boolean) {
    this._impl.verbose = v;
  }

  get _ready() {
    return this._impl._ready;
  }

  get _wid() {
    return this._impl._wid;
  }

  get _sid() {
    return this._impl._sid;
  }

  /**
   * Open a wormholes session.
   *
   * Selection rules:
   * - If opts._force_v1 => use v1
   * - Else if url looks like v2 => use v2
   * - Else => v1 only if opts._allow_v1, otherwise throw
   */
  open(opts: WormholesOpenOptions): void {
    const forceV1 = !!opts._force_v1;
    const allowV1 = !!opts._allow_v1;

    const shouldUseV2 = !forceV1 && _isV2Url(opts._url);

    if (shouldUseV2) {
      this._setImpl(WormholesV2);
      this._impl.open(opts);
      return;
    }

    // non-v2 url:
    if (!allowV1 && !forceV1) {
      throw new Error(
        `Wormholes: URL is not v2 and legacy v1 is not allowed. _url=${opts._url}`
      );
    }

    // v1 fallback
    this._setImpl(WormholesV1Adapter);

    // v1 legacy signature: open(url: string)
    // We keep it isolated here so the rest stays typed.
    (this._impl as unknown as { open: (url: string) => void }).open(opts._url);
  }

  close(): void {
    this._impl.close();
  }

  sendSync(payload: any, timeoutMs?: number) {
    return this._impl.sendSync(payload, timeoutMs);
  }

  sendXcmd(xcmd: any, timeoutMs?: number) {
    return this._impl.sendXcmd(xcmd, timeoutMs);
  }

  sendEvt(_name: string, _data?: any, _args?: any[]) {
    return this._impl.sendEvt(_name, _data, _args);
  }

  onOpen(cb: () => void) {
    this._impl.onOpen(cb);
  }
}

const Wormholes = new WormholesFacade();

/**
 * Named + default exports:
 * - default: singleton (common usage)
 * - Wormholes: singleton (explicit)
 * - WormholesFacade: class (advanced usage / testing)
 */
export { Wormholes };
export default Wormholes;
