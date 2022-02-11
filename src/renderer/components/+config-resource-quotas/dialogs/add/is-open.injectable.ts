/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { computed } from "mobx";
import addQuotaDialogStateInjectable from "./state.injectable";

const isAddQuotaDialogOpenInjectable = getInjectable({
  instantiate: (di) => {
    const state = di.inject(addQuotaDialogStateInjectable);

    return computed(() => state.isOpen);
  },
  lifecycle: lifecycleEnum.singleton,
});

export default isAddQuotaDialogOpenInjectable;
