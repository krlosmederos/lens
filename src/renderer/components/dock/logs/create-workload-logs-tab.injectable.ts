/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import type { PodStore } from "../../+workloads-pods/store";
import podStoreInjectable from "../../+workloads-pods/store.injectable";
import type { WorkloadKubeObject } from "../../../../common/k8s-api/workload-kube-object";
import type { TabId } from "../dock/store";
import createLogsTabInjectable, { CreateLogsTabData } from "./create-logs-tab.injectable";

export interface WorkloadLogsTabData {
  workload: WorkloadKubeObject;
}

interface Dependencies {
  createLogsTab: (title: string, data: CreateLogsTabData) => TabId;
  podStore: PodStore;
}

const createWorkloadLogsTab = ({
  createLogsTab,
  podStore,
}: Dependencies) => ({ workload }: WorkloadLogsTabData): TabId | undefined => {
  const [selectedPod] = podStore.getPodsByOwnerId(workload.getId());

  if (!selectedPod) {
    return undefined;
  }

  return createLogsTab(`${workload.kind} ${selectedPod.getName()}`, {
    selectedContainer: selectedPod.getAllContainers()[0].name,
    selectedPodId: selectedPod.getId(),
    namespace: selectedPod.getNs(),
    owner: {
      kind: workload.kind,
      name: workload.getName(),
      uid: workload.getId(),
    },
  });
};

const createWorkloadLogsTabInjectable = getInjectable({
  id: "create-workload-logs-tab",

  instantiate: (di) => createWorkloadLogsTab({
    createLogsTab: di.inject(createLogsTabInjectable),
    podStore: di.inject(podStoreInjectable),
  }),
});

export default createWorkloadLogsTabInjectable;
