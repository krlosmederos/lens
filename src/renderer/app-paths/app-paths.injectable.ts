/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { AppPaths, appPathsInjectionToken } from "../../common/ipc/electron/app-paths.token";
import getAppPathsInjectable from "../ipc/electron/get-app-paths.injectable";

let syncAppPaths: AppPaths;

const appPathsInjectable = getInjectable({
  setup: async (di) => {
    const getAppPaths = await di.inject(getAppPathsInjectable);

    syncAppPaths = await getAppPaths();
  },
  instantiate: () => syncAppPaths,
  injectionToken: appPathsInjectionToken,
  id: "app-paths",
});

export default appPathsInjectable;
