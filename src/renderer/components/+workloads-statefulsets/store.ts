/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { makeObservable } from "mobx";
import type { PodStore } from "../+workloads-pods/store";

import { PodStatus, StatefulSet, StatefulSetApi } from "../../../common/k8s-api/endpoints";
import { KubeObjectStore } from "../../../common/k8s-api/kube-object.store";
import { autoBind } from "../../utils";

export interface StatefulSetStoreDependencies {
  readonly podStore: PodStore;
}

export class StatefulSetStore extends KubeObjectStore<StatefulSet, StatefulSetApi> {
  constructor(protected readonly dependencies: StatefulSetStoreDependencies, api: StatefulSetApi) {
    super(api);
    makeObservable(this);
    autoBind(this);
  }

  getChildPods(statefulSet: StatefulSet) {
    return this.dependencies.podStore.getPodsByOwnerId(statefulSet.getId());
  }

  getStatuses(statefulSets: StatefulSet[]) {
    const status = { running: 0, failed: 0, pending: 0 };

    for (const statefulSet of statefulSets) {
      const pods = this.getChildPods(statefulSet);
      const statuses = new Set(pods.map(pod => pod.getStatus()));

      if (statuses.has(PodStatus.FAILED)) {
        status.failed++;
      } else if (statuses.has(PodStatus.PENDING)) {
        status.pending++;
      } else {
        status.running++;
      }
    }

    return status;
  }
}
