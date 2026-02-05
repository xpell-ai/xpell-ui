import { _xd } from "@xpell/core";

export const setWormholeState = (key: string, value: any, source: string) => {
  _xd.set(key, value, { source });
};

export const touchWormholeState = (key: string, source: string) => {
  _xd.touch(key, { source });
};
