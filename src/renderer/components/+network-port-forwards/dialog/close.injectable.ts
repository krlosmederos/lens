/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import portForwardDialogStateInjectable from "./state.injectable";

const closePortForwardDialogInjectable = getInjectable({
  instantiate: (di) => {
    const state = di.inject(portForwardDialogStateInjectable);

    return () => {
      state.set(undefined);
    };
  },
  lifecycle: lifecycleEnum.singleton,
});

export default closePortForwardDialogInjectable;
