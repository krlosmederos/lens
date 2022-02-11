/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import addSecretDialogStateInjectable from "./state.injectable";

const openAddSecretDialogInjectable = getInjectable({
  instantiate: (di) => {
    const state = di.inject(addSecretDialogStateInjectable);

    return () => {
      state.isOpen = true;
    };
  },
  lifecycle: lifecycleEnum.singleton,
});

export default openAddSecretDialogInjectable;
