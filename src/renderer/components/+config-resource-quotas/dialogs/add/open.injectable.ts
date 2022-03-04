/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import addQuotaDialogStateInjectable from "./state.injectable";

const openAddQuotaDialogInjectable = getInjectable({
  instantiate: (di) => {
    const state = di.inject(addQuotaDialogStateInjectable);

    return () => {
      state.isOpen = true;
    };
  },
  lifecycle: lifecycleEnum.singleton,
});

export default openAddQuotaDialogInjectable;
