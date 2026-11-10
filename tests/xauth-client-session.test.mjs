import assert from "node:assert/strict";
import { register } from "node:module";

register("./ignore-css-loader.mjs", import.meta.url);

function createStorage() {
  const values = new Map();
  return {
    get length() {
      return values.size;
    },
    key(index) {
      return Array.from(values.keys())[index] ?? null;
    },
    getItem(key) {
      return values.has(String(key)) ? values.get(String(key)) : null;
    },
    setItem(key, value) {
      values.set(String(key), String(value));
    },
    removeItem(key) {
      values.delete(String(key));
    },
    clear() {
      values.clear();
    }
  };
}

const storage = createStorage();
globalThis.window = {
  localStorage: storage,
  sessionStorage: storage
};
globalThis.localStorage = storage;
globalThis.sessionStorage = storage;

const ui = await import("../dist/xpell-ui.es.js");
const {
  _x,
  _xd,
  XAuth,
  XModule,
  AUTH_SESSION_KEY,
  AUTH_XD_KEYS
} = ui;

const serverSession = {
  _authenticated: true,
  _auth_type: "jwt",
  _token: "header.payload.signature",
  _user_id: "dev-user",
  _account_id: "dev-account",
  _clearance_level: 100,
  _user: {
    _id: "dev-user",
    email: "admin@local.dev",
    _clearance_level: 100
  },
  _account: {
    _id: "dev-account"
  },
  _issued_at: 1000,
  _expires_at: 4600
};

class FakeXDBClientModule extends XModule {
  constructor() {
    super({ _name: "xdb-client" });
    this.values = new Map();
  }

  async _get_object(xcmd) {
    const key = xcmd?._params?.key ?? xcmd?._params?._key;
    return {
      _ok: true,
      _result: {
        value: this.values.get(key) ?? null
      }
    };
  }

  async _save_object(xcmd) {
    const key = xcmd?._params?.key ?? xcmd?._params?._key;
    const value = xcmd?._params?.value ?? xcmd?._params?._value;
    this.values.set(key, value);
    return {
      _ok: true,
      _result: {
        saved: true
      }
    };
  }

  async _remove(xcmd) {
    const key = xcmd?._params?.key ?? xcmd?._params?._key;
    this.values.delete(key);
    return {
      _ok: true,
      _result: {
        removed: true
      }
    };
  }
}

class FakeXVMModule extends XModule {
  constructor() {
    super({ _name: "xvm" });
    this.calls = [];
  }

  async _call_server(xcmd) {
    const cmd = xcmd?._params?._cmd;
    this.calls.push(cmd);
    return {
      _ok: true,
      _result: {
        _ok: true,
        _authenticated: true,
        _token: serverSession._token,
        _user: serverSession._user,
        _account: serverSession._account,
        _session: {
          ...serverSession
        }
      }
    };
  }
}

const xdb = new FakeXDBClientModule();
const xvm = new FakeXVMModule();
await _x.loadModuleAsync(xdb);
await _x.loadModuleAsync(xvm);
await _x.loadModuleAsync(XAuth);

const login = await _x.execute({
  _module: "auth-client",
  _op: "login-with-credential",
  _params: {
    _provider: "xauth",
    _credential: "admin",
    _server_module: "xauth",
    _server_op: "login",
    _credential_param: "password"
  }
});

assert.equal(login._ok, true);
assert.equal(login._authenticated, true);
assert.equal(login._session._authenticated, true);
assert.equal(login._session._provider, "xauth");
assert.equal(login._session._token, serverSession._token);
assert.equal(login._session._user_id, "dev-user");
assert.equal(login._session._account_id, "dev-account");
assert.equal(login._session._clearance_level, 100);
assert.equal(login._session._auth_type, "jwt");
assert.equal(login._session._expires_at, 4600);
assert.deepEqual(xdb.values.get(AUTH_SESSION_KEY), login._session);
assert.deepEqual(_xd.get(AUTH_XD_KEYS.SESSION), login._session);
assert.deepEqual(_xd.get(AUTH_XD_KEYS.USER), serverSession._user);
assert.deepEqual(_xd.get(AUTH_XD_KEYS.ACCOUNT), serverSession._account);
assert.equal(_xd.get(AUTH_XD_KEYS.TOKEN), serverSession._token);
assert.equal(_xd.get(AUTH_XD_KEYS.PROVIDER), "xauth");
assert.deepEqual(xvm.calls[0], {
  _module: "xauth",
  _op: "login",
  _params: {
    password: "admin"
  }
});

const authState = await _x.execute({
  _module: "auth-client",
  _op: "is-authenticated"
});
assert.equal(authState._ok, true);
assert.equal(authState._authenticated, true);

const logout = await _x.execute({
  _module: "auth-client",
  _op: "logout"
});
assert.equal(logout._ok, true);
assert.equal(xdb.values.has(AUTH_SESSION_KEY), false);
assert.equal(_xd.get(AUTH_XD_KEYS.SESSION), null);
assert.equal(_xd.get(AUTH_XD_KEYS.USER), null);
assert.equal(_xd.get(AUTH_XD_KEYS.ACCOUNT), null);
assert.equal(_xd.get(AUTH_XD_KEYS.TOKEN), null);
assert.equal(_xd.get(AUTH_XD_KEYS.PROVIDER), null);

console.log("xauth auth-client session tests passed");
