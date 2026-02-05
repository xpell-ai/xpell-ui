import { _xd } from "@xpell/core";
export const setWormholeState = (key, value, source) => {
    _xd.set(key, value, { source });
};
export const touchWormholeState = (key, source) => {
    _xd.touch(key, { source });
};
