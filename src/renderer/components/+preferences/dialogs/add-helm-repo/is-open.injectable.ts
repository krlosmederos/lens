/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { computed } from "mobx";
import addHelmRepoDialogStateInjectable from "./state.injectable";

const isAddHelmRepoDialogOpenInjectable = getInjectable({
  instantiate: (di) => {
    const state = di.inject(addHelmRepoDialogStateInjectable);

    return computed(() => state.isOpen);
  },
  lifecycle: lifecycleEnum.singleton,
});

export default isAddHelmRepoDialogOpenInjectable;
