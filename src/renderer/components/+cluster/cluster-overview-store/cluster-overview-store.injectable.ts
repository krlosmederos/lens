/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { ClusterOverviewStore } from "./cluster-overview-store";
import apiManagerInjectable from "../../../../common/k8s-api/api-manager.injectable";
import clusterOverviewStorageInjectable from "./storage.injectable";
import clusterApiInjectable from "../../../../common/k8s-api/endpoints/cluster.api.injectable";

const clusterOverviewStoreInjectable = getInjectable({
  instantiate: (di) => {
    const apiManager = di.inject(apiManagerInjectable);
    const api = di.inject(clusterApiInjectable);
    const store = new ClusterOverviewStore({
      storage: di.inject(clusterOverviewStorageInjectable),
    }, api);

    apiManager.registerStore(store);

    return store;
  },
  id: "cluster-overview-store",
});

export default clusterOverviewStoreInjectable;
