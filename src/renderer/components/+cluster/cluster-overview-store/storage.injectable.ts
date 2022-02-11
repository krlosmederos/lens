/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import createStorageInjectable, { type StorageLayer } from "../../../utils/storage/create.injectable";
import { ClusterOverviewStorageState, MetricNodeRole, MetricType } from "./cluster-overview-store";

let storage: StorageLayer<ClusterOverviewStorageState>;

const clusterOverviewStorageInjectable = getInjectable({
  setup: async (di) => {
    const createStorage = await di.inject(createStorageInjectable);

    storage = createStorage("cluster_overview", {
      metricType: MetricType.CPU,
      metricNodeRole: MetricNodeRole.WORKER,
    });
  },
  instantiate: () => storage,
  id: "cluster-overview-storage",
});

export default clusterOverviewStorageInjectable;
