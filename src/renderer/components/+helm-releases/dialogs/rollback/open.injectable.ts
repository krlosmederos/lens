/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { HelmRelease } from "../../../../../common/k8s-api/endpoints/helm-releases.api";
import helmReleaseRollbackDialogStateInjectable from "./state.injectable";

const openHelmReleaseRollbackDialogInjectable = getInjectable({
  instantiate: (di) => {
    const state = di.inject(helmReleaseRollbackDialogStateInjectable);

    return (release: HelmRelease) => {
      state.release = release;
    };
  },
  lifecycle: lifecycleEnum.singleton,
});

export default openHelmReleaseRollbackDialogInjectable;
