/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable } from "@ogre-tools/injectable";
import path from "path";
import directoryForIntegrationTestingInjectable from "../../common/paths/integration-testing.injectable";
import { pathNames } from "../../common/ipc/electron/app-path-names";
import { appPathsInjectionToken } from "../../common/ipc/electron/app-paths.token";
import type { AppPaths } from "../../common/ipc/electron/app-paths.token";
import { fromEntries } from "../../common/utils";
import appNameInjectable from "./app-name.injectable";
import getAppPathInjectable from "./get-app-path.injectable";
import setAppPathInjectable from "./set-app-path.injectable";

let appPaths: AppPaths;

const appPathsInjectable = getInjectable({
  setup: async (di) => {
    const directoryForIntegrationTesting = await di.inject(directoryForIntegrationTestingInjectable);
    const setAppPath = await di.inject(setAppPathInjectable);
    const getAppPath = await di.inject(getAppPathInjectable);
    const appName = await di.inject(appNameInjectable);

    if (directoryForIntegrationTesting) {
      // Todo: this kludge is here only until we have a proper place to setup integration testing.
      setAppPath("appData", directoryForIntegrationTesting);
    }

    setAppPath("userData", path.join(getAppPath("appData"), appName));

    appPaths = fromEntries(pathNames.map((name) => [name, getAppPath(name)]));
  },
  instantiate: () => appPaths,
  injectionToken: appPathsInjectionToken,
  id: "app-paths",
});

export default appPathsInjectable;
