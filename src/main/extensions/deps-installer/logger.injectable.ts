/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import childLoggerInjectable from "../../../common/logger/create-child-logger.injectable";

const extensionDependenciesInstallerLoggerInjectable = getInjectable({
  instantiate: (di) => di.inject(childLoggerInjectable, {
    prefix: "EXTENSION-DEPENDENCIES-INSTALLER",
  }),
  id: "extension-dependencies-installer-logger",
});

export default extensionDependenciesInstallerLoggerInjectable;
