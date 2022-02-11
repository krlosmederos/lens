/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import apiManagerInjectable from "../../../common/k8s-api/api-manager.injectable";
import podApiInjectable from "../../../common/k8s-api/endpoints/pod.api.injectable";
import createStoresAndApisInjectable from "../../vars/is-cluster-page-context.injectable";
import { PodStore } from "./store";

const podStoreInjectable = getInjectable({
  id: "pod-store",
  instantiate: (di) => {
    const makeStore = di.inject(createStoresAndApisInjectable);

    if (!makeStore) {
      return undefined;
    }

    const apiManager = di.inject(apiManagerInjectable);
    const api = di.inject(podApiInjectable);
    const store = new PodStore(api);

    apiManager.registerStore(store);

    return store;
  },
});

export default podStoreInjectable;
