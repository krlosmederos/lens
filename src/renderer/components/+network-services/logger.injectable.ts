/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import childLoggerInjectable from "../../../common/logger/create-child-logger.injectable";

const servicesLoggerInjectable = getInjectable({
  instantiate: (di) => di.inject(childLoggerInjectable, {
    prefix: "NETWORK/SERVICES",
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default servicesLoggerInjectable;
