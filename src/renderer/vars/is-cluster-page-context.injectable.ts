/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { createStoresAndApisInjectionToken } from "../../common/vars/create-stores-apis.token";
import { getClusterIdFromHost } from "../utils";

const createStoresAndApisInjectable = getInjectable({
  id: "create-stores-and-apis",
  instantiate: () => Boolean(getClusterIdFromHost(window.location.host)),
  injectionToken: createStoresAndApisInjectionToken,
});

export default createStoresAndApisInjectable;
