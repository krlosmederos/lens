/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import addClusterRoleDialogStateInjectable from "./state.injectable";

const openAddClusterRoleDialogInjectable = getInjectable({
  instantiate: (di) => {
    const state = di.inject(addClusterRoleDialogStateInjectable);

    return () => {
      state.set(true);
    };
  },
  lifecycle: lifecycleEnum.singleton,
});

export default openAddClusterRoleDialogInjectable;
