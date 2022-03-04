/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { observable } from "mobx";

export interface LensProxyPort {
  readonly value: number;
  set: (port: number) => void;
}

const lensProxyPortInjectable = getInjectable({
  id: "lens-proxy-port",
  instantiate: (): LensProxyPort => {
    const state = observable.box<number | undefined>();

    return {
      set: (port) => {
        if (typeof state.get() === "number") {
          throw new Error("Cannot set proxy port more than once");
        }

        state.set(port);
      },
      get value() {
        const res = state.get();

        if (res === undefined) {
          throw new Error("Proxy port has not been set yet");
        }

        return res;
      },
    };
  },
});

export default lensProxyPortInjectable;
