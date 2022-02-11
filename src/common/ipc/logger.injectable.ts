/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import childLoggerInjectable from "../logger/create-child-logger.injectable";

const ipcLoggerInjectable = getInjectable({
  id: "ipc-logger",
  instantiate: (di) => di.inject(childLoggerInjectable, {
    prefix: "IPC",
  }),
});

export default ipcLoggerInjectable;
