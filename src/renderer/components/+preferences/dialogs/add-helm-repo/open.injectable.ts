/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import addHelmRepoDialogStateInjectable from "./state.injectable";

const openAddHelmRepoDialogInjectable = getInjectable({
  instantiate: (di) => {
    const state = di.inject(addHelmRepoDialogStateInjectable);

    return () => {
      state.isOpen = true;
    };
  },
  lifecycle: lifecycleEnum.singleton,
});

export default openAddHelmRepoDialogInjectable;
