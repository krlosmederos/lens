/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import addNamespaceDialogStateInjectable from "./state.injectable";

const openAddNamespaceDialogInjectable = getInjectable({
  instantiate: (di) => {
    const state = di.inject(addNamespaceDialogStateInjectable);

    return () => {
      state.isOpen = true;
    };
  },
  lifecycle: lifecycleEnum.singleton,
});

export default openAddNamespaceDialogInjectable;
