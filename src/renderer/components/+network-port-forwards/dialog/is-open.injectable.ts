/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { computed } from "mobx";
import portForwardDialogStateInjectable from "./state.injectable";

const isPortFowardDialogOpenInjectable = getInjectable({
  instantiate: (di) => {
    const state = di.inject(portForwardDialogStateInjectable);

    return computed(() => Boolean(state.get()));
  },
  lifecycle: lifecycleEnum.singleton,
});

export default isPortFowardDialogOpenInjectable;
