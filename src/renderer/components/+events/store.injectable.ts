/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import podStoreInjectable from "../+workloads-pods/store.injectable";
import apiManagerInjectable from "../../../common/k8s-api/api-manager.injectable";
import kubeEventApiInjectable from "../../../common/k8s-api/endpoints/kube-event.api.injectable";
import createStoresAndApisInjectable from "../../vars/is-cluster-page-context.injectable";
import { KubeEventStore } from "./store";

const kubeEventStoreInjectable = getInjectable({
  id: "kube-event-store",
  instantiate: (di) => {
    const makeStore = di.inject(createStoresAndApisInjectable);

    if (!makeStore) {
      return undefined;
    }

    const apiManager = di.inject(apiManagerInjectable);
    const api = di.inject(kubeEventApiInjectable);
    const store = new KubeEventStore({
      podStore: di.inject(podStoreInjectable),
    }, api);

    apiManager.registerStore(store);

    return store;
  },
});

export default kubeEventStoreInjectable;
