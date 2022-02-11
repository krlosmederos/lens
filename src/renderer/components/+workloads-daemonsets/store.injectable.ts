/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import podStoreInjectable from "../+workloads-pods/store.injectable";
import apiManagerInjectable from "../../../common/k8s-api/api-manager.injectable";
import daemonSetApiInjectable from "../../../common/k8s-api/endpoints/daemon-set.api.injectable";
import createStoresAndApisInjectable from "../../vars/is-cluster-page-context.injectable";
import { DaemonSetStore } from "./store";

const daemonSetStoreInjectable = getInjectable({
  id: "daemon-set-store",
  instantiate: (di) => {
    const makeStore = di.inject(createStoresAndApisInjectable);

    if (!makeStore) {
      return undefined;
    }

    const apiManager = di.inject(apiManagerInjectable);
    const api = di.inject(daemonSetApiInjectable);
    const store = new DaemonSetStore({
      podStore: di.inject(podStoreInjectable),
    }, api);

    apiManager.registerStore(store);

    return store;
  },
});

export default daemonSetStoreInjectable;
